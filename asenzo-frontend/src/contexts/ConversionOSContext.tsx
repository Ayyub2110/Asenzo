"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { 
  Lead, Opportunity, SalesCall, LeadTemperature, QualificationStatus, PipelineStage, ObjectionRecord 
} from "@/lib/types/conversion";

// Extended structures to manage offers and follow-ups within our unified store
export interface OfferRecord {
  id: string;
  opportunityId: string;
  offerName: string;
  value: number;
  status: "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED" | "EXPIRED";
  sentDate?: string;
  notes?: string;
}

export interface FollowUpRecord {
  id: string;
  leadId?: string;
  opportunityId?: string;
  reason: string;
  dueDate: string;
  status: "DUE" | "UPCOMING" | "COMPLETED" | "SKIPPED";
}

export interface ConversationRecord {
  id: string;
  leadId: string;
  channel: string;
  latestMessage: string;
  timestamp: string;
  unread: boolean;
}

export interface EventTimelineItem {
  id: string;
  leadId: string;
  type: string;
  description: string;
  timestamp: string;
}

interface ConversionOSState {
  leads: Lead[];
  opportunities: Opportunity[];
  calls: SalesCall[];
  offers: OfferRecord[];
  followUps: FollowUpRecord[];
  conversations: ConversationRecord[];
  timelineEvents: EventTimelineItem[];
  
  // Actions
  addLead: (lead: Omit<Lead, "id" | "createdAt" | "updatedAt">) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  createOpportunity: (opportunity: Omit<Opportunity, "id" | "createdAt" | "updatedAt">) => void;
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void;
  bookCall: (call: Omit<SalesCall, "id">) => void;
  updateCall: (id: string, updates: Partial<SalesCall>) => void;
  createOffer: (offer: Omit<OfferRecord, "id">) => void;
  updateOffer: (id: string, updates: Partial<OfferRecord>) => void;
  createFollowUp: (followUp: Omit<FollowUpRecord, "id">) => void;
  updateFollowUp: (id: string, updates: Partial<FollowUpRecord>) => void;
  logEvent: (leadId: string, type: string, description: string) => void;
}

const ConversionOSContext = createContext<ConversionOSState | undefined>(undefined);

// Initial Test Lead setup for End-to-End lifecycle mapping
const INITIAL_LEAD: Lead = {
  id: "l_test_01",
  name: "Alexander Becker",
  email: "alex@agencygrowth.co",
  company: "Agency Growth",
  role: "CEO",
  phone: "+1 555-0921",
  originalSource: "Instagram DM",
  originalKeyword: "SCALE",
  originalContent: "Why scaling breaks at $50k/mo (Reel)",
  originalFunnel: "TOF",
  lastTouch: new Date().toISOString(),
  temperature: "WARM",
  qualificationStatus: "QUALIFIED",
  problem: "CAC scaling poorly due to outbound reliance",
  desiredOutcome: "Predictable automated inbound",
  buyingTrigger: "Just missed Q3 targets",
  objections: [],
  offerInterest: "ASENZO Growth OS Implementation",
  ownerAction: "Founder",
  nextAction: "Run Discovery Call",
  createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  updatedAt: new Date().toISOString()
};

const INITIAL_OPP: Opportunity = {
  id: "o_test_01",
  leadId: "l_test_01",
  offerId: "off_1",
  pipelineStage: "CALL_BOOKED",
  estimatedValue: 45000,
  probability: 40,
  expectedCloseDate: new Date(Date.now() + 86400000 * 14).toISOString(),
  problem: "Outbound reliance causing bottleneck",
  desiredOutcome: "Predictable pipeline",
  qualificationNote: "Solid ICP. High Urgency.",
  buyingTrigger: "Missed targets",
  objections: [],
  followUpState: "UPCOMING",
  owner: "John Founder",
  nextAction: "Prep for call",
  createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  updatedAt: new Date().toISOString()
};

const INITIAL_CALL: SalesCall = {
  id: "c_test_01",
  opportunityId: "o_test_01",
  scheduledDate: new Date(Date.now() + 86400000).toISOString(),
  status: "SCHEDULED",
  situation: "Scaling agency hitting 50k ceiling",
  problem: "Founders stuck in sales calls",
  impact: "Slowing revenue",
  desiredOutcome: "Automated routing",
  previousAttempts: "Tried generic CRM, failed",
  beliefs: "Needs custom mapping",
  buyingTrigger: "Pain hit capacity limit",
  objections: "Pricing concerns",
  fit: "High"
};

const INITIAL_EVENT: EventTimelineItem = {
  id: "evt_01",
  leadId: "l_test_01",
  type: "CAPTURE",
  description: "Commented 'SCALE' on Instagram Reel, captured via automation.",
  timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
};

export function ConversionOSProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([INITIAL_LEAD]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([INITIAL_OPP]);
  const [calls, setCalls] = useState<SalesCall[]>([INITIAL_CALL]);
  const [offers, setOffers] = useState<OfferRecord[]>([]);
  const [followUps, setFollowUps] = useState<FollowUpRecord[]>([]);
  const [conversations, setConversations] = useState<ConversationRecord[]>([
    { id: "conv_1", leadId: "l_test_01", channel: "Instagram DM", latestMessage: "Let's talk scaling then.", timestamp: new Date().toISOString(), unread: true }
  ]);
  const [timelineEvents, setTimelineEvents] = useState<EventTimelineItem[]>([INITIAL_EVENT]);

  const logEvent = (leadId: string, type: string, description: string) => {
    setTimelineEvents(prev => [{ id: `evt_${Date.now()}`, leadId, type, description, timestamp: new Date().toISOString() }, ...prev]);
  };

  const addLead = (lead: Omit<Lead, "id" | "createdAt" | "updatedAt">) => {
    const id = `l_${Date.now()}`;
    setLeads(prev => [{ ...lead, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...prev]);
    logEvent(id, "CREATED", "Lead profile created in Conversion OS.");
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l));
    if (updates.qualificationStatus) logEvent(id, "QUALIFICATION", `Qualification status updated to: ${updates.qualificationStatus}`);
  };

  const createOpportunity = (opp: Omit<Opportunity, "id" | "createdAt" | "updatedAt">) => {
    const id = `o_${Date.now()}`;
    setOpportunities(prev => [{ ...opp, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...prev]);
    logEvent(opp.leadId, "OPPORTUNITY", `Opportunity moved to pipeline stage: ${opp.pipelineStage}`);
  };

  const updateOpportunity = (id: string, updates: Partial<Opportunity>) => {
    setOpportunities(prev => prev.map(o => o.id === id ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o));
    const targetOpp = opportunities.find(o => o.id === id);
    if (targetOpp && updates.pipelineStage) {
      logEvent(targetOpp.leadId, "PIPELINE", `Pipeline stage updated to: ${updates.pipelineStage}`);
    }
  };

  const bookCall = (call: Omit<SalesCall, "id">) => {
    const id = `c_${Date.now()}`;
    setCalls(prev => [{ ...call, id }, ...prev]);
    const targetOpp = opportunities.find(o => o.id === call.opportunityId);
    if (targetOpp) logEvent(targetOpp.leadId, "CALL", `Sales Call Booked for ${call.scheduledDate}`);
  };

  const updateCall = (id: string, updates: Partial<SalesCall>) => {
    setCalls(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    const call = calls.find(c => c.id === id);
    if (call) {
      const targetOpp = opportunities.find(o => o.id === call.opportunityId);
      if (targetOpp && updates.status) logEvent(targetOpp.leadId, "CALL", `Sales Call status changed to: ${updates.status}`);
    }
  };

  const createOffer = (offer: Omit<OfferRecord, "id">) => {
    const id = `off_${Date.now()}`;
    setOffers(prev => [{ ...offer, id }, ...prev]);
    const targetOpp = opportunities.find(o => o.id === offer.opportunityId);
    if (targetOpp) logEvent(targetOpp.leadId, "OFFER", `Offer drafted: ${offer.offerName} ($${offer.value.toLocaleString()})`);
  };

  const updateOffer = (id: string, updates: Partial<OfferRecord>) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
    const offer = offers.find(o => o.id === id);
    if (offer) {
      const targetOpp = opportunities.find(o => o.id === offer.opportunityId);
      if (targetOpp && updates.status) logEvent(targetOpp.leadId, "OFFER", `Offer status changed to: ${updates.status}`);
    }
  };

  const createFollowUp = (fu: Omit<FollowUpRecord, "id">) => {
    const id = `fu_${Date.now()}`;
    setFollowUps(prev => [{ ...fu, id }, ...prev]);
    if (fu.leadId) logEvent(fu.leadId, "FOLLOW_UP", `Follow-up scheduled: ${fu.reason}`);
  };

  const updateFollowUp = (id: string, updates: Partial<FollowUpRecord>) => {
    setFollowUps(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  return (
    <ConversionOSContext.Provider value={{
      leads, opportunities, calls, offers, followUps, conversations, timelineEvents,
      addLead, updateLead, createOpportunity, updateOpportunity, bookCall, updateCall, createOffer, updateOffer, createFollowUp, updateFollowUp, logEvent
    }}>
      {children}
    </ConversionOSContext.Provider>
  );
}

export function useConversionOS() {
  const context = useContext(ConversionOSContext);
  if (context === undefined) {
    throw new Error("useConversionOS must be used within a ConversionOSProvider");
  }
  return context;
}
