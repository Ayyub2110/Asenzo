import { getSupabaseClient, isSupabaseConfigured } from './client';
import {
  FoundationData,
  AttentionData,
  ConversionData,
  Opportunity,
  Qualification,
  SalesCall,
  Proposal,
  FollowUp,
  DeliveryData,
  RevenueData,
  OperationsData,
  CalendarData,
  CalendarEvent,
  SettingsData,
  IntelligenceData
} from '@/lib/types';

import {
  mockCommandCenter,
  mockFoundation,
  mockAttention,
  mockConversion,
  mockDelivery,
  mockRevenue,
  mockOperations,
  mockCalendar,
  mockSettings,
  mockIntelligence
} from '@/lib/mock/data';

async function isDemoSession(): Promise<boolean> {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem("asenzo_auth_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.isDemo === true) return true;
        if (parsed?.isDemo === false) return false;
      }
    } catch {
      // Fallthrough
    }
  }

  if (!isSupabaseConfigured()) return false;
  const supabase = getSupabaseClient();
  if (!supabase) return false;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return !session?.user?.id;
  } catch {
    return false;
  }
}

// ==========================================
// FOUNDATION ADAPTER
// ==========================================

export async function fetchFoundationFromSupabase(): Promise<FoundationData> {
  if (!isSupabaseConfigured()) return mockFoundation;

  const supabase = getSupabaseClient();
  if (!supabase) return mockFoundation;

  try {
    const { data, error } = await supabase
      .from('foundation')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      console.warn('Supabase foundation fetch notice (falling back to mock):', error?.message);
      return mockFoundation;
    }

    return {
      coreDna: data.core_dna || mockFoundation.coreDna,
      icp: data.icp || mockFoundation.icp,
      offer: data.offer || mockFoundation.offer,
      brandVoice: data.brand_voice || mockFoundation.brandVoice,
      founderVoice: data.founder_voice || mockFoundation.founderVoice,
      readiness: data.readiness || mockFoundation.readiness,
      businessContext: data.business_context || mockFoundation.businessContext,
      customerContext: data.customer_context || mockFoundation.customerContext,
      positioningContext: data.positioning_context || mockFoundation.positioningContext,
      offerContext: data.offer_context || mockFoundation.offerContext,
      brandContext: data.brand_context || mockFoundation.brandContext,
      knowledge: data.knowledge || mockFoundation.knowledge,
      proofSettings: data.proof_settings || mockFoundation.proofSettings
    };
  } catch (err) {
    console.error('Foundation fetch error:', err);
    return mockFoundation;
  }
}

export async function saveFoundationToSupabase(payload: Partial<FoundationData>): Promise<FoundationData> {
  if (await isDemoSession()) {
    console.warn('[Demo Visual Mode Guard] Write operations are disabled for test user sessions without an authenticated Supabase user ID.');
    return fetchFoundationFromSupabase();
  }

  const supabase = getSupabaseClient();
  if (!supabase) return mockFoundation;

  try {
    const current = await fetchFoundationFromSupabase();
    const updated: FoundationData = {
      ...current,
      ...payload,
      coreDna: payload.coreDna ? { ...current.coreDna, ...payload.coreDna } : current.coreDna,
      icp: payload.icp ? { ...current.icp, ...payload.icp } : current.icp,
      offer: payload.offer ? { ...current.offer, ...payload.offer } : current.offer
    };

    const { error } = await supabase.from('foundation').upsert({
      core_dna: updated.coreDna,
      icp: updated.icp,
      offer: updated.offer,
      brand_voice: updated.brandVoice,
      founder_voice: updated.founderVoice,
      readiness: updated.readiness,
      business_context: updated.businessContext,
      customer_context: updated.customerContext,
      positioning_context: updated.positioningContext,
      offer_context: updated.offerContext,
      brand_context: updated.brandContext,
      knowledge: updated.knowledge,
      proof_settings: updated.proofSettings,
      updated_at: new Date().toISOString()
    });

    if (error) {
      console.error('Failed to save foundation to Supabase:', error.message);
    }
    return updated;
  } catch (err) {
    console.error('Foundation save exception:', err);
    return mockFoundation;
  }
}

// ==========================================
// ATTENTION ADAPTER
// ==========================================

export async function fetchAttentionFromSupabase(): Promise<AttentionData> {
  if (!isSupabaseConfigured()) return mockAttention;

  const supabase = getSupabaseClient();
  if (!supabase) return mockAttention;

  try {
    const { data, error } = await supabase
      .from('attention_ideas')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return mockAttention;
    }

    const ideas = data.map(item => ({
      id: item.id,
      title: item.title,
      contentPillar: item.topic,
      primaryChannel: item.platform,
      status: item.stage as any,
      hookDraft: item.hook,
      contentDraft: item.body,
      primaryCta: item.cta,
      ...(item.performance || {})
    }));

    return {
      ...mockAttention,
      ideas
    };
  } catch (err) {
    console.error('Attention fetch error:', err);
    return mockAttention;
  }
}

export async function saveAttentionToSupabase(payload: AttentionData): Promise<AttentionData> {
  if (await isDemoSession()) {
    console.warn('[Demo Visual Mode Guard] Write operations are disabled for test user sessions without an authenticated Supabase user ID.');
    return fetchAttentionFromSupabase();
  }

  const supabase = getSupabaseClient();
  if (!supabase) return mockAttention;

  try {
    const records = payload.ideas.map(idea => ({
      id: idea.id,
      title: idea.title,
      topic: idea.contentPillar || '',
      platform: idea.primaryChannel || 'LinkedIn',
      stage: idea.status,
      hook: idea.hookDraft || '',
      body: idea.contentDraft || '',
      cta: idea.primaryCta || '',
      performance: { viralityScore: idea.viralityScore, confidenceScore: idea.confidenceScore },
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase.from('attention_ideas').upsert(records);

    if (error) {
      console.error('Failed to save attention ideas to Supabase:', error.message);
    }
    return payload;
  } catch (err) {
    console.error('Attention save exception:', err);
    return payload;
  }
}

// ==========================================
// CONVERSION ADAPTER
// ==========================================

export async function fetchConversionFromSupabase(): Promise<ConversionData> {
  if (!isSupabaseConfigured()) return mockConversion;

  const supabase = getSupabaseClient();
  if (!supabase) return mockConversion;

  try {
    const { data, error } = await supabase
      .from('conversion_opportunities')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return mockConversion;
    }

    const opportunities: Opportunity[] = data.map(item => ({
      id: item.id,
      leadName: item.client_name,
      company: item.company || '',
      title: `${item.client_name} - Deal`,
      value: Number(item.value || 0),
      stage: item.stage || 'QUALIFIED',
      qualification: item.qualification || { fit: '', problem: '', urgency: '', authority: '', budget: '' },
      salesCall: item.sales_call || { status: 'TBD' },
      objections: [],
      proposal: item.proposal,
      lastActivity: item.updated_at,
      nextAction: 'Follow up',
      daysInactive: 0,
      priority: 'routine'
    }));

    return {
      ...mockConversion,
      opportunities
    };
  } catch (err) {
    console.error('Conversion fetch error:', err);
    return mockConversion;
  }
}

export async function saveOpportunityToSupabase(payload: Opportunity): Promise<ConversionData> {
  if (await isDemoSession()) {
    console.warn('[Demo Visual Mode Guard] Write operations are disabled for test user sessions without an authenticated Supabase user ID.');
    return fetchConversionFromSupabase();
  }

  const supabase = getSupabaseClient();
  if (!supabase) return mockConversion;

  try {
    const { error } = await supabase.from('conversion_opportunities').upsert({
      id: payload.id,
      client_name: payload.leadName,
      company: payload.company,
      value: payload.value,
      stage: payload.stage,
      qualification: payload.qualification,
      sales_call: payload.salesCall,
      proposal: payload.proposal,
      updated_at: new Date().toISOString()
    });

    if (error) console.error('Error saving opportunity to Supabase:', error.message);
    return await fetchConversionFromSupabase();
  } catch (err) {
    console.error('Save opportunity exception:', err);
    return mockConversion;
  }
}

// ==========================================
// CALENDAR ADAPTER
// ==========================================

export async function fetchCalendarFromSupabase(): Promise<CalendarData> {
  if (!isSupabaseConfigured()) return mockCalendar;

  const supabase = getSupabaseClient();
  if (!supabase) return mockCalendar;

  try {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .order('start_time', { ascending: true });

    if (error || !data || data.length === 0) {
      return mockCalendar;
    }

    const events: CalendarEvent[] = data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.title,
      owner: 'Founder',
      date: item.start_time ? item.start_time.split('T')[0] : '',
      startTime: item.start_time,
      endTime: item.end_time,
      priority: (item.priority as any) || 'STANDARD',
      status: (item.status as any) || 'SCHEDULED',
      sourceModule: (item.category as any) || 'Operator'
    }));

    return {
      ...mockCalendar,
      events
    };
  } catch (err) {
    console.error('Calendar fetch error:', err);
    return mockCalendar;
  }
}

export async function saveCalendarEventToSupabase(payload: CalendarEvent): Promise<CalendarData> {
  if (await isDemoSession()) {
    console.warn('[Demo Visual Mode Guard] Write operations are disabled for test user sessions without an authenticated Supabase user ID.');
    return fetchCalendarFromSupabase();
  }

  const supabase = getSupabaseClient();
  if (!supabase) return mockCalendar;

  try {
    const { error } = await supabase.from('calendar_events').upsert({
      id: payload.id,
      title: payload.title,
      start_time: payload.startTime,
      end_time: payload.endTime,
      category: payload.sourceModule || 'Operator',
      priority: payload.priority,
      status: payload.status,
      updated_at: new Date().toISOString()
    });

    if (error) console.error('Error saving calendar event to Supabase:', error.message);
    return await fetchCalendarFromSupabase();
  } catch (err) {
    console.error('Calendar save exception:', err);
    return mockCalendar;
  }
}

// ==========================================
// SETTINGS ADAPTER
// ==========================================

export async function fetchSettingsFromSupabase(): Promise<SettingsData> {
  if (!isSupabaseConfigured()) return mockSettings;

  const supabase = getSupabaseClient();
  if (!supabase) return mockSettings;

  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return mockSettings;

    return {
      profile: data.profile || mockSettings.profile,
      notifications: data.notifications || mockSettings.notifications,
      system: data.system || mockSettings.system
    };
  } catch (err) {
    console.error('Settings fetch error:', err);
    return mockSettings;
  }
}

export async function saveSettingsToSupabase(payload: SettingsData): Promise<SettingsData> {
  if (await isDemoSession()) {
    console.warn('[Demo Visual Mode Guard] Write operations are disabled for test user sessions without an authenticated Supabase user ID.');
    return fetchSettingsFromSupabase();
  }

  const supabase = getSupabaseClient();
  if (!supabase) return mockSettings;

  try {
    const { error } = await supabase.from('system_settings').upsert({
      profile: payload.profile,
      notifications: payload.notifications,
      system: payload.system,
      updated_at: new Date().toISOString()
    });

    if (error) console.error('Error saving settings to Supabase:', error.message);
    return payload;
  } catch (err) {
    console.error('Settings save exception:', err);
    return payload;
  }
}
