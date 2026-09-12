/**
 * ASENZO Global Types - Phase 5.4
 * Frozen abstraction of the Application Domain Model
 */

export * from "./acquisition";
export * from "./delivery";
import { ContentItem } from "./acquisition";

export type AutomationStatus =
  | "NOT_CONFIGURED"
  | "CONNECTED"
  | "READY"
  | "RUNNING"
  | "SUCCESS"
  | "PARTIAL"
  | "FAILED"
  | "DISABLED"
  | "REQUIRES_REVIEW";

export interface ActionItem {
  id: string;
  title: string;
  subtitle?: string;
  type: "review" | "approve" | "investigate" | "follow_up";
  priority: "high" | "medium" | "low";
  timestamp: string;
}

export interface MetricCard {
  title: string;
  value: string;
  deltaText?: string;
  deltaTrend?: "up" | "down" | "neutral";
  iconName?: string;
}

// ============== COMMAND CENTER ==============
export interface CommandCenterData {
  primaryConstraint: string;
  weeklyDirective: string;
  founderIndependenceScore: number;
  pulseMetrics: MetricCard[];
  actionQueue: ActionItem[];
  automationStatus: Record<string, AutomationStatus>;
}

// ============== FOUNDATION ==============
export interface CoreDNA {
  businessName: string;
  businessDescription: string;
  businessModel: string;
  coreProblemSolved: string;
  primaryTransformation: string;
  differentiation: string;
  positioning: string;
}

export interface ICP {
  description: string;
  industry: string;
  painPoints: string[];
  desiredOutcomes: string[];
  disqualifiers: string[];
}

export interface Offer {
  overview: string;
  problem: string;
  transformation: string;
  deliverables: string[];
  proof: string;
}

export interface FoundationData {
  coreDna: CoreDNA;
  icp: ICP;
  offer: Offer;
  brandVoice: {
    tone: string;
    terminology: string[];
    avoidWords: string[];
  };
  founderVoice: {
    configured: boolean;
    cadence: string;
    phrases: string[];
    neverSay: string[];
  };
  readiness: {
    percentage: number;
    status: "Not Started" | "Incomplete" | "Partially Configured" | "Ready" | "Highly Ready";
    missingItems: string[];
  };
  // Detailed Strategic Context (New Extensions)
  businessContext?: any;
  customerContext?: any;
  positioningContext?: any;
  offerContext?: any;
  brandContext?: any;
  knowledge?: any[];
  proofSettings?: any[];
}

// ============== ATTENTION ==============
export interface MarketSignal {
  id: string;
  topic: string;
  signalText: string;
  source: string;
}

// AI Integration Interface for n8n (for frontend documentation)
export interface GenerateIdeaRequest {
  workspaceId: string;
  icp: string;
  awarenessStage: string;
  funnelStage: string;
  contentPillar: string;
  objective: string;
  channel: string;
  format: string;
  cta: string;
  offer: string;
  topic?: string;
  requestedCount: number;
}

export interface AttentionData {
  ideas: ContentItem[];
  marketSignals: MarketSignal[];
}

// ============== CONVERSION ==============
export type OpportunityStage = "QUALIFIED" | "CALL_SCHEDULED" | "CALL_COMPLETED" | "PROPOSAL" | "CLOSED_WON";

export interface Qualification {
  fit: string;
  problem: string;
  urgency: string;
  authority: string;
  budget: string;
  disqualifiers?: string;
}

export interface SalesCall {
  status: "TBD" | "SCHEDULED" | "COMPLETED" | "NO_SHOW";
  date?: string;
  notes?: string;
  transcript?: string;
  outcome?: string;
}

export interface Objection {
  id: string;
  category: "Price" | "Timing" | "Fit" | "Authority" | "Trust" | "Other";
  objectionText: string;
  severity: "low" | "medium" | "high";
  responseGuidance?: string;
  resolutionStatus: "unresolved" | "addressed" | "resolved";
}

export interface FollowUp {
  id: string;
  opportunityId?: string;
  conversationId?: string;
  contactId?: string;
  owner: string;
  reason: string;
  dueDate: string;
  priority: "low" | "medium" | "high" | "urgent";
  recommendedAction?: string;
  status: "PENDING" | "DUE" | "OVERDUE" | "COMPLETED" | "CANCELLED" | "SNOOZED";
  nextAction?: string;
  createdDate?: string;
  completedDate?: string;
}


export interface Proposal {
  status: "DRAFT" | "APPROVED" | "SENT" | "ACCEPTED" | "REJECTED";
  offerContext: string;
  scopeConstraints: string;
  preparationState: string;
}

export interface Opportunity {
  id: string;
  leadId?: string;
  leadName: string;
  company: string;
  title: string;
  value: number;
  stage: OpportunityStage;
  qualification: Qualification;
  salesCall: SalesCall;
  objections: Objection[];
  proposal?: Proposal;
  lastActivity: string;
  nextAction: string;
  daysInactive: number;
  priority: "routine" | "high" | "critical";
  intelligenceSignal?: string;
}

export interface ConversionConversation {
  id: string;
  leadId?: string;
  contact?: string;
  company: string;
  source: string;
  campaign: string;
  status: "NEW" | "CONTACTED" | "REPLIED" | "ENGAGED" | "DISCOVERY" | "QUALIFIED" | "OPPORTUNITY" | "CLOSED_WON" | "NOT_INTERESTED" | "NOT_NOW" | "UNQUALIFIED" | "LOST" | "UNRESPONSIVE";
  owner: string;
  lastInteraction: string;
  lastMessage: string;
  nextAction: string;
  followUpDate?: string;
  opportunityId?: string;
  dealValue?: number;
  bookingStatus?: string;
  createdDate: string;
  updatedDate: string;
}

export interface Activity {
  id: string;
  type: "Call" | "Meeting" | "Email" | "Message" | "Note" | "Follow-up" | "Proposal" | "Task" | "Status change";
  timestamp: string;
  description: string;
  owner: string;
  contactName: string;
  conversationId?: string;
  opportunityId?: string;
}

export interface ConversionApplication {
  id: string;
  leadId: string;
  applicant: string;
  company: string;
  icpFit: string;
  problem: string;
  budget: string;
  timeline: string;
  status: "STARTED" | "SUBMITTED" | "UNDER_REVIEW" | "QUALIFIED" | "NEEDS_INFORMATION" | "REJECTED" | "APPROVED" | "BOOKING_REQUIRED" | "SALES_READY";
  owner: string;
  recommendedRoute?: string;
}

export interface ConversionBooking {
  id: string;
  leadId: string;
  callType: string;
  status: "BOOKING_REQUESTED" | "BOOKED" | "CONFIRMED" | "RESCHEDULED" | "CANCELLED" | "NO_SHOW" | "COMPLETED";
  bookedDate: string;
  callDate: string;
  owner: string;
  source: string;
  campaign: string;
  showStatus?: string;
  outcome?: string;
}

export interface ConversionNurtureRecord {
  id: string;
  leadId: string;
  segment: "NOT_READY" | "TIMING" | "BUDGET" | "NEEDS_TRUST" | "NEEDS_EDUCATION" | "COMPARING_OPTIONS" | "WAITLIST" | "LOW_PRIORITY";
  status: "ACTIVE" | "PAUSED" | "EXITED";
  lastInteraction: string;
  reengagementDate: string;
  owner: string;
  sequenceName: string;
}

export interface ConversionAsset {
  id: string;
  name: string;
  type: "Lead Magnet" | "Form" | "Booking" | "VSL" | "Sales Page" | "Proof" | "Calculator" | "Audit";
  icp: string;
  awarenessStage: string;
  conversions: number;
  status: "ACTIVE" | "ARCHIVED";
}

export interface ConversionData {
  pipelineValue: number;
  conversations: ConversionConversation[];
  activities: Activity[];
  opportunities: Opportunity[];
  followUps: FollowUp[];
  applications: ConversionApplication[];
  bookings: ConversionBooking[];
  nurtureRecords: ConversionNurtureRecord[];
  assets: ConversionAsset[];
}

// ============== REVENUE ==============
export type RevenueDealStage = "QUALIFIED" | "CALL_BOOKED" | "CALL_HELD" | "PROPOSAL_SENT" | "NEGOTIATION" | "CLOSED_WON" | "CLOSED_LOST";

export interface RevenueDeal {
  id: string;
  leadId: string;
  contact: string;
  company: string;
  owner: string;
  value: number;
  currency: string;
  expectedCloseDate: string;
  stage: RevenueDealStage;
  nextAction: string;
  nextActionDate?: string;
  lastActivity: string;
  source: string;
  campaign: string;
  originalContent?: string;
  icp: string;
  offer: string;
  confidence: "LOW" | "MEDIUM" | "HIGH";
  stageAge: number;
  createdDate: string;
  updatedDate: string;
  probability: number;
}

export interface RevenueProposal {
  id: string;
  dealId: string;
  offer: string;
  scope: string;
  price: number;
  status: "DRAFT" | "INTERNAL_REVIEW" | "APPROVED" | "SENT" | "VIEWED" | "NEGOTIATION" | "ACCEPTED" | "REJECTED" | "EXPIRED";
  sentDate?: string;
  viewedDate?: string;
  expirationDate?: string;
}

export interface RevenueFollowUp {
  id: string;
  dealId: string;
  owner: string;
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  reason: string;
  status: "PENDING" | "DUE" | "OVERDUE" | "COMPLETED" | "WAITING_ON_BUYER" | "WAITING_INTERNAL";
  nextAction: string;
}

export interface RevenueObjection {
  id: string;
  objection: string;
  recommendedResponse: string;
  frequency: number;
  winLossImpact: string;
  relatedOffer: string;
}

export interface RevenuePlaybook {
  id: string;
  name: string;
  stage: string;
  purpose: string;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED";
}

export interface RevenueLostDeal {
  id: string;
  dealId: string;
  value: number;
  stageLost: string;
  reason: string;
  objection: string;
  competitor?: string;
  dateLost: string;
}

export interface RevenueData {
  pipelineValue: number;
  weightedPipeline: number;
  expectedRevenue: number;
  closedWon: number;
  closedLost: number;
  winRate: number;
  deals: RevenueDeal[];
  proposals: RevenueProposal[];
  followUps: RevenueFollowUp[];
  objections: RevenueObjection[];
  playbooks: RevenuePlaybook[];
  lostDeals: RevenueLostDeal[];
}

/// ============== DELIVERY & CLIENT OS ==============
// Migrated to src/lib/types/delivery.ts

// ============== OPERATIONS ==============

export type OperationsPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type OperationsWorkStatus = "BACKLOG" | "NOT_STARTED" | "IN_PROGRESS" | "WAITING" | "BLOCKED" | "IN_REVIEW" | "COMPLETED" | "CANCELLED";
export type OperationsApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | "CHANGES_REQUESTED" | "CANCELLED";
export type OperationsSOPStatus = "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";
export type OperationsIssueStatus = "OPEN" | "INVESTIGATING" | "ACTION_REQUIRED" | "ESCALATED" | "RESOLVED" | "CLOSED";
export type OperationsIssueSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type OperationsQCStatus = "PENDING" | "PASSED" | "FAILED" | "REWORK" | "APPROVED";
export type ModuleSource = "Foundation" | "Attention" | "Acquisition" | "Conversion" | "Revenue" | "Delivery" | "Operations" | "Intelligence" | "Command";

export interface OperationsTeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  managerId?: string;
  skills: string[];
  capacity: number; // Max capacity
  workload: number; // Current assigned hours or %
  status: "ACTIVE" | "INACTIVE" | "ON_LEAVE";
}

export interface OperationsRole {
  id: string;
  title: string;
  department: string;
  primaryOwnerId?: string;
  backupOwnerId?: string;
  escalationOwnerId?: string;
  responsibilities: string[];
}

export interface OperationsWork {
  id: string;
  title: string;
  description: string;
  sourceModule: ModuleSource;
  sourceEntityId?: string;
  workType: string;
  ownerId?: string;
  teamId?: string;
  priority: OperationsPriority;
  status: OperationsWorkStatus;
  startDate?: string;
  dueDate: string;
  estimatedEffort?: number;
  actualEffort?: number;
  dependencies?: string[];
  blocker?: string;
  relatedClientId?: string;
  relatedProjectId?: string;
  relatedSopId?: string;
  relatedWorkflowId?: string;
  comments?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface OperationsUpdate {
  id: string;
  userId: string;
  teamId?: string;
  date: string;
  completed: string;
  inProgress: string;
  blocked: string;
  needsHelp: string;
  notes: string;
}

export interface OperationsSOP {
  id: string;
  name: string;
  purpose: string;
  ownerId?: string;
  department?: string;
  processSteps: string[];
  status: OperationsSOPStatus;
  version: string;
  lastReviewedDate: string;
  nextReviewDate: string;
}

export interface OperationsWorkflow {
  id: string;
  name: string;
  triggerEvent: string;
  steps: { id: string; name: string; ownerId?: string; }[];
  ownerId?: string;
  approverId?: string;
  slaHours?: number;
}

export interface OperationsApproval {
  id: string;
  request: string;
  requestedBy: string;
  approverId: string;
  priority: OperationsPriority;
  status: OperationsApprovalStatus;
  createdAt: string;
  dueDate: string;
  decisionDate?: string;
  comments?: string;
  relatedEntityId?: string;
}

export interface OperationsQC {
  id: string;
  title: string;
  ownerId: string;
  reviewerId: string;
  standard: string;
  status: OperationsQCStatus;
  score?: number;
  issues?: string;
  correction?: string;
  reviewedDate?: string;
}

export interface OperationsIssue {
  id: string;
  title: string;
  type: "Issue" | "Risk" | "Blocker" | "Escalation";
  severity: OperationsIssueSeverity;
  ownerId?: string;
  sourceModule: ModuleSource;
  relatedEntityId?: string;
  description: string;
  impact: string;
  createdAt: string;
  dueDate?: string;
  resolution?: string;
  status: OperationsIssueStatus;
}

export interface OperationsPlan {
  id: string;
  title: string;
  description?: string;
  type: "Initiative" | "Internal Project" | "Deadline" | "Event";
  startDate: string;
  dueDate: string;
  ownerId?: string;
  status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "DELAYED";
}

export interface OperationsData {
  team: OperationsTeamMember[];
  roles: OperationsRole[];
  work: OperationsWork[];
  updates: OperationsUpdate[];
  sops: OperationsSOP[];
  workflows: OperationsWorkflow[];
  approvals: OperationsApproval[];
  qc: OperationsQC[];
  issues: OperationsIssue[];
  planning: OperationsPlan[];
}

// ============== CALENDAR ==============

export type CalendarEventStatus = "SCHEDULED" | "CONFLICT" | "MISSED" | "COMPLETED";
export type CalendarPriority = "STANDARD" | "HIGH" | "URGENT";

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  status: CalendarEventStatus;
  priority: CalendarPriority;
  owner: string;
  date: string;
  startTime: string;
  endTime: string;
  sourceModule?: "Conversion" | "Delivery" | "Retention" | "Revenue" | "Operator" | "Attention";
  linkedContext?: string;
  intelligenceSignal?: string;
  recommendedAction?: string;
}

export interface CalendarData {
  events: CalendarEvent[];
}

// ============== SETTINGS (Phase 5.14) ==============

export type NotificationPriorityThreshold = "ALL" | "IMPORTANT" | "CRITICAL_ONLY" | "NONE";

export interface UserProfile {
  displayName: string;
  role: string;
  email: string;
}

export interface NotificationSettings {
  emailAlertsEnabled: boolean;
  inAppAlertsEnabled: boolean;
  digestFrequency: "DAILY" | "WEEKLY" | "NEVER";
  priorityThreshold: NotificationPriorityThreshold;
}

export interface SystemPreferences {
  defaultTimezone: string;
  enableAutoDelegationRouting: boolean; // static mock concept
  intelligenceAggressiveness: "CONSERVATIVE" | "BALANCED" | "PROACTIVE";
}

export interface SettingsData {
  profile: UserProfile;
  notifications: NotificationSettings;
  system: SystemPreferences;
  intelligenceSignal?: string;
}

// ============== INTELLIGENCE CENTER (Phase 6) ==============

export type ConfidenceLevel = "HIGH" | "MEDIUM" | "LOW";

export type OperatingItemType = 'CONSTRAINT' | 'OPPORTUNITY' | 'RISK' | 'RECOMMENDATION';

export type OperatingItemStatus =
  | 'DETECTED' | 'DIAGNOSING' | 'PLANNED' | 'IN_PROGRESS'
  | 'BLOCKED' | 'MONITORING' | 'RESOLVED' | 'DISMISSED';

export interface OperatingItem {
  id: string;
  workspaceId: string;
  type: OperatingItemType;
  title: string;
  description: string;
  sourceCenter: ModuleSource;
  sourceEntityType?: string;
  sourceEntityId?: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  impact: string;
  confidence: ConfidenceLevel;
  detectedAt: string;
  status: OperatingItemStatus;
  owner?: string;
  dueDate?: string;
  recommendedActions: string[];
  selectedAction?: string;
  linkedTasks: string[];
  linkedCenterEntities?: {
    center: ModuleSource;
    entityType: string;
    entityId: string;
  }[];
  activity?: {
    id: string;
    type: string;
    message: string;
    createdAt: string;
    actor?: string;
  }[];
  outcome?: string;
  resolutionEvidence?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IntelligenceInsight {
  id: string;
  sourceModule: ModuleSource;
  sourceRecordId?: string;
  metric: string;
  calculation: string;
  generatedDate: string;
  confidence: ConfidenceLevel;
}

export interface ConstraintRecord {
  id: string;
  constraint: string;
  detectedDate: string;
  resolvedDate?: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  evidence: string;
  affectedCenter: ModuleSource;
  recommendedAction: string;
  resolution?: string;
  result?: string;
  status: "ACTIVE" | "RESOLVED";
}

export interface GrowthOpportunity {
  id: string;
  opportunity: string;
  source: string;
  evidence: string;
  expectedImpact: string;
  confidence: ConfidenceLevel;
  requiredAction: string;
  owner?: string;
  relatedCenter: ModuleSource;
  status: "IDENTIFIED" | "REVIEWING" | "APPROVED" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";
}

export interface RiskRecord {
  id: string;
  risk: string;
  category: "Revenue" | "Pipeline" | "Acquisition" | "Attention" | "Delivery" | "Client" | "Capacity" | "Founder dependency" | "Quality" | "Data" | "Process";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  probability: "HIGH" | "MEDIUM" | "LOW";
  businessImpact: string;
  evidence: string;
  affectedCenter: ModuleSource;
  owner?: string;
  mitigation: string;
  status: "OPEN" | "MONITORING" | "MITIGATING" | "RESOLVED";
}

export interface AttributionRecord {
  id: string;
  source: string;
  leads: number;
  qualified: number;
  opportunities: number;
  won: number;
  revenue: number;
}

export interface ChannelPerformance {
  id: string;
  channel: string;
  reach: number;
  engagementQuality: string;
  leads: number;
  qualifiedLeads: number;
  opportunities: number;
  closedDeals: number;
  revenue: number;
  conversionRate: number;
  revenuePerLead: number;
  revenuePerOpportunity: number;
}

export interface ContentRevenueRecord {
  id: string;
  contentPiece: string;
  contentPillar: string;
  awarenessStage: string;
  funnelRole: string;
  channel: string;
  cta: string;
  reach: number;
  leads: number;
  qualifiedLeads: number;
  opportunities: number;
  deals: number;
  revenueInfluenced: number;
}

export interface FounderDependency {
  score: number; // Percentage 0-100
  majorSources: string[];
  trend: "INCREASING" | "DECREASING" | "STABLE";
  summary: string;
  recommendedAction: string;
}

export interface IntelligenceRecommendation {
  id: string;
  recommendation: string;
  reason: string;
  evidence: string;
  expectedImpact: string;
  confidence: ConfidenceLevel;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  affectedCenter: ModuleSource;
  suggestedOwner?: string;
  requiredAction: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "DEFERRED" | "ASSIGNED" | "CONVERTED_TO_TASK" | "CONVERTED_TO_INITIATIVE";
}

export interface StrategicReview {
  id: string;
  reviewPeriod: "WEEKLY" | "MONTHLY" | "QUARTERLY";
  participants: string[];
  metrics: string[];
  findings: string;
  decisions: string;
  recommendations: string[];
  actions: string[];
  completedStatus: boolean;
  date: string;
}

export interface IntelligenceData {
  pulse: {
    revenue: number;
    pipeline: number;
    qualifiedLeads: number;
    newLeads: number;
    conversionRate: number;
    contentReach: number;
    qualifiedAttention: number;
    clientOutcomes: number;
    retentionRisk: number;
    operationalHealth: string;
  };
  healthMatrix: {
    area: ModuleSource;
    metric: string;
    status: "Healthy" | "Warning" | "Critical";
    trend: "Up" | "Down" | "Stable";
  }[];
  constraints: ConstraintRecord[];
  opportunities: GrowthOpportunity[];
  risks: RiskRecord[];
  attribution: AttributionRecord[];
  channels: ChannelPerformance[];
  contentRevenue: ContentRevenueRecord[];
  founderDependency: FounderDependency;
  recommendations: IntelligenceRecommendation[];
  reviews: StrategicReview[];
}
