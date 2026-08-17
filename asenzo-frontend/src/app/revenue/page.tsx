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

import { Skeleton, CardSkeleton } from "@/components/ui/States";
import { Alert } from "@/components/ui/Alert";
import { useAdapter } from "@/hooks/useAdapter";

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export default function RevenueWorkspace() {
  const { data, setData, localData, setLocalData, loading, error, reload: loadData } = useAdapter(getRevenue);
  const [selectedEngagementId, setSelectedEngagementId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="p-container-padding max-w-[1440px] mx-auto space-y-8 animate-in fade-in duration-500">
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
            <button className="bg-primary text-white px-4 py-2 rounded-lg" onClick={loadData}>Retry</button>
          </div>
        </Alert>
      </div>
    );
  }

  // Set default selection
  if (!selectedEngagementId && localData.engagements.length > 0) {
      setSelectedEngagementId(localData.engagements[0].id);
  }

  const activeEngagement = localData.engagements.find(e => e.id === selectedEngagementId);

  // Derive blockers
  const overdueItems = localData.engagements.filter(e => e.status === "OVERDUE").slice(0,2);
  const riskItems = localData.engagements.filter(e => e.risks.some(r => r.status === "OPEN")).slice(0,2);
  const onTrackItems = localData.engagements.filter(e => e.status === "ON_TRACK").slice(0,2);

  const activeRevenueTotal = localData.engagements.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <>
      <header className="flex justify-between items-center w-full px-container-padding py-4 top-0 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 z-40 sticky">
          <div className="flex items-center gap-8">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Revenue Command</h2>
          </div>
          <div className="flex items-center gap-6">
              <div className="relative hidden md:block w-64">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
                  <input className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg pl-9 pr-4 py-1.5 font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-on-surface-variant/50" placeholder="Search ASENZO engines..." type="text"/>
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 font-label-muted text-[10px] text-on-surface-variant bg-surface border border-outline-variant/30 px-1.5 rounded">⌘K</span>
              </div>
              <div className="flex items-center gap-3 border-l border-outline-variant/30 pl-6">
                  <button className="relative p-2 text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100 rounded-full hover:bg-surface-container-highest">
                      <span className="material-symbols-outlined">notifications</span>
                  </button>
              </div>
          </div>
      </header>

      <div className="flex-1 overflow-y-auto p-container-padding pb-32 space-y-6">
        
        {/* TOP SCROLLERS - High Priority Notifications */}
        <section className="flex gap-4 overflow-x-auto pb-2">
            {overdueItems.map(item => (
                <div key={`overdue-${item.id}`} className="bg-surface-container-lowest border border-rose-100 rounded-2xl p-5 min-w-[300px] flex-shrink-0 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-rose-500 text-[18px]">warning</span>
                            <span className="font-label-caps text-label-caps text-rose-900">Overdue Payment</span>
                        </div>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">{item.customerName}</h3>
                    <p className="font-body-lg text-body-lg font-bold text-on-surface mb-4">{formatCurrency(item.amount, item.currency)}</p>
                    <button className="w-full bg-rose-50 text-rose-700 py-1.5 rounded-lg text-sm font-medium hover:bg-rose-100 transition-colors">Send Reminder</button>
                </div>
            ))}

            {riskItems.map(item => {
                const openRisk = item.risks.find(r => r.status === "OPEN");
                return (
                <div key={`risk-${item.id}`} className="bg-surface-container-lowest border border-amber-100 rounded-2xl p-5 min-w-[300px] flex-shrink-0 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-amber-500 text-[18px]">error</span>
                            <span className="font-label-caps text-label-caps text-amber-900">Risk Blocker</span>
                        </div>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">{item.customerName}</h3>
                    <p className="text-sm text-on-surface-variant mb-4 line-clamp-1">{openRisk?.title || "Operational Compliance Risk"}</p>
                    <button className="w-full bg-amber-50 text-amber-700 py-1.5 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors">Resolve Action</button>
                </div>
            )})}

            {onTrackItems.map(item => (
                <div key={`track-${item.id}`} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 min-w-[300px] flex-shrink-0 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">schedule</span>
                            <span className="font-label-caps text-label-caps text-on-surface-variant">Upcoming</span>
                        </div>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">{item.customerName}</h3>
                    <p className="font-body-lg text-body-lg font-bold text-on-surface mb-4">{formatCurrency(item.amount, item.currency)}</p>
                    <button 
                        onClick={() => setSelectedEngagementId(item.id)}
                        className="w-full bg-surface-container text-on-surface py-1.5 rounded-lg text-sm font-medium hover:bg-surface-container-high transition-colors">
                            View Details
                    </button>
                </div>
            ))}
            
            {localData.engagements.length === 0 && (
                <div className="p-8 text-center text-on-surface-variant w-full bg-surface-bright rounded-2xl border border-outline-variant/20">
                    No active revenue alerts.
                </div>
            )}
        </section>

        {/* MAIN Revenue Workspace */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-280px)] min-h-[600px]">
            {/* Sidebar List */}
            <div className="col-span-1 md:col-span-4 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-outline-variant/20 bg-surface/50">
                    <h2 className="font-headline-md text-headline-md font-semibold text-on-surface mb-1">Active Revenue</h2>
                    <p className="text-sm text-on-surface-variant mb-4">Current collection cycle</p>
                    <div className="bg-surface-container p-4 rounded-xl">
                        <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">Total Expected</p>
                        <p className="font-display-lg text-display-lg font-bold text-primary tracking-tight">{formatCurrency(activeRevenueTotal, "USD")}</p>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {localData.engagements.map(engagement => (
                        <button 
                            key={engagement.id}
                            onClick={() => setSelectedEngagementId(engagement.id)}
                            className={`w-full text-left p-4 rounded-xl transition-colors flex items-center justify-between group relative ${selectedEngagementId === engagement.id ? 'bg-surface-container border border-outline-variant/30' : 'hover:bg-surface-container-low border border-transparent'}`}
                        >
                            {selectedEngagementId === engagement.id && <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full"></div>}
                            <div className="flex items-center gap-3 ml-2">
                                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant font-bold text-sm">
                                    {engagement.customerName.substring(0,2).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="font-headline-sm text-sm font-semibold text-on-surface">{engagement.customerName}</h4>
                                    <p className="text-xs text-on-surface-variant">Due {new Date(engagement.dueDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-body-sm text-body-sm font-semibold ${engagement.status === 'COLLECTED' ? 'text-on-surface-variant line-through opacity-70' : 'text-on-surface'}`}>{formatCurrency(engagement.amount, engagement.currency)}</p>
                                {engagement.status === 'OVERDUE' ? (
                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-rose-50 text-rose-700 mt-1">Overdue</span>
                                ) : engagement.status === 'AT_RISK' ? (
                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 mt-1">Action Req</span>
                                ) : engagement.status === 'COLLECTED' ? (
                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-surface-container-high text-on-surface-variant mt-1">Cleared</span>
                                ) : (
                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 mt-1">On Track</span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="col-span-1 md:col-span-8 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col overflow-hidden glass-panel relative">
                {activeEngagement ? (
                    <>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none"></div>

                        <div className="p-8 border-b border-outline-variant/10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface font-bold text-xl shadow-inner">
                                        {activeEngagement.customerName.substring(0,2).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h2 className="font-display-lg text-display-lg-mobile font-bold text-on-surface">{activeEngagement.customerName}</h2>
                                            {activeEngagement.status === 'AT_RISK' || activeEngagement.status === 'OVERDUE' ? (
                                                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">Action Required</span>
                                            ) : null}
                                        </div>
                                        <p className="text-sm text-on-surface-variant flex items-center gap-4">
                                            <span>ID: {activeEngagement.id}</span>
                                            <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                                            <span>Status: {activeEngagement.paymentState}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">Total Outstanding</p>
                                    <p className="font-display-lg text-display-lg font-bold text-primary tracking-tight">{formatCurrency(activeEngagement.amount, activeEngagement.currency)}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                            <button className="bg-primary text-on-primary px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">Log Payment</button>
                            <button className="bg-surface-container-lowest border border-outline-variant text-on-surface px-5 py-2 rounded-lg text-sm font-medium hover:bg-surface-container transition-colors shadow-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">mail</span> Email Client
                            </button>
                            <button className="bg-surface-container-lowest border border-outline-variant text-on-surface px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface-container transition-colors shadow-sm ml-auto">
                                <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                            </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 flex flex-col xl:flex-row gap-8">
                            <div className="flex-1 space-y-8">
                                
                                {activeEngagement.risks.filter(r => r.status === "OPEN").length > 0 && (
                                    <div>
                                        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-amber-500">warning</span>
                                            Revenue Risks
                                        </h3>
                                        {activeEngagement.risks.filter(r => r.status === "OPEN").map(risk => (
                                            <div key={risk.id} className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-4 flex items-start gap-4 mb-3">
                                                <div className="bg-amber-100 p-2 rounded-lg text-amber-700">
                                                    <span className="material-symbols-outlined">description</span>
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-semibold text-amber-900 mb-1">{risk.title}</h4>
                                                    <p className="text-xs text-amber-800/80 mb-3">{risk.description}</p>
                                                    <button className="text-xs font-semibold bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1.5 rounded transition-colors">Resolve Issue</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div>
                                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Open Items</h3>
                                    {activeEngagement.items.length > 0 ? (
                                        <div className="border border-outline-variant/30 rounded-xl overflow-hidden bg-surface-container-lowest">
                                            <table className="w-full text-left text-sm">
                                                <thead className="bg-surface-container-low border-b border-outline-variant/30">
                                                    <tr>
                                                        <th className="px-4 py-3 font-medium text-on-surface-variant">Item</th>
                                                        <th className="px-4 py-3 font-medium text-on-surface-variant">Date Issued</th>
                                                        <th className="px-4 py-3 font-medium text-on-surface-variant">Status</th>
                                                        <th className="px-4 py-3 font-medium text-on-surface-variant text-right">Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-outline-variant/10">
                                                    {activeEngagement.items.map(item => (
                                                        <tr key={item.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                                                            <td className="px-4 py-3 font-medium text-primary">{item.title}</td>
                                                            <td className="px-4 py-3 text-on-surface-variant">{new Date(item.dueDate).toLocaleDateString()}</td>
                                                            <td className="px-4 py-3">
                                                                {item.status === 'COLLECTED' ? (
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-surface-container-high text-on-surface-variant border border-outline-variant/30">Collected</span>
                                                                ) : item.status === 'OVERDUE' ? (
                                                                     <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-200/50">Overdue</span>
                                                                ) : item.status === 'AT_RISK' ? (
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200/50">Blocked</span>
                                                                ) : (
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/50">Pending</span>
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-3 font-medium text-right text-primary">{formatCurrency(item.amount, activeEngagement.currency)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="p-4 text-on-surface-variant border border-outline-variant/20 rounded-xl">No active invoices</div>
                                    )}
                                </div>
                            </div>

                            <div className="w-full xl:w-72 flex-shrink-0">
                                <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/20 sticky top-0">
                                    <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[16px]">task_alt</span> Next Actions
                                    </h3>
                                    <ul className="space-y-3">
                                        {activeEngagement.nextAction ? (
                                            <li className="flex items-start gap-3">
                                                <input defaultChecked={activeEngagement.nextAction.status === 'COMPLETED'} className="mt-0.5 rounded border-outline-variant text-primary focus:ring-primary rounded-sm bg-surface-container-lowest cursor-pointer" type="checkbox"/>
                                                <div>
                                                    <p className={`text-sm font-medium ${activeEngagement.nextAction.status === 'COMPLETED' ? 'line-through opacity-70 text-on-surface-variant' : 'text-on-surface'}`}>{activeEngagement.nextAction.title}</p>
                                                    <p className="text-xs text-on-surface-variant mt-0.5">{activeEngagement.nextAction.description}</p>
                                                </div>
                                            </li>
                                        ) : (
                                            <li className="text-sm text-on-surface-variant">No pending action.</li>
                                        )}
                                    </ul>
                                    <button className="w-full mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-primary hover:bg-surface-container py-2 rounded-lg transition-colors border border-dashed border-outline-variant/50">
                                        <span className="material-symbols-outlined text-[16px]">add</span> Add Action Item
                                    </button>
                                </div>
                            </div>
                        </div>

                    </>
                ) : (
                    <div className="p-8 text-center text-on-surface-variant">Select an active relationship to view details.</div>
                )}
            </div>
            
        </div>
      </div>
    </>
  );
}
