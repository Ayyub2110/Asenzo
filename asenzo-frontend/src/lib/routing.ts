/**
 * ASENZO GLOBAL ACTION MAP
 * This centralized architecture defines where every specific operational function 
 * actually lives, ensuring that clicking a dashboard metric, a status, or an alert
 * instantly takes the founder to the exact filtered view required to take action.
 */

export const ACTION_MAP = {
  // Command Center
  openCommandCenter: () => '/',

  // Foundation
  openFoundation: () => '/foundation',


  // Acquisition 
  openAcquisition: () => '/acquisition',
  openContentStrategy: () => '/acquisition/strategy',
  openContentCalendar: () => '/acquisition/calendar',
  openProductionQueue: () => '/acquisition/production?filter=active', // Specific queue
  openScripts: () => '/acquisition/scripts',
  openStories: () => '/acquisition/stories',
  openOutreach: () => '/acquisition/outreach',
  openAcquisitionAnalytics: () => '/acquisition/analytics',

  // Conversion
  openConversion: () => '/conversion',
  openConversionInbox: () => '/conversion/inbox', // DM Triage / Incoming Leads
  openLeadQualification: (status?: string) =>
    status ? `/conversion/qualification?status=${status}` : '/conversion/qualification',
  openApplications: () => '/conversion/applications',
  openBooking: () => '/conversion/booking',
  openNurture: () => '/conversion/nurture',
  openConversionAssets: () => '/conversion/assets',
  openConversionAnalytics: () => '/conversion/analytics',

  // Revenue 
  openRevenue: () => '/revenue',
  openSalesPipeline: (view: string = 'active') => `/revenue/pipeline?view=${view}`,
  openCloserRoom: () => '/revenue/closer',
  openSalesPlaybook: () => '/revenue/playbook',
  openProposals: () => '/revenue/proposals',
  openFollowUps: () => '/revenue/followups',
  openObjections: () => '/revenue/objections',
  openClosedLost: () => '/revenue/lost',
  openRevenueDashboard: () => '/revenue/analytics',

  // Delivery
  openDelivery: () => '/delivery',
  openClientHealth: (status?: string) => `/delivery/health${status ? `?filter=${status}` : ''}`,
  openOnboarding: () => `/delivery/onboarding`,
  openDeliveryProjects: (filter?: string) => `/delivery/engagements${filter ? `?filter=${filter}` : ''}`,
  openRetentionAndProof: () => '/delivery/retention',
  openClientTimeline: (clientId: string) => `/delivery/clients/${clientId}`,
  openEngagements: () => '/delivery/engagements',
  openMilestones: () => '/delivery/milestones',
  openDeliverables: () => '/delivery/deliverables',
  openClientCommunication: () => '/delivery/communication',
  openReporting: () => '/delivery/reporting',

  // Intelligence
  openIntelligence: () => '/intelligence',
  openBusinessPulse: () => '/intelligence',
  openConstraints: (constraintId?: string) =>
    constraintId ? `/intelligence/constraints?id=${constraintId}` : '/intelligence/constraints',
  openIntelligenceOpportunities: () => '/intelligence/opportunities',
  openIntelligenceRisks: () => '/intelligence/risks',
  openAttribution: () => '/intelligence/attribution',
  openChannelPerformance: () => '/intelligence/channels',
  openContentToRevenue: () => '/intelligence/content-revenue',
  openFounderIndependence: () => '/intelligence/founder-independence',
  openRecommendations: () => '/intelligence/recommendations',
  openStrategicReviews: () => '/intelligence/reviews',

  // Operations / Shared Configurations
  openApprovals: () => '/operations/approvals',
  openTeamCapacity: () => '/operations/capacity',
};
