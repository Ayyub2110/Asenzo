import fs from "fs";
import path from "path";
import { Lead, Opportunity, SalesCall, ActionQueueItem } from "../types/conversion";

const DATA_FILE = path.join(process.cwd(), "data", "conversion.json");

interface ConversionDB {
  leads: Lead[];
  opportunities: Opportunity[];
  calls: SalesCall[];
  actions: ActionQueueItem[];
}

const DEFAULT_DB: ConversionDB = {
  leads: [
    {
      id: "seed_l1", name: "[DEMO] David Miller", email: "david@apexb2b.demo", contactInfo: "david@apexb2b.demo", source: "Inbound VSL", acquisitionChannel: "YouTube", acquisitionCampaign: "Organic Scaling",
      originalSource: "YouTube", originalContent: "How to Build an OS", originalKeyword: "founder scaling", originalFunnel: "Phase 1 Webinar",
      lastTouch: "Form Submit", temperature: "HOT", qualificationStatus: "INTENT_DETECTED",
      problem: "Agency operations scaling bottleneck", desiredOutcome: "Predictable fulfillment", buyingTrigger: "Revenue flatlined in Q3",
      objections: [], offerInterest: "Custom Build out", ownerAction: "Admin", nextAction: "Qualify Lead",
      createdAt: "2026-09-02T10:00:00Z", updatedAt: "2026-09-02T10:00:00Z"
    },
    {
      id: "seed_l2", name: "[DEMO] Sarah Jenkins", email: "sarah@cloudscale.demo", contactInfo: "sarah@cloudscale.demo", source: "Direct Message", acquisitionChannel: "LinkedIn", acquisitionCampaign: "Outbound Pilot",
      originalSource: "LinkedIn", originalContent: "DM Sequence A", originalKeyword: "growth os", originalFunnel: "Outbound Campaign",
      lastTouch: "Replied Positively", temperature: "WARM", qualificationStatus: "QUALIFIED",
      problem: "Lead quality is too low", desiredOutcome: "High intent inbound", buyingTrigger: "Recently raised Series A",
      objections: ["Price"], offerInterest: "Acquisition OS", ownerAction: "Admin", nextAction: "Send Info Pack",
      createdAt: "2026-09-01T15:30:00Z", updatedAt: "2026-09-02T09:15:00Z"
    }
  ],
  opportunities: [
    {
      id: "seed_opp1", leadId: "seed_l1", offerId: "Acquisition_OS", pipelineStage: "CALL_BOOKED",
      estimatedValue: 12000, probability: 60, expectedCloseDate: "2026-09-10",
      problem: "Agency scaling bottleneck", desiredOutcome: "Predictable content-led growth",
      qualificationNote: "Perfect ICP match. Has authority.", buyingTrigger: "Revenue flatlined in Q3",
      objections: [], followUpState: "UPCOMING", owner: "Founder", nextAction: "Conduct Discovery",
      createdAt: "2026-09-02T10:30:00Z", updatedAt: "2026-09-02T10:30:00Z"
    },
    {
      id: "seed_opp2", leadId: "seed_l2", offerId: "Acquisition_OS", pipelineStage: "OFFER_PRESENTED",
      estimatedValue: 15000, probability: 80, expectedCloseDate: "2026-09-05",
      problem: "Low quality leads", desiredOutcome: "High intent inbound",
      qualificationNote: "Good company profile. Needs education on founder-led philosophy.", buyingTrigger: "Recently raised Series A",
      objections: ["PRICE"], followUpState: "DUE", owner: "Founder", nextAction: "Follow-up on Proposal",
      createdAt: "2026-08-25T14:00:00Z", updatedAt: "2026-09-01T11:00:00Z"
    }
  ],
  calls: [],
  actions: []
};

// Ensure File Exists with Initial Data
const initializeDB = () => {
  if (!fs.existsSync(path.dirname(DATA_FILE))) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_DB, null, 2), "utf-8");
  }
};

export const readDB = (): ConversionDB => {
  initializeDB();
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as ConversionDB;
  } catch (error) {
    console.error("Failed to read conversion DB:", error);
    return DEFAULT_DB;
  }
};

export const writeDB = (data: ConversionDB) => {
  initializeDB();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write to conversion DB:", error);
  }
};

export const getLeads = () => readDB().leads;
export const getLead = (id: string) => readDB().leads.find(l => l.id === id);
export const saveLead = (lead: Lead) => {
  const db = readDB();
  const existing = db.leads.findIndex(l => l.id === lead.id);
  if (existing >= 0) db.leads[existing] = { ...db.leads[existing], ...lead, updatedAt: new Date().toISOString() };
  else db.leads.push({ ...lead, id: lead.id || `l_${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  writeDB(db);
};

export const getOpportunities = () => readDB().opportunities;
export const getOpportunity = (id: string) => readDB().opportunities.find(o => o.id === id);
export const saveOpportunity = (opp: Opportunity) => {
  const db = readDB();
  const existing = db.opportunities.findIndex(o => o.id === opp.id);
  if (existing >= 0) db.opportunities[existing] = { ...db.opportunities[existing], ...opp, updatedAt: new Date().toISOString() };
  else db.opportunities.push({ ...opp, id: opp.id || `opp_${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  writeDB(db);
};
