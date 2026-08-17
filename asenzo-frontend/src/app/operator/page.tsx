"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  getOperator, 
  updateOperatorItem,
  completeOperatorItem
} from "@/lib/adapters";
import { 
  OperatorItem,
  OperatorItemStatus,
  OperatorPriority
} from "@/lib/types";

import { Skeleton, CardSkeleton } from "@/components/ui/States";
import { Alert } from "@/components/ui/Alert";
import { useAdapter } from "@/hooks/useAdapter";

export default function OperatorWorkspace() {
  const router = useRouter();

  const { data, setData, localData, setLocalData, loading, error, reload: loadData } = useAdapter(getOperator);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="p-container-padding max-w-[1440px] mx-auto space-y-8 animate-in fade-in duration-500">
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
            <button className="bg-primary text-white px-4 py-2 rounded-lg" onClick={loadData}>Retry</button>
          </div>
        </Alert>
      </div>
    );
  }
  
  if (!selectedItemId && localData.items.length > 0) {
      setSelectedItemId(localData.items[0].id);
  }

  const activeItem = localData.items.find(i => i.id === selectedItemId);

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

  return (
    <>
      <header className="bg-surface dark:bg-surface-container-lowest fixed top-0 right-0 left-0 md:left-[280px] h-16 border-b border-outline-variant flex justify-between items-center px-gutter w-full z-40">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-surface-container-high rounded font-label-caps text-[10px] tracking-wider text-on-surface-variant">ENGINE 5</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Operator Command</h3>
            </div>
        </div>
        <div className="flex-1 max-w-md mx-8 hidden md:block relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
            <input className="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-12 py-2 text-sm font-body-sm focus:ring-1 focus:ring-primary outline-none text-on-surface placeholder:text-on-surface-variant" placeholder="Search documentation..." type="text"/>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-label-muted text-on-surface-variant border border-outline-variant px-1.5 rounded text-xs opacity-60">⌘K</span>
        </div>
        <div className="flex items-center gap-4 pr-12">
            <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center">
            <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center">
            <span className="material-symbols-outlined">account_circle</span>
            </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pt-24 pb-12 p-container-padding w-full max-w-[1440px] mx-auto space-y-card-gap">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-card-gap mb-8">
            <div className="bg-surface-container-lowest rounded-2xl p-container-padding flex flex-col justify-between border border-outline-variant/30 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <span className="font-label-muted text-label-muted uppercase text-secondary">Active Workflows</span>
                    <span className="material-symbols-outlined text-secondary opacity-50 text-sm">description</span>
                </div>
                <div>
                    <div className="font-headline-md text-headline-md text-primary font-bold">{activeItems.length}</div>
                    <div className="font-body-sm text-body-sm text-[#10B981] mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">check_circle</span> Operational
                    </div>
                </div>
            </div>
            
            <div className="bg-surface-container-lowest rounded-2xl p-container-padding flex flex-col justify-between border-l-4 border-l-[#F59E0B] shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <span className="font-label-muted text-label-muted uppercase text-secondary">Operational Blockers</span>
                    <span className="material-symbols-outlined text-[#F59E0B] opacity-80 text-sm">warning</span>
                </div>
                <div>
                    <div className="font-headline-md text-headline-md text-primary font-bold">{attentionRequired.length}</div>
                    <div className="font-body-sm text-body-sm text-[#F59E0B] mt-1 font-medium flex items-center gap-1">
                        Action Required
                    </div>
                </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-container-padding flex flex-col justify-between border border-outline-variant/30 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <span className="font-label-muted text-label-muted uppercase text-secondary">Maintenance Open</span>
                    <span className="material-symbols-outlined text-secondary opacity-50 text-sm">inbox</span>
                </div>
                <div>
                    <div className="font-headline-md text-headline-md text-primary font-bold">{openWork.length}</div>
                    <div className="font-body-sm text-body-sm text-secondary mt-1 flex items-center gap-1">
                        Pending
                    </div>
                </div>
            </div>
            
            <div className="bg-surface-container-lowest rounded-2xl p-container-padding flex flex-col justify-between border border-outline-variant/30 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <span className="font-label-muted text-label-muted uppercase text-secondary">Completion Rate</span>
                    <span className="material-symbols-outlined text-secondary opacity-50 text-sm">task_alt</span>
                </div>
                <div>
                    <div className="font-headline-md text-headline-md text-primary font-bold">100%</div>
                    <div className="w-full bg-surface-container-high rounded-full h-1.5 mt-3">
                        <div className="bg-primary h-1.5 rounded-full" style={{width: '100%'}}></div>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-card-gap">
            {/* Sidebar List */}
            <div className="lg:col-span-1 bg-surface-container-lowest rounded-[24px] border border-outline-variant/30 p-container-padding flex flex-col shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-headline-sm text-headline-sm text-primary">Active Capabilities</h3>
                </div>
                
                <div className="space-y-2 flex-1 overflow-y-auto pr-2">
                    {localData.items.map(item => (
                        <div 
                            key={item.id}
                            onClick={() => setSelectedItemId(item.id)}
                            className={`p-4 rounded-xl cursor-pointer transition-colors border ${selectedItemId === item.id ? 'border-primary bg-primary/5' : 'border-outline-variant/30 hover:border-primary/50'}`}    
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`font-body-sm text-body-sm font-medium line-clamp-1 ${selectedItemId === item.id ? 'text-primary' : 'text-on-surface'}`}>{item.title}</span>
                                <span className="font-label-muted text-label-muted bg-surface-container-low px-2 py-0.5 rounded text-secondary shrink-0">{item.status.replace("_", " ")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {item.priority === 'URGENT' || item.priority === 'HIGH' ? (
                                    <span className="w-2 h-2 rounded-full bg-error"></span>
                                ) : (
                                    <span className="w-2 h-2 rounded-full bg-success"></span>
                                )}
                                <span className="text-xs text-on-surface-variant font-medium">{item.sourceModule}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Details Panel */}
            <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/30 rounded-[24px] p-container-padding flex flex-col shadow-sm">
                {activeItem ? (
                    <>
                        <div className="border-b border-surface-container-high pb-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <div className="font-label-caps text-label-caps text-secondary mb-1">CAPABILITY DEEP DIVE</div>
                                <h3 className="font-headline-md text-headline-md text-primary">{activeItem.title}</h3>
                            </div>
                            <div className="flex items-center gap-3 bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant/30">
                                <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-muted text-[10px]">
                                    {activeItem.owner.substring(0,2).toUpperCase()}
                                </div>
                                <span className="font-body-sm text-body-sm text-secondary">Owner: <strong className="text-primary font-medium">{activeItem.owner}</strong></span>
                            </div>
                        </div>

                        <div className="flex-1 mb-8 space-y-6">
                            
                            <div>
                                <h4 className="font-headline-sm text-headline-sm text-primary mb-2">Description</h4>
                                <p className="text-on-surface-variant text-[14.5px] leading-relaxed">
                                    {activeItem.description}
                                </p>
                            </div>

                            {activeItem.intelligenceSignal && (
                                <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-4 flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-[#FEF3C7] flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[#D97706] text-sm">insights</span>
                                    </div>
                                    <div>
                                        <h5 className="font-body-sm text-body-sm text-[#92400E] font-semibold mb-1">Intelligence Signal</h5>
                                        <p className="font-body-sm text-body-sm text-[#B45309]">{activeItem.intelligenceSignal}</p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <h4 className="font-headline-sm text-headline-sm text-primary mb-4">Execution Protocol</h4>
                                <div className="space-y-3">
                                    <label className={`flex items-center gap-3 p-3 rounded-lg border shadow-sm transition-colors cursor-pointer relative overflow-hidden ${activeItem.status === 'COMPLETED' ? 'border-success/50 bg-success/5' : 'border-primary bg-surface'}`}>
                                        {activeItem.status !== 'COMPLETED' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
                                        <input 
                                            className="w-4 h-4 text-primary bg-surface border-outline-variant rounded focus:ring-primary focus:ring-2" 
                                            type="checkbox"
                                            checked={activeItem.status === "COMPLETED"}
                                            readOnly 
                                        />
                                        <span className={`font-body-sm text-body-sm font-medium ${activeItem.status === 'COMPLETED' ? 'text-on-surface-variant line-through opacity-70' : 'text-primary'}`}>
                                            {activeItem.recommendedAction}
                                        </span>
                                        <span className={`ml-auto font-label-muted text-label-muted px-2 py-0.5 rounded-full text-xs ${activeItem.status === 'COMPLETED' ? 'text-success' : 'bg-primary text-white'}`}>
                                            {activeItem.status === 'COMPLETED' ? 'Done' : 'Active'}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push(`/${activeItem.sourceModule.toLowerCase()}`)}
                                className="mt-4 px-4 py-2 border border-outline-variant text-[14px] font-medium rounded-lg hover:bg-surface-container transition-colors"
                            >
                                Open in {activeItem.sourceModule}
                            </button>

                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-on-surface-variant p-8 text-center">
                        Select an operational capability to view details.
                    </div>
                )}
            </div>

        </div>

      </div>

    </>
  );
}
