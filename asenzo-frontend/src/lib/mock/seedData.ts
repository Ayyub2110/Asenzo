import { Lead, Opportunity, SalesCall, QualificationStatus, PipelineStage } from "@/lib/types/conversion";
import { Customer, RevenueTransaction, Renewal, ExpansionOpportunity } from "@/lib/types/revenue";
import { DeliveryClient, Engagement, Milestone, Deliverable, Onboarding, CommunicationRecord, DeliveryHealthRecord, DeliveryReport, ProofRecord } from "@/lib/types/delivery";

const NAMES = ["Sarah Jenkins", "David Miller", "Emily Chen", "Michael Ross", "Jessica Wong", "Daniel Carter", "Amanda Smith", "James Wilson", "Olivia Davis", "Robert Taylor", "Sophia Anderson", "William Thomas", "Isabella Jackson", "Joseph White", "Mia Harris", "Charles Martin", "Charlotte Thompson", "Matthew Garcia", "Amelia Martinez", "Anthony Robinson", "Harper Clark", "Donald Rodriguez", "Evelyn Lewis", "Paul Lee"];
const COMPANIES = ["CloudScale", "GrowthPoint", "TechNova", "Apex Solutions", "BluePeak", "Vertex Dynamics", "NextGen", "Elevate Partners", "Pioneer Systems", "Quantum Digital"];
const SOURCES = ["Instagram", "YouTube", "LinkedIn", "X", "Referral", "Outbound", "Organic"];
const OFFERS = ["ASENZO Growth OS Implementation", "ASENZO Revenue Consulting", "Acquisition OS Build"];

const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to create a date N days ago
const daysAgo = (days: number): string => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString();
};

// Helper to create a date N days in the future
const daysFromNow = (days: number): string => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString();
};

// Current month date (within the last X days but same month)
const thisMonthDate = (daysBack: number = 3): string => {
    const d = new Date();
    // Ensure we stay in current month
    const dayToUse = Math.min(daysBack, d.getDate() - 1);
    d.setDate(d.getDate() - Math.max(0, dayToUse));
    return d.toISOString();
};

export const generateDemoData = () => {
    const conversionLeads: (Lead & { isDemo?: boolean })[] = [];
    const conversionOpps: (Opportunity & { isDemo?: boolean })[] = [];
    const conversionCalls: (SalesCall & { isDemo?: boolean })[] = [];

    const revenueCustomers: (Customer & { isDemo?: boolean })[] = [];
    const revenueTransactions: (RevenueTransaction & { isDemo?: boolean })[] = [];
    const revenueRenewals: (Renewal & { isDemo?: boolean })[] = [];
    const revenueExpansions: (ExpansionOpportunity & { isDemo?: boolean })[] = [];

    const deliveryClients: DeliveryClient[] = [];
    const deliveryEngagements: Engagement[] = [];
    const deliveryOnboardings: Onboarding[] = [];
    const deliveryMilestones: Milestone[] = [];
    const deliveryDeliverables: Deliverable[] = [];
    const deliveryCommunications: CommunicationRecord[] = [];
    const deliveryHealthRecords: DeliveryHealthRecord[] = [];
    const deliveryReports: DeliveryReport[] = [];
    const deliveryProofs: ProofRecord[] = [];

    // ============================================================
    // HISTORICAL DATA (Previous 2-3 months)
    // ============================================================

    const historicalLeadData = [
        { name: "Sarah Jenkins", company: "CloudScale", source: "Instagram", won: true, callShowed: true, daysAgo: 75, value: 8500 },
        { name: "David Miller", company: "GrowthPoint", source: "YouTube", won: true, callShowed: true, daysAgo: 70, value: 12000 },
        { name: "Emily Chen", company: "TechNova", source: "LinkedIn", won: true, callShowed: true, daysAgo: 65, value: 6500 },
        { name: "Michael Ross", company: "Apex Solutions", source: "Referral", won: true, callShowed: true, daysAgo: 60, value: 9800 },
        { name: "Jessica Wong", company: "BluePeak", source: "Instagram", won: true, callShowed: true, daysAgo: 55, value: 5500 },
        { name: "Daniel Carter", company: "Vertex Dynamics", source: "Outbound", won: false, callShowed: true, daysAgo: 50, value: 7000 },
        { name: "Amanda Smith", company: "NextGen", source: "Organic", won: false, callShowed: true, daysAgo: 48, value: 4500 },
        { name: "James Wilson", company: "Elevate Partners", source: "LinkedIn", won: true, callShowed: true, daysAgo: 45, value: 11000 },
        { name: "Olivia Davis", company: "Pioneer Systems", source: "Referral", won: false, callShowed: false, daysAgo: 42, value: 6000 },
        { name: "Robert Taylor", company: "Quantum Digital", source: "YouTube", won: false, callShowed: true, daysAgo: 40, value: 8000 },
        { name: "Sophia Anderson", company: "CloudScale 2", source: "Instagram", won: false, callShowed: false, daysAgo: 35, value: 5000 },
        { name: "William Thomas", company: "GrowthPoint 2", source: "X", won: false, callShowed: false, daysAgo: 32, value: 3500 },
    ];

    historicalLeadData.forEach((ld, i) => {
        const leadId = `demo_l_hist_${i}`;
        const oppId = `demo_o_hist_${i}`;
        const callId = `demo_c_hist_${i}`;
        const cusId = `demo_cus_hist_${i}`;
        const txId = `demo_tx_hist_${i}`;
        const created = daysAgo(ld.daysAgo);

        const lead: Lead & { isDemo?: boolean } = {
            id: leadId,
            name: ld.name,
            email: `${ld.name.toLowerCase().replace(" ", ".")}@${ld.company.toLowerCase().replace(" ", "")}.com`,
            company: ld.company,
            role: "Founder",
            phone: `+44 7700 9001${i.toString().padStart(2, '0')}`,
            originalSource: ld.source,
            originalKeyword: "SCALE",
            originalContent: "Organic Inbound",
            originalFunnel: "TOF",
            lastTouch: created,
            temperature: ld.won ? "HOT" : (ld.callShowed ? "WARM" : "COLD"),
            qualificationStatus: "QUALIFIED",
            problem: "Need more predictable pipeline",
            desiredOutcome: "Scale to $100k/mo",
            buyingTrigger: "Missed revenue target",
            objections: [],
            offerInterest: getRandom(OFFERS),
            ownerAction: "Founder",
            nextAction: ld.won ? "Onboard" : "Follow up",
            createdAt: created,
            updatedAt: daysAgo(ld.daysAgo - 2),
            isDemo: true
        };
        conversionLeads.push(lead);

        const stage: PipelineStage = ld.won ? "WON" : (ld.callShowed ? "OFFER_PRESENTED" : "CALL_BOOKED");
        const opp: Opportunity & { isDemo?: boolean } = {
            id: oppId,
            leadId,
            offerId: `offer_${getRandomInt(1, 3)}`,
            pipelineStage: stage,
            estimatedValue: ld.value,
            probability: ld.won ? 100 : (ld.callShowed ? getRandomInt(30, 60) : 20),
            expectedCloseDate: daysAgo(ld.daysAgo - 10),
            problem: lead.problem,
            desiredOutcome: lead.desiredOutcome,
            qualificationNote: "Strong historical lead.",
            buyingTrigger: lead.buyingTrigger,
            objections: [],
            followUpState: "COMPLETED",
            owner: "Demo Account",
            nextAction: "Advance",
            createdAt: created,
            updatedAt: daysAgo(ld.daysAgo - 2),
            isDemo: true
        };
        conversionOpps.push(opp);

        const callStatus = ld.callShowed ? "SHOWED" : "NO_SHOW";
        conversionCalls.push({
            id: callId,
            opportunityId: oppId,
            scheduledDate: daysAgo(ld.daysAgo - 3),
            status: callStatus,
            situation: "Discovery call",
            problem: "Stuck in operations",
            impact: "Costing 20 hours a week",
            desiredOutcome: "Automated pipeline",
            previousAttempts: "Tried Upwork",
            beliefs: "Needs strategic help",
            buyingTrigger: "Pain hit limit",
            objections: "Pricing",
            fit: "High",
            isDemo: true
        });

        if (ld.won) {
            const recurringRev = Math.random() > 0.4 ? getRandomInt(1000, 3000) : 0;
            const customer: Customer & { isDemo?: boolean } = {
                id: cusId,
                leadId,
                opportunityId: oppId,
                name: ld.name,
                company: ld.company,
                email: lead.email,
                source: ld.source,
                originalContent: "Organic Inbound",
                offerPurchased: lead.offerInterest || OFFERS[0],
                purchaseDate: daysAgo(ld.daysAgo - 5),
                contractStartDate: daysAgo(ld.daysAgo - 5),
                totalRevenue: ld.value,
                recurringRevenue: recurringRev,
                status: getRandom(["ACTIVE", "ONBOARDING", "RENEWING"]),
                health: getRandom(["HEALTHY", "STABLE", "AT_RISK"]),
                healthReasoning: "Performing well. Weekly check-in completed.",
                accountOwner: "Demo User",
                createdAt: created,
                updatedAt: daysAgo(ld.daysAgo - 2),
                isDemo: true
            };
            revenueCustomers.push(customer);

            // Historical PAID transaction
            revenueTransactions.push({
                id: txId,
                customerId: cusId,
                amount: ld.value,
                status: "PAID",
                type: recurringRev > 0 ? "RECURRING" : "ONE_TIME",
                date: daysAgo(ld.daysAgo - 5),
                offerName: customer.offerPurchased,
                invoiceId: `INV-HIST-${i}`,
                isDemo: true
            });

            // Delivery Generation
            deliveryClients.push({
                id: cusId,
                primaryContact: ld.name,
                company: ld.company,
                email: lead.email,
                owner: "Demo User",
                status: "ACTIVE",
                health: "HEALTHY",
                startDate: customer.purchaseDate,
                currentOffer: customer.offerPurchased,
                renewalDate: daysFromNow(45),
                portalStatus: "ACTIVE",
                isDemo: true
            });

            deliveryEngagements.push({
                id: `eng_hist_${i}`,
                customerId: cusId,
                offer: customer.offerPurchased,
                name: `${customer.offerPurchased} Implementation`,
                description: "Historical successful delivery.",
                startDate: customer.purchaseDate,
                endDate: daysAgo(10),
                owner: "Team Lead",
                team: ["Strategist", "Operator"],
                status: "COMPLETED",
                scope: "Full rollout.",
                successCriteria: "Handover generated.",
                budget: ld.value,
                renewalDate: daysFromNow(45),
                notes: "",
                progress: 100,
                isDemo: true
            });

            deliveryOnboardings.push({
                id: `onb_hist_${i}`,
                customerId: cusId,
                engagementId: `eng_hist_${i}`,
                offer: customer.offerPurchased,
                owner: "Onboarding Spec.",
                startDate: customer.purchaseDate,
                targetCompletionDate: daysAgo(ld.daysAgo - 10),
                status: "COMPLETED",
                progress: 100,
                kickoffDate: daysAgo(ld.daysAgo - 7),
                firstValueDate: daysAgo(ld.daysAgo - 14),
                blockers: "",
                notes: "Went well.",
                steps: [],
                isDemo: true
            });

            deliveryMilestones.push({
                id: `mil_hist_${i}`,
                engagementId: `eng_hist_${i}`,
                name: "Final Handover",
                description: "Completed project transfer.",
                owner: "Strategist",
                startDate: daysAgo(ld.daysAgo - 20),
                dueDate: daysAgo(15),
                status: "COMPLETED",
                progress: 100,
                dependencies: [],
                notes: "",
                isDemo: true
            });

            deliveryDeliverables.push({
                id: `del_hist_${i}`,
                engagementId: `eng_hist_${i}`,
                milestoneId: `mil_hist_${i}`,
                name: "OS Architecture Blueprint",
                type: "Documentation",
                description: "Full guide delivered.",
                owner: "Consultant",
                dueDate: daysAgo(20),
                status: "DELIVERED",
                version: 1,
                visibility: "CLIENT_VISIBLE",
                deliveredDate: daysAgo(21),
                notes: "",
                isDemo: true
            });
        }
    });

    // ============================================================
    // CURRENT MONTH DATA (Last 1-20 days — shows in "This Month")
    // ============================================================

    const currentMonthLeads = [
        { name: "Isabella Jackson", company: "BluePeak 3", source: "Instagram", won: true, showed: true, daysBack: 15, value: 7500 },
        { name: "Joseph White", company: "TechNova 2", source: "LinkedIn", won: true, showed: true, daysBack: 10, value: 5000 },
        { name: "Mia Harris", company: "NextGen 2", source: "Referral", won: false, showed: true, daysBack: 8, value: 6000 },
        { name: "Charles Martin", company: "Apex 2", source: "YouTube", won: false, showed: false, daysBack: 5, value: 4000 },
        { name: "Charlotte Thompson", company: "GrowthPoint 3", source: "Outbound", won: false, showed: false, daysBack: 2, value: 5500 },
    ];

    currentMonthLeads.forEach((ld, i) => {
        const leadId = `demo_l_curr_${i}`;
        const oppId = `demo_o_curr_${i}`;
        const cusId = `demo_cus_curr_${i}`;
        const created = thisMonthDate(ld.daysBack + 5);

        const lead: Lead & { isDemo?: boolean } = {
            id: leadId,
            name: ld.name,
            email: `${ld.name.toLowerCase().replace(" ", ".")}@${ld.company.toLowerCase().replace(" ", "")}.com`,
            company: ld.company,
            role: "Founder",
            phone: `+44 7700 9002${i.toString().padStart(2, '0')}`,
            originalSource: ld.source,
            originalKeyword: "GROW",
            originalContent: "Paid Ad",
            originalFunnel: "MOF",
            lastTouch: thisMonthDate(ld.daysBack),
            temperature: ld.won ? "HOT" : (ld.showed ? "WARM" : "COLD"),
            qualificationStatus: "QUALIFIED",
            problem: "Revenue unpredictable",
            desiredOutcome: "Consistent £50k months",
            buyingTrigger: "Q4 pressure",
            objections: [],
            offerInterest: getRandom(OFFERS),
            ownerAction: "Founder",
            nextAction: ld.won ? "Onboard" : "Send proposal",
            createdAt: created,
            updatedAt: thisMonthDate(ld.daysBack),
            isDemo: true
        };
        conversionLeads.push(lead);

        const stage: PipelineStage = ld.won ? "WON" : (ld.showed ? "OFFER_PRESENTED" : "CALL_BOOKED");
        const opp: Opportunity & { isDemo?: boolean } = {
            id: oppId,
            leadId,
            offerId: `offer_curr_${i}`,
            pipelineStage: stage,
            estimatedValue: ld.value,
            probability: ld.won ? 100 : (ld.showed ? 55 : 20),
            expectedCloseDate: daysFromNow(14),
            problem: lead.problem,
            desiredOutcome: lead.desiredOutcome,
            qualificationNote: "Current month active deal.",
            buyingTrigger: lead.buyingTrigger,
            objections: [],
            followUpState: ld.showed ? "COMPLETED" : "UPCOMING",
            owner: "Demo Account",
            nextAction: "Follow up",
            createdAt: created,
            updatedAt: thisMonthDate(ld.daysBack),
            isDemo: true
        };
        conversionOpps.push(opp);

        // Current month calls — some SHOWED (completed), some SCHEDULED (upcoming)
        const callStatus = ld.showed ? "SHOWED" : "SCHEDULED";
        conversionCalls.push({
            id: `demo_c_curr_${i}`,
            opportunityId: oppId,
            scheduledDate: ld.showed ? thisMonthDate(ld.daysBack - 1) : daysFromNow(i + 2),
            status: callStatus,
            situation: "Current month discovery",
            problem: lead.problem,
            impact: "Losing £10k/mo",
            desiredOutcome: "Systemised growth",
            previousAttempts: "Hired freelancers",
            beliefs: "Ready to invest",
            buyingTrigger: "Q4 goal",
            objections: "Timing",
            fit: "High",
            isDemo: true
        });

        if (ld.won) {
            const recurringRev = Math.random() > 0.5 ? getRandomInt(1200, 2500) : 0;
            const customer: Customer & { isDemo?: boolean } = {
                id: cusId,
                leadId,
                opportunityId: oppId,
                name: ld.name,
                company: ld.company,
                email: lead.email,
                source: ld.source,
                originalContent: "Paid Ad",
                offerPurchased: lead.offerInterest || OFFERS[0],
                purchaseDate: thisMonthDate(ld.daysBack - 1),
                contractStartDate: thisMonthDate(ld.daysBack - 1),
                totalRevenue: ld.value,
                recurringRevenue: recurringRev,
                status: "NEW",
                health: "HEALTHY",
                healthReasoning: "Just onboarded this month.",
                accountOwner: "Demo User",
                createdAt: created,
                updatedAt: thisMonthDate(ld.daysBack),
                isDemo: true
            };
            revenueCustomers.push(customer);

            // Current month PAID transaction — shows in "This Month" filter
            revenueTransactions.push({
                id: `demo_tx_curr_${i}`,
                customerId: cusId,
                amount: ld.value,
                status: "PAID",
                type: recurringRev > 0 ? "RECURRING" : "ONE_TIME",
                date: thisMonthDate(ld.daysBack - 1),
                offerName: customer.offerPurchased,
                invoiceId: `INV-CURR-${i}`,
                isDemo: true
            });

            // Delivery Generation CURRENT
            deliveryClients.push({
                id: cusId,
                primaryContact: ld.name,
                company: ld.company,
                email: lead.email,
                owner: "Demo User",
                status: "ONBOARDING",
                health: "STABLE",
                startDate: customer.purchaseDate,
                currentOffer: customer.offerPurchased,
                renewalDate: daysFromNow(90),
                portalStatus: "ACTIVE",
                isDemo: true
            });

            deliveryEngagements.push({
                id: `eng_curr_${i}`,
                customerId: cusId,
                offer: customer.offerPurchased,
                name: `${customer.offerPurchased} Rollout`,
                description: "Current active project.",
                startDate: customer.purchaseDate,
                owner: "Manager",
                team: ["Strategist"],
                status: "ACTIVE",
                scope: "Initial phase.",
                successCriteria: "Live in 30 days.",
                budget: ld.value,
                renewalDate: daysFromNow(90),
                notes: "Just started.",
                progress: 20,
                isDemo: true
            });

            deliveryOnboardings.push({
                id: `onb_curr_${i}`,
                customerId: cusId,
                engagementId: `eng_curr_${i}`,
                offer: customer.offerPurchased,
                owner: "Onboarding Spec.",
                startDate: customer.purchaseDate,
                targetCompletionDate: daysFromNow(5),
                status: "IN_PROGRESS",
                progress: 40,
                blockers: "",
                notes: "Waiting on assets.",
                steps: [],
                isDemo: true
            });

            deliveryMilestones.push({
                id: `mil_curr_${i}`,
                engagementId: `eng_curr_${i}`,
                name: "Kickoff Phase",
                description: "Strategy and setup.",
                owner: "Strategist",
                startDate: thisMonthDate(1),
                dueDate: daysFromNow(7),
                status: "IN_PROGRESS",
                progress: 50,
                dependencies: [],
                notes: "",
                isDemo: true
            });

            deliveryDeliverables.push({
                id: `del_curr_${i}`,
                engagementId: `eng_curr_${i}`,
                milestoneId: `mil_curr_${i}`,
                name: "Discovery Audit",
                type: "Audit",
                description: "Mapping existing processes.",
                owner: "Analyst",
                dueDate: daysFromNow(2),
                status: "IN_PROGRESS",
                version: 1,
                visibility: "INTERNAL",
                notes: "",
                isDemo: true
            });
        }
    });

    // ============================================================
    // EXTRA UNQUALIFIED / PIPELINE LEADS
    // ============================================================
    for (let i = 0; i < 48; i++) {
        const source = getRandom(SOURCES);
        const qualStatus: QualificationStatus = Math.random() > 0.7 ? "QUALIFIED" : (Math.random() > 0.5 ? "QUALIFYING" : "UNQUALIFIED");
        conversionLeads.push({
            id: `demo_l_raw_${i}`,
            name: NAMES[i % NAMES.length] + ` ${i + 30}`,
            email: `lead${i + 30}@demo.com`,
            company: getRandom(COMPANIES) + ` ${i + 10}`,
            role: "Founder",
            phone: `+44 7700 9003${i.toString().padStart(2, '0')}`,
            originalSource: source,
            originalKeyword: "SCALE",
            originalContent: "Organic",
            originalFunnel: "TOF",
            lastTouch: daysAgo(getRandomInt(5, 90)),
            temperature: qualStatus === "QUALIFIED" ? "WARM" : "COLD",
            qualificationStatus: qualStatus,
            problem: "Need systems",
            desiredOutcome: "More revenue",
            buyingTrigger: "Growth stall",
            objections: [],
            offerInterest: getRandom(OFFERS),
            ownerAction: "Founder",
            nextAction: "Qualify",
            createdAt: daysAgo(getRandomInt(10, 90)),
            updatedAt: daysAgo(getRandomInt(1, 10)),
            isDemo: true
        });
    }

    // ============================================================
    // OUTSTANDING INVOICES (current month — shows in billing)
    // ============================================================
    if (revenueCustomers.length > 0) {
        [2800, 4200].forEach((amount, i) => {
            revenueTransactions.push({
                id: `demo_tx_outstanding_${i}`,
                customerId: revenueCustomers[i % revenueCustomers.length].id,
                amount,
                status: "OUTSTANDING",
                type: "ONE_TIME",
                date: thisMonthDate(2 + i),
                offerName: "Consulting Retainer",
                invoiceId: `INV-OUT-${i}`,
                isDemo: true
            });
        });
    }

    // ============================================================
    // RENEWALS (upcoming)
    // ============================================================
    if (revenueCustomers.length > 1) {
        revenueRenewals.push(
            {
                id: "demo_ren_1",
                customerId: revenueCustomers[0].id,
                renewalDate: daysFromNow(12),
                currentValue: 3000,
                status: "UPCOMING",
                riskLevel: "LOW",
                isDemo: true
            },
            {
                id: "demo_ren_2",
                customerId: revenueCustomers[1].id,
                renewalDate: daysFromNow(28),
                currentValue: 5500,
                status: "UPCOMING",
                riskLevel: "MEDIUM",
                isDemo: true
            },
            {
                id: "demo_ren_3",
                customerId: revenueCustomers[2]?.id || revenueCustomers[0].id,
                renewalDate: daysAgo(10),
                currentValue: 4000,
                status: "RENEWED",
                riskLevel: "LOW",
                isDemo: true
            }
        );
    }

    // ============================================================
    // EXPANSIONS
    // ============================================================
    if (revenueCustomers.length > 1) {
        revenueExpansions.push(
            {
                id: "demo_exp_1",
                customerId: revenueCustomers[0].id,
                potentialRevenue: 5000,
                type: "UPSELL",
                reason: "Ready for full OS implementation",
                status: "CLOSED_WON",
                isDemo: true
            },
            {
                id: "demo_exp_2",
                customerId: revenueCustomers[1].id,
                potentialRevenue: 3500,
                type: "CROSS_SELL",
                reason: "Acquisition OS add-on",
                status: "PITCHED",
                isDemo: true
            }
        );

        // Paid expansion transaction (historical)
        revenueTransactions.push({
            id: "demo_tx_exp_1",
            customerId: revenueCustomers[0].id,
            amount: 5000,
            status: "PAID",
            type: "ONE_TIME",
            date: daysAgo(20),
            offerName: "Expansion — Full OS Upsell",
            invoiceId: "INV-EXP-1",
            isDemo: true
        });
    }

    return {
        conversionLeads,
        conversionOpps,
        conversionCalls,
        revenueCustomers,
        revenueTransactions,
        revenueRenewals,
        revenueExpansions,
        deliveryClients,
        deliveryEngagements,
        deliveryOnboardings,
        deliveryMilestones,
        deliveryDeliverables,
        deliveryCommunications,
        deliveryHealthRecords,
        deliveryReports,
        deliveryProofs
    };
};

let cachedDemoData: ReturnType<typeof generateDemoData> | null = null;

export const getOrGenerateDemoData = () => {
    if (!cachedDemoData) {
        cachedDemoData = generateDemoData();
    }
    return cachedDemoData;
};

export const resetDemoDataCache = () => {
    cachedDemoData = null;
};
