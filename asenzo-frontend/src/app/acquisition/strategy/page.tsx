"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ContentIdea } from "@/lib/types";

export default function AcquisitionStrategyPage() {
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [sortBy, setSortBy] = useState<string>("recommended");

  useEffect(() => {
    // Load ideas from local storage
    const saved = localStorage.getItem("asenzo_content_ideas");
    if (saved) {
      try {
        setIdeas(JSON.parse(saved));
      } catch (e) {}
    } else {
      // Seed with some default if empty
      const defaultIdeas: ContentIdea[] = [
        { 
          id: '1', title: 'Why founders burn out before 1M', 
          angle: 'More content does not fix broken conversion architecture', 
          awarenessStage: 'Problem-aware', funnelStage: 'TOF', 
          status: 'APPROVED', objective: 'Problem diagnosis',
          primaryCta: 'Review framework', icp: 'B2B service founders',
          viralityScore: 87, contentInterestScore: 94, businessRelevanceScore: 91, confidenceScore: 72,
          sourceCount: 5
        },
        { 
          id: '2', title: 'Our exact mechanism for delegation', 
          angle: 'Framework', 
          awarenessStage: 'Solution-aware', funnelStage: 'MOF', 
          status: 'drafting', objective: 'Demonstrate proof',
          primaryCta: 'Download guide', icp: 'Agency owners',
          viralityScore: 66, contentInterestScore: 82, businessRelevanceScore: 88, confidenceScore: 60,
          sourceCount: 2
        },
      ];
      setIdeas(defaultIdeas);
      localStorage.setItem("asenzo_content_ideas", JSON.stringify(defaultIdeas));
    }
  }, []);

  const handleRemoveIdea = (id: string) => {
    const updated = ideas.filter(i => i.id !== id);
    setIdeas(updated);
    localStorage.setItem("asenzo_content_ideas", JSON.stringify(updated));
  };

  const getSortedIdeas = () => {
    return [...ideas].sort((a, b) => {
      if (sortBy === "virality") return (b.viralityScore || 0) - (a.viralityScore || 0);
      if (sortBy === "interest") return (b.contentInterestScore || 0) - (a.contentInterestScore || 0);
      if (sortBy === "relevance") return (b.businessRelevanceScore || 0) - (a.businessRelevanceScore || 0);
      if (sortBy === "confidence") return (b.confidenceScore || 0) - (a.confidenceScore || 0);
      if (sortBy === "newest") return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      if (sortBy === "awareness") return (a.awarenessStage || "").localeCompare(b.awarenessStage || "");
      if (sortBy === "funnel") return (a.funnelStage || "").localeCompare(b.funnelStage || "");
      if (sortBy === "pillar") return (a.contentPillar || "").localeCompare(b.contentPillar || "");
      if (sortBy === "channel") return (a.primaryChannel || "").localeCompare(b.primaryChannel || "");
      
      // Recommended logic: Sum and avg scores, plus some arbitrary boost logic for strategic need
      if (sortBy === "recommended") {
        const scoreA = ((a.viralityScore || 0) + (a.contentInterestScore || 0) * 1.5 + (a.businessRelevanceScore || 0) * 2 + (a.confidenceScore || 0)) / 5.5;
        const scoreB = ((b.viralityScore || 0) + (b.contentInterestScore || 0) * 1.5 + (b.businessRelevanceScore || 0) * 2 + (b.confidenceScore || 0)) / 5.5;
        return scoreB - scoreA;
      }
      return 0;
    });
  };

  const sortedIdeas = getSortedIdeas();

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1360px] mx-auto w-full pb-32">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-[20px] font-bold text-foreground">Content Strategy</h2>
          <p className="text-[14px] text-muted-foreground mt-1">Determine what to create, who for, and toward what outcome.</p>
        </div>
        <Link href="/acquisition/strategy/new">
          <button className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-[6px] text-[13px] font-bold hover:bg-foreground/90 transition-colors">
            Generate Idea
          </button>
        </Link>
      </div>

      {ideas.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-border border-dashed rounded-[12px] bg-card text-center">
          <h3 className="text-[18px] font-bold text-foreground mb-2">No content ideas yet</h3>
          <p className="text-[14px] text-muted-foreground mb-6 max-w-sm">
            Your strategy is configured. Generate your first researched idea by selecting: Awareness, Funnel, Pillar, and Objective.
          </p>
          <Link href="/acquisition/strategy/new">
            <button className="flex items-center gap-2 bg-foreground text-background px-6 py-2.5 rounded-[6px] text-[13px] font-bold hover:bg-foreground/90 transition-colors">
              Generate Idea
            </button>
          </Link>
        </div>
      ) : (
        <>
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Idea Library</h2>
              <select 
                value={sortBy} 
                onChange={e => setSortBy(e.target.value)} 
                className="bg-transparent border border-border/50 text-[11px] font-bold uppercase tracking-widest text-foreground outline-none py-1 px-2 rounded cursor-pointer pointer-events-auto"
              >
                <option value="recommended">Recommended Ideas</option>
                <option value="virality">Highest Virality</option>
                <option value="interest">Highest Content Interest</option>
                <option value="relevance">Highest Business Relevance</option>
                <option value="confidence">Highest Confidence</option>
                <option value="newest">Newest</option>
                <option value="awareness">Awareness Stage</option>
                <option value="funnel">Funnel Stage</option>
                <option value="pillar">Content Pillar</option>
                <option value="channel">Channel</option>
              </select>
            </div>
            <div className="flex flex-col gap-6">
              {sortedIdeas.map((i) => (
                <div key={i.id} className="group border border-border rounded-[12px] bg-card p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden h-full">
                   {/* Left Col: Idea details */}
                   <div className="flex-1 flex flex-col items-start min-w-0">
                     <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-2">IDEA</span>
                     <h3 className="text-[18px] font-bold text-foreground mb-3 leading-tight truncate w-full">"{i.title}"</h3>
                     <div className="flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground font-semibold mb-6">
                       <span>{i.awarenessStage || "Awareness TBD"}</span>
                       <span>•</span>
                       <span className="text-tertiary">{i.funnelStage || "Funnel TBD"}</span>
                       <span className="px-2 py-0.5 rounded border border-border bg-muted/30 uppercase text-[10px] ml-2 tracking-widest">{i.status}</span>
                     </div>
                     
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-auto pt-4 border-t border-border/50">
                        <div><span className="block text-[10px] font-bold text-muted-foreground tracking-widest uppercase mb-1">Pillar</span><span className="text-[13px] font-bold text-foreground truncate block">{i.contentPillar || "Strategic Setup"}</span></div>
                        <div><span className="block text-[10px] font-bold text-muted-foreground tracking-widest uppercase mb-1">Objective</span><span className="text-[13px] font-medium text-foreground truncate block">{i.objective || "Brand Setup"}</span></div>
                        <div><span className="block text-[10px] font-bold text-muted-foreground tracking-widest uppercase mb-1">Format</span><span className="text-[13px] font-medium text-foreground truncate block">{i.contentFormat || "Default"}</span></div>
                        <div><span className="block text-[10px] font-bold text-muted-foreground tracking-widest uppercase mb-1">CTA</span><span className="text-[13px] font-medium text-foreground truncate block">{i.primaryCta || "Watch VSL"}</span></div>
                     </div>
                   </div>

                   {/* Right Col: Research & Actions */}
                   <div className="md:w-[280px] shrink-0 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 md:pl-6 justify-between">
                     
                     <div className="grid grid-cols-2 gap-y-3 gap-x-2 w-full">
                       <div>
                         <span className="block text-[9px] font-bold text-muted-foreground tracking-widest uppercase mb-1">Virality</span>
                         <span className="text-[14px] font-bold text-foreground block">{i.viralityScore || '--'}</span>
                       </div>
                       <div>
                         <span className="block text-[9px] font-bold text-muted-foreground tracking-widest uppercase mb-1">Content Interest</span>
                         <span className="text-[14px] font-bold text-foreground block">{i.contentInterestScore || '--'}</span>
                       </div>
                       <div>
                         <span className="block text-[9px] font-bold text-muted-foreground tracking-widest uppercase mb-1">Biz Relevance</span>
                         <span className="text-[14px] font-bold text-foreground block">{i.businessRelevanceScore || '--'}</span>
                       </div>
                       <div>
                         <span className="block text-[9px] font-bold text-muted-foreground tracking-widest uppercase mb-1">Confidence</span>
                         <span className="text-[14px] font-bold text-foreground block">{i.confidenceScore || '--'}</span>
                       </div>
                     </div>

                     <div>
                       <span className="block text-[10px] font-bold text-muted-foreground tracking-widest uppercase mb-1">
                         Research
                       </span>
                       <span className="text-[13px] font-medium text-foreground">{i.sources ? i.sources.length : (i.sourceCount || 0)} sources attached</span>
                     </div>
                     <div className="flex flex-col gap-2">
                       <div className="grid grid-cols-2 gap-2">
                         <Link href={`/acquisition/strategy/${i.id}`} className="flex-1">
                            <button className="w-full px-3 py-1.5 border border-border/50 rounded flex items-center justify-center text-[12px] font-bold hover:bg-muted text-foreground transition-colors">View Idea</button>
                         </Link>
                         <button onClick={() => alert('Opening Sources UI...')} className="flex-1 w-full px-3 py-1.5 border border-border/50 rounded flex items-center justify-center text-[12px] font-bold hover:bg-muted text-foreground transition-colors">Research</button>
                       </div>
                       <div className="grid grid-cols-2 gap-2">
                         <Link href={`/acquisition/scripts?ideaId=${i.id}`} className="col-span-2">
                            <button className="w-full px-3 py-2 bg-foreground text-background rounded flex items-center justify-center text-[12px] font-bold hover:bg-foreground/90 transition-colors">
                               Write Script
                            </button>
                         </Link>
                         <button onClick={() => handleRemoveIdea(i.id)} className="col-span-2 text-[11px] font-bold text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 py-1.5 rounded transition-colors mt-1">Remove Idea</button>
                       </div>
                     </div>
                   </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
