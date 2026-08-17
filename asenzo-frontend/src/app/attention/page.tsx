"use client";

import React, { useState, useEffect } from "react";
import { getAttention, updateAttention } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";
import { AttentionData, ContentIdea, MarketSignal } from "@/lib/types";

import { Card, CardTitle, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormField, Input, Select, Textarea } from "@/components/ui/Forms";
import { Badge } from "@/components/ui/Badge";
import { Skeleton, CardSkeleton } from "@/components/ui/States";
import { Alert } from "@/components/ui/Alert";
import { Tabs } from "@/components/ui/Tabs";

export default function AttentionPage() {
  const { data, setData, localData, setLocalData, loading, error, reload: loadData } = useAdapter(getAttention);
  
  // Tab states
  const [activeTab, setActiveTab] = useState("overview");

  // Script Builder Context
  const [activeIdeaId, setActiveIdeaId] = useState<string | null>(null);
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftSuccess, setDraftSuccess] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  async function handleAIBuildTrigger(ideaId: string) {
    const idea = localData?.ideas.find(i => i.id === ideaId);
    if (!idea) return;

    // Transition state strictly to drafting visually
    setLocalData(prev => prev ? ({ ...prev, ideas: prev.ideas.map(i => i.id === ideaId ? { ...i, status: "drafting" } : i) }) : prev);
    setIsDrafting(true);

    // Simulate AI networking delay securely
    await new Promise(r => setTimeout(r, 2000));

    // Generate deterministic drafted content using configuration parameters explicitly
    const generatedDraft = `[GENERATED SYSTEM DRAFT]
Title: ${idea.title || "Untitled"}
Vector: ${idea.stage}
Framework: ${idea.framework}

ANGLE INJECTION:
${idea.angle || "No explicit angle mapped. Following standard framework logic."}

OUTPUT GOAL:
${idea.outputGoal || "Drive general pipeline awareness."}

--- SCRIPT DRAFT ---
We noticed an opportunity in the market matching your parameters. Utilizing the ${idea.framework} framework, this asset is designed to natively capture attention at the ${idea.stage} maturity level. 

Given your defined angle, the draft pivots securely resolving against your Founder Voice cadence securely.

Please edit this mock context strictly before approving it for the production pipeline.`;

    // Mutate state securely to requires_review mapping the generated output properly.
    setLocalData(prev => prev ? ({ ...prev, ideas: prev.ideas.map(i => i.id === ideaId ? { ...i, status: "requires_review", contentDraft: generatedDraft } : i) }) : prev);

    setIsDrafting(false);
    setDraftSuccess(true);
    setTimeout(() => setDraftSuccess(false), 3000);
  }

  async function handleApprove(ideaId: string) {
    if (!localData) return;
    setIsApproving(true);
    try {
      const payload = {
        ...localData,
        ideas: localData.ideas.map(i => i.id === ideaId ? { ...i, status: "approved" as const } : i)
      };
      
      const res = await updateAttention(payload); // Adapter boundary enforcement
      setData(res);
      setLocalData(res);
    } catch (err: unknown) {
      alert("Failed to approve. " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsApproving(false);
    }
  }

  async function handleIdeaFieldChange(id: string, field: keyof ContentIdea, value: string) {
    setLocalData(prev => {
      if (!prev) return prev;
      const mutatedIdeas = prev.ideas.map(idea => idea.id === id ? { ...idea, [field]: value } : idea);
      return { ...prev, ideas: mutatedIdeas };
    });
  }

  // Active Idea strictly bounded via localData pointer
  const activeIdea = localData?.ideas.find(i => i.id === activeIdeaId);

  if (loading) {
    return (
      <div className="p-6 md:p-8 lg:p-12 max-w-[1240px] mx-auto animate-in fade-in duration-300">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CardSkeleton />
          </div>
          <div><CardSkeleton /></div>
        </div>
      </div>
    );
  }

  if (error || !data || !localData) {
    return (
      <div className="p-6 md:p-8 lg:p-12 max-w-[1240px] mx-auto">
        <Alert variant="danger" title="Engine Offline">
          {error || "Attention engine could not initialize."}
          <div className="mt-4">
            <Button variant="secondary" size="sm" onClick={loadData}>Restart Engine</Button>
          </div>
        </Alert>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Workload Overview" },
    { id: "opportunities", label: "Market Intelligence" },
    { id: "script_builder", label: "Script Builder" },
  ];

  // Derive workflow stats safely from exact type parameters
  const ideaCount = localData.ideas.filter(i => i.status === "idea").length;
  const draftCount = localData.ideas.filter(i => i.status === "drafting").length;
  const reviewCount = localData.ideas.filter(i => i.status === "requires_review").length;

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "TOF": return "primary";
      case "MOF": return "warning";
      case "BOF": return "success";
      default: return "neutral";
    }
  };

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-[1240px] mx-auto">
      
      {/* HEADER */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl lg:text-[40px] font-display font-bold text-on-surface tracking-tight uppercase">
                Attention
              </h1>
              <Badge variant="primary" size="sm">Organic Growth</Badge>
            </div>
            <p className="text-on-surface-variant text-[14.5px] font-medium max-w-2xl leading-relaxed">
              Generate predictable demand through automated architecture. Map opportunities, frame scripts using corporate DNA, and review drafted pipelines.
            </p>
          </div>
          <Card variant="outlined" className="min-w-[200px]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display font-medium text-[12px] text-on-surface-variant uppercase tracking-widest">Pending Review</h3>
              <Badge variant={reviewCount > 0 ? "warning" : "neutral"} size="sm">{reviewCount}</Badge>
            </div>
            <Button variant="primary" size="sm" className="w-full mt-2" onClick={() => setActiveTab("script_builder")} disabled={reviewCount === 0}>
              Begin Approvals
            </Button>
          </Card>
        </div>
      </header>
      
      {/* NAVIGATION TABS */}
      <div className="mb-6 border-b border-outline-variant">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      <div className="animate-in fade-in duration-300">
        
        {/* OVERVIEW PANEL */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Workload Columns */}
            <div className="lg:col-span-2 space-y-6">
              
              <Card>
                <CardHeader>
                  <CardTitle>Content Lifecycle</CardTitle>
                </CardHeader>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="p-4 border border-outline-variant rounded-xl bg-surface-container">
                    <h4 className="text-[12px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Ideas Logged</h4>
                    <span className="text-3xl font-display font-bold text-on-surface">{ideaCount}</span>
                  </div>
                  <div className="p-4 border border-outline-variant rounded-xl bg-surface-container">
                    <h4 className="text-[12px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Drafting</h4>
                    <span className="text-3xl font-display font-bold text-on-surface">{draftCount}</span>
                  </div>
                  <div className="p-4 border-2 border-warning/50 rounded-xl bg-surface relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-warning" />
                    <h4 className="text-[12px] font-bold uppercase tracking-wider text-warning mb-1">Requires Approval</h4>
                    <span className="text-3xl font-display font-bold text-on-surface">{reviewCount}</span>
                  </div>
                </div>
              </Card>

              {/* Data Table abstraction */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Active Pipeline</CardTitle>
                    <Button variant="secondary" size="sm">New Idea</Button>
                  </div>
                </CardHeader>
                <div className="flex flex-col gap-2 mt-4">
                  {localData.ideas.map(idea => (
                    <div key={idea.id} className="flex items-center justify-between p-3.5 border border-outline-variant rounded-xl bg-surface hover:border-primary/30 transition-colors cursor-pointer" onClick={() => { setActiveIdeaId(idea.id); setActiveTab("script_builder"); }}>
                      <div className="flex items-center gap-4">
                        <Badge variant={getStageColor(idea.stage)} size="sm">{idea.stage}</Badge>
                        <span className="text-[13.5px] font-semibold text-on-surface">{idea.title}</span>
                      </div>
                      <div>
                        {idea.status === "requires_review" && <Badge variant="warning" size="sm">Review Pending</Badge>}
                        {idea.status === "idea" && <Badge variant="neutral" size="sm">Idea</Badge>}
                        {idea.status === "drafting" && <Badge variant="primary" size="sm">Drafting AI</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Market Anomalies</CardTitle>
                  <p className="text-[12px] text-on-surface-variant mt-1 leading-relaxed">
                    Detected signals requiring immediate brand reaction.
                  </p>
                </CardHeader>
                <div className="space-y-4 mt-4">
                  {localData.marketSignals.map(sig => (
                    <div key={sig.id} className="p-3 border border-primary/20 bg-[#F0FDF4] rounded-lg">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-primary uppercase tracking-wider">{sig.topic}</span>
                        <span className="text-[11px] font-medium text-on-surface-variant">{sig.source}</span>
                      </div>
                      <p className="text-[13px] text-on-surface font-medium leading-relaxed">{sig.signalText}</p>
                      <Button variant="ghost" size="sm" className="mt-2 w-full text-xs text-primary">Generate Strike Script</Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            
          </div>
        )}

        {/* OPPORTUNITIES (Market Intel Subtab) */}
        {activeTab === "opportunities" && (
           <Card>
             <CardHeader>
               <CardTitle>Market Intelligence Stream</CardTitle>
             </CardHeader>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {localData.marketSignals.map(sig => (
                  <div key={sig.id} className="p-4 border border-outline-variant bg-surface rounded-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[12px] font-bold text-on-surface uppercase tracking-wider">{sig.topic}</span>
                        <Badge variant="primary" size="sm">Signal</Badge>
                      </div>
                      <p className="text-[13.5px] text-on-surface-variant font-medium leading-relaxed">{sig.signalText}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-outline-variant flex justify-between items-center">
                       <span className="text-[11px] text-outline font-semibold uppercase">{sig.source}</span>
                       <Button variant="secondary" size="sm">Target Submarket</Button>
                    </div>
                  </div>
                ))}
             </div>
           </Card>
        )}

        {/* SCRIPT BUILDER CANVAS */}
        {activeTab === "script_builder" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
            {/* Left Parameters */}
            <div className="lg:col-span-4 space-y-6">
               <Card className="h-full">
                 <CardHeader>
                   <CardTitle>Structural Parameters</CardTitle>
                   <p className="text-[12px] text-on-surface-variant mt-1 leading-snug">Define the input constraints securely against the corporate DNA.</p>
                 </CardHeader>
                 
                 {!activeIdeaId ? (
                   <Alert variant="info" title="No Script Loaded" className="mt-4">
                     Please select an idea from the Workload Overview to load its structural configuration.
                   </Alert>
                 ) : activeIdea ? (
                   <div className="mt-4 space-y-5">
                      <FormField label="Working Title">
                        <Input value={activeIdea.title} onChange={(e) => handleIdeaFieldChange(activeIdea.id, "title", e.target.value)} />
                      </FormField>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField label="Funnel Vector">
                          <Select value={activeIdea.stage} onChange={(e) => handleIdeaFieldChange(activeIdea.id, "stage", e.target.value as any)}>
                            <option value="TOF">Top of Funnel (Awareness)</option>
                            <option value="MOF">Mid Funnel (Trust)</option>
                            <option value="BOF">Bottom Funnel (Conversion)</option>
                          </Select>
                        </FormField>
                        <FormField label="Copy Framework">
                          <Select value={activeIdea.framework} onChange={(e) => handleIdeaFieldChange(activeIdea.id, "framework", e.target.value)}>
                            <option value="Contrarian Truth">Contrarian Truth</option>
                            <option value="Listicle">Listicle / Steps</option>
                            <option value="Hero's Journey">Hero's Journey</option>
                            <option value="AIDA">AIDA Standard</option>
                          </Select>
                        </FormField>
                      </div>

                      <FormField label="Psychological Angle">
                        <Textarea 
                          rows={2} 
                          value={activeIdea.angle || ""} 
                          onChange={(e) => handleIdeaFieldChange(activeIdea.id, "angle", e.target.value)}
                          placeholder="e.g. Target the fallacy that more volume equals more profit..."
                        />
                      </FormField>

                      <FormField label="Strategic Output Goal">
                        <Textarea 
                          rows={2} 
                          value={activeIdea.outputGoal || ""} 
                          onChange={(e) => handleIdeaFieldChange(activeIdea.id, "outputGoal", e.target.value)}
                          placeholder="What must happen when they finish reading?"
                        />
                      </FormField>

                      <div className="mt-6 pt-4 border-t border-outline-variant">
                         <Button 
                           variant="primary" 
                           onClick={() => handleAIBuildTrigger(activeIdea.id)} 
                           isLoading={isDrafting}
                           className="w-full"
                         >
                           {draftSuccess ? "Draft Generated" : "Command Asset Generation"}
                         </Button>
                      </div>
                   </div>
                 ) : null}
               </Card>
            </div>

            {/* Right Canvas */}
            <div className="lg:col-span-8 flex flex-col h-full bg-surface-container rounded-2xl border border-outline-variant overflow-hidden shadow-sm">
                {/* Header status bar */}
                <div className="h-14 border-b border-outline-variant bg-surface px-6 flex items-center justify-between sticky top-0 z-10">
                  <div className="flex items-center gap-3">
                     <span className="material-symbols-outlined text-[18px] text-outline">description</span>
                     <span className="font-display font-semibold text-[13.5px] text-on-surface">Asset Canvas</span>
                  </div>
                  {activeIdea && (
                    <div className="flex items-center gap-3">
                      {activeIdea.status === "requires_review" && <Badge variant="warning" size="sm">Human Review Required</Badge>}
                      <Button 
                        variant={activeIdea.status === "requires_review" ? "primary" : activeIdea.status === "approved" ? "secondary" : "outline"} 
                        size="sm" 
                        disabled={!activeIdea.contentDraft || activeIdea.status === "approved"}
                        isLoading={isApproving}
                        onClick={() => handleApprove(activeIdea.id)}
                      >
                        {activeIdea.status === "approved" ? "Asset Approved" : "Approve for Production"}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Editor Surface */}
                <div className="p-8 flex-grow relative bg-surface">
                   {!activeIdeaId ? (
                     <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                        <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 border border-outline-variant">
                          <span className="material-symbols-outlined text-outline text-[24px]">edit_document</span>
                        </div>
                        <h4 className="font-display font-bold text-on-surface text-lg">No Active Canvas</h4>
                        <p className="text-[13px] text-on-surface-variant mt-1.5 max-w-sm">
                          Select an idea from the Workload Overview on the left to edit script configurations and view generated assets.
                        </p>
                     </div>
                   ) : (
                     <div className="h-full">
                       {isDrafting ? (
                         <div className="flex flex-col items-center justify-center h-[400px] animate-pulse">
                           <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                           <p className="text-[13px] font-bold text-on-surface-variant uppercase tracking-widest">Compiling against Foundation DNA...</p>
                         </div>
                       ) : activeIdea?.contentDraft ? (
                         <div className="max-w-[700px] mx-auto">
                            {activeIdea.status === "requires_review" && (
                              <div className="mb-4 bg-[#EFF6FF] border border-blue-200 text-blue-800 text-[12px] font-semibold p-2.5 rounded-lg flex items-start gap-2">
                                <span className="material-symbols-outlined text-[16px] mt-0.5">info</span>
                                <div>This asset was generated natively holding Founder Voice logic constraints. Manual edits required before final approval.</div>
                              </div>
                            )}
                            <textarea 
                              className="w-full h-[600px] resize-none outline-none text-[15px] leading-[1.8] text-on-surface bg-transparent font-medium"
                              value={activeIdea.contentDraft}
                              onChange={(e) => handleIdeaFieldChange(activeIdea.id, "contentDraft", e.target.value)}
                            />
                         </div>
                       ) : (
                         <div className="flex flex-col items-center justify-center h-[400px] text-center border-2 border-dashed border-outline-variant rounded-xl bg-surface/50">
                           <span className="material-symbols-outlined text-outline text-[32px] mb-3">auto_awesome</span>
                           <h4 className="font-display font-bold text-on-surface text-[15px]">Canvas Blank</h4>
                           <p className="text-[13px] text-on-surface-variant mt-1 max-w-[280px]">
                             Configure parameters strictly on the left and run Asset Generation to inject contextual DNA into an output format.
                           </p>
                         </div>
                       )}
                     </div>
                   )}
                </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
