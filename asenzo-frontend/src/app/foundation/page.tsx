"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { mockFoundationData } from "@/lib/mockFoundationData";

// Reusable UI components
function TitleSection({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
         <h1 className="text-[24px] font-bold tracking-tight text-foreground uppercase">{title}</h1>
         <p className="text-[13px] text-muted-foreground mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4 select-none">
      <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">{title}</h2>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  let colorClass = "bg-muted text-muted-foreground";
  if (status.includes("Complete") || status.includes("Strong") || status.includes("Ready")) {
     colorClass = "bg-success/10 text-success border border-success/20";
  } else if (status.includes("Needs refinement") || status.includes("Partial")) {
     colorClass = "bg-warning/10 text-warning border border-warning/20";
  } else if (status.includes("Missing")) {
     colorClass = "bg-destructive/10 text-destructive border border-destructive/20";
  }

  return (
    <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider ${colorClass}`}>
      {status}
    </span>
  );
}

function DomainCard({ title, subtitle, status, onClick }: { title: string, subtitle: string, status: string, onClick: () => void }) {
  return (
    <div 
      className="group border border-border bg-card rounded-[12px] p-5 hover:border-tertiary/40 transition-colors cursor-pointer flex flex-col justify-between"
      onClick={onClick}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[14px] font-bold text-foreground tracking-wide uppercase">{title}</h3>
          <StatusBadge status={status} />
        </div>
        <p className="text-[13px] text-muted-foreground font-medium pr-4">{subtitle}</p>
      </div>
      <div className="mt-6 flex justify-end">
         <span className="text-[12px] font-semibold text-tertiary group-hover:text-foreground transition-colors">Edit →</span>
      </div>
    </div>
  );
}

export default function FoundationPage() {
  const [data, setData] = useState<typeof mockFoundationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading internal sources
    const timer = setTimeout(() => {
      setData(mockFoundationData);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
     <div className="p-6 md:p-10 lg:p-12 max-w-[1360px] mx-auto w-full space-y-12 animate-pulse pb-32">
        <div className="h-8 bg-muted rounded w-48 mb-2"></div>
        <div className="h-4 bg-muted rounded w-64 mb-8"></div>
        <div className="h-[140px] bg-muted/50 rounded-[16px] mb-10 border border-border"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           {[...Array(8)].map((_, i) => <div key={i} className="h-[160px] bg-muted/50 rounded-[12px] border border-border"></div>)}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1360px] mx-auto w-full pb-32">
      <TitleSection title="Foundation Center" subtitle="The source of truth for your entire business ecosystem." />

      {/* OVERALL HEALTH */}
      <section className="mb-10">
        <SectionHeader title="Foundation Health" />
        <div className="border border-border bg-card rounded-[16px] p-6 lg:p-8 flex flex-col md:flex-row gap-10">
          <div className="flex flex-col min-w-[200px]">
             <div className="flex items-baseline gap-3 mb-1">
                <span className="text-[56px] font-bold text-foreground leading-none tracking-tight tabular-nums">{data.health.percentage}</span>
                <span className="text-[18px] font-bold text-tertiary">/ 100</span>
             </div>
             <p className="text-[13px] text-muted-foreground font-medium mb-4">Overall Readiness</p>
             <div>
                <StatusBadge status={data.health.overallStatus} />
             </div>
          </div>
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-5 gap-6">
             <div className="flex flex-col gap-1.5">
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Completeness</span>
               <span className="text-[20px] font-bold text-foreground">{data.health.categories.completeness}</span>
             </div>
             <div className="flex flex-col gap-1.5">
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Clarity</span>
               <span className="text-[20px] font-bold text-foreground">{data.health.categories.clarity}</span>
             </div>
             <div className="flex flex-col gap-1.5">
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Consistency</span>
               <span className="text-[20px] font-bold text-foreground">{data.health.categories.consistency}</span>
             </div>
             <div className="flex flex-col gap-1.5">
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Evidence</span>
               <span className="text-[20px] font-bold text-foreground">{data.health.categories.evidence}</span>
             </div>
             <div className="flex flex-col gap-1.5">
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Freshness</span>
               <span className="text-[20px] font-bold text-foreground">{data.health.categories.freshness}</span>
             </div>
          </div>
        </div>
      </section>

      {/* SUMMARY */}
      <section className="mb-14">
        <SectionHeader title="Business Summary" />
        <div className="border border-border bg-card rounded-[16px] p-6 flex flex-col md:flex-row gap-6">
           <div className="flex-1 flex flex-col gap-4 border-r border-border/50 pr-4">
              <div>
                <h4 className="text-[10px] font-bold text-tertiary uppercase tracking-widest mb-1">Business</h4>
                <p className="text-[14px] font-semibold text-foreground">{data.summary.business}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-tertiary uppercase tracking-widest mb-1">Customer / ICP</h4>
                <p className="text-[14px] font-semibold text-foreground">{data.summary.customer}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-tertiary uppercase tracking-widest mb-1">Core Problem</h4>
                <p className="text-[14px] font-medium text-foreground">{data.summary.coreProblem}</p>
              </div>
           </div>
           <div className="flex-1 flex flex-col gap-4 border-r border-border/50 pr-4">
              <div>
                <h4 className="text-[10px] font-bold text-tertiary uppercase tracking-widest mb-1">Desired Result</h4>
                <p className="text-[14px] font-medium text-foreground">{data.summary.desiredResult}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-tertiary uppercase tracking-widest mb-1">Mechanism</h4>
                <p className="text-[14px] font-semibold text-foreground">{data.summary.mechanism}</p>
              </div>
           </div>
           <div className="flex-1 flex flex-col gap-4">
              <div>
                <h4 className="text-[10px] font-bold text-tertiary uppercase tracking-widest mb-1">Offer</h4>
                <p className="text-[14px] font-semibold text-foreground">{data.summary.offer}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-tertiary uppercase tracking-widest mb-1">Positioning</h4>
                <p className="text-[14px] font-medium text-foreground leading-relaxed">{data.summary.positioning}</p>
              </div>
           </div>
        </div>
      </section>

      {/* FOUNDATION DOMAINS GRID */}
      <section className="mb-14">
        <SectionHeader title="Foundation Elements" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <DomainCard 
            title="Business" 
            subtitle="Who you are. Identity, metrics, objectives." 
            status={data.health.moduleStatus.business} 
            onClick={() => setActiveModal("business")} 
          />
          <DomainCard 
            title="Customer" 
            subtitle="Who you serve. Needs, pain, desired state." 
            status={data.health.moduleStatus.customer} 
            onClick={() => setActiveModal("customer")} 
          />
          <DomainCard 
            title="Positioning" 
            subtitle="How you are positioned in market." 
            status={data.health.moduleStatus.positioning} 
            onClick={() => setActiveModal("positioning")} 
          />
          <DomainCard 
            title="Offer" 
            subtitle="What you sell. Mechanics, delivery, claims." 
            status={data.health.moduleStatus.offer} 
            onClick={() => setActiveModal("offer")} 
          />
          <DomainCard 
            title="Brand" 
            subtitle="How you communicate. Voice and tone." 
            status={data.health.moduleStatus.brand} 
            onClick={() => setActiveModal("brand")} 
          />
          <DomainCard 
            title="Knowledge" 
            subtitle={`What ASENZO knows. ${data.knowledgeMeta.sourcesReady} sources ready.`} 
            status={data.health.moduleStatus.knowledge} 
            onClick={() => setActiveModal("knowledge")} 
          />
          <DomainCard 
            title="Proof" 
            subtitle={`What you can prove. ${data.proofMeta.approvedAssets} approved assets.`} 
            status={data.health.moduleStatus.proof} 
            onClick={() => setActiveModal("proof")} 
          />
        </div>
      </section>

      {/* DEPENDENCY IMPACT */}
      <section>
        <SectionHeader title="Attention & Ecosystem Impact" />
        <div className="bg-muted border border-border rounded-[16px] p-6 lg:p-8">
           <p className="text-[13px] text-muted-foreground font-medium mb-6">
             These foundation elements directly control the operational context for the rest of ASENZO. Changing them will safely impact downstream workflows without manual reconstruction.
           </p>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {data.dependencies.map((dep, i) => (
                <div key={i} className="bg-card border border-border rounded-[10px] p-4 flex flex-col gap-3">
                   <h4 className="text-[11px] font-bold text-foreground uppercase tracking-widest">{dep.module}</h4>
                   <ul className="flex flex-col gap-1.5">
                     {dep.impacts.map((im, j) => (
                       <li key={j} className="text-[12px] font-medium text-muted-foreground flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px] text-tertiary">subdirectory_arrow_right</span>
                          {im}
                       </li>
                     ))}
                   </ul>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Editor Modal Mock */}
      <Modal 
        isOpen={activeModal !== null} 
        onClose={() => setActiveModal(null)} 
        title={activeModal ? `Edit ${activeModal}` : ""} 
        size="lg"
        actions={
          <>
             <button className="px-5 py-2.5 border border-border text-foreground font-semibold text-[13px] rounded-lg hover:bg-muted" onClick={() => setActiveModal(null)}>Cancel</button>
             <button className="px-5 py-2.5 bg-foreground text-background font-semibold text-[13px] rounded-lg hover:bg-foreground/90" onClick={() => setActiveModal(null)}>Save {activeModal}</button>
          </>
        }
      >
         <div className="flex flex-col gap-6 py-2">
            <div className="p-4 bg-muted/40 border border-border rounded-lg">
                <p className="text-[13px] text-foreground font-medium mb-1">Why am I filling this out?</p>
                <p className="text-[12.5px] text-muted-foreground leading-relaxed">
                  ASENZO requires explicitly verifiable truths. Changes made here will re-calibrate your AI generation pipelines and intelligence evaluations globally.
                </p>
            </div>
            
            <div className="h-[200px] border border-dashed border-border rounded-lg flex flex-col items-center justify-center text-center px-4">
               <span className="material-symbols-outlined text-[32px] text-tertiary mb-3">construction</span>
               <h3 className="text-[14px] font-semibold text-foreground mb-1">Editor Placeholder</h3>
               <p className="text-[12.5px] text-muted-foreground max-w-sm">
                  This mock demonstrates progressive disclosure. Detailed schema forms exist behind this layer, shielding the founder from overwhelming inputs on the main dashboard.
               </p>
            </div>
         </div>
      </Modal>

    </div>
  );
}
