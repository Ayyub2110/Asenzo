"use client";

import React, { useState, useEffect } from "react";
import { getDelivery, updateDeliveryEngagement, completeDeliveryMilestone, resolveDeliveryBlocker } from "@/lib/adapters";
import { DeliveryData, DeliveryEngagement, DeliveryMilestone, DeliveryBlocker, DeliveryStatus } from "@/lib/types";

import { Card, CardTitle, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea, Select, FormField } from "@/components/ui/Forms";
import { Skeleton, CardSkeleton, EmptyState } from "@/components/ui/States";
import { Alert } from "@/components/ui/Alert";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { useAdapter } from "@/hooks/useAdapter";

function getStatusBadgeProps(status: string) {
  switch (status) {
    case "ON_TRACK": return { variant: "success" as const };
    case "AT_RISK": return { variant: "warning" as const };
    case "BLOCKED": return { variant: "danger" as const };
    case "COMPLETED": return { variant: "neutral" as const };
    default: return { variant: "neutral" as const };
  }
}

export default function DeliveryWorkspace() {
  const { data, setData, localData, setLocalData, loading, error, reload: loadData } = useAdapter(getDelivery);
  
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [selectedEngagementId, setSelectedEngagementId] = useState<string | null>(null);
  
  const [confirmMilestone, setConfirmMilestone] = useState<{engagementId: string, milestoneId: string} | null>(null);
  const [confirmBlocker, setConfirmBlocker] = useState<{engagementId: string, blockerId: string} | null>(null);

  // Edit Engagement Draft
  const [isEditingEngagement, setIsEditingEngagement] = useState(false);
  const [engagementDraft, setEngagementDraft] = useState<DeliveryEngagement | null>(null);

  const activeEngagement = localData?.engagements.find(e => e.id === selectedEngagementId);

  async function handleCompleteMilestone() {
    if (!confirmMilestone || !localData) return;
    setMutationError(null);
    setIsSaving(true);
    try {
      const res = await completeDeliveryMilestone(confirmMilestone.engagementId, confirmMilestone.milestoneId);
      setLocalData(res);
      setData(res);
      setConfirmMilestone(null);
    } catch (err: unknown) {
      setMutationError("Failed to complete milestone: " + (err as Error).message);
      // Keep confirm state open so they can retry, or they can cancel it if they want
    } finally {
      setIsSaving(false);
    }
  }

  async function handleResolveBlocker() {
    if (!confirmBlocker || !localData) return;
    setMutationError(null);
    setIsSaving(true);
    try {
      const res = await resolveDeliveryBlocker(confirmBlocker.engagementId, confirmBlocker.blockerId);
      setLocalData(res);
      setData(res);
      setConfirmBlocker(null);
    } catch (err: unknown) {
      setMutationError("Failed to resolve blocker: " + (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  }

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
      const res = await updateDeliveryEngagement(engagementDraft);
      setLocalData(res);
      setData(res);
      setIsEditingEngagement(false);
    } catch (err: unknown) {
      setMutationError("Failed to save delivery engagement: " + (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  }

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

  if (error || !localData) {
    return (
      <div className="max-w-[800px] mx-auto mt-12">
        <Alert variant="danger" title="Failed to load Delivery Data">
          {error}
          <div className="mt-4">
            <Button variant="secondary" onClick={loadData}>Retry</Button>
          </div>
        </Alert>
      </div>
    );
  }

  // Derived Health Data
  const blockers = localData.engagements.flatMap(e => e.blockers.filter(b => b.status === "active").map(b => ({...b, engagementClient: e.clientName})));
  const pendingMilestones = localData.engagements.flatMap(e => e.milestones.filter(m => m.status !== "completed"));

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[28px] font-display font-medium text-on-surface tracking-tight">Delivery & Fulfillment</h1>
          <p className="text-on-surface-variant text-[15px] mt-1">Operational execution and milestone tracking.</p>
        </div>
        <div className="flex bg-surface-container-low border border-outline-variant rounded-[var(--radius-lg)] p-1">
          <div className="px-4 py-1.5 flex flex-col items-center border-r border-outline-variant last:border-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Active</span>
            <span className="text-[17px] font-display font-bold text-on-surface">{localData.engagements.filter(e => e.status !== "COMPLETED").length}</span>
          </div>
          <div className="px-4 py-1.5 flex flex-col items-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Blockers</span>
            <span className="text-[17px] font-display font-bold text-error">{blockers.length}</span>
          </div>
        </div>
      </header>

      {/* Primary Constraint / Blockers */}
      <section>
        <div className="flex items-center gap-2 mb-3">
           <span className="material-symbols-outlined text-error text-[20px]">warning</span>
           <h2 className="text-[13.5px] uppercase font-bold tracking-wider text-on-surface-variant">Active Delivery Blockers</h2>
        </div>
        
        {blockers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blockers.map(b => (
              <div key={b.id} className="bg-error/5 border border-error/20 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="danger" size="sm">Blocker</Badge>
                    <span className="text-[11px] font-bold text-on-surface-variant">{b.engagementClient}</span>
                  </div>
                  <p className="text-[14px] font-medium text-on-surface mb-2">{b.description}</p>
                  {b.recommendedAction && (
                    <p className="text-[12px] text-on-surface-variant bg-surface-container p-2 rounded border border-outline-variant">
                      Recommendation: {b.recommendedAction}
                    </p>
                  )}
                </div>
                <div className="mt-4 text-right">
                   <Button variant="secondary" size="sm" onClick={() => setConfirmBlocker({ engagementId: b.engagementId, blockerId: b.id })}>
                     Resolve Blocker
                   </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-surface-container rounded-xl border border-outline-variant text-on-surface-variant">
            <span className="material-symbols-outlined text-[32px] mb-2">check_circle</span>
            <p className="font-semibold text-on-surface text-[14.5px] mb-1">Clear</p>
            <p className="text-[13px]">No delivery blockers require attention.</p>
          </div>
        )}
      </section>

      {/* Engagements List */}
      <section>
        <h2 className="text-[13.5px] uppercase font-bold tracking-wider text-on-surface-variant mb-4">Active Engagements</h2>
        
        {localData.engagements.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {localData.engagements.map(engagement => (
              <Card 
                key={engagement.id} 
                className={`cursor-pointer transition-shadow hover:shadow-md ${engagement.status === "BLOCKED" ? "border-error/40 ring-1 ring-error/20" : ""}`}
                onClick={() => setSelectedEngagementId(engagement.id)}
              >
                <div className="p-5 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-3">
                    <Badge {...getStatusBadgeProps(engagement.status)} size="sm">{engagement.status}</Badge>
                    <span className="text-[11.5px] text-on-surface-variant font-medium bg-surface-container px-2 py-0.5 rounded-full">
                      {engagement.milestones.filter(m => m.status === "completed").length} / {engagement.milestones.length} Milestones
                    </span>
                  </div>
                  <h3 className="text-[17px] font-bold text-on-surface mb-1 truncate">{engagement.clientName}</h3>
                  <p className="text-[14px] text-on-surface-variant mb-4 line-clamp-2">{engagement.engagementType}</p>
                  
                  <div className="mt-auto space-y-2">
                    {engagement.intelligenceSignal && (
                      <div className="flex items-start gap-2 bg-primary/5 p-2 rounded-lg text-[12px]">
                        <span className="material-symbols-outlined text-[14px] text-primary mt-0.5">insights</span>
                        <span className="text-on-surface-variant leading-snug break-words">
                          {engagement.intelligenceSignal}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-[12.5px] text-on-surface-variant">
                      <span className="material-symbols-outlined text-[14px]">person</span>
                      {engagement.owner}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState 
            icon="handshake"
            title="No Active Engagements"
            description="The delivery pipeline is currently empty. Closed-Won opportunities will appear here for fulfillment."
          />
        )}
      </section>


      {/* ENGAGEMENT DETAIL MODAL */}
      <Modal isOpen={!!selectedEngagementId} onClose={() => setSelectedEngagementId(null)} title="Delivery Detail" size="lg">
        {activeEngagement ? (
          <div className="flex flex-col gap-6 pb-4">
            
            {mutationError && (
               <Alert variant="danger" title="Mutation Failure">
                 {mutationError}
                 <div className="mt-3">
                   <Button variant="secondary" size="sm" onClick={() => setMutationError(null)}>Dismiss</Button>
                 </div>
               </Alert>
            )}

            {/* Top Info Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container/50 border border-outline-variant p-5 rounded-xl">
               <div>
                 <div className="flex gap-2 items-center mb-1">
                   <Badge {...getStatusBadgeProps(activeEngagement.status)} size="sm">{activeEngagement.status}</Badge>
                 </div>
                 <h2 className="text-[22px] font-display font-bold text-on-surface">{activeEngagement.clientName}</h2>
                 <p className="text-[14px] text-on-surface-variant">{activeEngagement.engagementType}</p>
               </div>
               
               <div className="flex flex-col md:items-end gap-1 text-[13px]">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                    <span className="font-medium">Target: {new Date(activeEngagement.targetCompletion).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">person</span>
                    <span className="font-medium">Owner: {activeEngagement.owner}</span>
                  </div>
               </div>
            </div>

            {/* Engagement Edit Form */}
            <section className="border border-outline-variant rounded-xl p-5 bg-surface">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-[15px] uppercase tracking-wider h-6 flex items-center">Engagement Info</h3>
                 {!isEditingEngagement ? (
                   <Button variant="secondary" size="sm" onClick={handleEditEngagement}>Edit</Button>
                 ) : (
                   <div className="flex gap-2">
                     <Button variant="secondary" size="sm" onClick={handleCancelEdit} disabled={isSaving}>Cancel</Button>
                     <Button variant="primary" size="sm" onClick={handleSaveEngagement} isLoading={isSaving}>Save</Button>
                   </div>
                 )}
              </div>
              
              {!isEditingEngagement ? (
                <div className="grid grid-cols-2 gap-4 text-[13.5px]">
                  <div>
                    <span className="block text-on-surface-variant text-[11px] uppercase mb-1 font-bold">Type</span>
                    <span className="font-medium text-on-surface">{activeEngagement.engagementType}</span>
                  </div>
                  <div>
                    <span className="block text-on-surface-variant text-[11px] uppercase mb-1 font-bold">Owner</span>
                    <span className="font-medium text-on-surface">{activeEngagement.owner}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <FormField label="Engagement Status">
                    <Select 
                      value={engagementDraft?.status || "NOT_STARTED"} 
                      onChange={(e) => setEngagementDraft(prev => prev ? {...prev, status: e.target.value as DeliveryStatus} : null)}
                    >
                      <option value="NOT_STARTED">NOT STARTED</option>
                      <option value="ON_TRACK">ON TRACK</option>
                      <option value="AT_RISK">AT RISK</option>
                      <option value="BLOCKED">BLOCKED</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </Select>
                  </FormField>
                  <FormField label="Owner">
                    <Input 
                      value={engagementDraft?.owner || ""} 
                      onChange={(e) => setEngagementDraft(prev => prev ? {...prev, owner: e.target.value} : null)}
                    />
                  </FormField>
                </div>
              )}
            </section>

            {/* Milestones */}
            <section>
              <h3 className="font-bold text-[15px] uppercase tracking-wider mb-4 border-b border-outline-variant pb-2">Milestones</h3>
              {activeEngagement.milestones.length > 0 ? (
                <div className="space-y-3">
                  {activeEngagement.milestones.map(m => (
                    <div key={m.id} className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between p-4 bg-surface rounded-xl border border-outline-variant hover:border-primary/30 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-2 h-2 rounded-full ${m.status === 'completed' ? 'bg-success' : m.status === 'in_progress' ? 'bg-primary' : 'bg-outline'}`}></span>
                          <h4 className="font-bold text-[14.5px] text-on-surface">{m.title}</h4>
                          {m.status === 'completed' && <Badge variant="success" size="sm">Done</Badge>}
                        </div>
                        <p className="text-[13px] text-on-surface-variant line-clamp-2">{m.description}</p>
                      </div>
                      <div className="flex flex-col items-start md:items-end gap-2 md:min-w-[140px]">
                        <span className="text-[12px] font-medium text-on-surface-variant flex items-center gap-1">
                           <span className="material-symbols-outlined text-[14px]">event</span>
                           {new Date(m.dueDate).toLocaleDateString()}
                        </span>
                        {m.status !== "completed" && (
                          <Button variant="secondary" size="sm" onClick={() => setConfirmMilestone({ engagementId: activeEngagement.id, milestoneId: m.id })}>
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 bg-surface-container rounded-xl border border-outline-variant text-on-surface-variant text-[14px]">
                  No milestones are attached to this engagement.
                </div>
              )}
            </section>
            
          </div>
        ) : <Skeleton className="h-64 w-full" />}
      </Modal>

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={!!confirmMilestone}
        onClose={() => {
          if (!isSaving) setConfirmMilestone(null);
        }}
        onConfirm={handleCompleteMilestone}
        title="Complete Milestone"
        description="Are you sure you want to mark this milestone as complete? This will instantly resolve it in the delivery pipeline."
        confirmText="Confirm Completion"
        isDestructive={false}
        isLoading={isSaving}
      />

      <ConfirmationDialog
        isOpen={!!confirmBlocker}
        onClose={() => {
          if (!isSaving) setConfirmBlocker(null);
        }}
        onConfirm={handleResolveBlocker}
        title="Resolve Blocker"
        description="Are you sure you want to manually resolve this blocker? Verify that the dependency has genuinely been unblocked before continuing."
        confirmText="Resolve Blocker"
        isDestructive={false}
        isLoading={isSaving}
      />

    </div>
  );
}
