"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ScriptCenterPage() {
  const [view, setView] = useState<"IDEAS" | "EDITOR">("IDEAS");
  const [showNewIdeaModal, setShowNewIdeaModal] = useState(false);
  const [newIdeaMode, setNewIdeaMode] = useState<"AI" | "MANUAL">("AI");
  const [isResearching, setIsResearching] = useState(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [showRectifyModal, setShowRectifyModal] = useState(false);
  const [rectifyState, setRectifyState] = useState<"QUESTIONS" | "VOICE_MODE" | "LISTENING" | "PROCESSING" | "CAPTURED" | "ANALYZING" | "RESULT">("QUESTIONS");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  
  // Manual Idea states
  const [manualSourceLinks, setManualSourceLinks] = useState<string[]>([""]);

  const handleAutoGenerateScript = () => {
    setIsGeneratingScript(true);
    setTimeout(() => {
      setScriptContent(`[Hook]\nHere is the contrarian truth: Consistency isn't your problem. Clarity is.\n\n[Context]\nYou've been told to post 3 times a day. You burn out, but you do it anyway. And yet, your pipeline is empty. Why? Because you're shouting into the void without a clear message.\n\n[Body]\nWhen you lack clarity, consistency just amplifies the confusion. Your audience doesn't know what you stand for, who you help, or what problem you solve. They just know you're noisy.\n\nInstead of focusing on volume, focus on resonance. Spend 2 hours defining your core offer and the precise pain point it solves. Then, write one post about that.\n\n[CTA]\nStop running on the hamster wheel. If you want the exact framework I use to find message-market fit, DM me 'CLARITY' and I'll send it over.`);
      setIsGeneratingScript(false);
    }, 2500);
  };
  
  // Script Editor states
  const [activeTab, setActiveTab] = useState<"CONTEXT" | "RESOURCES" | "ANALYSIS">("CONTEXT");
  const [scriptContent, setScriptContent] = useState("[Hook]\n\n[Context]\n\n[Body]\n\n[CTA]");

  // Mock Data: Ideas
  const [ideas, setIdeas] = useState([
    {
      id: "1", title: "Consistency isn't your problem. Clarity is.",
      pillar: "Founder Clarity", funnel: "MOF", format: "Contrarian Reel",
      score: 4.8, angle: "Challenges a common creator belief with a strong curiosity gap.",
      status: "DRAFT"
    },
    {
      id: "2", title: "Why scaling before $20k/mo breaks agencies",
      pillar: "Mistakes", funnel: "TOF", format: "Story Carousel",
      score: 4.5, angle: "Pattern interrupt targeting early founders trying to delegate too soon.",
      status: "IDEA"
    }
  ]);
  const [activeIdeaId, setActiveIdeaId] = useState<string | null>(null);
  
  const activeIdea = ideas.find(i => i.id === activeIdeaId);

  const handleGenerateIdea = () => {
    setIsResearching(true);
    setTimeout(() => {
      setIsResearching(false);
      setShowNewIdeaModal(false);
      setIdeas([{
        id: Date.now().toString(),
        title: "The 3 systems every 6-figure coach actually uses",
        pillar: "Frameworks & Systems", funnel: "BOF", format: "Listicle Text",
        score: 4.9, angle: "High-value teardown of invisible systems behind visible success.",
        status: "IDEA"
      }, ...ideas]);
    }, 2000);
  };

  const openEditor = (id: string) => {
    setActiveIdeaId(id);
    setView("EDITOR");
  };

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1400px] mx-auto w-full pb-32">
      
      {/* View 1: IDEA HUB */}
      {view === "IDEAS" && (
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-end border-b border-border/50 pb-6">
            <div>
              <h2 className="text-[20px] font-bold text-foreground">Script Center</h2>
              <p className="text-[14px] text-muted-foreground mt-1">Discover ideas, choose frameworks, write, and review.</p>
            </div>
            <button onClick={() => setShowNewIdeaModal(true)} className="flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-[6px] text-[13px] font-bold hover:bg-foreground/90 transition-colors">
              New Idea
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
             {ideas.map(idea => (
               <div key={idea.id} className="bg-card border border-border rounded-[12px] p-6 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-foreground/30 transition-colors">
                  <div className="flex-1">
                     <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-2 block">IDEA</span>
                     <h3 className="text-[18px] font-bold text-foreground mb-2">"{idea.title}"</h3>
                     <p className="text-[13px] text-muted-foreground mb-4">{idea.angle}</p>
                     
                     <div className="flex flex-wrap gap-4 text-[12px] font-bold text-foreground">
                        <div className="flex flex-col"><span className="text-[9px] uppercase tracking-widest text-muted-foreground">Pillar</span>{idea.pillar}</div>
                        <div className="flex flex-col"><span className="text-[9px] uppercase tracking-widest text-muted-foreground">Funnel</span>{idea.funnel}</div>
                        <div className="flex flex-col"><span className="text-[9px] uppercase tracking-widest text-muted-foreground">Format</span>{idea.format}</div>
                     </div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center shrink-0 w-32 border-l border-border/50 pl-6">
                     <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">AI Score</span>
                     <div className="text-[24px] font-bold text-success mb-3">{idea.score}<span className="text-[14px] text-muted-foreground">/5</span></div>
                     <button onClick={() => openEditor(idea.id)} className="w-full bg-background border border-border text-foreground font-bold text-[12px] py-2 rounded-[6px] hover:bg-muted transition-colors">
                        Write Script
                     </button>
                  </div>
               </div>
             ))}
          </div>
        </div>
      )}

      {/* View 2: SCRIPT EDITOR */}
      {view === "EDITOR" && activeIdea && (
        <div className="flex flex-col gap-6 h-[calc(100vh-140px)]">
           <div className="flex justify-between items-center bg-card border border-border rounded-[12px] p-4">
              <div className="flex items-center gap-4">
                 <button onClick={() => setView("IDEAS")} className="text-muted-foreground hover:text-foreground">
                    <span className="material-symbols-outlined">arrow_back</span>
                 </button>
                 <div>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Drafting</span>
                    <h3 className="text-[14px] font-bold text-foreground overflow-hidden text-ellipsis whitespace-nowrap max-w-[400px]">
                       "{activeIdea.title}"
                    </h3>
                 </div>
              </div>
              <div className="flex gap-3">
                 <button onClick={() => setShowRectifyModal(true)} className="px-4 py-2 border border-border rounded-[6px] text-[12px] font-bold text-tertiary border-tertiary/30 hover:bg-tertiary/10 flex items-center gap-2 transition-colors">Rectify Script</button>
                 <button onClick={() => setShowSubmitModal(true)} className="px-4 py-2 bg-foreground text-background rounded-[6px] text-[12px] font-bold hover:bg-foreground/90 flex items-center gap-2">Submit <span className="material-symbols-outlined text-[14px]">send</span></button>
              </div>
           </div>

           <div className="flex gap-6 flex-1 min-h-0">
              
              {/* Left Sidebar: Context / Analysis / Resources */}
              <div className="w-[320px] shrink-0 flex flex-col bg-card border border-border rounded-[12px] overflow-hidden">
                 <div className="flex text-[11px] font-bold uppercase tracking-widest border-b border-border/50">
                    <button onClick={() => setActiveTab("CONTEXT")} className={`flex-1 py-3 transition-colors ${activeTab === 'CONTEXT' ? 'bg-background text-foreground' : 'text-muted-foreground bg-muted/20 hover:bg-background/50'}`}>Context</button>
                    <button onClick={() => setActiveTab("RESOURCES")} className={`flex-1 py-3 transition-colors border-l border-border/50 ${activeTab === 'RESOURCES' ? 'bg-background text-foreground' : 'text-muted-foreground bg-muted/20 hover:bg-background/50'}`}>Resources</button>
                    <button onClick={() => setActiveTab("ANALYSIS")} className={`flex-1 py-3 transition-colors border-l border-border/50 ${activeTab === 'ANALYSIS' ? 'bg-background text-foreground' : 'text-muted-foreground bg-muted/20 hover:bg-background/50'}`}>Analysis</button>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto p-5">
                    {activeTab === "CONTEXT" && (
                       <div className="space-y-6 text-[13px]">
                          <div><span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">Strategic Angle</span><p className="font-bold text-foreground">{activeIdea.angle}</p></div>
                          <div><span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">Pillar</span><div className="bg-background border border-border/50 px-2 py-1 rounded inline-block font-bold">{activeIdea.pillar}</div></div>
                          <div><span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">Funnel</span><div className="bg-background border border-border/50 px-2 py-1 rounded inline-block font-bold">{activeIdea.funnel}</div></div>
                          <div><span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">Selected Framework</span>
                             <select className="w-full bg-background border border-border/50 text-[13px] font-bold rounded p-2 outline-none">
                                <option>Viral Video Template</option>
                                <option>Contrarian Perspective</option>
                                <option>Authority Builder</option>
                             </select>
                          </div>
                       </div>
                    )}
                    
                    {activeTab === "RESOURCES" && (
                       <div className="space-y-4">
                          <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/50 pb-2">Hook Patterns</h4>
                          {[
                             "Everyone tells you X. Nobody tells you Y.",
                             "X isn't your problem. Y is.",
                             "Stop doing X if you want Y."
                          ].map((hook, i) => (
                             <div key={i} className="p-3 bg-background border border-border/50 rounded-[6px] text-[12px] font-bold text-foreground cursor-pointer hover:border-foreground/40 transition-colors">
                                "{hook}"
                             </div>
                          ))}
                          
                          <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/50 pb-2 pt-4">Call to Actions</h4>
                          <div className="p-3 bg-background border border-border/50 rounded-[6px] text-[12px] font-bold text-foreground cursor-pointer hover:border-foreground/40 transition-colors">
                             "Save this breakdown for your next strategy session."
                          </div>
                          <div className="p-3 bg-background border border-border/50 rounded-[6px] text-[12px] font-bold text-foreground cursor-pointer hover:border-foreground/40 transition-colors">
                             "DM me 'GROWTH' and I'll send you the framework."
                          </div>

                       </div>
                    )}

                    {activeTab === "ANALYSIS" && (
                       <div className="space-y-5">
                          <button className="w-full bg-foreground text-background font-bold text-[12px] py-2.5 rounded-[6px] flex items-center justify-center gap-2 hover:bg-foreground/90">
                             <span className="material-symbols-outlined text-[16px]">science</span> Run Script Analysis
                          </button>
                          
                          <div className="pt-2">
                             <div className="flex justify-between items-center mb-2"><span className="text-[12px] font-bold">Hook Strength</span><span className="text-[12px] font-bold text-success">4.8/5</span></div>
                             <div className="flex justify-between items-center mb-2"><span className="text-[12px] font-bold">Value Depictability</span><span className="text-[12px] font-bold text-warning">3.2/5</span></div>
                             <div className="flex justify-between items-center"><span className="text-[12px] font-bold">Clarity</span><span className="text-[12px] font-bold text-success">4.5/5</span></div>
                          </div>
                          
                          <div className="bg-tertiary/10 border border-tertiary/20 rounded-[8px] p-4 relative mt-2">
                             <div className="absolute top-0 right-0 p-2"><span className="material-symbols-outlined text-tertiary text-[14px]">psychology</span></div>
                             <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary block mb-1">Strategist Feedback</span>
                             <p className="text-[12px] font-medium text-foreground leading-relaxed">
                                The hook is clear and curiosity-driven. However, the solution feels abstract. Add a concrete example of the "clarity" you are describing so the viewer can visualize the outcome.
                             </p>
                          </div>

                          <div className="bg-muted/30 border border-border/50 rounded-[8px] p-4">
                             <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">Founder Voice Alignment</span>
                             <p className="text-[12px] font-medium text-foreground mb-3">
                                Matches your preference for short, punchy sentences and contrarian framing.
                             </p>
                          </div>
                       </div>
                    )}
                 </div>
              </div>

              {/* Central Editor */}
              <div className="flex-1 flex flex-col bg-card border border-border/80 rounded-[12px] overflow-hidden shadow-sm">
                 <div className="p-4 border-b border-border/50 bg-muted/10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <h2 className="text-[14px] font-bold text-foreground">Script / Copy Workspace</h2>
                    </div>
                    <div className="text-[11px] font-bold text-muted-foreground">
                      v1.0
                    </div>
                 </div>
                 


                 <div className="flex-1 p-6 relative group">
                    {isGeneratingScript && (
                       <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
                          <div className="flex flex-col items-center">
                             <span className="material-symbols-outlined text-[32px] animate-spin text-tertiary mb-4">progress_activity</span>
                             <p className="text-[14px] font-bold text-foreground">Synthesizing Strategy & Tone...</p>
                          </div>
                       </div>
                    )}
                    <textarea
                      className="w-full h-full min-h-[600px] resize-none bg-transparent border-none focus:ring-0 text-[16px] text-foreground leading-relaxed font-medium focus:outline-none placeholder:text-muted-foreground/30 relative z-0"
                      placeholder="Start writing your script or post here. The structure should adapt to your selected format..."
                      value={scriptContent}
                      onChange={e => setScriptContent(e.target.value)}
                    />
                 </div>
              </div>

           </div>
        </div>
      )}

      {/* New Idea Modal */}
      {showNewIdeaModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-[12px] max-w-xl w-full shadow-2xl overflow-hidden">
             
             <div className="flex border-b border-border/50">
               <button onClick={() => setNewIdeaMode("AI")} className={`flex-1 py-4 text-[13px] font-bold uppercase tracking-widest transition-colors ${newIdeaMode === 'AI' ? 'bg-background text-foreground' : 'bg-muted/20 text-muted-foreground'}`}>AI Research Idea</button>
               <button onClick={() => setNewIdeaMode("MANUAL")} className={`flex-1 py-4 text-[13px] font-bold uppercase tracking-widest border-l border-border/50 transition-colors ${newIdeaMode === 'MANUAL' ? 'bg-background text-foreground' : 'bg-muted/20 text-muted-foreground'}`}>Manual Idea</button>
             </div>

             {newIdeaMode === "AI" ? (
               <div className="p-8">
                 {isResearching ? (
                    <div className="py-12 flex flex-col items-center justify-center">
                       <span className="material-symbols-outlined text-[32px] animate-spin text-tertiary mb-6">progress_activity</span>
                       <div className="space-y-2 text-center">
                          <p className="text-[14px] font-bold text-foreground">Researching your niche...</p>
                          <p className="text-[12px] font-medium text-muted-foreground">Checking pillar opportunities</p>
                          <p className="text-[12px] font-medium text-muted-foreground">Identifying high-growth formats</p>
                       </div>
                    </div>
                 ) : (
                    <>
                       <div className="space-y-5 mb-8">
                          <div>
                            <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Seed Concept (Optional)</label>
                            <input type="text" placeholder="e.g. 'Most coaching programs waste time on mindset'" className="w-full bg-background border border-border/50 rounded-[6px] p-3 text-[14px] outline-none focus:border-foreground/40" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Target Pillar</label>
                                <select className="w-full bg-background border border-border/50 rounded-[6px] p-3 text-[14px] font-bold outline-none">
                                   <option>Recommend Best Fit</option>
                                   <option>Founder Clarity</option>
                                   <option>Mistakes</option>
                                   <option>Frameworks</option>
                                </select>
                             </div>
                             <div>
                                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Funnel Stage</label>
                                <select className="w-full bg-background border border-border/50 rounded-[6px] p-3 text-[14px] font-bold outline-none">
                                   <option>Recommend</option>
                                   <option>TOF (Attention)</option>
                                   <option>MOF (Trust)</option>
                                   <option>BOF (Intent)</option>
                                </select>
                             </div>
                          </div>
                       </div>
                       <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
                          <button onClick={() => setShowNewIdeaModal(false)} className="px-5 py-2.5 text-[12px] font-bold text-muted-foreground hover:text-foreground">Cancel</button>
                          <button onClick={handleGenerateIdea} className="px-5 py-2.5 bg-foreground text-background text-[12px] font-bold rounded-[6px] hover:bg-foreground/90 flex items-center gap-2">
                             <span className="material-symbols-outlined text-[16px]">travel_explore</span> Research Ideas
                          </button>
                       </div>
                    </>
                 )}
               </div>
             ) : (
                <div className="p-8">
                  <div className="space-y-6 mb-8">
                     
                     {/* Source Links Input Area */}
                     <div>
                        <div className="flex justify-between items-center mb-2">
                           <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Source Links</label>
                           <button 
                             onClick={() => setManualSourceLinks([...manualSourceLinks, ""])}
                             className="text-[10px] font-bold text-foreground hover:text-tertiary flex items-center gap-1 transition-colors">
                             <span className="material-symbols-outlined text-[14px]">add</span> Add link
                           </button>
                        </div>
                        <div className="space-y-2">
                           {manualSourceLinks.map((link, idx) => (
                             <div key={idx} className="flex items-center gap-2">
                                <input 
                                   type="text" 
                                   placeholder="https://instagram.com/reel/..." 
                                   value={link}
                                   onChange={(e) => {
                                      const newLinks = [...manualSourceLinks];
                                      newLinks[idx] = e.target.value;
                                      setManualSourceLinks(newLinks);
                                   }}
                                   className="flex-1 bg-background border border-border/50 rounded-[6px] p-3 text-[13px] outline-none focus:border-foreground/40 placeholder:text-muted-foreground/30" 
                                />
                                {manualSourceLinks.length > 1 && (
                                   <button 
                                     onClick={() => setManualSourceLinks(manualSourceLinks.filter((_, i) => i !== idx))}
                                     className="w-[42px] h-[42px] flex items-center justify-center shrink-0 border border-border/50 rounded-[6px] text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                                      <span className="material-symbols-outlined text-[16px]">close</span>
                                   </button>
                                )}
                             </div>
                           ))}
                        </div>
                     </div>

                     <div>
                       <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">What caught your attention?</label>
                       <textarea 
                          placeholder="What did you notice? A topic, hook, opinion, format, story, idea, or something you want to explore..." 
                          className="w-full h-[90px] resize-none bg-background border border-border/50 rounded-[6px] p-3 text-[14px] outline-none focus:border-foreground/40 placeholder:text-muted-foreground/30" 
                       />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Pillar <span className="text-[10px] lowercase text-muted-foreground/50 ml-1">(Optional)</span></label>
                           <select className="w-full bg-background border border-border/50 rounded-[6px] p-3 text-[14px] font-bold outline-none text-foreground/80">
                              <option>Recommend Best Fit</option>
                              <option>Entrepreneurship</option>
                              <option>Mindset</option>
                              <option>Business</option>
                           </select>
                        </div>
                        <div>
                           <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Funnel Stage <span className="text-[10px] lowercase text-muted-foreground/50 ml-1">(Optional)</span></label>
                           <select className="w-full bg-background border border-border/50 rounded-[6px] p-3 text-[14px] font-bold outline-none text-foreground/80">
                              <option>Recommend Stage</option>
                              <option>TOF</option>
                              <option>MOF</option>
                              <option>BOF</option>
                           </select>
                        </div>
                     </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
                     <button onClick={() => setShowNewIdeaModal(false)} className="px-5 py-2.5 text-[12px] font-bold text-muted-foreground hover:text-foreground">Cancel</button>
                     <button onClick={() => setShowNewIdeaModal(false)} className="px-5 py-2.5 bg-foreground text-background text-[12px] font-bold rounded-[6px] hover:bg-foreground/90">
                        Save Idea
                     </button>
                  </div>
               </div>
             )}
          </div>
        </div>
      )}

      {/* RECTIFY MODAL */}
      {showRectifyModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-[12px] max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
             <div className="p-4 border-b border-border/50 flex justify-between items-center bg-muted/10">
                <div className="flex items-center gap-2 text-tertiary"><span className="material-symbols-outlined text-[18px]">psychology</span><span className="text-[12px] font-bold uppercase tracking-widest">Strategic Rectification</span></div>
                <button onClick={() => setShowRectifyModal(false)} className="text-muted-foreground hover:text-foreground"><span className="material-symbols-outlined">close</span></button>
             </div>
             
             <div className="p-8 overflow-y-auto flex-1 hide-scrollbar">
                {rectifyState === "QUESTIONS" && (
                   <div className="space-y-6">
                      <p className="text-[14px] font-medium text-foreground mb-6">Before we finalize this script, the system needs to understand your true strategic intent. Answer briefly.</p>
                      
                      <div className="flex gap-2 p-1 bg-muted/20 rounded-[8px] border border-border/50 max-w-[200px] mb-6">
                         <button className="flex-1 py-1.5 text-[11px] font-bold uppercase tracking-widest bg-background text-foreground shadow-sm rounded border border-border/50">Text</button>
                         <button onClick={() => setRectifyState("VOICE_MODE")} className="flex-1 py-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">Voice</button>
                      </div>

                      <div>
                         <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Why does this matter right now?</label>
                         <input type="text" className="w-full bg-background border border-border/50 rounded-[6px] p-3 text-[14px] outline-none focus:border-foreground/40" placeholder="e.g. Too many founders are burning out on useless tasks..." />
                      </div>
                      <div>
                         <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">What is your actual core belief you are trying to share?</label>
                         <input type="text" className="w-full bg-background border border-border/50 rounded-[6px] p-3 text-[14px] outline-none focus:border-foreground/40" placeholder="e.g. Consistency without clarity is just noise." />
                      </div>
                      <div>
                         <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">What specific emotion should the viewer feel?</label>
                         <select className="w-full bg-background border border-border/50 rounded-[6px] p-3 text-[14px] outline-none focus:border-foreground/40"><option>Relief / Validated</option><option>Challenged</option><option>Curious</option><option>Urgent</option></select>
                      </div>
                      <div className="pt-6 flex justify-end">
                         <button onClick={() => { setRectifyState("ANALYZING"); setTimeout(() => setRectifyState("RESULT"), 2500); }} className="px-5 py-2.5 bg-tertiary text-background text-[12px] font-bold rounded-[6px] hover:bg-tertiary/90">Analyze & Rectify</button>
                      </div>
                   </div>
                )}

                {rectifyState === "VOICE_MODE" && (
                   <div className="space-y-6 flex flex-col items-center justify-center py-8">
                      <div className="flex gap-2 p-1 bg-muted/20 rounded-[8px] border border-border/50 max-w-[200px] mb-4 self-start">
                         <button onClick={() => setRectifyState("QUESTIONS")} className="flex-1 py-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">Text</button>
                         <button className="flex-1 py-1.5 text-[11px] font-bold uppercase tracking-widest bg-background text-foreground shadow-sm rounded border border-border/50">Voice</button>
                      </div>

                      <div className="text-center max-w-md w-full">
                         <h3 className="text-[16px] font-bold text-foreground mb-4">"Why does this matter right now?"</h3>
                         
                         <button onClick={() => { setRectifyState("LISTENING"); setTimeout(() => setRectifyState("PROCESSING"), 3000); setTimeout(() => setRectifyState("CAPTURED"), 5000); }} className="w-20 h-20 bg-tertiary/10 border-2 border-tertiary/30 rounded-full flex items-center justify-center mx-auto hover:bg-tertiary/20 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(var(--tertiary),0.2)]">
                            <span className="material-symbols-outlined text-[32px] text-tertiary">mic</span>
                         </button>
                         <p className="text-[12px] font-bold uppercase tracking-widest text-tertiary mt-4">Tap to begin</p>
                      </div>
                   </div>
                )}

                {rectifyState === "LISTENING" && (
                   <div className="space-y-6 flex flex-col items-center justify-center py-8 text-center h-full">
                      <h3 className="text-[16px] font-bold text-foreground mb-4 opacity-50">"Why does this matter right now?"</h3>
                      <div className="w-20 h-20 bg-tertiary text-background rounded-full flex items-center justify-center mx-auto animate-pulse flex-shrink-0">
                         <span className="material-symbols-outlined text-[32px]">mic</span>
                      </div>
                      <p className="text-[12px] font-bold uppercase tracking-widest text-tertiary mt-4">Listening...</p>
                      <div className="w-full max-w-sm h-12 flex items-center justify-center gap-1 opacity-70">
                         <div className="w-1 h-3 bg-tertiary rounded-full animate-bounce"></div>
                         <div className="w-1 h-6 bg-tertiary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                         <div className="w-1 h-4 bg-tertiary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                         <div className="w-1 h-8 bg-tertiary rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
                         <div className="w-1 h-5 bg-tertiary rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                         <div className="w-1 h-3 bg-tertiary rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
                      </div>
                   </div>
                )}

                {rectifyState === "PROCESSING" && (
                   <div className="space-y-6 flex flex-col items-center justify-center py-8 text-center h-full">
                      <span className="material-symbols-outlined text-[32px] animate-spin text-tertiary flex-shrink-0">progress_activity</span>
                      <p className="text-[12px] font-bold uppercase tracking-widest text-foreground mt-4">Processing audio...</p>
                   </div>
                )}

                {rectifyState === "CAPTURED" && (
                   <div className="space-y-6 flex flex-col items-center justify-center py-8 max-w-xl mx-auto">
                      <h3 className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground self-start">Captured Response:</h3>
                      <div className="w-full bg-muted/20 border border-border/50 p-5 rounded-[8px] text-[14px] font-medium leading-relaxed text-foreground shadow-inner">
                         "Founders are burning themselves out trying to post 3 times a day like everyone says, but they aren't getting anywhere because their underlying message isn't clear to begin with. It's a waste of energy."
                      </div>
                      <div className="flex gap-4 self-end mt-4">
                         <button onClick={() => setRectifyState("VOICE_MODE")} className="px-4 py-2 text-[12px] font-bold text-muted-foreground hover:text-foreground">Re-record</button>
                         <button onClick={() => { setRectifyState("ANALYZING"); setTimeout(() => setRectifyState("RESULT"), 2500); }} className="px-5 py-2.5 bg-tertiary text-background text-[12px] font-bold rounded-[6px] hover:bg-tertiary/90">Analyze & Rectify</button>
                      </div>
                   </div>
                )}
                
                {rectifyState === "ANALYZING" && (
                   <div className="py-16 flex flex-col items-center justify-center space-y-4">
                      <span className="material-symbols-outlined text-[32px] animate-spin text-tertiary">progress_activity</span>
                      <p className="text-[14px] font-bold text-foreground">Aligning with founder voice and strategic intent...</p>
                   </div>
                )}
                
                {rectifyState === "RESULT" && (
                   <div className="space-y-6">
                      <div className="bg-tertiary/10 border border-tertiary/30 p-4 rounded-[8px]">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary block mb-2">Why This Changed</span>
                         <p className="text-[13px] text-foreground font-medium">Your original script gave generic advice. The rectified version introduces your actual core belief around clarity over consistency, establishing immediate authority and validation for burnt-out founders.</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6 h-[300px]">
                         <div className="flex flex-col border border-border/50 rounded-[8px] overflow-hidden">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted/30 p-2 border-b border-border/50 block text-center">Original</span>
                            <div className="p-4 flex-1 overflow-y-auto text-[13px] whitespace-pre-wrap text-muted-foreground">
                               {scriptContent.substring(0, 150)}...
                            </div>
                         </div>
                         <div className="flex flex-col border border-tertiary/30 rounded-[8px] overflow-hidden">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary bg-tertiary/10 p-2 border-b border-tertiary/30 block text-center">Rectified (Founder Voice)</span>
                            <div className="p-4 flex-1 overflow-y-auto text-[13px] whitespace-pre-wrap font-medium text-foreground">
                               [Hook]{'\n'}Stop posting 3 times a day. You don't have a consistency problem. You have a clarity problem.{'\n\n'}[Context]{'\n'}You are shouting into the void because you haven't defined exactly who you help.
                            </div>
                         </div>
                      </div>
                      <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                         <button onClick={() => { setShowRectifyModal(false); setRectifyState("QUESTIONS"); }} className="px-5 py-2.5 text-[12px] font-bold text-muted-foreground hover:text-foreground">Keep Original</button>
                         <button onClick={() => { setShowRectifyModal(false); setRectifyState("QUESTIONS"); setScriptContent("[Hook]\nStop posting 3 times a day. You don't have a consistency problem. You have a clarity problem.\n\n[Context]\nYou are shouting into the void because you haven't defined exactly who you help."); }} className="px-5 py-2.5 bg-foreground text-background text-[12px] font-bold rounded-[6px] hover:bg-foreground/90">Verify & Accept Changes</button>
                      </div>
                   </div>
                )}
             </div>
          </div>
        </div>
      )}

      {/* SUBMIT MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-[12px] max-w-lg w-full shadow-2xl overflow-hidden">
             <div className="p-6 border-b border-border/50">
                <h3 className="text-[16px] font-bold text-foreground">Submit for Production</h3>
                <p className="text-[13px] text-muted-foreground mt-1">Handoff this script to the production pipeline.</p>
             </div>
             <div className="p-6 space-y-6">
                <div>
                   <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Destination Status</label>
                   <select className="w-full bg-background border border-border/50 rounded-[6px] p-3 text-[14px] font-bold outline-none">
                      <option>Draft Stack</option>
                      <option>Production Pipeline</option>
                   </select>
                </div>
                <div>
                   <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Confirmed Funnel Role</label>
                   <div className="flex gap-2">
                     <button className="flex-1 py-2 border border-border rounded bg-muted/30 text-[12px] font-bold text-muted-foreground hover:bg-muted text-center transition-colors">TOF</button>
                     <button className="flex-1 py-2 border border-foreground/30 rounded bg-foreground text-background text-[12px] font-bold text-center transition-colors">MOF</button>
                     <button className="flex-1 py-2 border border-border rounded bg-muted/30 text-[12px] font-bold text-muted-foreground hover:bg-muted text-center transition-colors">BOF</button>
                   </div>
                </div>
             </div>
             <div className="p-6 border-t border-border/50 flex justify-end gap-3 bg-muted/10">
                <button onClick={() => setShowSubmitModal(false)} className="px-5 py-2.5 text-[12px] font-bold text-muted-foreground hover:text-foreground">Cancel</button>
                <button onClick={() => { setShowSubmitModal(false); setView("IDEAS"); }} className="px-5 py-2.5 bg-foreground text-background text-[12px] font-bold rounded-[6px] hover:bg-foreground/90 flex items-center gap-2">Confirm & Send</button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}

