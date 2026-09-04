export type LeadTemperature = "HOT" | "WARM" | "COLD" | "UNQUALIFIED";

export type QualificationStatus =
  | "NEW"
  | "INTENT_DETECTED"
  | "QUALIFYING"
  | "QUALIFIED"
  | "CONDITIONALLY_QUALIFIED"
  | "UNQUALIFIED";

export type PipelineStage =
  | "NEW_OPPORTUNITY"
  | "QUALIFYING"
  | "QUALIFIED"
  | "CALL_BOOKED"
  | "CALL_COMPLETED"
  | "DIAGNOSIS"
  | "OFFER_PRESENTED"
  | "DECISION"
  | "WON"
  | "FOLLOW_UP"
  | "NURTURE"
  | "LOST";

export type ObjectionCategory =
  | "PRICE"
  | "TRUST"
  | "TIMING"
  | "FIT"
  | "RISK"
  | "AUTHORITY"
  | "MECHANISM"
  | "PREVIOUS_EXPERIENCE"
  | "PRIORITY"
  | "INFORMATION_GAP";

export interface Lead {
  id: string;
  anonymousVisitorId?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role?: string;
  
  // Cross-module Data Lineage
  originalSource: string;
  originalContent: string;
  originalKeyword: string;
  originalFunnel: string;
  
  // Legacy / Mock Compatibility
  contactInfo?: string;
  source?: string;
  acquisitionChannel?: string;
  acquisitionCampaign?: string;
  
  lastTouch: string;
  temperature: LeadTemperature;
  qualificationStatus: QualificationStatus;
  
  // Conversion state
  problem: string;
  desiredOutcome: string;
  buyingTrigger: string;
  objections: string[];
  offerInterest: string;
  ownerAction: string;
  nextAction: string;

  createdAt: string;
  updatedAt: string;
}

export interface LeadQualification {
  leadId: string;
  problemFit: "Strong" | "Medium" | "Weak";
  audienceFit: "Strong" | "Medium" | "Weak";
  stageFit: "Strong" | "Medium" | "Weak";
  offerFit: "Strong" | "Medium" | "Weak";
  urgency: "High" | "Medium" | "Low";
  desiredOutcome: string;
  buyingTrigger: string;
  decisionAuthority: boolean;
  investmentReadiness: "High" | "Medium" | "Low";
  previousAttempts: string;
  riskIndicators: string[];
  constraintConflict: string;
  status: QualificationStatus;
  reasoningSummary: string;
  recommendedAction: string;
}

export interface Opportunity {
  id: string;
  leadId: string;
  offerId: string; // From Foundation
  pipelineStage: PipelineStage;
  estimatedValue: number;
  probability: number; // 0-100
  expectedCloseDate: string;
  problem: string;
  desiredOutcome: string;
  qualificationNote: string;
  buyingTrigger: string;
  objections: ObjectionCategory[];
  followUpState: "DUE" | "TODAY" | "UPCOMING" | "OVERDUE" | "COMPLETED" | "SKIPPED";
  owner: string;
  nextAction: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  lostReason?: string;
  wonReason?: string;
}

export interface SalesCall {
  id: string;
  opportunityId: string;
  scheduledDate: string;
  status: "SCHEDULED" | "SHOWED" | "NO_SHOW" | "CANCELLED" | "RESCHEDULED";
  situation: string;
  problem: string;
  impact: string;
  desiredOutcome: string;
  previousAttempts: string;
  beliefs: string;
  buyingTrigger: string;
  objections: string;
  fit: string;
  outcome?: "Qualified — Offer Appropriate" | "Qualified — Follow-up" | "Nurture" | "Not Qualified" | "Lost" | "Won";
}

export interface ObjectionRecord {
  id: string;
  leadId: string;
  opportunityId: string;
  category: ObjectionCategory;
  objection: string;
  context: string;
  response: string;
  outcome: "OVERCOME" | "STALL" | "LOST";
}

export interface ReactivationCandidate {
  id: string;
  opportunityId: string;
  leadId: string;
  originalObjection: string;
  lastInteraction: string;
  priorityScore: number;
  aiSuggestedMessage: string;
  humanApprovalRequired: boolean;
}

export interface ActionQueueItem {
  id: string;
  type: "HOT_LEAD" | "CALL_DUE" | "NO_BOOKING" | "OFFER_DECISION" | "FOLLOWUP" | "STALE_LEAD" | "LOST_OPPORTUNITY" | "REACTIVATION";
  title: string;
  description: string;
  urgency: "HIGH" | "MEDIUM" | "LOW";
  targetRoute: string; // e.g., "/conversion/leads/L123"
}
