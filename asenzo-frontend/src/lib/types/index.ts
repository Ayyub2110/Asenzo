/**
 * ASENZO Global Types - Phase 5.4
 * Frozen abstraction of the Application Domain Model
 */

export * from "./acquisition";

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

export interface ContentIdea {
  id: string;
  workspaceId?: string;
  title: string;
  coreInsight?: string;
  problem?: string;
  whyMatters?: string;
  
  icp?: string;
  awarenessStage?: "Unaware" | "Problem-aware" | "Solution-aware" | "Product-aware" | "Most-aware";
  funnelStage?: "TOF" | "MOF" | "BOF";
  audienceSituation?: string;
  
  objective?: string;
  contentPillar?: string;
  messagePillar?: string;
  strategicGap?: string;
  
  // Content Strategy Extensions
  angle?: string;
  beliefToChallenge?: string;
  beliefToInstall?: string;
  hookDirection?: string;
  hookDraft?: string;
  
  knowledgeSource?: string;
  proofType?: string;
  proofAsset?: string;
  evidenceNotes?: string;
  
  primaryChannel?: string;
  contentFormat?: string;
  repurposingPotential?: string[];
  
  primaryCta?: string;
  relatedOffer?: string;
  businessOutcome?: string;
  ctaDestination?: string;
  
  owner?: string;
  priority?: "Low" | "Medium" | "High" | "Strategic";
  targetPublishDate?: string;
  campaign?: string;
  productionNotes?: string;
  
  // New AI/Research Fields required for n8n integration
  requestedCount?: number;
  researchSummary?: string;
  marketObservation?: string;
  aiRecommendation?: string;
  sourceCount?: number;
  sources?: { url: string; type: "video" | "article" | "post" | "research" | "other" }[];
  
  status: "GENERATED" | "REVIEW" | "SELECTED" | "IDEA" | "SCRIPT" | "SCRIPTING" | "PRODUCTION" | "IN_PRODUCTION" | "APPROVED" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED" | "idea" | "drafting" | "requires_review" | "approved" | "published"; // Updated for master prompt states
  createdAt?: string;
  updatedAt?: string;

  // New Validation Scoring Matrix
  viralityScore?: number;
  contentInterestScore?: number;
  businessRelevanceScore?: number;
  confidenceScore?: number;
  
  viralityFactors?: Array<{ label: string; score: number; max: number }>;
  interestFactors?: Array<{ label: string; score: number; max: number }>;
  businessRelevanceFactors?: Array<{ label: string; score: number; max: number }>;
  scoringEvidence?: string[];
  scoringVersion?: string;

  // Legacy fields
  framework?: string;
  outputGoal?: string;
  contentDraft?: string;
  marketSignalRef?: string;
  stage?: "TOF" | "MOF" | "BOF";
}

// Script Models for Script Center
export interface RequiredScript {
  id: string;
  ideaId: string;
  workspaceId: string;
  version: number;
  content: string; // The draft script
  hooks?: string[];
  status: "DRAFT" | "REVIEW_REQUIRED" | "APPROVED" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
}

export type ProductionStage = "IDEA" | "BRIEF" | "SCRIPT" | "FOUNDER REVIEW" | "APPROVED" | "RECORDING" | "EDITING" | "FINAL REVIEW" | "SCHEDULED" | "PUBLISHED";

export interface ContentProductionItem {
  id: string;
  ideaId?: string;
  scriptId?: string;
  workspaceId: string;
  title: string;
  format: string;
  channel: string;
  stage: ProductionStage;
  dueDate?: string;
  owner?: string;
  assetUrl?: string;
  createdAt: string;
  updatedAt: string;
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

export interface DeliveryClientContact {
  id: string;
  clientId: string;
  name: string;
  email: string;
  role: string;
  isPrimary: boolean;
}

export interface DeliveryClientContract {
  id: string;
  clientId: string;
  dealId: string;
  offer: string;
  value: number;
  startDate: string;
  endDate: string;
  paymentStatus: "PENDING" | "PARTIAL" | "PAID";
  agreementStatus: "PENDING" | "SIGNED";
}

export interface ClientHealthSignal {
  id: string;
  clientId: string;
  dimension: "DELIVERY" | "OUTCOME" | "COMMUNICATION" | "RELATIONSHIP" | "SCOPE" | "PAYMENT" | "RENEWAL";
  status: "GREEN" | "YELLOW" | "RED";
  reason: string;
  recommendedAction?: string;
  timestamp: string;
}

export interface ClientHealth {
  overall: "GREEN" | "YELLOW" | "RED";
  signals: ClientHealthSignal[];
  lastOverriddenBy?: string;
  lastOverriddenAt?: string;
  overrideReason?: string;
}

export interface DeliveryClient {
  id: string;
  name: string;
  company: string;
  industry: string;
  icp: string;
  owner: string; 
  health: ClientHealth;
  dealSource?: string;
}

// ------ Onboarding ------
export interface DeliveryOnboarding {
  id: string;
  clientId: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  intakeStatus: "PENDING" | "SUBMITTED" | "APPROVED";
  assetCollectionStatus: "PENDING" | "COMPLETED";
  accessStatus: "PENDING" | "COMPLETED";
  kickoffStatus: "PENDING" | "SCHEDULED" | "COMPLETED";
  firstMilestoneId?: string;
  health: "GREEN" | "YELLOW" | "RED";
  startDate: string;
  completionDate?: string;
  owner: string;
}

// ------ Engagement ------
export interface DeliveryEngagementTeam {
  id: string;
  engagementId: string;
  memberId: string;
  role: string;
}

export interface DeliveryEngagement {
  id: string;
  clientId: string;
  name: string;
  offer: string;
  owner: string;
  startDate: string;
  endDate: string;
  status: "PLANNED" | "ONBOARDING" | "ACTIVE" | "AT_RISK" | "PAUSED" | "COMPLETING" | "COMPLETED" | "CANCELLED";
  team: DeliveryEngagementTeam[];
  health: "GREEN" | "YELLOW" | "RED";
  progress: number;
}

// ------ Milestones & Deliverables ------
export interface ClientDependency {
  id: string;
  title: string;
  status: "PENDING" | "FULFILLED" | "DELAYED";
  dueDate: string;
}

export interface DeliveryMilestone {
  id: string;
  engagementId: string;
  name: string;
  description: string;
  owner: string;
  startDate: string;
  dueDate: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "BLOCKED" | "AT_RISK" | "AWAITING_CLIENT" | "AWAITING_APPROVAL" | "COMPLETED";
  progress: number;
  clientDependencies: ClientDependency[];
  completionDate?: string;
}

export interface DeliverableVersion {
  id: string;
  version: number;
  url: string;
  submittedAt: string;
}

export interface ClientApproval {
  id: string;
  status: "PENDING" | "REQUESTED_CHANGES" | "APPROVED";
  notes?: string;
  date?: string;
}

export interface Deliverable {
  id: string;
  name: string;
  type: string;
  clientId: string;
  engagementId: string;
  milestoneId: string;
  owner: string;
  dueDate: string;
  status: "PLANNED" | "IN_PROGRESS" | "INTERNAL_REVIEW" | "CLIENT_REVIEW" | "CHANGES_REQUESTED" | "APPROVED" | "DELIVERED" | "ARCHIVED";
  versions: DeliverableVersion[];
  clientApproval?: ClientApproval;
  deliveryDate?: string;
}

// ------ Client Communication ------
export interface ClientCommunication {
  id: string;
  clientId: string;
  engagementId?: string;
  milestoneId?: string;
  deliverableId?: string;
  owner: string;
  date: string;
  type: "MESSAGE" | "EMAIL" | "MEETING" | "UPDATE" | "DEPENDENCY_REMINDER";
  status: "NEEDS_RESPONSE" | "WAITING_ON_CLIENT" | "WAITING_INTERNAL" | "RESOLVED" | "FOLLOW_UP_REQUIRED" | "CLOSED";
  summary: string;
}

// ------ Outcomes & KPI ------
export interface OutcomeMeasurement {
  id: string;
  date: string;
  value: number;
  notes?: string;
}

export interface KPI {
  id: string;
  engagementId: string;
  metricName: string;
  baseline: number;
  target: number;
  currentValue: number;
  measurements: OutcomeMeasurement[];
}

export interface ClientOutcome {
  id: string;
  clientId: string;
  engagementId: string;
  originalProblem: string;
  successDefinition: string;
  kpis: KPI[];
}

// ------ Reporting ------
export interface DeliveryReport {
  id: string;
  clientId: string;
  engagementId: string;
  type: "WEEKLY_UPDATE" | "MILESTONE_COMPLETION" | "EXECUTIVE_SUMMARY";
  generatedDate: string;
  status: "DRAFT" | "SENT" | "VIEWED";
  url: string;
}

// ------ Retention & Proof ------
export interface DeliveryRenewal {
  id: string;
  clientId: string;
  contractId: string;
  renewalDate: string;
  owner: string;
  status: "NOT_STARTED" | "UPCOMING" | "IN_DISCUSSION" | "RENEWED" | "EXPANDED" | "CHURN_RISK" | "CHURNED";
  likelihood: number;
}

export interface ProofAsset {
  id: string;
  clientId: string;
  type: "METRIC" | "TESTIMONIAL" | "CASE_STUDY" | "BEFORE_AFTER" | "QUOTE" | "ARTIFACT";
  sourceMilestoneId?: string;
  permissionStatus: "NOT_REQUESTED" | "REQUESTED" | "APPROVED" | "DECLINED";
  verificationStatus: "UNVERIFIED" | "VERIFIED";
  publishedStatus: "DRAFT" | "PUBLISHED";
  url?: string;
}

export interface DeliveryData {
  clients: DeliveryClient[];
  contacts: DeliveryClientContact[];
  contracts: DeliveryClientContract[];
  onboardings: DeliveryOnboarding[];
  engagements: DeliveryEngagement[];
  milestones: DeliveryMilestone[];
  deliverables: Deliverable[];
  communications: ClientCommunication[];
  outcomes: ClientOutcome[];
  reports: DeliveryReport[];
  renewals: DeliveryRenewal[];
  proofs: ProofAsset[];
}

// ============== OPERATIONS ==============

export type OperationsPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type OperationsTaskStatus = "BACKLOG" | "READY" | "IN_PROGRESS" | "BLOCKED" | "WAITING" | "COMPLETED" | "CANCELLED";
export type OperationsApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | "CHANGES_REQUESTED" | "EXPIRED";
export type OperationsSOPStatus = "DRAFT" | "ACTIVE" | "NEEDS_REVIEW" | "ARCHIVED";
export type OperationsEscalationStatus = "OPEN" | "ACKNOWLEDGED" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type OperationsQCStatus = "NOT_REVIEWED" | "PASSED" | "FAILED" | "CHANGES_REQUIRED" | "RECHECK_REQUIRED";
export type ModuleSource = "Foundation" | "Attention" | "Acquisition" | "Conversion" | "Revenue" | "Delivery" | "Operations";

export interface OperationsTeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  skills: string[];
  capacity: number; // Max capacity
  workload: number; // Current assigned hours or %
  status: "ACTIVE" | "AWAY" | "AT_CAPACITY" | "OVER_CAPACITY" | "INACTIVE";
  backupFor: string[]; // User IDs
}

export interface OperationsTask {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  backupOwnerId?: string;
  sourceModule: ModuleSource;
  relatedRecordId?: string;
  priority: OperationsPriority;
  status: OperationsTaskStatus;
  dueDate: string;
  createdAt: string;
  completedAt?: string;
  blockedBy?: string; // Task ID or reason
  escalationState?: string;
}

export interface OperationsSOP {
  id: string;
  name: string;
  purpose: string;
  trigger: string;
  ownerId: string;
  processSteps: string[];
  qualityStandard: string;
  expectedOutput: string;
  status: OperationsSOPStatus;
  version: string;
  lastReviewedDate: string;
  nextReviewDate: string;
}

export interface OperationsWorkflow {
  id: string;
  name: string;
  triggerEvent: string;
  steps: string[]; // simplified steps
  ownerId: string;
}

export interface OperationsApproval {
  id: string;
  request: string;
  sourceModule: ModuleSource;
  requestedBy: string; // User ID
  approverId: string; // User ID
  priority: OperationsPriority;
  status: OperationsApprovalStatus;
  createdAt: string;
  dueDate: string;
  decisionDate?: string;
  comments?: string;
}

export interface OperationsQC {
  id: string;
  title: string;
  sourceModule: ModuleSource;
  ownerId: string;
  reviewerId: string;
  status: OperationsQCStatus;
  severity: "LOW" | "MEDIUM" | "HIGH";
  relatedRecordId?: string;
}

export interface OperationsEscalation {
  id: string;
  issue: string;
  sourceModule: ModuleSource;
  severity: OperationsPriority;
  ownerId: string;
  escalationOwnerId: string;
  status: OperationsEscalationStatus;
  createdAt: string;
  deadline?: string;
  reason: string;
  recommendedAction: string;
}

export interface OperationsScheduleEvent {
  id: string;
  title: string;
  frequency: "WEEKLY" | "MONTHLY" | "QUARTERLY";
  ownerId: string;
  agenda: string;
  status: "PENDING" | "COMPLETED";
}

export interface OperationsData {
  team: OperationsTeamMember[];
  tasks: OperationsTask[];
  sops: OperationsSOP[];
  workflows: OperationsWorkflow[];
  approvals: OperationsApproval[];
  qc: OperationsQC[];
  escalations: OperationsEscalation[];
  schedule: OperationsScheduleEvent[];
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
