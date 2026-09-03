export type AcquisitionStatus = 'NEW' | 'REVIEWING' | 'QUALIFIED' | 'UNQUALIFIED' | 'IN_CONVERSATION' | 'READY_FOR_HANDOFF' | 'HANDED_OFF';

// Phase 2: Canonical Content Lifecycle
export type ContentLifecycleState = 
  | 'IDEA' 
  | 'BRIEF' 
  | 'SCRIPT' 
  | 'FOUNDER_REVIEW' 
  | 'APPROVED' 
  | 'PRODUCTION' 
  | 'EDITING' 
  | 'FINAL_REVIEW' 
  | 'SCHEDULED' 
  | 'PUBLISHED' 
  | 'ANALYZED';

export type LibraryStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export interface ContentItem {
  id: string;
  workspaceId?: string;
  title: string;
  type?: 'POST' | 'VIDEO' | 'NEWSLETTER' | 'THREAD' | 'LEAD_MAGNET' | 'EMAIL';
  
  // State Machine
  status: ContentLifecycleState;
  libraryStatus: LibraryStatus;
  
  // Structured Core Fields (Phase 2 enhancements)
  hooks?: string[];
  formats?: string[];
  platforms?: string[];
  targetIcp?: string;
  
  // Core Strategy Fields (Merged from legacy ContentIdea)
  coreInsight?: string;
  problem?: string;
  whyMatters?: string;
  icp?: string;
  awarenessStage?: "Unaware" | "Problem-aware" | "Solution-aware" | "Product-aware" | "Most-aware" | string;
  funnelStage?: "TOF" | "MOF" | "BOF" | string;
  audienceSituation?: string;
  objective?: string;
  contentPillar?: string;
  messagePillar?: string;
  strategicGap?: string;
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
  
  // AI/Research Fields
  requestedCount?: number;
  researchSummary?: string;
  marketObservation?: string;
  aiRecommendation?: string;
  sourceCount?: number;
  sources?: { url: string; type: "video" | "article" | "post" | "research" | "other" | string }[];
  
  // Validation Scoring Matrix
  viralityScore?: number;
  contentInterestScore?: number;
  businessRelevanceScore?: number;
  confidenceScore?: number;
  viralityFactors?: Array<{ label: string; score: number; max: number }>;
  interestFactors?: Array<{ label: string; score: number; max: number }>;
  businessRelevanceFactors?: Array<{ label: string; score: number; max: number }>;
  scoringEvidence?: string[];
  scoringVersion?: string;

  // Legacy fields fallback
  framework?: string;
  outputGoal?: string;
  contentDraft?: string;
  marketSignalRef?: string;
  stage?: "TOF" | "MOF" | "BOF" | string;
  
  // Content Body & Script Models
  brief?: string;
  script?: string;
  scriptVersion?: number;
  
  // Workflow Context
  ownerId?: string;
  owner?: string;
  reviewerId?: string;
  scheduledDate?: string;
  publishedUrl?: string;
  assetUrl?: string;
  channel?: string;
  dueDate?: string;
  
  createdAt?: string;
  updatedAt?: string;
}

// Phase 3: Research Intelligence Models

export interface Creator {
  id: string;
  name: string;
  tags: string[]; // Lists like 'Founder Creators', 'Solopreneur'
  audienceSize?: string;
  trend?: 'up' | 'down' | 'stable';
  createdAt: string;
  updatedAt: string;
}

export interface CreatorChannel {
  id: string;
  creatorId: string;
  platform: 'LinkedIn' | 'X' | 'YouTube' | 'Newsletter' | 'Instagram' | string;
  channelUrl?: string;
  baselinePerformance: string; // e.g., '100K Views'
  audienceSize?: string;
  topFormat?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentReference {
  id: string;
  channelId: string;
  url?: string;
  postedDate?: string;
  topic?: string;
  contentFormat?: string; // Text, Image, Carousel, Short video, Long video
  rawContent?: string; // Caption / Transcript
  metrics: {
    views?: string;
    engagement?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface OutlierAnalysis {
  id: string;
  contentReferenceId: string;
  multiplier: number; // e.g., 8.5
  analysisStatus: 'UNANALYZED' | 'ANALYZING' | 'ANALYZED';
  createdAt: string;
  updatedAt: string;
}

export interface ResearchSignal {
  id: string;
  outlierAnalysisId?: string; // Optional: could be from other sources
  title: string;
  signalType: 'COMPETITOR_SHIFT' | 'SEARCH_SURGE' | 'FORMAT_TREND' | 'OUTLIER_POST' | string;
  description: string;
  source: string; // e.g., 'LinkedIn Scrape', 'Trend Analytics'
  status: 'REVIEW' | 'SAVED' | 'DISMISSED' | 'CONVERTED';
  createdAt: string;
  updatedAt: string;
}

export interface ContentPattern {
  id: string;
  researchSignalId: string;
  name: string; 
  description: string; 
  whatHappened: string;
  whyWorked: string;
  evidence: string;
  occurrences: string;
  relevance: string;
  confidence: 'LOW' | 'MODERATE' | 'HIGH';
  
  // Specific findings
  hookType?: string;
  funnelStage?: string;
  awarenessStage?: string;
  
  createdAt: string;
  updatedAt: string;
}

// Phase 4: Idea & Hook Intelligence Models

export interface ContentIdea {
  id: string;
  title: string;
  coreInsight: string;
  targetIcp: string;
  awarenessStage: string;
  funnelRole: string;
  contentPillar: string;
  messagePillar: string;
  relatedPatternId?: string; // Phase 3 link
  relatedResearchSignalIds?: string[]; // Phase 3 link
  whyWorthCreating: string;
  evidence: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'DRAFT' | 'SELECTED' | 'ARCHIVED';
  potentialFormats: string[];
  suggestedCta: string;
  suggestedNextAction: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentAngle {
  id: string;
  parentIdeaId: string;
  angleTitle: string;
  angleType: string;
  coreArgument: string;
  targetAwarenessStage: string;
  emotionalTrigger: string;
  differentiation: string;
  supportingResearch: string;
  recommendedFormats: string[];
  priorityScore: number;
  status: 'DRAFT' | 'SELECTED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

export interface Hook {
  id: string;
  parentAngleId: string;
  parentIdeaId: string;
  hookText: string;
  hookType: string;
  hookFormula: string;
  awarenessStage: string;
  patternSource: string;
  whyShouldWork: string;
  evidenceReference: string;
  score: {
    total: number;
    clarity: number;
    specificity: number;
    curiosity: number;
    relevanceToIcp: number;
    patternEvidence: number;
    differentiation: number;
  };
  status: 'DRAFT' | 'SAVED' | 'SELECTED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  workspaceId: string;
  anonymousVisitorId?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role?: string;
  sourceId?: string;
  campaignId?: string;
  leadMagnetId?: string;
  ctaId?: string;
  
  // Cross-module Tracking fields (New)
  originalSource?: string;
  originalContent?: string;
  originalKeyword?: string;
  originalFunnel?: string;
  icpScore?: number;
  icpSegment?: string;

  firstTouchAt?: string;
  latestTouchAt?: string;
  status: AcquisitionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AcquisitionSource {
  id: string;
  name: string;
  type: string;
  leadsCount: number;
}

export interface AcquisitionCampaign {
  id: string;
  name: string;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED';
  leadsCount: number;
}

export interface CaptureSurface {
  id: string;
  name: string;
  type: 'LANDING_PAGE' | 'MODAL' | 'EMBED';
  url?: string;
}

export interface LeadMagnet {
  id: string;
  name: string;
  type: 'PDF' | 'VIDEO' | 'TEMPLATE' | 'CONSULTATION';
}

export interface CTA {
  id: string;
  contentId?: string;
  text: string;
  url: string;
}

export type SystemEventType = 
  | 'CONTENT_VIEW'
  | 'CONTENT_ENGAGEMENT'
  | 'COMMENT'
  | 'KEYWORD_COMMENT'
  | 'CTA_CLICK'
  | 'LANDING_PAGE_VIEW'
  | 'FORM_STARTED'
  | 'FORM_SUBMITTED'
  | 'EMAIL_CAPTURED'
  | 'BOOKING_STARTED'
  | 'BOOKING_COMPLETED'
  | 'LEAD_CREATED'
  | 'LEAD_QUALIFIED'
  | 'OUTREACH_CREATED'
  | 'OUTREACH_SENT'
  | 'CONVERSATION_CREATED'
  | 'CALL_BOOKED'
  | 'CALL_COMPLETED'
  | 'PROPOSAL_CREATED'
  | 'PROPOSAL_SENT'
  | 'DEAL_WON'
  | 'DEAL_LOST';

export interface AttributionEvent {
  id: string;
  anonymousVisitorId?: string;
  leadId?: string;
  sessionId?: string;
  source?: string;
  platform?: string;
  channel?: string;
  campaignId?: string;
  contentId?: string;
  contentType?: string;
  contentTitle?: string;
  assetId?: string;
  funnelId?: string;
  keyword?: string;
  eventType: SystemEventType;
  metadata?: any;
  occurredAt: string;
}

export interface LeadEvent {
  id: string;
  leadId: string;
  type: SystemEventType; // Synced with SystemEventType
  data?: any;
  timestamp: string;
}

export interface IntentSignal {
  id: string;
  leadId: string;
  type: 'CTA_CLICK' | 'LEAD_MAGNET_REQUEST' | 'APPLICATION' | 'PRICING_QUESTION' | 'BUYING_QUESTION' | 'BOOKING_REQUEST' | 'REPEAT_HIGH_INTENT_VISIT' | 'CONVERSATION';
  score: number;
  timestamp: string;
}

export interface AcquisitionQualification {
  id: string;
  leadId: string;
  icpFit: 'HIGH' | 'MEDIUM' | 'LOW';
  problemFit: 'HIGH' | 'MEDIUM' | 'LOW';
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  state: 'REVIEW' | 'QUALIFIED' | 'UNQUALIFIED';
  notes?: string;
  updatedAt: string;
}

export interface ConversationMessage {
  id: string;
  sender: 'LEAD' | 'SYSTEM' | 'USER';
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  leadId: string;
  channel: string;
  messages: ConversationMessage[];
  status: 'OPEN' | 'CLOSED';
}

export interface Handoff {
  id: string;
  leadId: string;
  opportunityId?: string;
  status: 'PENDING' | 'COMPLETED';
  notes?: string;
  createdAt: string;
}

// Added for Phase 4: Job Tracking & Funnels
export interface ContentEngineJob {
  id: string;
  storyId: string;
  source: string;
  requestedOutput: string;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REVIEW_REQUIRED';
  createdAt: string;
  completedAt?: string;
  generatedVersionId?: string;
}

export interface FunnelNode {
  id: string;
  funnelId: string;
  type: 'SOURCE' | 'CONTENT' | 'ENGAGEMENT' | 'DM' | 'LANDING_PAGE' | 'LEAD_CAPTURE' | 'EMAIL_SEQUENCE' | 'QUALIFICATION' | 'OUTREACH' | 'CONVERSATION' | 'BOOKING' | 'CALL' | 'OFFER' | 'PROPOSAL' | 'WON' | 'LOST';
  name: string;
  metadata?: any;
  position?: { x: number, y: number };
}

export interface FunnelEdge {
  id: string;
  funnelId: string;
  sourceNodeId: string;
  targetNodeId: string;
  conversionRate?: number;
}

export interface Funnel {
  id: string;
  name: string;
  description?: string;
  primarySource?: string;
  primaryCta?: string;
  conversionGoal?: string;
  offer?: string;
  audience?: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  nodes: FunnelNode[];
  edges: FunnelEdge[];
  createdAt: string;
  updatedAt: string;
}

export interface AcquisitionRecommendation {
  id: string;
  title: string;
  evidence: string[];
}

// ==========================================
// PHASE 5: SCRIPT ENGINE INTELLIGENCE
// ==========================================

export interface ScriptFramework {
  id: string;
  name: string;
  description: string;
  structure: {
    name: string;
    required: boolean;
    description: string;
  }[];
  isSystem: boolean;
}

export interface ScriptPlan {
  id: string;
  linkedHookId?: string;
  linkedIdeaId?: string;
  frameworkId?: string;
  strategicContext: {
    icp: string;
    awarenessStage: string;
    founderVoice: string;
    coreObjections: string[];
    coreOffer: string;
  };
  outline: {
    sectionId: string;
    purpose: string;
    points: string[];
  }[];
  status: 'DRAFTING' | 'READY_FOR_SCRIPT';
  createdAt: string;
  updatedAt: string;
}

export interface ScriptVersion {
  id: string;
  scriptPlanId: string;
  versionNumber: number;
  content: string;
  status: 'DRAFT' | 'REVIEW_REQUIRED' | 'APPROVED' | 'REJECTED';
  editorRole: 'AI' | 'HUMAN_EXPERT' | 'FOUNDER';
  feedbackNotes?: string;
  aiScore?: {
    hookStrength: number;
    valueDepictability: number;
    clarity: number;
    total: number;
  };
  createdAt: string;
}

// ==========================================
// PHASE 7: PERFORMANCE & LEARNING
// ==========================================

export interface ContentPerformance {
  id: string;
  contentItemId: string; // References ContentItem
  primaryChannel: string;
  publishedAt: string;
  
  // Core Metrics
  views: number;
  impressions: number;
  engagements: number;
  clicks: number;
  
  // Asenzo Pipeline Metrics (Conversion)
  optIns: number; 
  meetingsBooked: number;
  pipelineGenerated: number; // Dollar amount
  
  // Derived Metrics
  engagementRate: number;
  clickThroughRate: number;
  conversionRate: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface ContentLearning {
  id: string;
  contentPerformanceId: string;
  contentItemId: string;
  
  // Lineage References (to feed back into the system)
  linkedIdeaId?: string;
  linkedAngleId?: string;
  linkedHookId?: string;
  linkedFrameworkId?: string;
  
  // Human / AI Analysis
  whatWorked: string[];
  whatFailed: string[];
  aiRecommendation: string;
  founderAction: 'DOUBLE_DOWN' | 'RETIRE_ANGLE' | 'ITERATE_HOOK';
  
  createdAt: string;
}

// ==========================================
// PHASE 8: 5 CORE AGENTIC ORCHESTRATION MODELS
// ==========================================

export type AgentType = 
  | 'STRATEGY_INTELLIGENCE'
  | 'RESEARCH_OPPORTUNITY'
  | 'CONTENT_ENGINE'
  | 'OUTREACH_INTELLIGENCE'
  | 'ACQUISITION_INTELLIGENCE';

export type AgentExecutionStatus = 
  | 'QUEUED' 
  | 'RUNNING' 
  | 'COMPLETED' 
  | 'NEEDS_REVIEW' 
  | 'FAILED' 
  | 'CANCELLED';

export interface AgentExecutionLog {
  id: string;
  workspaceId: string;
  agentType: AgentType;
  trigger: string;
  inputContext: Record<string, any>;
  status: AgentExecutionStatus;
  startedAt: string;
  completedAt?: string;
  output?: Record<string, any>;
  confidence?: number;
  sources?: { title: string; url?: string; type?: string }[];
  error?: string;
  humanReviewRequired: boolean;
  approvedBy?: string;
  approvedAt?: string;
}

export interface StrategyAgentOutput {
  currentAcquisitionPriority: string;
  biggestConstraint: string;
  awarenessStageGaps: string[];
  contentGaps: string[];
  offerMessageGaps: string[];
  recommendedCampaigns: string[];
  recommendedContentObjectives: string[];
  recommendedOutreachObjectives: string[];
}

export interface ScoredOpportunityIdea {
  id: string;
  title: string;
  whyNow: string;
  audiencePain: string;
  evidence: string;
  contrarianAngle: string;
  awarenessStage: string;
  businessObjective: string;
  recommendedFormat: string;
  overallScore: number;
  subScores: {
    icpRelevance: number;
    problemIntensity: number;
    novelty: number;
    contrarianPotential: number;
    evidenceStrength: number;
    emotionalPull: number;
    contentPotential: number;
    shareability: number;
    businessRelevance: number;
    offerRelevance: number;
    awarenessStageFit: number;
  };
}

export interface ContentEngineOutput {
  ideaId: string;
  brief: string;
  hooks: string[];
  selectedHook: string;
  recommendedScript: string;
  alternativeScript?: string;
  cta: string;
  caption: string;
  titleThumbnailAngles: string[];
  repurposingOptions: string[];
  reviewStatus: 'DRAFT' | 'APPROVED' | 'REJECTED';
}

export interface OutreachLeadIntelligence {
  leadId: string;
  fitScore: number;
  temperature: 'HOT' | 'WARM' | 'COLD';
  reasons: string[];
  recommendedAngle: string;
  openingMessage: string;
  whyThisMessage: string;
  followUp1: string;
  followUp2: string;
  humanApprovalRequired: boolean;
}

export interface AcquisitionSystemDiagnosis {
  systemState: string;
  primaryBottleneck: string;
  workingInsight: string;
  weaknessInsight: string;
  strategicRecommendations: string[];
  triggeredAction?: string;
  updatedAt: string;
}
