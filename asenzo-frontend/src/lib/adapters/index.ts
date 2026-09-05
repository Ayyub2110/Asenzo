"use server";
import { 
  CommandCenterData, 
  FoundationData, 
  AttentionData, 
  ConversionData, 
  Opportunity
} from "../types";
import {
  mockCommandCenter,
  mockFoundation,
  mockAttention,
  mockConversion,
  mockRevenue,
  mockOperations,
  mockCalendar,
  mockSettings,
  mockIntelligence,
  mockOperatingItems,

  mockCreators,
  mockCreatorChannels,
  mockContentReferences,
  mockOutlierAnalyses,
  mockResearchSignals,
  mockContentPatterns,
  mockContentIdeas,
  mockContentAngles,
  mockHooks,
  mockScriptFrameworks,
  mockScriptPlans,
  mockScriptVersions,
  mockContentPerformances,
  mockContentLearnings,
  mockContentItems
} from "../mock/data";

import {
  fetchFoundationFromSupabase,
  saveFoundationToSupabase,
  fetchAttentionFromSupabase,
  saveAttentionToSupabase,
  fetchConversionFromSupabase,
  saveOpportunityToSupabase,
  fetchCalendarFromSupabase,
  saveCalendarEventToSupabase,
  fetchSettingsFromSupabase,
  saveSettingsToSupabase
} from "@/lib/supabase/adapter";

/**
 * ASENZO API Adapters
 * Unified application data access layer.
 * Seamlessly integrates Supabase backend database persistence with mock fallbacks.
 */

// Simulated network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getCommandCenter(): Promise<CommandCenterData> {
  await delay(300);
  return mockCommandCenter;
}

export async function getFoundation(): Promise<FoundationData> {
  return await fetchFoundationFromSupabase();
}

export async function updateFoundation(payload: Partial<FoundationData>): Promise<FoundationData> {
  return await saveFoundationToSupabase(payload);
}

export async function getAttention(): Promise<AttentionData> {
  return await fetchAttentionFromSupabase();
}

export async function updateAttention(payload: AttentionData): Promise<AttentionData> {
  return await saveAttentionToSupabase(payload);
}

export async function getConversion(): Promise<ConversionData> {
  return await fetchConversionFromSupabase();
}

export async function updateOpportunity(payload: Opportunity): Promise<ConversionData> {
  return await saveOpportunityToSupabase(payload);
}

export async function updateQualification(oppId: string, payload: import("@/lib/types").Qualification): Promise<ConversionData> {
  const current = await fetchConversionFromSupabase();
  const opp = current.opportunities.find(o => o.id === oppId);
  if (opp) {
    opp.qualification = payload;
    return await saveOpportunityToSupabase(opp);
  }
  return current;
}

export async function updateSalesCall(oppId: string, payload: import("@/lib/types").SalesCall): Promise<ConversionData> {
  const current = await fetchConversionFromSupabase();
  const opp = current.opportunities.find(o => o.id === oppId);
  if (opp) {
    opp.salesCall = payload;
    return await saveOpportunityToSupabase(opp);
  }
  return current;
}

export async function updateProposal(oppId: string, payload: import("@/lib/types").Proposal): Promise<ConversionData> {
  const current = await fetchConversionFromSupabase();
  const opp = current.opportunities.find(o => o.id === oppId);
  if (opp) {
    opp.proposal = payload;
    return await saveOpportunityToSupabase(opp);
  }
  return current;
}

export async function updateFollowUp(payload: import("@/lib/types").FollowUp): Promise<ConversionData> {
  await delay(200);
  mockConversion.followUps = mockConversion.followUps.map(f => f.id === payload.id ? payload : f);
  return { ...mockConversion };
}

// Legacy Delivery Removed

// ============== REVENUE ==============

export async function getRevenue(): Promise<import("@/lib/types").RevenueData> {
  await delay(300);
  return { ...mockRevenue };
}

// ============== OPERATIONS ==============

export async function getOperations(): Promise<import("@/lib/types").OperationsData> {
  await delay(300);
  return { ...mockOperations };
}

// ============== CALENDAR ==============

export async function getCalendar(): Promise<import("@/lib/types").CalendarData> {
  return await fetchCalendarFromSupabase();
}

export async function updateCalendarEvent(payload: import("@/lib/types").CalendarEvent): Promise<import("@/lib/types").CalendarData> {
  return await saveCalendarEventToSupabase(payload);
}

export async function completeCalendarEvent(eventId: string): Promise<import("@/lib/types").CalendarData> {
  const calendar = await fetchCalendarFromSupabase();
  const ev = calendar.events.find(e => e.id === eventId);
  if (ev) {
    ev.status = "COMPLETED";
    return await saveCalendarEventToSupabase(ev);
  }
  return calendar;
}

// ============== INTELLIGENCE ==============

export async function getIntelligence(): Promise<import("@/lib/types").IntelligenceData> {
  await delay(400);
  return { ...mockIntelligence };
}

export async function getOperatingItems(): Promise<import("@/lib/types").OperatingItem[]> {
  await delay(300);
  return [...mockOperatingItems];
}

export async function updateOperatingItem(payload: import("@/lib/types").OperatingItem): Promise<import("@/lib/types").OperatingItem[]> {
  await delay(300);
  const index = mockOperatingItems.findIndex(i => i.id === payload.id);
  if (index >= 0) {
    mockOperatingItems[index] = payload;
  } else {
    mockOperatingItems.push(payload);
  }
  return [...mockOperatingItems];
}

// ============== SETTINGS ==============

export async function getSettings(): Promise<import("@/lib/types").SettingsData> {
  return await fetchSettingsFromSupabase();
}

export async function updateSettings(
  payload: import("@/lib/types").SettingsData
): Promise<import("@/lib/types").SettingsData> {
  return await saveSettingsToSupabase(payload);
}

// ============== PHASE 3: RESEARCH INTELLIGENCE ==============

export async function getCreators(): Promise<import("@/lib/types").Creator[]> {
  await delay(200);
  return [...mockCreators];
}

export async function getCreatorChannels(): Promise<import("@/lib/types").CreatorChannel[]> {
  await delay(200);
  return [...mockCreatorChannels];
}

export async function getContentReferences(): Promise<import("@/lib/types").ContentReference[]> {
  await delay(200);
  return [...mockContentReferences];
}

export async function getOutlierAnalyses(): Promise<import("@/lib/types").OutlierAnalysis[]> {
  await delay(200);
  return [...mockOutlierAnalyses];
}

export async function getResearchSignals(): Promise<import("@/lib/types").ResearchSignal[]> {
  await delay(200);
  return [...mockResearchSignals];
}

export async function getContentPatterns(): Promise<import("@/lib/types").ContentPattern[]> {
  await delay(200);
  return [...mockContentPatterns];
}

// ==========================================
// PHASE 4: IDEA & HOOK INTELLIGENCE
// ==========================================

export async function getContentIdeas() {
  await delay(200);
  return mockContentIdeas;
}

export async function getContentAngles() {
  await delay(200);
  return mockContentAngles;
}

export async function getHooks() {
  await delay(200);
  return mockHooks;
}

// ==========================================
// PHASE 5: SCRIPT ENGINE INTELLIGENCE
// ==========================================

export async function getScriptFrameworks() {
  await delay(200);
  return mockScriptFrameworks;
}

export async function getScriptPlans() {
  await delay(200);
  return mockScriptPlans;
}

export async function getScriptVersions() {
  await delay(200);
  return mockScriptVersions;
}

// ==========================================
// PHASE 6: PRODUCTION & DISTRIBUTION
// ==========================================

export async function getContentItems() {
  await delay(200);
  return mockContentItems;
}



// ==========================================
// PHASE 7: PERFORMANCE & LEARNING
// ==========================================

export async function getContentPerformances() {
  await delay(300);
  return mockContentPerformances;
}

export async function getContentLearnings() {
  await delay(300);
  return mockContentLearnings;
}

