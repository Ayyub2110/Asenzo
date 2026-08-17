"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  getCalendar, 
  updateCalendarEvent,
  completeCalendarEvent
} from "@/lib/adapters";
import { 
  CalendarEvent,
  CalendarEventStatus,
  CalendarPriority
} from "@/lib/types";

import { Skeleton, CardSkeleton } from "@/components/ui/States";
import { Alert } from "@/components/ui/Alert";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { useAdapter } from "@/hooks/useAdapter";

export default function CalendarWorkspace() {
  const router = useRouter();

  const { data, setData, localData, setLocalData, loading, error, reload: loadData } = useAdapter(getCalendar);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="p-container-padding max-w-[1440px] mx-auto space-y-8 animate-in fade-in duration-500">
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
            <button className="bg-primary text-white px-4 py-2 rounded-lg" onClick={loadData}>Retry Connection</button>
          </div>
        </Alert>
      </div>
    );
  }

  // Active event
  if (!selectedEventId && localData.events.length > 0) {
      setSelectedEventId(localData.events[0].id);
  }

  const activeEvent = localData.events.find(e => e.id === selectedEventId);

  // Simple hardcoded mapping for styling
  const eventsByDay = {
      Mon: [] as CalendarEvent[],
      Tue: [] as CalendarEvent[],
      Wed: [] as CalendarEvent[],
      Thu: [] as CalendarEvent[],
      Fri: [] as CalendarEvent[]
  };

  localData.events.forEach((ev, idx) => {
     // randomly distribute if real dates are hard to map, or just map sequentially
     const dt = new Date(ev.date);
     const dayOfWeek = dt.getDay(); // 0(Sun) - 6(Sat)
     // Fallback mapping if dates are weird
     if (dayOfWeek === 1) eventsByDay.Mon.push(ev);
     else if (dayOfWeek === 2) eventsByDay.Tue.push(ev);
     else if (dayOfWeek === 3) eventsByDay.Wed.push(ev);
     else if (dayOfWeek === 4) eventsByDay.Thu.push(ev);
     else if (dayOfWeek === 5) eventsByDay.Fri.push(ev);
     else {
         // Default to an arbitrary day to show data
         const fallback = ["Mon", "Tue", "Wed", "Thu", "Fri"];
         const dayStr = fallback[idx % 5];
         eventsByDay[dayStr as keyof typeof eventsByDay].push(ev);
     }
  });

  return (
    <>
      <header className="full-width top-0 sticky bg-surface/80 backdrop-blur-md flex justify-between items-center px-container-padding py-4 z-40 border-b border-outline-variant/30">
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-surface-container-high rounded font-label-caps text-[10px] tracking-wider text-on-surface-variant">ENGINE 6</span>
                <h2 className="font-headline-md text-headline-md text-primary">Executive Calendar</h2>
            </div>
            <div className="hidden lg:flex items-center gap-4 bg-surface-container-low px-4 py-2 rounded-full border border-surface-variant">
                <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary" style={{fontVariationSettings: "'FILL' 1"}}>sprint</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">Upcoming: <strong className="text-primary">{localData.events.filter(e => e.status === 'SCHEDULED').length}</strong></span>
                </div>
                <div className="w-px h-4 bg-outline-variant"></div>
                <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">Sync: Active</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
            <input className="pl-9 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-sm text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64 transition-all" placeholder="Search calendar..." type="text"/>
            </div>
            <div className="flex gap-2 text-on-surface-variant">
            <button className="p-2 hover:bg-surface-container rounded-full transition-colors"><span className="material-symbols-outlined">notifications</span></button>
            <button className="p-2 hover:bg-surface-container rounded-full transition-colors"><span className="material-symbols-outlined">chat_bubble</span></button>
            </div>
        </div>
      </header>

      <div className="flex-1 p-container-padding flex gap-card-gap overflow-hidden h-[calc(100vh-80px)]">
        
        {/* Main Grid View */}
        <div className="flex-1 bg-surface-container-lowest rounded-[24px] shadow-sm overflow-hidden flex flex-col border border-surface-variant">
            
            <div className="p-6 border-b border-surface-variant flex justify-between items-center bg-white">
                <div>
                <h3 className="font-headline-sm text-headline-sm text-primary">Schedule View</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Operational Outlook</p>
                </div>
                <div className="flex items-center gap-3">
                <button className="px-4 py-2 border border-outline-variant rounded-lg font-label-caps text-label-caps hover:bg-surface-container transition-colors">Today</button>
                <div className="flex border border-outline-variant rounded-lg overflow-hidden">
                <button className="p-2 hover:bg-surface-container transition-colors border-r border-outline-variant"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                <button className="p-2 hover:bg-surface-container transition-colors"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
                </div>
                </div>
            </div>

            <div className="grid grid-cols-5 border-b border-surface-variant bg-surface-bright">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, idx) => (
                    <div key={day} className="p-4 text-center border-l border-surface-variant">
                        <span className="font-label-caps text-label-caps text-on-surface-variant block">{day}</span>
                        <span className={`font-headline-sm text-headline-sm mt-1 block ${idx === 2 ? 'bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto' : ''}`}>{10 + idx}</span>
                    </div>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-5 relative pb-10 bg-white/50">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, idx) => (
                    <div key={day} className="border-l border-surface-variant flex flex-col p-2 space-y-3 min-h-[500px]">
                        {eventsByDay[day as keyof typeof eventsByDay].map((ev, evIdx) => {
                            let ringClass = "border-blue-100 ring-primary";
                            let bgClass = "bg-blue-50 text-blue-900";
                            
                            if (ev.status === "MISSED" || ev.status === "CONFLICT") {
                                bgClass = "bg-error-container text-on-error-container";
                                ringClass = "border-error ring-error";
                            } else if (ev.status === "COMPLETED") {
                                bgClass = "bg-surface-container text-on-surface";
                                ringClass = "border-outline-variant ring-transparent";
                            }
                            
                            return (
                            <div 
                                key={ev.id} 
                                onClick={() => setSelectedEventId(ev.id)}
                                className={`p-3 rounded-lg shadow-sm border ring-1 cursor-pointer transition-all ${ringClass} ${bgClass} ${selectedEventId === ev.id ? 'ring-2 shadow-md' : 'opacity-80 hover:opacity-100'}`}
                            >
                                <div className="font-label-caps text-label-caps opacity-70 mb-1">{ev.startTime}</div>
                                <div className="font-body-sm text-body-sm font-semibold leading-tight line-clamp-2">{ev.title}</div>
                                {ev.sourceModule && (
                                    <div className="mt-2 text-[10px] font-bold uppercase opacity-80">{ev.sourceModule}</div>
                                )}
                            </div>
                        )})}
                    </div>
                ))}
            </div>
            
        </div>

        {/* Details Pane */}
        {activeEvent && (
            <div className="w-[380px] bg-surface-container-lowest rounded-[24px] shadow-sm flex flex-col border border-surface-variant overflow-hidden shrink-0 hidden xl:flex relative">
                <div className={`h-32 p-6 flex flex-col justify-end border-b border-surface-variant relative ${
                        activeEvent.status === "CONFLICT" || activeEvent.status === "MISSED" ? "bg-error-container/20 border-error/30" : 
                        "bg-gradient-to-br from-blue-50 to-slate-100"
                    }`}>
                    <div className="flex items-center gap-2 mb-2">
                        {activeEvent.sourceModule && <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">{activeEvent.sourceModule}</span>}
                        <span className="font-label-caps text-label-caps text-on-surface-variant">{activeEvent.startTime} - {activeEvent.endTime}</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm font-bold text-primary line-clamp-2">{activeEvent.title}</h3>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white">
                    <section>
                        <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">info</span> Details
                                                </h4>
                        <p className="text-[14px] text-on-surface-variant leading-relaxed">
                            {activeEvent.description}
                        </p>
                    </section>

                    {activeEvent.intelligenceSignal && (
                        <section>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px] text-purple-600">auto_awesome</span> Context Brief
                                </h4>
                                <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold uppercase">Signal</span>
                            </div>
                            <div className="glass-panel p-4 rounded-xl shadow-sm relative overflow-hidden bg-purple-50/50 border border-purple-100">
                                <p className="font-body-sm text-body-sm text-on-surface relative z-10 leading-relaxed">
                                    {activeEvent.intelligenceSignal}
                                </p>
                            </div>
                        </section>
                    )}

                    <section>
                        <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">task_alt</span> Suggested Action
                                                </h4>
                        <div className="space-y-2">
                            <label className={`flex items-start gap-3 p-3 rounded-lg border ${activeEvent.status === 'COMPLETED' ? 'border-success/50 bg-success/5' : 'border-surface-variant hover:bg-surface-container-low'} transition-colors cursor-pointer group`}>
                                <input className="mt-1 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" checked={activeEvent.status === 'COMPLETED'} readOnly />
                                <span className="font-body-sm text-body-sm font-medium">{activeEvent.recommendedAction || "Acknowledge event."}</span>
                            </label>
                        </div>
                    </section>
                </div>
                
                <div className="p-4 border-t border-surface-variant bg-surface-bright flex gap-2">
                    <button className="flex-1 bg-primary text-white py-2.5 rounded-lg font-body-sm text-body-sm font-medium hover:bg-primary-dark transition-colors flex justify-center items-center gap-2">
                        {activeEvent.sourceModule ? `Open ${activeEvent.sourceModule}` : 'Acknowledge'}
                    </button>
                    <button className="px-4 py-2.5 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container transition-colors">
                        <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                    </button>
                </div>
            </div>
        )}
      </div>

    </>
  );
}
