"use client";

import React, { useState } from "react";
import { 
  getRetention, 
  updateRetentionEngagement, 
  addRetentionInteraction,
  updateRetentionRisk,
  updateRetentionAction
} from "@/lib/adapters";
import { 
  RetentionEngagement, 
  RetentionInteraction,
  RetentionRisk,
  RetentionNextAction
} from "@/lib/types";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea, Select, FormField } from "@/components/ui/Forms";
import { Skeleton, CardSkeleton, EmptyState } from "@/components/ui/States";
import { Alert } from "@/components/ui/Alert";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { useAdapter } from "@/hooks/useAdapter";

function getHealthBadgeProps(health: string) {
  switch (health) {
    case "HEALTHY": return { variant: "success" as const };
    case "WATCH": return { variant: "warning" as const };
    case "AT_RISK": return { variant: "danger" as const };
    default: return { variant: "neutral" as const };
  }
}

export default function RetentionWorkspace() {
  const { setData, localData, setLocalData, loading, error, reload: loadData } = useAdapter(getRetention);
  
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Detail Modal Navigation
  const [selectedEngagementId, setSelectedEngagementId] = useState<string | null>(null);
  const activeEngagement = localData?.engagements.find(e => e.id === selectedEngagementId);

  // Edit Buffer: Engagement
  const [isEditingEngagement, setIsEditingEngagement] = useState(false);
  const [engagementDraft, setEngagementDraft] = useState<RetentionEngagement | null>(null);

  // Add Buffer: Interaction
  const [isAddingInteraction, setIsAddingInteraction] = useState(false);
  const [interactionDraft, setInteractionDraft] = useState<Partial<RetentionInteraction> | null>(null);

  // Confirmation actions
  const [confirmRiskResolve, setConfirmRiskResolve] = useState<{ engagementId: string, riskId: string } | null>(null);
  const [confirmActionComplete, setConfirmActionComplete] = useState<{ engagementId: string, actionId: string } | null>(null);

  // --------------- ENGAGEMENT EDIT PIPELINE ---------------
  function handleEditEngagement() {
    if (!activeEngagement) return;
    setMutationError(null);
    setEngagementDraft({ ...activeEngagement });
    setIsEditingEngagement(true);
  }

  function handleCancelEdit() {
    setMutationError(null);
    setEngagementDraft(null);
    setIsEditingEngagement(false);
  }

  async function handleSaveEngagement() {
    if (!engagementDraft) return;
    setMutationError(null);
    setIsSaving(true);
    try {
      const res = await updateRetentionEngagement(engagementDraft);
      setLocalData(res);
      setData(res);
      setIsEditingEngagement(false);
      setEngagementDraft(null);
    } catch (err: unknown) {
      setMutationError("Failed to save relationship details: " + (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  }

  // --------------- INTERACTION PIPELINE ---------------
  function handleStartAddInteraction() {
    setMutationError(null);
    setInteractionDraft({
      type: "CHECK_IN",
      summary: "",
      owner: "ASENZO Ops"
    });
    setIsAddingInteraction(true);
  }
  
  function handleCancelAddInteraction() {
    setMutationError(null);
    setInteractionDraft(null);
    setIsAddingInteraction(false);
  }

  async function handleSaveInteraction() {
    if (!activeEngagement || !interactionDraft || !interactionDraft.summary) {
      setMutationError("Interaction summary is required.");
      return;
    }
    setMutationError(null);
    setIsSaving(true);
    try {
      const payload: RetentionInteraction = {
        // eslint-disable-next-line react-hooks/purity
        id: `i${Date.now()}`,
        date: new Date().toISOString(),
        type: (interactionDraft.type || "OTHER") as RetentionInteraction["type"],
        summary: interactionDraft.summary,
        outcome: interactionDraft.outcome,
        owner: interactionDraft.owner || "System"
      };
      const res = await addRetentionInteraction(activeEngagement.id, payload);
      setLocalData(res);
      setData(res);
      setIsAddingInteraction(false);
      setInteractionDraft(null);
    } catch (err: unknown) {
      setMutationError("Failed to log interaction: " + (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  }

  // --------------- RISK RESOLUTION PIPELINE ---------------
  async function executeRiskResolution() {
    if (!confirmRiskResolve || !localData) return;
    setMutationError(null);
    setIsSaving(true);
    try {
      // Find the specific risk
      const engagement = localData.engagements.find(e => e.id === confirmRiskResolve.engagementId);
      const risk = engagement?.risks.find(r => r.id === confirmRiskResolve.riskId);
      if (!engagement || !risk) throw new Error("Risk not found.");

      const updatedRisk: RetentionRisk = { ...risk, status: "RESOLVED" };
      const res = await updateRetentionRisk(engagement.id, updatedRisk);
      setLocalData(res);
      setData(res);
      setConfirmRiskResolve(null);
    } catch(err: unknown) {
      setMutationError("Failed to resolve risk: " + (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  }

  // --------------- ACTION COMPLETION PIPELINE ---------------
  async function executeActionCompletion() {
    if (!confirmActionComplete || !localData) return;
    setMutationError(null);
    setIsSaving(true);
    try {
      const engagement = localData.engagements.find(e => e.id === confirmActionComplete.engagementId);
      if (!engagement || !engagement.nextAction) throw new Error("Next action not found.");
      
      const updatedAction: RetentionNextAction = { ...engagement.nextAction, status: "COMPLETED" };
      const res = await updateRetentionAction(engagement.id, updatedAction);
      setLocalData(res);
      setData(res);
      setConfirmActionComplete(null);
    } catch(err: unknown) {
      setMutationError("Failed to complete next action: " + (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  }

  // Rendering Loading
  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto p-6 md:p-8 animate-in fade-in duration-500 space-y-8">
        <header className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  // Rendering Error
  if (error || !localData) {
    return (
      <div className="max-w-[800px] mx-auto mt-12">
        <Alert variant="danger" title="Failed to load Retention Data">
          {error}
          <div className="mt-4">
            <Button variant="secondary" onClick={loadData}>Retry</Button>
          </div>
        </Alert>
      </div>
    );
  }

  // Data aggregations for operational displays
  const activeRelationships = localData.engagements.filter(e => e.status !== "COMPLETED");
  const needingAttention = localData.engagements.filter(e => e.health === "AT_RISK" || e.health === "WATCH" || e.status === "NEEDS_ATTENTION");
  const urgentRisks = localData.engagements.flatMap(e => e.risks.filter(r => r.status === "OPEN" && r.severity === "HIGH").map(r => ({ ...r, engagementClient: e.clientName, engagementId: e.id })));

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* -------------------- HEADER / METRICS -------------------- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[28px] font-display font-medium text-on-surface tracking-tight">Customer Continuity</h1>
          <p className="text-on-surface-variant text-[15px] mt-1">Operational post-sale relationship and retention management.</p>
        </div>
        <div className="flex bg-surface-container-low border border-outline-variant rounded-[var(--radius-lg)] p-1">
          <div className="px-4 py-1.5 flex flex-col items-center border-r border-outline-variant last:border-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Active</span>
            <span className="text-[17px] font-display font-bold text-on-surface">{activeRelationships.length}</span>
          </div>
          <div className="px-4 py-1.5 flex flex-col items-center border-r border-outline-variant last:border-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Review</span>
            <span className="text-[17px] font-display font-bold text-warning">{needingAttention.length}</span>
          </div>
          <div className="px-4 py-1.5 flex flex-col items-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Urgent</span>
            <span className="text-[17px] font-display font-bold text-error">{urgentRisks.length}</span>
          </div>
        </div>
      </header>

      {/* -------------------- PRIMARY ATTENTION AREA -------------------- */}
      <section>
        <div className="flex items-center gap-2 mb-3">
           <span className="material-symbols-outlined text-error text-[20px]">warning</span>
           <h2 className="text-[13.5px] uppercase font-bold tracking-wider text-on-surface-variant">Attention Required</h2>
        </div>
        
        {needingAttention.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {needingAttention.map(engagement => (
               <Card 
                key={`urgent-${engagement.id}`} 
                className={`cursor-pointer transition-shadow hover:shadow-md ${engagement.health === "AT_RISK" ? "border-error/40 ring-1 ring-error/20 bg-error/5" : "border-warning/40 ring-1 ring-warning/20 bg-warning/5"}`}
                onClick={() => setSelectedEngagementId(engagement.id)}
               >
                 <div className="p-4 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-2">
                       <Badge {...getHealthBadgeProps(engagement.health)} size="sm">{engagement.health}</Badge>
                       <span className="text-[11px] font-bold text-on-surface-variant uppercase">{engagement.status}</span>
                    </div>
                    <h3 className="text-[16px] font-bold text-on-surface mb-1 truncate">{engagement.clientName}</h3>
                    
                    {engagement.intelligenceSignal && (
                      <p className="text-[12px] font-medium text-on-surface-variant mb-3 bg-surface-container/50 p-2 rounded line-clamp-2">
                        {engagement.intelligenceSignal}
                      </p>
                    )}

                    <div className="mt-auto pt-2 border-t border-outline-variant/30 text-[12px] text-on-surface flex justify-between">
                       <span className="flex items-center gap-1 opacity-80"><span className="material-symbols-outlined text-[14px]">event</span> {new Date(engagement.lastInteractionDate).toLocaleDateString()}</span>
                       <span className="flex items-center gap-1 font-medium">{engagement.owner}</span>
                    </div>
                 </div>
               </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-surface-container rounded-xl border border-outline-variant text-on-surface-variant">
            <span className="material-symbols-outlined text-[32px] mb-2 text-success">verified</span>
            <p className="font-semibold text-on-surface text-[14.5px] mb-1">Clear</p>
            <p className="text-[13px]">No active engagements require immediate attention.</p>
          </div>
        )}
      </section>

      {/* -------------------- ALL ENGAGEMENTS LIST -------------------- */}
      <section>
         <h2 className="text-[13.5px] uppercase font-bold tracking-wider text-on-surface-variant mb-4">All Active Relationships</h2>
         {localData.engagements.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             {localData.engagements.map(engagement => (
               <div 
                 key={`all-${engagement.id}`}
                 onClick={() => setSelectedEngagementId(engagement.id)}
                 className="cursor-pointer border border-outline-variant bg-surface rounded-xl p-4 transition-colors hover:border-primary shrink-0 flex flex-col"
               >
                 <div className="mb-2">
                   <h4 className="font-bold text-[15px] truncate text-on-surface">{engagement.clientName}</h4>
                 </div>
                 <div className="flex gap-2 items-center mb-3">
                   <span className={`w-2 h-2 rounded-full ${engagement.health === 'HEALTHY' ? 'bg-success' : engagement.health === 'AT_RISK' ? 'bg-error' : 'bg-warning'}`}></span>
                   <span className="text-[12.5px] text-on-surface-variant font-medium">{engagement.health}</span>
                 </div>
                 <div className="mt-auto">
                    <p className="text-[11.5px] text-on-surface-variant uppercase tracking-wide">Last Sync: {new Date(engagement.lastInteractionDate).toLocaleDateString()}</p>
                 </div>
               </div>
             ))}
           </div>
         ) : (
           <EmptyState 
              icon="supervisor_account"
              title="No Relationships"
              description="There are currently no retention engagements managed in the OS."
           />
         )}
      </section>

      {/* -------------------- ENGAGEMENT DETAIL MODAL / WORKSPACE -------------------- */}
      <Modal isOpen={!!selectedEngagementId} onClose={() => { setSelectedEngagementId(null); setIsEditingEngagement(false); setIsAddingInteraction(false); }} title="Retention Details" size="lg">
         {activeEngagement ? (
           <div className="flex flex-col gap-8 pb-4">
              
              {/* Alert Render */}
              {mutationError && (
                 <Alert variant="danger" title="Mutation Failure">
                   {mutationError}
                   <div className="mt-3">
                     <Button variant="secondary" size="sm" onClick={() => setMutationError(null)}>Dismiss</Button>
                   </div>
                 </Alert>
              )}

              {/* Header Context */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant pb-4">
                 <div>
                   <div className="flex gap-2 items-center mb-1">
                     <Badge {...getHealthBadgeProps(activeEngagement.health)} size="sm">{activeEngagement.health}</Badge>
                     {activeEngagement.intelligenceSignal && (
                        <div className="bg-primary/5 text-primary text-[12px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                           <span className="material-symbols-outlined text-[14px]">insights</span>
                           {activeEngagement.intelligenceSignal}
                        </div>
                     )}
                   </div>
                   <h2 className="text-[24px] font-display font-bold text-on-surface mt-2">{activeEngagement.clientName}</h2>
                   <p className="text-[14px] text-on-surface-variant">{activeEngagement.status.replace("_", " ")}</p>
                 </div>
                 
                 <div className="flex flex-col md:items-end gap-1 text-[13px] bg-surface-container rounded-lg p-3">
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                      <span className="font-medium">Owner: {activeEngagement.owner}</span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant mt-1">
                      <span className="material-symbols-outlined text-[16px]">restore</span>
                      <span className="font-medium">Started: {new Date(activeEngagement.startDate).toLocaleDateString()}</span>
                    </div>
                 </div>
              </div>

              {/* Relationship Summary Edit Form */}
              <section className="bg-surface border border-outline-variant rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-[15px] uppercase tracking-wider flex items-center gap-2 text-on-surface-variant">
                     <span className="material-symbols-outlined text-[18px]">article</span> Relationship Summary
                   </h3>
                   {!isEditingEngagement ? (
                     <Button variant="secondary" size="sm" onClick={handleEditEngagement}>Edit Health</Button>
                   ) : (
                     <div className="flex gap-2">
                       <Button variant="secondary" size="sm" onClick={handleCancelEdit} disabled={isSaving}>Cancel</Button>
                       <Button variant="primary" size="sm" onClick={handleSaveEngagement} isLoading={isSaving}>Save</Button>
                     </div>
                   )}
                </div>

                {!isEditingEngagement ? (
                   <p className="text-[14.5px] text-on-surface leading-relaxed whitespace-pre-wrap">{activeEngagement.relationshipSummary}</p>
                ) : (
                   <div className="space-y-4">
                      <FormField label="Relationship Summary">
                        <Textarea 
                          value={engagementDraft?.relationshipSummary || ""} 
                          onChange={(e) => setEngagementDraft(prev => prev ? {...prev, relationshipSummary: e.target.value} : null)}
                          rows={4}
                        />
                      </FormField>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Health Indicator">
                          <Select
                            value={engagementDraft?.health || "HEALTHY"}
                            onChange={(e) => setEngagementDraft(prev => prev ? {...prev, health: e.target.value as import("@/lib/types").RetentionHealth} : null)}
                          >
                            <option value="HEALTHY">HEALTHY</option>
                            <option value="WATCH">WATCH</option>
                            <option value="AT_RISK">AT RISK</option>
                          </Select>
                        </FormField>
                        <FormField label="Retention Status">
                          <Select
                            value={engagementDraft?.status || "HEALTHY"}
                            onChange={(e) => setEngagementDraft(prev => prev ? {...prev, status: e.target.value as import("@/lib/types").RetentionStatus} : null)}
                          >
                            <option value="NOT_STARTED">NOT STARTED</option>
                            <option value="HEALTHY">HEALTHY</option>
                            <option value="NEEDS_ATTENTION">NEEDS ATTENTION</option>
                            <option value="AT_RISK">AT RISK</option>
                            <option value="COMPLETED">COMPLETED</option>
                          </Select>
                        </FormField>
                      </div>
                   </div>
                )}
              </section>

              {/* Next Action Module */}
              <section>
                 <h3 className="font-bold text-[15px] uppercase tracking-wider mb-4 border-b border-outline-variant pb-2">Next Step / Action</h3>
                 {activeEngagement.nextAction ? (
                   <div className={`p-4 rounded-xl border ${activeEngagement.nextAction.status === 'COMPLETED' ? 'bg-success/5 border-success/30' : 'bg-surface border-outline-variant'} flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}>
                      <div className="flex-1">
                         <div className="flex items-center gap-2 mb-1">
                           <Badge variant={activeEngagement.nextAction.status === 'COMPLETED' ? 'success' : 'neutral'} size="sm">
                             {activeEngagement.nextAction.status.replace("_", " ")}
                           </Badge>
                           <h4 className="font-bold text-[15px] text-on-surface">{activeEngagement.nextAction.title}</h4>
                         </div>
                         <p className="text-[14px] text-on-surface-variant mb-2">{activeEngagement.nextAction.description}</p>
                         <div className="flex items-center gap-3 text-[12px] font-medium text-on-surface">
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">event</span> {new Date(activeEngagement.nextAction.dueDate).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">person</span> {activeEngagement.nextAction.owner}</span>
                         </div>
                      </div>
                      <div className="md:min-w-[120px] text-right">
                         {activeEngagement.nextAction.status !== "COMPLETED" && (
                           <Button variant="secondary" size="sm" onClick={() => setConfirmActionComplete({ engagementId: activeEngagement.id, actionId: activeEngagement.nextAction!.id })}>
                             Mark Delivered
                           </Button>
                         )}
                      </div>
                   </div>
                 ) : (
                   <div className="text-center p-6 bg-surface-container rounded-xl border border-outline-variant text-[14px] text-on-surface-variant">
                      No explicit next action is currently scheduled.
                   </div>
                 )}
              </section>

              {/* Active Risks */}
              <section>
                <div className="flex items-center gap-2 mb-4 border-b border-outline-variant pb-2">
                   <h3 className="font-bold text-[15px] uppercase tracking-wider">Active Risks</h3>
                   {activeEngagement.risks.filter(r => r.status === "OPEN").length > 0 && (
                     <Badge variant="danger" size="sm" className="rounded-full w-5 h-5 flex items-center justify-center p-0 ml-1">
                       {activeEngagement.risks.filter(r => r.status === "OPEN").length}
                     </Badge>
                   )}
                </div>
                {activeEngagement.risks.length > 0 ? (
                  <div className="space-y-3">
                    {activeEngagement.risks.map(r => (
                      <div key={r.id} className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between items-start gap-4 ${r.status !== 'RESOLVED' && r.severity === 'HIGH' ? 'bg-error/5 border-error/30' : 'bg-surface border-outline-variant'}`}>
                         <div>
                            <div className="flex gap-2 items-center mb-2">
                              {r.status === 'RESOLVED' ? (
                                <Badge variant="success" size="sm">RESOLVED</Badge>
                              ) : (
                                <Badge variant={r.severity === 'HIGH' ? 'danger' : r.severity === 'MEDIUM' ? 'warning' : 'neutral'} size="sm">
                                  {r.severity} RISK
                                </Badge>
                              )}
                              <h4 className={`font-bold text-[14.5px] ${r.status === 'RESOLVED' ? 'line-through opacity-70' : 'text-on-surface'}`}>{r.title}</h4>
                            </div>
                            <p className="text-[13.5px] text-on-surface-variant">{r.description}</p>
                            {r.recommendedAction && r.status !== 'RESOLVED' && (
                              <p className="mt-2 text-[12px] bg-surface font-medium p-2 rounded border border-outline-variant">Remediation: {r.recommendedAction}</p>
                            )}
                         </div>
                         {r.status !== 'RESOLVED' && (
                           <div className="self-end md:self-start">
                             <Button variant="secondary" size="sm" onClick={() => setConfirmRiskResolve({ engagementId: activeEngagement.id, riskId: r.id })}>
                               Resolve
                             </Button>
                           </div>
                         )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 bg-surface-container rounded-xl border border-outline-variant text-[14px] text-on-surface-variant flex flex-col items-center">
                     <span className="material-symbols-outlined text-[24px] mb-2 text-success">verified_user</span>
                     No open retention risks logged.
                  </div>
                )}
              </section>

              {/* Interactions Log */}
              <section>
                 <div className="flex justify-between items-center mb-4 border-b border-outline-variant pb-2">
                   <h3 className="font-bold text-[15px] uppercase tracking-wider flex items-center gap-2">
                     <span className="material-symbols-outlined text-[18px]">forum</span> Interaction History
                   </h3>
                   {!isAddingInteraction && <Button variant="secondary" size="sm" onClick={handleStartAddInteraction}>Log Event</Button>}
                 </div>

                 {isAddingInteraction && (
                   <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-5 space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                       <FormField label="Event Type">
                         <Select 
                           value={interactionDraft?.type || "CHECK_IN"}
                           onChange={(e) => setInteractionDraft(prev => prev ? {...prev, type: e.target.value as import("@/lib/types").RetentionInteraction["type"]} : null)}
                         >
                           <option value="CALL">Call</option>
                           <option value="EMAIL">Email</option>
                           <option value="MEETING">Meeting</option>
                           <option value="CHECK_IN">Check-in</option>
                           <option value="DELIVERY_UPDATE">Delivery Update</option>
                           <option value="OTHER">Other</option>
                         </Select>
                       </FormField>
                       <FormField label="Owner">
                         <Input 
                           value={interactionDraft?.owner || ""}
                           onChange={(e) => setInteractionDraft(prev => prev ? {...prev, owner: e.target.value} : null)}
                         />
                       </FormField>
                     </div>
                     <FormField label="Interaction Summary (Required)">
                       <Textarea 
                         required
                         value={interactionDraft?.summary || ""}
                         onChange={(e) => setInteractionDraft(prev => prev ? {...prev, summary: e.target.value} : null)}
                         rows={2}
                       />
                     </FormField>
                     <FormField label="Outcome (Optional)">
                       <Input 
                         value={interactionDraft?.outcome || ""}
                         onChange={(e) => setInteractionDraft(prev => prev ? {...prev, outcome: e.target.value} : null)}
                       />
                     </FormField>
                     <div className="flex justify-end gap-2 pt-2">
                       <Button variant="secondary" onClick={handleCancelAddInteraction} disabled={isSaving}>Cancel</Button>
                       <Button variant="primary" onClick={handleSaveInteraction} isLoading={isSaving}>Save Event</Button>
                     </div>
                   </div>
                 )}

                 {activeEngagement.interactions.length > 0 ? (
                   <div className="relative border-l-2 border-outline-variant/50 ml-3 space-y-6 pb-2">
                     {activeEngagement.interactions.map(interaction => (
                       <div key={interaction.id} className="relative pl-6">
                         <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-surface border-2 border-primary z-10 shadow-sm"></div>
                         <div className="bg-surface border border-outline-variant rounded-lg p-4 shadow-sm hover:border-outline transition-colors">
                           <div className="flex justify-between items-start mb-2">
                             <div className="flex gap-2 items-center">
                               <Badge variant="neutral" size="sm">{interaction.type}</Badge>
                               <span className="text-[12px] font-bold text-on-surface">{interaction.owner}</span>
                             </div>
                             <span className="text-[11.5px] text-on-surface-variant">{new Date(interaction.date).toLocaleString()}</span>
                           </div>
                           <p className="text-[14px] text-on-surface bg-surface-container-low p-2 rounded leading-relaxed">{interaction.summary}</p>
                           {interaction.outcome && (
                             <p className="mt-2 text-[12.5px] font-medium text-success flex items-center gap-1">
                               <span className="material-symbols-outlined text-[14px]">done_all</span> {interaction.outcome}
                             </p>
                           )}
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="text-center p-6 bg-surface-container rounded-xl border border-outline-variant text-[14px] text-on-surface-variant">
                      No relationship interactions have been logged.
                   </div>
                 )}
              </section>

              {/* Goals */}
              <section>
                 <h3 className="font-bold text-[15px] uppercase tracking-wider mb-4 border-b border-outline-variant pb-2 text-on-surface-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">flag</span> Desired Outcomes (Goals)
                 </h3>
                 {activeEngagement.goals.length > 0 ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {activeEngagement.goals.map(goal => (
                       <div key={goal.id} className="bg-surface border border-outline-variant rounded-xl p-4 flex flex-col justify-between">
                         <div>
                            <div className="flex justify-between items-start mb-2">
                              <Badge variant={goal.status === 'ACHIEVED' ? 'success' : goal.status === 'AT_RISK' ? 'warning' : 'neutral'} size="sm">
                                {goal.status.replace("_", " ")}
                              </Badge>
                              <span className="text-[12px] font-medium text-on-surface-variant">{goal.id}</span>
                            </div>
                            <h4 className="font-bold text-[14.5px] text-on-surface mb-1">{goal.title}</h4>
                            <p className="text-[13px] text-on-surface-variant mb-3">{goal.description}</p>
                         </div>
                         <div className="mt-2 bg-surface-container-low border border-outline p-2 rounded">
                           <span className="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">Current State</span>
                           <span className="text-[13.5px] font-medium text-on-surface">{goal.currentState}</span>
                         </div>
                         <div className="mt-3 flex justify-between items-center text-[12px] text-on-surface-variant">
                           <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">person</span> {goal.owner}</span>
                           <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">event</span> {new Date(goal.targetDate).toLocaleDateString()}</span>
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="text-center p-6 bg-surface-container rounded-xl border border-outline-variant text-[14px] text-on-surface-variant">
                      No goals have been defined for this customer.
                   </div>
                 )}
              </section>

           </div>
         ) : <Skeleton className="h-64 w-full" />}
      </Modal>

      {/* -------------------- DESTRUCTIVE/IMPORTANT CONFIRMATIONS -------------------- */}
      <ConfirmationDialog
        isOpen={!!confirmRiskResolve}
        onClose={() => { if (!isSaving) setConfirmRiskResolve(null); }}
        onConfirm={executeRiskResolution}
        title="Resolve Risk"
        description="Are you sure you want to mark this structural relationship risk as resolved?"
        confirmText="Confirm Resolution"
        isDestructive={false}
        isLoading={isSaving}
      />

      <ConfirmationDialog
        isOpen={!!confirmActionComplete}
        onClose={() => { if (!isSaving) setConfirmActionComplete(null); }}
        onConfirm={executeActionCompletion}
        title="Complete Next Action"
        description="Are you sure you want to clear the pending next action for this relationship?"
        confirmText="Clear Action"
        isDestructive={false}
        isLoading={isSaving}
      />

    </div>
  );
}
