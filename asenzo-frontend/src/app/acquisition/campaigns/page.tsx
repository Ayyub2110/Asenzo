"use client";

import React, { useEffect, useState } from "react";
import { getCampaigns, createCampaign } from "@/lib/adapters/acquisition";
import { AcquisitionCampaign } from "@/lib/types";

export default function AcquisitionCampaignsPage() {
  const [campaigns, setCampaigns] = useState<AcquisitionCampaign[]>([]);

  const load = async () => setCampaigns(await getCampaigns());
  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    await createCampaign({ name: "Q3 Founder Burnout Push", status: "ACTIVE", leadsCount: 0 });
    load();
  };

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1360px] mx-auto w-full pb-32">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-[20px] font-bold text-foreground">Campaigns</h2>
          <p className="text-[14px] text-muted-foreground mt-1">Group assets together to analyze multi-channel effectiveness.</p>
        </div>
        <button onClick={handleCreate} className="bg-foreground text-background px-4 py-2 rounded-[8px] text-[13px] font-bold">New Campaign</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.length === 0 ? <p className="text-[14px] text-muted-foreground italic">No campaigns configured.</p> : campaigns.map(c => (
          <div key={c.id} className="p-5 bg-card border border-border rounded-[12px]">
             <div className="flex justify-between items-start mb-4">
                <span className="text-[16px] font-bold text-foreground">{c.name}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${c.status === 'ACTIVE' ? 'bg-success/20 text-success' : 'bg-secondary'}`}>{c.status}</span>
             </div>
             <p className="text-[13px] text-muted-foreground"><span className="text-[18px] font-bold text-foreground mr-1">{c.leadsCount}</span> campaign leads</p>
          </div>
        ))}
      </div>
    </div>
  );
}
