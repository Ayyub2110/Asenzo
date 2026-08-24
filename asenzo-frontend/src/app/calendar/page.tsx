"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  getCalendar, getCommandCenter, getOperations, getDelivery, getConversion, getRevenue 
} from "@/lib/adapters";

interface UnifiedEvent {
  id: string;
  sourceModule: string;
  sourceType: string;
  title: string;
  date: string;       // YYYY-MM-DD
  startTime: string;  
  endTime: string;
  owner: string;
  status: "SCHEDULED" | "COMPLETED" | "OVERDUE" | "MISSED" | "CONFLICT" | "PENDING";
  description?: string;
  linkedContext?: string;
  intelligenceSignal?: string;
  recommendedAction?: string;
}

export default function CommonCalendarPage() {
  const router = useRouter();
  
  // State
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<UnifiedEvent[]>([]);
  const [view, setView] = useState<"Month" | "Week" | "Day" | "Agenda">("Week");
  const [calendarMode, setCalendarMode] = useState<"Common" | "My" | "Team">("Common");
  
  // Filters
  const [search, setSearch] = useState("");
  const [centerFilter, setCenterFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Load and Aggregate Data
  useEffect(() => {
    async function loadUnifiedData() {
      try {
        const [
          calendarRaw,
          cmdRaw,
          opsRaw,
          delRaw,
          revRaw,
          convRaw
        ] = await Promise.all([
          getCalendar().catch(() => null),
          getCommandCenter().catch(() => null),
          getOperations().catch(() => null),
          getDelivery().catch(() => null),
          getRevenue().catch(() => null),
          getConversion().catch(() => null)
        ]);

        let unified: UnifiedEvent[] = [];

        // 1. Core Calendar Events
        if (calendarRaw) {
          calendarRaw.events.forEach(e => {
            unified.push({
              id: e.id,
              sourceModule: e.sourceModule || "Calendar",
              sourceType: "Meeting",
              title: e.title,
              date: e.date,
              startTime: e.startTime,
              endTime: e.endTime,
              owner: e.owner,
              status: e.status,
              description: e.description,
              linkedContext: e.linkedContext,
              intelligenceSignal: e.intelligenceSignal,
              recommendedAction: e.recommendedAction
            });
          });
        }

        // 2. Command Center (Actions with dates)
        if (cmdRaw && cmdRaw.actionQueue) {
           cmdRaw.actionQueue.forEach(a => {
             unified.push({
               id: a.id,
               sourceModule: "Command",
               sourceType: "Action",
               title: a.title,
               date: new Date().toISOString(),
               startTime: "TBD",
               endTime: "TBD",
               owner: "Founder",
               status: "PENDING",
               description: a.subtitle,
               linkedContext: a.type
             });
           });
        }

        // 3. Operations (Schedule / Tasks)
        if (opsRaw) {
           opsRaw.schedule?.forEach(s => {
              unified.push({
                id: s.id,
                sourceModule: "Operations",
                sourceType: "Schedule",
                title: s.title,
                date: new Date().toISOString(), // Mock mapped
                startTime: "09:00 AM",
                endTime: "10:00 AM",
                owner: s.ownerId,
                status: s.status === "PENDING" ? "SCHEDULED" : "COMPLETED",
                description: s.agenda
              });
           });
        }

        // 4. Delivery (Milestones)
        if (delRaw) {
           delRaw.milestones?.forEach((m: any) => {
              unified.push({
                 id: m.id,
                 sourceModule: "Delivery",
                 sourceType: "Milestone",
                 title: m.name,
                 date: m.dueDate,
                 startTime: "EOD",
                 endTime: "EOD",
                 owner: m.owner,
                 status: m.status === "COMPLETED" ? "COMPLETED" : "PENDING",
                 description: m.description
              });
           });
        }

        // Sort events chronologically to fake real calendar display in our UI
        unified = unified.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setEvents(unified);

      } catch (err) {
        console.error(err);
      } finally {
         setLoading(false);
      }
    }
    loadUnifiedData();
  }, []);

  // Filtering Logic
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
       // Search filter
       if (search && !e.title.toLowerCase().includes(search.toLowerCase()) && !e.description?.toLowerCase().includes(search.toLowerCase())) return false;
       // Center filter
       if (centerFilter !== "All" && e.sourceModule !== centerFilter) return false;
       // Status filter
       if (statusFilter !== "All" && e.status !== statusFilter) return false;
       // Mode filter
       if (calendarMode === "My" && e.owner !== "Founder" && !e.owner.includes("Lead")) return false; // Mocking current user logic

       return true;
    });
  }, [events, search, centerFilter, statusFilter, calendarMode]);

  const activeEvent = events.find(e => e.id === selectedEventId);

  // Today Summary logic
  const todayCount = filteredEvents.filter(e => e.status !== "COMPLETED").length;
  const overdueCount = filteredEvents.filter(e => e.status === "OVERDUE" || e.status === "MISSED").length;
  const metrics = [
    { label: "Total Events", value: todayCount },
    { label: "Overdue", value: overdueCount, alert: overdueCount > 0 },
    { label: "Scheduled", value: filteredEvents.filter(e => e.status === "SCHEDULED").length }
  ];

  if (loading) {
     return (
       <div className="p-8 max-w-[1600px] mx-auto animate-pulse flex flex-col gap-6">
         <div className="h-12 bg-muted rounded w-64"></div>
         <div className="flex gap-4">
           <div className="flex-1 h-[600px] bg-muted/50 rounded-2xl border border-border"></div>
           <div className="w-[380px] h-[600px] bg-muted/50 rounded-2xl border border-border"></div>
         </div>
       </div>
     );
  }

  if (events.length === 0) {
      return (
         <div className="flex-1 p-10 flex flex-col items-center justify-center min-h-[60vh]">
            <span className="material-symbols-outlined text-[48px] text-muted-foreground mb-4">calendar_month</span>
            <h2 className="text-[20px] font-bold text-foreground mb-2">Calendar</h2>
            <p className="text-[13px] text-muted-foreground text-center max-w-md">
              No scheduled activities yet. Your calendar will populate automatically as you create calls, content, follow-ups, milestones, and team tasks.
            </p>
         </div>
      );
  }

  return (
    <div className="flex flex-col h-screen max-w-[1600px] mx-auto bg-background">
      
      {/* 1. UNIFIED HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-border bg-card shrink-0 gap-4">
        <div>
           <div className="flex items-center gap-3 mb-1">
              <span className="material-symbols-outlined text-primary text-[24px]">calendar_month</span>
              <h1 className="text-[24px] font-bold tracking-tight text-foreground uppercase">Calendar</h1>
           </div>
           <p className="text-[13px] text-muted-foreground font-medium flex gap-4">
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric'})}</span>
              <span className="text-tertiary font-bold">{metrics[0].value} scheduled actions</span>
           </p>
        </div>

        <div className="flex items-center gap-6">
           {/* Calendar Modes */}
           <div className="flex items-center bg-secondary p-1 rounded-md border border-border shrink-0">
              {['Common', 'My', 'Team'].map(mode => (
                 <button 
                   key={mode}
                   onClick={() => setCalendarMode(mode as any)}
                   className={`px-4 py-1.5 text-[12px] font-bold rounded flex-1 transition-colors ${calendarMode === mode ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                 >
                   {mode} {mode !== 'Common' && 'Calendar'}
                 </button>
              ))}
           </div>
           
           <div className="flex items-center gap-3 shrink-0">
              <div className="relative hidden md:block">
                 <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[16px]">search</span>
                 <input 
                   type="text" 
                   value={search}
                   onChange={e => setSearch(e.target.value)}
                   placeholder="Global search..." 
                   className="pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-[13px] w-64 focus:outline-none focus:border-primary"
                 />
              </div>
              <button className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-[8px] text-[13px] font-bold hover:bg-foreground/90 transition-colors">
                 <span className="material-symbols-outlined text-[16px]">add</span>
                 Create Event
              </button>
           </div>
        </div>
      </header>

      {/* 2. TOP HORIZONTAL FILTERS & VIEWS */}
      <div className="px-6 py-4 border-b border-border bg-card flex flex-wrap items-center justify-between gap-4 shrink-0">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Center:</span>
               <select 
                 value={centerFilter} 
                 onChange={e => setCenterFilter(e.target.value)}
                 className="bg-secondary border border-border rounded px-3 py-1 text-[12px] font-semibold text-foreground focus:outline-none"
               >
                 {['All', 'Command', 'Acquisition', 'Conversion', 'Revenue', 'Delivery', 'Operations', 'Intelligence'].map(opt => (
                   <option key={opt} value={opt}>{opt}</option>
                 ))}
               </select>
            </div>
            
            <div className="flex items-center gap-2">
               <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Status:</span>
               <select 
                 value={statusFilter} 
                 onChange={e => setStatusFilter(e.target.value)}
                 className="bg-secondary border border-border rounded px-3 py-1 text-[12px] font-semibold text-foreground focus:outline-none"
               >
                 <option value="All">All Statuses</option>
                 <option value="SCHEDULED">Scheduled</option>
                 <option value="PENDING">Pending</option>
                 <option value="OVERDUE">Overdue</option>
                 <option value="COMPLETED">Completed</option>
               </select>
            </div>
         </div>

         <div className="flex bg-secondary p-1 rounded-md border border-border">
            {['Month', 'Week', 'Day', 'Agenda'].map(v => (
               <button 
                 key={v}
                 onClick={() => setView(v as any)}
                 className={`px-4 py-1.5 text-[12px] font-bold rounded transition-colors ${view === v ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
               >
                 {v}
               </button>
            ))}
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
         {/* 3. MAIN CALENDAR GRID */}
         <div className="flex-1 flex flex-col bg-muted/10 overflow-auto">
            {/* Warning Conflict Strip */}
            {overdueCount > 0 && (
               <div className="bg-destructive/10 border-b border-destructive/20 p-3 flex justify-between items-center text-destructive">
                 <div className="flex items-center gap-2">
                   <span className="material-symbols-outlined text-[18px]">warning</span>
                   <span className="text-[12px] font-bold uppercase tracking-widest">Schedule Risk Detected</span>
                 </div>
                 <span className="text-[13px] font-medium">You have {overdueCount} overdue actions impacting the operating rhythm.</span>
               </div>
            )}

            {view === "Agenda" && (
                <div className="p-6">
                   <div className="bg-card border border-border rounded-[12px] overflow-hidden">
                      {filteredEvents.map(ev => (
                         <div 
                           key={ev.id}
                           onClick={() => setSelectedEventId(ev.id)}
                           className={`p-4 border-b border-border last:border-0 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors ${selectedEventId === ev.id ? 'bg-secondary' : ''}`}
                         >
                            <div className="flex items-center gap-4">
                               <div className="w-[100px] shrink-0 text-center">
                                  <span className="block text-[11px] font-bold text-muted-foreground uppercase">{ev.startTime}</span>
                                  {ev.status === 'OVERDUE' && <span className="block mt-1 text-[9px] font-bold text-destructive uppercase tracking-widest bg-destructive/10 px-1 rounded">Overdue</span>}
                               </div>
                               <div>
                                  <div className="flex gap-2 items-center mb-1">
                                    <span className="px-2 py-0.5 rounded border border-border bg-background text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{ev.sourceModule}</span>
                                    <span className="text-[14px] font-bold text-foreground truncate">{ev.title}</span>
                                  </div>
                                  <span className="text-[12px] text-muted-foreground">Owner: {ev.owner} {ev.sourceType && `• ${ev.sourceType}`}</span>
                               </div>
                            </div>
                            <span className="material-symbols-outlined text-muted-foreground shrink-0">chevron_right</span>
                         </div>
                      ))}
                      {filteredEvents.length === 0 && (
                        <div className="p-10 text-center text-muted-foreground font-medium text-[13px]">
                          No events match your current filters.
                        </div>
                      )}
                   </div>
                </div>
            )}

            {(view === "Week" || view === "Day") && (
                <div className="flex-1 flex flex-col h-full overflow-hidden p-6">
                   <div className="bg-card border border-border rounded-[12px] flex-1 flex flex-col overflow-hidden shadow-sm">
                      <div className={`grid ${view === 'Week' ? 'grid-cols-5' : 'grid-cols-1'} border-b border-border bg-secondary shrink-0`}>
                          {(view === 'Week' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] : ['Today']).map((day, idx) => (
                             <div key={day} className={`p-4 text-center ${idx !== 0 ? 'border-l border-border' : ''}`}>
                                <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{day}</h3>
                             </div>
                          ))}
                      </div>
                      <div className={`grid ${view === 'Week' ? 'grid-cols-5' : 'grid-cols-1'} flex-1 overflow-y-auto bg-background/50`}>
                          {(view === 'Week' ? [0,1,2,3,4] : [0]).map(col => {
                             // Naive column rendering
                             const colEvents = filteredEvents.filter((_, i) => i % (view === 'Week' ? 5 : 1) === col);
                             return (
                               <div key={col} className={`p-2 space-y-3 ${col !== 0 ? 'border-l border-border' : ''}`}>
                                  {colEvents.map(ev => {
                                     const isOverdue = ev.status === 'OVERDUE' || ev.status === 'MISSED' || ev.status === 'CONFLICT';
                                     const isCompleted = ev.status === 'COMPLETED';
                                     
                                     return (
                                        <div 
                                          key={ev.id}
                                          onClick={() => setSelectedEventId(ev.id)}
                                          className={`p-3 rounded-[8px] border transition-all cursor-pointer ${
                                            isOverdue ? 'bg-destructive/5 border-destructive/30 hover:border-destructive/60' :
                                            isCompleted ? 'bg-secondary/50 border-border opacity-70' :
                                            'bg-card border-border hover:border-tertiary/60'
                                          } ${selectedEventId === ev.id ? 'ring-2 ring-primary border-primary' : ''}`}
                                        >
                                           <div className="flex justify-between items-start mb-2">
                                              <span className={`text-[10px] font-bold uppercase ${isOverdue ? 'text-destructive' : 'text-primary'}`}>{ev.startTime}</span>
                                              <span className="text-[8px] font-bold uppercase tracking-widest bg-secondary text-muted-foreground px-1 py-0.5 rounded">{ev.sourceModule}</span>
                                           </div>
                                           <h4 className={`text-[13px] font-bold leading-tight line-clamp-2 ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{ev.title}</h4>
                                        </div>
                                     );
                                  })}
                               </div>
                             );
                          })}
                      </div>
                   </div>
                </div>
            )}

            {view === "Month" && (
                <div className="flex-1 p-6 flex flex-col">
                   <div className="bg-card border border-border rounded-[12px] flex-1 grid grid-cols-7 grid-rows-5 overflow-hidden shadow-sm">
                      {Array.from({length: 35}).map((_, i) => {
                         const d = i - 2; // fake offset
                         const dayEvents = filteredEvents.slice(i, i+1); // fake slicing
                         return (
                           <div key={i} className="border-r border-b border-border p-2 bg-card hover:bg-secondary transition-colors cursor-pointer min-h-[100px]">
                              <span className="text-[12px] font-bold text-muted-foreground block mb-2">{d > 0 && d <= 31 ? d : ''}</span>
                              {dayEvents.map(ev => (
                                 <div key={ev.id} onClick={(e) => { e.stopPropagation(); setSelectedEventId(ev.id); }} className={`truncate text-[10px] font-bold px-1.5 py-0.5 rounded mb-1 ${ev.status === 'OVERDUE' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                                    {ev.startTime} {ev.title}
                                 </div>
                              ))}
                           </div>
                         );
                      })}
                   </div>
                </div>
            )}
         </div>

         {/* 4. DETAIL PANEL */}
         {activeEvent && (
            <aside className="w-[400px] shrink-0 border-l border-border bg-card flex flex-col h-full animate-in slide-in-from-right-4">
               <div className={`p-6 border-b border-border ${
                  activeEvent.status === 'OVERDUE' || activeEvent.status === 'MISSED' || activeEvent.status === 'CONFLICT' 
                  ? 'bg-destructive/5' : 'bg-secondary/30'
               }`}>
                  <div className="flex justify-between items-start mb-4">
                     <span className="px-2 py-0.5 bg-background border border-border rounded text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {activeEvent.sourceModule} • {activeEvent.sourceType}
                     </span>
                     <button onClick={() => setSelectedEventId(null)} className="text-muted-foreground hover:text-foreground">
                       <span className="material-symbols-outlined text-[18px]">close</span>
                     </button>
                  </div>
                  <h3 className="text-[20px] font-bold text-foreground leading-tight mb-2">{activeEvent.title}</h3>
                  <div className="text-[13px] font-bold text-tertiary uppercase tracking-wider">{activeEvent.startTime} - {activeEvent.endTime}</div>
               </div>

               <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  <div>
                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                       <span className="material-symbols-outlined text-[14px]">info</span> Business Context
                    </h4>
                    <p className="text-[13px] text-foreground font-medium leading-relaxed bg-secondary border border-border p-4 rounded-lg">
                       {activeEvent.description || "No specific details provided for this event."}
                    </p>
                  </div>

                  {activeEvent.linkedContext && (
                    <div>
                      <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Related Record</h4>
                      <p className="text-[13px] text-primary font-bold hover:underline cursor-pointer">{activeEvent.linkedContext}</p>
                    </div>
                  )}

                  {activeEvent.intelligenceSignal && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                         <h4 className="text-[11px] font-bold text-primary uppercase tracking-widest flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">neurology</span> Intelligence Signal
                         </h4>
                      </div>
                      <p className="text-[13px] text-foreground font-medium">{activeEvent.intelligenceSignal}</p>
                    </div>
                  )}

                  <div>
                     <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Ownership</h4>
                     <div className="flex items-center gap-3 bg-secondary rounded-lg border border-border p-3">
                        <span className="material-symbols-outlined text-muted-foreground">person</span>
                        <div>
                           <p className="text-[13px] font-bold text-foreground leading-tight">{activeEvent.owner}</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-4 border-t border-border grid grid-cols-2 gap-2 bg-card shrink-0">
                  <button className="col-span-2 bg-foreground text-background font-bold text-[13px] py-2.5 rounded-[8px] hover:bg-foreground/90 transition-colors shadow-sm" onClick={() => router.push(`/${activeEvent.sourceModule.toLowerCase()}`)}>
                     Open in {activeEvent.sourceModule}
                  </button>
                  <button className="border border-border text-foreground font-bold text-[13px] py-2 rounded-[8px] hover:bg-muted transition-colors">
                     Reschedule
                  </button>
                  <button className="border border-border text-foreground font-bold text-[13px] py-2 rounded-[8px] hover:bg-muted transition-colors">
                     Mark Complete
                  </button>
               </div>
            </aside>
         )}
      </div>

    </div>
  );
}
