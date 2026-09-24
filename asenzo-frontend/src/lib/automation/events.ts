import { getAdminSupabaseClient } from '../supabase/admin';

export type AutomationEventType =
  | 'content.context_received'
  | 'research.requested'
  | 'research.completed'
  | 'content.idea.created'
  | 'content.script.requested'
  | 'content.approval.requested'
  | 'content.approved'
  | 'content.published'
  | 'content.performance.updated'
  | 'intelligence.created'
  | 'audience.dna.created';

export interface AutomationEventPayload<T = Record<string, unknown>> {
  event: AutomationEventType;
  entity_type: string;
  entity_id: string;
  workspace_id: string;
  timestamp: string;
  requested_action?: string;
  data?: T;
}

function sanitizeLogMessage(msg: string): string {
  return msg.replace(/https?:\/\/[^\s]+/g, '[REDACTED_URL]');
}

/**
 * Dispatches an event to the configured n8n webhook and records it in system_events.
 */
export async function dispatchAutomationEvent<T = Record<string, unknown>>(
  payload: AutomationEventPayload<T>,
  options?: { webhookUrl?: string }
): Promise<{ dispatched: boolean; webhookStatus?: number; error?: string }> {
  // 1. Record in Supabase system_events
  const supabase = getAdminSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('system_events').insert({
        workspace_id: payload.workspace_id,
        event_type: payload.event,
        entity_type: payload.entity_type,
        entity_id: payload.entity_id,
        payload: payload.data || {}
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn('[Automation Events] Could not record system event to Supabase:', sanitizeLogMessage(errMsg));
    }
  }

  // 2. Dispatch to n8n webhook URL if configured
  const webhookUrl =
    options?.webhookUrl ||
    (payload.event === 'research.requested'
      ? (process.env.N8N_RESEARCH_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL)
      : process.env.N8N_WEBHOOK_URL);

  if (!webhookUrl) {
    const error =
      payload.event === 'research.requested'
        ? 'N8N_RESEARCH_WEBHOOK_URL is not configured'
        : 'N8N_WEBHOOK_URL is not configured';
    console.warn(`[Automation Events] Webhook dispatch skipped: ${error}`);
    return { dispatched: false, error };
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'ASENZO-Growth-OS-Webhook/1.0'
    };

    if (process.env.N8N_WEBHOOK_SECRET) {
      headers['x-webhook-secret'] = process.env.N8N_WEBHOOK_SECRET;
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      console.error(
        `[Automation Events] n8n delivery failed for event '${payload.event}' (HTTP ${response.status})`
      );
      return {
        dispatched: false,
        webhookStatus: response.status,
        error: `Webhook response status HTTP ${response.status}`
      };
    }

    return {
      dispatched: true,
      webhookStatus: response.status
    };
  } catch (err: unknown) {
    const rawError = err instanceof Error ? err.message : String(err);
    const safeError = sanitizeLogMessage(rawError);
    console.error(`[Automation Events] n8n delivery network failure for event '${payload.event}':`, safeError);
    return { dispatched: false, error: safeError };
  }
}

