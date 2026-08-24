export type AcquisitionStatus = 'NEW' | 'REVIEWING' | 'QUALIFIED' | 'UNQUALIFIED' | 'IN_CONVERSATION' | 'READY_FOR_HANDOFF' | 'HANDED_OFF';

export interface Lead {
  id: string;
  workspaceId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role?: string;
  sourceId?: string;
  campaignId?: string;
  leadMagnetId?: string;
  ctaId?: string;
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

export interface AttributionEvent {
  id: string;
  leadId: string;
  type: 'FIRST_TOUCH' | 'LAST_TOUCH' | 'MULTI_TOUCH';
  sourceId?: string;
  campaignId?: string;
  ctaId?: string;
  timestamp: string;
  confidence: 'KNOWN' | 'INFERRED' | 'UNKNOWN';
}

export interface LeadEvent {
  id: string;
  leadId: string;
  type: 'content_clicked' | 'cta_clicked' | 'landing_viewed' | 'form_started' | 'form_submitted' | 'lead_created' | 'lead_updated' | 'lead_qualified' | 'lead_unqualified' | 'conversation_started' | 'conversation_replied' | 'handoff_created';
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

export interface AcquisitionRecommendation {
  id: string;
  title: string;
  evidence: string[];
}
