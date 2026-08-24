"use client";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getDelivery } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function Client360Page() {
  const params = useParams();
  const clientId = params.clientId as string;
  const { localData, loading, error } = useAdapter(getDelivery);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full max-w-[1200px] mx-auto bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Client 360.</div>;

  const client = localData.clients.find(c => c.id === clientId);
  if (!client) {
    return (
      <div className="p-16 text-center text-muted-foreground bg-card m-6 md:m-10 rounded-[16px] border border-border">
        <h3 className="text-[14px] font-bold text-foreground">Client Not Found</h3>
      </div>
    );
  }

  // Relations
  const contract = localData.contracts.find(c => c.clientId === clientId);
  const engagements = localData.engagements.filter(e => e.clientId === clientId);
  const activeEngagement = engagements.find(e => e.status === "ACTIVE") || engagements[0];
  const onboarding = localData.onboardings.find(o => o.clientId === clientId);
  const milestones = localData.milestones.filter(m => engagements.some(e => e.id === m.engagementId));
  const deliverables = localData.deliverables.filter(d => d.clientId === clientId);
  const communications = localData.communications.filter(c => c.clientId === clientId);
  const outcomes = localData.outcomes?.filter(o => o.clientId === clientId) || [];
  const renewal = localData.renewals.find(r => r.clientId === clientId);
  const proofs = localData.proofs.filter(p => p.clientId === clientId);
  const contact = localData.contacts.find(c => c.clientId === clientId && c.isPrimary);
  
  // Synthesize Timeline
  const timeline: Array<{ id: string, date: Date, type: string, summary: string }> = [];
  if (contract) timeline.push({ id: `ct-${contract.id}`, date: new Date(contract.startDate), type: "DEAL CLOSED WON", summary: "Contract started." });
  if (onboarding) timeline.push({ id: `onb-${onboarding.id}`, date: new Date(onboarding.completionDate || onboarding.startDate), type: onboarding.status === 'COMPLETED' ? "ONBOARDING COMPLETED" : "ONBOARDING STARTED", summary: "Client workspace initialized." });
  engagements.forEach(e => timeline.push({ id: `eng-${e.id}`, date: new Date(e.startDate), type: "ENGAGEMENT STARTED", summary: e.name }));
  milestones.forEach(m => timeline.push({ id: `ms-${m.id}`, date: new Date(m.startDate), type: "MILESTONE STARTED", summary: m.name }));
  communications.forEach(c => timeline.push({ id: `com-${c.id}`, date: new Date(c.date), type: "CLIENT MESSAGE", summary: c.summary }));
  deliverables.forEach(d => timeline.push({ id: `dl-${d.id}`, date: new Date(d.dueDate), type: "DELIVERABLE CREATED", summary: d.name }));
  
  timeline.sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="p-6 md:p-10 mx-auto w-full pb-32 max-w-[1500px]">
      
      <div className="mb-6">
        <Link href="/delivery/clients" className="text-[12px] text-muted-foreground hover:text-foreground font-semibold flex items-center gap-1 w-fit mb-4">
           <span className="material-symbols-outlined text-[14px]">arrow_back</span> Back to Client Portal
        </Link>
      </div>

      {/* HEADER */}
      <section className="bg-card border border-border p-8 rounded-[16px] shadow-sm mb-6 flex flex-col xl:flex-row justify-between gap-6">
         <div>
            <h1 className="text-[28px] md:text-[32px] font-bold text-foreground leading-tight tracking-tight mb-2 uppercase">{client.name}</h1>
            <p className="text-[16px] text-muted-foreground font-medium mb-4">{client.company} <span className="mx-2">•</span> {activeEngagement?.offer || contract?.offer}</p>
            <div className="flex flex-wrap gap-4 text-[12px] font-semibold uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-1">owner: <span className="text-foreground">{client.owner}</span></span>
              <span className="flex items-center gap-1">health: <span className={`px-2 py-0.5 rounded text-[10px] ${client.health.overall === 'GREEN' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>{client.health.overall}</span></span>
              <span className="flex items-center gap-1">progress: <span className="text-foreground">{activeEngagement?.progress || 0}%</span></span>
              {renewal && <span className="flex items-center gap-1">renewal: <span className="text-foreground">{Math.ceil((new Date(renewal.renewalDate).getTime() - Date.now()) / (1000 * 3600 * 24))} days</span></span>}
            </div>
         </div>
         <div className="flex flex-col gap-2 shrink-0">
            <button className="px-4 py-2 bg-primary text-primary-foreground text-[12px] font-bold rounded-[6px] text-left">Record Communication</button>
            <button className="px-4 py-2 bg-secondary text-foreground text-[12px] font-bold rounded-[6px] text-left">Update Health</button>
            <button className="px-4 py-2 bg-secondary text-foreground text-[12px] font-bold rounded-[6px] text-left">View Engagement</button>
         </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
         
         <div className="xl:col-span-2 space-y-6">
            
            {/* TIMELINE */}
            <section className="bg-card border border-border rounded-[16px] p-6 shadow-sm">
               <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-6">Timeline</h2>
               <div className="space-y-6">
                  {timeline.slice(0, 8).map(event => (
                    <div key={event.id} className="relative pl-6 before:content-[''] before:absolute before:left-[3px] before:top-1.5 before:-bottom-7 before:w-px before:bg-border last:before:hidden">
                       <span className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-primary ring-4 ring-background"></span>
                       <div className="flex flex-col gap-1">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">{event.date.toLocaleDateString()} {event.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                          <p className="text-[13px] font-bold text-foreground">{event.type}</p>
                          <p className="text-[13px] text-muted-foreground">{event.summary}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* MILESTONE SUMMARY */}
               <section className="bg-card border border-border rounded-[16px] p-6 shadow-sm">
                 <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-4">Milestone Summary</h2>
                 <div className="space-y-3">
                   {milestones.length === 0 ? <p className="text-[13px] text-muted-foreground">No milestones active.</p> : milestones.map(m => (
                     <div key={m.id} className="text-[13px] border-b border-border last:border-0 pb-3 last:pb-0">
                       <div className="flex items-center gap-2 mb-1">
                         <span className="material-symbols-outlined text-[16px] text-muted-foreground">{m.status === 'COMPLETED' ? 'check_circle' : 'schedule'}</span>
                         <span className="font-bold text-foreground">{m.name}</span>
                       </div>
                       <div className="flex justify-between text-[11px] text-muted-foreground pl-6">
                         <span>{m.status.replace("_", " ")}</span>
                         <span>Due: {new Date(m.dueDate).toLocaleDateString()}</span>
                       </div>
                     </div>
                   ))}
                 </div>
               </section>

               {/* DELIVERABLE SUMMARY */}
               <section className="bg-card border border-border rounded-[16px] p-6 shadow-sm">
                 <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-4">Deliverables Summary</h2>
                 <div className="space-y-3">
                   {deliverables.length === 0 ? <p className="text-[13px] text-muted-foreground">No deliverables active.</p> : deliverables.map(d => (
                     <div key={d.id} className="text-[13px] border-b border-border last:border-0 pb-3 last:pb-0">
                       <div className="flex items-center gap-2 mb-1">
                         <span className="material-symbols-outlined text-[16px] text-muted-foreground">{d.status === 'APPROVED' ? 'check_circle' : 'description'}</span>
                         <span className="font-bold text-foreground">{d.name}</span>
                       </div>
                       <div className="flex justify-between text-[11px] text-muted-foreground pl-6">
                         <span>{d.status.replace("_", " ")}</span>
                         <span>Due: {new Date(d.dueDate).toLocaleDateString()}</span>
                       </div>
                     </div>
                   ))}
                 </div>
               </section>
            </div>

            {/* RISKS & BLOCKERS */}
            <section className="bg-card border border-border rounded-[16px] p-6 shadow-sm">
               <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-4">Risks & Blockers</h2>
               <div className="space-y-2">
                 <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-success/20 text-success text-[10px] font-bold uppercase rounded">Green</span>
                    <span className="text-[13px] font-medium text-foreground">No payment risk</span>
                 </div>
                 <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-success/20 text-success text-[10px] font-bold uppercase rounded">Green</span>
                    <span className="text-[13px] font-medium text-foreground">No scope risk</span>
                 </div>
               </div>
            </section>

         </div>
         
         <div className="xl:col-span-1 space-y-6">
           
           {/* HEALTH OVERVIEW */}
           <section className="bg-card border border-border rounded-[16px] p-6 shadow-sm">
             <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-4">Health Summary</h2>
             <div className="flex items-center gap-3 mb-6">
               <span className={`w-3 h-3 rounded-full ${client.health.overall === 'GREEN' ? 'bg-success' : client.health.overall === 'YELLOW' ? 'bg-yellow-500' : 'bg-destructive'}`}></span>
               <span className="text-[20px] font-bold uppercase">{client.health.overall}</span>
             </div>
             <div className="space-y-2">
               {client.health.signals.map(s => (
                 <div key={s.id} className="flex justify-between items-center text-[12px] font-bold">
                    <span className="text-muted-foreground uppercase">{s.dimension}</span>
                    <span className={s.status === 'GREEN' ? 'text-success' : s.status === 'YELLOW' ? 'text-yellow-600' : 'text-destructive'}>{s.status}</span>
                 </div>
               ))}
               {client.health.signals.length === 0 && <p className="text-[12px] text-muted-foreground">Dimensions not scored.</p>}
             </div>
             {client.health.signals.some(s => s.status !== 'GREEN') && (
               <div className="mt-4 p-3 bg-secondary/50 rounded-lg text-[12px]">
                  <p className="font-bold mb-1">Reason</p>
                  <p className="text-muted-foreground">{client.health.signals.find(s => s.status !== 'GREEN')?.reason}</p>
               </div>
             )}
           </section>

           {/* PROGRESS */}
           <section className="bg-card border border-border rounded-[16px] p-6 shadow-sm">
             <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-4">Delivery Progress</h2>
             <div className="mb-4">
                <div className="flex justify-between text-[13px] font-bold mb-1">
                  <span>Overall</span> <span>{activeEngagement?.progress || 0}%</span>
                </div>
                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-primary" style={{ width: `${activeEngagement?.progress || 0}%` }}></div>
                </div>
             </div>
             <div className="space-y-3">
               <div className="flex justify-between text-[12px]">
                 <span className="text-muted-foreground">Onboarding</span>
                 <span className="font-bold text-foreground">100%</span>
               </div>
               <div className="flex justify-between text-[12px]">
                 <span className="text-muted-foreground">Foundation Strategy</span>
                 <span className="font-bold text-foreground">100%</span>
               </div>
             </div>
           </section>

           {/* RETENTION SUMMARY */}
           <section className="bg-card border border-border rounded-[16px] p-6 shadow-sm">
             <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-4">Retention & Proof</h2>
             <div className="space-y-4">
               <div>
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Renewal</h3>
                  {renewal ? (
                    <div className="text-[13px] space-y-1">
                      <div className="flex justify-between font-medium"><span>Contract ends:</span> <span className="text-foreground">{new Date(renewal.renewalDate).toLocaleDateString()}</span></div>
                      <div className="flex justify-between font-medium"><span>Likelihood:</span> <span className="text-foreground">{renewal.likelihood}%</span></div>
                    </div>
                  ) : <p className="text-[12px] text-muted-foreground">No active renewal.</p>}
               </div>
               <div className="pt-4 border-t border-border">
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Case Study</h3>
                  <div className="text-[13px] space-y-1">
                    <div className="flex justify-between font-medium"><span>Status:</span> <span className="text-success font-bold">Ready</span></div>
                    <div className="flex justify-between font-medium"><span>Permission:</span> <span className="text-foreground">Granted</span></div>
                  </div>
               </div>
             </div>
           </section>

         </div>

      </div>

    </div>
  );
}
