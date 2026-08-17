"use client";

import React, { useState } from "react";
import { getConversion, updateOpportunity, updateFollowUp, updateQualification } from "@/lib/adapters";
import { Opportunity, FollowUp, OpportunityStage, Qualification } from "@/lib/types";

import { Card, CardTitle, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormField, Input, Select, Textarea } from "@/components/ui/Forms";
import { Badge } from "@/components/ui/Badge";
import { Skeleton, CardSkeleton } from "@/components/ui/States";
import { Alert } from "@/components/ui/Alert";
import { Tabs } from "@/components/ui/Tabs";
import { Modal } from "@/components/ui/Modal";
import { useAdapter } from "@/hooks/useAdapter";

const STAGES: { value: OpportunityStage; label: string }[] = [
  { value: "QUALIFIED", label: "Qualified" },
  { value: "CALL_SCHEDULED", label: "Call Scheduled" },
  { value: "CALL_COMPLETED", label: "Call Completed" },
  { value: "PROPOSAL", label: "Proposal" },
  { value: "CLOSED_WON", label: "Closed Won" }
];

export default function ConversionPage() {
  const { data, setData, localData, setLocalData, loading, error, reload: loadData } = useAdapter(getConversion);

  const [activeTab, setActiveTab] = useState("pipeline");
  const [selectedOppId, setSelectedOppId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [isEditingQual, setIsEditingQual] = useState(false);
  const [qualDraft, setQualDraft] = useState<Qualification | null>(null);

  const activeOpp = localData?.opportunities.find(o => o.id === selectedOppId);

  // Mutations
  async function handleStageChange(newStage: OpportunityStage) {
    if (!activeOpp || !localData) return;
    setMutationError(null);
    setIsSaving(true);
    try {
      const updatedOpp = { ...activeOpp, stage: newStage };
      const res = await updateOpportunity(updatedOpp);
      setLocalData(res);
      setData(res);
    } catch (err: unknown) {
      setMutationError("Failed to change stage: " + (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleFollowUpComplete(followUp: FollowUp) {
    setMutationError(null);
    setIsSaving(true);
    try {
      const updated = { ...followUp, status: "COMPLETED" as const };
      const res = await updateFollowUp(updated);
      setLocalData(res);
      setData(res);
    } catch (err: unknown) {
      setMutationError("Failed to update follow-up: " + (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleQualificationSave() {
    if (!activeOpp || !localData || !qualDraft) return;
    setMutationError(null);
    setIsSaving(true);
    try {
      const res = await updateQualification(activeOpp.id, qualDraft);
      setLocalData(res);
      setData(res);
      setIsEditingQual(false);
    } catch (err: unknown) {
      setMutationError("Failed to save qualification: " + (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  }

  function handleQualEditStart() {
    if (!activeOpp) return;
    setMutationError(null);
    setQualDraft({ ...activeOpp.qualification });
    setIsEditingQual(true);
  }

  function handleQualEditCancel() {
    setMutationError(null);
    setQualDraft(null);
    setIsEditingQual(false);
  }

  if (loading) {
    return (
      <div className="p-6 md:p-8 lg:p-12 max-w-[1400px] mx-auto animate-in fade-in duration-300">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-48 mb-8" />
        <CardSkeleton />
      </div>
    );
  }

  if (error || !data || !localData) {
    return (
      <div className="p-6 md:p-8 lg:p-12 max-w-[1400px] mx-auto">
        <Alert variant="danger" title="Conversion Offline">
          {error || "Unable to load Conversion data."}
          <div className="mt-4">
            <Button variant="secondary" size="sm" onClick={loadData}>Restart Engine</Button>
          </div>
        </Alert>
      </div>
    );
  }

  // Derived View Helpers
  const openFollowUps = localData.followUps.filter(f => f.status !== "COMPLETED");
  const staleOpps = localData.opportunities.filter(o => o.daysInactive >= 5);

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-[1400px] mx-auto">
      
      {/* HEADER & INTELLIGENCE */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl lg:text-[40px] font-display font-bold text-on-surface tracking-tight uppercase">
                Conversion
              </h1>
              <Badge variant="primary" size="sm">Pipeline Architecture</Badge>
            </div>
            <p className="text-on-surface-variant text-[14.5px] font-medium max-w-2xl leading-relaxed">
              Transform mapped attention securely into active financial progress. Control stages intimately scaling predictability across the workflow matrix.
            </p>
          </div>
          <div className="flex gap-4">
            <Card variant="outlined" className="min-w-[180px] p-4 flex flex-col justify-between">
               <h3 className="font-display font-medium text-[11px] text-on-surface-variant uppercase tracking-widest mb-1">Pipeline Value</h3>
               <div className="text-2xl font-bold font-display">${localData.pipelineValue.toLocaleString()}</div>
            </Card>
          </div>
        </div>

        {staleOpps.length > 0 && (
          <Alert variant="warning" title="Primary Conversion Constraint" className="mt-6 border-l-4 border-l-warning">
            {staleOpps.length} qualified opportunit{staleOpps.length === 1 ? 'y has' : 'ies have'} had no activity in 5+ days. Review actively to avoid pipeline hemorrhage.
            <div className="mt-3">
              <Button variant="secondary" size="sm" onClick={() => setActiveTab("followups")}>Review Follow-Ups</Button>
            </div>
          </Alert>
        )}
      </header>

      {/* TABS */}
      <div className="mb-6 border-b border-outline-variant">
        <Tabs 
          tabs={[
            { id: "pipeline", label: "Pipeline" },
            { id: "leads", label: "Leads Workspace" },
            { id: "followups", label: `Follow-Ups (${openFollowUps.length})` }
          ]} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
        />
      </div>

      {/* PIPELINE KANBAN */}
      {activeTab === "pipeline" && (
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
          {STAGES.map(stage => {
            const oppsInStage = localData.opportunities.filter(o => o.stage === stage.value);
            return (
              <div key={stage.value} className="flex-none w-[320px] bg-surface-container/50 rounded-xl p-3 border border-outline-variant snap-start">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="font-display font-semibold text-[13px] uppercase tracking-wider text-on-surface">{stage.label}</h3>
                  <Badge variant="neutral" size="sm">{oppsInStage.length}</Badge>
                </div>
                <div className="flex flex-col gap-3 min-h-[150px]">
                  {oppsInStage.length === 0 ? (
                    <div className="text-[12px] text-on-surface-variant/70 text-center py-6 font-medium italic">Empty Stage</div>
                  ) : (
                    oppsInStage.map(opp => (
                      <Card 
                        key={opp.id} 
                        className="cursor-pointer hover:border-primary/40 transition-colors shadow-sm"
                        onClick={() => setSelectedOppId(opp.id)}
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                             <Badge variant={opp.priority === "high" || opp.priority === "critical" ? "warning" : "neutral"} size="sm">
                               {opp.priority}
                             </Badge>
                             <span className="text-[12px] font-bold text-on-surface-variant">${opp.value.toLocaleString()}</span>
                          </div>
                          <h4 className="font-semibold text-[14.5px] text-on-surface mb-1">{opp.leadName}</h4>
                          <p className="text-[12px] font-medium text-on-surface-variant mb-4">{opp.company} &mdash; {opp.title}</p>
                          
                          <div className="text-[11px] font-semibold text-primary uppercase border-t border-outline-variant pt-3">
                             {opp.nextAction}
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LEADS WORKSPACE */}
      {activeTab === "leads" && (
        <Card>
          <CardHeader>
            <CardTitle>Active Opportunities</CardTitle>
          </CardHeader>
          <div className="mt-4 flex flex-col gap-2">
             {localData.opportunities.map(opp => (
               <div key={opp.id} onClick={() => setSelectedOppId(opp.id)} className="p-4 border border-outline-variant bg-surface rounded-xl hover:border-primary/40 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div>
                   <div className="flex items-center gap-3 mb-1">
                     <span className="font-bold text-[14.5px]">{opp.leadName}</span>
                     <Badge variant="neutral" size="sm">{opp.stage.replace("_", " ")}</Badge>
                   </div>
                   <div className="text-[13px] text-on-surface-variant font-medium">{opp.company} &mdash; {opp.title}</div>
                 </div>
                 <div className="text-right">
                   <div className="text-[12px] font-bold text-outline uppercase tracking-wider mb-1">Next Action</div>
                   <div className="text-[13px] font-semibold text-primary">{opp.nextAction}</div>
                 </div>
               </div>
             ))}
          </div>
        </Card>
      )}

      {/* FOLLOW-UPS */}
      {activeTab === "followups" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {openFollowUps.length === 0 ? (
            <div className="col-span-full">
              <Alert variant="success" title="Clear">No follow-ups require attention currently.</Alert>
            </div>
          ) : (
            openFollowUps.map(fu => {
              const opp = localData.opportunities.find(o => o.id === fu.opportunityId);
              return (
                <Card key={fu.id} className="border-l-4 border-l-warning">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="warning" size="sm">{fu.status}</Badge>
                      <span className="text-[12px] font-bold text-on-surface-variant block">Due: {new Date(fu.dueDate).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-bold text-[15px] mb-2">{opp?.leadName || "Unknown Target"}</h4>
                    <p className="text-[13px] leading-relaxed text-on-surface-variant font-medium mb-4">{fu.reason}</p>
                    {fu.recommendedAction && (
                      <div className="bg-[#EFF6FF] border border-blue-200 text-blue-800 p-3 rounded-lg text-[13px] font-medium mb-4 flex gap-2 items-start">
                        <span className="material-symbols-outlined text-[16px] mt-0.5">auto_awesome</span>
                        <div>{fu.recommendedAction}</div>
                      </div>
                    )}
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="w-full"
                      isLoading={isSaving}
                      onClick={() => handleFollowUpComplete(fu)}
                    >
                      Mark Completed
                    </Button>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      )}

      {/* CLOSER ROOM (Modal) */}
      <Modal isOpen={!!selectedOppId} onClose={() => setSelectedOppId(null)} title="Closer Room" size="lg">
         {activeOpp ? (
           <div className="flex flex-col gap-8 pb-4">
             {mutationError && (
               <Alert variant="danger" title="Mutation Failure">
                 {mutationError}
                 <div className="mt-3">
                   <Button variant="secondary" size="sm" onClick={() => setMutationError(null)}>Dismiss</Button>
                 </div>
               </Alert>
             )}
             
             {/* Header */}
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container/50 border border-outline-variant p-5 rounded-xl">
               <div>
                 <h2 className="text-2xl font-display font-bold text-on-surface mb-1">{activeOpp.leadName}</h2>
                 <div className="text-[14px] text-on-surface-variant font-medium">{activeOpp.company} &mdash; ${activeOpp.value.toLocaleString()}</div>
               </div>
               <div className="flex items-center gap-3">
                 <div className="text-[11px] uppercase tracking-wider font-bold text-outline mr-2 text-right">
                   Current State
                   <div className="text-[13px] text-on-surface">{activeOpp.stage.replace("_", " ")}</div>
                 </div>
                 <div className="flex flex-col gap-2">
                   <select 
                     className="bg-surface border border-outline-variant rounded-md px-3 py-1.5 text-[13px] font-bold text-primary outline-none cursor-pointer"
                     value={activeOpp.stage}
                     onChange={(e) => handleStageChange(e.target.value as OpportunityStage)}
                     disabled={isSaving}
                   >
                     {STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                   </select>
                 </div>
               </div>
             </div>
             
             {activeOpp.stage === "CLOSED_WON" && (
                <Alert variant="success" title="CLOSED WON">
                  Target secured. Delivery handoff ready. Transition workflow into the Delivery architecture pipeline functionally.
                </Alert>
             )}

             {/* Dynamic Content Columns */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               
               {/* Left Column: Qualification & Objections */}
               <div className="space-y-8">
                  <section>
                    <div className="border-b border-outline-variant pb-2 mb-4 flex items-center justify-between">
                      <h3 className="font-display font-bold text-[15px] uppercase tracking-wider flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">verified_user</span>
                        Qualification Context
                      </h3>
                      {!isEditingQual ? (
                        <Button variant="secondary" size="sm" onClick={handleQualEditStart}>Edit</Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={handleQualEditCancel} disabled={isSaving}>Cancel</Button>
                          <Button variant="primary" size="sm" onClick={handleQualificationSave} isLoading={isSaving}>Save</Button>
                        </div>
                      )}
                    </div>
                    
                    {!isEditingQual ? (
                      <div className="space-y-4 text-[13.5px]">
                        <div>
                          <strong className="block text-on-surface-variant text-[11px] uppercase mb-1">Problem Validated</strong>
                          <div className="font-medium">{activeOpp.qualification.problem}</div>
                        </div>
                        <div>
                          <strong className="block text-on-surface-variant text-[11px] uppercase mb-1">Fit</strong>
                          <div className="font-medium">{activeOpp.qualification.fit}</div>
                        </div>
                        <div>
                          <strong className="block text-on-surface-variant text-[11px] uppercase mb-1">Urgency / Timeline</strong>
                          <div className="font-medium">{activeOpp.qualification.urgency}</div>
                        </div>
                        <div>
                          <strong className="block text-on-surface-variant text-[11px] uppercase mb-1">Authority</strong>
                          <div className="font-medium">{activeOpp.qualification.authority}</div>
                        </div>
                        <div>
                          <strong className="block text-on-surface-variant text-[11px] uppercase mb-1">Budget</strong>
                          <div className="font-medium">{activeOpp.qualification.budget}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 text-[13.5px]">
                        <FormField label="Problem Validated">
                           <Input 
                             value={qualDraft?.problem || ""} 
                             onChange={(e) => setQualDraft(prev => prev ? { ...prev, problem: e.target.value } : null)}
                           />
                        </FormField>
                        <FormField label="Fit">
                           <Input 
                             value={qualDraft?.fit || ""} 
                             onChange={(e) => setQualDraft(prev => prev ? { ...prev, fit: e.target.value } : null)}
                           />
                        </FormField>
                        <FormField label="Urgency / Timeline">
                           <Input 
                             value={qualDraft?.urgency || ""} 
                             onChange={(e) => setQualDraft(prev => prev ? { ...prev, urgency: e.target.value } : null)}
                           />
                        </FormField>
                        <FormField label="Authority">
                           <Input 
                             value={qualDraft?.authority || ""} 
                             onChange={(e) => setQualDraft(prev => prev ? { ...prev, authority: e.target.value } : null)}
                           />
                        </FormField>
                        <FormField label="Budget">
                           <Input 
                             value={qualDraft?.budget || ""} 
                             onChange={(e) => setQualDraft(prev => prev ? { ...prev, budget: e.target.value } : null)}
                           />
                        </FormField>
                      </div>
                    )}
                  </section>
                  
                  <section>
                    <h3 className="font-display font-bold text-[15px] uppercase tracking-wider border-b border-outline-variant pb-2 mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">warning</span>
                      Active Objections
                    </h3>
                    {activeOpp.objections.length === 0 ? (
                      <div className="text-[13px] italic text-on-surface-variant">No objections logged.</div>
                    ) : (
                      <div className="space-y-4">
                        {activeOpp.objections.map(obj => (
                          <div key={obj.id} className="p-3 border border-error/20 bg-error-container/30 rounded-lg">
                             <div className="flex items-center justify-between mb-2">
                               <Badge variant={obj.resolutionStatus === "resolved" ? "success" : "danger"} size="sm">{obj.category}</Badge>
                               <span className="text-[11px] font-bold uppercase">{obj.resolutionStatus}</span>
                             </div>
                             <p className="text-[13px] font-medium leading-relaxed mb-3">{obj.objectionText}</p>
                             {obj.responseGuidance && (
                               <div className="bg-surface p-2.5 rounded border border-outline-variant text-[12.5px] font-medium text-primary">
                                 <strong className="block text-[10px] uppercase tracking-wider mb-1 text-on-surface-variant">Intelligence Suggestion</strong>
                                 {obj.responseGuidance}
                               </div>
                             )}
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
               </div>

               {/* Right Column: Interaction Log & Proposals */}
               <div className="space-y-8">
                  <section>
                    <h3 className="font-display font-bold text-[15px] uppercase tracking-wider border-b border-outline-variant pb-2 mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">call</span>
                      Sales Execution
                    </h3>
                    <div className="bg-surface-container rounded-xl p-4 border border-outline-variant">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant={activeOpp.salesCall.status === "COMPLETED" ? "primary" : "neutral"} size="sm">
                          {activeOpp.salesCall.status.replace("_", " ")}
                        </Badge>
                        {activeOpp.salesCall.date && <span className="text-[12px] font-bold text-on-surface-variant">{new Date(activeOpp.salesCall.date).toLocaleDateString()}</span>}
                      </div>
                      
                      {activeOpp.salesCall.outcome && (
                        <div className="mb-4">
                          <strong className="block text-[11px] uppercase text-on-surface-variant mb-1">Outcome</strong>
                          <p className="text-[13px] font-medium leading-relaxed">{activeOpp.salesCall.outcome}</p>
                        </div>
                      )}
                      
                      {activeOpp.salesCall.notes && (
                         <div>
                          <strong className="block text-[11px] uppercase text-on-surface-variant mb-1">Log</strong>
                          <p className="text-[13px] font-medium leading-relaxed">{activeOpp.salesCall.notes}</p>
                        </div>
                      )}

                      {!activeOpp.salesCall.outcome && !activeOpp.salesCall.notes && (
                        <div className="text-[12px] italic text-on-surface-variant text-center py-2">No execution logged.</div>
                      )}
                    </div>
                  </section>

                  <section>
                    <h3 className="font-display font-bold text-[15px] uppercase tracking-wider border-b border-outline-variant pb-2 mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">request_quote</span>
                      Proposal Canvas
                    </h3>
                    
                    {activeOpp.proposal ? (
                      <div className="bg-surface border border-primary/20 rounded-xl p-4 shadow-sm">
                         <div className="flex justify-between items-center mb-3">
                           <Badge variant={activeOpp.proposal.status === "APPROVED" || activeOpp.proposal.status === "ACCEPTED" ? "success" : "warning"} size="sm">
                             {activeOpp.proposal.status}
                           </Badge>
                         </div>
                         <div className="space-y-3 text-[13px] font-medium">
                           <div>
                             <span className="block text-[11px] uppercase text-on-surface-variant font-bold mb-1">Offer Parameters</span>
                             {activeOpp.proposal.offerContext}
                           </div>
                           <div>
                             <span className="block text-[11px] uppercase text-on-surface-variant font-bold mb-1">Scope Constraints</span>
                             {activeOpp.proposal.scopeConstraints}
                           </div>
                         </div>
                      </div>
                    ) : (
                      <div className="bg-surface-container rounded-xl p-6 border border-outline-variant text-center">
                        <span className="material-symbols-outlined text-outline text-[32px] mb-2 block">assignment</span>
                        <div className="font-semibold text-on-surface text-[14.5px] mb-1">No Proposal Available</div>
                        <p className="text-[13px] text-on-surface-variant font-medium">Proposal preparation has not started.</p>
                      </div>
                    )}
                  </section>
               </div>

             </div>
           </div>
         ) : <Skeleton className="h-40 w-full" />}
      </Modal>

    </div>
  );
}
