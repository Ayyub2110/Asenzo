"use client";

import React, { useState } from "react";

export default function AcquisitionStrategyPage() {
  const [ideas] = useState([
    { id: '1', title: 'Why founders burn out before 1M', angle: 'Contrarian', awareness: 'Problem-aware', funnel: 'TOF', status: 'Approved' },
    { id: '2', title: 'Our exact mechanism for delegation', angle: 'Framework', awareness: 'Solution-aware', funnel: 'MOF', status: 'Drafting' },
    { id: '3', title: 'Client doubled revenue in 90 days', angle: 'Proof', awareness: 'Product-aware', funnel: 'BOF', status: 'Idea' },
  ]);

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1360px] mx-auto w-full pb-32">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-[20px] font-bold text-foreground">Content Strategy</h2>
          <p className="text-[14px] text-muted-foreground mt-1">Determine what to create, who for, and toward what outcome.</p>
        </div>
        <button className="bg-foreground text-background px-4 py-2 rounded-[8px] text-[13px] font-bold">New Idea</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <section className="p-6 bg-card border border-border rounded-[12px]">
          <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-4">Idea Intelligence</h2>
          <div className="flex flex-col gap-4">
            <div className="bg-success/10 border border-success/20 p-4 rounded-[8px]">
              <p className="text-[13px] font-medium text-foreground"><span className="font-bold text-success">OPPORTUNITY:</span> Your last three case studies produced qualified conversations. Create more proof-led Product-Aware content.</p>
            </div>
            <div className="bg-warning/10 border border-warning/20 p-4 rounded-[8px]">
              <p className="text-[13px] font-medium text-foreground"><span className="font-bold text-warning">GAP:</span> You have strong problem-aware content but almost no Unaware top-of-funnel reach. Inject pattern interrupts.</p>
            </div>
          </div>
        </section>

        <section className="p-6 bg-card border border-border rounded-[12px]">
          <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-4">Awareness Mapping</h2>
          <div className="grid grid-cols-2 gap-4">
             <div className="p-3 border border-border/50 rounded flex justify-between">
                <span className="text-[13px] font-medium">Unaware</span><span className="text-[13px] font-bold">1</span>
             </div>
             <div className="p-3 border border-border/50 rounded flex justify-between bg-muted/50">
                <span className="text-[13px] font-medium">Problem-Aware</span><span className="text-[13px] font-bold">14</span>
             </div>
             <div className="p-3 border border-border/50 rounded flex justify-between bg-muted/50">
                <span className="text-[13px] font-medium">Solution-Aware</span><span className="text-[13px] font-bold">8</span>
             </div>
             <div className="p-3 border border-border/50 rounded flex justify-between">
                <span className="text-[13px] font-medium">Product-Aware</span><span className="text-[13px] font-bold">2</span>
             </div>
             <div className="p-3 border border-border/50 rounded flex justify-between">
                <span className="text-[13px] font-medium">Most-Aware</span><span className="text-[13px] font-bold">0</span>
             </div>
          </div>
        </section>
      </div>

      <section>
        <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-4">Content Idea Engine</h2>
        <div className="border border-border rounded-[12px] bg-card overflow-hidden">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="border-b border-border bg-muted/50">
                 <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Idea</th>
                 <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Awareness</th>
                 <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Funnel</th>
                 <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Angle</th>
                 <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
               </tr>
             </thead>
             <tbody>
               {ideas.map((i) => (
                 <tr key={i.id} className="border-b border-border/50 hover:bg-muted/30">
                   <td className="p-4 text-[14px] font-bold text-foreground">{i.title}</td>
                   <td className="p-4 text-[13px] text-muted-foreground">{i.awareness}</td>
                   <td className="p-4 text-[13px] font-bold text-tertiary">{i.funnel}</td>
                   <td className="p-4 text-[13px] text-muted-foreground">{i.angle}</td>
                   <td className="p-4">
                      <span className="text-[10px] uppercase font-bold bg-secondary px-2 py-1 rounded">{i.status}</span>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      </section>

    </div>
  );
}
