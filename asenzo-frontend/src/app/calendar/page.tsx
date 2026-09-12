"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  getCalendar, getOperations, getConversion, getRevenue 
} from "@/lib/adapters";

interface UnifiedEvent {
  id: string;
  sourceModule: string;
  sourceEntityType: string;
  sourceEntityId: string;
  title: string;
  date: string;       // YYYY-MM-DD
  startTime: string;  
  endTime: string;
  owner: string;
  status: "SCHEDULED" | "COMPLETED" | "OVERDUE" | "MISSED" | "CONFLICT" | "PENDING" | "BLOCKED" | "IN_PROGRESS" | "DUE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  type: "Meeting" | "Deadline" | "Work" | "Priority" | "Follow-up" | "Milestone" | "Approval" | "Business Event" | "Personal";
  description?: string;
}

export default function CalendarOSPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<UnifiedEvent[]>([]);
  const [view, setView] = useState<"Month" | "Week" | "Day" | "Agenda">("Week");
  
  // Filters
  const [search, setSearch] = useState("");
  const [centerFilter, setCenterFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    async function loadUnifiedData() {
      try {
        const [
          calendarRaw,
          opsRaw,
          convRaw,
          revRaw
        ] = await Promise.all([
          getCalendar().catch(() => null),
          getOperations().catch(() => null),
          getConversion().catch(() => null),
          getRevenue().catch(() => null)
        ]);

        let unified: UnifiedEvent[] = [];

        // 1. Core Calendar Events
        if (calendarRaw) {
          calendarRaw.events.forEach((e: any) => {
            unified.push({
              id: e.id,
              sourceModule: e.sourceModule || "Calendar",
              sourceEntityType: "CalendarEvent",
              sourceEntityId: e.id,
              title: e.title,
              date: e.date,
              startTime: e.startTime,
              endTime: e.endTime || "TBD",
              owner: e.owner,
              status: e.status,
              priority: e.priority === "URGENT" ? "CRITICAL" : e.priority === "HIGH" ? "HIGH" : "MEDIUM",
              type: "Meeting",
              description: e.description
            });
          });
        }

        // 2. Operations Work mapped to Calendar
        if (opsRaw) {
           opsRaw.work?.forEach((s: any) => {
              unified.push({
                id: s.id,
                sourceModule: "Operations",
                sourceEntityType: "Work",
                sourceEntityId: s.id,
                title: s.title,
                date: s.dueDate || new Date().toISOString(),
                startTime: "09:00 AM",
                endTime: "10:00 AM",
                owner: s.ownerId || "Team",
                status: s.status === "COMPLETED" ? "COMPLETED" : s.status === "BLOCKED" ? "BLOCKED" : (new Date(s.dueDate).getTime() < Date.now() ? "OVERDUE" : "SCHEDULED"),
                priority: s.priority,
                type: "Work",
                description: s.description
              });
           });
           
           opsRaw.planning?.forEach((s: any) => {
              unified.push({
                id: s.id,
                sourceModule: "Operations",
                sourceEntityType: "Planning",
                sourceEntityId: s.id,
                title: s.title,
                date: s.dueDate || new Date().toISOString(),
                startTime: "09:00 AM",
                endTime: "10:00 AM",
                owner: s.ownerId || "Team",
                status: s.status === "COMPLETED" ? "COMPLETED" : "SCHEDULED",
                priority: "HIGH",
                type: "Business Event",
                description: s.description
              });
           });
        }

        // 3. Conversion Follow-Ups mapped to Calendar
        if (convRaw) {
           convRaw.followUps?.forEach((f: any) => {
              unified.push({
                id: f.id,
                sourceModule: "Conversion",
                sourceEntityType: "FollowUp",
                sourceEntityId: f.id,
                title: `Outreach Follow Up: ${f.reason}`,
                date: f.dueDate || new Date().toISOString(),
                startTime: "11:00 AM",
                endTime: "11:30 AM",
                owner: f.owner,
                status: f.status === "COMPLETED" ? "COMPLETED" : (f.status === "OVERDUE" ? "OVERDUE" : "DUE"),
                priority: f.priority.toUpperCase() as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
                type: "Follow-up",
                description: f.recommendedAction
              });
           });
        }

        // Sort events chronologically
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

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
       if (search && !e.title.toLowerCase().includes(search.toLowerCase()) && !e.description?.toLowerCase().includes(search.toLowerCase())) return false;
       if (centerFilter !== "All" && e.sourceModule !== centerFilter) return false;
       if (typeFilter !== "All" && e.type !== typeFilter) return false;
       return true;
    });
  }, [events, search, centerFilter, typeFilter]);

  const activeEvent = events.find(e => e.id === selectedEventId);

  // Cards Logic
  const actNow = Date.now();
  
  // Basic classification
  const notCompleted = filteredEvents.filter(e => e.status !== "COMPLETED");
  const todayEvents = notCompleted.filter(e => {
    const d = new Date(e.date);
    const n = new Date();
    return d.getDate() === n.getDate() && d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
  });
  
  const needsAttention = notCompleted.filter(e => 
    e.status === "OVERDUE" || e.status === "BLOCKED" || e.status === "MISSED" || e.status === "CONFLICT"
  );
  
  const followUps = notCompleted.filter(e => e.type === "Follow-up");
  const deadlines = notCompleted.filter(e => e.type === "Deadline" || e.type === "Work");
  const meetings = notCompleted.filter(e => e.type === "Meeting");
  
  const upcoming = notCompleted.filter(e => {
     const t = new Date(e.date).getTime();
     return t > actNow && t < actNow + (7 * 86400000);
  });

  const dayLoadPercentage = Math.min(Math.round((todayEvents.length / 8) * 100), 100);

  if (loading) {
     return (
       <div className="p-8 animate-pulse flex flex-col gap-6">
         <div className="flex gap-4 mb-4">
           {Array.from({length:4}).map((_, i) => <div key={i} className="h-24 flex-1 bg-muted/20 rounded-[12px]"></div>)}
         </div>
         <div className="h-[600px] bg-muted/20 rounded-[16px]"></div>
       </div>
     );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-border bg-card shrink-0 gap-4">
        <div>
           <div className="flex items-center gap-3 mb-1">
              <span className="material-symbols-outlined text-primary text-[24px]">calendar_month</span>
              <h1 className="text-[24px] font-bold tracking-tight text-foreground uppercase">Central Calendar OS</h1>
           </div>
           <p className="text-[13px] text-muted-foreground font-medium">The time-based operating view of ASENZO.</p>
        </div>

        <div className="flex items-center gap-6">
           <div className="relative hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[16px]">search</span>
              <input 
                type="text" 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search across OS..." 
                className="pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-[13px] w-64 focus:outline-none focus:border-primary"
              />
           </div>
           <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-[8px] text-[13px] font-bold hover:bg-primary/90 transition-colors">
              <span className="material-symbols-outlined text-[16px]">add</span>
              Create Event
           </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
         
         {/* MAIN CALENDAR AREA */}
         <div className="flex-1 flex flex-col bg-muted/10 overflow-auto">
            
            {/* CARDS */}
            <div className="p-6 pb-2 shrink-0">
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-2">
                  <div className="bg-card border border-border rounded-[12px] p-4 shadow-sm cursor-pointer hover:border-foreground/50 transition-colors flex flex-col justify-center">
                     <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Today</span>
                     <div className="text-[24px] font-bold text-foreground leading-none mb-1">{todayEvents.length}</div>
                     <span className="text-[11px] text-muted-foreground">Items due/sched.</span>
                  </div>
                  <div className="bg-destructive/10 border border-destructive/20 rounded-[12px] p-4 shadow-sm cursor-pointer hover:border-destructive/50 transition-colors flex flex-col justify-center">
                     <span className="text-[10px] font-bold text-destructive uppercase tracking-widest mb-1">Needs Attn</span>
                     <div className="text-[24px] font-bold text-destructive leading-none mb-1">{needsAttention.length}</div>
                     <span className="text-[11px] text-destructive/80">Blocked/overdue</span>
                  </div>
                  <div className="bg-card border border-border rounded-[12px] p-4 shadow-sm cursor-pointer hover:border-foreground/50 transition-colors flex flex-col justify-center">
                     <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Follow Ups</span>
                     <div className="text-[24px] font-bold text-foreground leading-none mb-1">{followUps.filter(f => f.status !== "COMPLETED").length}</div>
                     <span className="text-[11px] text-muted-foreground">Active in queue</span>
                  </div>
                  <div className="bg-card border border-border rounded-[12px] p-4 shadow-sm cursor-pointer hover:border-foreground/50 transition-colors flex flex-col justify-center">
                     <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Deadlines</span>
                     <div className="text-[24px] font-bold text-foreground leading-none mb-1">{deadlines.length}</div>
                     <span className="text-[11px] text-muted-foreground">Upcoming due</span>
                  </div>
                  <div className="bg-card border border-border rounded-[12px] p-4 shadow-sm cursor-pointer hover:border-foreground/50 transition-colors flex flex-col justify-center">
                     <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Meetings</span>
                     <div className="text-[24px] font-bold text-foreground leading-none mb-1">{meetings.length}</div>
                     <span className="text-[11px] text-muted-foreground">Scheduled calls</span>
                  </div>
                  <div className="bg-card border border-border rounded-[12px] p-4 shadow-sm cursor-pointer hover:border-foreground/50 transition-colors flex flex-col justify-center">
                     <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Upcoming</span>
                     <div className="text-[24px] font-bold text-foreground leading-none mb-1">{upcoming.length}</div>
                     <span className="text-[11px] text-muted-foreground">Next 7 days</span>
                  </div>
                  <div className="bg-card border border-border rounded-[12px] p-4 shadow-sm flex flex-col justify-center">
                     <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Day Load</span>
                     <div className={`text-[24px] font-bold leading-none mb-1 ${dayLoadPercentage > 90 ? 'text-destructive' : 'text-foreground'}`}>{dayLoadPercentage}%</div>
                     <span className="text-[11px] text-muted-foreground">Capacity limit</span>
                  </div>
               </div>
            </div>

            {/* FILTERS TRAY */}
            <div className="px-6 pb-4 flex flex-wrap items-center justify-between gap-4 shrink-0">
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                     <select 
                       value={centerFilter} 
                       onChange={e => setCenterFilter(e.target.value)}
                       className="bg-card border border-border rounded-[6px] px-3 py-1.5 text-[12px] font-bold text-foreground focus:outline-none"
                     >
                       {['All', 'Acquisition', 'Conversion', 'Revenue', 'Delivery', 'Operations'].map(opt => (
                         <option key={opt} value={opt}>{opt} Events</option>
                       ))}
                     </select>
                  </div>
                  <div className="flex items-center gap-2">
                     <select 
                       value={typeFilter} 
                       onChange={e => setTypeFilter(e.target.value)}
                       className="bg-card border border-border rounded-[6px] px-3 py-1.5 text-[12px] font-bold text-foreground focus:outline-none"
                     >
                       <option value="All">All Types</option>
                       <option value="Meeting">Meetings</option>
                       <option value="Deadline">Deadlines</option>
                       <option value="Work">Tasks/Work</option>
                       <option value="Follow-up">Follow-ups</option>
                       <option value="Milestone">Milestones</option>
                     </select>
                  </div>
               </div>
      
               <div className="flex bg-card p-1 rounded-md border border-border shadow-sm">
                  {['Month', 'Week', 'Day', 'Agenda'].map(v => (
                     <button 
                       key={v}
                       onClick={() => setView(v as any)}
                       className={`px-4 py-1.5 text-[12px] font-bold rounded-[6px] transition-colors ${view === v ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                     >
                       {v}
                     </button>
                  ))}
               </div>
            </div>

            {/* CALENDAR BODY */}
            <div className="flex-1 flex flex-col px-6 pb-6 overflow-hidden">
               <div className="bg-card border border-border rounded-[16px] flex-1 flex flex-col overflow-hidden shadow-sm">
                  
                  {view === "Agenda" && (
                      <div className="flex-1 overflow-auto p-4 space-y-2">
                        {filteredEvents.map(ev => (
                           <div 
                             key={ev.id}
                             onClick={() => setSelectedEventId(ev.id)}
                             className={`p-4 border border-border rounded-xl flex items-center justify-between cursor-pointer hover:border-foreground/30 transition-colors ${selectedEventId === ev.id ? 'bg-secondary' : 'bg-background'}`}
                           >
                              <div className="flex items-start gap-4 mx-2">
                                 <div className="w-[110px] shrink-0 pt-0.5">
                                    <span className={`block text-[12px] font-bold mb-1 ${ev.status === 'OVERDUE' ? 'text-destructive' : 'text-foreground'}`}>
                                      {new Date(ev.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                                    </span>
                                    <span className="block text-[11px] font-bold text-muted-foreground">{ev.startTime}</span>
                                 </div>
                                 <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2">
                                       <span className="px-2 py-0.5 rounded-[4px] border border-border bg-secondary text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                                         {ev.sourceModule}
                                       </span>
                                       <span className={`px-2 py-0.5 rounded-[4px] text-[9px] font-bold uppercase tracking-wider ${
                                         ev.status === 'OVERDUE' || ev.status === 'MISSED' ? 'bg-destructive/10 text-destructive' : 
                                         ev.status === 'COMPLETED' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                                       }`}>
                                         {ev.status}
                                       </span>
                                    </div>
                                    <span className={`text-[15px] font-bold leading-tight ${ev.status === 'COMPLETED' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{ev.title}</span>
                                    <span className="text-[12px] text-muted-foreground font-medium flex gap-4">
                                       <span><strong className="font-bold">Type:</strong> {ev.type}</span>
                                       <span><strong className="font-bold">Owner:</strong> {ev.owner}</span>
                                    </span>
                                 </div>
                              </div>
                           </div>
                        ))}
                      </div>
                  )}

                  {view === "Week" && (
                      <div className="flex-1 flex flex-col overflow-auto bg-background/30">
                        <div className="grid grid-cols-5 border-b border-border bg-card shrink-0">
                           {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, idx) => (
                              <div key={day} className={`p-4 text-center ${idx !== 0 ? 'border-l border-border' : ''}`}>
                                 <h3 className="text-[12px] font-bold text-foreground">
                                   {day} <span className="text-muted-foreground font-normal ml-1">{new Date().getDate() + idx - 2}</span>
                                 </h3>
                              </div>
                           ))}
                        </div>
                        <div className="grid grid-cols-5 flex-1 p-2 gap-2">
                           {[0,1,2,3,4].map(col => {
                              const colEvents = filteredEvents.filter((_, i) => i % 5 === col);
                              return (
                                <div key={col} className="space-y-2">
                                   {colEvents.map(ev => {
                                      const isOverdue = ev.status === 'OVERDUE' || ev.status === 'BLOCKED' || ev.status === 'MISSED';
                                      const isCompleted = ev.status === 'COMPLETED';
                                      
                                      return (
                                         <div 
                                           key={ev.id}
                                           onClick={() => setSelectedEventId(ev.id)}
                                           className={`p-3 rounded-[8px] border transition-all cursor-pointer ${
                                             isOverdue ? 'bg-destructive/10 border-destructive/30 hover:border-destructive/60' :
                                             isCompleted ? 'bg-background border-border/50 opacity-60 hover:opacity-100' :
                                             'bg-card border-border hover:border-tertiary/60 shadow-sm'
                                           } ${selectedEventId === ev.id ? 'ring-2 ring-primary border-primary' : ''}`}
                                         >
                                            <div className="flex justify-between items-start mb-2">
                                               <span className={`text-[10px] font-bold ${isOverdue ? 'text-destructive' : 'text-primary'}`}>{ev.startTime}</span>
                                               <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{ev.sourceModule.substring(0,3)}</span>
                                            </div>
                                            <h4 className={`text-[13px] font-bold leading-tight ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{ev.title}</h4>
                                         </div>
                                      );
                                   })}
                                </div>
                              );
                           })}
                        </div>
                      </div>
                  )}

                  {(view === "Month" || view === "Day") && (
                     <div className="flex-1 flex items-center justify-center text-muted-foreground font-bold">
                        {view} view not populated in this demo.
                     </div>
                  )}

               </div>
            </div>
         </div>

         {/* EVENT DETAIL DRAWER */}
         {activeEvent && (
            <aside className="w-[420px] shrink-0 border-l border-border bg-card flex flex-col h-full z-10 shadow-xl overflow-hidden animate-in slide-in-from-right-4">
               <div className={`p-6 border-b border-border bg-card shrink-0 shadow-sm`}>
                  <div className="flex justify-between items-start mb-6">
                     <span className="px-2.5 py-1 bg-secondary border border-border rounded-[6px] text-[10px] font-bold uppercase tracking-widest text-foreground">
                        {activeEvent.sourceModule} • {activeEvent.type}
                     </span>
                     <button onClick={() => setSelectedEventId(null)} className="text-muted-foreground hover:text-foreground hover:bg-muted p-1 rounded-full transition-colors">
                       <span className="material-symbols-outlined text-[20px]">close</span>
                     </button>
                  </div>
                  <h3 className="text-[22px] font-bold text-foreground leading-tight mb-4">{activeEvent.title}</h3>
                  <div className="flex flex-col gap-2 p-3 bg-background border border-border rounded-[8px]">
                     <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-muted-foreground text-[18px]">calendar_today</span>
                        <span className="text-[13px] font-bold text-foreground">{new Date(activeEvent.date).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-muted-foreground text-[18px]">schedule</span>
                        <span className="text-[13px] font-bold text-foreground">{activeEvent.startTime} — {activeEvent.endTime}</span>
                     </div>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-background border border-border p-3 rounded-[8px]">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Status</span>
                        <span className={`text-[12px] font-bold uppercase ${
                          ['OVERDUE', 'BLOCKED', 'MISSED'].includes(activeEvent.status) ? 'text-destructive' :
                          activeEvent.status === 'COMPLETED' ? 'text-success' : 'text-foreground'
                        }`}>{activeEvent.status.replace("_", " ")}</span>
                     </div>
                     <div className="bg-background border border-border p-3 rounded-[8px]">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Priority</span>
                        <span className={`text-[12px] font-bold uppercase ${
                          activeEvent.priority === 'CRITICAL' ? 'text-destructive' : 'text-foreground'
                        }`}>{activeEvent.priority}</span>
                     </div>
                  </div>

                  <div>
                     <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Description</span>
                     <p className="text-[13px] text-foreground/90 font-medium leading-relaxed">
                        {activeEvent.description || "No description provided for this operational item."}
                     </p>
                  </div>

                  <div>
                     <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Owner</span>
                     <div className="flex items-center gap-3 bg-background rounded-lg border border-border p-3">
                        <span className="material-symbols-outlined text-muted-foreground">engineering</span>
                        <div>
                           <p className="text-[13px] font-bold text-foreground leading-tight">{activeEvent.owner || 'Unassigned'}</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-4 border-t border-border bg-card shrink-0">
                  <div className="flex flex-col gap-2">
                     <button 
                       className="bg-primary text-primary-foreground font-bold text-[13px] py-3 rounded-[8px] hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2"
                       onClick={() => router.push(`/${activeEvent.sourceModule.toLowerCase()}`)}
                     >
                        Open in {activeEvent.sourceModule} <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                     </button>
                     <div className="grid grid-cols-2 gap-2">
                        <button className="border border-border text-foreground font-bold text-[12px] py-2.5 rounded-[8px] hover:bg-secondary transition-colors">
                           Reschedule
                        </button>
                        <button className="border border-border text-foreground font-bold text-[12px] py-2.5 rounded-[8px] hover:bg-secondary transition-colors">
                           Mark Complete
                        </button>
                     </div>
                  </div>
               </div>
            </aside>
         )}
      </div>
    </div>
  );
}
