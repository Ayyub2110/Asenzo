import {
  CommandCenterData,
  FoundationData,
  AttentionData,
  ConversionData,
  DeliveryData,
  // Phase 3 Research Types
  Creator,
  CreatorChannel,
  ContentReference,
  OutlierAnalysis,
  ResearchSignal,
  ContentPattern,
  // Phase 4 Idea Types
  ContentIdea,
  ContentAngle,
  Hook,
} from "../types";

export const mockCommandCenter: CommandCenterData = {
  primaryConstraint: "Conversion Pipeline Velocity is dropping. 3 Follow-ups idle.",
  weeklyDirective: "Standardize Sales Call Qualification to reduce No-Shows.",
  founderIndependenceScore: 32,
  pulseMetrics: [
    { title: "Active Deals", value: "$42,500", deltaText: "12% vs last week", deltaTrend: "up", iconName: "monitoring" },
    { title: "Scripts Pending", value: "4", deltaTrend: "neutral", iconName: "edit_document" },
    { title: "Delivery At Risk", value: "1", deltaText: "Requires Attention", deltaTrend: "down", iconName: "warning" },
    { title: "Content Velocity", value: "8", deltaText: "Posts this week", deltaTrend: "up", iconName: "campaign" }
  ],
  actionQueue: [
    { id: "a1", title: "Review 'Q3 Scaling' Script", subtitle: "Attention Engine generated draft.", type: "review", priority: "medium", timestamp: "2h ago" },
    { id: "a2", title: "Follow-up with Acme Corp", subtitle: "Proposal opened 3 times today.", type: "follow_up", priority: "high", timestamp: "4h ago" },
    { id: "a3", title: "Investigate churn risk: TechNova", subtitle: "Delivery milestone delayed by 4 days.", type: "investigate", priority: "high", timestamp: "5h ago" }
  ],
  automationStatus: {
    "linkedin_sync": "CONNECTED",
    "n8n_webhook": "NOT_CONFIGURED",
    "crm_sync": "SUCCESS"
  }
};

export const mockFoundation: FoundationData = {
  coreDna: {
    businessName: "ASENZO Growth OS",
    businessDescription: "An operating system for founder-led businesses to scale predictably while removing the founder as the bottleneck.",
    businessModel: "High-ticket coaching and DFY implementation",
    coreProblemSolved: "Trapped in 60-hour workweeks serving as the single bottleneck to growth.",
    primaryTransformation: "Scale to $100k/mo while increasing Founder Independence score above 80/100.",
    differentiation: "A cohesive operating system integrating Attention, Conversion, and Delivery, not just another generalized CRM or chat bot.",
    positioning: "The premium, contrarian approach to building a real business rather than a personal gig."
  },
  icp: {
    description: "Bootstrapped B2B Service Founders and Agency Owners doing $15k-$50k/month.",
    industry: "B2B Services, Agencies, specialized Consulting",
    painPoints: ["Fulfillment consumes 80% of time", "Sales calls feel like interrogations", "Lead flow is unpredictable word-of-mouth"],
    desiredOutcomes: ["Predictable pipeline", "Decoupled time from earning", "High-ticket closing velocity"],
    disqualifiers: ["Pre-revenue", "B2C e-commerce", "Looking for magic software rather than operational excellence"]
  },
  offer: {
    overview: "ASENZO Framework Implementation (12-Week Sprint)",
    problem: "Operational chaos limiting scale.",
    transformation: "A streamlined, founder-independent growth engine running natively in the client's business.",
    deliverables: ["Custom ASENZO Workspace", "Script Builder", "Conversion Pipeline maps", "Delivery templates"],
    proof: "Over 50 founders successfully scaled past $100k/mo using this exact operating structure."
  },
  brandVoice: {
    tone: "Authoritative, premium, direct, and slightly contrarian.",
    terminology: ["Growth OS", "Founder Independence", "Bottleneck", "Pipeline velocity"],
    avoidWords: ["Hustle", "Hack", "Passive income", "Synergy"]
  },
  founderVoice: {
    configured: false,
    cadence: "Conversational, highly technical, uses first-principles thinking.",
    phrases: ["Let's be clear", "The reality is", "Essentially"],
    neverSay: ["Just wanted to touch base", "Pick your brain"]
  },
  readiness: {
    percentage: 82,
    status: "Partially Configured",
    missingItems: ["Founder Voice unconfigured", "Offer constraints missing"]
  }
};

export const mockAttention: AttentionData = {
  ideas: [
    {
      id: "i1",
      title: "Why scaling breaks at $50k/mo",
      stage: "TOF",
      status: "FOUNDER_REVIEW",
      libraryStatus: "ACTIVE",
      framework: "Contrarian Truth",
      angle: "Target the single-point-of-failure fallacy common in agency owners.",
      outputGoal: "Drive awareness of operational fragility and introduce the concept of 'Founder Independence' as the real metric of scale.",
      contentDraft: "Most service founders hit a brutal ceiling at $50k/month.\n\nAnd they try to solve it incorrectly.\n\nThe instinct is to push harder. Clone yourself. Hire more junior executioners. But that just multiplies your chaos.\n\nThe real issue? You’re trying to scale a job, not a business.\n\nWhen you are the primary bottleneck—when every escalated issue, every sales call, and every strategic pivot requires your brain—scale breaks you. \n\nThe answer isn't working 80 hours instead of 60. The answer is building an operating system where the inputs (leads) convert to outputs (client success) without requiring you to act as the processing engine in the middle.\n\nStop optimizing your hustle. Optimize your independence."
    },
    { id: "i2", title: "The 3 systems every founder needs", stage: "MOF", status: "SCRIPT", libraryStatus: "DRAFT", framework: "Listicle" },
    {
      id: "i3",
      title: "Case Study: How we automated manual lead generation",
      stage: "BOF",
      status: "IDEA",
      libraryStatus: "DRAFT",
      framework: "Hero's Journey",
      marketSignalRef: "ms2"
    }
  ],
  marketSignals: [
    {
      id: "ms1",
      topic: "Competitor Strategy Shift",
      signalText: "Leading competitor just launched a highly generic AI automation course, alienating their enterprise segment.",
      source: "Market Intelligence (LinkedIn Scrape)"
    },
    {
      id: "ms2",
      topic: "Search Intent Surge",
      signalText: "Search volume mapping for 'founder burnout' increased by 15% WoW alongside 'automation consultant'.",
      source: "Trend Analytics"
    }
  ]
};

export const mockConversion: ConversionData = {
  pipelineValue: 245000,
  activities: [
    {
      id: "act1", type: "Call", timestamp: new Date(Date.now() - 3600000).toISOString(), description: "Completed Discovery Call.", owner: "John Founder", contactName: "David Kim", opportunityId: "o1"
    }
  ],
  conversations: [
    {
      id: "c1", leadId: "l1", contact: "David Kim", company: "NextGen AI", source: "LinkedIn Organic", campaign: "Q3 Founder Burnout", status: "OPPORTUNITY", owner: "John Founder", lastInteraction: "Form Submission", lastMessage: "Let's definitely schedule a scoping call.", nextAction: "Schedule call", followUpDate: new Date().toISOString(), opportunityId: "o1", createdDate: new Date(Date.now() - 86400000).toISOString(), updatedDate: new Date().toISOString()
    },
    {
      id: "c2", leadId: "l2", contact: "Sarah Jenkins", company: "Acme Corp", source: "Instagram Ads", campaign: "Retargeting", status: "DISCOVERY", owner: "John Founder", lastInteraction: "Email Confirmed", lastMessage: "Sounds good, looking forward to discussing.", nextAction: "Run Discovery Call", createdDate: new Date(Date.now() - 86400000 * 3).toISOString(), updatedDate: new Date().toISOString()
    },
    {
      id: "c3", leadId: "l3", contact: "Unknown", company: "Pending", source: "Website", campaign: "Organic", status: "REPLIED", owner: "Sales Team", lastInteraction: "Email Reply", lastMessage: "Not sure right now. Can we talk next month?", nextAction: "Follow up next month", createdDate: new Date(Date.now() - 86400000 * 5).toISOString(), updatedDate: new Date().toISOString()
    }
  ],
  followUps: [
    {
      id: "fu1",
      opportunityId: "o4", // Stale Proposal
      owner: "John Founder",
      reason: "Deal inactive for 6 days. Proposal outstanding.",
      dueDate: new Date(Date.now() - 86400000).toISOString(),
      priority: "high",
      recommendedAction: "Follow up regarding outstanding security review.",
      status: "OVERDUE"
    },
    {
      id: "fu2",
      opportunityId: "o2",
      owner: "John Founder",
      reason: "Call scheduled this afternoon.",
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      priority: "medium",
      recommendedAction: "Review market intelligence prior to connect.",
      status: "PENDING"
    }
  ],
  opportunities: [
    {
      id: "o1",
      leadName: "David Kim",
      company: "NextGen AI",
      title: "Series A Go-To-Market Reboot",
      value: 55000,
      stage: "QUALIFIED",
      qualification: {
        fit: "Excellent - B2B SaaS",
        problem: "Customer Acquisition Cost scaling poorly",
        urgency: "High - Next quarter targets at risk",
        authority: "Direct to CEO",
        budget: "Validated >$50k budget secured"
      },
      salesCall: {
        status: "TBD"
      },
      objections: [],
      lastActivity: "Form Submission",
      nextAction: "Schedule call",
      daysInactive: 1,
      priority: "high"
    },
    {
      id: "o2",
      leadName: "Sarah Jenkins",
      company: "Acme Corp",
      title: "Enterprise Revenue Architecture",
      value: 85000,
      stage: "CALL_SCHEDULED",
      qualification: {
        fit: "Good - Enterprise Expansion",
        problem: "Sales cycles too long",
        urgency: "Medium",
        authority: "VP Sales / Requires CRO approval",
        budget: "Tier 1 Pricing"
      },
      salesCall: {
        status: "SCHEDULED",
        date: new Date(Date.now() + 4800000).toISOString(),
        notes: "Discuss mapping out the new enterprise tier."
      },
      objections: [
        {
          id: "obj1",
          category: "Timing",
          objectionText: "Concerned about implementing alongside Q4 push.",
          severity: "medium",
          resolutionStatus: "unresolved",
          responseGuidance: "Position ASENZO as a friction-reduction mechanism for Q4 rather than a net-new operational burden."
        }
      ],
      lastActivity: "Email Confirmed",
      nextAction: "Run Discovery Call",
      daysInactive: 0,
      priority: "high",
      intelligenceSignal: "Competitor recently launched similar offering."
    },
    {
      id: "o3",
      leadName: "Mike Ross",
      company: "TechNova",
      title: "Automated Lead Routing Engine",
      value: 25000,
      stage: "CALL_COMPLETED",
      qualification: {
        fit: "High",
        problem: "Leads bleeding out due to slow response",
        urgency: "Immediate",
        authority: "Founder/Owner",
        budget: "Validated"
      },
      salesCall: {
        status: "COMPLETED",
        date: new Date(Date.now() - 86400000).toISOString(),
        outcome: "Excellent chemistry. Agreed on scope basics.",
        transcript: "MR: Yeah, we are losing about 40% of inbound just because we can't follow up in 5 minutes. ASENZO: Exactly, we map that explicitly..."
      },
      objections: [],
      lastActivity: "Discovery Call Completed",
      nextAction: "Draft Proposal",
      daysInactive: 2,
      priority: "routine"
    },
    {
      id: "o4",
      leadName: "Elena Rodriguez",
      company: "FinScale",
      title: "Founder Independence Operating System",
      value: 45000,
      stage: "PROPOSAL",
      qualification: {
        fit: "Perfect ICP match",
        problem: "Founder operating 80 hours a week.",
        urgency: "Critical - Burnout",
        authority: "Founder",
        budget: "Validated"
      },
      salesCall: {
        status: "COMPLETED"
      },
      objections: [
        {
          id: "obj2",
          category: "Trust",
          objectionText: "Not sure an automated system can sound like me.",
          severity: "high",
          resolutionStatus: "addressed",
          responseGuidance: "Reference the Founder Voice DNA constraints."
        }
      ],
      proposal: {
        status: "SENT",
        offerContext: "Full OS implementation utilizing Founder Voice.",
        scopeConstraints: "Limited to 2 primary funnels natively.",
        preparationState: "Finalized"
      },
      lastActivity: "Proposal Sent",
      nextAction: "Follow up via email",
      daysInactive: 6, // STALE OPPORTUNITY
      priority: "critical"
    },
    {
      id: "o5",
      leadName: "James Chen",
      company: "Logos Partners",
      title: "Q3 Optimization Pilot",
      value: 35000,
      stage: "CLOSED_WON",
      qualification: {
        fit: "High",
        problem: "Low conversion rates",
        urgency: "High",
        authority: "Managing Partner",
        budget: "Validated"
      },
      salesCall: {
        status: "COMPLETED"
      },
      objections: [],
      proposal: {
        status: "ACCEPTED",
        offerContext: "Standard 3-month pilot",
        scopeConstraints: "Standard limits",
        preparationState: "Finalized"
      },
      lastActivity: "Contract Signed",
      nextAction: "Hand off to Delivery",
      daysInactive: 0,
      priority: "routine"
    }
  ],
  applications: [
    { id: "app1", leadId: "l1", applicant: "David Kim", company: "NextGen AI", icpFit: "HIGH", problem: "CAC scaling poorly", budget: ">$50k", timeline: "Immediate", status: "UNDER_REVIEW", owner: "John Founder", recommendedRoute: "SALES_CALL" },
    { id: "app2", leadId: "l4", applicant: "Tom Hanks", company: "Castaway", icpFit: "LOW", problem: "Need more leads", budget: "$1k", timeline: "Eventually", status: "STARTED", owner: "John Founder" }
  ],
  bookings: [
    { id: "b1", leadId: "l1", callType: "Discovery Call", status: "BOOKED", bookedDate: new Date(Date.now() - 4800000).toISOString(), callDate: new Date(Date.now() + 86400000 * 2).toISOString(), owner: "John Founder", source: "LinkedIn Organic", campaign: "Q3 Founder Burnout" },
    { id: "b2", leadId: "l2", callType: "Scoping Session", status: "COMPLETED", bookedDate: new Date(Date.now() - 86400000 * 5).toISOString(), callDate: new Date(Date.now() - 86400000 * 2).toISOString(), owner: "John Founder", source: "Instagram Ads", campaign: "Retargeting", showStatus: "SHOWED", outcome: "Moved to Proposal" }
  ],
  nurtureRecords: [
    { id: "nr1", leadId: "l5", segment: "TIMING", status: "ACTIVE", lastInteraction: new Date(Date.now() - 86400000 * 14).toISOString(), reengagementDate: new Date(Date.now() + 86400000 * 14).toISOString(), owner: "Automated", sequenceName: "Q4 Strategy Drip" }
  ],
  assets: [
    { id: "ca1", name: "Founder Independence VSL", type: "VSL", icp: "Burned out founders", awarenessStage: "Problem Aware", conversions: 48, status: "ACTIVE" },
    { id: "ca2", name: "System ROI Calculator", type: "Calculator", icp: "B2B SaaS", awarenessStage: "Solution Aware", conversions: 12, status: "ACTIVE" }
  ]
};

export const mockDelivery: import("@/lib/types").DeliveryData = {
  clients: [
    {
      id: "c1",
      name: "Logos Partners",
      company: "Logos Partners LLC",
      industry: "Financial Services",
      icp: "Enterprise B2B",
      owner: "ASENZO Ops",
      health: {
        overall: "GREEN",
        signals: [
          {
            id: "sig1",
            clientId: "c1",
            dimension: "DELIVERY",
            status: "GREEN",
            reason: "Onboarding completed on time.",
            timestamp: new Date().toISOString()
          }
        ]
      }
    }
  ],
  contacts: [
    {
      id: "con1",
      clientId: "c1",
      name: "Jane Doe",
      email: "jane@logos.com",
      role: "CEO",
      isPrimary: true
    }
  ],
  contracts: [
    {
      id: "ct1",
      clientId: "c1",
      dealId: "d1", // Points back to Revenue Deal
      offer: "Q3 Optimization Pilot",
      value: 20000,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000 * 90).toISOString(),
      paymentStatus: "PAID",
      agreementStatus: "SIGNED"
    }
  ],
  onboardings: [
    {
      id: "ob1",
      clientId: "c1",
      status: "COMPLETED",
      intakeStatus: "APPROVED",
      assetCollectionStatus: "COMPLETED",
      accessStatus: "COMPLETED",
      kickoffStatus: "COMPLETED",
      health: "GREEN",
      startDate: new Date(Date.now() - 86400000 * 5).toISOString(),
      completionDate: new Date().toISOString(),
      owner: "ASENZO Ops"
    }
  ],
  engagements: [
    {
      id: "e1",
      clientId: "c1",
      name: "System Architecture Refactor",
      offer: "Q3 Optimization Pilot",
      owner: "Engineering",
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000 * 90).toISOString(),
      status: "ACTIVE",
      team: [
        { id: "tm1", engagementId: "e1", memberId: "u1", role: "Lead Architect" }
      ],
      health: "GREEN",
      progress: 15
    }
  ],
  milestones: [
    {
      id: "m1",
      engagementId: "e1",
      name: "Foundation Audit",
      description: "Review current deployment and isolate root issues.",
      owner: "Engineering",
      startDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
      status: "IN_PROGRESS",
      progress: 50,
      clientDependencies: []
    }
  ],
  deliverables: [
    {
      id: "dl1",
      name: "Audit Report v1",
      type: "Strategy Document",
      clientId: "c1",
      engagementId: "e1",
      milestoneId: "m1",
      owner: "Engineering",
      dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
      status: "IN_PROGRESS",
      versions: []
    }
  ],
  communications: [
    {
      id: "msg1",
      clientId: "c1",
      owner: "ASENZO Ops",
      date: new Date().toISOString(),
      type: "MEETING",
      status: "CLOSED",
      summary: "Successful kickoff meeting held."
    }
  ],
  outcomes: [],
  reports: [],
  renewals: [],
  proofs: []
};

// Removed duplicate/old mockRevenue

export const mockOperations: import("@/lib/types").OperationsData = {
  team: [
    {
      id: "usr1",
      name: "Alex Becker",
      role: "Operations Lead",
      department: "Operations",
      skills: ["Process Design", "QA", "Approvals"],
      capacity: 40,
      workload: 35,
      status: "ACTIVE",
      backupFor: ["usr2"]
    },
    {
      id: "usr2",
      name: "Sarah Chen",
      role: "Content Director",
      department: "Attention",
      skills: ["Copywriting", "Video Editing"],
      capacity: 40,
      workload: 45,
      status: "OVER_CAPACITY",
      backupFor: []
    }
  ],
  tasks: [
    {
      id: "tsk1",
      title: "Content Production Review",
      description: "Review latest finalized attention SOP.",
      ownerId: "usr1",
      sourceModule: "Operations",
      priority: "HIGH",
      status: "BACKLOG",
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      createdAt: new Date().toISOString()
    }
  ],
  sops: [
    {
      id: "sop1",
      name: "Client Onboarding Sequence",
      purpose: "Initialize client workspaces and trigger kickoffs",
      trigger: "Revenue: Deal Closed Won",
      ownerId: "usr1",
      processSteps: ["Create Client Record", "Send Intake Form", "Schedule Kickoff"],
      qualityStandard: "Kickoff must be scheduled within 48 hours of payment",
      expectedOutput: "Completed onboarding workflow",
      status: "ACTIVE",
      version: "1.2",
      lastReviewedDate: new Date(Date.now() - 30 * 86400000).toISOString(),
      nextReviewDate: new Date(Date.now() + 60 * 86400000).toISOString()
    }
  ],
  workflows: [
    {
      id: "wkf1",
      name: "Sales Handoff to Delivery",
      triggerEvent: "Contract Signed",
      steps: ["Generate Invoice", "Create Asenzo Client Record", "Assign Delivery Lead"],
      ownerId: "usr1"
    }
  ],
  approvals: [
    {
      id: "app1",
      request: "Strategic Offer Variation",
      sourceModule: "Revenue",
      requestedBy: "usr2",
      approverId: "usr1",
      priority: "URGENT",
      status: "PENDING",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      dueDate: new Date(Date.now() + 86400000).toISOString()
    }
  ],
  qc: [
    {
      id: "qc1",
      title: "Landing Page V2 Copy Review",
      sourceModule: "Attention",
      ownerId: "usr2",
      reviewerId: "usr1",
      status: "FAILED",
      severity: "HIGH",
      relatedRecordId: "dl1"
    }
  ],
  escalations: [
    {
      id: "esc1",
      issue: "Client Delay > 7 Days",
      sourceModule: "Delivery",
      severity: "URGENT",
      ownerId: "usr1",
      escalationOwnerId: "usr1",
      status: "OPEN",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      deadline: new Date(Date.now() + 86400000).toISOString(),
      reason: "Asset collection from Acme Corp is severely overdue.",
      recommendedAction: "Founder intervention required on primary contact."
    }
  ],
  schedule: [
    {
      id: "sch1",
      title: "Pipeline Cleanup Sync",
      frequency: "WEEKLY",
      ownerId: "usr1",
      agenda: "Review all stagnant revenue pipeline opportunities.",
      status: "PENDING"
    }
  ]
};

export const mockCalendar: import("@/lib/types").CalendarData = {
  events: [
    {
      id: "cal1",
      title: "Global Metrics Delivery Sync",
      description: "Routine pipeline architecture milestone review with client engineering.",
      status: "SCHEDULED",
      priority: "STANDARD",
      owner: "Delivery Lead",
      date: new Date(Date.now() + 86400000 * 2).toISOString(),
      startTime: "10:00 AM",
      endTime: "11:00 AM",
      sourceModule: "Delivery",
      linkedContext: "Milestone: Pipeline Architecture"
    },
    {
      id: "cal2",
      title: "Vortex Labs Discovery Call",
      description: "Initial discovery call for Q3 expansion.",
      status: "MISSED",
      priority: "HIGH",
      owner: "ASENZO Growth",
      date: new Date(Date.now() - 86400000 * 1).toISOString(),
      startTime: "02:00 PM",
      endTime: "03:00 PM",
      sourceModule: "Retention",
      linkedContext: "Account Health: Risk",
      intelligenceSignal: "Client did not attend. Rescheduling protocol enacted.",
      recommendedAction: "Manually reach out to executive sponsor to reschedule."
    },
    {
      id: "cal3",
      title: "Executive Revenue Review",
      description: "Quarterly review of current billing conflicts and collections.",
      status: "CONFLICT",
      priority: "URGENT",
      owner: "Finance Ops",
      date: new Date(Date.now() + 86400000 * 1).toISOString(),
      startTime: "09:00 AM",
      endTime: "10:30 AM",
      sourceModule: "Revenue",
      linkedContext: "Overdue Collections",
      intelligenceSignal: "Double-booked with Nexus Digital Pitch.",
      recommendedAction: "Resolve conflict by delegating one of the meetings."
    },
    {
      id: "cal4",
      title: "Acme Corp Qualification Sign-off",
      description: "Finalize qualification scoring and assign SDR.",
      status: "SCHEDULED",
      priority: "HIGH",
      owner: "ASENZO Sales",
      date: new Date(Date.now() + 86400000 * 1).toISOString(),
      startTime: "01:00 PM",
      endTime: "01:30 PM",
      sourceModule: "Conversion",
      linkedContext: "High Readiness Score"
    },
    {
      id: "cal5",
      title: "Monthly Operator Sync",
      description: "Internal sync to clear pending operator backlog.",
      status: "COMPLETED",
      priority: "STANDARD",
      owner: "Operations Staff",
      date: new Date(Date.now() - 86400000 * 4).toISOString(),
      startTime: "11:00 AM",
      endTime: "12:00 PM",
      sourceModule: "Operator",
      linkedContext: "Cleared 14 tasks."
    }
  ]
};

export const mockSettings: import("@/lib/types").SettingsData = {
  profile: {
    displayName: "Founder / Executive",
    role: "System Administrator",
    email: "founder@asenzo.dev"
  },
  notifications: {
    emailAlertsEnabled: true,
    inAppAlertsEnabled: true,
    digestFrequency: "DAILY",
    priorityThreshold: "IMPORTANT"
  },
  system: {
    defaultTimezone: "America/New_York",
    enableAutoDelegationRouting: false,
    intelligenceAggressiveness: "BALANCED"
  },
  intelligenceSignal: "We recommend enabling autodelegation to clear upcoming Operator queues."
};

export const mockRevenue: import("@/lib/types").RevenueData = {
  pipelineValue: 2450000,
  weightedPipeline: 1720000,
  expectedRevenue: 1720000,
  closedWon: 840000,
  closedLost: 310000,
  winRate: 32,
  deals: [
    {
      id: "d1",
      leadId: "l1",
      contact: "David Kim",
      company: "NextGen AI",
      owner: "John Founder",
      value: 45000,
      currency: "USD",
      expectedCloseDate: new Date(Date.now() + 86400000 * 14).toISOString(),
      stage: "PROPOSAL_SENT",
      nextAction: "Follow up on proposal",
      lastActivity: "Sent Proposal #381",
      source: "LinkedIn Organic",
      campaign: "Q3 Founder Burnout",
      icp: "Highest",
      offer: "Full OS Implementation",
      confidence: "HIGH",
      stageAge: 4,
      createdDate: new Date(Date.now() - 86400000 * 20).toISOString(),
      updatedDate: new Date().toISOString(),
      probability: 70
    },
    {
      id: "d2",
      leadId: "l2",
      contact: "Sarah Jenkins",
      company: "Acme Corp",
      owner: "John Founder",
      value: 12000,
      currency: "USD",
      expectedCloseDate: new Date(Date.now() + 86400000 * 7).toISOString(),
      stage: "QUALIFIED",
      nextAction: "Book Discovery/Pitch",
      lastActivity: "Qualified via form",
      source: "Instagram Ads",
      campaign: "Retargeting",
      icp: "Medium",
      offer: "Pilot Program",
      confidence: "MEDIUM",
      stageAge: 1,
      createdDate: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedDate: new Date().toISOString(),
      probability: 20
    }
  ],
  proposals: [
    {
      id: "p1",
      dealId: "d1",
      offer: "Full OS Implementation",
      scope: "Foundation + Acquisition + Conversion",
      price: 45000,
      status: "SENT",
      sentDate: new Date(Date.now() - 86400000 * 4).toISOString(),
    }
  ],
  followUps: [
    {
      id: "rf1",
      dealId: "d1",
      owner: "John Founder",
      dueDate: new Date(Date.now() - 86400000 * 1).toISOString(),
      priority: "HIGH",
      reason: "Follow up on sent proposal",
      status: "OVERDUE",
      nextAction: "Email David to schedule review"
    }
  ],
  objections: [
    {
      id: "ob1",
      objection: "Not sure an automated system can sound like me.",
      recommendedResponse: "Reference the Founder Voice DNA constraints.",
      frequency: 24,
      winLossImpact: "-12%",
      relatedOffer: "Full OS Implementation"
    },
    {
      id: "ob2",
      objection: "We tried an agency before and got burned.",
      recommendedResponse: "Explain the difference between an OS and an agency.",
      frequency: 41,
      winLossImpact: "-20%",
      relatedOffer: "All"
    }
  ],
  playbooks: [
    {
      id: "pb1",
      name: "The Founder Discovery Script",
      stage: "CALL_HELD",
      purpose: "Elicit current state constraints and time pain",
      status: "ACTIVE"
    },
    {
      id: "pb2",
      name: "OS Comparison Framework",
      stage: "PROPOSAL_SENT",
      purpose: "Reframe expectations against traditional agencies",
      status: "ACTIVE"
    }
  ],
  lostDeals: [
    {
      id: "ld1",
      dealId: "d19",
      value: 20000,
      stageLost: "NEGOTIATION",
      reason: "PRICE",
      objection: "Too expensive for Q3 budget",
      dateLost: new Date(Date.now() - 86400000 * 10).toISOString()
    }
  ]
};

export const mockIntelligence: import("@/lib/types").IntelligenceData = {
  pulse: {
    revenue: 1720000,
    pipeline: 3200000,
    qualifiedLeads: 42,
    newLeads: 128,
    conversionRate: 14.5,
    contentReach: 142000,
    qualifiedAttention: 8400,
    clientOutcomes: 12,
    retentionRisk: 2,
    operationalHealth: "Warning"
  },
  healthMatrix: [
    { area: "Foundation", metric: "Positioning clarity", status: "Healthy", trend: "Up" },
    { area: "Attention", metric: "Qualified attention", status: "Healthy", trend: "Up" },
    { area: "Acquisition", metric: "Lead generation", status: "Warning", trend: "Down" },
    { area: "Conversion", metric: "Qualification rate", status: "Critical", trend: "Down" },
    { area: "Revenue", metric: "Pipeline velocity", status: "Healthy", trend: "Up" },
    { area: "Delivery", metric: "Client outcomes", status: "Healthy", trend: "Stable" },
    { area: "Operations", metric: "Capacity", status: "Warning", trend: "Down" }
  ],
  constraints: [
    {
      id: "cnstr1",
      constraint: "Acquisition → Qualification",
      detectedDate: new Date(Date.now() - 86400000 * 14).toISOString(),
      severity: "CRITICAL",
      evidence: "Lead volume increased by 22% but qualified-lead rate fell 24%.",
      affectedCenter: "Conversion",
      recommendedAction: "Audit qualification gate and add mandatory revenue question.",
      status: "ACTIVE"
    }
  ],
  opportunities: [
    {
      id: "opp1",
      opportunity: "Double down on 'Founder Systems' content pillar",
      source: "Content-to-Revenue analysis",
      evidence: "This pillar generates 3.2× more qualified conversations than average.",
      expectedImpact: "+15% Qualified Pipeline",
      confidence: "HIGH",
      requiredAction: "Increase production allocation to this pillar by 20%.",
      relatedCenter: "Attention",
      status: "IDENTIFIED"
    }
  ],
  risks: [
    {
      id: "rsk1",
      risk: "Concentrated Active Pipeline",
      category: "Revenue",
      severity: "HIGH",
      probability: "MEDIUM",
      businessImpact: "Loss of top 2 deals materially affects Q3 cash flow.",
      evidence: "68% of current qualified pipeline is concentrated in two opportunities.",
      affectedCenter: "Revenue",
      mitigation: "Increase qualified opportunity generation at the top of funnel.",
      status: "OPEN"
    }
  ],
  attribution: [
    { id: "at1", source: "LinkedIn Content", leads: 82, qualified: 24, opportunities: 12, won: 4, revenue: 160000 },
    { id: "at2", source: "Founder Newsletter", leads: 42, qualified: 18, opportunities: 8, won: 3, revenue: 140000 },
    { id: "at3", source: "Referral", leads: 7, qualified: 6, opportunities: 5, won: 5, revenue: 220000 }
  ],
  channels: [
    { id: "ch1", channel: "LinkedIn", reach: 85000, engagementQuality: "High", leads: 110, qualifiedLeads: 32, opportunities: 14, closedDeals: 5, revenue: 200000, conversionRate: 12.7, revenuePerLead: 1818, revenuePerOpportunity: 14285 },
    { id: "ch2", channel: "X (Twitter)", reach: 45000, engagementQuality: "Medium", leads: 38, qualifiedLeads: 6, opportunities: 2, closedDeals: 0, revenue: 0, conversionRate: 0, revenuePerLead: 0, revenuePerOpportunity: 0 }
  ],
  contentRevenue: [
    {
      id: "cr1",
      contentPiece: "Why posting more doesn't grow your business",
      contentPillar: "Strategic Truths",
      awarenessStage: "Problem Aware",
      funnelRole: "Conversion",
      channel: "LinkedIn",
      cta: "Book Discovery",
      reach: 42000,
      leads: 35,
      qualifiedLeads: 18,
      opportunities: 5,
      deals: 2,
      revenueInfluenced: 90000
    }
  ],
  founderDependency: {
    score: 68,
    majorSources: ["Content final approval", "Sales calls > $20k", "Client onboarding kickoff"],
    trend: "DECREASING",
    summary: "68% of critical revenue workflows currently require founder intervention, down from 82% last quarter.",
    recommendedAction: "Establish sales SOPs and delegate onboarding to Delivery team."
  },
  recommendations: [
    {
      id: "rec1",
      recommendation: "Increase Problem-Aware content production by 20%",
      reason: "High conversion efficiency",
      evidence: "Problem-aware content represents 34% of published volume but generates 61% of qualified conversations.",
      expectedImpact: "Higher qualification rate across all leads.",
      confidence: "HIGH",
      priority: "HIGH",
      affectedCenter: "Attention",
      requiredAction: "Adjust content calendar allocation.",
      status: "PENDING"
    }
  ],
  reviews: [
    {
      id: "rev1",
      reviewPeriod: "MONTHLY",
      participants: ["Founder", "Ops Lead"],
      metrics: ["Revenue", "Pipeline", "Qualified Leads"],
      findings: "Lead volume is up but quality is down, stressing sales capacity.",
      decisions: "We will introduce an explicit budget question to the initial assessment.",
      recommendations: ["rec1"],
      actions: ["Update Typeform", "Brief SDRs"],
      completedStatus: true,
      date: new Date(Date.now() - 86400000 * 3).toISOString()
    }
  ]
};

export const mockOperatingItems: import("@/lib/types").OperatingItem[] = [
  {
    id: "oi_cnstr1",
    workspaceId: "ws_1",
    type: "CONSTRAINT",
    title: "Qualification Checkpoint",
    description: "Lead volume increased by 22% but qualified-lead rate fell 24%.",
    sourceCenter: "Acquisition",
    sourceEntityType: "ConstraintRecord",
    sourceEntityId: "cnstr1",
    severity: "CRITICAL",
    priority: "HIGH",
    impact: "Low qualification rate blocking Revenue pipeline",
    confidence: "HIGH",
    detectedAt: mockIntelligence.constraints[0].detectedDate,
    status: "DETECTED",
    recommendedActions: ["Audit qualification gate and add mandatory revenue question."],
    linkedTasks: [],
    createdAt: mockIntelligence.constraints[0].detectedDate,
    updatedAt: mockIntelligence.constraints[0].detectedDate
  },
  {
    id: "oi_opp1",
    workspaceId: "ws_1",
    type: "OPPORTUNITY",
    title: "Double down on 'Founder Systems' content pillar",
    description: "This pillar generates 3.2× more qualified conversations than average.",
    sourceCenter: "Intelligence",
    sourceEntityType: "GrowthOpportunity",
    sourceEntityId: "opp1",
    severity: "MEDIUM",
    priority: "HIGH",
    impact: "+15% Qualified Pipeline",
    confidence: "HIGH",
    detectedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: "PLANNED",
    recommendedActions: ["Increase production allocation to this pillar by 20%."],
    linkedTasks: [],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "oi_rsk1",
    workspaceId: "ws_1",
    type: "RISK",
    title: "Concentrated Active Pipeline",
    description: "68% of current qualified pipeline is concentrated in two opportunities.",
    sourceCenter: "Revenue",
    sourceEntityType: "RiskRecord",
    sourceEntityId: "rsk1",
    severity: "HIGH",
    priority: "HIGH",
    impact: "Loss of top 2 deals materially affects Q3 cash flow.",
    confidence: "HIGH",
    detectedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: "MONITORING",
    recommendedActions: ["Increase qualified opportunity generation at the top of funnel."],
    linkedTasks: [],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "oi_rec1",
    workspaceId: "ws_1",
    type: "RECOMMENDATION",
    title: "Increase Problem-Aware content production by 20%",
    description: "Problem-aware content represents 34% of published volume but generates 61% of qualified conversations.",
    sourceCenter: "Intelligence",
    sourceEntityType: "IntelligenceRecommendation",
    sourceEntityId: "rec1",
    severity: "LOW",
    priority: "HIGH",
    impact: "Higher qualification rate across all leads.",
    confidence: "HIGH",
    detectedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    status: "DETECTED",
    recommendedActions: ["Adjust content calendar allocation."],
    linkedTasks: [],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// ==========================================
// PHASE 3: RESEARCH INTELLIGENCE MOCK DATA
// ==========================================

export const mockCreators: Creator[] = [
  {
    id: "creator_1",
    name: "Justin Welsh",
    tags: ["Founder Creators", "Solopreneur"],
    audienceSize: "500K+",
    trend: "up",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "creator_2",
    name: "Katelyn Bourgoin",
    tags: ["Marketing Leaders"],
    audienceSize: "150K+",
    trend: "up",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const mockCreatorChannels: CreatorChannel[] = [
  {
    id: "channel_1",
    creatorId: "creator_1",
    platform: "LinkedIn",
    channelUrl: "https://linkedin.com/in/justinwelsh",
    baselinePerformance: "100,000",
    topFormat: "Carousel",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "channel_2",
    creatorId: "creator_2",
    platform: "LinkedIn",
    channelUrl: "https://linkedin.com/in/katebour",
    baselinePerformance: "50,000",
    topFormat: "Text + Image",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const mockContentReferences: ContentReference[] = [
  {
    id: "ref_1",
    channelId: "channel_1",
    topic: "Solopreneurship",
    contentFormat: "Carousel",
    rawContent: "I run a $5M/year business with zero employees. Here's my exact weekly schedule.",
    metrics: { views: "520,000", engagement: "11%" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ref_2",
    channelId: "channel_2",
    topic: "Buyer Psychology",
    contentFormat: "Text + Image",
    rawContent: "Most marketers are obsessed with CAC. But they ignore the silent killer: Customer Confusion.\n\nIf your prospect doesn't immediately understand what you do in 5 seconds, they bounce.",
    metrics: { views: "425,000", engagement: "8%" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const mockOutlierAnalyses: OutlierAnalysis[] = [
  {
    id: "out_1",
    contentReferenceId: "ref_1",
    multiplier: 5.2,
    analysisStatus: "UNANALYZED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "out_2",
    contentReferenceId: "ref_2",
    multiplier: 8.5,
    analysisStatus: "ANALYZED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const mockResearchSignals: ResearchSignal[] = [
  {
    id: "sig_1",
    outlierAnalysisId: "out_2",
    title: "High Intent Cognitive Bias Hook",
    signalType: "OUTLIER_POST",
    description: "Katelyn's post utilizing the 'silent killer' framing performed 8.5x above her baseline.",
    source: "LinkedIn Scrape",
    status: "CONVERTED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "sig_2",
    title: "Result-Oriented Hooks Resurgence",
    signalType: "FORMAT_TREND",
    description: "Result-oriented hooks are converting 3x better than contrarian hooks in your niche this week.",
    source: "Trend Analytics",
    status: "SAVED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const mockContentPatterns: ContentPattern[] = [
  {
    id: "pat_1",
    researchSignalId: "sig_1",
    name: "Pattern Interrupt / Contrarian",
    description: "Attacks a commonly accepted metric to create tension, introducing a hidden problem.",
    whatHappened: "Post went highly viral (8.5x multiplier) by shifting the focus from an accepted difficulty (CAC) to an unseen threat.",
    whyWorked: "Validates a hidden problem marketers suspect they have.",
    evidence: "Found in multiple top-performing posts this quarter.",
    occurrences: "14 times across 3 competitors",
    relevance: "High. Directly addresses our ICP's pain points.",
    confidence: "HIGH",
    hookType: "Pattern interrupt",
    funnelStage: "TOF",
    awarenessStage: "Problem-Aware",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// ==========================================
// PHASE 4: IDEA & HOOK INTELLIGENCE MOCK DATA
// ==========================================

export const mockContentIdeas: ContentIdea[] = [
  {
    id: "idea_1",
    title: "Why CAC is a vanity metric - The real cost of Customer Confusion",
    coreInsight: "Founders focus on CAC but ignore bounce rate due to bad messaging. If your prospect does not understand your offer in 5s, they leave.",
    targetIcp: "B2B SaaS Founders",
    awarenessStage: "Problem-aware",
    funnelRole: "TOF",
    contentPillar: "Strategic Frameworks",
    messagePillar: "Product-Market Fit",
    relatedPatternId: "pat_1",
    relatedResearchSignalIds: ["sig_1"],
    whyWorthCreating: "Direct match with 8.5x outlier on LinkedIn. High relevance to current ICP pain points.",
    evidence: "Based on 3 recent outlier posts from top competitors.",
    priority: "HIGH",
    status: "SELECTED",
    potentialFormats: ["Text + Image", "Carousel"],
    suggestedCta: "Lead Magnet: Messaging Cheatsheet",
    suggestedNextAction: "Scripting",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const mockContentAngles: ContentAngle[] = [
  {
    id: "angle_1",
    parentIdeaId: "idea_1",
    angleTitle: "The Contrarian Cost Focus",
    angleType: "Contrarian",
    coreArgument: "Obsessing over CAC will blind you to the real cash burn which is confused messaging.",
    targetAwarenessStage: "Problem-aware",
    emotionalTrigger: "Fear of wasted spend",
    differentiation: "Shifting the blame from advertising algorithms to their own landing page.",
    supportingResearch: "Marketing teams waste 60% of budget on confused clicks.",
    recommendedFormats: ["Text + Image"],
    priorityScore: 92,
    status: "SELECTED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "angle_2",
    parentIdeaId: "idea_1",
    angleTitle: "Personal Founder Mistake",
    angleType: "Founder Story",
    coreArgument: "I wasted $5k on ads because my landing page didn't explain what we did in 5 seconds.",
    targetAwarenessStage: "Unaware",
    emotionalTrigger: "Relatability",
    differentiation: "Creates empathy rather than challenging them.",
    supportingResearch: "Personal stories have 3x engagement on LinkedIn.",
    recommendedFormats: ["Carousel"],
    priorityScore: 84,
    status: "DRAFT",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const mockHooks: Hook[] = [
  {
    id: "hook_1",
    parentAngleId: "angle_1",
    parentIdeaId: "idea_1",
    hookText: "Most SaaS founders are obsessed with CAC. But they ignore the silent killer draining their runway: Customer Confusion.",
    hookType: "Contrarian",
    hookFormula: "Call out ICP + Attack common metric + Reveal unseen threat",
    awarenessStage: "Problem-aware",
    patternSource: "Pattern Interrupt / Contrarian (pat_1)",
    whyShouldWork: "Uses an accepted negative (CAC) to introduce a new, controllable negative (Confusion).",
    evidenceReference: "Multiplier: 8.5x on Kate B's post.",
    score: {
      total: 92,
      clarity: 18,
      specificity: 18,
      curiosity: 20,
      relevanceToIcp: 20,
      patternEvidence: 8,
      differentiation: 8
    },
    status: "SELECTED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "hook_2",
    parentAngleId: "angle_1",
    parentIdeaId: "idea_1",
    hookText: "If your prospect doesn't understand your software in 5 seconds, they bounce. Here's why your CAC is lying to you.",
    hookType: "Warning",
    hookFormula: "Condition + Negative Consequence + Re-contextualize safe metric",
    awarenessStage: "Problem-aware",
    patternSource: "Derived from Problem Amplification",
    whyShouldWork: "Creates immediate time pressure (5 seconds) affecting a core metric.",
    evidenceReference: "Standard copywriting best practice.",
    score: {
      total: 78,
      clarity: 20,
      specificity: 14,
      curiosity: 15,
      relevanceToIcp: 15,
      patternEvidence: 4,
      differentiation: 10
    },
    status: "SAVED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// ==========================================
// PHASE 5: SCRIPT ENGINE INTELLIGENCE
// ==========================================

export const mockScriptFrameworks: import('../types').ScriptFramework[] = [
  {
    id: "framework_1",
    name: "The Contrarian Value Shift",
    description: "Challenges a common belief, validates the viewer's frustration, and introduces a new mechanism.",
    isSystem: true,
    structure: [
      { name: "Hook", required: true, description: "State the widely accepted belief and immediately call it false." },
      { name: "Context / Validation", required: true, description: "Explain why they've been taught this and why it's burning them out." },
      { name: "The Shift", required: true, description: "Introduce the actual constraint they should be focusing on." },
      { name: "Value Depiction", required: true, description: "Show exactly how solving this new constraint changes their outcome." },
      { name: "CTA", required: false, description: "Direct them to a resource that solves the new constraint." }
    ]
  },
  {
    id: "framework_2",
    name: "Founder Journey Breakdown",
    description: "A narrative-driven structure focusing on a specific painful mistake and the pivot.",
    isSystem: true,
    structure: [
      { name: "The Mistake", required: true, description: "Open with a highly specific, costly mistake you made." },
      { name: "The Impact", required: true, description: "Quantify the pain (time, money, stress)." },
      { name: "The Pivot", required: true, description: "The exact moment or realization that caused a change in strategy." },
      { name: "The Framework", required: true, description: "Break down the new strategy into 2-3 actionable steps." },
      { name: "Takeaway", required: true, description: "One sentence summarizing the moral of the story." }
    ]
  }
];

export const mockScriptPlans: import('../types').ScriptPlan[] = [
  {
    id: "plan_1",
    linkedHookId: "hook_1",
    linkedIdeaId: "idea_1",
    frameworkId: "framework_1",
    strategicContext: {
      icp: "B2B SaaS Founders ($10k-$50k MRR)",
      awarenessStage: "Problem-aware (they know they aren't growing)",
      founderVoice: "Direct, no-fluff, slightly challenging but empathetic to the grind.",
      coreObjections: ["I just need more traffic", "My product is too complex to simplify"],
      coreOffer: "Growth OS Strategy Session"
    },
    outline: [
      { sectionId: "Hook", purpose: "Interrupt CAC obsession", points: ["Obsessing over CAC", "Customer Confusion is the real killer"] },
      { sectionId: "Context / Validation", purpose: "Validate their ad spend pain", points: ["You've optimized targeting", "But bounce rate is 80%"] },
      { sectionId: "The Shift", purpose: "Pivot to messaging", points: ["Ads don't fix bad copy", "If they don't get it in 5s, they leave"] },
      { sectionId: "Value Depiction", purpose: "Show what good looks like", points: ["Clear one-liner", "Instant disqualification of bad leads"] },
      { sectionId: "CTA", purpose: "Drive strategy call", points: ["Book a session to fix messaging"] }
    ],
    status: "DRAFTING",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockScriptVersions: import('../types').ScriptVersion[] = [
  {
    id: "version_1",
    scriptPlanId: "plan_1",
    versionNumber: 1,
    content: "[Hook]\nMost SaaS founders are obsessed with CAC. But they ignore the silent killer draining their runway: Customer Confusion.\n\n[Context]\nYou spend thousands optimizing LinkedIn ads. You dial in your targeting. You get the click. But your bounce rate is 80%. Why? Because your landing page is a wall of jargon.\n\n[The Shift]\nAds don't fix bad copy. If a prospect doesn't understand exactly what you do and who you do it for in 5 seconds, they leave. Your CAC isn't high because ads are expensive. It's high because you are paying to confuse people.\n\n[Value Depiction]\nYou don't need a new ad agency. You need a clear one-liner. You need messaging that instantly qualifies your ideal buyer and repels the rest.\n\n[CTA]\nStop burning cash on confused clicks. If you want a teardown of your current messaging, DM me 'CLARITY' and let's fix it.",
    status: "DRAFT",
    editorRole: "AI",
    aiScore: {
      hookStrength: 92,
      valueDepictability: 85,
      clarity: 95,
      total: 90
    },
    createdAt: new Date().toISOString()
  }
];

// ==========================================
// PHASE 7: PERFORMANCE & LEARNING
// ==========================================

export const mockContentPerformances: import('../types').ContentPerformance[] = [
  {
    id: "perf_1",
    contentItemId: "content_2", // Matches the mock ContentItem
    primaryChannel: "LinkedIn",
    publishedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    views: 12500,
    impressions: 18000,
    engagements: 450,
    clicks: 120,
    optIns: 15,
    meetingsBooked: 2,
    pipelineGenerated: 20000,
    engagementRate: 3.6,
    clickThroughRate: 0.96,
    conversionRate: 12.5, // (15 / 120) * 100
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockContentLearnings: import('../types').ContentLearning[] = [
  {
    id: "learning_1",
    contentPerformanceId: "perf_1",
    contentItemId: "content_2",
    linkedIdeaId: "idea_1",
    linkedAngleId: "angle_1",
    linkedHookId: "hook_1",
    whatWorked: [
      "Starting with a contrarian statement stopped the scroll.",
      "Metrics-driven carousel slides kept retention high."
    ],
    whatFailed: [
      "The CTA was slightly generic, leading to lower than expected meetings despite high opt-ins."
    ],
    aiRecommendation: "Next time, specify the exact outcome of the strategy session in the CTA rather than just 'DM me'. Retain the contrarian hook structure.",
    founderAction: "ITERATE_HOOK",
    createdAt: new Date().toISOString()
  }
];

// ==========================================
// PHASE 6: CONTENT ITEMS MOCK
// ==========================================

export const mockContentItems: import('../types').ContentItem[] = [
  {
    id: "content_1",
    title: "Consistency isn't your problem. Clarity is.",
    status: "SCRIPT",
    libraryStatus: "DRAFT",
    contentFormat: "Contrarian Reel",
    primaryChannel: "Instagram",
    contentPillar: "Founder Clarity",
    funnelStage: "MOF",
    script: "[Hook]\nStop posting 3 times a day...\n\n[Context]\nYou are shouting into the void...",
    objective: "Build Trust",
    primaryCta: "DM for framework",
    evidenceNotes: "Vertical video, high energy, fast cuts.",
    strategicGap: "Don't forget the B-roll overlay at 0:05.",
    businessOutcome: "N/A"
  },
  {
    id: "content_2",
    title: "Why scaling before $20k/mo breaks agencies",
    status: "PRODUCTION",
    libraryStatus: "ACTIVE",
    contentFormat: "Story Carousel",
    primaryChannel: "LinkedIn",
    contentPillar: "Mistakes",
    funnelStage: "TOF",
    script: "Slide 1: Breaking your agency...\nSlide 2: The trap...",
    objective: "Reach",
    primaryCta: "Save this post",
    evidenceNotes: "Text-based carousel.",
    strategicGap: "Use brand colors only.",
    businessOutcome: "N/A"
  },
  {
    id: "content_3",
    title: "How we close $10k+ deals without sales calls",
    status: "SCHEDULED",
    libraryStatus: "ACTIVE",
    contentFormat: "Newsletter",
    primaryChannel: "Email",
    contentPillar: "Frameworks & Systems",
    funnelStage: "BOF",
    script: "The system is simple but the execution is hard...",
    objective: "Conversion",
    primaryCta: "Apply to Waitlist",
    evidenceNotes: "Long form text.",
    strategicGap: "Include screenshot of Stripe dashboard.",
    businessOutcome: "N/A"
  }
];
