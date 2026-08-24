import React from "react";

export default function AnalyticsPage() {
  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto pb-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-[18px] font-bold text-foreground mb-1">Conversion Analytics</h1>
          <p className="text-[14px] text-muted-foreground">Full-funnel leakage and source influence tracking.</p>
        </div>
      </div>

      <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Conversion Funnel</h2>
      <div className="bg-card border border-border rounded-[16px] p-8 mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
        {[
           { label: "Leads", value: 128 },
           { label: "Engaged", value: 42 },
           { label: "Qualified", value: 21 },
           { label: "Applications", value: 15 },
           { label: "Booked", value: 11 },
           { label: "Showed", value: 8 },
           { label: "Sales Ready", value: 6 },
           { label: "Converted", value: 3 },
        ].map((step, i, arr) => (
           <div key={i} className="flex flex-col items-center flex-1 w-full relative">
              <div className="w-12 h-12 rounded-full border border-border bg-background flex flex-col items-center justify-center z-10 mb-2">
                 <span className="text-[14px] font-bold text-foreground">{step.value}</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-center">{step.label}</span>
              {i < arr.length - 1 && (
                 <div className="hidden md:block absolute top-6 left-[60%] right-[-40%] h-[1px] bg-border -z-0"></div>
              )}
           </div>
        ))}
      </div>

      <div className="bg-destructive/10 border border-destructive/20 p-6 rounded-[12px] flex items-center justify-between mb-10">
         <div>
            <h3 className="text-[14px] font-bold text-foreground mb-1">Critical Drop-off Detected</h3>
            <p className="text-[13px] text-muted-foreground">Your biggest conversion loss occurs between <span className="font-bold text-foreground">Engaged (42)</span> and <span className="font-bold text-foreground">Qualified (21)</span>. Loss rate: 50%.</p>
         </div>
      </div>
      
    </div>
  );
}
