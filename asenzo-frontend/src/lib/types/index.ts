/**
 * ASENZO Global Types - Phase 5.4
 * Frozen abstraction of the Application Domain Model
 */

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
}

// ============== ATTENTION ==============
export interface MarketSignal {
  id: string;
  topic: string;
  signalText: string;
  source: string;
}

export interface ContentIdea {
  id: string;
  title: string;
  stage: "TOF" | "MOF" | "BOF";
  status: "idea" | "drafting" | "requires_review" | "approved" | "published";
  framework: string;
  angle?: string;
  outputGoal?: string;
  contentDraft?: string;
  marketSignalRef?: string;
}

export interface AttentionData {
  ideas: ContentIdea[];
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
  opportunityId: string;
  reason: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  recommendedAction?: string;
  status: "PENDING" | "DUE" | "OVERDUE" | "COMPLETED";
}

export interface Proposal {
  status: "DRAFT" | "APPROVED" | "SENT" | "ACCEPTED" | "REJECTED";
  offerContext: string;
  scopeConstraints: string;
  preparationState: string;
}

export interface Opportunity {
  id: string;
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

export interface ConversionData {
  pipelineValue: number;
  opportunities: Opportunity[];
  followUps: FollowUp[];
}

// ============== DELIVERY ==============
export type DeliveryStatus = "NOT_STARTED" | "ON_TRACK" | "AT_RISK" | "BLOCKED" | "COMPLETED";

export interface DeliveryMilestone {
  id: string;
  engagementId: string;
  title: string;
  description: string;
  dueDate: string;
  status: "pending" | "in_progress" | "completed";
  owner: string;
}

export interface DeliveryBlocker {
  id: string;
  engagementId: string;
  type: "client_dependency" | "internal_execution" | "scope" | "other";
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "active" | "resolved";
  recommendedAction?: string;
  affectedMilestoneId?: string;
}

export interface DeliveryEngagement {
  id: string;
  clientName: string;
  engagementType: string;
  status: DeliveryStatus;
  startDate: string;
  targetCompletion: string;
  owner: string;
  milestones: DeliveryMilestone[];
  blockers: DeliveryBlocker[];
  intelligenceSignal?: string;
}

export interface DeliveryData {
  engagements: DeliveryEngagement[];
}

// ============== RETENTION ==============

export type RetentionStatus = "NOT_STARTED" | "HEALTHY" | "NEEDS_ATTENTION" | "AT_RISK" | "COMPLETED";

export type RetentionHealth = "HEALTHY" | "WATCH" | "AT_RISK";

export interface RetentionGoal {
  id: string;
  title: string;
  description: string;
  currentState: string;
  owner: string;
  targetDate: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "ACHIEVED" | "AT_RISK";
}

export interface RetentionInteraction {
  id: string;
  date: string;
  type: "CALL" | "EMAIL" | "MEETING" | "CHECK_IN" | "DELIVERY_UPDATE" | "OTHER";
  summary: string;
  outcome?: string;
  owner: string;
}

export interface RetentionRisk {
  id: string;
  title: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  status: "OPEN" | "MONITORING" | "RESOLVED";
  recommendedAction?: string;
}

export interface RetentionNextAction {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  owner: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

export interface RetentionEngagement {
  id: string;
  clientName: string;
  status: RetentionStatus;
  owner: string;
  startDate: string;
  lastInteractionDate: string;
  relationshipSummary: string;
  health: RetentionHealth;
  goals: RetentionGoal[];
  interactions: RetentionInteraction[];
  risks: RetentionRisk[];
  nextAction?: RetentionNextAction;
  intelligenceSignal?: string;
}

export interface RetentionData {
  engagements: RetentionEngagement[];
}

// ============== REVENUE ==============

export type RevenueStatus = "NOT_STARTED" | "ON_TRACK" | "AT_RISK" | "OVERDUE" | "COLLECTED";

export interface RevenueItem {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: "PENDING" | "DUE" | "OVERDUE" | "AT_RISK" | "COLLECTED";
  owner: string;
  description: string;
}

export interface RevenueRisk {
  id: string;
  title: string;
  description: string;
  status: "OPEN" | "RESOLVED";
}

export interface RevenueNextAction {
  id: string;
  title: string;
  description: string;
  owner: string;
  dueDate: string;
  status: "PENDING" | "COMPLETED";
}

export interface RevenueEngagement {
  id: string;
  customerName: string;
  owner: string;
  linkedContext: string;
  status: RevenueStatus;
  amount: number;
  currency: string;
  dueDate: string;
  description: string;
  intelligenceSignal?: string;
  paymentState: "UNINVOICED" | "INVOICED" | "PARTIAL" | "PAID";
  items: RevenueItem[];
  risks: RevenueRisk[];
  nextAction?: RevenueNextAction;
}

export interface RevenueData {
  engagements: RevenueEngagement[];
}

// ============== OPERATOR ==============

export type OperatorPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type OperatorItemStatus = "OPEN" | "IN_PROGRESS" | "BLOCKED" | "COMPLETED";

export interface OperatorItem {
  id: string;
  title: string;
  description: string;
  priority: OperatorPriority;
  status: OperatorItemStatus;
  owner: string;
  sourceModule: "Conversion" | "Delivery" | "Retention" | "Revenue" | "Foundation" | "Attention";
  sourceEntityId: string;
  createdAt: string;
  dueDate?: string;
  recommendedAction: string;
  intelligenceSignal?: string;
  linkedContext?: string;
}

export interface OperatorData {
  items: OperatorItem[];
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
