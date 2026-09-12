import React from "react";

export default function AnalyticsRevenue() {
  return (
    <div className="p-6 md:p-10 lg:p-12">
      <div className="border border-dashed border-border rounded-[16px] p-20 flex flex-col items-center justify-center text-center">
        <span className="material-symbols-outlined text-[48px] text-muted-foreground mb-4 opacity-50">account_balance_wallet</span>
        <h2 className="text-[18px] font-bold text-foreground mb-2">Revenue Analytics</h2>
        <p className="text-[14px] text-muted-foreground max-w-[400px]">MRR, Cash Collected, Lifetime Value, and Retention metrics coming soon.</p>
      </div>
    </div>
  );
}
