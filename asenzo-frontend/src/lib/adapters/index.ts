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
  mockRetention,
  mockRevenue,
  mockOperator,
  mockCalendar,
  mockSettings
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

export async function getDelivery(): Promise<DeliveryData> {
  await delay(600);
  return mockDelivery;
}

export async function updateDeliveryEngagement(payload: DeliveryEngagement): Promise<DeliveryData> {
  await delay(600);
  if (Math.random() > 0.95) throw new Error("Simulated network latency. Retry.");
  mockDelivery.engagements = mockDelivery.engagements.map(e => e.id === payload.id ? payload : e);
  return { ...mockDelivery };
}

export async function completeDeliveryMilestone(engagementId: string, milestoneId: string): Promise<DeliveryData> {
  await delay(500);
  if (Math.random() > 0.95) throw new Error("Fulfillment failure. Retry.");
  mockDelivery.engagements = mockDelivery.engagements.map(e => {
    if (e.id === engagementId) {
       return {
         ...e,
         milestones: e.milestones.map(m => m.id === milestoneId ? { ...m, status: "completed" as const } : m)
       };
    }
    return e;
  });
  return { ...mockDelivery };
}

export async function resolveDeliveryBlocker(engagementId: string, blockerId: string): Promise<DeliveryData> {
  await delay(800);
  mockDelivery.engagements = mockDelivery.engagements.map(e => {
    if (e.id === engagementId) {
       return {
         ...e,
         blockers: e.blockers.map(b => b.id === blockerId ? { ...b, status: "resolved" as const } : b)
       };
    }
    return e;
  });
  return { ...mockDelivery };
}

// Helper to simulate action executions and error states
export async function executeAction(actionId: string): Promise<{ success: boolean; message: string }> {
  await delay(1000);
  
  // Randomize a 5% failure rate to allow testing UI error boundaries
  if (Math.random() > 0.95) {
    throw new Error("Simulated network failure. Backend unreachable.");
  }
  
  return { success: true, message: `Action ${actionId} executed successfully.` };
}

// ============== RETENTION ==============

export async function getRetention(): Promise<import("@/lib/types").RetentionData> {
  await delay(800);
  return { ...mockRetention };
}

export async function updateRetentionEngagement(payload: import("@/lib/types").RetentionEngagement): Promise<import("@/lib/types").RetentionData> {
  await delay(1000);
  if (Math.random() > 0.95) throw new Error("Latency failure saving relationship details. Try again.");
  const index = mockRetention.engagements.findIndex(e => e.id === payload.id);
  if (index !== -1) {
    mockRetention.engagements[index] = { ...payload };
  }
  return { ...mockRetention };
}

export async function updateRetentionGoal(engagementId: string, payload: import("@/lib/types").RetentionGoal): Promise<import("@/lib/types").RetentionData> {
  await delay(800);
  if (Math.random() > 0.95) throw new Error("Failed to update goal. Retry.");
  
  const idx = mockRetention.engagements.findIndex(e => e.id === engagementId);
  if (idx > -1) {
    const goalsIdx = mockRetention.engagements[idx].goals.findIndex(g => g.id === payload.id);
    if (goalsIdx > -1) {
      mockRetention.engagements[idx].goals[goalsIdx] = { ...payload };
    }
  }
  return { ...mockRetention };
}

export async function addRetentionInteraction(engagementId: string, payload: import("@/lib/types").RetentionInteraction): Promise<import("@/lib/types").RetentionData> {
  await delay(600);
  if (Math.random() > 0.95) throw new Error("Could not log interaction.");
  
  const idx = mockRetention.engagements.findIndex(e => e.id === engagementId);
  if (idx > -1) {
    mockRetention.engagements[idx].interactions.unshift({ ...payload });
    mockRetention.engagements[idx].lastInteractionDate = payload.date; // Automatically update last interaction date
  }
  return { ...mockRetention };
}

export async function updateRetentionRisk(engagementId: string, payload: import("@/lib/types").RetentionRisk): Promise<import("@/lib/types").RetentionData> {
  await delay(700);
  if (Math.random() > 0.95) throw new Error("Failed to update risk.");
  
  const idx = mockRetention.engagements.findIndex(e => e.id === engagementId);
  if (idx > -1) {
    const rIdx = mockRetention.engagements[idx].risks.findIndex(r => r.id === payload.id);
    if (rIdx > -1) {
      mockRetention.engagements[idx].risks[rIdx] = { ...payload };
    }
  }
  return { ...mockRetention };
}

export async function updateRetentionAction(engagementId: string, payload: import("@/lib/types").RetentionNextAction): Promise<import("@/lib/types").RetentionData> {
  await delay(500);
  if (Math.random() > 0.95) throw new Error("Failed to clear action.");
  
  const idx = mockRetention.engagements.findIndex(e => e.id === engagementId);
  if (idx > -1) {
    mockRetention.engagements[idx].nextAction = { ...payload };
  }
  return { ...mockRetention };
}

// ============== REVENUE ==============

export async function getRevenue(): Promise<import("@/lib/types").RevenueData> {
  await delay(800);
  return { ...mockRevenue };
}

export async function updateRevenueEngagement(payload: import("@/lib/types").RevenueEngagement): Promise<import("@/lib/types").RevenueData> {
  await delay(1000);
  if (Math.random() > 0.95) throw new Error("Simulated latency failure saving revenue details.");
  
  const idx = mockRevenue.engagements.findIndex(e => e.id === payload.id);
  if (idx > -1) {
    mockRevenue.engagements[idx] = { ...payload };
  }
  return { ...mockRevenue };
}

export async function updateRevenueItem(engagementId: string, payload: import("@/lib/types").RevenueItem): Promise<import("@/lib/types").RevenueData> {
  await delay(800);
  if (Math.random() > 0.95) throw new Error("Simulated payment system latency.");

  const idx = mockRevenue.engagements.findIndex(e => e.id === engagementId);
  if (idx > -1) {
    const itemIdx = mockRevenue.engagements[idx].items.findIndex(i => i.id === payload.id);
    if (itemIdx > -1) {
      mockRevenue.engagements[idx].items[itemIdx] = { ...payload };
    }
  }
  return { ...mockRevenue };
}

export async function resolveRevenueRisk(engagementId: string, riskId: string): Promise<import("@/lib/types").RevenueData> {
  await delay(600);
  if (Math.random() > 0.95) throw new Error("Conflict resolving risk. State out of sync.");

  const idx = mockRevenue.engagements.findIndex(e => e.id === engagementId);
  if (idx > -1) {
    const riskIdx = mockRevenue.engagements[idx].risks.findIndex(r => r.id === riskId);
    if (riskIdx > -1) {
      mockRevenue.engagements[idx].risks[riskIdx].status = "RESOLVED";
    }
  }
  return { ...mockRevenue };
}

export async function updateRevenueNextAction(engagementId: string, actionId: string): Promise<import("@/lib/types").RevenueData> {
  await delay(500);
  if (Math.random() > 0.95) throw new Error("Could not update action status.");

  const idx = mockRevenue.engagements.findIndex(e => e.id === engagementId);
  if (idx > -1) {
    if (mockRevenue.engagements[idx].nextAction?.id === actionId) {
       mockRevenue.engagements[idx].nextAction!.status = "COMPLETED";
    }
  }
  return { ...mockRevenue };
}

// ============== OPERATOR ==============

export async function getOperator(): Promise<import("@/lib/types").OperatorData> {
  await delay(800);
  return { ...mockOperator };
}

export async function updateOperatorItem(payload: import("@/lib/types").OperatorItem): Promise<import("@/lib/types").OperatorData> {
  await delay(700);
  if (Math.random() > 0.95) throw new Error("Operator sync conflict. Please try again.");

  const idx = mockOperator.items.findIndex(i => i.id === payload.id);
  if (idx > -1) {
    mockOperator.items[idx] = { ...payload };
  }
  return { ...mockOperator };
}

export async function completeOperatorItem(itemId: string): Promise<import("@/lib/types").OperatorData> {
  await delay(500);
  if (Math.random() > 0.95) throw new Error("Latency resolving operator task.");

  const idx = mockOperator.items.findIndex(i => i.id === itemId);
  if (idx > -1) {
    mockOperator.items[idx].status = "COMPLETED";
  }
  return { ...mockOperator };
}

// ============== CALENDAR ==============

export async function getCalendar(): Promise<import("@/lib/types").CalendarData> {
  await delay(800);
  return { ...mockCalendar };
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
