"use client";

import React, { useEffect, useState } from "react";
import { getSources, createSource } from "@/lib/adapters/acquisition";
import { AcquisitionSource } from "@/lib/types";

export default function AcquisitionSourcesPage() {
  const [sources, setSources] = useState<AcquisitionSource[]>([]);

  const load = async () => setSources(await getSources());
  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    await createSource({ name: "LinkedIn Organic", type: "SOCIAL", leadsCount: 0 });
    load();
  };

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1360px] mx-auto w-full pb-32">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-[20px] font-bold text-foreground">Acquisition Sources</h2>
          <p className="text-[14px] text-muted-foreground mt-1">Track where your highest quality demand originates.</p>
        </div>
        <button onClick={handleCreate} className="bg-foreground text-background px-4 py-2 rounded-[8px] text-[13px] font-bold">New Source</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sources.length === 0 ? <p className="text-[14px] text-muted-foreground italic">No sources configured.</p> : sources.map(s => (
          <div key={s.id} className="p-5 bg-card border border-border rounded-[12px]">
             <div className="flex justify-between items-start mb-4">
                <span className="text-[16px] font-bold text-foreground">{s.name}</span>
                <span className="text-[10px] font-bold bg-secondary px-2 py-0.5 rounded uppercase tracking-wider">{s.type}</span>
             </div>
             <p className="text-[13px] text-muted-foreground"><span className="text-[18px] font-bold text-foreground mr-1">{s.leadsCount}</span> leads tracked</p>
          </div>
        ))}
      </div>
    </div>
  );
}
