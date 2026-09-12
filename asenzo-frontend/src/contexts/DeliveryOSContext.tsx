"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { 
    DeliveryClient, Engagement, Onboarding, Milestone, 
    Deliverable, CommunicationRecord, DeliveryHealthRecord, 
    DeliveryReport, ProofRecord 
} from "@/lib/types";
import { getOrGenerateDemoData } from "@/lib/mock/seedData";

interface DeliveryOSContextType {
    clients: DeliveryClient[];
    engagements: Engagement[];
    onboardings: Onboarding[];
    milestones: Milestone[];
    deliverables: Deliverable[];
    communications: CommunicationRecord[];
    healthRecords: DeliveryHealthRecord[];
    reports: DeliveryReport[];
    proofs: ProofRecord[];

    // Metrics for Command Center
    metrics: {
        activeClients: number;
        activeEngagements: number;
        onboardingInProgress: number;
        onboardingBlocked: number;
        milestonesDue: number;
        overdueMilestones: number;
        deliverablesDue: number;
        overdueDeliverables: number;
        atRiskClients: number;
        upcomingRenewals: number;
        completedEngagements: number;
        onTimeDeliveryRate: number;
        milestoneCompletionRate: number;
        deliverableCompletionRate: number;
    };

    dateRange: "Today" | "This Week" | "This Month" | "This Quarter" | "This Year" | "All Time";
    setDateRange: (range: "Today" | "This Week" | "This Month" | "This Quarter" | "This Year" | "All Time") => void;
    filterByDate: (dateString: string) => boolean;

    // CRUD
    createClient: (data: Omit<DeliveryClient, 'startDate'>) => void;
    updateClient: (id: string, data: Partial<DeliveryClient>) => void;
    deleteClient: (id: string) => void;

    createEngagement: (data: Omit<Engagement, 'id'>) => void;
    updateEngagement: (id: string, data: Partial<Engagement>) => void;

    createOnboarding: (data: Omit<Onboarding, 'id'>) => void;
    updateOnboarding: (id: string, data: Partial<Onboarding>) => void;

    createMilestone: (data: Omit<Milestone, 'id'>) => void;
    updateMilestone: (id: string, data: Partial<Milestone>) => void;

    createDeliverable: (data: Omit<Deliverable, 'id'>) => void;
    updateDeliverable: (id: string, data: Partial<Deliverable>) => void;

    createCommunication: (data: Omit<CommunicationRecord, 'id' | 'createdAt'>) => void;
    updateCommunication: (id: string, data: Partial<CommunicationRecord>) => void;

    createHealthRecord: (data: Omit<DeliveryHealthRecord, 'id' | 'createdDate' | 'updatedDate'>) => void;
    updateHealthRecord: (id: string, data: Partial<DeliveryHealthRecord>) => void;

    createReport: (data: Omit<DeliveryReport, 'id'>) => void;
    updateReport: (id: string, data: Partial<DeliveryReport>) => void;

    createProof: (data: Omit<ProofRecord, 'id'>) => void;
    updateProof: (id: string, data: Partial<ProofRecord>) => void;
}

const DeliveryOSContext = createContext<DeliveryOSContextType | undefined>(undefined);

export function DeliveryOSProvider({ children }: { children: ReactNode }) {
    // We lazy-load state from seed data if available
    const [state, setState] = useState<{
        clients: DeliveryClient[];
        engagements: Engagement[];
        onboardings: Onboarding[];
        milestones: Milestone[];
        deliverables: Deliverable[];
        communications: CommunicationRecord[];
        healthRecords: DeliveryHealthRecord[];
        reports: DeliveryReport[];
        proofs: ProofRecord[];
    }>(() => {
        const demo = getOrGenerateDemoData();
        return {
            clients: demo.deliveryClients || [],
            engagements: demo.deliveryEngagements || [],
            onboardings: demo.deliveryOnboardings || [],
            milestones: demo.deliveryMilestones || [],
            deliverables: demo.deliveryDeliverables || [],
            communications: demo.deliveryCommunications || [],
            healthRecords: demo.deliveryHealthRecords || [],
            reports: demo.deliveryReports || [],
            proofs: demo.deliveryProofs || [],
        };
    });

    const [dateRange, setDateRange] = useState<"Today" | "This Week" | "This Month" | "This Quarter" | "This Year" | "All Time">("This Month");

    const filterByDate = (dateString: string) => {
        if (!dateString) return false;
        if (dateRange === "All Time") return true;
        const date = new Date(dateString);
        const now = new Date();
        if (dateRange === "Today") {
            return date.toDateString() === now.toDateString();
        }
        if (dateRange === "This Week") {
            const firstDay = new Date(now.setDate(now.getDate() - now.getDay()));
            return date >= firstDay && date <= new Date();
        }
        if (dateRange === "This Month") {
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }
        if (dateRange === "This Quarter") {
            const currentQuarter = Math.floor(now.getMonth() / 3);
            const dateQuarter = Math.floor(date.getMonth() / 3);
            return dateQuarter === currentQuarter && date.getFullYear() === now.getFullYear();
        }
        if (dateRange === "This Year") {
            return date.getFullYear() === now.getFullYear();
        }
        return true;
    };

    // --- Actions (CRUD) --- 
    const update = (key: keyof typeof state, item: any) => {
        setState(prev => ({ ...prev, [key]: [item, ...(prev as any)[key]] }));
    };
    const edit = (key: keyof typeof state, id: string, data: any) => {
        setState(prev => ({
            ...prev,
            [key]: ((prev as any)[key] as any[]).map(i => i.id === id ? { ...i, ...data } : i)
        }));
    };

    const ctx: DeliveryOSContextType = {
        clients: state.clients,
        engagements: state.engagements,
        onboardings: state.onboardings,
        milestones: state.milestones,
        deliverables: state.deliverables,
        communications: state.communications,
        healthRecords: state.healthRecords,
        reports: state.reports,
        proofs: state.proofs,

        metrics: {
            activeClients: state.clients.filter((c: DeliveryClient) => c.status === "ACTIVE").length,
            activeEngagements: state.engagements.filter((e: Engagement) => e.status === "ACTIVE").length,
            onboardingInProgress: state.onboardings.filter((o: Onboarding) => o.status === "IN_PROGRESS").length,
            onboardingBlocked: state.onboardings.filter((o: Onboarding) => o.status === "BLOCKED").length,
            milestonesDue: state.milestones.filter((m: Milestone) => m.status === "IN_PROGRESS").length,
            overdueMilestones: state.milestones.filter((m: Milestone) => m.status === "IN_PROGRESS" && new Date(m.dueDate) < new Date()).length,
            deliverablesDue: state.deliverables.filter((d: Deliverable) => !['DELIVERED', 'COMPLETED', 'CANCELLED'].includes(d.status)).length,
            overdueDeliverables: state.deliverables.filter((d: Deliverable) => !['DELIVERED', 'COMPLETED', 'CANCELLED'].includes(d.status) && new Date(d.dueDate) < new Date()).length,
            atRiskClients: state.clients.filter((c: DeliveryClient) => c.health === "AT_RISK" || c.health === "CRITICAL").length,
            upcomingRenewals: 0, // calculate appropriately from revenue link if needed or engagement
            completedEngagements: state.engagements.filter((e: Engagement) => e.status === "COMPLETED").length,
            onTimeDeliveryRate: 85, // Stub for derived calc
            milestoneCompletionRate: Math.round((state.milestones.filter((m: Milestone) => m.status === "COMPLETED").length / Math.max(state.milestones.length, 1)) * 100),
            deliverableCompletionRate: Math.round((state.deliverables.filter((m: Deliverable) => m.status === "DELIVERED").length / Math.max(state.deliverables.length, 1)) * 100),
        },

        dateRange,
        setDateRange,
        filterByDate,

        createClient: (d) => update('clients', { ...d, startDate: new Date().toISOString() }),
        updateClient: (id, d) => edit('clients', id, d),
        deleteClient: (id) => edit('clients', id, { status: "CHURNED" }),

        createEngagement: (d) => update('engagements', { ...d, id: `eng_${Date.now()}` }),
        updateEngagement: (id, d) => edit('engagements', id, d),

        createOnboarding: (d) => update('onboardings', { ...d, id: `onb_${Date.now()}` }),
        updateOnboarding: (id, d) => edit('onboardings', id, d),

        createMilestone: (d) => update('milestones', { ...d, id: `mil_${Date.now()}` }),
        updateMilestone: (id, d) => edit('milestones', id, d),

        createDeliverable: (d) => update('deliverables', { ...d, id: `del_${Date.now()}` }),
        updateDeliverable: (id, d) => edit('deliverables', id, d),

        createCommunication: (d) => update('communications', { ...d, id: `com_${Date.now()}`, createdAt: new Date().toISOString() }),
        updateCommunication: (id, d) => edit('communications', id, d),

        createHealthRecord: (d) => update('healthRecords', { ...d, id: `hlth_${Date.now()}`, createdDate: new Date().toISOString(), updatedDate: new Date().toISOString() }),
        updateHealthRecord: (id, d) => edit('healthRecords', id, { ...d, updatedDate: new Date().toISOString() }),

        createReport: (d) => update('reports', { ...d, id: `rep_${Date.now()}` }),
        updateReport: (id, d) => edit('reports', id, d),

        createProof: (d) => update('proofs', { ...d, id: `prf_${Date.now()}` }),
        updateProof: (id, d) => edit('proofs', id, d),
    };

    return <DeliveryOSContext.Provider value={ctx}>{children}</DeliveryOSContext.Provider>;
}

export function useDeliveryOS() {
    const context = useContext(DeliveryOSContext);
    if (context === undefined) {
        throw new Error("useDeliveryOS must be used within a DeliveryOSProvider");
    }
    return context;
}
