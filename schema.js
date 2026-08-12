const { z } = require('zod');

// ── STATUS ENUMS ─────────────────────────────────────────────────────────────
const ContentLifecycleStatus = z.enum([
  'IDEA',
  'DRAFT',
  'SCRIPT',
  'REVIEW',
  'APPROVED',
  'PRODUCTION',
  'SCHEDULED',
  'PUBLISHED',
  'ANALYZING',
  'REPURPOSED',
  'ARCHIVED'
]);

const KnowledgeSourceType = z.enum([
  'POST',
  'ARTICLE',
  'EMAIL',
  'TRANSCRIPT',
  'INTERVIEW',
  'WRITTEN_EXAMPLE'
]);

const ContentPillarType = z.enum(['POSITIONING', 'MECHANISM', 'PROOF', 'AUTHORITY']);
const PlatformType = z.enum(['LINKEDIN', 'X', 'X_TWITTER', 'YOUTUBE', 'SKOOL', 'NEWSLETTER', 'PODCAST', 'EMAIL']);
const DistributionStatus = z.enum(['DRAFT', 'SCHEDULED', 'PUBLISHING', 'PUBLISHED', 'FAILED', 'CANCELLED']);
const LeadStatus = z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'DISQUALIFIED', 'CONVERTED']);
const AccountStatus = z.enum(['ACTIVE', 'EXPIRED_TOKEN', 'RATE_LIMITED', 'DISCONNECTED', 'ERROR']);
const CampaignStatus = z.enum(['ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED']);
const SurfaceType = z.enum(['LINKEDIN_POST', 'X_POST', 'LANDING_PAGE', 'BIO_LINK', 'NEWSLETTER', 'EMAIL', 'OTHER']);
const LeadSourceType = z.enum(['COMMENT', 'DM', 'FORM', 'BIO_LINK', 'NEWSLETTER', 'AD', 'REFERRAL', 'OTHER']);
const CtaType = z.enum(['COMMENT', 'DM', 'FORM', 'LINK', 'NEWSLETTER']);
const OutreachStatus = z.enum(['QUEUED', 'SENT', 'DELIVERED', 'REPLIED', 'BOUNCED']);
const RecommendationCategory = z.enum(['PILLAR_OPTIMIZATION', 'HOOK_IMPROVEMENT', 'AD_AMPLIFICATION', 'CADENCE_ADJUSTMENT', 'CONTENT_GAP']);
const RecommendationStatus = z.enum(['PENDING', 'APPROVED', 'REJECTED', 'APPLIED', 'DISMISSED']);
const AuditActionType = z.enum(['CREATE', 'UPDATE', 'DELETE', 'STATUS_CHANGE', 'VERSION_CREATE', 'AI_GENERATE']);

const ContentPillarStatus = z.enum(['ACTIVE', 'PAUSED', 'ARCHIVED']);
const ContentIdeaSource = z.enum(['MANUAL', 'AI_GENERATED', 'CUSTOMER_QUESTION', 'OBJECTION', 'SALES_CONVERSATION', 'CASE_STUDY', 'MARKET_INTEL', 'SUCCESSFUL_CONTENT']);
const ContentIdeaStatus = z.enum(['NEW', 'PRIORITIZED', 'PLANNED', 'IN_PRODUCTION', 'PUBLISHED', 'CONVERTED', 'ARCHIVED']);
const ContentFormatType = z.enum(['POST', 'CAROUSEL', 'VIDEO', 'NEWSLETTER', 'CASE_STUDY', 'THREAD', 'LEAD_MAGNET']);
const IdeaPriorityType = z.enum(['LOW', 'MEDIUM', 'HIGH']);

// Attention OS Acquisition Support Systems Enums
const AuthorityAssetTypeEnum = z.enum([
  'TESTIMONIAL',
  'CASE_STUDY',
  'CLIENT_RESULT',
  'METRIC',
  'SCREENSHOT',
  'MEDIA_MENTION',
  'AWARD',
  'CREDENTIAL',
  'PROOF_ASSET'
]);

const PermissionStatusEnum = z.enum(['APPROVED', 'PENDING', 'EXPIRED', 'DENIED']);

const MarketSignalTypeEnum = z.enum([
  'INDUSTRY_DEVELOPMENT',
  'COMPETITOR_ACTIVITY',
  'CUSTOMER_QUESTION',
  'EMERGING_PAIN_POINT',
  'MARKET_CONVERSATION',
  'TREND'
]);

const ReplyClassificationEnum = z.enum([
  'POSITIVE',
  'NEGATIVE',
  'NEUTRAL',
  'QUESTION',
  'INTERESTED',
  'NOT_NOW',
  'REFERRAL',
  'UNSUBSCRIBE',
  'UNKNOWN'
]);

const optStr = z.string().nullable().optional();
const arrayStr = z.array(z.string()).default([]);

// ── 1. FOUNDER PROFILE SCHEMA ────────────────────────────────────────────────
const FounderProfileFullSchema = z.object({
  id: optStr.default('founder_default'),
  businessId: optStr.default('biz_default'),
  name: z.string().min(2, 'Founder name is required').default('Alex Morgan'),
  email: z.string().email().default('alex@asenzo.ai'),
  title: optStr.default('Founder & Growth Operator'),
  bio: optStr.default('Building founder-independent growth infrastructure.'),
  expertise: z.array(z.string()).default(['B2B Positioning', 'Growth Operating Systems']),
  experience: optStr.default('12+ years in B2B SaaS & Growth Operations'),
  story: optStr.default('Spent 6 years trapped in 60-hour workweeks before building the 5-Engine Growth OS.'),
  beliefs: z.array(z.string()).default(['Founders must build operating systems, not just hire agencies.']),
  opinions: z.array(z.string()).default(['Retainer agencies keep founders dependent.']),
  achievements: z.array(z.string()).default(['Scaled 4 B2B businesses past $100k/mo MRR']),
  credentials: z.array(z.string()).default(['BS Computer Science', 'Growth Operator Practitioner'])
});

// ── 2. BRAND PROFILE SCHEMA ──────────────────────────────────────────────────
const BrandProfileFullSchema = z.object({
  id: optStr.default('bp_default'),
  businessId: optStr.default('biz_default'),
  brandName: z.string().min(2, 'Brand name is required').default('ASENZO Growth OS'),
  tagline: optStr.default('The Founder Growth Operating System'),
  mission: optStr.default('Transform founders from single-point-of-failure bottlenecks into independent growth operators.'),
  personalBrandPositioning: optStr.default('Systems-driven growth operator sharing transparent frameworks.'),
  businessBrandPositioning: optStr.default('Production-grade founder growth operating system for bootstrapped B2B founders.'),
  audience: optStr.default('Bootstrapped B2B Founders doing $15k–$50k/mo MRR'),
  personality: optStr.default('Authoritative, direct, systems-oriented'),
  tone: optStr.default('Direct, Authoritative'),
  formality: optStr.default('Professional Casual'),
  directness: optStr.default('High'),
  humor: optStr.default('Subtle'),
  technicalDepth: optStr.default('High'),
  vocabularyPreferences: optStr.default('Systems, engines, leverage, bottlenecks, FIS score'),
  wordsToUse: z.array(z.string()).default(['operating system', 'leverage', 'framework', 'bottleneck']),
  wordsToAvoid: z.array(z.string()).default(['hack', 'guru', 'overnight', 'secret'])
});

// ── 3. KNOWLEDGE INGESTION PIPELINE SCHEMA ───────────────────────────────────
const KnowledgeSourceIngestSchema = z.object({
  id: optStr,
  businessId: optStr.default('biz_default'),
  founderId: optStr.default('founder_default'),
  title: z.string().min(3, 'Source title is required'),
  sourceType: KnowledgeSourceType.default('ARTICLE'),
  rawContent: z.string().min(15, 'Source content must be at least 15 characters'),
  metadataJson: z.record(z.any()).optional().default({})
});

// ── 4. FOUNDER VOICE PROFILE SCHEMA ─────────────────────────────────────────
const FounderVoiceProfileSchema = z.object({
  id: optStr.default('vp_default'),
  businessId: optStr.default('biz_default'),
  sentencePatterns: z.array(z.string()).default([]),
  recurringPhrases: z.array(z.string()).default([]),
  vocabulary: z.array(z.string()).default([]),
  writingStructure: optStr.default('Short declarative hook -> Context -> 3-Pillar breakdown -> Quantified action step.'),
  directnessLevel: optStr.default('High'),
  communicationStyle: optStr.default('Direct, Authoritative, Metric-backed'),
  sampleChunks: z.array(z.string()).default([])
});

// ── 5. ICP & POSITIONING SCHEMAS ─────────────────────────────────────────────
const IcpFullSchema = z.object({
  id: optStr,
  businessId: optStr.default('biz_default'),
  name: z.string().min(2).default('Bootstrapped B2B Agency Founders'),
  targetCustomer: z.string().min(3).default('Bootstrapped B2B Founders'),
  industry: optStr.default('B2B SaaS & Digital Agencies'),
  businessType: optStr.default('Service & SaaS Hybrid'),
  founderRole: optStr.default('CEO / Founder Operator'),
  companySize: optStr.default('3–15 Team Members'),
  revenueRange: z.string().min(2).default('$15k–$50k/mo'),
  primaryPains: z.array(z.string()).min(1).default(['Trapped in 60-hr workweeks serving as single bottleneck']),
  secondaryPains: arrayStr,
  desiredOutcomes: z.array(z.string()).min(1).default(['Scale to $100k/mo MRR while raising FIS score to 85+']),
  buyingTriggers: arrayStr,
  objections: arrayStr,
  isActive: z.boolean().optional().default(true)
});

const PositioningFullSchema = z.object({
  id: optStr,
  businessId: optStr.default('biz_default'),
  icpId: optStr,
  icpSummary: z.string().min(5).default('Bootstrapped B2B Founders doing $15k–$50k/mo'),
  problem: z.string().min(5).default('Trapped in 60-hr workweeks serving as the single bottleneck for marketing & sales'),
  result: z.string().min(5).default('Scale to $100k/mo while increasing Founder Independence Score from 30 to 85+'),
  mechanism: z.string().min(3).default('The ASENZO 5-Engine Growth OS Framework'),
  statement: optStr,
  score: z.number().optional().default(88),
  scoreBreakdown: z.record(z.any()).optional().default({}),
  alternatives: z.array(z.any()).optional().default([]),
  version: z.number().optional().default(1),
  isActive: z.boolean().optional().default(true)
});

const OfferFullSchema = z.object({
  id: optStr,
  businessId: optStr.default('biz_default'),
  offerName: z.string().min(2).default('ASENZO Growth Operating System Installation'),
  description: z.string().min(5).default('Complete growth infrastructure installation & founder capability training across 5 operating engines.'),
  promise: z.string().min(5).default('Scale to $100k/mo revenue while raising Founder Independence Score to 85+.'),
  deliverables: z.array(z.string()).min(1).default(['Attention OS Content Engine', 'Conversion OS CRM Triage']),
  targetAudience: optStr.default('Bootstrapped B2B Founders doing $15k–$50k/mo'),
  pricingContext: optStr.default('$12,500 One-time OS Installation Sprint'),
  proof: optStr.default('Case Study: Apex Logistics grown pipeline 2.4x in 90 days.'),
  differentiators: arrayStr.default(['We install operating capability, not SaaS subscription dependency'])
});

const ContentSchema = z.object({
  id: optStr,
  businessId: optStr.default('biz_default'),
  pillarId: optStr,
  ideaId: optStr,
  title: z.string().min(3),
  lifecycleStatus: ContentLifecycleStatus.default('DRAFT'),
  primaryPlatform: PlatformType.default('LINKEDIN'),
  hookText: optStr.default(''),
  bodyScript: optStr.default(''),
  cta: optStr.default(''),
  owner: optStr.default('Alex Morgan'),
  deadline: optStr.default(''),
  scheduledAt: optStr.default(''),
  publishedAt: optStr.default(''),
  score: z.number().int().min(0).max(100).optional().default(85),
  performanceJson: z.record(z.any()).optional().default({}),
  isAdCandidate: z.boolean().optional().default(false),
  isArchived: z.boolean().optional().default(false)
});

const ContentTransitionSchema = z.object({
  targetStatus: ContentLifecycleStatus,
  reason: optStr.default('State machine transition'),
  rescheduleDate: optStr,
  postUrl: optStr
});

const ContentAssetSchema = z.object({
  id: optStr,
  contentId: z.string().min(1, 'Content ID is required'),
  assetType: z.enum(['IMAGE', 'VIDEO', 'CAROUSEL_PDF', 'INFOGRAPHIC', 'DOCUMENT']).default('IMAGE'),
  fileUrl: z.string().min(3, 'File URL is required'),
  caption: optStr.default('')
});

const ScriptGenerationRequestSchema = z.object({
  pillar: z.string().min(2),
  hookType: z.enum(['Pattern Interrupt', 'Question', 'Story', 'Contrarian']),
  topic: z.string().min(3),
  targetPain: optStr
});

// ── 10. CONTENT PILLAR (CONTENT STRATEGY) SCHEMA ─────────────────────────────
const ContentPillarFullSchema = z.object({
  id: optStr,
  businessId: optStr.default('biz_default'),
  name: z.string().min(2, 'Pillar name is required'),
  pillarType: optStr,
  description: optStr.default(''),
  targetAudience: optStr.default(''),
  objective: optStr.default(''),
  pain: optStr.default(''),
  desiredResult: optStr.default(''),
  contentFormats: arrayStr,
  supportedPlatforms: z.array(PlatformType).default([]),
  status: ContentPillarStatus.default('ACTIVE'),
  targetPercentage: z.number().min(0).max(100).optional().default(25)
});

// ── 11. CONTENT IDEA (IDEA ENGINE) SCHEMA ────────────────────────────────────
const ContentIdeaSchema = z.object({
  id: optStr,
  businessId: optStr.default('biz_default'),
  pillarId: optStr,
  icpId: optStr,
  source: ContentIdeaSource.default('MANUAL'),
  title: z.string().min(5, 'Idea title must be at least 5 characters'),
  premise: optStr.default(''),
  icp: optStr.default(''),
  pain: optStr.default(''),
  desiredResult: optStr.default(''),
  contentFormat: ContentFormatType.default('POST'),
  platform: PlatformType.default('LINKEDIN'),
  objective: optStr.default(''),
  cta: optStr.default(''),
  score: z.number().min(0).max(100).optional().default(0),
  scoreBreakdown: z.record(z.any()).optional().default({}),
  priority: IdeaPriorityType.default('LOW'),
  status: ContentIdeaStatus.default('NEW'),
  notes: optStr.default(''),
  isArchived: z.boolean().optional().default(false),
  convertedContentId: optStr
});

// ── 12. CONTENT IDEA AI GENERATION REQUEST SCHEMA ────────────────────────────
const ContentIdeaGenerateRequestSchema = z.object({
  businessId: optStr.default('biz_default'),
  source: ContentIdeaSource.default('AI_GENERATED'),
  count: z.number().int().min(1).max(8).optional().default(4),
  pillarId: optStr,
  seedPrompt: optStr.default('')
});

// ── 13. AI HOOK & SCRIPT GENERATION SCHEMAS ───────────────────────────────────
const HookStyleEnum = z.enum([
  'contrarian',
  'problem',
  'curiosity',
  'story',
  'data',
  'mistake',
  'framework',
  'prediction',
  'case_study'
]);

const ScriptPlatformEnum = z.enum([
  'LINKEDIN',
  'X',
  'INSTAGRAM',
  'YOUTUBE_SHORT',
  'CAROUSEL',
  'EMAIL',
  'NEWSLETTER',
  'BLOG'
]);

const HookGenerationRequestSchema = z.object({
  businessId: optStr.default('biz_default'),
  ideaId: optStr,
  pillarId: optStr,
  topic: z.string().min(3, 'Topic is required'),
  targetPain: optStr.default(''),
  styles: z.array(HookStyleEnum).optional(),
  count: z.number().int().min(1).max(9).optional().default(3)
});

const ScriptGenerationFullRequestSchema = z.object({
  businessId: optStr.default('biz_default'),
  ideaId: optStr,
  pillarId: optStr,
  topic: z.string().min(3, 'Topic or title is required'),
  targetPain: optStr.default(''),
  selectedHook: optStr.default(''),
  hookStyle: HookStyleEnum.optional().default('contrarian'),
  platforms: z.array(ScriptPlatformEnum).min(1).default(['LINKEDIN']),
  includeProof: z.boolean().optional().default(true),
  forceProofGapCheck: z.boolean().optional().default(true)
});

const GuardrailValidationSchema = z.object({
  passed: z.boolean(),
  overallScore: z.number().min(0).max(100),
  icpScore: z.number().min(0).max(100),
  positioningScore: z.number().min(0).max(100),
  brandVoiceScore: z.number().min(0).max(100),
  proofScore: z.number().min(0).max(100),
  proofGap: z.boolean().default(false),
  proofGaps: z.array(z.record(z.any())).default([]),
  violations: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  claimsVerification: z.array(z.record(z.any())).default([])
});

const ContentVersionSaveSchema = z.object({
  contentId: z.string().min(1, 'Content ID is required'),
  versionNumber: z.number().int().optional(),
  hookText: optStr.default(''),
  bodyScript: optStr.default(''),
  cta: optStr.default(''),
  platform: ScriptPlatformEnum.default('LINKEDIN'),
  structuredSections: z.record(z.any()).optional().default({}),
  guardrailResults: z.record(z.any()).optional().default({}),
  provenance: z.record(z.any()).optional().default({}),
  createdBy: z.string().default('HUMAN_OPERATOR'),
  approvalStatus: z.enum(['DRAFT', 'APPROVED', 'NEEDS_REVISION']).default('DRAFT')
});

// ── 14. DISTRIBUTION & PLATFORM ACCOUNT SCHEMAS ──────────────────────────────
const PlatformRegisterSchema = z.object({
  id: optStr,
  name: z.string().min(2, 'Platform name is required'),
  handle: optStr.default(''),
  isConnected: z.boolean().optional().default(false)
});

const PlatformAccountConnectSchema = z.object({
  id: optStr,
  businessId: optStr.default('biz_default'),
  platformId: optStr,
  platform: optStr, // platform name, resolved to platform_id when platformId omitted
  accountName: z.string().min(2, 'Account name is required'),
  handle: optStr.default(''),
  displayName: optStr.default(''),
  profileImageUrl: optStr.default(''),
  accessToken: optStr.default(''),
  refreshToken: optStr.default(''),
  tokenType: optStr.default('Bearer'),
  scope: optStr.default(''),
  tokenExpiresAt: optStr.default(''),
  isPrimary: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  rateLimitResetAt: optStr.default('')
});

const PlatformAccountUpdateSchema = z.object({
  accountName: optStr,
  handle: optStr,
  displayName: optStr,
  profileImageUrl: optStr,
  accessToken: optStr,
  refreshToken: optStr,
  tokenExpiresAt: optStr,
  isPrimary: z.boolean().optional(),
  isActive: z.boolean().optional(),
  rateLimitResetAt: optStr,
  tokenStatus: AccountStatus.optional()
});

const DistributionCreateSchema = z.object({
  id: optStr,
  businessId: optStr.default('biz_default'),
  contentId: z.string().min(1, 'Content ID is required'),
  contentVersionId: optStr,
  platformId: optStr,
  platform: optStr, // platform name, resolved to platform_id when platformId omitted
  platformAccountId: optStr,
  campaignId: optStr,
  scheduledAt: optStr,
  idempotencyKey: optStr.default(''),
  note: optStr.default('')
});

const DistributionScheduleSchema = z.object({
  scheduledAt: z.string().min(1, 'scheduledAt is required'),
  platformAccountId: optStr,
  campaignId: optStr,
  idempotencyKey: optStr.default('')
});

const DistributionPublishSchema = z.object({
  platformAccountId: optStr,
  idempotencyKey: optStr.default('')
});

// ── 15. LEAD CAPTURE SCHEMAS ─────────────────────────────────────────────────
const LeadMagnetSchema = z.object({
  id: optStr,
  businessId: optStr.default('biz_default'),
  title: z.string().min(2, 'Lead magnet title is required'),
  description: optStr.default(''),
  assetUrl: optStr.default('#'),
  fileType: optStr.default(''),
  imageUrl: optStr.default(''),
  isActive: z.boolean().optional().default(true),
  isArchived: z.boolean().optional().default(false)
});

const LeadCampaignSchema = z.object({
  id: optStr,
  businessId: optStr.default('biz_default'),
  name: z.string().min(2, 'Campaign name is required'),
  description: optStr.default(''),
  platform: PlatformType.default('LINKEDIN'),
  status: CampaignStatus.default('ACTIVE'),
  startAt: optStr.default(''),
  endAt: optStr.default('')
});

const LandingSurfaceSchema = z.object({
  id: optStr,
  businessId: optStr.default('biz_default'),
  name: z.string().min(2, 'Surface name is required'),
  surfaceType: SurfaceType.default('LINKEDIN_POST'),
  url: optStr.default(''),
  contentId: optStr,
  distributionId: optStr,
  campaignId: optStr,
  leadMagnetId: optStr,
  isActive: z.boolean().optional().default(true)
});

const LandingFormSchema = z.object({
  id: optStr,
  businessId: optStr.default('biz_default'),
  name: z.string().min(2, 'Form name is required'),
  surfaceId: optStr,
  leadMagnetId: optStr,
  campaignId: optStr,
  fieldsJson: z.record(z.any()).optional().default({}),
  submitCta: optStr.default('Get the guide'),
  successMessage: optStr.default('Thanks! Check your inbox.'),
  isActive: z.boolean().optional().default(true)
});

const LeadCtaSchema = z.object({
  id: optStr,
  businessId: optStr.default('biz_default'),
  name: z.string().min(2, 'CTA name is required'),
  ctaType: CtaType.default('COMMENT'),
  ctaText: optStr.default(''),
  contentId: optStr,
  distributionId: optStr,
  surfaceId: optStr,
  campaignId: optStr,
  leadMagnetId: optStr,
  targetUrl: optStr.default('')
});

const LeadCaptureSchema = z.object({
  name: z.string().min(1, 'Lead name is required'),
  email: z.string().email('Valid email is required'),
  businessId: optStr.default('biz_default'),
  leadMagnetId: optStr,
  leadMagnetTitle: optStr,
  campaignId: optStr,
  campaignName: optStr,
  landingSurfaceId: optStr,
  surfaceName: optStr,
  formId: optStr,
  ctaId: optStr,
  contentId: optStr,
  distributionId: optStr,
  platform: optStr.default('LINKEDIN'),
  source: LeadSourceType.default('FORM'),
  sourceUrl: optStr.default(''),
  message: optStr.default(''),
  intentScore: z.number().min(0).max(100).optional(),
  utmSource: optStr.default(''),
  utmMedium: optStr.default(''),
  utmCampaign: optStr.default(''),
  utmContent: optStr.default('')
});

const LeadUpdateSchema = z.object({
  name: optStr,
  email: optStr,
  status: LeadStatus.optional(),
  intentScore: z.number().min(0).max(100).optional(),
  notes: optStr.default('')
});

const AttributionEventSchema = z.object({
  leadId: optStr,
  contentId: optStr,
  distributionId: optStr,
  campaignId: optStr,
  source: optStr,
  platform: optStr,
  eventType: z.string().min(1, 'eventType is required'),
  eventValue: z.number().optional().default(0),
  revenueAmount: z.number().optional().default(0),
  metadata: z.record(z.any()).optional().default({}),
  timestamp: optStr
});

// ── 15b. ATTENTION OS MEASUREMENT & INTELLIGENCE SCHEMAS ─────────────────────
const AttributionEventTypeEnum = z.enum([
  'content',
  'interaction',
  'visitor',
  'lead',
  'qualified_lead',
  'conversation',
  'opportunity',
  'customer',
  'revenue'
]);

const ContentPerformanceRecordSchema = z.object({
  contentId: z.string().min(1, 'contentId is required'),
  distributionId: optStr.default(''),
  platform: optStr.default(''),
  recordedAt: optStr,
  // Reach
  impressions: z.number().int().min(0).optional().default(0),
  reach: z.number().int().min(0).optional().default(0),
  views: z.number().int().min(0).optional().default(0),
  // Engagement
  likes: z.number().int().min(0).optional().default(0),
  comments: z.number().int().min(0).optional().default(0),
  shares: z.number().int().min(0).optional().default(0),
  saves: z.number().int().min(0).optional().default(0),
  // Intent
  profileVisits: z.number().int().min(0).optional().default(0),
  clicks: z.number().int().min(0).optional().default(0),
  ctaClicks: z.number().int().min(0).optional().default(0),
  // Acquisition
  leads: z.number().int().min(0).optional().default(0),
  qualifiedLeads: z.number().int().min(0).optional().default(0),
  conversations: z.number().int().min(0).optional().default(0),
  // Commercial
  opportunities: z.number().int().min(0).optional().default(0),
  customers: z.number().int().min(0).optional().default(0),
  revenueInfluenced: z.number().min(0).optional().default(0),
  // When true (default for programmatic ingestion), the record explicitly
  // asserts that acquisition/commercial columns were measured, even if zero.
  metricsTracked: z.boolean().optional().default(true)
});

const PerformanceRecordBatchSchema = z.object({
  records: z.array(ContentPerformanceRecordSchema).min(1).max(500)
});

const AttributionEventLogSchema = z.object({
  events: z.array(AttributionEventSchema).min(1).max(500)
});

const IntelligenceFilterSchema = z.object({
  dimension: z.enum(['content', 'pillar', 'format', 'platform', 'audience']).optional().default('content'),
  days: z.number().int().min(1).max(1825).optional(),
  businessId: optStr.default('biz_default')
});

const AuthorityAssetFullSchema = z.object({
  id: optStr,
  businessId: z.string().nullable().optional().default('biz_default'),
  title: z.string().min(2, 'Title is required'),
  assetType: AuthorityAssetTypeEnum.default('CASE_STUDY'),
  source: z.string().nullable().optional().default('Client Case Study'),
  assetDate: z.string().nullable().optional().default(''),
  clientName: z.string().nullable().optional().default(''),
  problem: z.string().nullable().optional().default(''),
  result: z.string().nullable().optional().default(''),
  metric: z.string().nullable().optional().default(''),
  tags: z.array(z.string()).optional().default([]),
  permissionStatus: PermissionStatusEnum.default('APPROVED'),
  expirationDate: z.string().nullable().optional().default(''),
  proofSummary: z.string().nullable().optional().default(''),
  fileUrl: z.string().nullable().optional().default('#'),
  isArchived: z.boolean().optional().default(false)
});

const MarketSignalFullSchema = z.object({
  id: optStr,
  businessId: z.string().nullable().optional().default('biz_default'),
  title: z.string().min(2, 'Signal title is required'),
  signalType: MarketSignalTypeEnum.default('MARKET_CONVERSATION'),
  source: z.string().nullable().optional().default('Niche Observation'),
  signalDate: z.string().nullable().optional().default(''),
  relevance: z.enum(['HIGH', 'MEDIUM', 'LOW']).default('HIGH'),
  icpRelevance: z.string().nullable().optional().default(''),
  topic: z.string().nullable().optional().default(''),
  summary: z.string().nullable().optional().default(''),
  potentialContentAngle: z.string().nullable().optional().default(''),
  isConvertedToIdea: z.boolean().optional().default(false),
  convertedIdeaId: z.string().nullable().optional().default(''),
  isArchived: z.boolean().optional().default(false)
});

const OutreachProspectFullSchema = z.object({
  id: optStr,
  businessId: z.string().nullable().optional().default('biz_default'),
  prospectName: z.string().min(2, 'Prospect name is required'),
  source: z.string().nullable().optional().default('LinkedIn Search'),
  platform: PlatformType.default('LINKEDIN'),
  initialMessage: z.string().nullable().optional().default(''),
  contactDate: z.string().nullable().optional().default(''),
  followUpDate: z.string().nullable().optional().default(''),
  latestReply: z.string().nullable().optional().default(''),
  replyClassification: ReplyClassificationEnum.default('UNKNOWN'),
  conversationHistory: z.array(z.record(z.any())).optional().default([]),
  qualifiedStatus: z.enum(['UNQUALIFIED', 'QUALIFIED', 'BOOKED', 'CLOSED']).default('UNQUALIFIED'),
  icpScore: z.number().int().min(0).max(100).optional().default(85),
  status: z.string().nullable().optional().default('NEW'),
  isArchived: z.boolean().optional().default(false)
});

const ReplyClassificationRequestSchema = z.object({
  replyText: z.string().min(1, 'Reply text is required'),
  prospectId: optStr
});

// ── 16. CONVERSION OS SCHEMAS (ASENZO ENGINE 2) ──────────────────────────────
const DealStageEnum = z.enum([
  'QUALIFIED_LEAD',
  'BOOKING_PENDING',
  'CALL_SCHEDULED',
  'CALL_COMPLETED',
  'FOLLOWUP_SEQUENCE',
  'PROPOSAL_SENT',
  'CONTRACT_SENT',
  'PAYMENT_PENDING',
  'CLOSED_WON',
  'CLOSED_LOST'
]);

const DealStatusEnum = z.enum(['OPEN', 'WON', 'LOST', 'ON_HOLD']);
const CallOutcomeEnum = z.enum(['ADVANCED', 'PROPOSAL_REQUESTED', 'OBJECTION_STALLED', 'NO_SHOW', 'CLOSED_WON', 'CLOSED_LOST', 'FOLLOWUP_SCHEDULED']);
const ProposalStatusEnum = z.enum(['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED']);
const ContractStatusEnum = z.enum(['DRAFT', 'SENT', 'SIGNED', 'VOID', 'EXPIRED']);
const PaymentStatusEnum = z.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']);

const VslFunnelSchema = z.object({
  id: optStr,
  businessId: z.string().nullable().optional().default('biz_default'),
  title: z.string().min(2, 'VSL title is required').default('The ASENZO 5-Engine Growth OS Mechanism Breakdown'),
  headline: z.string().min(5, 'Headline is required').default('How Bootstrapped B2B Founders Scale to $100k/mo With 85+ Founder Independence'),
  subheadline: z.string().nullable().optional().default('Replace retainer agencies with an internal growth operating system in 90 days.'),
  videoUrl: z.string().nullable().optional().default('https://vimeo.com/asenzo-growth-os-vsl'),
  durationSeconds: z.number().int().optional().default(1140),
  pitchSummary: z.string().nullable().optional().default('Detailed breakdown of Attention OS, Conversion OS, and Delivery OS.'),
  ctaButtonText: z.string().nullable().optional().default('Book Your Founder Growth OS Audit'),
  bookingUrl: z.string().nullable().optional().default('https://cal.com/asenzo/growth-audit'),
  proofAssetIds: z.array(z.string()).optional().default([]),
  isActive: z.boolean().optional().default(true)
});

const DmQualifierSchema = z.object({
  id: optStr,
  businessId: z.string().nullable().optional().default('biz_default'),
  name: z.string().min(2, 'Qualifier name is required').default('B2B Agency Founder DM Qualifier'),
  questions: z.array(z.string()).optional().default([
    'What is your current monthly revenue range?',
    'How many hours per week do you spend on marketing & sales?',
    'What is your primary bottleneck right now?'
  ]),
  minRevenueThreshold: z.string().nullable().optional().default('$20k/mo'),
  disqualificationCriteria: z.array(z.string()).optional().default(['Pre-revenue', 'Looking for cheap outsourced DMs']),
  objectionResponses: z.record(z.any()).optional().default({}),
  bookingTriggerScore: z.number().int().optional().default(80),
  isActive: z.boolean().optional().default(true)
});

const StorySequenceSchema = z.object({
  id: optStr,
  businessId: z.string().nullable().optional().default('biz_default'),
  name: z.string().min(2, 'Sequence name is required').default('5-Day Founder Independence Story Nurture'),
  triggerEvent: z.string().nullable().optional().default('QUALIFIED_LEAD_CAPTURED'),
  steps: z.array(z.object({
    day: z.number().int(),
    subject: z.string(),
    storyAngle: z.string(),
    ctaText: z.string(),
    proofAssetId: z.string().optional()
  })).optional().default([]),
  isActive: z.boolean().optional().default(true)
});

const DealFullSchema = z.object({
  id: optStr,
  businessId: z.string().nullable().optional().default('biz_default'),
  leadId: z.string().nullable().optional().default(''),
  prospectId: z.string().nullable().optional().default(''),
  dealName: z.string().min(2, 'Deal name is required'),
  contactName: z.string().min(2, 'Contact name is required'),
  companyName: z.string().nullable().optional().default(''),
  contactEmail: z.string().nullable().optional().default(''),
  stage: DealStageEnum.default('QUALIFIED_LEAD'),
  amount: z.number().min(0).optional().default(12500),
  closeProbability: z.number().min(0).max(100).optional().default(50),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).default('HIGH'),
  founderAttentionRequired: z.boolean().optional().default(false),
  attentionReason: z.string().nullable().optional().default(''),
  nextAction: z.string().nullable().optional().default('Schedule Call'),
  nextActionDueAt: z.string().nullable().optional().default(''),
  status: DealStatusEnum.default('OPEN'),
  wonAt: z.string().nullable().optional().default(''),
  lostAt: z.string().nullable().optional().default(''),
  lostReason: z.string().nullable().optional().default(''),
  notes: z.string().nullable().optional().default(''),
  owner: z.string().nullable().optional().default('Alex Morgan'),
  source: z.string().nullable().optional().default('CONVERSION_OS'),
  risk: z.string().nullable().optional().default('None'),
  stageEnteredAt: z.string().nullable().optional().default(''),
  blockingFactor: z.string().nullable().optional().default(''),
  whatIsHappening: z.string().nullable().optional().default('')
});

const SalesCallFullSchema = z.object({
  id: optStr,
  businessId: z.string().nullable().optional().default('biz_default'),
  dealId: z.string().min(1, 'Deal ID is required'),
  leadId: z.string().nullable().optional().default(''),
  scheduledAt: z.string().nullable().optional().default(''),
  completedAt: z.string().nullable().optional().default(''),
  recordingUrl: z.string().nullable().optional().default(''),
  transcriptText: z.string().nullable().optional().default('Standard sales call transcript log.'),
  durationSeconds: z.number().int().min(1, 'Duration must be positive').optional().default(1800),
  callType: z.string().nullable().optional().default('DISCOVERY_DEMO'),
  outcome: CallOutcomeEnum.default('ADVANCED'),
  founderCallRating: z.number().int().min(1).max(5).optional().default(4),
  isBenchmarkCall: z.boolean().optional().default(false)
});

const PostCallCoachingFullSchema = z.object({
  id: optStr,
  businessId: z.string().nullable().optional().default('biz_default'),
  salesCallId: z.string().min(1, 'Sales Call ID is required'),
  dealId: z.string().min(1, 'Deal ID is required'),
  benchmarkCallId: z.string().nullable().optional().default(''),
  trustScore: z.number().int().min(0).max(100).optional().default(85),
  mechanismClarityScore: z.number().int().min(0).max(100).optional().default(88),
  objectionHandlingScore: z.number().int().min(0).max(100).optional().default(82),
  overallCallScore: z.number().int().min(0).max(100).optional().default(85),
  benchmarkComparisonJson: z.record(z.any()).optional().default({}),
  founderPatternMatchesJson: z.record(z.any()).optional().default({}),
  coachingTipsJson: z.array(z.string()).optional().default([]),
  objectionsDetectedJson: z.array(z.string()).optional().default([]),
  humanReviewed: z.boolean().optional().default(false)
});

const ObjectionItemFullSchema = z.object({
  id: optStr,
  businessId: z.string().nullable().optional().default('biz_default'),
  objectionText: z.string().min(2, 'Objection text is required'),
  category: z.string().nullable().optional().default('PRICING'),
  founderResponseScript: z.string().min(5, 'Founder response script is required'),
  winningAngle: z.string().nullable().optional().default('Refine pricing as operating system vs agency retainer cost'),
  frequencyCount: z.number().int().optional().default(1),
  successRate: z.number().min(0).max(100).optional().default(80)
});

const ProposalFullSchema = z.object({
  id: optStr,
  businessId: z.string().nullable().optional().default('biz_default'),
  dealId: z.string().min(1, 'Deal ID is required'),
  title: z.string().min(2, 'Proposal title is required'),
  deliverablesJson: z.array(z.string()).optional().default(['Attention OS Engine', 'Conversion OS CRM Triage', 'Delivery OS Setup']),
  pricingAmount: z.number().min(0).optional().default(12500),
  paymentTerms: z.string().nullable().optional().default('$12,500 setup + 10% performance milestone'),
  customTerms: z.string().nullable().optional().default('90-day installation support with weekly founder review.'),
  status: ProposalStatusEnum.default('DRAFT'),
  sentAt: z.string().nullable().optional().default(''),
  acceptedAt: z.string().nullable().optional().default('')
});

const ContractFullSchema = z.object({
  id: optStr,
  businessId: z.string().nullable().optional().default('biz_default'),
  dealId: z.string().min(1, 'Deal ID is required'),
  proposalId: z.string().nullable().optional().default(''),
  contractType: z.string().nullable().optional().default('GROWTH_OS_INSTALLATION'),
  documentUrl: z.string().nullable().optional().default('https://docs.asenzo.ai/contract-101.pdf'),
  signatureProof: z.string().nullable().optional().default(''),
  status: ContractStatusEnum.default('DRAFT'),
  sentAt: z.string().nullable().optional().default(''),
  signedAt: z.string().nullable().optional().default('')
});

const PaymentFullSchema = z.object({
  id: optStr,
  businessId: z.string().nullable().optional().default('biz_default'),
  dealId: z.string().min(1, 'Deal ID is required'),
  contractId: z.string().nullable().optional().default(''),
  amount: z.number().min(1, 'Payment amount must be greater than 0'),
  currency: z.string().nullable().optional().default('USD'),
  paymentMethod: z.string().nullable().optional().default('STRIPE_CREDIT_CARD'),
  transactionId: z.string().min(2, 'Transaction ID is required'),
  status: PaymentStatusEnum.default('COMPLETED'),
  paidAt: z.string().nullable().optional().default('')
});

const DeliveryHandoffFullSchema = z.object({
  id: optStr,
  businessId: z.string().nullable().optional().default('biz_default'),
  dealId: z.string().min(1, 'Deal ID is required'),
  clientName: z.string().min(2, 'Client name is required'),
  onboardingChecklistJson: z.array(z.string()).optional().default([
    'Kickoff strategy call scheduled',
    'Founder knowledge ingestion completed',
    'Attention OS content engine configured',
    'Conversion OS CRM triage enabled'
  ]),
  assignedOwner: z.string().nullable().optional().default('Alex Morgan'),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).default('PENDING')
});


  // ── 17. GRANULAR CONVERSION DOMAIN SCHEMAS ────────────────────────────────────
const SalesPipelineSchema = z.object({
  id: optStr,
  businessId: z.string().nullable().optional().default('biz_default'),
  name: z.string().min(2, 'Pipeline name is required'),
  description: z.string().nullable().optional().default(''),
  isDefault: z.boolean().optional().default(true),
  isActive: z.boolean().optional().default(true)
});

const PipelineStageSchema = z.object({
  id: optStr,
  pipelineId: z.string().min(1, 'Pipeline ID is required'),
  businessId: z.string().nullable().optional().default('biz_default'),
  name: z.string().min(1, 'Stage name is required'),
  orderIndex: z.number().int().min(1).default(1),
  stageType: z.enum(['QUALIFICATION', 'BOOKING', 'CALL', 'FOLLOWUP', 'CLOSING', 'WON', 'LOST']).default('QUALIFICATION'),
  description: z.string().nullable().optional().default(''),
  entryConditions: z.string().nullable().optional().default(''),
  exitConditions: z.string().nullable().optional().default(''),
  expectedNextAction: z.string().nullable().optional().default(''),
  probability: z.number().int().min(0).max(100).optional().default(50),
  isActive: z.boolean().optional().default(true)
});

const DealStageHistorySchema = z.object({
  id: optStr,
  dealId: z.string().min(1, 'Deal ID is required'),
  businessId: z.string().nullable().optional().default('biz_default'),
  fromStageId: z.string().nullable().optional().default(''),
  toStageId: z.string().min(1, 'Target stage ID is required'),
  transitionReason: z.string().nullable().optional().default(''),
  movedByUser: z.string().nullable().optional().default('HUMAN_OPERATOR')
});

const LeadQualificationSchema = z.object({
  id: optStr,
  leadId: z.string().min(1, 'Lead ID is required'),
  dealId: z.string().nullable().optional().default(''),
  businessId: z.string().nullable().optional().default('biz_default'),
  score: z.number().int().min(0).max(100).default(85),
  budgetQualified: z.boolean().optional().default(true),
  authorityQualified: z.boolean().optional().default(true),
  needQualified: z.boolean().optional().default(true),
  timelineQualified: z.boolean().optional().default(true),
  disqualificationReason: z.string().nullable().optional().default(''),
  qualifierNotes: z.string().nullable().optional().default('')
});

const DMConversationSchema = z.object({
  id: optStr,
  prospectId: z.string().nullable().optional().default(''),
  dealId: z.string().nullable().optional().default(''),
  businessId: z.string().nullable().optional().default('biz_default'),
  platform: z.string().default('LINKEDIN'),
  participantHandle: z.string().min(1, 'Participant handle is required'),
  status: z.enum(['ACTIVE', 'QUALIFIED', 'BOOKED', 'DISQUALIFIED', 'ARCHIVED']).default('ACTIVE')
});

const DMMessageSchema = z.object({
  id: optStr,
  conversationId: z.string().min(1, 'Conversation ID is required'),
  businessId: z.string().nullable().optional().default('biz_default'),
  senderType: z.enum(['PROSPECT', 'FOUNDER', 'CLOSER', 'AI']).default('PROSPECT'),
  messageText: z.string().min(1, 'Message text is required'),
  sentAt: z.string().nullable().optional().default('')
});

const SalesCallParticipantSchema = z.object({
  id: optStr,
  salesCallId: z.string().min(1, 'Sales Call ID is required'),
  name: z.string().min(1, 'Participant name is required'),
  role: z.enum(['HOST', 'PROSPECT', 'DECISION_MAKER', 'CLOSER']).default('PROSPECT'),
  email: z.string().nullable().optional().default('')
});

const SalesCallTranscriptSchema = z.object({
  id: optStr,
  salesCallId: z.string().min(1, 'Sales Call ID is required'),
  transcriptText: z.string().min(5, 'Transcript text is required'),
  speakerTurnsJson: z.array(z.any()).optional().default([])
});

const SalesCallNoteSchema = z.object({
  id: optStr,
  salesCallId: z.string().min(1, 'Sales Call ID is required'),
  noteText: z.string().min(1, 'Note text is required'),
  authorName: z.string().nullable().optional().default('Alex Morgan')
});

const SalesCallOutcomeSchema = z.object({
  id: optStr,
  salesCallId: z.string().min(1, 'Sales Call ID is required'),
  dealId: z.string().min(1, 'Deal ID is required'),
  outcomeType: z.string().min(1, 'Outcome type is required'),
  nextStepAction: z.string().nullable().optional().default(''),
  nextStepDueAt: z.string().nullable().optional().default('')
});

const SalesMethodSchema = z.object({
  id: optStr,
  businessId: z.string().nullable().optional().default('biz_default'),
  name: z.string().min(2, 'Method name is required'),
  frameworkSummary: z.string().min(5, 'Framework summary is required'),
  keyQuestionsJson: z.array(z.string()).optional().default([]),
  isActive: z.boolean().optional().default(true)
});

const TopPerformingCallSchema = z.object({
  id: optStr,
  salesCallId: z.string().min(1, 'Sales Call ID is required'),
  businessId: z.string().nullable().optional().default('biz_default'),
  benchmarkCategory: z.string().default('MECHANISM_PITCH'),
  whyTopPerforming: z.string().min(5, 'Explanation is required')
});

const CloserSchema = z.object({
  id: optStr,
  businessId: z.string().nullable().optional().default('biz_default'),
  name: z.string().min(2, 'Closer name is required'),
  email: z.string().min(3, 'Valid email is required'),
  role: z.enum(['FOUNDER', 'SENIOR_CLOSER', 'CLOSER', 'SETTER']).default('FOUNDER'),
  quotaAmount: z.number().min(0).optional().default(50000),
  isActive: z.boolean().optional().default(true)
});

const CloserPerformanceSchema = z.object({
  id: optStr,
  closerId: z.string().min(1, 'Closer ID is required'),
  businessId: z.string().nullable().optional().default('biz_default'),
  period: z.string().default('2026-Q3'),
  callsTaken: z.number().int().min(0).default(0),
  dealsWon: z.number().int().min(0).default(0),
  revenueClosed: z.number().min(0).default(0),
  winRate: z.number().min(0).max(100).default(0),
  avgCallScore: z.number().min(0).max(100).default(85)
});

const FollowUpMessageSchema = z.object({
  id: optStr,
  sequenceId: z.string().min(1, 'Sequence ID is required'),
  dealId: z.string().min(1, 'Deal ID is required'),
  businessId: z.string().nullable().optional().default('biz_default'),
  stepIndex: z.number().int().min(1).default(1),
  messageSubject: z.string().min(1, 'Subject is required'),
  messageText: z.string().min(1, 'Message text is required'),
  status: z.enum(['PENDING', 'SENT', 'FAILED', 'CANCELLED']).default('PENDING'),
  sentAt: z.string().nullable().optional().default('')
});

const ObjectionOccurrenceSchema = z.object({
  id: optStr,
  objectionId: z.string().min(1, 'Objection ID is required'),
  salesCallId: z.string().nullable().optional().default(''),
  dealId: z.string().min(1, 'Deal ID is required'),
  businessId: z.string().nullable().optional().default('biz_default'),
  detectedInText: z.string().nullable().optional().default(''),
  handlingSuccess: z.boolean().optional().default(true)
});

const ObjectionPatternSchema = z.object({
  id: optStr,
  businessId: z.string().nullable().optional().default('biz_default'),
  patternName: z.string().min(2, 'Pattern name is required'),
  objectionIdsJson: z.array(z.string()).optional().default([]),
  bestCounterStrategy: z.string().min(5, 'Counter strategy is required'),
  successRate: z.number().min(0).max(100).default(85)
});

const DealAutomationSchema = z.object({
  id: optStr,
  businessId: z.string().nullable().optional().default('biz_default'),
  triggerEvent: z.string().min(1, 'Trigger event is required'),
  conditionJson: z.record(z.any()).optional().default({}),
  actionType: z.string().min(1, 'Action type is required'),
  actionPayloadJson: z.record(z.any()).optional().default({}),
  isActive: z.boolean().optional().default(true)
});

const SalesActivitySchema = z.object({
  id: optStr,
  dealId: z.string().min(1, 'Deal ID is required'),
  businessId: z.string().nullable().optional().default('biz_default'),
  activityType: z.string().min(1, 'Activity type is required'),
  description: z.string().min(1, 'Description is required'),
  performedBy: z.string().nullable().optional().default('Alex Morgan'),
  timestamp: z.string().nullable().optional().default('')
});

const ConversionEventSchema = z.object({
  id: optStr,
  dealId: z.string().nullable().optional().default(''),
  businessId: z.string().nullable().optional().default('biz_default'),
  eventName: z.string().min(1, 'Event name is required'),
  value: z.number().min(0).optional().default(0),
  metadataJson: z.record(z.any()).optional().default({}),
  timestamp: z.string().nullable().optional().default('')
});

const SalesRecommendationSchema = z.object({
  id: optStr,
  dealId: z.string().min(1, 'Deal ID is required'),
  businessId: z.string().nullable().optional().default('biz_default'),
  category: z.string().default('PIPELINE_TRIAGE'),
  observation: z.string().min(5, 'Observation is required'),
  rationale: z.string().min(5, 'Rationale is required'),
  proposedAction: z.string().min(5, 'Proposed action is required'),
  confidenceScore: z.number().min(0).max(100).default(90),
  status: z.enum(['PENDING', 'APPLIED', 'DISMISSED']).default('PENDING')
});

const AICoachingSessionSchema = z.object({
  id: optStr,
  salesCallId: z.string().min(1, 'Sales call ID is required'),
  dealId: z.string().min(1, 'Deal ID is required'),
  businessId: z.string().nullable().optional().default('biz_default'),
  closerId: z.string().nullable().optional().default(''),
  trustScore: z.number().int().min(0).max(100).default(85),
  mechanismClarityScore: z.number().int().min(0).max(100).default(88),
  objectionHandlingScore: z.number().int().min(0).max(100).default(82),
  overallScore: z.number().int().min(0).max(100).default(85),
  coachingTipsJson: z.array(z.string()).optional().default([]),
  humanReviewed: z.boolean().optional().default(false)
});

// ── 18. PROFILE FUNNEL & VSL SYSTEM SCHEMAS ──────────────────────────────────
const ProfileFunnelFullSchema = z.object({
  id: optStr,
  businessId: z.string().nullable().optional().default('biz_default'),
  title: z.string().min(2, 'Funnel title is required'),
  slug: z.string().nullable().optional().default('growth-os-audit'),
  publishingStatus: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  headline: z.string().min(5, 'Headline is required'),
  targetIcpSummary: z.string().nullable().optional().default('Bootstrapped B2B Founders doing $15k–$50k/mo'),
  coreProblem: z.string().nullable().optional().default('Trapped in 60-hr workweeks serving as single bottleneck for marketing & sales'),
  desiredOutcome: z.string().nullable().optional().default('Scale to $100k/mo while increasing Founder Independence Score from 30 to 85+'),
  uniqueMechanism: z.string().nullable().optional().default('The ASENZO 5-Engine Growth OS Framework'),
  vslTitle: z.string().min(2, 'VSL title is required'),
  vslVideoUrl: z.string().nullable().optional().default('https://vimeo.com/765432109'),
  vslHook: z.string().min(5, 'VSL hook is required'),
  vslProblem: z.string().min(5, 'VSL problem breakdown is required'),
  vslMechanism: z.string().min(5, 'VSL mechanism breakdown is required'),
  vslProofSummary: z.string().nullable().optional().default('Case study: SaaSify scaled from $25k to $60k/mo ARR in 90 days.'),
  vslCtaText: z.string().min(2, 'CTA text is required'),
  bookingUrl: z.string().nullable().optional().default('https://cal.com/asenzo/growth-audit'),
  authorityAssetIdsJson: z.array(z.string()).optional().default([]),
  objectionIdsJson: z.array(z.string()).optional().default([]),
  version: z.number().int().min(1).default(1),
  isActive: z.boolean().optional().default(true)
});

const FunnelVersionSchema = z.object({
  id: optStr,
  funnelId: z.string().min(1, 'Funnel ID is required'),
  businessId: z.string().nullable().optional().default('biz_default'),
  versionNumber: z.number().int().min(1).default(1),
  snapshotJson: z.record(z.any()).optional().default({}),
  createdBy: z.string().nullable().optional().default('Alex Morgan'),
  changeSummary: z.string().min(2, 'Change summary is required')
});

const FunnelAnalyticsEventSchema = z.object({
  id: optStr,
  funnelId: z.string().min(1, 'Funnel ID is required'),
  businessId: z.string().nullable().optional().default('biz_default'),
  eventType: z.enum(['VISIT', 'CTA_CLICK', 'QUALIFICATION_START', 'QUALIFICATION_COMPLETE', 'BOOKING']).default('VISIT'),
  visitorId: z.string().nullable().optional().default(''),
  sourceContentId: z.string().nullable().optional().default(''),
  environment: z.enum(['PRODUCTION', 'TEST_SIMULATED']).default('PRODUCTION'),
  metadataJson: z.record(z.any()).optional().default({})
});

module.exports = {
  // Enums
  ContentLifecycleStatus,
  KnowledgeSourceType,
  ContentPillarType,
  PlatformType,
  DistributionStatus,
  LeadStatus,
  OutreachStatus,
  RecommendationCategory,
  RecommendationStatus,
  AuditActionType,
  ContentPillarStatus,
  ContentIdeaSource,
  ContentIdeaStatus,
  ContentFormatType,
  IdeaPriorityType,
  HookStyleEnum,
  ScriptPlatformEnum,
  AccountStatus,
  CampaignStatus,
  SurfaceType,
  LeadSourceType,
  CtaType,
  AuthorityAssetTypeEnum,
  PermissionStatusEnum,
  MarketSignalTypeEnum,
  ReplyClassificationEnum,

  // Entity Schemas
  FounderProfileFullSchema,
  BrandProfileFullSchema,
  KnowledgeSourceIngestSchema,
  FounderVoiceProfileSchema,
  IcpFullSchema,
  PositioningFullSchema,
  OfferFullSchema,
  ContentSchema,
  ContentTransitionSchema,
  ContentAssetSchema,
  ScriptGenerationRequestSchema,
  ContentPillarFullSchema,
  ContentIdeaSchema,
  ContentIdeaGenerateRequestSchema,

  // AI Hook & Script Schemas
  HookGenerationRequestSchema,
  ScriptGenerationFullRequestSchema,
  GuardrailValidationSchema,
  ContentVersionSaveSchema,

  // Distribution & Platform Schemas
  PlatformRegisterSchema,
  PlatformAccountConnectSchema,
  PlatformAccountUpdateSchema,
  DistributionCreateSchema,
  DistributionScheduleSchema,
  DistributionPublishSchema,

  // Lead Capture Schemas
  LeadMagnetSchema,
  LeadCampaignSchema,
  LandingSurfaceSchema,
  LandingFormSchema,
  LeadCtaSchema,
  LeadCaptureSchema,
  LeadUpdateSchema,
  AttributionEventSchema,

  // Attention OS Measurement & Intelligence Schemas
  AttributionEventTypeEnum,
  ContentPerformanceRecordSchema,
  PerformanceRecordBatchSchema,
  AttributionEventLogSchema,
  IntelligenceFilterSchema,

  // Acquisition Support Systems Schemas
  AuthorityAssetFullSchema,
  MarketSignalFullSchema,
  OutreachProspectFullSchema,
  ReplyClassificationRequestSchema,

  // Conversion OS Schemas (ASENZO Engine 2)
  DealStageEnum,
  DealStatusEnum,
  CallOutcomeEnum,
  ProposalStatusEnum,
  ContractStatusEnum,
  PaymentStatusEnum,
  VslFunnelSchema,
  DmQualifierSchema,
  StorySequenceSchema,
  DealFullSchema,
  SalesCallFullSchema,
  PostCallCoachingFullSchema,
  ObjectionItemFullSchema,
  ProposalFullSchema,
  ContractFullSchema,
  PaymentFullSchema,
  DeliveryHandoffFullSchema,

  // Granular Conversion Domain Schemas
  SalesPipelineSchema,
  PipelineStageSchema,
  DealStageHistorySchema,
  LeadQualificationSchema,
  DMConversationSchema,
  DMMessageSchema,
  SalesCallParticipantSchema,
  SalesCallTranscriptSchema,
  SalesCallNoteSchema,
  SalesCallOutcomeSchema,
  SalesMethodSchema,
  TopPerformingCallSchema,
  CloserSchema,
  CloserPerformanceSchema,
  FollowUpMessageSchema,
  ObjectionOccurrenceSchema,
  ObjectionPatternSchema,
  DealAutomationSchema,
  SalesActivitySchema,
  ConversionEventSchema,
  SalesRecommendationSchema,
  AICoachingSessionSchema,

  // Profile Funnel & VSL System Schemas
  ProfileFunnelFullSchema,
  FunnelVersionSchema,
  FunnelAnalyticsEventSchema
};
