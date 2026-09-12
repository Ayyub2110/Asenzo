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
  | 'intelligence.created';

export interface AutomationEventPayload<T = Record<string, unknown>> {
  event: AutomationEventType;
  entity_type: string;
  entity_id: string;
  workspace_id: string;
  timestamp: string;
  requested_action?: string;
  data?: T;
}

/**
 * Dispatches an event to the configured n8n webhook and records it in system_events.
 */
export async function dispatchAutomationEvent<T = Record<string, unknown>>(
  payload: AutomationEventPayload<T>
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
      console.warn('Could not record system event to Supabase:', err);
    }
  }

  // 2. Dispatch to n8n webhook URL if configured
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    return { dispatched: false, error: 'N8N_WEBHOOK_URL is not configured' };
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
      signal: AbortSignal.timeout(5000)
    });

    return {
      dispatched: response.ok,
      webhookStatus: response.status
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('Failed to dispatch webhook to n8n:', errorMessage);
    return { dispatched: false, error: errorMessage };
  }
}
