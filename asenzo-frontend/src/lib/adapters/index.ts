"use server";
import { 
  CommandCenterData, 
  FoundationData, 
  AttentionData, 
  ConversionData, 
  Opportunity,
  DeliveryData,
  DeliveryEngagement
} from "../types";
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

export async function getDelivery(): Promise<import("@/lib/types").DeliveryData> {
  await delay(300);
  return mockDelivery;
}

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

// ============== SETTINGS ==============

export async function getSettings(): Promise<import("@/lib/types").SettingsData> {
  return await fetchSettingsFromSupabase();
}

export async function updateSettings(
  payload: import("@/lib/types").SettingsData
): Promise<import("@/lib/types").SettingsData> {
  return await saveSettingsToSupabase(payload);
}

