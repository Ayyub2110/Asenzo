"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ContentIdea } from "@/lib/types";

export default function IdeaWorkspacePage() {
  const { id } = useParams();
  const router = useRouter();
  const [idea, setIdea] = useState<ContentIdea | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("asenzo_content_ideas");
    if (saved) {
      const ideas: ContentIdea[] = JSON.parse(saved);
      const found = ideas.find(i => i.id === id);
      if (found) {
        setIdea(found);
      }
    }
  }, [id]);

  if (!idea) {
    return (
      <div className="p-12 flex flex-col items-center justify-center h-[50vh]">
        <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground text-[14px]">Loading Idea Workspace...</p>
      </div>
    );
  }

  const handleArchive = () => {
    const existingStr = localStorage.getItem("asenzo_content_ideas");
    if (existingStr) {
      const ideas: ContentIdea[] = JSON.parse(existingStr);
      const updated = ideas.map(i => i.id === id ? { ...i, status: "ARCHIVED" } : i);
      localStorage.setItem("asenzo_content_ideas", JSON.stringify(updated));
    }
    router.push("/acquisition/strategy");
  };

  return (
    <div className="bg-background min-h-screen pb-32">
      {/* Header */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur border-b border-border p-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex gap-3 items-center mb-1">
             <Link href="/acquisition/strategy">
               <span className="text-[12px] font-bold text-muted-foreground hover:text-foreground uppercase tracking-widest cursor-pointer">Strategy</span>
             </Link>
             <span className="text-muted-foreground">/</span>
             <span className="text-[10px] uppercase font-bold bg-secondary text-foreground px-2 py-1 rounded tracking-widest">
                {idea.status}
             </span>
             {idea.funnelStage && (
               <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest bg-tertiary/10 px-2 py-1 rounded border border-tertiary/20">
                 {idea.funnelStage}
               </span>
             )}
          </div>
          <h1 className="text-[22px] font-bold text-foreground">{idea.title}</h1>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <button onClick={handleArchive} className="px-4 py-2 text-muted-foreground hover:text-foreground font-bold text-[13px] transition-colors border border-transparent mr-2">Archive</button>
          
          <Link href={`/acquisition/scripts?ideaId=${id}`}>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-[8px] hover:bg-foreground/90 font-bold text-[13px] transition-colors shadow-sm">
               <span className="material-symbols-outlined text-[16px]">edit_document</span>
               Write Script
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-[1360px] mx-auto w-full p-6 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Strategic Brief (Left / Center) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* AI Context / Research Section */}
            {(idea.researchSummary || idea.aiRecommendation) && (
              <section className="bg-secondary/10 border border-secondary/30 rounded-[12px] p-6 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                   <span className="material-symbols-outlined text-[64px]">smart_toy</span>
                 </div>
                 <h2 className="text-[11px] font-bold text-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                   <span className="material-symbols-outlined text-[14px]">model_training</span>
                   AI Generation Context
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                   {idea.aiRecommendation && (
                     <div>
                       <h3 className="text-[14px] font-bold text-foreground mb-1">Why this was recommended</h3>
                       <p className="text-[14px] text-muted-foreground leading-relaxed">{idea.aiRecommendation}</p>
                     </div>
                   )}
                   {idea.marketObservation && (
                     <div>
                       <h3 className="text-[14px] font-bold text-foreground mb-1">Market Observation</h3>
                       <p className="text-[14px] text-muted-foreground leading-relaxed">{idea.marketObservation}</p>
                     </div>
                   )}
                 </div>
              </section>
            )}

            <section className="bg-card border border-border/80 rounded-[12px] overflow-hidden">
               <div className="p-4 border-b border-border/50 bg-muted/20">
                 <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                   Core Insight 
                 </h2>
               </div>
               <div className="p-6">
                 <p className="text-[15px] text-foreground leading-relaxed whitespace-pre-wrap">{idea.coreInsight || "No insight documented."}</p>
                 
                 {idea.problem && (
                   <div className="mt-8 pt-6 border-t border-border/50">
                     <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Problem Addressed</h3>
                     <p className="text-[14px] text-foreground font-medium">{idea.problem}</p>
                   </div>
                 )}
               </div>
            </section>
            
            <section className="bg-card border border-border/80 rounded-[12px] overflow-hidden">
               <div className="p-4 border-b border-border/50 bg-muted/20">
                 <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">Message & Angle</h2>
               </div>
               <div className="p-6">
                  <div className="mb-6">
                     <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Primary Angle</h3>
                     <p className="text-[14px] text-foreground font-medium bg-muted/30 p-4 rounded border border-border/50">{idea.angle || "No angle defined."}</p>
                  </div>
                  
                  {idea.hookDraft && (
                    <div className="pt-6 border-t border-border/50">
                       <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                         <span className="material-symbols-outlined text-[14px]">psychology</span> Draft Hooks
                       </h3>
                       <p className="text-[14px] text-foreground whitespace-pre-wrap leading-relaxed bg-muted/10 p-4 rounded">{idea.hookDraft}</p>
                    </div>
                  )}
               </div>
            </section>

            {/* Validation Scoring Engine */}
            {(idea.viralityScore !== undefined || idea.contentInterestScore !== undefined) && (
              <section className="bg-card border border-border/80 rounded-[12px] overflow-hidden">
                 <div className="p-4 border-b border-border/50 bg-muted/20 flex justify-between items-center">
                   <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                     <span className="material-symbols-outlined text-[14px]">radar</span> Predictive Scoring
                   </h2>
                 </div>
                 <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       
                       {/* Virality */}
                       <div>
                         <div className="flex justify-between items-end mb-3 border-b border-border/50 pb-2">
                           <h3 className="text-[13px] font-bold text-foreground">VIRALITY</h3>
                           <span className="text-[20px] font-bold leading-none text-foreground">{idea.viralityScore || '--'}</span>
                         </div>
                         <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Why?</h4>
                         <ul className="space-y-2">
                           {idea.viralityFactors && idea.viralityFactors.length > 0 ? (
                             idea.viralityFactors.map((vf: any, i: number) => (
                               <li key={i} className="flex justify-between gap-4 text-[12px] text-foreground">
                                 <span>{vf.label}</span>
                                 <span className="text-muted-foreground whitespace-nowrap">(+{vf.score})</span>
                               </li>
                             ))
                           ) : (
                             <li className="text-[12px] text-muted-foreground italic">Insufficient historical data</li>
                           )}
                         </ul>
                       </div>

                       {/* Content Interest */}
                       <div>
                         <div className="flex justify-between items-end mb-3 border-b border-border/50 pb-2">
                           <h3 className="text-[13px] font-bold text-foreground">CONTENT INTEREST</h3>
                           <span className="text-[20px] font-bold leading-none text-foreground">{idea.contentInterestScore || '--'}</span>
                         </div>
                         <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Why?</h4>
                         <ul className="space-y-2">
                           {idea.interestFactors && idea.interestFactors.length > 0 ? (
                             idea.interestFactors.map((vf: any, i: number) => (
                               <li key={i} className="flex justify-between gap-4 text-[12px] text-foreground">
                                 <span>{vf.label}</span>
                                 <span className="text-muted-foreground whitespace-nowrap">(+{vf.score})</span>
                               </li>
                             ))
                           ) : (
                             <li className="text-[12px] text-muted-foreground italic">No search intent data aligned</li>
                           )}
                         </ul>
                       </div>

                       {/* Business Relevance */}
                       <div>
                         <div className="flex justify-between items-end mb-3 border-b border-border/50 pb-2">
                           <h3 className="text-[13px] font-bold text-foreground">BUSINESS RELEVANCE</h3>
                           <span className="text-[20px] font-bold leading-none text-foreground">{idea.businessRelevanceScore || '--'}</span>
                         </div>
                         <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Why?</h4>
                         <ul className="space-y-2">
                           {idea.businessRelevanceFactors && idea.businessRelevanceFactors.length > 0 ? (
                             idea.businessRelevanceFactors.map((vf: any, i: number) => (
                               <li key={i} className="flex justify-between gap-4 text-[12px] text-foreground">
                                 <span>{vf.label}</span>
                                 <span className="text-muted-foreground whitespace-nowrap">(+{vf.score})</span>
                               </li>
                             ))
                           ) : (
                             <li className="text-[12px] text-muted-foreground italic">Topic is highly abstracted</li>
                           )}
                         </ul>
                       </div>

                       {/* Confidence */}
                       <div>
                         <div className="flex justify-between items-end mb-3 border-b border-border/50 pb-2">
                           <h3 className="text-[13px] font-bold text-foreground">CONFIDENCE</h3>
                           <span className="text-[20px] font-bold leading-none text-foreground">{idea.confidenceScore || '--'}</span>
                         </div>
                         <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Evidence</h4>
                         <ul className="space-y-2 list-disc pl-4">
                           {idea.scoringEvidence && idea.scoringEvidence.length > 0 ? (
                             idea.scoringEvidence.map((ev: string, i: number) => (
                               <li key={i} className="text-[12px] text-foreground leading-snug">{ev}</li>
                             ))
                           ) : (
                             <li className="text-[12px] text-muted-foreground italic list-none -ml-4">Predictive model only</li>
                           )}
                         </ul>
                       </div>

                    </div>
                 </div>
              </section>
            )}

            {/* Research Sources Block */}
            {idea.researchSummary && (
              <section className="bg-card border border-border/80 rounded-[12px] overflow-hidden">
                 <div className="p-4 border-b border-border/50 bg-muted/20 flex justify-between items-center">
                   <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                     <span className="material-symbols-outlined text-[14px]">travel_explore</span> Research Backing
                   </h2>
                 </div>
                 <div className="p-6">
                    <h3 className="text-[14px] font-bold text-foreground mb-2">Research Summary</h3>
                    <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">{idea.researchSummary}</p>
                    
                    {idea.sources && idea.sources.length > 0 && (
                      <div>
                         <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Source Material</h3>
                         <div className="flex flex-col gap-2">
                           {idea.sources.map((src: any, idx: number) => (
                              <a key={idx} href={src.url || "#"} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 border border-border/50 rounded hover:bg-muted/50 transition-colors group">
                                <div className="flex items-center gap-3 overflow-hidden">
                                  <span className="material-symbols-outlined text-muted-foreground text-[18px]">link</span>
                                  <span className="text-[13px] font-medium text-foreground truncate group-hover:underline">{src.url}</span>
                                </div>
                                <span className="text-[10px] uppercase font-bold text-muted-foreground bg-background px-2 py-1 rounded border border-border">{src.type || "Source"}</span>
                              </a>
                           ))}
                         </div>
                      </div>
                    )}
                 </div>
              </section>
            )}

          </div>

          {/* Right Sidebar Details */}
          <div className="space-y-6">
            
            <div className="bg-card border border-border/80 rounded-[12px] overflow-hidden">
               <div className="p-4 border-b border-border/50 bg-muted/20 flex justify-between items-center">
                 <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">Strategy Mapping</h2>
               </div>
               <div className="p-5 flex flex-col gap-4">
                 
                 <div>
                   <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Target ICP</h3>
                   <p className="text-[13px] font-medium text-foreground">{idea.icp || "Not specified"}</p>
                 </div>
                 
                 <div className="pt-3 border-t border-border/30">
                   <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Awareness Stage</h3>
                   <p className="text-[13px] font-bold text-foreground">{idea.awarenessStage || "Not specified"}</p>
                 </div>
                 
                 <div className="pt-3 border-t border-border/30">
                   <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Business Objective</h3>
                   <p className="text-[13px] font-bold text-foreground">{idea.objective || "Not specified"}</p>
                 </div>
                 
                 <div className="pt-3 border-t border-border/30">
                   <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Funnel Role</h3>
                   <p className="text-[13px] font-medium text-foreground">{idea.funnelStage || "Not specified"}</p>
                 </div>

               </div>
            </div>

            <div className="bg-card border border-border/80 rounded-[12px] overflow-hidden">
               <div className="p-4 border-b border-border/50 bg-muted/20 flex justify-between items-center">
                 <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">Evidence & Action</h2>
               </div>
               
               <div className="p-5 flex flex-col gap-5">
                  <div>
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex justify-between">
                       <span>Target Format</span>
                    </h3>
                    <p className="text-[13px] font-medium text-foreground">
                      {idea.primaryChannel ? `${idea.primaryChannel} - ` : ""}
                      {idea.contentFormat || "Not specified"}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-border/30">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex justify-between">
                       <span>Call to Action</span>
                    </h3>
                    <p className="text-[13px] font-medium text-foreground bg-muted/40 p-2 rounded">{idea.primaryCta || "Not specified"}</p>
                  </div>

                  <div className="pt-4 border-t border-border/30">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex justify-between">
                       <span>Related Offer</span>
                    </h3>
                    <p className="text-[13px] font-medium text-foreground">{idea.relatedOffer || "Not attached"}</p>
                  </div>
               </div>
            </div>
            
            <Link href={`/acquisition/scripts?ideaId=${id}`} className="block">
                <button className="w-full flex items-center justify-center gap-2 border border-foreground bg-foreground text-background rounded-[8px] py-4 text-[14px] font-bold hover:bg-foreground/90 transition-colors shadow-md">
                  <span className="material-symbols-outlined text-[18px]">edit_document</span> 
                  Write Script Now
                </button>
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}
