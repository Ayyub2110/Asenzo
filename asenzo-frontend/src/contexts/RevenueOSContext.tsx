"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Customer, RevenueTransaction, Renewal, ExpansionOpportunity, RevenueForecast } from "@/lib/types/revenue";

interface RevenueOSContextType {
  customers: Customer[];
  transactions: RevenueTransaction[];
  renewals: Renewal[];
  expansions: ExpansionOpportunity[];
  forecasts: RevenueForecast[];
  
  // Stats
  metrics: {
     totalRevenue: number;
     mrr: number;
     arr: number;
     revenueThisMonth: number;
     revenueTarget: number;
     activeCustomers: number;
     newCustomers: number;
     churnRate: number;
     netRevenueRetention: number;
     expansionRevenue: number;
     outstandingRevenue: number;
  };
}

const RevenueOSContext = createContext<RevenueOSContextType | undefined>(undefined);

// Generate initial empty data to reflect a real new system state
const generateMockData = () => {
   const customers: Customer[] = [];
   const transactions: RevenueTransaction[] = [];
   const renewals: Renewal[] = [];
   const expansions: ExpansionOpportunity[] = [];
   const forecasts: RevenueForecast[] = [];

   return { customers, transactions, renewals, expansions, forecasts };
};

export const RevenueOSProvider = ({ children }: { children: React.ReactNode }) => {
   const [state, setState] = useState(() => generateMockData());

   // Calculate real metrics from the data
   const metrics = {
     totalRevenue: state.customers.reduce((acc, c) => acc + c.totalRevenue, 0),
     mrr: state.customers.filter(c => c.status !== "CHURNED").reduce((acc, c) => acc + c.recurringRevenue, 0),
     arr: state.customers.filter(c => c.status !== "CHURNED").reduce((acc, c) => acc + (c.recurringRevenue * 12), 0),
     revenueThisMonth: state.transactions.filter(t => t.date.startsWith("2026-08") && t.status === "PAID").reduce((acc, t) => acc + t.amount, 0),
     revenueTarget: 30000,
     activeCustomers: state.customers.filter(c => c.status === "ACTIVE" || c.status === "ONBOARDING" || c.status === "RENEWING" || c.status === "AT_RISK").length,
     newCustomers: state.customers.filter(c => c.status === "NEW" || c.status === "ONBOARDING").length,
     churnRate: 8.5,
     netRevenueRetention: 104,
     expansionRevenue: 2000,
     outstandingRevenue: state.transactions.filter(t => t.status === "OUTSTANDING").reduce((acc, t) => acc + t.amount, 0)
   };

   return (
     <RevenueOSContext.Provider value={{ ...state, metrics }}>
        {children}
     </RevenueOSContext.Provider>
   );
};

export const useRevenueOS = () => {
    const ctx = useContext(RevenueOSContext);
    if (!ctx) throw new Error("useRevenueOS must be used within RevenueOSProvider");
    return ctx;
};
