"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRevenueOS } from "@/contexts/RevenueOSContext";
import TransactionModal from "./_components/TransactionModal";
import CustomerModal from "./_components/CustomerModal";

export default function RevenueCommandCenter() {
  const { metrics, customers, renewals, transactions, dateRange, setDateRange, calculateTotalCashCollected, calculateTotalRevenue, calculateAverageOrderValue } = useRevenueOS();
  
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);

  // Sort renewals to find closest
  const upcomingRenewals = renewals.filter(r => r.status === "UPCOMING").sort((a,b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime()).slice(0, 3);
  
  // Find At-Risk customers
  const atRiskCustomers = customers.filter(c => c.health === "CRITICAL" || c.health === "AT_RISK").slice(0, 3);

  const totalCashCollected = calculateTotalCashCollected();
  const totalRevenue = calculateTotalRevenue();
  const aov = calculateAverageOrderValue();

  const handleKpiClick = (route: string) => {
     window.location.href = route;
  };

  return (
    <div className="pt-8 space-y-6 animate-in fade-in duration-300 px-8 max-w-[1400px] mx-auto">
      <TransactionModal isOpen={transactionModalOpen} onClose={() => setTransactionModalOpen(false)} />
      <CustomerModal isOpen={customerModalOpen} onClose={() => setCustomerModalOpen(false)} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-[32px] text-emerald-500">account_balance</span>
            REVENUE COMMAND CENTER
          </h1>
          <p className="text-[14px] text-slate-500 font-medium max-w-2xl mt-1">
            Realized value, forecasting, and post-sale retention intelligence.
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-3">
           <div className="flex gap-2">
              <button onClick={() => setCustomerModalOpen(true)} className="px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg text-[12px] font-bold shadow-sm flex items-center gap-1.5 transition-colors hover:bg-slate-50">
                 <span className="material-symbols-outlined text-[16px]">person_add</span> Create Customer
              </button>
              <button onClick={() => setTransactionModalOpen(true)} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[12px] font-bold shadow-sm flex items-center gap-1.5 transition-colors hover:bg-slate-800">
                 <span className="material-symbols-outlined text-[16px]">add</span> Record Transaction
              </button>
           </div>
           
           <div className="bg-white border border-slate-200 rounded-lg shadow-sm flex overflow-hidden">
              {["Today", "This Week", "This Month", "This Quarter", "This Year", "All Time"].map((tab) => (
                 <button 
                    key={tab}
                    onClick={() => setDateRange(tab as any)}
                    className={`px-4 py-1.5 text-[11px] font-bold transition-colors ${dateRange === tab ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                 >
                    {tab}
                 </button>
              ))}
           </div>
        </div>
      </div>

      {transactions.filter(t => t.status === "PAID" || t.status === "OUTSTANDING").length === 0 ? (
         <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
            <div className="text-[13px] font-bold text-slate-600">No completed transactions recorded for this period.</div>
         </div>
      ) : (
         <div className="grid grid-cols-3 gap-6">
            <div onClick={() => handleKpiClick('/revenue/billing?filter=PAID')} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm cursor-pointer hover:border-slate-300 hover:shadow-md transition-all group">
               <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 group-hover:text-slate-600 transition-colors">Total Cash Collected</p>
               <div className="flex items-center gap-3">
                  <div className="text-[36px] font-black tracking-tight leading-none text-emerald-600">${totalCashCollected.toLocaleString()}</div>
               </div>
            </div>
            
            <div onClick={() => handleKpiClick('/revenue/operations')} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm cursor-pointer hover:border-slate-300 hover:shadow-md transition-all group">
               <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 group-hover:text-slate-600 transition-colors">Total Revenue</p>
               <div className="flex items-center gap-3">
                  <div className="text-[36px] font-black text-slate-900 tracking-tight leading-none">${totalRevenue.toLocaleString()}</div>
               </div>
            </div>

            <div onClick={() => handleKpiClick('/revenue/analytics')} className="bg-slate-900 text-white rounded-xl p-6 shadow-sm cursor-pointer hover:bg-slate-800 transition-colors">
               <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Average Order Value</p>
               <div className="flex items-center gap-3">
                  <div className="text-[36px] font-black tracking-tight leading-none">${Math.round(aov).toLocaleString()}</div>
               </div>
            </div>
         </div>
      )}

      <h2 className="text-[14px] font-bold text-slate-900 flex items-center gap-1.5 mt-8 border-b border-slate-200 pb-2">
         Lifetime & Holistic Health
      </h2>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Monthly Recurring (MRR)</p>
          <div className="flex items-end gap-2">
            <p className="text-[32px] font-black text-slate-900 tracking-tight leading-none">${metrics.mrr.toLocaleString()}</p>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded inline-flex">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            Target £15k
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Annual Recurring (ARR)</p>
          <div className="flex items-end gap-2">
            <p className="text-[32px] font-black text-slate-900 tracking-tight leading-none">${metrics.arr.toLocaleString()}</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
            <span className="text-slate-500">Churn Rate</span>
            <span className="text-red-500">{metrics.churnRate}%</span>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Total Lifetime Revenue</p>
          <div className="flex items-end gap-2">
            <p className="text-[32px] font-black text-emerald-600 tracking-tight leading-none">${metrics.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
            <span className="text-slate-500">NRR</span>
            <span className="text-blue-600">{metrics.netRevenueRetention}%</span>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <span className="material-symbols-outlined text-[80px]">receipt_long</span>
          </div>
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Outstanding Revenue</p>
            <p className="text-[32px] font-black tracking-tight leading-none text-red-400">${metrics.outstandingRevenue.toLocaleString()}</p>
          </div>
          <Link href="/revenue/billing" className="text-[11px] font-bold uppercase tracking-widest text-slate-300 hover:text-white transition-colors relative z-10 flex items-center justify-end gap-1 mt-6">
            Resolve Invoices <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6">
         {/* At Risk Customers */}
         <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-[14px] font-bold text-slate-900 flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px] text-red-500">warning</span> Health: Requires Attention</h3>
               <Link href="/revenue/customers" className="text-[11px] font-bold text-blue-600 hover:underline">View All Customers</Link>
            </div>
            
            <div className="space-y-4">
               {atRiskCustomers.length > 0 ? atRiskCustomers.map(c => (
                  <div key={c.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                     <div className="flex justify-between items-start mb-2">
                        <div>
                           <div className="text-[13px] font-black text-slate-900">{c.name}</div>
                           <div className="text-[11px] font-bold text-slate-500">{c.offerPurchased}</div>
                        </div>
                        <span className={`px-2 py-1 text-[9px] font-extrabold uppercase rounded ${c.health === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>{c.health.replace("_", " ")}</span>
                     </div>
                     <p className="text-[12px] font-medium text-slate-700 bg-white p-3 border border-slate-100 rounded-lg shadow-sm">
                        {c.healthReasoning}
                     </p>
                  </div>
               )) : (
                 <div className="p-8 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">No active customers currently flagged as at risk.</div>
               )}
            </div>
         </div>

         {/* Upcoming Renewals */}
         <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-[14px] font-bold text-slate-900 flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px] text-blue-500">autorenew</span> Upcoming Renewals</h3>
               <Link href="/revenue/expansion" className="text-[11px] font-bold text-blue-600 hover:underline">Manage Renewals</Link>
            </div>
            
            <div className="space-y-3">
               {upcomingRenewals.length > 0 ? upcomingRenewals.map(r => {
                  const customer = customers.find(c => c.id === r.customerId);
                  if(!customer) return null;
                  return (
                     <div key={r.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                        <div>
                           <div className="text-[13px] font-black text-slate-900">{customer.name}</div>
                           <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 mt-0.5">
                              Renewal: <span className="text-slate-800">{new Date(r.renewalDate).toLocaleDateString()}</span>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="text-[14px] font-black text-emerald-600">${r.currentValue.toLocaleString()}</div>
                           <div className={`text-[10px] font-bold mt-1 uppercase ${r.riskLevel === 'HIGH' ? 'text-red-600' : r.riskLevel === 'MEDIUM' ? 'text-amber-600' : 'text-emerald-600'}`}>{r.riskLevel} RISK</div>
                        </div>
                     </div>
                  );
               }) : (
                 <div className="p-8 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">No renewals coming up in the next 30 days.</div>
               )}
            </div>
         </div>
      </div>

    </div>
  );
}
