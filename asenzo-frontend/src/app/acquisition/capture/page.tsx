"use client";

import React, { useEffect, useState } from "react";
import { 
  getLeadMagnets, getCTAs, getCaptureSurfaces, 
  createLeadMagnet, createCTA, createCaptureSurface, createLead, createLeadEvent, createAttributionEvent, createIntentSignal
} from "@/lib/adapters/acquisition";
import { LeadMagnet, CTA, CaptureSurface } from "@/lib/types";

export default function AcquisitionCapturePage() {
  const [magnets, setMagnets] = useState<LeadMagnet[]>([]);
  const [ctas, setCtas] = useState<CTA[]>([]);
  const [surfaces, setSurfaces] = useState<CaptureSurface[]>([]);

  const load = async () => {
    setMagnets(await getLeadMagnets());
    setCtas(await getCTAs());
    setSurfaces(await getCaptureSurfaces());
  };

  useEffect(() => { load(); }, []);

  const handleCreateMagnet = async () => {
    await createLeadMagnet({ name: "Founder Burnout Report QA", type: "PDF" });
    load();
  };

  const handleCreateCTA = async () => {
    await createCTA({ 
      text: "Download Now", 
      url: "/download/burnout",
      contentId: "i1" // Connecting to existing Attention idea
    });
    load();
  };

  const handleCreateSurface = async () => {
    await createCaptureSurface({ name: "Homepage Hero Opt-in", type: "LANDING_PAGE" });
    load();
  };

  const handleGenerateCaptureEvent = async () => {
    if (surfaces.length === 0 || magnets.length === 0 || ctas.length === 0) {
      alert("Please create at least one Lead Magnet, CTA, and Capture Surface first.");
      return;
    }
    
    // Simulate end-to-end capture
    const newLead = await createLead({
      name: "Test Founder",
      email: "test_founder@example.com",
      company: "Acme Agency",
      leadMagnetId: magnets[0].id,
      ctaId: ctas[0].id,
      status: "NEW",
    });

    await createAttributionEvent({
      leadId: newLead.id,
      type: "FIRST_TOUCH",
      ctaId: ctas[0].id,
      timestamp: new Date().toISOString(),
      confidence: "KNOWN"
    });

    await createLeadEvent({
      leadId: newLead.id,
      type: "form_submitted",
      data: { surface: surfaces[0].id }
    });
    
    await createIntentSignal({
      leadId: newLead.id,
      type: "LEAD_MAGNET_REQUEST",
      score: 85
    });

    alert("Capture Event Generated! Lead created and attribution persisted.");
  };

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1360px] mx-auto w-full pb-32">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-[20px] font-bold text-foreground">Capture Assets</h2>
          <p className="text-[14px] text-muted-foreground mt-1">Manage Lead Magnets, CTAs, and Capture Surfaces.</p>
        </div>
        <button onClick={handleGenerateCaptureEvent} className="bg-cyan/10 text-cyan border border-cyan/20 px-4 py-2 rounded-[8px] text-[13px] font-bold hover:bg-cyan/20 transition">
          Generate Real Capture Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section>
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Lead Magnets</h2>
             <button onClick={handleCreateMagnet} className="text-[11px] font-bold text-foreground border border-border px-2 py-1 rounded hover:bg-muted">CREATE</button>
          </div>
          <div className="flex flex-col gap-3">
            {magnets.length === 0 ? <p className="text-[12px] text-muted-foreground italic">None</p> : magnets.map(m => (
              <div key={m.id} className="p-4 border border-border bg-card rounded-[8px]">
                <p className="text-[13px] font-bold text-foreground">{m.name}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{m.type}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">CTAs</h2>
             <button onClick={handleCreateCTA} className="text-[11px] font-bold text-foreground border border-border px-2 py-1 rounded hover:bg-muted">CREATE</button>
          </div>
          <div className="flex flex-col gap-3">
            {ctas.length === 0 ? <p className="text-[12px] text-muted-foreground italic">None</p> : ctas.map(c => (
              <div key={c.id} className="p-4 border border-border bg-card rounded-[8px]">
                <p className="text-[13px] font-bold text-foreground">{c.text}</p>
                <p className="text-[11px] text-muted-foreground mt-1 text-tertiary truncate">Content ID: {c.contentId}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Capture Surfaces</h2>
             <button onClick={handleCreateSurface} className="text-[11px] font-bold text-foreground border border-border px-2 py-1 rounded hover:bg-muted">CREATE</button>
          </div>
          <div className="flex flex-col gap-3">
            {surfaces.length === 0 ? <p className="text-[12px] text-muted-foreground italic">None</p> : surfaces.map(s => (
              <div key={s.id} className="p-4 border border-border bg-card rounded-[8px]">
                <p className="text-[13px] font-bold text-foreground">{s.name}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{s.type}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
