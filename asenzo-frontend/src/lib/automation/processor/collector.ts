import {
  ResearchCollector,
  ResearchCollectionJob,
  CollectedObservation
} from './types';
import {
  PermanentProcessorError,
  TransientProcessorError,
  RateLimitError,
  ProviderTimeoutError
} from './errors';
import {
  isPlaceholderHandle,
  isPlaceholderSourceTarget,
  isValidHandle,
  isValidSourceTarget
} from '../research-request';

/**
 * Native Research Collector
 *
 * Supported Capabilities:
 * 1. Directly retrieved source content: HTTP status, content-length, canonical URL, live accessibility.
 * 2. Retrieved metadata: OpenGraph/HTML <title>, <meta description>, <article:published_time>.
 * 3. Derived inferences: Source content type ('video', 'social_post', 'article'), topic classification.
 *
 * Current Limitations (Require Platform API Integration):
 * - Live engagement metrics (views, likes, shares, comments, retention curves).
 * - Creator subscriber / follower counts.
 * - Authenticated platform posts behind login walls (Instagram, LinkedIn, X, TikTok private feeds).
 * - Live topic discovery search aggregations across closed platforms.
 */
export class NativeResearchCollector implements ResearchCollector {
  async collect(job: ResearchCollectionJob): Promise<CollectedObservation[]> {
    const timeoutMs = Math.min(Math.max(job.timeoutMs || 15000, 1000), 60000);

    // Validate creator research inputs
    if (job.assignmentType === 'creator_research') {
      const handle = job.creator?.trim();
      const target = job.sourceTarget?.trim();

      if (!handle && !target) {
        throw new PermanentProcessorError('Creator research assignment requires either a verified handle or source target URL.', 400);
      }

      if (isPlaceholderHandle(handle) || isPlaceholderSourceTarget(target)) {
        throw new PermanentProcessorError('Creator research target contains prohibited placeholder "verified_handle".', 400);
      }

      if (handle && !isValidHandle(handle)) {
        throw new PermanentProcessorError(`Invalid creator handle format: "${handle}".`, 400);
      }

      if (target && !isValidSourceTarget(target)) {
        throw new PermanentProcessorError(`Invalid source URL: "${target}" (must be http/https).`, 400);
      }

      // If target URL is provided, probe and extract real source metadata
      if (target) {
        return await this.collectFromUrl(job, target, timeoutMs);
      }

      // If handle is provided without an explicit target URL, use canonical platform profile URL
      const cleanHandle = handle!.replace(/^@/, '');
      const inferredTarget = `https://www.${(job.platform || 'instagram').toLowerCase()}.com/${cleanHandle}/`;
      return await this.collectFromUrl(job, inferredTarget, timeoutMs);
    }

    // Topic research
    if (job.assignmentType === 'topic_research') {
      if (!job.topic || !job.topic.trim()) {
        throw new PermanentProcessorError('Topic research assignment requires a non-empty topic.', 400);
      }

      return this.collectTopicBenchmark(job);
    }

    throw new PermanentProcessorError(`Unsupported assignment type: "${job.assignmentType}".`, 400);
  }

  private async collectFromUrl(
    job: ResearchCollectionJob,
    targetUrl: string,
    timeoutMs: number
  ): Promise<CollectedObservation[]> {
    let response: Response;

    try {
      response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 ASENZO-Collector/1.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5'
        },
        signal: AbortSignal.timeout(timeoutMs)
      });
    } catch (err: unknown) {
      if (err instanceof Error && (err.name === 'AbortError' || err.name === 'TimeoutError')) {
        throw new ProviderTimeoutError(`Source request to "${targetUrl}" timed out after ${timeoutMs}ms.`);
      }
      throw new TransientProcessorError(`Network error reaching source target "${targetUrl}": ${err instanceof Error ? err.message : String(err)}`);
    }

    if (response.status === 429) {
      const retryHeader = response.headers.get('retry-after');
      let retryMs = 2000;
      if (retryHeader) {
        const parsedSec = parseInt(retryHeader, 10);
        if (!isNaN(parsedSec)) {
          retryMs = parsedSec * 1000;
        } else {
          const parsedDate = Date.parse(retryHeader);
          if (!isNaN(parsedDate)) {
            retryMs = Math.max(1000, parsedDate - Date.now());
          }
        }
      }
      // Bound retryMs to avoid unbounded sleep (max 10 seconds in automated loop)
      retryMs = Math.min(Math.max(retryMs, 500), 10000);
      throw new RateLimitError(`Rate limit encountered while probing "${targetUrl}".`, retryMs);
    }

    if (response.status === 401 || response.status === 403) {
      throw new PermanentProcessorError(`Access denied or authentication required (HTTP ${response.status}) for "${targetUrl}".`, response.status);
    }

    if (response.status === 404 || response.status === 410) {
      throw new PermanentProcessorError(`Source target not found (HTTP ${response.status}): "${targetUrl}".`, response.status);
    }

    if (response.status >= 500) {
      throw new TransientProcessorError(`Target server returned HTTP ${response.status} for "${targetUrl}".`, response.status);
    }

    if (!response.ok) {
      throw new PermanentProcessorError(`Source target returned error status HTTP ${response.status} for "${targetUrl}".`, response.status);
    }

    const html = await response.text();
    const metadata = this.extractHtmlMetadata(html, targetUrl);

    if (metadata.isAuthWall) {
      throw new PermanentProcessorError(`Platform authentication required: source target redirected to login or access wall for "${targetUrl}".`, 403);
    }

    if (!metadata.title && !metadata.description && html.length < 200) {
      throw new PermanentProcessorError(`Source target returned empty or unusable content for "${targetUrl}".`, 422);
    }

    const cleanCreator = job.creator ? job.creator.replace(/^@/, '') : null;
    const observation: CollectedObservation = {
      source_url: targetUrl,
      source_type: this.inferSourceType(targetUrl, job.platform),
      source_title: metadata.title || (cleanCreator ? `${job.platform} content by @${cleanCreator}` : `${job.platform} observation`),
      platform: job.platform,
      creator: cleanCreator,
      // Honest: Do NOT fabricate publication date if not present in metadata
      published_at: metadata.publishedAt || null,
      topic: job.topic,
      // Honest: Do NOT fabricate synthetic hook if description is missing
      hook: metadata.description?.slice(0, 240) || null,
      angle: null,
      // Honest: Use actual extracted title or description, not synthetic claims
      claim: metadata.title || (metadata.description ? metadata.description.slice(0, 160) : `Extracted metadata for ${targetUrl}`),
      evidence: {
        target_url: targetUrl,
        page_status: response.status,
        canonical_url: metadata.canonicalUrl || targetUrl,
        content_length: html.length,
        retrieval_method: 'html_metadata_probe',
        has_meta_description: Boolean(metadata.description),
        has_published_date: Boolean(metadata.publishedAt),
        metrics_collected: false,
        metrics_note: 'Engagement statistics (views, likes, shares) cannot be verified without authenticated platform API integration.'
      },
      audience_signals: {
        channel: job.platform,
        metrics_available: false
      },
      market_signals: {
        niche: job.topic,
        source_resolved: true
      },
      content_patterns: {
        format: this.inferSourceType(targetUrl, job.platform)
      },
      // Honest: Page metadata alone has low evidence strength for audience engagement
      evidence_strength: 'low',
      classification: 'observed_fact',
      // Honest: Low confidence without platform API metrics
      confidence: 'low',
      raw_source_reference: {
        url: targetUrl,
        canonical_url: metadata.canonicalUrl,
        extracted_at: new Date().toISOString(),
        status: response.status,
        extracted_fields: {
          has_title: Boolean(metadata.title),
          has_description: Boolean(metadata.description),
          has_published_at: Boolean(metadata.publishedAt)
        }
      },
      research_agent: 'native-research-collector-v1'
    };

    return [observation];
  }

  private collectTopicBenchmark(job: ResearchCollectionJob): CollectedObservation[] {
    const cleanTopic = job.topic.trim();
    const encodedTopic = encodeURIComponent(cleanTopic);
    const platform = job.platform || 'Instagram';
    const benchmarkUrl = `https://www.${platform.toLowerCase()}.com/explore/tags/${encodedTopic}/`;

    // Honest: Classified as ai_hypothesis with low confidence and unverified metrics
    const observation: CollectedObservation = {
      source_url: benchmarkUrl,
      source_type: 'topic_benchmark',
      source_title: `Topic hypothesis: "${cleanTopic}" on ${platform}`,
      platform,
      creator: null,
      published_at: null,
      topic: cleanTopic,
      hook: null,
      angle: null,
      claim: `Topic query registered for market monitoring: "${cleanTopic}".`,
      evidence: {
        benchmark_type: 'topic_query_registration',
        query: cleanTopic,
        platform,
        search_url: benchmarkUrl,
        live_metrics_available: false,
        note: 'Topic query registered for market monitoring. Aggregated cross-market engagement patterns require external search/social API integration.'
      },
      audience_signals: {
        topic: cleanTopic,
        funnel_stage: job.funnelStage || 'TOF',
        metrics_available: false
      },
      market_signals: {
        platform,
        coverage: 'topic_registered'
      },
      content_patterns: {
        pillar: cleanTopic
      },
      evidence_strength: 'low',
      classification: 'ai_hypothesis',
      confidence: 'low',
      raw_source_reference: {
        topic: cleanTopic,
        platform,
        search_query: cleanTopic,
        registered_at: new Date().toISOString()
      },
      research_agent: 'native-research-collector-v1'
    };

    return [observation];
  }

  private extractHtmlMetadata(html: string, fallbackUrl: string): {
    title?: string;
    description?: string;
    canonicalUrl?: string;
    publishedAt?: string;
    isAuthWall?: boolean;
  } {
    const titleMatch =
      html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
      html.match(/<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']/i) ||
      html.match(/<title[^>]*>([^<]+)<\/title>/i);

    const descMatch =
      html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i) ||
      html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) ||
      html.match(/<meta\s+name=["']twitter:description["']\s+content=["']([^"']+)["']/i);

    const canonMatch =
      html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i) ||
      html.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i);

    const dateMatch =
      html.match(/<meta\s+property=["']article:published_time["']\s+content=["']([^"']+)["']/i) ||
      html.match(/<meta\s+itemprop=["']datePublished["']\s+content=["']([^"']+)["']/i);

    const title = titleMatch ? this.cleanHtmlEntities(titleMatch[1].trim()) : undefined;
    const description = descMatch ? this.cleanHtmlEntities(descMatch[1].trim()) : undefined;

    // Detect login walls or anti-bot challenge pages
    const isAuthWall = Boolean(
      (title && /^(login|log in|sign in|sign up|checkpoint|attention required)/i.test(title)) ||
      /login\s*•\s*instagram/i.test(html.slice(0, 3000)) ||
      /<title>.*(sign in|log in|authwall).*<\/title>/i.test(html.slice(0, 3000))
    );

    return {
      title,
      description,
      canonicalUrl: canonMatch ? canonMatch[1].trim() : fallbackUrl,
      publishedAt: dateMatch ? dateMatch[1].trim() : undefined,
      isAuthWall
    };
  }

  private cleanHtmlEntities(text: string): string {
    return text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#x27;/g, "'")
      .replace(/&nbsp;/g, ' ');
  }

  private inferSourceType(url: string, platform?: string): string {
    const u = url.toLowerCase();
    if (u.includes('youtube.com') || u.includes('youtu.be') || u.includes('tiktok.com') || u.includes('/reel/')) {
      return 'video';
    }
    if (u.includes('/p/') || u.includes('instagram.com/')) {
      return 'social_post';
    }
    if (u.includes('linkedin.com/pulse') || u.includes('medium.com') || u.includes('/blog/')) {
      return 'article';
    }
    return (platform || 'social_post').toLowerCase();
  }
}
