"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  getOperator, 
  updateOperatorItem,
  completeOperatorItem
} from "@/lib/adapters";
import { 
  OperatorData, 
  OperatorItem,
  OperatorItemStatus,
  OperatorPriority
} from "@/lib/types";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input, Select, FormField } from "@/components/ui/Forms";
import { Skeleton, CardSkeleton, EmptyState } from "@/components/ui/States";
import { Alert } from "@/components/ui/Alert";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { useAdapter } from "@/hooks/useAdapter";

function getPriorityBadgeVariant(priority: OperatorPriority) {
  switch (priority) {
    case "URGENT":
      return "danger";
    case "HIGH":
      return "warning";
    case "MEDIUM":
      return "neutral";
    case "LOW":
      return "neutral";
    default:
      return "neutral";
  }
}

function getStatusBadgeVariant(status: OperatorItemStatus) {
  switch (status) {
    case "BLOCKED":
      return "danger";
    case "IN_PROGRESS":
      return "warning";
    case "COMPLETED":
      return "success";
    case "OPEN":
    default:
      return "neutral";
  }
}

export default function OperatorWorkspace() {
  const router = useRouter();

  const { data, setData, localData, setLocalData, loading, error, reload: loadData } = useAdapter(getOperator);
  
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Detail Modal setup
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const activeItem = localData?.items.find(i => i.id === selectedItemId);

  // Edit Context buffer
  const [isEditingOperator, setIsEditingOperator] = useState(false);
  const [operatorDraft, setOperatorDraft] = useState<OperatorItem | null>(null);

  // Confirmation actions
  const [confirmCompleteAction, setConfirmCompleteAction] = useState<{ id: string, actionName: string } | null>(null);

  // --------------- EDIT PIPELINE ---------------
  function handleEditItem() {
    if (!activeItem) return;
    setMutationError(null);
    setOperatorDraft({ ...activeItem });
    setIsEditingOperator(true);
  }

  function handleCancelEdit() {
    setMutationError(null);
    setOperatorDraft(null);
    setIsEditingOperator(false);
  }

  async function handleSaveItem() {
    if (!operatorDraft) return;
    setMutationError(null);
    setIsSaving(true);
    try {
      const res = await updateOperatorItem(operatorDraft);
      setLocalData(res);
      setData(res);
      setIsEditingOperator(false);
      setOperatorDraft(null);
    } catch (err: unknown) {
      setMutationError("Failed to update execution context: " + (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  }

  // --------------- COMPLETION PIPELINE ---------------
  async function executeActionCompletion() {
    if (!confirmCompleteAction || !localData) return;
    setMutationError(null);
    setIsSaving(true);
    try {
      const res = await completeOperatorItem(confirmCompleteAction.id);
      setLocalData(res);
      setData(res);
      setConfirmCompleteAction(null);
    } catch(err: unknown) {
      setMutationError("Failed to close operational task: " + (err as Error).message);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error || !localData) {
    return (
      <div className="max-w-[800px] mx-auto mt-12">
        <Alert variant="danger" title="Failed to sync Operator Queue">
          {error}
          <div className="mt-4">
            <Button variant="secondary" onClick={loadData}>Retry</Button>
          </div>
        </Alert>
      </div>
    );
  }

  // Derived datasets
  const activeItems = localData.items.filter(i => i.status !== "COMPLETED");
  
  const attentionRequired = activeItems.filter(i => 
    i.priority === "URGENT" || 
    i.priority === "HIGH" || 
    i.status === "BLOCKED"
  );
  
  const openWork = activeItems.filter(i => 
    i.priority !== "URGENT" && 
    i.priority !== "HIGH" && 
    i.status !== "BLOCKED"
  );
  
  const recentlyCompleted = localData.items.filter(i => i.status === "COMPLETED");

  const RenderCard = ({ item }: { item: OperatorItem }) => (
    <Card 
      className={`cursor-pointer transition-shadow hover:shadow-md flex flex-col h-full 
        ${item.priority === 'URGENT' || item.status === 'BLOCKED' ? 'border-error/30 ring-1 ring-error/20 bg-error/5' : 'bg-surface'}
      `}
      onClick={() => setSelectedItemId(item.id)}
    >
      <div className="p-5 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <Badge variant={getPriorityBadgeVariant(item.priority)} size="sm">{item.priority}</Badge>
            <Badge variant={getStatusBadgeVariant(item.status)} size="sm">{item.status.replace("_", " ")}</Badge>
          </div>
          <span className="text-[11px] font-bold text-on-surface-variant uppercase border border-outline-variant px-1 rounded-sm">{item.sourceModule}</span>
        </div>
        <h3 className="text-[16px] font-bold text-on-surface mb-2">{item.title}</h3>
        <p className="text-[13px] text-on-surface-variant mb-4">{item.description}</p>
        
        {item.intelligenceSignal && (
          <div className="mb-4 bg-primary/10 text-[12px] font-medium text-primary-dark p-2.5 rounded-md flex items-start gap-1.5 border border-primary/20">
            <span className="material-symbols-outlined text-[15px] mt-0.5">insights</span>
            <span className="leading-tight">{item.intelligenceSignal}</span>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-outline-variant">
           <h4 className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Recommended Action</h4>
           <p className="text-[13.5px] font-medium text-on-surface">{item.recommendedAction}</p>
           
           <div className="mt-4 flex items-center justify-between text-[11.5px] font-medium text-on-surface-variant">
              <span>{item.dueDate ? `Due: ${new Date(item.dueDate).toLocaleDateString()}` : `Opened: ${new Date(item.createdAt).toLocaleDateString()}`}</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">person</span> {item.owner}</span>
           </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-8 space-y-10 animate-in fade-in duration-500">
      
      {/* -------------------- HEADER -------------------- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant pb-6">
        <div>
          <h1 className="text-[28px] font-display font-medium text-on-surface tracking-tight">Operator</h1>
          <p className="text-on-surface-variant text-[15px] mt-1">Cross-module operational control surface.</p>
        </div>
        <div className="flex bg-surface border border-outline-variant rounded-[var(--radius-lg)] p-1.5 text-center shadow-sm">
           <div className="px-5 py-2 border-r border-outline-variant uppercase">
             <span className="block text-[11px] font-bold text-error tracking-wider mb-0.5">Blocked/Urgent</span>
             <span className="text-[18px] font-display font-bold text-on-surface">{attentionRequired.length}</span>
           </div>
           <div className="px-5 py-2 uppercase">
             <span className="block text-[11px] font-bold text-on-surface-variant tracking-wider mb-0.5">Open Work</span>
             <span className="text-[18px] font-display font-bold text-on-surface">{openWork.length}</span>
           </div>
        </div>
      </header>

      {/* -------------------- ATTENTION REQUIRED -------------------- */}
      <section>
        <div className="flex items-center gap-2 mb-4">
           <span className="material-symbols-outlined text-error text-[20px]">priority_high</span>
           <h2 className="text-[14px] uppercase font-bold tracking-wider text-on-surface-variant">Attention Required</h2>
        </div>
        
        {attentionRequired.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
             {attentionRequired.map(item => <RenderCard key={item.id} item={item} />)}
          </div>
        ) : (
          <div className="text-center p-8 bg-surface-container rounded-xl border border-outline-variant text-on-surface-variant flex flex-col items-center">
            <span className="material-symbols-outlined text-[32px] mb-2 text-success">verified</span>
            <p className="font-semibold text-on-surface text-[14.5px] mb-1">Clear</p>
            <p className="text-[13px]">No urgent operational items require attention.</p>
          </div>
        )}
      </section>

      {/* -------------------- OPEN WORK -------------------- */}
      <section>
         <div className="flex items-center gap-2 mb-4">
           <span className="material-symbols-outlined text-on-surface-variant text-[20px]">inbox</span>
           <h2 className="text-[14px] uppercase font-bold tracking-wider text-on-surface-variant">Open Work</h2>
         </div>
         {openWork.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
             {openWork.map(item => <RenderCard key={item.id} item={item} />)}
           </div>
         ) : (
           <div className="text-center p-8 bg-surface-container rounded-xl border border-outline-variant text-on-surface-variant">
             <p className="text-[13px]">No open operator work is currently outstanding.</p>
           </div>
         )}
      </section>

      {/* -------------------- RECENTLY COMPLETED -------------------- */}
      <section>
         <h2 className="text-[13.5px] uppercase font-bold tracking-wider text-on-surface-variant mb-4">Recently Completed</h2>
         {recentlyCompleted.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
             {recentlyCompleted.map(item => (
                <div key={item.id} onClick={() => setSelectedItemId(item.id)} className="cursor-pointer bg-surface-container border border-outline-variant rounded-lg p-3.5 flex justify-between items-center transition-colors hover:bg-surface-container-high">
                  <div className="flex-1 pr-3">
                    <h5 className="font-bold text-[13.5px] text-on-surface mb-0.5">{item.title}</h5>
                    <p className="text-[12px] text-on-surface-variant truncate">{item.description}</p>
                  </div>
                  <div className="shrink-0">
                    <Badge variant="success" size="sm">DONE</Badge>
                  </div>
                </div>
             ))}
           </div>
         ) : (
           <div className="text-center p-6 bg-surface-container rounded-lg border border-outline-variant text-on-surface-variant text-[13px]">
             No recently completed operator actions.
           </div>
         )}
      </section>

      {/* -------------------- DETAIL MODAL -------------------- */}
      <Modal isOpen={!!selectedItemId} onClose={() => { setSelectedItemId(null); setIsEditingOperator(false); }} title="Operator Control" size="lg">
         {activeItem ? (
           <div className="flex flex-col gap-6 pb-4">
              
              {mutationError && (
                 <Alert variant="danger" title="Action Failed">
                   {mutationError}
                   <div className="mt-3">
                     <Button variant="secondary" size="sm" onClick={() => setMutationError(null)}>Dismiss</Button>
                   </div>
                 </Alert>
              )}

              {/* Header Identification */}
              <div className="flex flex-col md:flex-row justify-between items-start border-b border-outline-variant pb-5">
                 <div className="flex-1 pr-4">
                   <div className="flex items-center gap-2 mb-2">
                     <span className="text-[11px] font-bold text-primary tracking-wider uppercase border text-primary border-primary/30 bg-primary/10 px-2 py-0.5 rounded-sm">
                       MODULE: {activeItem.sourceModule}
                     </span>
                   </div>
                   <h2 className="text-[24px] font-display font-bold text-on-surface leading-tight">{activeItem.title}</h2>
                   <p className="text-[15px] text-on-surface-variant mt-2 leading-relaxed">{activeItem.description}</p>
                 </div>
                 <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0 text-right shrink-0">
                    <Badge variant={getPriorityBadgeVariant(activeItem.priority)}>{activeItem.priority} PRIORITY</Badge>
                    <Badge variant={getStatusBadgeVariant(activeItem.status)}>{activeItem.status.replace("_", " ")}</Badge>
                 </div>
              </div>

              {/* Intelligence / Context Banners */}
              <div className="space-y-3">
                {activeItem.intelligenceSignal && (
                  <div className="bg-primary/5 text-[14px] font-medium text-primary-dark px-4 py-3 rounded-lg flex items-start gap-2 border border-primary/20">
                      <span className="material-symbols-outlined mt-0.5">neurology</span>
                      <span className="leading-relaxed"><strong className="text-primary mr-1">Signal:</strong> {activeItem.intelligenceSignal}</span>
                  </div>
                )}
                {activeItem.linkedContext && (
                  <div className="bg-surface-container-low text-[13px] text-on-surface font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 border border-outline-variant">
                      <span className="material-symbols-outlined text-[15px]">link</span>
                      <span>Entity Context: {activeItem.linkedContext}</span>
                  </div>
                )}
              </div>

              {/* Read / Edit Boundary */}
              <section className="bg-surface border border-outline-variant rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-[15px] uppercase tracking-wider flex items-center gap-2 text-on-surface-variant">
                     <span className="material-symbols-outlined text-[18px]">tune</span> Task Properties
                   </h3>
                   {!isEditingOperator ? (
                     <Button variant="secondary" size="sm" onClick={handleEditItem}>Edit Context</Button>
                   ) : (
                     <div className="flex gap-2">
                       <Button variant="secondary" size="sm" onClick={handleCancelEdit} disabled={isSaving}>Cancel</Button>
                       <Button variant="primary" size="sm" onClick={handleSaveItem} isLoading={isSaving}>Save Context</Button>
                     </div>
                   )}
                </div>

                {!isEditingOperator ? (
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[13px]">
                     <div>
                       <span className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Owner</span>
                       <span className="font-medium text-on-surface">{activeItem.owner}</span>
                     </div>
                     <div>
                       <span className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">{activeItem.dueDate ? 'Due Date' : 'Created Date'}</span>
                       <span className="font-medium text-on-surface text-[12px]">{new Date(activeItem.dueDate || activeItem.createdAt).toLocaleDateString()}</span>
                     </div>
                     <div>
                       <span className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Status</span>
                       <span className="font-medium text-on-surface">{activeItem.status.replace("_", " ")}</span>
                     </div>
                     <div>
                       <span className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Priority</span>
                       <span className="font-medium text-on-surface">{activeItem.priority}</span>
                     </div>
                   </div>
                ) : (
                   <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Owner">
                           <Input 
                            value={operatorDraft?.owner || ""} 
                            onChange={(e) => setOperatorDraft(prev => prev ? {...prev, owner: e.target.value} : null)}
                           />
                        </FormField>
                        <FormField label="Due Date (YYYY-MM-DD)">
                           <Input 
                            value={operatorDraft?.dueDate ? new Date(operatorDraft.dueDate).toISOString().split('T')[0] : ""} 
                            type="date"
                            onChange={(e) => setOperatorDraft(prev => prev ? {...prev, dueDate: new Date(e.target.value).toISOString()} : null)}
                           />
                        </FormField>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Status">
                          <Select
                            value={operatorDraft?.status || "OPEN"}
                            onChange={(e) => setOperatorDraft(prev => prev ? {...prev, status: e.target.value as OperatorItemStatus} : null)}
                          >
                            <option value="OPEN">OPEN</option>
                            <option value="IN_PROGRESS">IN PROGRESS</option>
                            <option value="BLOCKED">BLOCKED</option>
                            <option value="COMPLETED">COMPLETED</option>
                          </Select>
                        </FormField>
                        <FormField label="Priority">
                          <Select
                            value={operatorDraft?.priority || "MEDIUM"}
                            onChange={(e) => setOperatorDraft(prev => prev ? {...prev, priority: e.target.value as OperatorPriority} : null)}
                          >
                            <option value="LOW">LOW</option>
                            <option value="MEDIUM">MEDIUM</option>
                            <option value="HIGH">HIGH</option>
                            <option value="URGENT">URGENT</option>
                          </Select>
                        </FormField>
                      </div>
                   </div>
                )}
              </section>

              {/* Action / Next Steps Region */}
              <section className="bg-surface-container border border-outline-variant rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                 <div className="flex-1">
                    <h4 className="text-[12px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Execution Protocol</h4>
                    <p className="text-[14.5px] font-medium text-on-surface">{activeItem.recommendedAction}</p>
                 </div>
                 
                 <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                    <Button 
                       variant="primary" 
                       className="w-full justify-center"
                       onClick={() => {
                          // Clean the route destination gracefully mapping to domain module layout names
                          const dest = activeItem.sourceModule.toLowerCase();
                          router.push(`/${dest}`);
                       }}
                    >
                       Open {activeItem.sourceModule}
                    </Button>
                    
                    {activeItem.status !== "COMPLETED" && (
                       <Button 
                          variant="secondary" 
                          className="w-full justify-center" 
                          onClick={() => setConfirmCompleteAction({ id: activeItem.id, actionName: activeItem.title })}
                       >
                          Mark as Completed
                       </Button>
                    )}
                 </div>
              </section>

           </div>
         ) : <Skeleton className="h-64 w-full" />}
      </Modal>

      {/* -------------------- DESTRUCTIVE/IMPORTANT CONFIRMATIONS -------------------- */}
      <ConfirmationDialog
        isOpen={!!confirmCompleteAction}
        onClose={() => { if (!isSaving) setConfirmCompleteAction(null); }}
        onConfirm={executeActionCompletion}
        title="Complete Operator Task"
        description={`Are you sure you want to mark the operational task "${confirmCompleteAction?.actionName}" as completed?`}
        confirmText="Mark Completed"
        isDestructive={false}
        isLoading={isSaving}
      />

    </div>
  );
}
