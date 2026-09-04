"use client";

import React from "react";
import { useRevenueOS } from "@/contexts/RevenueOSContext";
import Link from "next/link";

export default function BillingPage() {
  const { transactions, customers } = useRevenueOS();

  return (
    <div className="pt-8 space-y-6 animate-in fade-in duration-300 px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-black text-slate-900 tracking-tight">Billing & Revenue Tracking</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">Clean financial tracking distinguishing between booked and realized revenue.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[500px]">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Transaction ID</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Offer / Description</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest text-center">Type</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest text-center">Date</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest text-center">Realized Status</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {transactions.length > 0 ? transactions.map(t => {
                  const customer = customers.find(c => c.id === t.customerId);
                  return (
                     <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                           <div className="text-[11px] font-bold text-slate-400 tracking-widest font-mono uppercase">{t.id}</div>
                           {t.invoiceId && <div className="text-[9px] font-bold text-blue-500 mt-1 uppercase cursor-pointer hover:underline">VIEW INV {t.invoiceId}</div>}
                        </td>
                        <td className="px-6 py-4 font-bold text-[13px] text-slate-900">
                           <Link href="/revenue/customers" className="hover:underline hover:text-blue-600 transition-colors">{customer?.name || "Unknown"}</Link>
                        </td>
                        <td className="px-6 py-4 font-bold text-[12px] text-slate-700">{t.offerName}</td>
                        <td className="px-6 py-4 font-black text-[14px] text-slate-900">${t.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-center">
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.type.replace("_", " ")}</span>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-[12px] text-slate-600">{new Date(t.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-center">
                           <span className={`px-2 py-1 text-[9px] font-extrabold uppercase rounded ${
                              t.status === 'PAID' ? 'bg-emerald-50 text-emerald-700' :
                              t.status === 'OUTSTANDING' ? 'bg-red-50 text-red-700' :
                              t.status === 'REFUNDED' ? 'bg-amber-50 text-amber-700' :
                              'bg-slate-100 text-slate-600'
                           }`}>{t.status}</span>
                        </td>
                     </tr>
                  );
               }) : (
                  <tr>
                     <td colSpan={7} className="px-6 py-16 text-center">
                        <div className="text-[13px] font-bold text-slate-600">No revenue transactions yet.</div>
                        <p className="text-[11px] font-medium text-slate-400 mt-1 max-w-[300px] mx-auto">Connect your first closed-won customer from Conversion to begin tracking revenue.</p>
                     </td>
                  </tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
}
