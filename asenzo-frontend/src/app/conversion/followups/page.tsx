"use client";

import React from "react";
import { getConversion, updateFollowUp } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function FollowUpsPage() {
  const { data, setData, localData, setLocalData, loading, error } = useAdapter(getConversion);

  if (loading) {
     return <div className="p-10 animate-pulse h-96 w-full max-w-[1200px] mx-auto bg-muted/20 rounded-[16px]" />;
  }

  if (error || !localData) {
     return <div className="p-10">Error loading Follow-ups.</div>;
  }

  const { followUps } = localData;
  const overdue = followUps.filter(f => f.status === "OVERDUE");
  const due = followUps.filter(f => f.status === "DUE" || f.status === "PENDING" && new Date(f.dueDate) <= new Date());
  const upcoming = followUps.filter(f => f.status === "PENDING" && new Date(f.dueDate) > new Date());

  async function completeFollowUp(id: string) {
     const fuMatch = localData?.followUps.find(f => f.id === id);
     if (!fuMatch) return;
     const updated = { ...fuMatch, status: "COMPLETED" as const, completedDate: new Date().toISOString() };
     const res = await updateFollowUp(updated);
     setLocalData(res);
     setData(res);
  }

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-[18px] font-bold text-foreground mb-1">Follow-up Center</h1>
          <p className="text-[14px] text-muted-foreground">Actionable queue for all due outreach.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* OVERDUE */}
        {overdue.length > 0 && (
          <section>
             <h2 className="text-[11px] font-bold text-destructive uppercase tracking-widest mb-3 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-destructive"></span> Overdue ({overdue.length})</h2>
             <div className="flex flex-col gap-3">
               {overdue.map(f => (
                 <div key={f.id} className="p-5 border border-destructive/30 bg-destructive/5 rounded-[12px] flex items-center justify-between">
                   <div>
                     <p className="text-[14px] font-bold text-foreground">{f.reason}</p>
                     <p className="text-[12px] text-muted-foreground mt-1">Recommended Action: {f.recommendedAction}</p>
                   </div>
                   <button onClick={() => completeFollowUp(f.id)} className="bg-background border border-border text-foreground px-4 py-1.5 rounded-[6px] text-[12px] font-bold hover:bg-success hover:text-background transition-colors">Mark Done</button>
                 </div>
               ))}
             </div>
          </section>
        )}

        {/* DUE TODAY */}
        <section>
           <h2 className="text-[11px] font-bold text-foreground uppercase tracking-widest mb-3">Due Today ({due.length})</h2>
           <div className="flex flex-col gap-3">
             {due.map(f => (
               <div key={f.id} className="p-5 border border-border bg-card rounded-[12px] flex items-center justify-between">
                 <div>
                   <p className="text-[14px] font-bold text-foreground">{f.reason}</p>
                   <p className="text-[12px] text-muted-foreground mt-1">{f.owner} • {f.recommendedAction}</p>
                 </div>
                 <button onClick={() => completeFollowUp(f.id)} className="bg-background border border-border text-foreground px-4 py-1.5 rounded-[6px] text-[12px] font-bold hover:bg-success hover:text-background transition-colors">Complete</button>
               </div>
             ))}
             {due.length === 0 && <p className="text-[13px] text-muted-foreground italic">No follow-ups due today.</p>}
           </div>
        </section>

        {/* UPCOMING */}
        {upcoming.length > 0 && (
          <section className="opacity-70">
             <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Upcoming ({upcoming.length})</h2>
             <div className="flex flex-col gap-3">
               {upcoming.map(f => (
                 <div key={f.id} className="p-4 border border-border bg-card rounded-[12px] flex items-center justify-between">
                   <p className="text-[13px] font-bold text-foreground">{f.reason}</p>
                   <p className="text-[11px] text-muted-foreground uppercase">{new Date(f.dueDate).toLocaleDateString()}</p>
                 </div>
               ))}
             </div>
          </section>
        )}
      </div>

    </div>
  );
}
