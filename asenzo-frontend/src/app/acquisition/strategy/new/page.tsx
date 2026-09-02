"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GenerateIdeaRequest, ContentItem } from "@/lib/types";
import { mockFoundation } from "@/lib/mock/data";

export default function GenerateIdeaWorkspace() {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<"RESEARCH" | "CONCEPT">("RESEARCH");
  const [conceptNotes, setConceptNotes] = useState("");
  const [showAiModal, setShowAiModal] = useState(false);

  const [requestObj, setRequestObj] = useState<Partial<GenerateIdeaRequest>>({
    workspaceId: "ws_1",
    icp: mockFoundation.icp.description,
    awarenessStage: "Problem-aware",
    funnelStage: "TOF",
    contentPillar: "Founder Growth",
    objective: "Problem awareness",
    channel: "LinkedIn",
    format: "Text post",
    cta: "Comment for guide",
    offer: mockFoundation.offer.overview,
    topic: "",
    requestedCount: 3,
  });

  const handleChange = (field: keyof GenerateIdeaRequest, value: any) => {
    setRequestObj(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = () => {
    // DO NOT show fake results.
    // Display the AI NOT CONNECTED state per master requirements.
    setShowAiModal(true);
  };

  return (
    <div className="bg-background min-h-screen pb-32 relative">
      
      {/* AI NOT CONNECTED MODAL */}
      {showAiModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-[12px] max-w-md w-full shadow-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <span className="material-symbols-outlined text-[100px]">warning</span>
            </div>
            <div className="relative z-10 flex flex-col items-start gap-4">
              <span className="material-symbols-outlined text-warning text-[32px]">warning</span>
              <div>
                <h2 className="text-[18px] font-bold text-foreground uppercase tracking-widest mb-2">AI Automation Not Connected</h2>
                <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">
                  This feature is ready for n8n integration. Connect an n8n workflow to enable:
                </p>
                <ul className="text-[13px] text-foreground font-medium flex flex-col gap-2 mb-8 ml-1">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-foreground rounded-full"></span> Trend research</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-foreground rounded-full"></span> Idea generation</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-foreground rounded-full"></span> Research sources</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-foreground rounded-full"></span> Virality scoring</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-foreground rounded-full"></span> Content interest scoring</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-foreground rounded-full"></span> Script generation</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-foreground rounded-full"></span> Voice adaptation</li>
                </ul>
                <button 
                  onClick={() => setShowAiModal(false)}
                  className="w-full py-3 bg-foreground text-background font-bold uppercase tracking-widest text-[12px] rounded hover:bg-foreground/90 transition-colors"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur border-b border-border p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-foreground">Find your next high-potential content idea</h1>
          <p className="text-[13px] text-muted-foreground mt-1 max-w-3xl">Give AI a topic, URL, rough thought, or ask it to research current opportunities.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/acquisition/strategy">
            <button className="px-4 py-2 border border-border/50 text-foreground rounded hover:bg-muted font-bold text-[13px] transition-colors">Cancel</button>
          </Link>
          <button 
            onClick={handleGenerate}
            className="flex items-center justify-center px-6 py-2 bg-foreground text-background rounded hover:bg-foreground/90 font-bold text-[13px] transition-colors"
          >
            Find Ideas
          </button>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto w-full p-6 mt-8 flex flex-col gap-8">
         
         {/* Method Toggle */}
         <div className="flex bg-muted/30 border border-border/50 rounded-lg p-1 w-full max-w-md mx-auto mb-4">
           <button 
             onClick={() => setActiveTab("RESEARCH")}
             className={`flex-1 py-2 text-[12px] font-bold uppercase tracking-widest rounded-md transition-colors ${activeTab === "RESEARCH" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
           >
             AI Research Driven
           </button>
           <button 
             onClick={() => setActiveTab("CONCEPT")}
             className={`flex-1 py-2 text-[12px] font-bold uppercase tracking-widest rounded-md transition-colors ${activeTab === "CONCEPT" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
           >
             User Concept Driven
           </button>
         </div>

         {activeTab === "RESEARCH" && (
           <>
            <section className="bg-card border border-border/80 rounded-[12px] p-8">
                <h2 className="text-[14px] font-bold text-foreground uppercase tracking-widest mb-6 border-b border-border/50 pb-4">Target Audience</h2>
                <div className="flex flex-col gap-1.5 focus-within:text-foreground">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">ICP Context (Pulled from Foundation)</label>
                  <textarea 
                    value={requestObj.icp}
                    onChange={e => handleChange('icp', e.target.value)}
                    className="w-full bg-muted/30 border border-border/50 rounded-[6px] px-4 py-3 text-[14px] text-foreground h-20 resize-y focus:outline-none focus:border-foreground/50 transition-colors font-medium"
                  />
                </div>
            </section>

            <section className="bg-card border border-border/80 rounded-[12px] p-8">
                <h2 className="text-[14px] font-bold text-foreground uppercase tracking-widest mb-6 border-b border-border/50 pb-4">Strategy Parameters</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex flex-col gap-1.5 focus-within:text-foreground">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Awareness Stage</label>
                    <select 
                      value={requestObj.awarenessStage}
                      onChange={e => handleChange('awarenessStage', e.target.value)}
                      className="w-full bg-background border border-border/50 rounded-[6px] px-4 py-3 text-[14px] text-foreground focus:outline-none focus:border-foreground/50 transition-colors"
                    >
                      <option value="Unaware">Unaware (Cold)</option>
                      <option value="Problem-aware">Problem-aware</option>
                      <option value="Solution-aware">Solution-aware</option>
                      <option value="Product-aware">Product-aware</option>
                      <option value="Most-aware">Most-aware (Hot)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5 focus-within:text-foreground">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Funnel Role</label>
                    <select 
                      value={requestObj.funnelStage}
                      onChange={e => handleChange('funnelStage', e.target.value)}
                      className="w-full bg-background border border-border/50 rounded-[6px] px-4 py-3 text-[14px] text-foreground focus:outline-none focus:border-foreground/50 transition-colors"
                    >
                      <option value="TOF">Top of Funnel (TOF)</option>
                      <option value="MOF">Middle of Funnel (MOF)</option>
                      <option value="BOF">Bottom of Funnel (BOF)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5 focus-within:text-foreground">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Content Objective</label>
                    <select
                      value={requestObj.objective}
                      onChange={e => handleChange('objective', e.target.value)}
                      className="w-full bg-background border border-border/50 rounded-[6px] px-4 py-3 text-[14px] text-foreground focus:outline-none focus:border-foreground/50 transition-colors"
                    >
                      <option value="Reach">Reach & Growth</option>
                      <option value="Problem awareness">Problem awareness</option>
                      <option value="Authority">Build Authority</option>
                      <option value="Demand creation">Demand creation</option>
                      <option value="Objection handling">Objection handling</option>
                      <option value="Conversion">Direct Conversion</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5 focus-within:text-foreground">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Content Pillar</label>
                    <input 
                      type="text"
                      value={requestObj.contentPillar}
                      onChange={e => handleChange('contentPillar', e.target.value)}
                      placeholder="e.g. Founder Growth"
                      className="w-full bg-background border border-border/50 rounded-[6px] px-4 py-3 text-[14px] text-foreground focus:outline-none focus:border-foreground/50 transition-colors"
                    />
                  </div>
                </div>
            </section>
           </>
         )}

         {activeTab === "CONCEPT" && (
           <section className="bg-card border border-border/80 rounded-[12px] p-8">
             <h2 className="text-[14px] font-bold text-foreground uppercase tracking-widest mb-6 border-b border-border/50 pb-4">Seed Concept</h2>
             <div className="flex flex-col gap-1.5 focus-within:text-foreground mb-4">
               <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">URL, Observation, Tweet, or Rough Notes</label>
               <textarea 
                 value={conceptNotes}
                 onChange={e => setConceptNotes(e.target.value)}
                 placeholder="e.g. I saw someone saying that agencies need to post every day..."
                 className="w-full bg-background border border-border/50 rounded-[6px] px-4 py-3 text-[14px] text-foreground h-40 resize-y focus:outline-none focus:border-foreground/50 transition-colors"
               />
             </div>
             <p className="text-[13px] text-muted-foreground bg-muted/30 p-3 rounded border border-border/30">
               The AI will interpret this concept, determine the best awareness and funnel stage based on your Foundation, evaluate the trend relevance, and spin out distinct, scored ideas.
             </p>
           </section>
         )}

         <section className="bg-card border border-border/80 rounded-[12px] p-8">
            <h2 className="text-[14px] font-bold text-foreground uppercase tracking-widest mb-6 border-b border-border/50 pb-4">Format & Distribution</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col gap-1.5 focus-within:text-foreground">
                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Channel</label>
                <select 
                  value={requestObj.channel}
                  onChange={e => handleChange('channel', e.target.value)}
                  className="w-full bg-background border border-border/50 rounded-[6px] px-4 py-3 text-[14px] text-foreground focus:outline-none focus:border-foreground/50 transition-colors"
                >
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="X">X</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Newsletter">Newsletter</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5 focus-within:text-foreground">
                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Format</label>
                <select 
                  value={requestObj.format}
                  onChange={e => handleChange('format', e.target.value)}
                  className="w-full bg-background border border-border/50 rounded-[6px] px-4 py-3 text-[14px] text-foreground focus:outline-none focus:border-foreground/50 transition-colors"
                >
                  <option value="Short video">Short video</option>
                  <option value="Long video">Long video</option>
                  <option value="Carousel">Carousel</option>
                  <option value="Text post">Text post</option>
                  <option value="Story sequence">Story sequence</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="flex flex-col gap-1.5 focus-within:text-foreground">
                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Call to Action (CTA)</label>
                <input 
                  type="text"
                  value={requestObj.cta}
                  onChange={e => handleChange('cta', e.target.value)}
                  className="w-full bg-background border border-border/50 rounded-[6px] px-4 py-3 text-[14px] text-foreground focus:outline-none focus:border-foreground/50 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5 focus-within:text-foreground">
                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Related Offer</label>
                <input 
                  type="text"
                  value={requestObj.offer}
                  onChange={e => handleChange('offer', e.target.value)}
                  className="w-full bg-muted/30 border border-border/50 rounded-[6px] px-4 py-3 text-[14px] text-foreground focus:outline-none focus:border-foreground/50 transition-colors"
                />
              </div>
            </div>
         </section>

         <section className="bg-card border border-border/80 rounded-[12px] p-8">
            <h2 className="text-[14px] font-bold text-foreground uppercase tracking-widest mb-6 border-b border-border/50 pb-4">Agent Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5 focus-within:text-foreground">
                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Requested Volume</label>
                <select 
                  value={requestObj.requestedCount}
                  onChange={e => handleChange('requestedCount', Number(e.target.value))}
                  className="w-full bg-background border border-border/50 rounded-[6px] px-4 py-3 text-[14px] text-foreground focus:outline-none focus:border-foreground/50 transition-colors"
                >
                  <option value={1}>1 High-Conviction Idea</option>
                  <option value={3}>3 Idea Variations</option>
                  <option value={5}>5 Rapid Concepts</option>
                  <option value={10}>10 Brainstorm Options</option>
                </select>
              </div>
              {activeTab === "RESEARCH" && (
                <div className="flex flex-col gap-1.5 focus-within:text-foreground">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Specific Topic Guidance (Optional)</label>
                  <input 
                    type="text"
                    value={requestObj.topic}
                    onChange={e => handleChange('topic', e.target.value)}
                    placeholder="Leave blank for pure AI discovery..."
                    className="w-full bg-background border border-border/50 rounded-[6px] px-4 py-3 text-[14px] text-foreground focus:outline-none focus:border-foreground/50 transition-colors"
                  />
                </div>
              )}
            </div>
         </section>
      </div>
    </div>
  );
}
