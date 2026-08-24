"use server";

import fs from 'fs/promises';
import path from 'path';
import { 
  Lead, 
  AcquisitionSource, 
  AcquisitionCampaign, 
  CaptureSurface, 
  LeadMagnet, 
  CTA, 
  LeadEvent, 
  AttributionEvent, 
  IntentSignal, 
  AcquisitionQualification, 
  Conversation, 
  ConversationMessage, 
  Handoff,
  Opportunity 
} from '../types';
import { mockConversion } from '../mock/data';

const DATA_FILE = path.join(process.cwd(), 'data', 'acquisition.json');

// Helper to ensure data file exists and read its content
async function getDb() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      const defaultState = {
        leads: [],
        sources: [],
        campaigns: [],
        captureSurfaces: [],
        leadMagnets: [],
        ctas: [],
        leadEvents: [],
        attributionEvents: [],
        intentSignals: [],
        qualifications: [],
        conversations: [],
        handoffs: []
      };
      await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
      await fs.writeFile(DATA_FILE, JSON.stringify(defaultState, null, 2));
      return defaultState;
    }
    throw error;
  }
}

async function writeDb(data: any) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function getLeads(): Promise<Lead[]> {
  const db = await getDb();
  return db.leads || [];
}

export async function getLead(id: string): Promise<Lead | undefined> {
  const db = await getDb();
  return (db.leads || []).find((l: Lead) => l.id === id);
}

export async function createLead(payload: Partial<Lead>): Promise<Lead> {
  const db = await getDb();
  const newLead: Lead = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    workspaceId: payload.workspaceId || 'workspace_1',
    name: payload.name || '',
    email: payload.email || '',
    phone: payload.phone,
    company: payload.company,
    role: payload.role,
    sourceId: payload.sourceId,
    campaignId: payload.campaignId,
    leadMagnetId: payload.leadMagnetId,
    ctaId: payload.ctaId,
    firstTouchAt: payload.firstTouchAt || new Date().toISOString(),
    latestTouchAt: payload.latestTouchAt || new Date().toISOString(),
    status: payload.status || 'NEW',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.leads.push(newLead);
  await writeDb(db);
  return newLead;
}

export async function updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
  const db = await getDb();
  const index = db.leads.findIndex((l: Lead) => l.id === id);
  if (index === -1) throw new Error("Lead not found");
  
  db.leads[index] = { ...db.leads[index], ...updates, updatedAt: new Date().toISOString() };
  await writeDb(db);
  return db.leads[index];
}

export async function getSources(): Promise<AcquisitionSource[]> {
  const db = await getDb();
  return db.sources || [];
}

export async function createSource(payload: Omit<AcquisitionSource, 'id'>): Promise<AcquisitionSource> {
  const db = await getDb();
  const newItem: AcquisitionSource = { id: `src_${Date.now()}`, ...payload };
  db.sources.push(newItem);
  await writeDb(db);
  return newItem;
}

export async function getCampaigns(): Promise<AcquisitionCampaign[]> {
  const db = await getDb();
  return db.campaigns || [];
}

export async function createCampaign(payload: Omit<AcquisitionCampaign, 'id'>): Promise<AcquisitionCampaign> {
  const db = await getDb();
  const newItem: AcquisitionCampaign = { id: `cmp_${Date.now()}`, ...payload };
  db.campaigns.push(newItem);
  await writeDb(db);
  return newItem;
}

export async function getCaptureSurfaces(): Promise<CaptureSurface[]> {
  const db = await getDb();
  return db.captureSurfaces || [];
}

export async function createCaptureSurface(payload: Omit<CaptureSurface, 'id'>): Promise<CaptureSurface> {
  const db = await getDb();
  const newItem: CaptureSurface = { id: `cs_${Date.now()}`, ...payload };
  db.captureSurfaces.push(newItem);
  await writeDb(db);
  return newItem;
}

export async function getLeadMagnets(): Promise<LeadMagnet[]> {
  const db = await getDb();
  return db.leadMagnets || [];
}

export async function createLeadMagnet(payload: Omit<LeadMagnet, 'id'>): Promise<LeadMagnet> {
  const db = await getDb();
  const newItem: LeadMagnet = { id: `lm_${Date.now()}`, ...payload };
  db.leadMagnets.push(newItem);
  await writeDb(db);
  return newItem;
}

export async function getCTAs(): Promise<CTA[]> {
  const db = await getDb();
  return db.ctas || [];
}

export async function createCTA(payload: Omit<CTA, 'id'>): Promise<CTA> {
  const db = await getDb();
  const newItem: CTA = { id: `cta_${Date.now()}`, ...payload };
  db.ctas.push(newItem);
  await writeDb(db);
  return newItem;
}

export async function getLeadEvents(leadId: string): Promise<LeadEvent[]> {
  const db = await getDb();
  return (db.leadEvents || []).filter((e: LeadEvent) => e.leadId === leadId).sort((a: LeadEvent, b: LeadEvent) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function createLeadEvent(payload: Omit<LeadEvent, 'id' | 'timestamp'>): Promise<LeadEvent> {
  const db = await getDb();
  const newItem: LeadEvent = { id: `evt_${Date.now()}`, timestamp: new Date().toISOString(), ...payload };
  db.leadEvents.push(newItem);
  
  // Also update lead's latestTouchAt
  const leadIndex = db.leads.findIndex((l: Lead) => l.id === payload.leadId);
  if (leadIndex !== -1) {
    db.leads[leadIndex].latestTouchAt = newItem.timestamp;
  }
  
  await writeDb(db);
  return newItem;
}

export async function getAttributionJourney(leadId: string): Promise<AttributionEvent[]> {
  const db = await getDb();
  return (db.attributionEvents || []).filter((e: AttributionEvent) => e.leadId === leadId).sort((a: AttributionEvent, b: AttributionEvent) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

export async function createAttributionEvent(payload: Omit<AttributionEvent, 'id'>): Promise<AttributionEvent> {
  const db = await getDb();
  const newItem: AttributionEvent = { id: `attr_${Date.now()}`, ...payload };
  db.attributionEvents.push(newItem);
  await writeDb(db);
  return newItem;
}

export async function getIntentSignals(leadId: string): Promise<IntentSignal[]> {
  const db = await getDb();
  return (db.intentSignals || []).filter((e: IntentSignal) => e.leadId === leadId);
}

export async function createIntentSignal(payload: Omit<IntentSignal, 'id' | 'timestamp'>): Promise<IntentSignal> {
  const db = await getDb();
  const newItem: IntentSignal = { id: `int_${Date.now()}`, timestamp: new Date().toISOString(), ...payload };
  db.intentSignals.push(newItem);
  await writeDb(db);
  return newItem;
}

export async function getQualification(leadId: string): Promise<AcquisitionQualification | undefined> {
  const db = await getDb();
  return (db.qualifications || []).find((q: AcquisitionQualification) => q.leadId === leadId);
}

export async function qualifyLead(payload: Partial<AcquisitionQualification> & { leadId: string }): Promise<AcquisitionQualification> {
  const db = await getDb();
  let qual = (db.qualifications || []).find((q: AcquisitionQualification) => q.leadId === payload.leadId);
  
  if (qual) {
    qual = { ...qual, ...payload, updatedAt: new Date().toISOString() };
    const idx = db.qualifications.findIndex((q: AcquisitionQualification) => q.leadId === payload.leadId);
    db.qualifications[idx] = qual;
  } else {
    qual = {
      id: `qual_${Date.now()}`,
      leadId: payload.leadId,
      icpFit: payload.icpFit || 'MEDIUM',
      problemFit: payload.problemFit || 'MEDIUM',
      urgency: payload.urgency || 'MEDIUM',
      state: payload.state || 'REVIEW',
      notes: payload.notes,
      updatedAt: new Date().toISOString()
    };
    db.qualifications.push(qual);
  }
  
  // Sync status to lead
  const leadIndex = db.leads.findIndex((l: Lead) => l.id === payload.leadId);
  if (leadIndex !== -1 && payload.state) {
    if (payload.state === 'QUALIFIED') db.leads[leadIndex].status = 'QUALIFIED';
    else if (payload.state === 'UNQUALIFIED') db.leads[leadIndex].status = 'UNQUALIFIED';
    else db.leads[leadIndex].status = 'REVIEWING';
  }
  
  await writeDb(db);
  return qual;
}

export async function getConversation(leadId: string): Promise<Conversation | undefined> {
  const db = await getDb();
  return (db.conversations || []).find((c: Conversation) => c.leadId === leadId);
}

export async function startConversation(payload: { leadId: string, channel: string, initialMessage: string, sender: 'LEAD' | 'SYSTEM' | 'USER' }): Promise<Conversation> {
  const db = await getDb();
  const newMessage: ConversationMessage = {
    id: `msg_${Date.now()}`,
    sender: payload.sender,
    text: payload.initialMessage,
    timestamp: new Date().toISOString()
  };
  const newConversation: Conversation = {
    id: `conv_${Date.now()}`,
    leadId: payload.leadId,
    channel: payload.channel,
    messages: [newMessage],
    status: 'OPEN'
  };
  db.conversations.push(newConversation);
  
  // Set lead status to IN_CONVERSATION
  const leadIndex = db.leads.findIndex((l: Lead) => l.id === payload.leadId);
  if (leadIndex !== -1 && db.leads[leadIndex].status !== 'HANDED_OFF' && db.leads[leadIndex].status !== 'READY_FOR_HANDOFF') {
    db.leads[leadIndex].status = 'IN_CONVERSATION';
  }
  
  await writeDb(db);
  return newConversation;
}

export async function addMessage(leadId: string, text: string, sender: 'LEAD' | 'SYSTEM' | 'USER'): Promise<Conversation> {
  const db = await getDb();
  const conv = (db.conversations || []).find((c: Conversation) => c.leadId === leadId);
  if (!conv) throw new Error("Conversation not found");
  
  const newMessage: ConversationMessage = {
    id: `msg_${Date.now()}`,
    sender,
    text,
    timestamp: new Date().toISOString()
  };
  conv.messages.push(newMessage);
  await writeDb(db);
  return conv;
}

export async function createHandoff(payload: { leadId: string, notes?: string }): Promise<Handoff> {
  const db = await getDb();
  const newHandoff: Handoff = {
    id: `ho_${Date.now()}`,
    leadId: payload.leadId,
    status: 'PENDING',
    notes: payload.notes,
    createdAt: new Date().toISOString()
  };
  db.handoffs.push(newHandoff);
  
  const leadIndex = db.leads.findIndex((l: Lead) => l.id === payload.leadId);
  if (leadIndex !== -1) {
    db.leads[leadIndex].status = 'READY_FOR_HANDOFF';
  }
  
  await writeDb(db);
  return newHandoff;
}

export async function getHandoffs(): Promise<Handoff[]> {
  const db = await getDb();
  return db.handoffs || [];
}

// Convert Handoff to Opportunity
export async function completeHandoff(handoffId: string, opportunityId: string): Promise<Handoff> {
  const db = await getDb();
  const handoff = db.handoffs.find((h: Handoff) => h.id === handoffId);
  if (!handoff) throw new Error("Handoff not found");
  
  handoff.status = 'COMPLETED';
  handoff.opportunityId = opportunityId;
  
  const leadIndex = db.leads.findIndex((l: Lead) => l.id === handoff.leadId);
  if (leadIndex !== -1) {
    db.leads[leadIndex].status = 'HANDED_OFF';
    
    // Auto-create Opportunity in Conversion OS
    const lead = db.leads[leadIndex];
    const newOpportunity: Opportunity = {
      id: opportunityId,
      leadId: lead.id,
      leadName: lead.name,
      company: lead.company || "Unknown Company",
      title: 'Acquisition Handoff',
      value: 0,
      stage: 'QUALIFIED',
      qualification: {
        fit: 'HIGH',
        problem: 'Sourced from Acquisition',
        urgency: 'HIGH',
        authority: lead.role || 'Unknown',
        budget: 'Validating'
      },
      salesCall: { status: 'TBD' },
      objections: [],
      lastActivity: new Date().toISOString(),
      nextAction: 'Qualify and Schedule Connect',
      daysInactive: 0,
      priority: 'high',
      intelligenceSignal: 'Qualified demand passed from Acquisition Center.'
    };
    mockConversion.opportunities.unshift(newOpportunity);
  }
  
  await writeDb(db);
  return handoff;
}
