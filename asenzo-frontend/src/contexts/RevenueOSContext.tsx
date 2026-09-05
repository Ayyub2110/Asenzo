"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Customer, RevenueTransaction, Renewal, ExpansionOpportunity, RevenueForecast } from "@/lib/types/revenue";
import { getOrGenerateDemoData } from "@/lib/mock/seedData";

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
  
  // Mutators
  createCustomer: (data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'purchaseDate'>) => Promise<void>;
  updateCustomer: (id: string, data: Partial<Customer>) => Promise<void>;
  createTransaction: (data: Omit<RevenueTransaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, data: Partial<RevenueTransaction>) => Promise<void>;
  createRenewal: (data: Omit<Renewal, 'id'>) => Promise<void>;
  updateRenewal: (id: string, data: Partial<Renewal>) => Promise<void>;
  createExpansion: (data: Omit<ExpansionOpportunity, 'id'>) => Promise<void>;
  updateExpansion: (id: string, data: Partial<ExpansionOpportunity>) => Promise<void>;
  createForecast: (data: RevenueForecast) => Promise<void>;
  updateForecast: (id: string, data: Partial<RevenueForecast>) => Promise<void>;

  // Date Filtering & Dashboards
  dateRange: "Today" | "This Week" | "This Month" | "This Quarter" | "This Year" | "All Time";
  setDateRange: (range: "Today" | "This Week" | "This Month" | "This Quarter" | "This Year" | "All Time") => void;

  calculateTotalCashCollected: () => number;
  calculateTotalRevenue: () => number;
  calculateCompletedOrders: () => number;
  calculateAverageOrderValue: () => number;

  seedDemoData: () => void;
  resetDemoData: () => void;

  filterByDate: (dateString: string) => boolean;
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
   const [state, setState] = useState(() => {
      const empty = generateMockData();
      const demo = getOrGenerateDemoData();
      return {
         ...empty,
         customers: demo.revenueCustomers,
         transactions: demo.revenueTransactions,
         renewals: demo.revenueRenewals,
         expansions: demo.revenueExpansions,
      };
   });

   const createCustomer = async (data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'purchaseDate'>) => {
      const newC: Customer = {
         ...data,
         id: `c_${Date.now()}`,
         createdAt: new Date().toISOString(),
         updatedAt: new Date().toISOString(),
         purchaseDate: new Date().toISOString(),
      };
      setState(prev => ({...prev, customers: [newC, ...prev.customers]}));
   };

   const updateCustomer = async (id: string, data: Partial<Customer>) => {
      setState(prev => ({
         ...prev,
         customers: prev.customers.map(c => c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c)
      }));
   };

   const createTransaction = async (data: Omit<RevenueTransaction, 'id'>) => {
      const newT: RevenueTransaction = {
         ...data,
         id: `tx_${Date.now()}`,
      };
      setState(prev => {
         // Auto-update customer total revenue if paid!
         let nextCustomers = [...prev.customers];
         if(newT.status === 'PAID') {
             nextCustomers = nextCustomers.map(c => c.id === newT.customerId ? { 
                ...c, 
                totalRevenue: c.totalRevenue + newT.amount,
                recurringRevenue: newT.type === 'RECURRING' ? c.recurringRevenue + newT.amount : c.recurringRevenue 
             } : c);
         }
         return {...prev, customers: nextCustomers, transactions: [newT, ...prev.transactions]};
      });
   };

   const updateTransaction = async (id: string, data: Partial<RevenueTransaction>) => {
      setState(prev => ({
         ...prev,
         transactions: prev.transactions.map(t => t.id === id ? { ...t, ...data } : t)
      }));
   };

   const createRenewal = async (data: Omit<Renewal, 'id'>) => {
      const item: Renewal = { ...data, id: `ren_${Date.now()}` };
      setState(prev => ({...prev, renewals: [item, ...prev.renewals]}));
   };

   const updateRenewal = async (id: string, data: Partial<Renewal>) => {
      setState(prev => ({
         ...prev,
         renewals: prev.renewals.map(r => r.id === id ? { ...r, ...data } : r)
      }));
   };

   const createExpansion = async (data: Omit<ExpansionOpportunity, 'id'>) => {
      const item: ExpansionOpportunity = { ...data, id: `exp_${Date.now()}` };
      setState(prev => ({...prev, expansions: [item, ...prev.expansions]}));
   };

   const updateExpansion = async (id: string, data: Partial<ExpansionOpportunity>) => {
      setState(prev => ({
         ...prev,
         expansions: prev.expansions.map(ex => ex.id === id ? { ...ex, ...data } : ex)
      }));
   };

   const createForecast = async (data: RevenueForecast) => {
      const item = { ...data, id: `fc_${Date.now()}` };
      setState(prev => ({...prev, forecasts: [item, ...prev.forecasts]}));
   };

   const updateForecast = async (id: string, data: Partial<RevenueForecast>) => {
      setState(prev => ({
         ...prev,
         forecasts: prev.forecasts.map(f => f.id === id ? { ...f, ...data } : f)
      }));
   };

   const seedDemoData = () => {
      const demo = getOrGenerateDemoData();
      setState(prev => ({
         ...prev,
         customers: [...prev.customers.filter(x => !(x as any).isDemo), ...demo.revenueCustomers],
         transactions: [...prev.transactions.filter(x => !(x as any).isDemo), ...demo.revenueTransactions],
         renewals: [...prev.renewals.filter(x => !(x as any).isDemo), ...demo.revenueRenewals],
         expansions: [...prev.expansions.filter(x => !(x as any).isDemo), ...demo.revenueExpansions]
      }));
   };

   const resetDemoData = () => {
      setState(prev => ({
         ...prev,
         customers: prev.customers.filter(x => !(x as any).isDemo),
         transactions: prev.transactions.filter(x => !(x as any).isDemo),
         renewals: prev.renewals.filter(x => !(x as any).isDemo),
         expansions: prev.expansions.filter(x => !(x as any).isDemo)
      }));
   };

   // Shared Date Filtering
   const [dateRange, setDateRange] = useState<"Today" | "This Week" | "This Month" | "This Quarter" | "This Year" | "All Time">("This Month");

   const filterByDate = (dateString: string) => {
     if (dateRange === "All Time") return true;
     const date = new Date(dateString);
     const now = new Date();
     if (dateRange === "Today") {
       return date.toDateString() === now.toDateString();
     }
     if (dateRange === "This Week") {
       const firstDay = new Date(now.setDate(now.getDate() - now.getDay()));
       return date >= firstDay;
     }
     if (dateRange === "This Month") {
       return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
     }
     if (dateRange === "This Quarter") {
       const q = Math.floor(now.getMonth() / 3);
       return Math.floor(date.getMonth() / 3) === q && date.getFullYear() === now.getFullYear();
     }
     if (dateRange === "This Year") {
       return date.getFullYear() === now.getFullYear();
     }
     return true;
   };

   // Centralized Financial KPIs
   const calculateTotalCashCollected = () => {
      // Sum(PAID) - Sum(REFUNDED)  [in case refunds are recorded as positive amounts with status REFUNDED]
      const paid = state.transactions.filter(t => filterByDate(t.date) && t.status === "PAID").reduce((acc, t) => acc + t.amount, 0);
      const refunded = state.transactions.filter(t => filterByDate(t.date) && t.status === "REFUNDED").reduce((acc, t) => acc + t.amount, 0);
      return Math.max(0, paid - refunded);
   };

   const calculateTotalRevenue = () => {
      // Booked Revenue = PAID + OUTSTANDING (exclude failed/refunded/pending)
      return state.transactions
         .filter(t => filterByDate(t.date) && (t.status === "PAID" || t.status === "OUTSTANDING"))
         .reduce((acc, t) => acc + t.amount, 0);
   };

   const calculateCompletedOrders = () => {
      return state.transactions.filter(t => filterByDate(t.date) && (t.status === "PAID" || t.status === "OUTSTANDING")).length;
   };

   const calculateAverageOrderValue = () => {
      const revenue = calculateTotalRevenue();
      const orders = calculateCompletedOrders();
      if (orders === 0) return 0;
      return revenue / orders;
   };

   // Calculate real metrics from the data
   const metrics = {
     totalRevenue: state.customers.reduce((acc, c) => acc + c.totalRevenue, 0),
     mrr: state.customers.filter(c => c.status !== "CHURNED").reduce((acc, c) => acc + c.recurringRevenue, 0),
     arr: state.customers.filter(c => c.status !== "CHURNED").reduce((acc, c) => acc + (c.recurringRevenue * 12), 0),
     revenueThisMonth: state.transactions.filter(t => t.status === "PAID").reduce((acc, t) => acc + t.amount, 0),
     revenueTarget: 30000,
     activeCustomers: state.customers.filter(c => c.status === "ACTIVE" || c.status === "ONBOARDING" || c.status === "RENEWING" || c.status === "AT_RISK").length,
     newCustomers: state.customers.filter(c => c.status === "NEW" || c.status === "ONBOARDING").length,
     churnRate: state.customers.length ? Math.round((state.customers.filter(c => c.status === "CHURNED").length / state.customers.length)*100) : 0,
     netRevenueRetention: 104,
     expansionRevenue: state.expansions.filter(e => e.status === "CLOSED_WON").reduce((acc, e) => acc + e.potentialRevenue, 0),
     outstandingRevenue: state.transactions.filter(t => t.status === "OUTSTANDING").reduce((acc, t) => acc + t.amount, 0)
   };

   return (
      <RevenueOSContext.Provider value={{ 
        ...state, 
        metrics, 
        createCustomer, 
        updateCustomer, 
        createTransaction, 
        updateTransaction, 
        createRenewal, 
        updateRenewal, 
        createExpansion, 
        updateExpansion,
        createForecast,
        updateForecast,
        dateRange, setDateRange,
        calculateTotalCashCollected, calculateTotalRevenue, calculateCompletedOrders, calculateAverageOrderValue,
        seedDemoData, resetDemoData, filterByDate
     }}>
        {children}
     </RevenueOSContext.Provider>
   );
};

export const useRevenueOS = () => {
    const ctx = useContext(RevenueOSContext);
    if (!ctx) throw new Error("useRevenueOS must be used within RevenueOSProvider");
    return ctx;
};
