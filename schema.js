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
const PlatformType = z.enum(['LINKEDIN', 'X_TWITTER', 'YOUTUBE', 'SKOOL', 'NEWSLETTER', 'PODCAST']);
const DistributionStatus = z.enum(['DRAFT', 'SCHEDULED', 'PUBLISHED', 'FAILED', 'CANCELLED']);
const LeadStatus = z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'DISQUALIFIED', 'CONVERTED']);
const OutreachStatus = z.enum(['QUEUED', 'SENT', 'DELIVERED', 'REPLIED', 'BOUNCED']);
const RecommendationCategory = z.enum(['PILLAR_OPTIMIZATION', 'HOOK_IMPROVEMENT', 'AD_AMPLIFICATION', 'CADENCE_ADJUSTMENT', 'CONTENT_GAP']);
const RecommendationStatus = z.enum(['PENDING', 'APPROVED', 'REJECTED', 'APPLIED', 'DISMISSED']);
const AuditActionType = z.enum(['CREATE', 'UPDATE', 'DELETE', 'STATUS_CHANGE', 'VERSION_CREATE', 'AI_GENERATE']);

const ContentPillarStatus = z.enum(['ACTIVE', 'PAUSED', 'ARCHIVED']);
const ContentIdeaSource = z.enum(['MANUAL', 'AI_GENERATED', 'CUSTOMER_QUESTION', 'OBJECTION', 'SALES_CONVERSATION', 'CASE_STUDY', 'MARKET_INTEL', 'SUCCESSFUL_CONTENT']);
const ContentIdeaStatus = z.enum(['NEW', 'PRIORITIZED', 'PLANNED', 'IN_PRODUCTION', 'PUBLISHED', 'CONVERTED', 'ARCHIVED']);
const ContentFormatType = z.enum(['POST', 'CAROUSEL', 'VIDEO', 'NEWSLETTER', 'CASE_STUDY', 'THREAD', 'LEAD_MAGNET']);
const IdeaPriorityType = z.enum(['LOW', 'MEDIUM', 'HIGH']);

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
  ContentVersionSaveSchema
};
