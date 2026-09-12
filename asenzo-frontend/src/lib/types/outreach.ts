export type ProspectStatus =
  | "NOT_CONTACTED"
  | "CONTACTED"
  | "FOLLOW_UP"
  | "REPLIED"
  | "INTERESTED"
  | "QUALIFIED"
  | "MEETING_BOOKED"
  | "OPPORTUNITY"
  | "WON"
  | "LOST";

export type NextActionType =
  | "FIRST_CONTACT"
  | "FOLLOW_UP"
  | "REPLY"
  | "QUALIFY"
  | "BOOK_MEETING"
  | "SEND_INFORMATION"
  | "CUSTOM";

export type NextActionStatus = "PENDING" | "COMPLETED" | "SKIPPED" | "RESCHEDULED";

export type ActivityType =
  | "PROSPECT_CREATED"
  | "INITIAL_OUTREACH"
  | "FOLLOW_UP"
  | "REPLY_RECEIVED"
  | "MESSAGE_SENT"
  | "EMAIL_SENT"
  | "CALL_COMPLETED"
  | "MEETING_BOOKED"
  | "MEETING_COMPLETED"
  | "NOTE_ADDED"
  | "STATUS_CHANGED"
  | "QUALIFIED"
  | "DISQUALIFIED"
  | "CONVERTED"
  | "CUSTOM";

export type ActivityDirection = "OUTBOUND" | "INBOUND" | "INTERNAL";
export type Sentiment = "POSITIVE" | "NEUTRAL" | "NEGATIVE";
export type OutreachOutcome = 
  | "NO_RESPONSE"
  | "INTERESTED"
  | "NOT_INTERESTED"
  | "QUESTION"
  | "NEEDS_FOLLOW_UP"
  | "MEETING_REQUEST"
  | "OTHER";

export interface ContactChannel {
  type: "INSTAGRAM" | "LINKEDIN" | "EMAIL" | "X" | "WHATSAPP" | "PHONE" | "OTHER";
  value: string;
}

export interface Prospect {
  id: string; // The canonical Contact ID
  firstName: string;
  lastName: string;
  company: string;
  role: string;
  website: string;
  
  channels: ContactChannel[];
  source: string;
  icpId: string;
  segment: string;
  tags: string[];
  
  priority: "LOW" | "MEDIUM" | "HIGH";
  owner: string;
  
  status: ProspectStatus;
  
  lastActivityAt?: string;
  lastContactedAt?: string;
  lastReplyAt?: string;
  followUpCount: number;

  createdAt: string;
  updatedAt: string;
  
  // Link to Lead if qualification happens
  leadId?: string;
}

export interface NextAction {
  id: string;
  prospectId: string;
  type: NextActionType;
  title: string;
  description: string;
  channel: string;
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: NextActionStatus;
  assignedTo: string;
  createdAt: string;
  completedAt?: string;
}

export interface OutreachActivity {
  id: string;
  prospectId: string;
  type: ActivityType;
  channel: string;
  direction: ActivityDirection;
  summary: string;
  outcome?: OutreachOutcome;
  sentiment?: Sentiment;
  metadata?: any;
  performedBy: string;
  occurredAt: string;
  createdAt: string;
}
