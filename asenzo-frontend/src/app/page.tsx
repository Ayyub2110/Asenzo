"use client";

import React, { useState } from "react";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";

export default function CommandCenterPage() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    id: string;
    title: string;
    subtitle: string;
  } | null>(null);

  const handleActionClick = (actionId: string, title: string, subtitle: string) => {
    setPendingAction({ id: actionId, title, subtitle });
  };

  const handleExecuteAction = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setPendingAction(null);
    }, 1200);
  };

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1360px] mx-auto space-y-12 font-sans pb-32">
        
        {/* FOUNDER CONTROL HERO */}
        <section aria-label="Founder Control">
          <div className="flex items-center gap-3 mb-4 select-none">
            <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Founder Control</h2>
          </div>
          
          <div className="border border-border bg-card rounded-[20px] p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row justify-between gap-12">
            
            <div className="max-w-2xl relative z-10 w-full flex flex-col justify-center">
              <h3 className="text-[14px] font-semibold text-foreground mb-3">Founder Independence</h3>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-[64px] lg:text-[72px] font-bold text-foreground tracking-tight leading-none tabular-nums">84</span>
                <span className="text-[20px] text-tertiary font-medium">/ 100</span>
              </div>
              <div className="flex items-center gap-2 mb-10">
                <span className="px-2.5 py-[3px] bg-success/10 text-success rounded-full text-[11px] font-bold tracking-widest uppercase">Healthy</span>
                <span className="text-[13px] font-medium text-muted-foreground flex items-center">
                  ↑ 2.4% vs last month
                </span>
              </div>
              <p className="text-[14px] text-muted-foreground font-medium max-w-md leading-relaxed">
                Your operating system is becoming less dependent on founder intervention.
              </p>
            </div>

            <div className="w-full max-w-sm flex flex-col justify-center relative z-10">
                <div className="flex justify-between text-[10px] font-bold text-tertiary mb-3 uppercase tracking-widest select-none">
                  <span>Critical</span>
                  <span>Risk</span>
                  <span>Stable</span>
                  <span className="text-foreground">Healthy</span>
                  <span>Exceptional</span>
                </div>
                
                {/* Scale Rail */}
                <div className="h-[4px] w-full flex rounded-full bg-muted relative mb-2">
                   {/* Marker */}
                  <div className="absolute left-[84%] top-1/2 -translate-y-1/2 -ml-[6px] w-[12px] h-[12px] bg-foreground rounded-full z-10 shadow-sm outline outline-4 outline-card"></div>
                </div>
            </div>

          </div>
        </section>

        {/* BUSINESS SIGNALS - CLEAN STRIP */}
        <section aria-label="Business Signals">
          <div className="flex items-center gap-3 mb-4 select-none">
            <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Business Signals</h2>
          </div>
          <div className="flex flex-col sm:flex-row items-center border border-border bg-card rounded-[14px] px-2 py-6">
            <div className="flex-1 flex flex-col px-6 w-full border-b sm:border-b-0 sm:border-r border-border pb-6 sm:pb-0 mb-6 sm:mb-0">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 mix-blend-luminosity">Pipeline</p>
              <div className="flex items-baseline gap-2.5">
                <span className="text-[32px] font-bold text-foreground tracking-tight leading-none tabular-nums">$101,500</span>
                <span className="text-[13px] font-semibold text-success tabular-nums">↑ 12%</span>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col px-6 w-full border-b sm:border-b-0 sm:border-r border-border pb-6 sm:pb-0 mb-6 sm:mb-0">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 mix-blend-luminosity">Active Opps</p>
              <div className="flex items-baseline gap-2.5">
                <span className="text-[32px] font-bold text-foreground tracking-tight leading-none tabular-nums">24</span>
                <span className="text-[13px] font-semibold text-tertiary tabular-nums">+4</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col px-6 w-full border-b sm:border-b-0 sm:border-r border-border pb-6 sm:pb-0 mb-6 sm:mb-0">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 mix-blend-luminosity">Pending Actions</p>
              <div className="flex items-baseline gap-2.5">
                <span className="text-[32px] font-bold text-foreground tracking-tight leading-none tabular-nums">12</span>
                <span className="text-[13px] font-semibold text-destructive">3 critical</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col px-6 w-full">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 mix-blend-luminosity">Retention</p>
              <div className="flex items-baseline gap-2.5">
                <span className="text-[32px] font-bold text-foreground tracking-tight leading-none tabular-nums">76</span>
                <span className="text-[13px] font-semibold text-success tabular-nums">↑ 5%</span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[1.5fr_1fr] gap-12">
          
          <div className="space-y-12 min-w-0">
            {/* GROWTH ARCHITECTURE CARD-LESS */}
            <section aria-label="Growth Architecture">
              <div className="flex items-center gap-3 mb-6 select-none">
                <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Growth Architecture</h2>
              </div>
              <div className="overflow-x-auto hide-scrollbar -mx-2 px-2">
                <div className="min-w-[650px] flex items-center justify-between">
                  
                  {/* Stages */}
                  {[
                    { name: 'Attention', score: 82, trend: '↑ 12%', status: 'success' },
                    { name: 'Conversion', score: 71, trend: '↑ 8%', status: 'success' },
                    { name: 'Revenue', score: 64, trend: '↓ 4%', status: 'warning', warning: true },
                    { name: 'Delivery', score: 88, trend: '↑ 14%', status: 'success' },
                    { name: 'Retention', score: 76, trend: '→', status: 'neutral' },
                  ].map((stage, i, arr) => (
                    <React.Fragment key={stage.name}>
                      <div className={`flex flex-col relative px-4 py-3 rounded-[10px] transition-colors ${stage.warning ? 'bg-warning/5 border border-warning/20' : 'hover:bg-muted/50'}`}>
                        <div className="text-[10px] font-bold text-muted-foreground mb-2 flex items-center gap-1.5 uppercase tracking-widest">
                          {stage.warning && <span className="w-1.5 h-1.5 bg-warning rounded-full"></span>}
                          {stage.name}
                        </div>
                        <div className="flex items-end gap-3">
                          <span className="text-[28px] font-bold text-foreground leading-none tracking-tight tabular-nums">{stage.score}</span>
                          <span className={`text-[12px] font-bold mb-0.5 tabular-nums ${
                            stage.status === 'success' ? 'text-success' : 
                            stage.status === 'warning' ? 'text-warning' : 'text-tertiary'
                          }`}>{stage.trend}</span>
                        </div>
                      </div>
                      
                      {i < arr.length - 1 && (
                        <div className="flex-1 mx-2 flex items-center">
                          <div className="w-full h-px bg-border"></div>
                          <div className="w-[6px] h-[6px] border-t border-r border-border rotate-45 -ml-1"></div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </section>

            {/* GROWTH MOMENTUM */}
            <section aria-label="Growth Momentum">
              <div className="flex items-center justify-between mb-4 select-none">
                <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Growth Momentum</h2>
                <div className="flex items-center gap-4 text-[12px] font-medium text-tertiary">
                   <button className="hover:text-foreground transition-colors">Daily</button>
                   <button className="hover:text-foreground transition-colors">Weekly</button>
                   <button className="text-foreground font-semibold">Monthly</button>
                </div>
              </div>
              <div className="border border-border bg-card rounded-[14px] p-6 h-[340px] flex flex-col relative group">
                <div className="mb-2">
                  <span className="text-[13px] text-muted-foreground font-medium">Business momentum across last 6 months</span>
                </div>
                
                <div className="flex-1 relative flex flex-col justify-end mt-4">
                   <svg className="absolute inset-0 w-full h-[220px] pointer-events-none mt-auto" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <line x1="0" y1="25" x2="100" y2="25" className="stroke-border" strokeWidth="1" strokeDasharray="2 2" />
                      <line x1="0" y1="50" x2="100" y2="50" className="stroke-border" strokeWidth="1" strokeDasharray="2 2" />
                      <line x1="0" y1="75" x2="100" y2="75" className="stroke-border" strokeWidth="1" strokeDasharray="2 2" />
                      
                      {/* Secondary comparison line */}
                      <path d="M0,85 C20,80 40,88 60,75 C80,62 90,85 100,75" fill="none" className="stroke-tertiary/50" strokeWidth="1.5" />

                      {/* Primary Dominant Line */}
                      <path d="M0,90 C15,75 30,30 45,30 C60,30 70,55 85,35 C95,20 95,25 100,10" fill="none" className="stroke-foreground drop-shadow-sm" strokeWidth="2.5" strokeLinecap="round" />
                   </svg>
                   
                   <div className="relative z-10 flex justify-between text-[10px] font-bold text-tertiary mt-auto pt-3 border-t border-border select-none uppercase tracking-widest">
                      <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                   </div>
                </div>
              </div>
            </section>
            
            {/* NEXT ACTIONS */}
            <section aria-label="Next Actions">
               <div className="flex items-center mb-4 select-none">
                 <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Next Actions</h2>
               </div>
               <div className="border border-border bg-card rounded-[14px] p-2 flex flex-col">
                  {[
                    { action: 'Review 4 aging opportunities', system: 'Revenue OS', priority: 'High', color: 'text-warning' },
                    { action: 'Approve 2 pending content pieces', system: 'Attention OS', priority: 'Medium', color: 'text-tertiary' },
                    { action: 'Review conversion leak', system: 'Conversion OS', priority: 'High', color: 'text-destructive' }
                  ].map((task, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 hover:bg-muted/50 rounded-[8px] transition-colors cursor-pointer group">
                       <div className="w-4 h-4 rounded-[4px] border border-border flex items-center justify-center bg-card group-hover:border-tertiary transition-colors shrink-0"></div>
                       <span className="text-[13px] font-medium text-foreground flex-1">{task.action}</span>
                       <span className="text-[11px] font-semibold text-tertiary px-2">{task.system}</span>
                       <span className={`text-[11px] font-bold ${task.color} uppercase tracking-wide w-12 text-right`}>{task.priority}</span>
                    </div>
                  ))}
               </div>
            </section>

          </div>

          
          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-12 min-w-0">
             
             {/* ATTENTION REQUIRED */}
            <section aria-label="Attention Required">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest select-none leading-none">Attention Required</h2>
                <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest">3 Items</span>
              </div>
              <div className="flex flex-col gap-3">
                
                {/* Item 1 */}
                <div 
                  className="bg-card border border-border rounded-[14px] p-5 hover:bg-muted/30 transition-all cursor-pointer group focus-within:ring-2 focus-within:ring-ring focus-within:outline-none"
                  tabIndex={0}
                  role="button"
                  onClick={() => handleActionClick("1", "Content Approval", "Approve 2 waiting content items in Attention OS.")}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan"></span>
                        <span className="text-[12px] font-bold text-foreground">CONTENT APPROVAL</span>
                    </div>
                    <span className="text-[11px] font-semibold text-tertiary">Attention OS</span>
                  </div>
                  <p className="text-[13px] text-muted-foreground mb-4 font-medium leading-relaxed">2 content items are waiting for approval.</p>
                  <div className="text-[12px] font-bold text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    Wait 2.4d →
                  </div>
                </div>

                {/* Item 2 */}
                <div 
                  className="bg-card border border-border rounded-[14px] p-5 hover:bg-muted/30 transition-all cursor-pointer group focus-within:ring-2 focus-within:ring-ring focus-within:outline-none"
                  tabIndex={0}
                  role="button"
                  onClick={() => handleActionClick("2", "Conversion Leak", "Investigate a sudden 18% conversion drop.")}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse"></span>
                        <span className="text-[12px] font-bold text-foreground">CONVERSION LEAK</span>
                    </div>
                    <span className="text-[11px] font-semibold text-tertiary">Conversion OS</span>
                  </div>
                  <p className="text-[13px] text-muted-foreground mb-4 font-medium leading-relaxed">Landing → Call conversion dropped 18%.</p>
                  <div className="text-[12px] font-bold text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                    Needs investigation →
                  </div>
                </div>

                {/* Item 3 */}
                <div 
                  className="bg-card border border-border rounded-[14px] p-5 hover:bg-muted/30 transition-all cursor-pointer group focus-within:ring-2 focus-within:ring-ring focus-within:outline-none"
                  tabIndex={0}
                  role="button"
                  onClick={() => handleActionClick("3", "Aging Opportunities", "Review 4 inactive opportunities over 7 days.")}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-warning"></span>
                        <span className="text-[12px] font-bold text-foreground">AGING OPPORTUNITIES</span>
                    </div>
                     <span className="text-[11px] font-semibold text-tertiary">Revenue OS</span>
                  </div>
                  <p className="text-[13px] text-muted-foreground mb-4 font-medium leading-relaxed">4 opportunities have been inactive for 7+ days.</p>
                  <div className="text-[12px] font-bold text-warning opacity-0 group-hover:opacity-100 transition-opacity">
                    Needs action →
                  </div>
                </div>
              </div>
            </section>

            {/* NEXT BEST ACTION */}
            <section aria-label="Next Best Action">
              <div className="flex items-center mb-4 select-none">
                <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Next Best Action</h2>
              </div>
              <div className="bg-secondary rounded-[16px] p-6 border border-border relative overflow-hidden">
                <div className="relative z-10 flex flex-col h-full">
                  <h3 className="text-[14px] font-semibold mb-3 leading-snug tracking-tight text-foreground">
                    Resolve the 4 aging opportunities before creating additional acquisition volume.
                  </h3>
                  <p className="text-[13px] text-muted-foreground mb-6 leading-relaxed font-medium">
                    Your acquisition system is currently healthy. The larger constraint is conversion velocity.
                  </p>
                  <button 
                    className="bg-foreground text-background w-full py-2.5 rounded-[8px] text-[13px] font-semibold transition-all shadow-sm hover:opacity-90 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-secondary"
                    onClick={() => handleActionClick("action", "Review Opportunities", "Routing to Revenue OS to inspect stale opportunities.")}
                  >
                    Review Opportunities
                  </button>
                </div>
              </div>
            </section>
            
            {/* RECENT ACTIVITY */}
            <section aria-label="Recent Activity">
               <div className="flex items-center justify-between mb-4 select-none">
                 <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Recent Activity</h2>
               </div>
               <div className="flex flex-col gap-5 px-1 relative">
                 <div className="absolute left-1.5 top-2 bottom-2 w-px bg-border"></div>
                  
                 {[
                   { time: '10:42', text: 'Content approved', system: 'Attention OS' },
                   { time: '09:18', text: 'Opportunity moved to proposal', system: 'Revenue OS' },
                   { time: 'Yesterday', text: 'AI generated 8 content concepts', system: 'AI Workforce' },
                 ].map((act, i) => (
                   <div key={i} className="flex relative pl-6">
                     <span className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-card border-[3px] border-border outline outline-2 outline-background z-10"></span>
                     <div className="flex flex-col gap-0.5 w-full">
                       <span className="text-[13px] font-medium text-foreground leading-tight">{act.text}</span>
                       <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-tertiary uppercase tracking-wider">{act.time}</span>
                          <span className="border-l border-border h-2.5"></span>
                          <span className="text-[11px] font-medium text-muted-foreground">{act.system}</span>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
            </section>
            
          </div>
        </div>

      <ConfirmationDialog
        isOpen={pendingAction !== null}
        onClose={() => setPendingAction(null)}
        onConfirm={handleExecuteAction}
        title={pendingAction?.title || "Confirm Action"}
        description={pendingAction?.subtitle || "Are you sure you want to execute this action? It will mutate the live operational state."}
        confirmText="Confirm Execution"
        isLoading={isExecuting}
      />
    </div>
  );
}
