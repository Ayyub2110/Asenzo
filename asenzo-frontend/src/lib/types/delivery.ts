export type DeliveryClientStatus = "ONBOARDING" | "ACTIVE" | "AT_RISK" | "PAUSED" | "COMPLETED" | "CHURNED";
export type EngagementStatus = "PLANNED" | "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED";
export type OnboardingStatus = "NOT_STARTED" | "IN_PROGRESS" | "BLOCKED" | "COMPLETED" | "CANCELLED";
export type MilestoneStatus = "NOT_STARTED" | "IN_PROGRESS" | "BLOCKED" | "COMPLETED" | "CANCELLED";
export type DeliverableStatus = "PLANNED" | "IN_PROGRESS" | "IN_REVIEW" | "CLIENT_REVIEW" | "APPROVED" | "CHANGES_REQUESTED" | "DELIVERED" | "CANCELLED";
export type HealthStatus = "HEALTHY" | "STABLE" | "AT_RISK" | "CRITICAL";
export type ReportStatus = "DRAFT" | "INTERNAL_REVIEW" | "PUBLISHED" | "ARCHIVED";
export type PermissionStatus = "NOT_REQUESTED" | "REQUESTED" | "APPROVED" | "DECLINED";

export interface DeliveryClient {
    id: string; // Matches Revenue Customer ID strictly
    primaryContact: string; // From Customer
    company: string; // From Customer
    email: string;
    owner: string;
    status: DeliveryClientStatus;
    health: HealthStatus;
    startDate: string;
    currentOffer: string;
    renewalDate: string;
    portalStatus: "ACTIVE" | "INACTIVE";
    isDemo?: boolean;
}

export interface Engagement {
    id: string;
    customerId: string;
    offer: string;
    name: string;
    description: string;
    startDate: string;
    endDate?: string;
    owner: string;
    team: string[];
    status: EngagementStatus;
    scope: string; // Define clearly IN SCOPE / OUT OF SCOPE
    successCriteria: string;
    budget: number;
    renewalDate: string;
    notes: string;
    progress: number; // Derived from milestones internally
    isDemo?: boolean;
}

export interface OnboardingStep {
    id: string;
    task: string;
    owner: string;
    dueDate?: string;
    status: "PENDING" | "COMPLETED";
    isRequired: boolean;
    completedDate?: string;
    notes: string;
}

export interface Onboarding {
    id: string;
    customerId: string;
    engagementId: string;
    offer: string;
    owner: string;
    startDate: string;
    targetCompletionDate: string;
    status: OnboardingStatus;
    progress: number; // calculated %
    kickoffDate?: string;
    firstValueDate?: string;
    blockers: string;
    notes: string;
    steps: OnboardingStep[];
    isDemo?: boolean;
}

export interface Milestone {
    id: string;
    engagementId: string;
    name: string;
    description: string;
    owner: string;
    clientReviewer?: string;
    startDate: string;
    dueDate: string;
    status: MilestoneStatus;
    progress: number;
    dependencies: string[]; // List of IDs/Descriptions
    notes: string;
    isDemo?: boolean;
}

export interface Deliverable {
    id: string;
    engagementId: string;
    milestoneId?: string;
    name: string;
    type: string;
    description: string;
    owner: string;
    dueDate: string;
    status: DeliverableStatus;
    version: number;
    visibility: "INTERNAL" | "CLIENT_VISIBLE";
    deliveredDate?: string;
    fileUrl?: string;
    notes: string;
    isDemo?: boolean;
}

export interface CommunicationRecord {
    id: string;
    customerId: string;
    engagementId: string;
    milestoneId?: string;
    deliverableId?: string;
    type: "MESSAGE" | "MEETING_NOTE" | "DECISION" | "REQUEST" | "ANNOUNCEMENT" | "INTERNAL_NOTE";
    content: string;
    author: string;
    visibility: "INTERNAL" | "CLIENT_VISIBLE";
    createdAt: string;
    isResolved: boolean;
    isDemo?: boolean;
}

export interface DeliveryHealthRecord {
    id: string;
    customerId: string;
    engagementId?: string;
    status: HealthStatus;
    signals: string;
    reason: string;
    owner: string;
    createdDate: string;
    updatedDate: string;
    recommendedAction?: string; // AI generated or rule-based
    isDemo?: boolean;
}

export interface DeliveryReport {
    id: string;
    customerId: string;
    engagementId: string;
    reportingPeriod: string;
    summary: string;
    progress: string;
    completedWork: string;
    results: string;
    nextSteps: string;
    risks: string;
    clientActions: string;
    attachments: string[];
    publishedDate?: string;
    status: ReportStatus;
    isDemo?: boolean;
}

export interface ProofRecord {
    id: string;
    customerId: string;
    engagementId: string;
    outcome: string;
    proofType: "TESTIMONIAL" | "CASE_STUDY" | "BEFORE_AFTER" | "RESULT" | "CLIENT_QUOTE" | "SCREENSHOT" | "METRIC" | "VIDEO";
    source: string;
    date: string;
    permissionStatus: PermissionStatus;
    visibility: "PUBLIC" | "PRIVATE";
    notes: string;
    assetUrl?: string;
    isDemo?: boolean;
}
