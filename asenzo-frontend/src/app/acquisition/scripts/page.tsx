"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ContentIdea, RequiredScript } from "@/lib/types";

function ScriptCenterContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialIdeaId = searchParams?.get("ideaId");
  
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(initialIdeaId || null);
  const [showAiModal, setShowAiModal] = useState(false);
  
  // The active script object
  const [script, setScript] = useState<RequiredScript | null>(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    // Load ideas
    const existingStr = localStorage.getItem("asenzo_content_ideas");
    if (existingStr) {
      setIdeas(JSON.parse(existingStr));
    }
  }, []);

  useEffect(() => {
    if (!selectedIdeaId) {
       setScript(null);
       setContent("");
       return;
    }
    
    // Load script for this idea if exists
    const scriptsStr = localStorage.getItem("asenzo_scripts");
    const allScripts: RequiredScript[] = scriptsStr ? JSON.parse(scriptsStr) : [];
    
    const existingScript = allScripts.find(s => s.ideaId === selectedIdeaId);
    
    if (existingScript) {
      setScript(existingScript);
      setContent(existingScript.content);
    } else {
      // Create new draft
      const activeIdea = ideas.find(i => i.id === selectedIdeaId);
      
      let baseContent = `[HOOK]\n\n[PROBLEM]\n\n[INSIGHT]\n\n[MECHANISM/PROOF]\n\n[CALL TO ACTION]`;
      if (activeIdea?.hookDraft) {
         baseContent = `[HOOK]\n${activeIdea.hookDraft}\n\n[PROBLEM]\n${activeIdea.problem || ''}\n\n[INSIGHT]\n${activeIdea.coreInsight || ''}\n\n[CALL TO ACTION]\n${activeIdea.primaryCta || ''}`;
      }
      
      const newScript: RequiredScript = {
        id: `script_${Date.now()}`,
        ideaId: selectedIdeaId!,
        workspaceId: "ws_1",
        version: 1,
        content: baseContent,
        status: "DRAFT",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setScript(newScript);
      setContent(baseContent);
      
      // Update Idea status to SCRIPTING
      if (activeIdea && activeIdea.status !== "SCRIPTING") {
         const updatedIdeas = ideas.map(i => i.id === activeIdea.id ? { ...i, status: "SCRIPTING" } : i);
         localStorage.setItem("asenzo_content_ideas", JSON.stringify(updatedIdeas));
         setIdeas(updatedIdeas as object as ContentIdea[]); // Force TS happiness
      }
    }
    
  }, [selectedIdeaId, ideas]);

  const activeIdea = ideas.find(i => i.id === selectedIdeaId);

  const saveScript = (status: RequiredScript['status'] = script?.status || "DRAFT") => {
    if (!script) return;
    
    const updatedScript: RequiredScript = {
       ...script,
       content,
       status,
       version: script.version + 1,
       updatedAt: new Date().toISOString()
    };
    
    const scriptsStr = localStorage.getItem("asenzo_scripts");
    let allScripts: RequiredScript[] = scriptsStr ? JSON.parse(scriptsStr) : [];
    
    // replace if exists
    const exists = allScripts.find(s => s.id === script.id);
    if (exists) {
       allScripts = allScripts.map(s => s.id === script.id ? updatedScript : s);
    } else {
       allScripts.push(updatedScript);
    }
    
    localStorage.setItem("asenzo_scripts", JSON.stringify(allScripts));
    setScript(updatedScript);
    
    // If approved, update the idea as well and push to Production
    if (status === "APPROVED" && activeIdea) {
       const updatedIdeas = ideas.map(i => i.id === activeIdea.id ? { ...i, status: "APPROVED" } : i);
       localStorage.setItem("asenzo_content_ideas", JSON.stringify(updatedIdeas));
       setIdeas(updatedIdeas as object as ContentIdea[]);
       
       // Create Production Item automatically
       const prodStr = localStorage.getItem("asenzo_production_items");
       const productionItems: any[] = prodStr ? JSON.parse(prodStr) : [];
       
       const existingProd = productionItems.find(p => p.ideaId === activeIdea.id);
       if (!existingProd) {
          const newProd = {
             id: `prod_${Date.now()}`,
             ideaId: activeIdea.id,
             scriptId: updatedScript.id,
             workspaceId: activeIdea.workspaceId || "ws_1",
             title: activeIdea.title,
             format: activeIdea.contentFormat || "Standard Format",
             channel: activeIdea.primaryChannel || "Default Channel",
             stage: "RECORDING", // Enters production directly into recording/creation phase since script is approved
             createdAt: new Date().toISOString(),
             updatedAt: new Date().toISOString()
          };
          productionItems.push(newProd);
          localStorage.setItem("asenzo_production_items", JSON.stringify(productionItems));
       }
       
       alert("Script Approved! Moved to Production pipeline.");
    } else {
       alert("Script saved successfully.");
    }
  };

  const triggerAIFeature = () => {
    setShowAiModal(true);
  };

  return (
    <div className="bg-background min-h-[calc(100vh-64px)] pb-32 flex flex-col">
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
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-foreground rounded-full"></span> Script generation</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-foreground rounded-full"></span> Voice adaptation</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-foreground rounded-full"></span> Editing workflows</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-foreground rounded-full"></span> Content repurposing</li>
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
      {/* Header with Idea Selector */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur border-b border-border p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1 w-full max-w-xl">
           <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">SELECT STRATEGIC IDEA</label>
           <select 
             value={selectedIdeaId || ""}
             onChange={e => setSelectedIdeaId(e.target.value)}
             className="w-full bg-card border border-border/80 rounded-[6px] px-4 py-2.5 text-[14px] text-foreground font-bold focus:outline-none focus:border-foreground/50 transition-colors"
           >
             <option value="" disabled>-- Select an Idea to script --</option>
             {ideas.filter(i => i.status !== "ARCHIVED" && i.status !== "PUBLISHED").map(i => (
               <option key={i.id} value={i.id}>
                 {i.title} ({i.status})
               </option>
             ))}
           </select>
        </div>
        
        {script && (
          <div className="flex gap-2">
            <button onClick={() => saveScript("DRAFT")} className="px-4 py-2 border border-border/50 text-foreground font-bold text-[13px] rounded-[6px] hover:bg-muted transition-colors">
              Save Draft
            </button>
            
            {script.status !== "APPROVED" ? (
               <button onClick={() => saveScript("REVIEW_REQUIRED")} className="px-4 py-2 bg-secondary text-foreground font-bold text-[13px] rounded-[6px] hover:bg-secondary/80 transition-colors">
                 Submit for Review
               </button>
            ) : null}
            
            {script.status === "REVIEW_REQUIRED" || script.status === "DRAFT" ? (
               <button onClick={() => saveScript("APPROVED")} className="px-4 py-2 bg-foreground text-background font-bold text-[13px] rounded-[6px] hover:bg-foreground/90 transition-colors">
                 Approve Script
               </button>
            ) : (
               <div className="px-4 py-2 bg-tertiary/10 text-tertiary border border-tertiary/20 font-bold text-[13px] rounded-[6px] flex items-center gap-2">
                 <span className="material-symbols-outlined text-[16px]">check_circle</span>
                 Approved
               </div>
            )}
          </div>
        )}
      </div>

      {!activeIdea ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12">
           <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[24px] text-muted-foreground">edit_document</span>
           </div>
           <h3 className="text-[18px] font-bold text-foreground mb-2">No Idea Selected</h3>
           <p className="text-[14px] text-muted-foreground text-center max-w-sm">
             Select a strategic idea from the dropdown above to load context and begin scripting.
           </p>
        </div>
      ) : (
        <div className="flex-1 max-w-[1500px] w-full mx-auto p-6 md:p-8 flex flex-col lg:flex-row gap-8">
           
           {/* Left Sidebar: Strategic Context & Research */}
           <div className="w-full lg:w-[350px] shrink-0 flex flex-col gap-6">
              
              <div className="bg-card border border-border/80 rounded-[12px] overflow-hidden">
                 <div className="p-4 border-b border-border/50 bg-muted/20">
                    <h2 className="text-[11px] font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px]">map</span>
                      Strategic Brief
                    </h2>
                 </div>
                 <div className="p-5 flex flex-col gap-4 text-[13px]">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Target Audience (ICP)</span>
                      <span className="font-medium text-foreground">{activeIdea.icp || "Unspecified"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Awareness</span>
                      <span className="font-bold text-foreground">{activeIdea.awarenessStage || "Unspecified"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Funnel Role</span>
                      <span className="font-bold text-foreground">{activeIdea.funnelStage || "Unspecified"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Objective</span>
                      <span className="font-bold text-foreground">{activeIdea.objective || "Unspecified"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Format</span>
                      <span className="font-bold text-foreground">{activeIdea.contentFormat || "Unspecified"}</span>
                    </div>
                 </div>
              </div>

              <div className="bg-card border border-border/80 rounded-[12px] overflow-hidden">
                 <div className="p-4 border-b border-border/50 bg-muted/20">
                    <h2 className="text-[11px] font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px]">lightbulb</span>
                      Core Concept
                    </h2>
                 </div>
                 <div className="p-5 space-y-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Angle / Big Idea</span>
                      <p className="text-[13px] font-medium text-foreground leading-relaxed">{activeIdea.angle || activeIdea.coreInsight || "No angle available."}</p>
                    </div>
                    
                    <div className="flex justify-between border-t border-border/50 pt-3 mt-3">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Hook Style</span>
                      <span className="font-bold text-foreground">AI Recommended</span>
                    </div>
                    <div className="flex justify-between border-t border-border/50 pt-3 mt-3">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Framework</span>
                      <span className="font-bold text-foreground">AI Recommended</span>
                    </div>
                    <div className="flex justify-between border-t border-border/50 pt-3 mt-3">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Proof</span>
                      <span className="font-bold text-foreground">AI Recommended</span>
                    </div>
                    <div className="flex justify-between border-t border-border/50 pt-3 mt-3">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Offer</span>
                      <span className="font-bold text-foreground">{activeIdea.relatedOffer ? "Custom" : "AI Recommended"}</span>
                    </div>
                    <div className="flex justify-between border-t border-border/50 pt-3 mt-3">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Objection</span>
                      <span className="font-bold text-foreground">AI Recommended</span>
                    </div>
                    <div className="flex justify-between border-t border-border/50 pt-3 mt-3">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Voice Context</span>
                      <span className="font-bold text-success flex items-center gap-1">Strong <span className="material-symbols-outlined text-[12px]">check_circle</span></span>
                    </div>
                    
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1 border-t border-border/50 pt-3 mt-3">Call to Action</span>
                      <div className="bg-muted/40 p-2 text-[12px] font-bold text-foreground rounded">
                        {activeIdea.primaryCta || "Unspecified"}
                      </div>
                    </div>
                 </div>
              </div>
              
              {activeIdea.researchSummary && (
                <div className="bg-secondary/10 border border-secondary/30 rounded-[12px] overflow-hidden">
                   <div className="p-4 border-b border-secondary/30">
                      <h2 className="text-[11px] font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px]">science</span>
                        Research Backing
                      </h2>
                   </div>
                   <div className="p-5">
                      <p className="text-[13px] text-foreground leading-relaxed mb-4">{activeIdea.researchSummary}</p>
                      {activeIdea.sources && (
                        <div className="flex flex-col gap-2">
                           {activeIdea.sources.map((s:any, i:number) => (
                              <a key={i} href={s.url} target="_blank" rel="noreferrer" className="text-[11px] text-muted-foreground hover:text-foreground font-medium truncate flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">link</span> {s.url}
                              </a>
                           ))}
                        </div>
                      )}
                   </div>
                </div>
              )}
           </div>

           {/* Right Editor Area */}
           <div className="flex-1 flex flex-col bg-card border border-border/80 rounded-[12px] overflow-hidden shadow-sm">
              <div className="p-4 border-b border-border/50 bg-muted/10 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <h2 className="text-[14px] font-bold text-foreground">Script / Copy Workspace</h2>
                   {script && (
                     <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded 
                       ${script.status === 'APPROVED' ? 'bg-tertiary/20 text-tertiary' : 
                         script.status === 'REVIEW_REQUIRED' ? 'bg-warning/20 text-warning' : 'bg-muted text-muted-foreground'}`}>
                       {script.status.replace("_", " ")}
                     </span>
                   )}
                 </div>
                 <div className="text-[11px] font-bold text-muted-foreground">
                   v{script?.version || 1}.0
                 </div>
              </div>
              
              <div className="bg-muted/30 p-2 flex flex-wrap gap-2 border-b border-border/50 items-center justify-between">
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2 mr-2 flex items-center">Generation Mode:</span>
                  <button onClick={triggerAIFeature} className="text-[11px] font-bold text-foreground px-2 py-1 bg-background border border-border rounded shadow-sm hover:bg-muted transition-colors">AI DRAFT</button>
                  <button onClick={triggerAIFeature} className="text-[11px] font-bold text-foreground px-2 py-1 bg-background border border-border rounded shadow-sm hover:bg-muted transition-colors">HOOKS ONLY</button>
                  <button onClick={triggerAIFeature} className="text-[11px] font-bold text-foreground px-2 py-1 bg-background border border-border rounded shadow-sm hover:bg-muted transition-colors">SCRIPT ONLY</button>
                  <button onClick={triggerAIFeature} className="text-[11px] font-bold text-foreground px-2 py-1 bg-background border border-border rounded shadow-sm hover:bg-muted transition-colors">CTA OPTIONS</button>
                  <button onClick={triggerAIFeature} className="text-[11px] font-bold text-foreground px-2 py-1 bg-background border border-border rounded shadow-sm hover:bg-muted transition-colors">REPURPOSE</button>
                </div>
              </div>

              <div className="bg-muted/30 p-2 flex flex-wrap gap-2 border-b border-border/50 items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2 mr-2 flex items-center">AI Assisted Editing:</span>
                  <button onClick={triggerAIFeature} className="text-[10px] font-bold text-muted-foreground hover:text-foreground px-2 py-1 border border-transparent hover:border-border/50 rounded transition-colors bg-secondary/10 flex items-center gap-1"><span className="material-symbols-outlined text-[10px]">auto_awesome</span> MAKE MORE LIKE ME</button>
                  <button onClick={triggerAIFeature} className="text-[10px] font-bold text-muted-foreground hover:text-foreground px-2 py-1 border border-transparent hover:border-border/50 rounded transition-colors">REWRITE IN MY VOICE</button>
                  <button onClick={triggerAIFeature} className="text-[10px] font-bold text-muted-foreground hover:text-foreground px-2 py-1 border border-transparent hover:border-border/50 rounded transition-colors">MAKE MORE DIRECT</button>
                  <button onClick={triggerAIFeature} className="text-[10px] font-bold text-muted-foreground hover:text-foreground px-2 py-1 border border-transparent hover:border-border/50 rounded transition-colors">STRONGER HOOK</button>
                  <button onClick={triggerAIFeature} className="text-[10px] font-bold text-muted-foreground hover:text-foreground px-2 py-1 border border-transparent hover:border-border/50 rounded transition-colors">LESS SALESY</button>
                  <button onClick={triggerAIFeature} className="text-[10px] font-bold text-muted-foreground hover:text-foreground px-2 py-1 border border-transparent hover:border-border/50 rounded transition-colors">MORE CONTRARIAN</button>
                  <button onClick={triggerAIFeature} className="text-[10px] font-bold text-muted-foreground hover:text-foreground px-2 py-1 border border-transparent hover:border-border/50 rounded transition-colors">ADD STORY</button>
                  <button onClick={triggerAIFeature} className="text-[10px] font-bold text-muted-foreground hover:text-foreground px-2 py-1 border border-transparent hover:border-border/50 rounded transition-colors">ADD PROOF</button>
                  <button onClick={triggerAIFeature} className="text-[10px] font-bold text-muted-foreground hover:text-foreground px-2 py-1 border border-transparent hover:border-border/50 rounded transition-colors">SIMPLIFY</button>
              </div>

              <div className="flex-1 p-6 relative group">
                 <textarea
                   className="w-full h-full min-h-[600px] resize-none bg-transparent border-none focus:ring-0 text-[16px] text-foreground leading-relaxed font-medium focus:outline-none placeholder:text-muted-foreground/30"
                   placeholder="Start writing your script or post here. The structure should adapt to your selected format..."
                   value={content}
                   onChange={e => setContent(e.target.value)}
                   disabled={script?.status === 'APPROVED'}
                 />
                 {script?.status === 'APPROVED' && (
                    <div className="absolute inset-0 bg-background/5 backdrop-blur-[1px] flex items-center justify-center p-6 z-10 pointer-events-none">
                       {/* Overlay when disabled. We still want selection so we don't block pointer completely, just visual indiction maybe */}
                    </div>
                 )}
              </div>
           </div>

        </div>
      )}
    </div>
  );
}

export default function ScriptCenterPage() {
  return (
    <Suspense fallback={<div>Loading Script Center...</div>}>
      <ScriptCenterContent />
    </Suspense>
  );
}
