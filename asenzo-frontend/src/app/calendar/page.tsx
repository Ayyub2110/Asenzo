"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  getCalendar, 
  updateCalendarEvent,
  completeCalendarEvent
} from "@/lib/adapters";
import { 
  CalendarData, 
  CalendarEvent,
  CalendarEventStatus,
  CalendarPriority
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

function getPriorityBadgeVariant(priority: CalendarPriority) {
  switch (priority) {
    case "URGENT": return "danger";
    case "HIGH": return "warning";
    case "STANDARD":
    default: return "neutral";
  }
}

function getStatusBadgeVariant(status: CalendarEventStatus) {
  switch (status) {
    case "MISSED":
    case "CONFLICT": return "danger";
    case "COMPLETED": return "success";
    case "SCHEDULED":
    default: return "neutral";
  }
}

export default function CalendarWorkspace() {
  const router = useRouter();

  const { data, setData, localData, setLocalData, loading, error, reload: loadData } = useAdapter(getCalendar);
  
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Modal buffer state
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const activeEvent = localData?.events.find(e => e.id === selectedEventId);

  // Edits
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [eventDraft, setEventDraft] = useState<CalendarEvent | null>(null);

  // Confidence boundaries
  const [confirmCompleteAction, setConfirmCompleteAction] = useState<{ id: string, title: string } | null>(null);

  // --------------- MUTATION WORKFLOW ---------------
  function handleEditEvent() {
    if (!activeEvent) return;
    setMutationError(null);
    setEventDraft({ ...activeEvent });
    setIsEditingEvent(true);
  }

  function handleCancelEdit() {
    setMutationError(null);
    setEventDraft(null);
    setIsEditingEvent(false);
  }

  async function handleSaveEvent() {
    if (!eventDraft) return;
    setMutationError(null);
    setIsSaving(true);
    try {
      const res = await updateCalendarEvent(eventDraft);
      setLocalData(res);
      setData(res);
      setIsEditingEvent(false);
      setEventDraft(null);
    } catch (err: unknown) {
      setMutationError("Failed to update event: " + (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  }

  async function executeCompletion() {
    if (!confirmCompleteAction || !localData) return;
    setMutationError(null);
    setIsSaving(true);
    try {
      const res = await completeCalendarEvent(confirmCompleteAction.id);
      setLocalData(res);
      setData(res);
      setConfirmCompleteAction(null);
    } catch(err: unknown) {
      setMutationError("Completion routing failed: " + (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  }

  // --------------- RENDER STATES ---------------
  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto p-6 md:p-8 animate-in fade-in duration-500 space-y-8">
        <header className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <Alert variant="danger" title="Calendar Sync Error">
          {error}
          <div className="mt-4">
            <Button variant="secondary" onClick={loadData}>Retry Connection</Button>
          </div>
        </Alert>
      </div>
    );
  }

  // Slice categories
  const attentionRequired = localData.events.filter(e => e.status === "CONFLICT" || e.status === "MISSED");
  const upcomingEvents = localData.events.filter(e => e.status === "SCHEDULED");
  const completedEvents = localData.events.filter(e => e.status === "COMPLETED");

  const RenderCard = ({ event }: { event: CalendarEvent }) => (
    <Card 
      className={`cursor-pointer transition-shadow hover:shadow-md flex flex-col h-full 
        ${event.status === 'CONFLICT' || event.status === 'MISSED' ? 'border-error/30 ring-1 ring-error/20 bg-error/5' : 'bg-surface'}
      `}
      onClick={() => setSelectedEventId(event.id)}
    >
      <div className="p-5 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <Badge variant={getStatusBadgeVariant(event.status)} size="sm">{event.status}</Badge>
            <Badge variant={getPriorityBadgeVariant(event.priority)} size="sm">{event.priority}</Badge>
          </div>
          {event.sourceModule && (
            <span className="text-[11px] font-bold text-on-surface-variant uppercase border border-outline-variant px-1 rounded-sm">
              {event.sourceModule}
            </span>
          )}
        </div>
        <h3 className="text-[16px] font-bold text-on-surface mb-1">{event.title}</h3>
        <p className="text-[13px] text-on-surface-variant mb-4 flex-1 line-clamp-3">{event.description}</p>

        {event.intelligenceSignal && (
          <div className="mb-4 bg-primary/10 text-[12px] font-medium text-primary-dark p-2.5 rounded-md flex items-start gap-1.5 border border-primary/20">
            <span className="material-symbols-outlined text-[15px] mt-0.5">warning</span>
            <span className="leading-tight">{event.intelligenceSignal}</span>
          </div>
        )}

        <div className="pt-4 border-t border-outline-variant">
           <div className="flex items-center justify-between text-[12.5px] font-medium text-on-surface">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px]">event</span> 
                {new Date(event.date).toLocaleDateString()}
              </span>
              <span className="text-on-surface-variant">{event.startTime} - {event.endTime}</span>
           </div>
           
           <div className="mt-2.5 flex items-center gap-1.5 text-[12px] font-medium text-on-surface-variant">
             <span className="material-symbols-outlined text-[14px]">person</span> 
             {event.owner}
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
          <h1 className="text-[28px] font-display font-medium text-on-surface tracking-tight">Calendar</h1>
          <p className="text-on-surface-variant text-[15px] mt-1">Operational schedule resolving conflicts and commitments.</p>
        </div>
        <div className="flex bg-surface border border-outline-variant rounded-[var(--radius-lg)] p-1.5 text-center shadow-sm">
           <div className="px-5 py-2 border-r border-outline-variant uppercase">
             <span className="block text-[11px] font-bold text-error tracking-wider mb-0.5">Issues</span>
             <span className="text-[18px] font-display font-bold text-on-surface">{attentionRequired.length}</span>
           </div>
           <div className="px-5 py-2 uppercase">
             <span className="block text-[11px] font-bold text-on-surface-variant tracking-wider mb-0.5">Scheduled</span>
             <span className="text-[18px] font-display font-bold text-on-surface">{upcomingEvents.length}</span>
           </div>
        </div>
      </header>

      {/* -------------------- ATTENTION REQUIRED -------------------- */}
      <section>
        <div className="flex items-center gap-2 mb-4">
           <span className="material-symbols-outlined text-error text-[20px]">report</span>
           <h2 className="text-[14px] uppercase font-bold tracking-wider text-on-surface-variant">Attention Required</h2>
        </div>
        {attentionRequired.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
             {attentionRequired.map(event => <RenderCard key={event.id} event={event} />)}
          </div>
        ) : (
          <div className="text-center p-8 bg-surface-container rounded-xl border border-outline-variant text-on-surface-variant flex flex-col items-center">
            <span className="material-symbols-outlined text-[32px] mb-2 text-success">event_available</span>
            <p className="font-semibold text-on-surface text-[14.5px] mb-1">Clear Schedule</p>
            <p className="text-[13px]">No calendar conflicts or missed meetings.</p>
          </div>
        )}
      </section>

      {/* -------------------- UPCOMING -------------------- */}
      <section>
         <div className="flex items-center gap-2 mb-4">
           <span className="material-symbols-outlined text-on-surface-variant text-[20px]">calendar_today</span>
           <h2 className="text-[14px] uppercase font-bold tracking-wider text-on-surface-variant">Upcoming</h2>
         </div>
         {upcomingEvents.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
             {upcomingEvents.map(event => <RenderCard key={event.id} event={event} />)}
           </div>
         ) : (
           <div className="text-center p-8 bg-surface-container rounded-xl border border-outline-variant text-on-surface-variant">
             <p className="text-[13px]">No upcoming commitments scheduled.</p>
           </div>
         )}
      </section>

      {/* -------------------- RECENTLY COMPLETED -------------------- */}
      <section>
         <h2 className="text-[13.5px] uppercase font-bold tracking-wider text-on-surface-variant mb-4">Recently Completed</h2>
         {completedEvents.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
             {completedEvents.map(event => (
                <div key={event.id} onClick={() => setSelectedEventId(event.id)} className="cursor-pointer bg-surface-container border border-outline-variant rounded-lg p-3.5 flex justify-between items-center transition-colors hover:bg-surface-container-high">
                  <div className="flex-1 pr-3">
                    <h5 className="font-bold text-[13.5px] text-on-surface mb-0.5 line-clamp-1">{event.title}</h5>
                    <p className="text-[12px] text-on-surface-variant truncate">{event.date.split("T")[0]} {event.startTime}</p>
                  </div>
                  <div className="shrink-0">
                    <Badge variant="success" size="sm">DONE</Badge>
                  </div>
                </div>
             ))}
           </div>
         ) : (
           <div className="text-center p-6 bg-surface-container rounded-lg border border-outline-variant text-on-surface-variant text-[13px]">
             No recently completed meetings.
           </div>
         )}
      </section>

      {/* -------------------- DETAIL MODAL -------------------- */}
      <Modal isOpen={!!selectedEventId} onClose={() => { setSelectedEventId(null); setIsEditingEvent(false); }} title="Commitment Interface" size="lg">
         {activeEvent ? (
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
                   {activeEvent.sourceModule && (
                     <div className="flex items-center gap-2 mb-2">
                       <span className="text-[11px] font-bold text-primary tracking-wider uppercase border text-primary border-primary/30 bg-primary/10 px-2 py-0.5 rounded-sm">
                         MODULE: {activeEvent.sourceModule}
                       </span>
                     </div>
                   )}
                   <h2 className="text-[24px] font-display font-bold text-on-surface leading-tight">{activeEvent.title}</h2>
                   <p className="text-[15px] text-on-surface-variant mt-2 leading-relaxed">{activeEvent.description}</p>
                 </div>
                 <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0 text-right shrink-0">
                    <Badge variant={getStatusBadgeVariant(activeEvent.status)}>{activeEvent.status}</Badge>
                    <Badge variant={getPriorityBadgeVariant(activeEvent.priority)}>{activeEvent.priority} PRIORITY</Badge>
                 </div>
              </div>

              {/* Intelligence / Context Banners */}
              <div className="space-y-3">
                {activeEvent.intelligenceSignal && (
                  <div className="bg-primary/5 text-[14px] font-medium text-primary-dark px-4 py-3 rounded-lg flex items-start gap-2 border border-primary/20">
                      <span className="material-symbols-outlined mt-0.5">insights</span>
                      <span className="leading-relaxed"><strong className="text-primary mr-1">Signal:</strong> {activeEvent.intelligenceSignal}</span>
                  </div>
                )}
                {activeEvent.linkedContext && (
                  <div className="bg-surface-container-low text-[13px] text-on-surface font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 border border-outline-variant">
                      <span className="material-symbols-outlined text-[15px]">link</span>
                      <span>Entity Context: {activeEvent.linkedContext}</span>
                  </div>
                )}
              </div>

              {/* Read / Edit Boundary */}
              <section className="bg-surface border border-outline-variant rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-[15px] uppercase tracking-wider flex items-center gap-2 text-on-surface-variant">
                     <span className="material-symbols-outlined text-[18px]">event_note</span> Schedule Parameters
                   </h3>
                   {!isEditingEvent ? (
                     <Button variant="secondary" size="sm" onClick={handleEditEvent}>Edit Properties</Button>
                   ) : (
                     <div className="flex gap-2">
                       <Button variant="secondary" size="sm" onClick={handleCancelEdit} disabled={isSaving}>Cancel</Button>
                       <Button variant="primary" size="sm" onClick={handleSaveEvent} isLoading={isSaving}>Save Edits</Button>
                     </div>
                   )}
                </div>

                {!isEditingEvent ? (
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[13px]">
                     <div>
                       <span className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Date</span>
                       <span className="font-medium text-on-surface">{new Date(activeEvent.date).toLocaleDateString()}</span>
                     </div>
                     <div>
                       <span className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Time</span>
                       <span className="font-medium text-on-surface">{activeEvent.startTime} - {activeEvent.endTime}</span>
                     </div>
                     <div>
                       <span className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Owner</span>
                       <span className="font-medium text-on-surface line-clamp-1">{activeEvent.owner}</span>
                     </div>
                     <div>
                       <span className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Status</span>
                       <span className="font-medium text-on-surface">{activeEvent.status}</span>
                     </div>
                   </div>
                ) : (
                   <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField label="Date (YYYY-MM-DD)">
                           <Input 
                            value={eventDraft?.date ? new Date(eventDraft.date).toISOString().split('T')[0] : ""}
                            type="date"
                            onChange={(e) => setEventDraft(prev => prev ? {...prev, date: new Date(e.target.value).toISOString()} : null)}
                           />
                        </FormField>
                        <FormField label="Start Time">
                           <Input 
                            value={eventDraft?.startTime || ""} 
                            onChange={(e) => setEventDraft(prev => prev ? {...prev, startTime: e.target.value} : null)}
                           />
                        </FormField>
                        <FormField label="End Time">
                           <Input 
                            value={eventDraft?.endTime || ""} 
                            onChange={(e) => setEventDraft(prev => prev ? {...prev, endTime: e.target.value} : null)}
                           />
                        </FormField>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Status">
                          <Select
                            value={eventDraft?.status || "SCHEDULED"}
                            onChange={(e) => setEventDraft(prev => prev ? {...prev, status: e.target.value as CalendarEventStatus} : null)}
                          >
                            <option value="SCHEDULED">SCHEDULED</option>
                            <option value="MISSED">MISSED</option>
                            <option value="CONFLICT">CONFLICT</option>
                            <option value="COMPLETED">COMPLETED</option>
                          </Select>
                        </FormField>
                        <FormField label="Priority">
                          <Select
                            value={eventDraft?.priority || "STANDARD"}
                            onChange={(e) => setEventDraft(prev => prev ? {...prev, priority: e.target.value as CalendarPriority} : null)}
                          >
                            <option value="STANDARD">STANDARD</option>
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
                    <h4 className="text-[12px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Expected Next Action</h4>
                    <p className="text-[14.5px] font-medium text-on-surface">{activeEvent.recommendedAction || "Ensure attendance or manually reschedule."}</p>
                 </div>
                 
                 <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                    {activeEvent.sourceModule && (
                      <Button 
                         variant="primary" 
                         className="w-full justify-center"
                         onClick={() => {
                            const dest = activeEvent.sourceModule?.toLowerCase();
                            if (dest) router.push(`/${dest}`);
                         }}
                      >
                         View Source Context
                      </Button>
                    )}
                    
                    {activeEvent.status !== "COMPLETED" && (
                       <Button 
                          variant="secondary" 
                          className="w-full justify-center" 
                          onClick={() => setConfirmCompleteAction({ id: activeEvent.id, title: activeEvent.title })}
                       >
                          Log as Completed
                       </Button>
                    )}
                 </div>
              </section>

           </div>
         ) : <Skeleton className="h-64 w-full" />}
      </Modal>

      <ConfirmationDialog
        isOpen={!!confirmCompleteAction}
        onClose={() => { if (!isSaving) setConfirmCompleteAction(null); }}
        onConfirm={executeCompletion}
        title="Complete Calendar Commitment"
        description={`Are you sure you want to mark "${confirmCompleteAction?.title}" as logged and completed?`}
        confirmText="Log Completed"
        isDestructive={false}
        isLoading={isSaving}
      />

    </div>
  );
}
