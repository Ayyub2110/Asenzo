"use client";

import React, { useState } from "react";
import { 
  getRevenue, 
  updateRevenueEngagement, 
  updateRevenueItem,
  resolveRevenueRisk,
  updateRevenueNextAction
} from "@/lib/adapters";
import { 
  RevenueEngagement,
  RevenueItem,
  RevenueStatus
} from "@/lib/types";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input, Select, FormField } from "@/components/ui/Forms";
import { Skeleton, CardSkeleton } from "@/components/ui/States";
import { Alert } from "@/components/ui/Alert";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { useAdapter } from "@/hooks/useAdapter";

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

function getStatusBadgeContext(status: string) {
  switch (status) {
    case "COLLECTED":
    case "PAID":
      return { variant: "success" as const };
    case "AT_RISK":
    case "OVERDUE":
      return { variant: "danger" as const };
    case "INVOICED":
    case "DUE":
    case "ON_TRACK":
    case "PARTIAL":
      return { variant: "warning" as const };
    default:
      return { variant: "neutral" as const };
  }
}

export default function RevenueWorkspace() {
  const { setData, localData, setLocalData, loading, error, reload: loadData } = useAdapter(getRevenue);
  
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Detail Modal setup
  const [selectedEngagementId, setSelectedEngagementId] = useState<string | null>(null);
  const activeEngagement = localData?.engagements.find(e => e.id === selectedEngagementId);

  // Edit Context buffer
  const [isEditingRevenue, setIsEditingRevenue] = useState(false);
  const [revenueDraft, setRevenueDraft] = useState<RevenueEngagement | null>(null);

  // Confirmation actions
  const [confirmRiskResolve, setConfirmRiskResolve] = useState<{ engagementId: string, riskId: string } | null>(null);
  const [confirmActionComplete, setConfirmActionComplete] = useState<{ engagementId: string, actionId: string } | null>(null);
  const [confirmItemCollect, setConfirmItemCollect] = useState<{ engagementId: string, item: RevenueItem } | null>(null);

  // --------------- CONTEXT EDIT PIPELINE ---------------
  function handleEditRevenue() {
    if (!activeEngagement) return;
    setMutationError(null);
    setRevenueDraft({ ...activeEngagement });
    setIsEditingRevenue(true);
  }

  function handleCancelEdit() {
    setMutationError(null);
    setRevenueDraft(null);
    setIsEditingRevenue(false);
  }

  async function handleSaveRevenue() {
    if (!revenueDraft) return;
    setMutationError(null);
    setIsSaving(true);
    try {
      const res = await updateRevenueEngagement(revenueDraft);
      setLocalData(res);
      setData(res);
      setIsEditingRevenue(false);
      setRevenueDraft(null);
    } catch (err: unknown) {
      setMutationError("Failed to save operational context: " + (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  }

  // --------------- ITEM COLLECTION PIPELINE ---------------
  async function executeItemCollection() {
    if (!confirmItemCollect || !localData) return;
    setMutationError(null);
    setIsSaving(true);
    try {
      const payload: RevenueItem = { ...confirmItemCollect.item, status: "COLLECTED" };
      const res = await updateRevenueItem(confirmItemCollect.engagementId, payload);
      setLocalData(res);
      setData(res);
      setConfirmItemCollect(null);
    } catch (err: unknown) {
      setMutationError("Failed to update item state: " + (err as Error).message);
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
      const res = await resolveRevenueRisk(confirmRiskResolve.engagementId, confirmRiskResolve.riskId);
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
      const res = await updateRevenueNextAction(confirmActionComplete.engagementId, confirmActionComplete.actionId);
      setLocalData(res);
      setData(res);
      setConfirmActionComplete(null);
    } catch(err: unknown) {
      setMutationError("Failed to complete action: " + (err as Error).message);
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
        <Alert variant="danger" title="Failed to load Revenue Data">
          {error}
          <div className="mt-4">
            <Button variant="secondary" onClick={loadData}>Retry</Button>
          </div>
        </Alert>
      </div>
    );
  }

  const needingAttention = localData.engagements.filter(e => 
    e.status === "AT_RISK" || 
    e.status === "OVERDUE" || 
    e.risks.some(r => r.status === "OPEN")
  );

  const activeRevenue = localData.engagements.filter(e => 
    e.status === "ON_TRACK" || e.status === "NOT_STARTED"
  );
  
  const completedRevenue = localData.engagements.filter(e => e.status === "COLLECTED");

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-8 space-y-10 animate-in fade-in duration-500">
      
      {/* -------------------- HEADER -------------------- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[28px] font-display font-medium text-on-surface tracking-tight">Revenue Operations</h1>
          <p className="text-on-surface-variant text-[15px] mt-1">Operational view of billing, active collections, and revenue risks.</p>
        </div>
        <div className="flex bg-surface border border-outline-variant rounded-[var(--radius-lg)] p-1 text-center shadow-sm">
           <div className="px-5 py-2 border-r border-outline-variant uppercase">
             <span className="block text-[11px] font-bold text-error tracking-wider mb-0.5">At Risk / Overdue</span>
             <span className="text-[17px] font-display font-bold text-on-surface">{needingAttention.length}</span>
           </div>
           <div className="px-5 py-2 uppercase">
             <span className="block text-[11px] font-bold text-on-surface-variant tracking-wider mb-0.5">Active</span>
             <span className="text-[17px] font-display font-bold text-on-surface">{activeRevenue.length}</span>
           </div>
        </div>
      </header>

      {/* -------------------- ATTENTION REQUIRED -------------------- */}
      <section>
        <div className="flex items-center gap-2 mb-4">
           <span className="material-symbols-outlined text-error text-[20px]">warning</span>
           <h2 className="text-[13.5px] uppercase font-bold tracking-wider text-on-surface-variant">Attention Required</h2>
        </div>
        
        {needingAttention.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {needingAttention.map(engagement => (
               <Card 
                key={`urgent-${engagement.id}`} 
                className="cursor-pointer transition-shadow hover:shadow-md border-error/30 ring-1 ring-error/20 bg-error/5"
                onClick={() => setSelectedEngagementId(engagement.id)}
               >
                 <div className="p-5 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-2">
                       <Badge {...getStatusBadgeContext(engagement.status)} size="sm">{engagement.status.replace("_", " ")}</Badge>
                       <span className="text-[14.5px] font-display font-bold text-on-surface">
                         {formatCurrency(engagement.amount, engagement.currency)}
                       </span>
                    </div>
                    <h3 className="text-[16px] font-bold text-on-surface mb-1 truncate">{engagement.customerName}</h3>
                    <p className="text-[13px] text-on-surface-variant mb-4">{engagement.description}</p>
                    
                    {engagement.intelligenceSignal && (
                      <div className="mb-3 bg-error/10 text-[12px] font-medium text-error p-2 rounded flex items-start gap-1">
                        <span className="material-symbols-outlined text-[14px]">insights</span>
                        <span className="leading-tight">{engagement.intelligenceSignal}</span>
                      </div>
                    )}

                    <div className="mt-auto pt-3 border-t border-error/20 text-[12px] text-on-surface flex justify-between items-center">
                       <span className="flex items-center gap-1 font-medium"><span className="material-symbols-outlined text-[14px]">event</span> Due: {new Date(engagement.dueDate).toLocaleDateString()}</span>
                       <span className="flex items-center gap-1 font-bold text-on-surface-variant">{engagement.owner}</span>
                    </div>
                 </div>
               </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-surface-container rounded-xl border border-outline-variant text-on-surface-variant flex flex-col items-center">
            <span className="material-symbols-outlined text-[32px] mb-2 text-success">verified</span>
            <p className="font-semibold text-on-surface text-[14.5px] mb-1">Clear</p>
            <p className="text-[13px]">No revenue items require attention.</p>
          </div>
        )}
      </section>

      {/* -------------------- ACTIVE REVENUE -------------------- */}
      <section>
         <h2 className="text-[13.5px] uppercase font-bold tracking-wider text-on-surface-variant mb-4">Active Revenue (On Track)</h2>
         {activeRevenue.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {activeRevenue.map(engagement => (
               <div 
                 key={`active-${engagement.id}`}
                 onClick={() => setSelectedEngagementId(engagement.id)}
                 className="cursor-pointer border border-outline-variant bg-surface rounded-xl p-5 transition-colors hover:border-primary shrink-0 flex flex-col"
               >
                 <div className="flex justify-between items-start mb-2">
                   <h4 className="font-bold text-[16px] truncate text-on-surface">{engagement.customerName}</h4>
                   <span className="text-[14px] font-display font-medium text-on-surface-variant">{formatCurrency(engagement.amount, engagement.currency)}</span>
                 </div>
                 <div className="flex gap-2 items-center mb-3">
                   <Badge {...getStatusBadgeContext(engagement.status)} size="sm">{engagement.status.replace("_", " ")}</Badge>
                   <span className="text-[11px] font-bold text-on-surface-variant uppercase">{engagement.paymentState}</span>
                 </div>
                 <div className="mt-3 pt-3 border-t border-outline-variant flex items-center justify-between text-[11.5px] text-on-surface-variant uppercase tracking-wide">
                    <span>Due: {new Date(engagement.dueDate).toLocaleDateString()}</span>
                    <span>{engagement.items.filter(i => i.status !== "COLLECTED").length} Pending Items</span>
                 </div>
               </div>
             ))}
           </div>
         ) : (
           <div className="text-center p-8 bg-surface-container rounded-xl border border-outline-variant text-on-surface-variant">
             <p className="text-[13px]">No active revenue items.</p>
           </div>
         )}
      </section>

      {/* -------------------- COMPLETED / COLLECTED -------------------- */}
      <section>
         <h2 className="text-[13.5px] uppercase font-bold tracking-wider text-on-surface-variant mb-4">Recently Collected</h2>
         {completedRevenue.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
             {completedRevenue.map(eng => (
                <div key={`comp-${eng.id}`} onClick={() => setSelectedEngagementId(eng.id)} className="cursor-pointer bg-surface-container border border-outline-variant rounded-lg p-3 flex justify-between items-center transition-colors hover:bg-surface-container-high">
                  <div>
                    <h5 className="font-bold text-[13.5px] text-on-surface">{eng.customerName}</h5>
                    <p className="text-[11.5px] text-on-surface-variant">{eng.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="block font-medium text-[13px] text-success">{formatCurrency(eng.amount, eng.currency)}</span>
                  </div>
                </div>
             ))}
           </div>
         ) : (
           <div className="text-center p-6 bg-surface-container rounded-lg border border-outline-variant text-on-surface-variant text-[13px]">
             No recently completed revenue cycles.
           </div>
         )}
      </section>

      {/* -------------------- DETAIL MODAL -------------------- */}
      <Modal isOpen={!!selectedEngagementId} onClose={() => { setSelectedEngagementId(null); setIsEditingRevenue(false); }} title="Revenue Detail" size="lg">
         {activeEngagement ? (
           <div className="flex flex-col gap-8 pb-4">
              
              {/* Alert Render */}
              {mutationError && (
                 <Alert variant="danger" title="Action Failed">
                   {mutationError}
                   <div className="mt-3">
                     <Button variant="secondary" size="sm" onClick={() => setMutationError(null)}>Dismiss</Button>
                   </div>
                 </Alert>
              )}

              {/* Header Context */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant pb-5">
                 <div>
                   <h2 className="text-[26px] font-display font-bold text-on-surface">{activeEngagement.customerName}</h2>
                   <p className="text-[15px] font-medium text-on-surface-variant mt-1">{activeEngagement.description}</p>
                   {activeEngagement.linkedContext && (
                     <p className="mt-2 text-[12.5px] text-on-surface bg-surface-container-low px-2 py-1 rounded inline-flex items-center gap-1 border border-outline-variant"><span className="material-symbols-outlined text-[14px]">link</span> {activeEngagement.linkedContext}</p>
                   )}
                 </div>
                 
                 <div className="text-left md:text-right">
                    <p className="text-[28px] font-display font-bold text-on-surface">{formatCurrency(activeEngagement.amount, activeEngagement.currency)}</p>
                    <div className="flex items-center md:justify-end gap-2 mt-1">
                      <Badge {...getStatusBadgeContext(activeEngagement.status)} size="sm">{activeEngagement.status.replace("_", " ")}</Badge>
                      <Badge variant="neutral" size="sm">{activeEngagement.paymentState}</Badge>
                    </div>
                 </div>
              </div>

              {/* Intelligence/Error Signal Context */}
              {activeEngagement.intelligenceSignal && (
                <div className="bg-primary/5 text-primary text-[13.5px] font-medium px-4 py-3 rounded-lg flex items-start gap-2 border border-primary/20">
                    <span className="material-symbols-outlined mt-0.5">insights</span>
                    <span className="leading-relaxed">System Intelligence: {activeEngagement.intelligenceSignal}</span>
                </div>
              )}

              {/* Read / Edit Boundary */}
              <section className="bg-surface border border-outline-variant rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-[15px] uppercase tracking-wider flex items-center gap-2 text-on-surface-variant">
                     <span className="material-symbols-outlined text-[18px]">tune</span> Revenue Context
                   </h3>
                   {!isEditingRevenue ? (
                     <Button variant="secondary" size="sm" onClick={handleEditRevenue}>Edit Context</Button>
                   ) : (
                     <div className="flex gap-2">
                       <Button variant="secondary" size="sm" onClick={handleCancelEdit} disabled={isSaving}>Cancel</Button>
                       <Button variant="primary" size="sm" onClick={handleSaveRevenue} isLoading={isSaving}>Save Context</Button>
                     </div>
                   )}
                </div>

                {!isEditingRevenue ? (
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[13.5px]">
                     <div>
                       <span className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Owner</span>
                       <span className="font-medium text-on-surface">{activeEngagement.owner}</span>
                     </div>
                     <div>
                       <span className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Expected Date</span>
                       <span className="font-medium text-on-surface">{new Date(activeEngagement.dueDate).toLocaleDateString()}</span>
                     </div>
                     <div>
                       <span className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Status</span>
                       <span className="font-medium text-on-surface">{activeEngagement.status.replace("_", " ")}</span>
                     </div>
                     <div>
                       <span className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Payment State</span>
                       <span className="font-medium text-on-surface">{activeEngagement.paymentState}</span>
                     </div>
                   </div>
                ) : (
                   <div className="space-y-4">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Owner">
                           <Input 
                            value={revenueDraft?.owner || ""} 
                            onChange={(e) => setRevenueDraft(prev => prev ? {...prev, owner: e.target.value} : null)}
                           />
                        </FormField>
                        <FormField label="Payment State">
                          <Select
                            value={revenueDraft?.paymentState || "UNINVOICED"}
                            onChange={(e) => setRevenueDraft(prev => prev ? {...prev, paymentState: e.target.value as RevenueEngagement['paymentState']} : null)}
                          >
                            <option value="UNINVOICED">UNINVOICED</option>
                            <option value="INVOICED">INVOICED</option>
                            <option value="PARTIAL">PARTIAL</option>
                            <option value="PAID">PAID</option>
                          </Select>
                        </FormField>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Internal Status">
                          <Select
                            value={revenueDraft?.status || "ON_TRACK"}
                            onChange={(e) => setRevenueDraft(prev => prev ? {...prev, status: e.target.value as RevenueStatus} : null)}
                          >
                            <option value="NOT_STARTED">NOT STARTED</option>
                            <option value="ON_TRACK">ON TRACK</option>
                            <option value="AT_RISK">AT RISK</option>
                            <option value="OVERDUE">OVERDUE</option>
                            <option value="COLLECTED">COLLECTED</option>
                          </Select>
                        </FormField>
                        <FormField label="Due Date (YYYY-MM-DD)">
                           <Input 
                            value={revenueDraft ? new Date(revenueDraft.dueDate).toISOString().split('T')[0] : ""} 
                            type="date"
                            onChange={(e) => setRevenueDraft(prev => prev ? {...prev, dueDate: new Date(e.target.value).toISOString()} : null)}
                           />
                        </FormField>
                      </div>

                   </div>
                )}
              </section>

              {/* Outstanding / Collected Items Workflow */}
              <section>
                 <h3 className="font-bold text-[15px] uppercase tracking-wider mb-4 border-b border-outline-variant pb-2 flex items-center gap-2">
                   <span className="material-symbols-outlined text-[18px]">receipt_long</span> Revenue Records / Tranches
                 </h3>
                 
                 {activeEngagement.items.length > 0 ? (
                   <div className="space-y-3">
                     {activeEngagement.items.map(item => (
                       <div key={item.id} className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${item.status === 'COLLECTED' ? 'bg-success/5 border-success/30' : 'bg-surface border-outline-variant'}`}>
                          <div className="flex-1">
                             <div className="flex items-center gap-2 mb-1">
                               <Badge {...getStatusBadgeContext(item.status)} size="sm">{item.status.replace("_", " ")}</Badge>
                               <span className="text-[12px] font-bold text-on-surface-variant tracking-wider uppercase border text-[10px] px-1 rounded-sm border-outline-variant">{item.id}</span>
                             </div>
                             <h4 className="font-bold text-[15px] text-on-surface mb-1 flex justify-between w-full pr-4">
                               {item.title} <span className="font-display ml-auto tracking-wide">{formatCurrency(item.amount, activeEngagement.currency)}</span>
                             </h4>
                             <p className="text-[13px] text-on-surface-variant mb-2">{item.description}</p>
                             <p className="text-[11.5px] font-medium text-on-surface flex items-center gap-1 opacity-70">
                               <span className="material-symbols-outlined text-[13px]">event</span> {item.status === 'COLLECTED' ? 'Collected on' : 'Due'}: {new Date(item.dueDate).toLocaleDateString()}
                             </p>
                          </div>
                          <div className="w-full md:w-auto text-right border-t md:border-t-0 md:border-l border-outline-variant pt-3 md:pt-0 md:pl-4 mt-2 md:mt-0">
                             {item.status !== "COLLECTED" && (
                               <Button variant="secondary" size="sm" onClick={() => setConfirmItemCollect({ engagementId: activeEngagement.id, item })}>
                                 Mark Collected
                               </Button>
                             )}
                          </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="text-center p-6 bg-surface-container rounded-xl border border-outline-variant text-[14px] text-on-surface-variant">
                      No revenue records are available.
                   </div>
                 )}
              </section>

              {/* Active Risks */}
              <section>
                 <div className="flex items-center gap-2 mb-4 border-b border-outline-variant pb-2">
                    <h3 className="font-bold text-[15px] uppercase tracking-wider">Revenue Risks</h3>
                 </div>
                 {activeEngagement.risks.length > 0 ? (
                   <div className="space-y-3">
                     {activeEngagement.risks.map(r => (
                       <div key={r.id} className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between items-start gap-4 ${r.status !== 'RESOLVED' ? 'bg-error/5 border-error/30' : 'bg-surface border-outline-variant'}`}>
                          <div>
                             <div className="flex gap-2 items-center mb-2">
                               {r.status === 'RESOLVED' ? (
                                 <Badge variant="success" size="sm">RESOLVED</Badge>
                               ) : (
                                 <Badge variant="danger" size="sm">ACTIVE RISK</Badge>
                               )}
                               <span className={`font-bold text-[14.5px] ${r.status === 'RESOLVED' ? 'line-through opacity-70' : 'text-on-surface'}`}>{r.title}</span>
                             </div>
                             <p className="text-[13.5px] text-on-surface-variant max-w-[500px]">{r.description}</p>
                          </div>
                          {r.status !== 'RESOLVED' && (
                            <div className="self-end md:self-start shrink-0">
                              <Button variant="secondary" size="sm" onClick={() => setConfirmRiskResolve({ engagementId: activeEngagement.id, riskId: r.id })}>
                                Resolve Risk
                              </Button>
                            </div>
                          )}
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="text-center p-6 bg-surface-container rounded-xl border border-outline-variant text-[14px] text-on-surface-variant flex flex-col items-center">
                      <span className="material-symbols-outlined text-[24px] mb-2 text-success">verified_user</span>
                      No revenue risks require attention.
                   </div>
                 )}
              </section>

              {/* Next Action Module */}
              <section>
                 <h3 className="font-bold text-[15px] uppercase tracking-wider mb-4 border-b border-outline-variant pb-2">Operational Next Action</h3>
                 {activeEngagement.nextAction ? (
                   <div className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${activeEngagement.nextAction.status === 'COMPLETED' ? 'bg-success/5 border-success/30' : 'bg-surface border-outline-variant'}`}>
                      <div className="flex-1">
                         <div className="flex items-center gap-2 mb-1">
                           <Badge variant={activeEngagement.nextAction.status === 'COMPLETED' ? 'success' : 'neutral'} size="sm">
                             {activeEngagement.nextAction.status}
                           </Badge>
                           <h4 className="font-bold text-[15px] text-on-surface">{activeEngagement.nextAction.title}</h4>
                         </div>
                         <p className="text-[14px] text-on-surface-variant mb-2">{activeEngagement.nextAction.description}</p>
                         <div className="flex items-center gap-3 text-[12px] font-medium text-on-surface opacity-80">
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">event</span> Due: {new Date(activeEngagement.nextAction.dueDate).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">person</span> {activeEngagement.nextAction.owner}</span>
                         </div>
                      </div>
                      <div className="shrink-0 mt-3 md:mt-0 text-right w-full md:w-auto">
                         {activeEngagement.nextAction.status !== "COMPLETED" && (
                           <Button variant="secondary" size="sm" onClick={() => setConfirmActionComplete({ engagementId: activeEngagement.id, actionId: activeEngagement.nextAction!.id })}>
                             Mark Delivered
                           </Button>
                         )}
                      </div>
                   </div>
                 ) : (
                   <div className="text-center p-6 bg-surface-container rounded-xl border border-outline-variant text-[14px] text-on-surface-variant">
                      No next actions are currently pending.
                   </div>
                 )}
              </section>

           </div>
         ) : <Skeleton className="h-64 w-full" />}
      </Modal>

      {/* -------------------- DESTRUCTIVE/IMPORTANT CONFIRMATIONS -------------------- */}
      <ConfirmationDialog
        isOpen={!!confirmItemCollect}
        onClose={() => { if (!isSaving) setConfirmItemCollect(null); }}
        onConfirm={executeItemCollection}
        title="Confirm Revenue Collection"
        description={`Are you confirming that you have successfully collected the funds for ${confirmItemCollect?.item.title}?`}
        confirmText="Mark Collected"
        isDestructive={false}
        isLoading={isSaving}
      />

      <ConfirmationDialog
        isOpen={!!confirmRiskResolve}
        onClose={() => { if (!isSaving) setConfirmRiskResolve(null); }}
        onConfirm={executeRiskResolution}
        title="Resolve Revenue Risk"
        description="Are you sure you want to mark this revenue risk as resolved? This removes it from the attention workflow."
        confirmText="Confirm Resolution"
        isDestructive={false}
        isLoading={isSaving}
      />

      <ConfirmationDialog
        isOpen={!!confirmActionComplete}
        onClose={() => { if (!isSaving) setConfirmActionComplete(null); }}
        onConfirm={executeActionCompletion}
        title="Complete Next Action"
        description="Are you sure you want to mark the pending revenue action as delivered?"
        confirmText="Mark Delivered"
        isDestructive={false}
        isLoading={isSaving}
      />

    </div>
  );
}
