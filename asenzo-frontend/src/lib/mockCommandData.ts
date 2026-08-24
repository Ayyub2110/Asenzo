export interface PrimaryConstraint {
  id: string;
  title: string;
  category: "Conversion" | "Acquisition" | "Sales" | "Delivery" | "Operations";
  severity: "high" | "medium" | "low";
  explanation: string;
  evidence: string[];
  recommendedAction: string;
  impact: string;
  sourceCenter: string;
  sourceRecord: string;
  createdAt: string;
  status: "active" | "resolved";
}

export interface TodayAction {
  id: string;
  priority: "P0" | "P1" | "P2"; // We translate this to High/Medium/Low in UI
  title: string;
  reason: string;
  source: string;
  relatedRecord: string;
  estimatedEffort?: string;
  dueStatus: "overdue" | "today" | "upcoming";
  primaryAction: string;
  secondaryAction?: string;
}

export interface ApprovalItem {
  id: string;
  type: string;
  title: string;
  sourceModule: string;
  createdTime: string;
  status: "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "COMPLETED" | "FAILED" | "REQUIRES_REVIEW";
  shortPreview: string;
  reviewAction: string;
  content: string; // for the review panel
}

export interface OpportunityItem {
  id: string;
  title: string;
  evidence: string[];
  value?: string;
  cta: string;
  source: string;
}

export interface RiskItem {
  id: string;
  title: string;
  evidence: string[];
  consequence: string;
  cta: string;
  source: string;
}

export interface WeeklyDirective {
  id: string;
  title: string;
  owner: string;
  dueDate: string;
  impact: string;
  approvalRequired: boolean;
}

export interface SystemActivity {
  id: string;
  title: string;
  time: string;
  type: "success" | "info" | "warning" | "error";
  system: string;
}

export const mockCommandData = {
  fis: {
    state: "Tracking",
    score: 72,
    trend7Day: "improving",
    trend30Day: "stable",
    currentDrag: "14 assets currently require founder review.",
    potentialLeverage: "Standardize recurring review workflow."
  },
  pulse: [
    { label: "Qualified Leads", value: "12", movement: "+3 this week", category: "Acquisition", status: "success" },
    { label: "Pipeline", value: "₹18.4L", movement: "4 active opportunities", category: "Conversion", status: "neutral" },
    { label: "Active Clients", value: "7", movement: "1 at risk", category: "Delivery", status: "warning" },
    { label: "Pending Approvals", value: "5", movement: "Requires review", category: "Operations", status: "attention" },
    { label: "Overdue", value: "3", movement: "Needs attention", category: "Operations", status: "destructive" },
    { label: "Content in Production", value: "8", movement: "2 awaiting review", category: "Attention", status: "neutral" },
    { label: "Revenue Target", value: "62%", movement: "₹12.4L / ₹20L", category: "Revenue", status: "success" }
  ],
  primaryConstraint: {
    id: "pc-1",
    title: "4 qualified opportunities have no next action.",
    category: "Conversion",
    severity: "high",
    explanation: "Pipeline value is available, but these opportunities are currently cooling.",
    evidence: [
      "4 qualified opportunities",
      "3 have had no activity for 5+ days",
      "₹7.8L combined pipeline value"
    ],
    recommendedAction: "Review the four opportunities and assign the next action.",
    impact: "Recover ₹7.8L pipeline",
    sourceCenter: "Conversion",
    sourceRecord: "opp-batch-1",
    createdAt: new Date().toISOString(),
    status: "active"
  } as PrimaryConstraint,
  todayActions: [
    {
      id: "ta-1",
      priority: "P1",
      title: "Approve 2 BOF scripts",
      reason: "Two scripts are ready for production.",
      source: "Acquisition",
      relatedRecord: "scripts-1",
      dueStatus: "today",
      primaryAction: "Review scripts"
    },
    {
      id: "ta-2",
      priority: "P0",
      title: "Review proposal for Apex Consulting",
      reason: "Proposal has been idle for 48 hours.",
      source: "Sales",
      relatedRecord: "proposal-apex",
      dueStatus: "overdue",
      primaryAction: "Open proposal"
    },
    {
      id: "ta-3",
      priority: "P0",
      title: "Resolve delayed onboarding",
      reason: "Client intake is blocking milestone 1.",
      source: "Delivery",
      relatedRecord: "client-intake-1",
      dueStatus: "today",
      primaryAction: "Open engagement"
    }
  ] as TodayAction[],
  approvals: [
    {
      id: "app-1",
      type: "BOF Script",
      title: "Founder-led growth",
      sourceModule: "Acquisition",
      createdTime: "2 hours ago",
      status: "PENDING_REVIEW",
      shortPreview: "Bottom-of-funnel LinkedIn script focusing on transition from operator to founder.",
      reviewAction: "Review",
      content: "This is the generated draft for the BOF script...\n\nIt highlights the transition from an operator mindset to a founder mindset."
    },
    {
      id: "app-2",
      type: "Sales Follow-up Draft",
      title: "Proposal follow-up for Apex Consulting",
      sourceModule: "Sales",
      createdTime: "5 hours ago",
      status: "PENDING_REVIEW",
      shortPreview: "Checking in on the proposal sent 48 hours ago.",
      reviewAction: "Review",
      content: "Hi Apex Team,\n\nJust floating this to the top of your inbox. Have you had a chance to review the proposal? I'm happy to jump on a quick call if you have any questions."
    },
    {
      id: "app-3",
      type: "Client Email",
      title: "Client onboarding email",
      sourceModule: "Delivery",
      createdTime: "1 day ago",
      status: "PENDING_REVIEW",
      shortPreview: "Welcome email and intake form link for standard consulting engagement.",
      reviewAction: "Review",
      content: "Welcome aboard!\n\nWe are excited to begin our engagement. Please complete the attached intake form..."
    }
  ] as ApprovalItem[],
  opportunities: [
    {
      id: "opp-1",
      title: "3 new qualified leads match your primary ICP.",
      evidence: [
        "3 leads",
        "2 from high-intent content",
        "₹4.2L estimated opportunity value"
      ],
      cta: "Review Leads",
      source: "Conversion"
    }
  ] as OpportunityItem[],
  risks: [
    {
      id: "risk-1",
      title: "Client onboarding is delayed.",
      evidence: [
        "3 clients have incomplete intake."
      ],
      consequence: "Milestone 1 cannot begin.",
      cta: "Resolve onboarding",
      source: "Delivery"
    }
  ] as RiskItem[],
  weeklyDirectives: [
    {
      id: "wd-1",
      title: "Clear the 4 stalled qualified opportunities",
      owner: "Founder",
      dueDate: "Friday",
      impact: "Recover ₹7.8L pipeline",
      approvalRequired: false
    },
    {
      id: "wd-2",
      title: "Approve the next 3 BOF scripts",
      owner: "Founder",
      dueDate: "Wednesday",
      impact: "Remove content production bottleneck",
      approvalRequired: true
    },
    {
      id: "wd-3",
      title: "Resolve onboarding intake blocker",
      owner: "Founder",
      dueDate: "Tuesday",
      impact: "Protect client delivery timeline",
      approvalRequired: false
    }
  ] as WeeklyDirective[],
  activity: [
    {
      id: "act-1",
      title: "Opportunity moved to Proposal",
      time: "10:45 AM",
      type: "success",
      system: "Sales"
    },
    {
      id: "act-2",
      title: "New qualified lead captured",
      time: "09:30 AM",
      type: "info",
      system: "Acquisition"
    },
    {
      id: "act-3",
      title: "Primary Constraint changed",
      time: "08:15 AM",
      type: "warning",
      system: "Command Center"
    }
  ] as SystemActivity[],
  automationStatus: {
    status: "FAILED", // "SUCCESS" | "FAILED" | "PARTIAL" | "NOT_CONFIGURED"
    message: "Lead capture automation failed. New inbound leads may not appear in Conversion.",
    cta: "Review status",
    affectedModule: "Conversion"
  }
};
