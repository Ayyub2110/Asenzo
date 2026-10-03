export interface ResearchCreatorInput {
  id?: string;
  name?: string;
  handle?: string;
  source_target?: string;
  state?: boolean;
}

export interface BuildResearchJobPayloadOptions {
  topic: string;
  platform?: string;
  funnel_stage?: string;
  content_pillar?: string;
  date_range?: string;
  creators?: ResearchCreatorInput[];
  sources?: Array<{ type: string; target: string }>;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

export interface CanonicalCreatorPayload {
  handle?: string;
  source_target?: string;
}

export interface CanonicalResearchJobRequest {
  objective: string;
  topic: string;
  platform: string;
  funnel_stage: string;
  content_pillar: string;
  date_range: string;
  keyword_topic: string;
  creators: CanonicalCreatorPayload[];
  sources: Array<{ type: string; target: string }>;
  priority: string;
}

export interface BuildResearchJobPayloadResult {
  success: boolean;
  payload?: CanonicalResearchJobRequest;
  error?: string;
}

export function isValidHandle(value: unknown): value is string {
  return typeof value === 'string' && /^@?[A-Za-z0-9._-]+$/.test(value.trim());
}

export function isValidSourceTarget(value: unknown): value is string {
  if (typeof value !== 'string' || !value.trim()) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isPlaceholderHandle(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const normalized = value.trim().toLowerCase().replace(/^@/, '');
  return normalized === 'verified_handle' || normalized === 'placeholder';
}

export function isPlaceholderSourceTarget(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const normalized = value.trim().toLowerCase();
  return normalized.includes('verified_handle') || normalized.includes('placeholder');
}

/**
 * Validates research inputs and constructs the canonical request payload for
 * POST /api/automation/research/jobs according to the Phase 2 creator contract.
 *
 * Rules:
 * 1. Never invent or infer a handle from a display name.
 * 2. Never submit "verified_handle" or placeholders as a production/test research target.
 * 3. If a creator only has a display name and no verified handle/source URL, block submission with a clear message.
 * 4. Accepts actual verified handles and constructs:
 *    { handle: "<actual_verified_handle>", source_target: "https://www.instagram.com/<actual_verified_handle>/" }
 * 5. Supports topic-only research when no creators are selected (creators: []).
 */
export function buildResearchJobPayload(
  options: BuildResearchJobPayloadOptions
): BuildResearchJobPayloadResult {
  const topic = (options.topic || '').trim();
  if (!topic) {
    return {
      success: false,
      error: 'Enter a keyword or topic first.'
    };
  }

  const creators = options.creators || [];
  const selectedCreators = creators.filter(c => c.state !== false);

  const validatedCreators: CanonicalCreatorPayload[] = [];

  for (const creator of selectedCreators) {
    const hasHandle = typeof creator.handle === 'string' && creator.handle.trim().length > 0;
    const hasSource = typeof creator.source_target === 'string' && creator.source_target.trim().length > 0;

    // Rule 3: Fail clearly if creator only has display name or lacks verified handle/source
    if (!hasHandle && !hasSource) {
      const displayName = creator.name || 'Selected creator';
      return {
        success: false,
        error: `Creator "${displayName}" does not have a verified handle or source URL.`
      };
    }

    // Rule 2: Never submit "verified_handle" or placeholder values
    if (isPlaceholderHandle(creator.handle) || isPlaceholderSourceTarget(creator.source_target)) {
      const displayName = creator.name || creator.handle || 'Selected creator';
      return {
        success: false,
        error: `Creator "${displayName}" contains placeholder "verified_handle". An actual verified handle or URL is required.`
      };
    }

    if (hasHandle && !isValidHandle(creator.handle)) {
      const displayName = creator.name || creator.handle;
      return {
        success: false,
        error: `Creator "${displayName}" has an invalid handle format.`
      };
    }

    if (hasSource && !isValidSourceTarget(creator.source_target)) {
      const displayName = creator.name || creator.source_target;
      return {
        success: false,
        error: `Creator "${displayName}" has an invalid source URL (must be http/https).`
      };
    }

    const payloadItem: CanonicalCreatorPayload = {};
    if (hasHandle && creator.handle) {
      const cleanHandle = creator.handle.trim().replace(/^@/, '');
      payloadItem.handle = cleanHandle;
      if (!hasSource) {
        payloadItem.source_target = `https://www.instagram.com/${cleanHandle}/`;
      }
    }
    if (hasSource && creator.source_target) {
      payloadItem.source_target = creator.source_target.trim();
    }

    validatedCreators.push(payloadItem);
  }

  return {
    success: true,
    payload: {
      objective: `Research ${topic}`,
      topic,
      platform: options.platform || 'Instagram',
      funnel_stage: options.funnel_stage || 'TOF',
      content_pillar: options.content_pillar || 'Client Acquisition',
      date_range: options.date_range || 'last_7_days',
      keyword_topic: topic,
      creators: validatedCreators,
      sources: options.sources || [],
      priority: options.priority || 'normal'
    }
  };
}
