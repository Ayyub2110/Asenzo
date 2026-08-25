"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ACTION_MAP } from "@/lib/routing";
import { getLeads, getSources, getCampaigns } from "@/lib/adapters/acquisition";
import { Lead, AcquisitionSource, AcquisitionCampaign } from "@/lib/types";

export default function AcquisitionCommandPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [sources, setSources] = useState<AcquisitionSource[]>([]);
  const [campaigns, setCampaigns] = useState<AcquisitionCampaign[]>([]);
  const [pipelineMetrics, setPipelineMetrics] = useState({ ideas: 0, scripts: 0, review: 0, published: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [ls, scs, cmps] = await Promise.all([
          getLeads(),
          getSources(),
          getCampaigns()
        ]);
        setLeads(ls);
        setSources(scs);
        setCampaigns(cmps);
        
        // Read Pipeline Metrics
        const ideasStr = localStorage.getItem("asenzo_content_ideas");
        const prodStr = localStorage.getItem("asenzo_production_items");
        const allIdeas = ideasStr ? JSON.parse(ideasStr) : [];
        const allProds = prodStr ? JSON.parse(prodStr) : [];
        
        setPipelineMetrics({
          ideas: allIdeas.filter((i:any) => i.status === "GENERATED" || i.status === "REVIEW" || i.status === "IDEA").length,
          scripts: allIdeas.filter((i:any) => i.status === "SCRIPTING").length,
          review: allProds.filter((p:any) => p.stage === "FOUNDER REVIEW").length,
          published: allProds.filter((p:any) => p.stage === "PUBLISHED").length,
        });

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-6 md:p-10 lg:p-12 max-w-[1360px] mx-auto w-full animate-pulse h-96 bg-muted/20 rounded-[16px]" />;
  }

  const qualifiedLeads = leads.filter(l => l.status === 'QUALIFIED' || l.status === 'READY_FOR_HANDOFF' || l.status === 'HANDED_OFF');
  const activeConversations = leads.filter(l => l.status === 'IN_CONVERSATION');
  const qualRate = leads.length > 0 ? Math.round((qualifiedLeads.length / leads.length) * 100) : 0;
  
  // Real Bottleneck Logic
  let bottleneck = null;
  if (leads.length > 10 && qualifiedLeads.length < (leads.length * 0.2)) {
    bottleneck = { type: 'CONVERSION BOTTLENECK', text: 'Strong lead volume but low qualification rate.' };
  } else if (leads.length > 0 && activeConversations.length === 0) {
    bottleneck = { type: 'CONVERSATION BOTTLENECK', text: 'Qualified leads are not transitioning into active conversations.' };
  } else if (leads.length === 0) {
    bottleneck = { type: 'CAPTURE BOTTLENECK', text: 'Not enough capture surface activity to generate leads.' };
  } else {
    bottleneck = { type: 'HEALTHY', text: 'Pipeline velocity operating within expected parameters.' };
  }

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1360px] mx-auto w-full pb-32">
      
      {/* RECOMMENDED ACTION & BOTTLENECK */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <section className="bg-foreground text-background p-6 lg:p-8 rounded-[16px] flex flex-col justify-between">
          <div>
            <h2 className="text-[11px] font-bold text-background/70 uppercase tracking-widest leading-none mb-4">Recommended Action</h2>
            <h3 className="text-[18px] lg:text-[20px] font-bold mb-2">Create 3 Product-aware case-study posts this week.</h3>
            <p className="text-[14px] font-medium text-background/80 mb-6">Your current content has strong reach but insufficient proof content. Prospects are not converting.</p>
          </div>
          <Link href={ACTION_MAP.openScripts()}>
            <button className="bg-background text-foreground px-5 py-2.5 rounded-[8px] text-[13px] font-semibold w-fit hover:bg-background/90 transition">
               Draft Script Now
            </button>
          </Link>
        </section>

        <section className={`p-6 lg:p-8 rounded-[16px] border ${bottleneck.type === 'HEALTHY' ? 'bg-success/10 border-success/20' : 'bg-destructive/10 border-destructive/20'}`}>
          <h2 className={`text-[11px] font-bold uppercase tracking-widest leading-none mb-4 flex items-center gap-2 ${bottleneck.type === 'HEALTHY' ? 'text-success' : 'text-destructive'}`}>
            <span className="material-symbols-outlined text-[16px]">{bottleneck.type === 'HEALTHY' ? 'check_circle' : 'warning'}</span> {bottleneck.type === 'HEALTHY' ? 'Health Status' : 'Intelligence & Bottlenecks'}
          </h2>
          <h3 className="text-[18px] lg:text-[20px] font-bold text-foreground mb-2">{bottleneck.type}</h3>
          <p className="text-[14px] font-medium text-foreground/80 mb-6">{bottleneck.text}</p>
        </section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
        
        {/* ACQUISITION PULSE */}
        <section>
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Acquisition Pulse</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link href={ACTION_MAP.openAcquisitionLeads()} className="p-5 border border-border bg-card rounded-[12px] hover:border-tertiary/40 transition-colors block">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Total Leads</p>
              <span className="text-[28px] font-bold text-foreground leading-none">{leads.length}</span>
            </Link>
            <Link href={ACTION_MAP.openLeadQualification('QUALIFIED')} className="p-5 border border-border bg-card rounded-[12px] hover:border-tertiary/40 transition-colors block">
               <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Qualified Leads</p>
               <span className="text-[28px] font-bold text-success leading-none">{qualifiedLeads.length}</span>
            </Link>
            <Link href={ACTION_MAP.openAcquisitionConversations()} className="p-5 border border-border bg-card rounded-[12px] hover:border-tertiary/40 transition-colors block">
               <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Active Conversations</p>
               <span className="text-[28px] font-bold text-cyan leading-none">{activeConversations.length}</span>
            </Link>
            <div className="p-5 border border-border bg-card rounded-[12px]">
               <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Qual Rate</p>
               <span className="text-[28px] font-bold text-tertiary leading-none">{qualRate}%</span>
            </div>
          </div>
        </section>

        {/* THIS WEEK / CONTENT HEALTH */}
        <section>
          <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-4">Content Production Health</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href={ACTION_MAP.openContentCalendar()} className="p-5 border border-border bg-card rounded-[12px] hover:border-tertiary/40 transition-colors block">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Planned Content</p>
              <span className="text-[24px] font-bold text-foreground leading-none">12</span>
            </Link>
            <Link href={ACTION_MAP.openAcquisitionAnalytics()} className="p-5 border border-border bg-card rounded-[12px] hover:border-tertiary/40 transition-colors block">
               <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Published</p>
               <span className="text-[24px] font-bold text-success leading-none">5</span>
            </Link>
            <Link href="/acquisition/production" className="p-5 border border-border bg-card rounded-[12px] hover:border-tertiary/40 transition-colors block">
               <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex justify-between">Review Blockers {pipelineMetrics.review > 0 && <span className="bg-destructive/20 text-destructive text-[10px] px-1 rounded">ALERT</span>}</p>
               <span className={`text-[24px] font-bold leading-none ${pipelineMetrics.review > 0 ? 'text-destructive' : 'text-foreground'}`}>{pipelineMetrics.review} Items</span>
            </Link>
            <Link href="/acquisition/strategy" className="p-5 border border-border bg-card rounded-[12px] hover:border-tertiary/40 transition-colors block">
               <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Generated Ideas</p>
               <span className="text-[24px] font-bold text-cyan leading-none">{pipelineMetrics.ideas} Output</span>
            </Link>
          </div>
        </section>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 mb-10">
        
        {/* RE-INSERT: TOP SOURCES */}
        <section className="col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Top Sources</h2>
            <Link href={ACTION_MAP.openAcquisitionSources()} className="text-[10px] uppercase font-bold text-foreground hover:underline">View All</Link>
          </div>
          <div className="flex flex-col gap-2">
            {sources.length === 0 ? <p className="p-4 border border-border rounded-[8px] text-[13px] text-muted-foreground italic">No source data.</p> : sources.slice(0, 3).map(src => (
               <div key={src.id} className="flex items-center justify-between p-4 border border-border bg-card rounded-[8px]">
                 <div>
                   <p className="text-[14px] font-semibold text-foreground">{src.name}</p>
                   <p className="text-[11px] text-muted-foreground uppercase tracking-widest mt-1">{src.type}</p>
                 </div>
                 <span className="text-[14px] font-bold text-foreground">{src.leadsCount} leads</span>
               </div>
            ))}
          </div>
        </section>

        {/* RE-INSERT: CAMPAIGNS */}
        <section className="col-span-1">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Active Campaigns</h2>
             <Link href={ACTION_MAP.openAcquisitionCampaigns()} className="text-[10px] uppercase font-bold text-foreground hover:underline">View All</Link>
          </div>
          <div className="flex flex-col gap-2">
            {campaigns.length === 0 ? <p className="p-4 border border-border rounded-[8px] text-[13px] text-muted-foreground italic">No campaigns active.</p> : campaigns.filter(c => c.status === 'ACTIVE').slice(0, 3).map(c => (
               <div key={c.id} className="p-4 border border-border bg-card rounded-[8px]">
                 <div className="flex justify-between items-start mb-2">
                    <p className="text-[14px] font-semibold text-foreground">{c.name}</p>
                    <span className="text-[10px] uppercase font-bold bg-success/20 text-success px-2 py-0.5 rounded">{c.status}</span>
                 </div>
                 <p className="text-[13px] text-muted-foreground"><span className="font-bold text-foreground">{c.leadsCount}</span> generated</p>
               </div>
            ))}
          </div>
        </section>

        {/* AWARENESS COVERAGE */}
        <section className="col-span-1">
          <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-4">Awareness Coverage</h2>
          <div className="bg-card border border-border rounded-[12px] p-2">
            {[
              { level: "Most-Aware", p: "5%", color: "bg-tertiary" },
              { level: "Product-Aware", p: "12%", color: "bg-cyan" },
              { level: "Solution-Aware", p: "28%", color: "bg-success" },
              { level: "Problem-Aware", p: "40%", color: "bg-warning" },
              { level: "Unaware", p: "15%", color: "bg-muted-foreground" },
            ].map(aw => (
              <div key={aw.level} className="flex flex-col gap-1 p-3">
                <div className="flex justify-between items-center text-[12px] font-bold">
                  <span>{aw.level}</span>
                  <span>{aw.p}</span>
                </div>
                <div className="w-full bg-secondary h-[4px] rounded-full overflow-hidden">
                  <div className={`h-full ${aw.color}`} style={{ width: aw.p }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section className="col-span-1">
          <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-4">Asset Pipeline</h2>
          <div className="bg-card border border-border rounded-[12px] p-2 flex flex-col gap-1">
            {[
              { stage: "Ideas Queue", count: pipelineMetrics.ideas, link: "/acquisition/strategy" },
              { stage: "Script Center", count: pipelineMetrics.scripts, link: "/acquisition/scripts" },
              { stage: "Founder Review", count: pipelineMetrics.review, alert: pipelineMetrics.review > 0, link: "/acquisition/production" },
              { stage: "Published", count: pipelineMetrics.published, link: "/acquisition/analytics" },
            ].map((p, i) => (
              <Link href={p.link} key={i} className="flex justify-between items-center p-3 border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors cursor-pointer">
                <span className={`text-[13px] font-medium ${p.alert ? 'text-destructive font-bold' : 'text-foreground'}`}>{p.stage}</span>
                <span className={`text-[13px] font-bold bg-secondary px-2 py-0.5 rounded ${p.alert ? 'bg-destructive/10 text-destructive' : 'text-foreground'}`}>{p.count}</span>
              </Link>
            ))}
          </div>
        </section>

      </div>
      
      {leads.length === 0 && (
         <div className="p-8 border border-dashed border-border rounded-[12px] flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-[32px] text-muted-foreground mb-4 opacity-50">data_alert</span>
            <h3 className="text-[16px] font-bold text-foreground mb-1">No acquisition activity yet.</h3>
            <p className="text-[13px] text-muted-foreground mb-6">Connect your foundational assets to start generating Demand.</p>
            <div className="flex gap-2">
               <Link href={ACTION_MAP.openContentStrategy()}><button className="bg-secondary text-foreground px-4 py-2 rounded-[6px] text-[12px] font-bold hover:bg-muted">Create Strategy</button></Link>
               <Link href={ACTION_MAP.openScripts()}><button className="bg-secondary text-foreground px-4 py-2 rounded-[6px] text-[12px] font-bold hover:bg-muted">Create Script</button></Link>
               <Link href={ACTION_MAP.openAcquisitionCapture()}><button className="bg-secondary text-foreground px-4 py-2 rounded-[6px] text-[12px] font-bold hover:bg-muted">Create Capture Surface</button></Link>
            </div>
         </div>
      )}

    </div>
  );
}
