"use client";

import React from "react";
import Link from "next/link";
import { ACTION_MAP } from "@/lib/routing";
import { getConversion } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function ConversionCommandPage() {
  const { localData, loading, error } = useAdapter(getConversion);

  if (loading) {
    return <div className="p-10 animate-pulse h-96 w-full max-w-[1200px] mx-auto bg-muted/20 rounded-[16px]" />;
  }

  if (error || !localData) {
    return <div className="p-10">Error loading Conversion OS.</div>;
  }

  // Calculate high-level pulse stats
  const totalLeads = 128; // Using mock top-level count since Phase 1 doesn't ingest true Lead count here yet.
  const qualifiedLeads = 34; 
  const activeConversations = localData.conversations.filter(c => !["CLOSED_WON", "LOST", "UNRESPONSIVE", "NOT_INTERESTED", "NOT_NOW"].includes(c.status));
  const followUpsDue = localData.followUps.filter(f => f.status === "DUE" || f.status === "OVERDUE");
  const applications = localData.applications?.length || 0;
  const bookings = localData.bookings?.length || 0;
  const showUpRate = "78%";
  const conversionRate = "12%";

  // Intelligence bottlenecks
  let bottleneck = { title: "Healthy Conversion Flow", text: "Pipeline operating efficiently." };
  if (followUpsDue.length > 5) {
     bottleneck = { title: "FOLLOW-UP BOTTLENECK", text: `${followUpsDue.length} conversations have no next action or are overdue.` };
  } else if (qualifiedLeads > bookings) {
     bottleneck = { title: "BOOKING BOTTLENECK", text: "Qualified leads are not booking." };
  }

  return (
    <div className="p-6 md:p-10 mx-auto w-full pb-32">
      
      {/* 1. CONVERSION PULSE */}
      <section className="mb-12">
        <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-4">Conversion Pulse</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { label: "Total Leads", val: totalLeads, href: ACTION_MAP.openConversionInbox() },
            { label: "Qualified", val: qualifiedLeads, href: ACTION_MAP.openLeadQualification('QUALIFIED') },
            { label: "Active Convos", val: activeConversations.length, href: ACTION_MAP.openConversionInbox() },
            { label: "Follow-ups Due", val: followUpsDue.length, alert: followUpsDue.length > 0, href: ACTION_MAP.openFollowUps() }, // Or followups, note: deal follow-ups belong in Revenue
            { label: "Applications", val: applications, href: ACTION_MAP.openApplications() },
            { label: "Bookings", val: bookings, href: ACTION_MAP.openBooking() },
            { label: "Show-Up Rate", val: showUpRate, highlight: true, href: ACTION_MAP.openConversionAnalytics() },
            { label: "Conversion Rate", val: conversionRate, highlight: true, href: ACTION_MAP.openConversionAnalytics() },
          ].map((m, i) => (
             <Link href={m.href} key={i} className={`block p-4 rounded-[12px] border hover:opacity-80 transition-opacity ${m.alert ? 'border-destructive/30 bg-destructive/10' : 'border-border bg-card'}`}>
               <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 mx-auto max-w-full text-clip overflow-hidden whitespace-nowrap ${m.alert ? 'text-destructive' : 'text-muted-foreground'}`}>{m.label}</p>
               <p className={`text-[20px] font-bold leading-none ${m.highlight ? 'text-success' : 'text-foreground'}`}>{m.val}</p>
             </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        
        {/* TODAY'S ACTIONS */}
        <section className="lg:col-span-1 bg-card border border-border p-6 rounded-[16px] flex flex-col shadow-sm">
          <h2 className="text-[11px] font-bold text-foreground uppercase tracking-widest leading-none mb-6">Today's Actions</h2>
          <div className="flex flex-col gap-4">
             <Link href={ACTION_MAP.openConversionInbox()} className="flex justify-between items-center hover:opacity-80">
                <span className="text-[13px] font-medium text-muted-foreground">Needs Reply</span>
                <span className="bg-destructive text-destructive-foreground px-2 py-0.5 rounded text-[11px] font-bold">2</span>
             </Link>
             <Link href={ACTION_MAP.openFollowUps()} className="flex justify-between items-center hover:opacity-80">
                <span className="text-[13px] font-medium text-muted-foreground">Follow-ups Due</span>
                <span className="bg-secondary text-foreground px-2 py-0.5 rounded text-[11px] font-bold">{followUpsDue.length}</span>
             </Link>
             <Link href={ACTION_MAP.openApplications()} className="flex justify-between items-center hover:opacity-80">
                <span className="text-[13px] font-medium text-muted-foreground">Applications to Review</span>
                <span className="bg-secondary text-foreground px-2 py-0.5 rounded text-[11px] font-bold">1</span>
             </Link>
             <Link href={ACTION_MAP.openBooking()} className="flex justify-between items-center hover:opacity-80">
                <span className="text-[13px] font-medium text-muted-foreground">Bookings Today</span>
                <span className="bg-success text-background px-2 py-0.5 rounded text-[11px] font-bold">1</span>
             </Link>
          </div>
        </section>

        {/* INTELLIGENCE & BOTTLENECKS */}
        <section className="lg:col-span-2 bg-foreground text-background p-6 rounded-[16px] shadow-sm flex flex-col justify-center">
            <h2 className="text-[11px] font-bold text-background/70 uppercase tracking-widest leading-none mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">{bottleneck.title.includes("Healthy") ? 'check_circle' : 'warning'}</span> Intelligence & Bottlenecks
            </h2>
            <h3 className="text-[20px] font-bold mb-2">{bottleneck.title}</h3>
            <p className="text-[14px] font-medium text-background/80">{bottleneck.text}</p>
        </section>
      </div>

      {/* TOP SOURCES & RECENT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <section>
            <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-4">Top Conversion Sources</h2>
            <div className="bg-card border border-border rounded-[12px] p-4 text-[13px]">
               <div className="flex justify-between font-bold text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border pb-2 mb-2">
                 <span>Source</span>
                 <span>Leads</span>
                 <span>Booked</span>
               </div>
               <div className="flex justify-between py-2 border-b border-border/50">
                 <span className="font-bold text-foreground">Instagram Organic</span>
                 <span className="text-muted-foreground">62</span>
                 <span className="text-foreground">6</span>
               </div>
               <div className="flex justify-between py-2">
                 <span className="font-bold text-foreground">LinkedIn DM</span>
                 <span className="text-muted-foreground">41</span>
                 <span className="text-foreground">3</span>
               </div>
            </div>
         </section>

          <section>
            <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-4">Recent Conversations</h2>
            <div className="flex flex-col gap-3">
             {localData.conversations.slice(0, 3).map(c => (
                <Link href={ACTION_MAP.openConversionInbox()} key={c.id} className="block hover:opacity-80">
                  <div className="p-4 border border-border rounded-[10px] bg-card flex justify-between items-center">
                     <div>
                       <p className="text-[14px] font-bold text-foreground">{c.contact}</p>
                       <p className="text-[11px] text-muted-foreground">{c.lastInteraction}</p>
                     </div>
                     <div className="text-right">
                       <p className="text-[10px] uppercase font-bold bg-secondary px-2 py-0.5 rounded text-foreground inline-block">{c.status}</p>
                       <p className="text-[12px] text-muted-foreground mt-1 line-clamp-1 max-w-[150px]">{c.nextAction}</p>
                     </div>
                  </div>
                </Link>
             ))}
           </div>
         </section>
      </div>

    </div>
  );
}
