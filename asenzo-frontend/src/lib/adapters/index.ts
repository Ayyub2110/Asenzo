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

/**
 * ASENZO API Adapters
 * Thin layer conceptualizing the future Application API.
 * Components must ONLY import these functions, never the raw mock objects.
 */

// Simulated network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getCommandCenter(): Promise<CommandCenterData> {
  await delay(800); // Simulate realistic loading state for UI testing
  return mockCommandCenter;
}

export async function getFoundation(): Promise<FoundationData> {
  await delay(600);
  return mockFoundation;
}

export async function updateFoundation(payload: Partial<FoundationData>): Promise<FoundationData> {
  await delay(800); // Simulate network save
  
  if (payload.coreDna) mockFoundation.coreDna = { ...mockFoundation.coreDna, ...payload.coreDna };
  if (payload.icp) mockFoundation.icp = { ...mockFoundation.icp, ...payload.icp };
  if (payload.offer) mockFoundation.offer = { ...mockFoundation.offer, ...payload.offer };
  if (payload.brandVoice) mockFoundation.brandVoice = { ...mockFoundation.brandVoice, ...payload.brandVoice };
  if (payload.founderVoice) mockFoundation.founderVoice = { ...mockFoundation.founderVoice, ...payload.founderVoice };
  if (payload.readiness) mockFoundation.readiness = { ...mockFoundation.readiness, ...payload.readiness };

  // New Strategic Forms
  if (payload.businessContext) mockFoundation.businessContext = { ...mockFoundation.businessContext, ...payload.businessContext };
  if (payload.customerContext) mockFoundation.customerContext = { ...mockFoundation.customerContext, ...payload.customerContext };
  if (payload.positioningContext) mockFoundation.positioningContext = { ...mockFoundation.positioningContext, ...payload.positioningContext };
  if (payload.offerContext) mockFoundation.offerContext = { ...mockFoundation.offerContext, ...payload.offerContext };
  if (payload.brandContext) mockFoundation.brandContext = { ...mockFoundation.brandContext, ...payload.brandContext };
  if (payload.knowledge) mockFoundation.knowledge = [ ...payload.knowledge ];
  if (payload.proofSettings) mockFoundation.proofSettings = [ ...payload.proofSettings ];


  return { ...mockFoundation }; // Return fresh ref
}

export async function getAttention(): Promise<AttentionData> {
  await delay(700);
  return mockAttention;
}

export async function updateAttention(payload: AttentionData): Promise<AttentionData> {
  await delay(700);
  // Basic mock mutation mapping
  mockAttention.ideas = [...payload.ideas];
  return { ...mockAttention }; // Return fresh ref to trigger component updates
}

export async function getConversion(): Promise<ConversionData> {
  await delay(500);
  return mockConversion;
}

export async function updateOpportunity(payload: Opportunity): Promise<ConversionData> {
  await delay(600);
  mockConversion.opportunities = mockConversion.opportunities.map(o => o.id === payload.id ? payload : o);
  return { ...mockConversion };
}

export async function updateQualification(oppId: string, payload: import("@/lib/types").Qualification): Promise<ConversionData> {
  await delay(500);
  mockConversion.opportunities = mockConversion.opportunities.map(o => o.id === oppId ? { ...o, qualification: payload } : o);
  return { ...mockConversion };
}

export async function updateSalesCall(oppId: string, payload: import("@/lib/types").SalesCall): Promise<ConversionData> {
  await delay(500);
  mockConversion.opportunities = mockConversion.opportunities.map(o => o.id === oppId ? { ...o, salesCall: payload } : o);
  return { ...mockConversion };
}

export async function updateProposal(oppId: string, payload: import("@/lib/types").Proposal): Promise<ConversionData> {
  await delay(700);
  mockConversion.opportunities = mockConversion.opportunities.map(o => o.id === oppId ? { ...o, proposal: payload } : o);
  return { ...mockConversion };
}

export async function updateFollowUp(payload: import("@/lib/types").FollowUp): Promise<ConversionData> {
  await delay(400);
  mockConversion.followUps = mockConversion.followUps.map(f => f.id === payload.id ? payload : f);
  return { ...mockConversion };
}

export async function getDelivery(): Promise<import("@/lib/types").DeliveryData> {
  await delay(600);
  return mockDelivery;
}

// ============== REVENUE ==============

export async function getRevenue(): Promise<import("@/lib/types").RevenueData> {
  await delay(800);
  return { ...mockRevenue };
}

// In a real application, you would have updateDeal, updateProposal, etc.
// Here we just map the get adapter to represent API latency.

// ============== OPERATIONS ==============

export async function getOperations(): Promise<import("@/lib/types").OperationsData> {
  await delay(800);
  return { ...mockOperations };
}

// ============== CALENDAR ==============

export async function getCalendar(): Promise<import("@/lib/types").CalendarData> {
  await delay(800);
  return { ...mockCalendar };
}


// ============== INTELLIGENCE ==============

export async function getIntelligence(): Promise<import("@/lib/types").IntelligenceData> {
  await delay(1200);
  return { ...mockIntelligence };
}

export async function updateCalendarEvent(payload: import("@/lib/types").CalendarEvent): Promise<import("@/lib/types").CalendarData> {
  await delay(700);
  if (Math.random() > 0.95) throw new Error("Synchronization conflict: Please retry.");

  const idx = mockCalendar.events.findIndex(e => e.id === payload.id);
  if (idx > -1) {
    mockCalendar.events[idx] = { ...payload };
  }
  return { ...mockCalendar };
}

export async function completeCalendarEvent(eventId: string): Promise<import("@/lib/types").CalendarData> {
  await delay(500);
  if (Math.random() > 0.95) throw new Error("Failed to finalize event status.");

  const idx = mockCalendar.events.findIndex(e => e.id === eventId);
  if (idx > -1) {
    mockCalendar.events[idx].status = "COMPLETED";
  }
  return { ...mockCalendar };
}

// ============== SETTINGS (Phase 5.14) ==============

export async function getSettings(): Promise<import("@/lib/types").SettingsData> {
  await delay(600);
  return { ...mockSettings };
}

export async function updateSettings(
  payload: import("@/lib/types").SettingsData
): Promise<import("@/lib/types").SettingsData> {
  await delay(800);
  if (Math.random() > 0.95) throw new Error("Failed to persist system configurations.");

  mockSettings.profile = { ...payload.profile };
  mockSettings.notifications = { ...payload.notifications };
  mockSettings.system = { ...payload.system };
  
  return { ...mockSettings };
}
