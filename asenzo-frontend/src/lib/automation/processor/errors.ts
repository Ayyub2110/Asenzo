export class ProcessorError extends Error {
  isTransient: boolean;
  statusCode?: number;

  constructor(message: string, isTransient = false, statusCode?: number) {
    super(message);
    this.name = 'ProcessorError';
    this.isTransient = isTransient;
    this.statusCode = statusCode;
  }
}

export class TransientProcessorError extends ProcessorError {
  constructor(message: string, statusCode?: number) {
    super(message, true, statusCode);
    this.name = 'TransientProcessorError';
  }
}

export class PermanentProcessorError extends ProcessorError {
  constructor(message: string, statusCode?: number) {
    super(message, false, statusCode);
    this.name = 'PermanentProcessorError';
  }
}

export class RateLimitError extends TransientProcessorError {
  retryAfterMs?: number;

  constructor(message = 'Rate limit exceeded (HTTP 429)', retryAfterMs?: number) {
    super(message, 429);
    this.name = 'RateLimitError';
    this.retryAfterMs = retryAfterMs;
  }
}

export class ProviderTimeoutError extends TransientProcessorError {
  constructor(message = 'External provider request timed out') {
    super(message, 504);
    this.name = 'ProviderTimeoutError';
  }
}

/**
 * Checks whether an unknown error is transient (should be retried with backoff).
 */
export function isTransientError(err: unknown): boolean {
  if (err instanceof ProcessorError) {
    return err.isTransient;
  }

  if (err instanceof Error) {
    if (err.name === 'AbortError' || err.name === 'TimeoutError') {
      return true;
    }

    const msg = err.message.toLowerCase();
    if (
      msg.includes('rate limit') ||
      msg.includes('429') ||
      msg.includes('too many requests') ||
      msg.includes('econnreset') ||
      msg.includes('etimedout') ||
      msg.includes('socket hang up') ||
      msg.includes('network error') ||
      msg.includes('fetch failed') ||
      msg.includes('500') ||
      msg.includes('502') ||
      msg.includes('503') ||
      msg.includes('504')
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Sanitizes error messages to remove sensitive query params, authorization tokens, or internal credentials.
 */
export function sanitizeErrorMessage(err: unknown): string {
  if (!err) return 'Unknown error';
  const raw = err instanceof Error ? err.message : String(err);
  return raw
    .replace(/(?:key|token|secret|password|bearer|auth)=[^\s&]+/gi, '$1=[REDACTED]')
    .replace(/bearer\s+[a-zA-Z0-9._-]+/gi, 'Bearer [REDACTED]')
    .slice(0, 500);
}
