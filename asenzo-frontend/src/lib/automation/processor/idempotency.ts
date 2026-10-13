import crypto from 'crypto';
import { CollectedObservation } from './types';

/**
 * Normalizes a URL for stable identification:
 * - Lowercases scheme and host
 * - Removes standard tracking query parameters (utm_*, ref, source, fbclid, etc.)
 * - Strips trailing slash
 */
export function normalizeSourceUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  try {
    const parsed = new URL(rawUrl.trim());
    parsed.protocol = parsed.protocol.toLowerCase();
    parsed.hostname = parsed.hostname.toLowerCase();

    // Strip common tracking parameters
    const trackingParams = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'ref',
      'source',
      'fbclid',
      'gclid',
      'igshid'
    ];
    for (const param of trackingParams) {
      parsed.searchParams.delete(param);
    }

    // Sort remaining search parameters for deterministic query string
    parsed.searchParams.sort();

    let normalized = parsed.toString();
    if (normalized.endsWith('/') && parsed.pathname !== '/') {
      normalized = normalized.slice(0, -1);
    }
    return normalized;
  } catch {
    return rawUrl.trim().toLowerCase();
  }
}

/**
 * Generates a stable, content-addressed idempotency key for an observation within a research job.
 * This key is independent of array index or collection order.
 *
 * Structure:
 * `res_${jobId.slice(0, 8)}_${sha256Hex(normalizedUrl + '|' + sourceType + '|' + contentFingerprint).slice(0, 24)}`
 */
export function generateObservationIdempotencyKey(
  jobId: string,
  assignmentId: string,
  obs: CollectedObservation
): string {
  const normalizedUrl = normalizeSourceUrl(obs.source_url);
  const normalizedType = (obs.source_type || 'observation').trim().toLowerCase();

  // Content fingerprint based on claim or title or hook
  const rawContent = (obs.claim || obs.source_title || obs.hook || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');

  const signature = `${normalizedUrl}|${normalizedType}|${rawContent}`;
  const hash = crypto.createHash('sha256').update(signature).digest('hex').slice(0, 24);

  return `res_${jobId.slice(0, 8)}_${hash}`;
}
