import { 
  CommandCenterData, 
  FoundationData, 
  AttentionData, 
  ConversionData, 
  DeliveryData 
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
      status: "requires_review", 
      framework: "Contrarian Truth",
      angle: "Target the single-point-of-failure fallacy common in agency owners.",
      outputGoal: "Drive awareness of operational fragility and introduce the concept of 'Founder Independence' as the real metric of scale.",
      contentDraft: "Most service founders hit a brutal ceiling at $50k/month.\n\nAnd they try to solve it incorrectly.\n\nThe instinct is to push harder. Clone yourself. Hire more junior executioners. But that just multiplies your chaos.\n\nThe real issue? You’re trying to scale a job, not a business.\n\nWhen you are the primary bottleneck—when every escalated issue, every sales call, and every strategic pivot requires your brain—scale breaks you. \n\nThe answer isn't working 80 hours instead of 60. The answer is building an operating system where the inputs (leads) convert to outputs (client success) without requiring you to act as the processing engine in the middle.\n\nStop optimizing your hustle. Optimize your independence."
    },
    { id: "i2", title: "The 3 systems every founder needs", stage: "MOF", status: "drafting", framework: "Listicle" },
    { 
      id: "i3", 
      title: "Case Study: How we automated manual lead generation", 
      stage: "BOF", 
      status: "idea", 
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
  followUps: [
    {
      id: "fu1",
      opportunityId: "o4", // Stale Proposal
      reason: "Deal inactive for 6 days. Proposal outstanding.",
      dueDate: new Date(Date.now() - 86400000).toISOString(),
      priority: "high",
      recommendedAction: "Follow up regarding outstanding security review.",
      status: "OVERDUE"
    },
    {
      id: "fu2",
      opportunityId: "o2",
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
  ]
};

export const mockDelivery: DeliveryData = {
  engagements: [
    {
      id: "e1",
      clientName: "Logos Partners", // Handoff from Conversion
      engagementType: "Q3 Optimization Pilot",
      status: "NOT_STARTED",
      startDate: new Date().toISOString(),
      targetCompletion: new Date(Date.now() + 86400000 * 90).toISOString(),
      owner: "ASENZO Ops",
      milestones: [
        {
          id: "m1",
          engagementId: "e1",
          title: "Onboarding Questionnaire",
          description: "Collect client branding guidelines and founder tone constraints.",
          dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
          status: "pending",
          owner: "Client"
        }
      ],
      blockers: [],
      intelligenceSignal: "Conversion handoff complete. Awaiting kickoff."
    },
    {
      id: "e2",
      clientName: "TechNova",
      engagementType: "Automated Lead Routing Engine",
      status: "BLOCKED",
      startDate: new Date(Date.now() - 86400000 * 14).toISOString(),
      targetCompletion: new Date(Date.now() + 86400000 * 30).toISOString(),
      owner: "System Engineering",
      milestones: [
        {
          id: "m2",
          engagementId: "e2",
          title: "Infrastructure Setup",
          description: "Initialize webhook endpoints and routing tables.",
          dueDate: new Date(Date.now() - 86400000 * 2).toISOString(),
          status: "in_progress",
          owner: "ASENZO Ops"
        }
      ],
      blockers: [
        {
          id: "b1",
          engagementId: "e2",
          type: "client_dependency",
          description: "Awaiting domain DNS verification from client IT.",
          severity: "high",
          status: "active",
          affectedMilestoneId: "m2",
          recommendedAction: "Escalate to client technical point of contact (Mike Ross)."
        }
      ]
    },
    {
      id: "e3",
      clientName: "Acme Corp",
      engagementType: "Phase 1 Strategy Launch",
      status: "ON_TRACK",
      startDate: new Date(Date.now() - 86400000 * 30).toISOString(),
      targetCompletion: new Date(Date.now() + 86400000 * 10).toISOString(),
      owner: "Growth Strategy",
      milestones: [
        {
          id: "m3",
          engagementId: "e3",
          title: "Asset Production",
          description: "Generate 12 founder-voice organic units.",
          dueDate: new Date(Date.now() - 86400000 * 1).toISOString(),
          status: "completed",
          owner: "ASENZO Content"
        },
        {
          id: "m4",
          engagementId: "e3",
          title: "Final Review",
          description: "Client approval of generated assets.",
          dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
          status: "pending",
          owner: "Client"
        }
      ],
      blockers: []
    }
  ]
};

export const mockRetention: import("@/lib/types").RetentionData = {
  engagements: [
    {
      id: "r1",
      clientName: "Global Metrics",
      status: "HEALTHY",
      owner: "ASENZO Ops",
      startDate: new Date(Date.now() - 86400000 * 180).toISOString(),
      lastInteractionDate: new Date(Date.now() - 86400000 * 3).toISOString(),
      relationshipSummary: "Client is extremely happy with the initial launch and content scaling.",
      health: "HEALTHY",
      intelligenceSignal: "Client sentiment trending positive.",
      goals: [
        {
          id: "g1",
          title: "Scale Twitter Growth",
          description: "Hit 5k targeted audience members.",
          currentState: "3,200/5,000",
          owner: "ASENZO Ops",
          targetDate: new Date(Date.now() + 86400000 * 45).toISOString(),
          status: "IN_PROGRESS"
        }
      ],
      interactions: [
        {
          id: "i1",
          date: new Date(Date.now() - 86400000 * 3).toISOString(),
          type: "CHECK_IN",
          summary: "Reviewed month 5 report.",
          owner: "ASENZO Ops"
        }
      ],
      risks: [],
      nextAction: {
        id: "na1",
        title: "Submit upcoming quarter roadmap",
        description: "Generate and send roadmap proposal for renewal.",
        dueDate: new Date(Date.now() + 86400000 * 10).toISOString(),
        owner: "Growth Strategy",
        status: "PENDING"
      }
    },
    {
      id: "r2",
      clientName: "Vortex Labs",
      status: "NEEDS_ATTENTION",
      owner: "ASENZO Ops",
      startDate: new Date(Date.now() - 86400000 * 60).toISOString(),
      lastInteractionDate: new Date(Date.now() - 86400000 * 25).toISOString(),
      relationshipSummary: "Initial honeymoon phase wearing off. Missing syncs recently.",
      health: "WATCH",
      intelligenceSignal: "Interaction gap detected. Client hasn't been spoken to in 25 days.",
      goals: [
        {
          id: "g2",
          title: "Setup outbound systems",
          description: "Finalize outbound playbook and CRM.",
          currentState: "Drafting playbooks",
          owner: "Client",
          targetDate: new Date(Date.now() - 86400000 * 2).toISOString(),
          status: "AT_RISK"
        }
      ],
      interactions: [
        {
          id: "i2",
          date: new Date(Date.now() - 86400000 * 25).toISOString(),
          type: "DELIVERY_UPDATE",
          summary: "Sent asset bundles.",
          owner: "ASENZO Content"
        }
      ],
      risks: [
        {
          id: "rk1",
          title: "Client Ghosting",
          description: "Missing recent syncs.",
          severity: "MEDIUM",
          status: "OPEN"
        }
      ],
      nextAction: {
        id: "na2",
        title: "Executive Check-in",
        description: "Call to realign on goal momentum.",
        dueDate: new Date(Date.now() - 86400000 * 1).toISOString(),
        owner: "Founder",
        status: "PENDING"
      }
    },
    {
      id: "r3",
      clientName: "Nexus Digital", // Delivery completion handoff example
      status: "AT_RISK",
      owner: "ASENZO Ops",
      startDate: new Date(Date.now() - 86400000 * 240).toISOString(),
      lastInteractionDate: new Date(Date.now() - 86400000 * 14).toISOString(),
      relationshipSummary: "Delivery completed but structural churn risk due to client's internal restructuring.",
      health: "AT_RISK",
      intelligenceSignal: "High severity open risk. Intervention recommended.",
      goals: [],
      interactions: [],
      risks: [
        {
          id: "rk2",
          title: "Internal Client Champion left",
          description: "Our main POC left the company, putting renewal at serious risk.",
          severity: "HIGH",
          status: "OPEN",
          recommendedAction: "Establish contact with new interim VP of Marketing immediately."
        }
      ],
      nextAction: {
        id: "na3",
        title: "Cold outreach to new leadership",
        description: "Re-pitch value proposition.",
        dueDate: new Date(Date.now() - 86400000 * 5).toISOString(),
        owner: "Founder",
        status: "PENDING"
      }
    },
    {
      id: "r4",
      clientName: "Stellar Operations",
      status: "COMPLETED",
      owner: "ASENZO Ops",
      startDate: new Date(Date.now() - 86400000 * 100).toISOString(),
      lastInteractionDate: new Date(Date.now() - 86400000 * 5).toISOString(),
      relationshipSummary: "Consulting framework fully deployed. Engagement concluded successfully.",
      health: "HEALTHY",
      goals: [
        {
          id: "g3",
          title: "Framework Mapping",
          description: "Complete.",
          currentState: "Done",
          owner: "ASENZO Ops",
          targetDate: new Date(Date.now() - 86400000 * 10).toISOString(),
          status: "ACHIEVED"
        }
      ],
      interactions: [],
      risks: [],
      nextAction: undefined
    }
  ]
};

export const mockRevenue: import("@/lib/types").RevenueData = {
  engagements: [
    {
      id: "rev1",
      customerName: "Global Metrics",
      owner: "ASENZO Finance",
      linkedContext: "Customer originated from Closed-Won engagement.",
      status: "ON_TRACK",
      amount: 45000,
      currency: "USD",
      dueDate: new Date(Date.now() + 86400000 * 15).toISOString(),
      description: "Q3 Optimization Pilot Renewal",
      paymentState: "INVOICED",
      items: [
        {
          id: "req_img_1",
          title: "Setup Fee",
          amount: 15000,
          dueDate: new Date(Date.now() - 86400000 * 5).toISOString(),
          status: "COLLECTED",
          owner: "ASENZO Finance",
          description: "Initial onboarding and strategy session."
        },
        {
          id: "req_img_2",
          title: "Month 1 Retainer",
          amount: 30000,
          dueDate: new Date(Date.now() + 86400000 * 15).toISOString(),
          status: "PENDING",
          owner: "ASENZO Finance",
          description: "Standard monthly retainer for growth execution."
        }
      ],
      risks: [],
      nextAction: {
        id: "rna1",
        title: "Send partial invoice",
        description: "Invoice based on hitting interim traffic milestone.",
        owner: "Finance Ops",
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
        status: "PENDING"
      }
    },
    {
      id: "rev2",
      customerName: "Vortex Labs",
      owner: "ASENZO Finance",
      linkedContext: "Active Phase 1 Delivery",
      status: "OVERDUE",
      amount: 60000,
      currency: "USD",
      dueDate: new Date(Date.now() - 86400000 * 12).toISOString(),
      description: "Enterprise Pipeline Development",
      intelligenceSignal: "Revenue is overdue relative to the expected collection date.",
      paymentState: "INVOICED",
      items: [
        {
          id: "req_vtx_1",
          title: "Phase 1 Complete",
          amount: 60000,
          dueDate: new Date(Date.now() - 86400000 * 12).toISOString(),
          status: "OVERDUE",
          owner: "ASENZO Finance",
          description: "Final payment for successful Phase 1 delivery."
        }
      ],
      risks: [
        {
          id: "rrk1",
          title: "Accounts Payable Delay",
          description: "Client AP department requires new vendor form.",
          status: "OPEN"
        }
      ],
      nextAction: {
        id: "rna2",
        title: "Submit vendor packet",
        description: "Fill out and submit vendor onboarding forms to Vortex Labs AP.",
        owner: "ASENZO Ops",
        dueDate: new Date(Date.now() - 86400000 * 1).toISOString(),
        status: "PENDING"
      }
    },
    {
      id: "rev3",
      customerName: "Nexus Digital",
      owner: "ASENZO Finance",
      linkedContext: "Contract restructuring in progress",
      status: "AT_RISK",
      amount: 120000,
      currency: "USD",
      dueDate: new Date(Date.now() + 86400000 * 30).toISOString(),
      description: "Annual License + Support",
      intelligenceSignal: "Resolve the outstanding approval dependency before collection.",
      paymentState: "UNINVOICED",
      items: [
        {
          id: "req_nex_1",
          title: "Annual Billing Header",
          amount: 120000,
          dueDate: new Date(Date.now() + 86400000 * 30).toISOString(),
          status: "AT_RISK",
          owner: "ASENZO Finance",
          description: "Annual upfront payment. Pending final signature on renewed terms."
        }
      ],
      risks: [
        {
          id: "rrk2",
          title: "Contract Dispute",
          description: "Client is questioning the SLA tiers before renewing.",
          status: "OPEN"
        }
      ],
      nextAction: {
        id: "rna3",
        title: "Executive Call",
        description: "Align with Nexus CEO on SLA specifics to unlock invoicing.",
        owner: "Founder",
        dueDate: new Date(Date.now() + 86400000 * 1).toISOString(),
        status: "PENDING"
      }
    },
    {
      id: "rev4",
      customerName: "Acme Corp",
      owner: "ASENZO Finance",
      linkedContext: "Initial Conversion Closed",
      status: "COLLECTED",
      amount: 25000,
      currency: "USD",
      dueDate: new Date(Date.now() - 86400000 * 30).toISOString(),
      description: "Brand Discovery Sprint",
      paymentState: "PAID",
      items: [
        {
          id: "req_acm_1",
          title: "Sprint Payment",
          amount: 25000,
          dueDate: new Date(Date.now() - 86400000 * 30).toISOString(),
          status: "COLLECTED",
          owner: "ASENZO Finance",
          description: "Paid via wire transfer."
        }
      ],
      risks: [],
      nextAction: undefined
    }
  ]
};

export const mockOperator: import("@/lib/types").OperatorData = {
  items: [
    {
      id: "op1",
      title: "Follow-up required after qualification",
      description: "Acme Corp qualification completed with high readiness score. Requires immediate pipeline assignment.",
      priority: "URGENT",
      status: "OPEN",
      owner: "ASENZO Growth",
      sourceModule: "Conversion",
      sourceEntityId: "opp1",
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      recommendedAction: "Review qualification matrix and assign SDR.",
      intelligenceSignal: "Account matches ideal ICP. Speed to lead is critical.",
      linkedContext: "High Readiness Score"
    },
    {
      id: "op2",
      title: "Client dependency blocking delivery",
      description: "Global Metrics lacks API access to internal systems, blocking the Pipeline Architecture milestone.",
      priority: "HIGH",
      status: "BLOCKED",
      owner: "Delivery Team",
      sourceModule: "Delivery",
      sourceEntityId: "del1",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      dueDate: new Date(Date.now() - 86400000 * 1).toISOString(),
      recommendedAction: "Escalate to Global Metrics CTO for manual API provision.",
      linkedContext: "Milestone: Pipeline Architecture"
    },
    {
      id: "op3",
      title: "Relationship requires attention",
      description: "Vortex Labs engagement health is deteriorating due to unfulfilled goals.",
      priority: "MEDIUM",
      status: "OPEN",
      owner: "Account Management",
      sourceModule: "Retention",
      sourceEntityId: "ret1",
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      recommendedAction: "Schedule a health-check call with Vortex Labs stakeholders.",
      intelligenceSignal: "No interaction logged in 30 days."
    },
    {
      id: "op4",
      title: "Overdue collection requires operator action",
      description: "Vortex Labs Phase 1 Complete invoice is now 12 days overdue.",
      priority: "HIGH",
      status: "IN_PROGRESS",
      owner: "Finance Ops",
      sourceModule: "Revenue",
      sourceEntityId: "rev2",
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      recommendedAction: "Submit vendor packet to accounts payable.",
      linkedContext: "Amount: $60,000"
    },
    {
      id: "op5",
      title: "Draft Proposal Approval",
      description: "Nexus Digital proposal is drafted but requires executive sign-off.",
      priority: "LOW",
      status: "COMPLETED",
      owner: "Executive Sponsor",
      sourceModule: "Conversion",
      sourceEntityId: "opp2",
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      recommendedAction: "Review and approve the contract terms.",
      linkedContext: "Status: Sent"
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
