"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { 
  Prospect, NextAction, OutreachActivity 
} from "@/lib/types/outreach";
import { getOrGenerateDemoData } from "@/lib/mock/seedData";

interface OutreachOSState {
  prospects: Prospect[];
  nextActions: NextAction[];
  activities: OutreachActivity[];

  // Write Actions
  addProspect: (prospect: Omit<Prospect, "id" | "createdAt" | "updatedAt">) => void;
  updateProspect: (id: string, updates: Partial<Prospect>) => void;
  deleteProspect: (id: string) => void;
  
  logActivity: (activity: Omit<OutreachActivity, "id" | "createdAt">, updateProspectStatus?: boolean) => void;
  createNextAction: (action: Omit<NextAction, "id" | "createdAt">) => void;
  updateNextAction: (id: string, updates: Partial<NextAction>) => void;
}

const OutreachOSContext = createContext<OutreachOSState | undefined>(undefined);

export function OutreachOSProvider({ children }: { children: ReactNode }) {
  const [prospects, setProspects] = useState<Prospect[]>(() => {
     return [
        {
           id: "p_01",
           firstName: "John",
           lastName: "Smith",
           company: "Acme Corp",
           role: "Founder",
           website: "acme.co",
           channels: [{ type: "INSTAGRAM", value: "@johnsmith" }, { type: "LINKEDIN", value: "/in/johnsmith" }],
           source: "Instagram",
           icpId: "icp_1",
           segment: "SaaS Founders",
           tags: ["high-growth"],
           priority: "HIGH",
           owner: "Anas",
           status: "INTERESTED",
           followUpCount: 2,
           lastActivityAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
           lastContactedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
           lastReplyAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
           createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
           updatedAt: new Date().toISOString()
        },
        {
           id: "p_02",
           firstName: "Sarah",
           lastName: "Williams",
           company: "Global Scale",
           role: "CEO",
           website: "globalscale.io",
           channels: [{ type: "LINKEDIN", value: "/in/sarahw" }, { type: "EMAIL", value: "sarah@globalscale.io" }],
           source: "LinkedIn Search",
           icpId: "icp_1",
           segment: "SaaS Founders",
           tags: [],
           priority: "MEDIUM",
           owner: "Anas",
           status: "NOT_CONTACTED",
           followUpCount: 0,
           createdAt: new Date().toISOString(),
           updatedAt: new Date().toISOString()
        },
        {
           id: "p_03",
           firstName: "Michael",
           lastName: "Chen",
           company: "Scale AI",
           role: "Revenue Leader",
           website: "scale.ai",
           channels: [{ type: "EMAIL", value: "michael@scale.ai" }],
           source: "Referral",
           icpId: "icp_2",
           segment: "Agency Owners",
           tags: [],
           priority: "HIGH",
           owner: "Anas",
           status: "FOLLOW_UP",
           followUpCount: 1,
           lastActivityAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
           lastContactedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
           createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
           updatedAt: new Date().toISOString()
        }
     ];
  });

  const [nextActions, setNextActions] = useState<NextAction[]>(() => {
     return [
        {
           id: "na_01",
           prospectId: "p_01",
           type: "REPLY",
           title: "Respond to John",
           description: "John replied favorably on IG, send info packet",
           channel: "INSTAGRAM",
           dueDate: new Date().toISOString(),
           priority: "HIGH",
           status: "PENDING",
           assignedTo: "Anas",
           createdAt: new Date().toISOString()
        },
        {
           id: "na_02",
           prospectId: "p_03",
           type: "FOLLOW_UP",
           title: "Follow up with Michael",
           description: "Overdue follow up",
           channel: "EMAIL",
           dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
           priority: "HIGH",
           status: "PENDING",
           assignedTo: "Anas",
           createdAt: new Date().toISOString()
        }
     ];
  });

  const [activities, setActivities] = useState<OutreachActivity[]>(() => {
     return [
        {
           id: "act_01",
           prospectId: "p_01",
           type: "INITIAL_OUTREACH",
           channel: "INSTAGRAM",
           direction: "OUTBOUND",
           summary: "Sent initial introductory DM",
           performedBy: "Anas",
           occurredAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
           createdAt: new Date().toISOString()
        },
        {
           id: "act_02",
           prospectId: "p_01",
           type: "REPLY_RECEIVED",
           channel: "INSTAGRAM",
           direction: "INBOUND",
           outcome: "INTERESTED",
           sentiment: "POSITIVE",
           summary: "John replied: Sounds interesting, tell me more",
           performedBy: "John Smith",
           occurredAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
           createdAt: new Date().toISOString()
        }
     ];
  });

  const addProspect = (p: Omit<Prospect, "id" | "createdAt" | "updatedAt">) => {
     const newP: Prospect = {
        ...p,
        id: `p_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
     };
     setProspects(prev => [newP, ...prev]);
  };

  const updateProspect = (id: string, updates: Partial<Prospect>) => {
     setProspects(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
  };

  const deleteProspect = (id: string) => {
     setProspects(prev => prev.filter(p => p.id !== id));
  };

  const logActivity = (activity: Omit<OutreachActivity, "id" | "createdAt">, updateProspectStatus = true) => {
     const act: OutreachActivity = {
        ...activity,
        id: `act_${Date.now()}`,
        createdAt: new Date().toISOString()
     };
     setActivities(prev => [act, ...prev]);

     if (updateProspectStatus) {
        setProspects(prev => prev.map(p => {
           if (p.id === activity.prospectId) {
              let nextStatus = p.status;
              let nextLastContact = p.lastContactedAt;
              let nextLastReply = p.lastReplyAt;
              let nextFollowUpCount = p.followUpCount;
              
              if (activity.type === "INITIAL_OUTREACH") {
                 nextStatus = "CONTACTED";
                 nextLastContact = activity.occurredAt;
              } else if (activity.type === "FOLLOW_UP") {
                 nextStatus = "FOLLOW_UP";
                 nextLastContact = activity.occurredAt;
                 nextFollowUpCount += 1;
              } else if (activity.type === "REPLY_RECEIVED") {
                 nextStatus = "REPLIED";
                 nextLastReply = activity.occurredAt;
                 if (activity.outcome === "INTERESTED") nextStatus = "INTERESTED";
              }

              return {
                 ...p,
                 lastActivityAt: activity.occurredAt,
                 lastContactedAt: nextLastContact,
                 lastReplyAt: nextLastReply,
                 followUpCount: nextFollowUpCount,
                 status: nextStatus as any,
                 updatedAt: new Date().toISOString() 
              };
           }
           return p;
        }));
     }
  };

  const createNextAction = (action: Omit<NextAction, "id" | "createdAt">) => {
     const act: NextAction = {
        ...action,
        id: `na_${Date.now()}`,
        createdAt: new Date().toISOString()
     };
     setNextActions(prev => [act, ...prev]);
  };

  const updateNextAction = (id: string, updates: Partial<NextAction>) => {
     setNextActions(prev => prev.map(na => na.id === id ? { ...na, ...updates } : na));
  };

  const ctx: OutreachOSState = {
    prospects,
    nextActions,
    activities,
    addProspect,
    updateProspect,
    deleteProspect,
    logActivity,
    createNextAction,
    updateNextAction
  };

  return <OutreachOSContext.Provider value={ctx}>{children}</OutreachOSContext.Provider>;
}

export function useOutreachOS() {
  const ctx = useContext(OutreachOSContext);
  if (!ctx) throw new Error("useOutreachOS must be within OutreachOSProvider");
  return ctx;
}
