"use client";

import React, { useState } from "react";
import { getCommandCenter, executeAction } from "@/lib/adapters";
import { ActionItem } from "@/lib/types";
import { useAdapter } from "@/hooks/useAdapter";

// UI Primitives
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { ActionRow } from "@/components/ui/ActionRow";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Skeleton, CardSkeleton } from "@/components/ui/States";

export default function CommandCenterPage() {
  const { data, setData, loading, error, reload: loadData } = useAdapter(getCommandCenter);

  // Execution states
  const [pendingAction, setPendingAction] = useState<ActionItem | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  async function handleExecuteAction() {
    if (!pendingAction) return;
    
    setIsExecuting(true);
    try {
      await executeAction(pendingAction.id);
      
      // Remove action locally on success for UX demonstration
      setData(prev => prev ? {
        ...prev,
        actionQueue: prev.actionQueue.filter(a => a.id !== pendingAction.id)
      } : prev);
      
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      alert(`Action failed: ${message}`); // Native alert fallback just for error visibility
    } finally {
      setIsExecuting(false);
      setPendingAction(null);
    }
  }

  // --- Render Functions ---

  if (loading) {
    return (
      <div className="p-6 md:p-8 lg:p-12 max-w-[1240px] mx-auto animate-in fade-in duration-300">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <CardSkeleton />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 md:p-8 lg:p-12 max-w-[1240px] mx-auto">
        <Alert variant="danger" title={error || "Unexpected Error"}>
          We couldn&apos;t connect to the backend foundation.
          <div className="mt-4">
            <Button variant="secondary" size="sm" onClick={loadData}>Retry Connection</Button>
          </div>
        </Alert>
      </div>
    );
  }

  // Map priority colors
  const PriorityBadgeMap = {
    high: "danger",
    medium: "warning",
    low: "neutral"
  } as const;

  const IconMap = {
    review: "plagiarism",
    follow_up: "record_voice_over",
    investigate: "search",
    approve: "verified"
  } as const;

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-[1240px] mx-auto">
      
      {/* 1. Page Header */}
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl lg:text-[40px] font-display font-bold text-on-surface tracking-tight leading-tight">
            Command Center
          </h1>
          <p className="text-on-surface-variant text-[15px] mt-1.5 font-medium">
            Your business, at a glance. Your next move, clearly.
          </p>
        </div>
        <Badge variant={data.founderIndependenceScore >= 80 ? "success" : data.founderIndependenceScore >= 50 ? "primary" : "neutral"} size="md" className="py-2 px-4 shadow-sm border border-outline-variant rounded-xl self-start">
          Founder Independence: {data.founderIndependenceScore}/100
        </Badge>
      </header>

      {/* 2. Business Pulse */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {data.pulseMetrics.map((metric, idx) => (
          <StatCard
            key={idx}
            title={metric.title}
            value={metric.value}
            deltaText={metric.deltaText}
            deltaTrend={metric.deltaTrend}
            icon={metric.iconName}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        <div className="flex flex-col gap-8">
          
          {/* 3. Primary Constraint */}
          <Card className="border border-error/20 !bg-[#FEF2F2] shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-error" />
            <div className="mb-2">
              <Badge variant="danger" size="sm" className="mb-3 uppercase tracking-wider">Primary Constraint</Badge>
            </div>
            <h2 className="text-xl font-display font-bold text-[#7F1D1D] mb-1.5 tracking-tight">
              {data.primaryConstraint}
            </h2>
            <p className="text-[#991B1B] text-[13.5px] font-medium leading-relaxed max-w-2xl">
              <strong className="text-error uppercase tracking-wider text-[11px] font-bold mr-2">Weekly Directive:</strong>
              {data.weeklyDirective}
            </p>
            <div className="mt-5">
              <Button variant="danger" size="md" icon="gavel" onClick={() => alert("Redirects to Conversion pipeline limits.")}>
                Intervene Now
              </Button>
            </div>
          </Card>

          {/* 4. Action Center */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-on-surface tracking-tight">Action Center</h3>
              <Badge statusIndicator variant="primary">Pending Actions</Badge>
            </div>
            
            {data.actionQueue.length === 0 ? (
              <div className="p-8 border border-dashed border-outline-variant bg-surface rounded-xl text-center text-on-surface-variant text-sm">
                No pending actions. You&apos;re clear for deep work.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {data.actionQueue.map(action => (
                  <ActionRow
                    key={action.id}
                    title={action.title}
                    subtitle={action.subtitle}
                    icon={IconMap[action.type]}
                    badge={
                      <Badge variant={PriorityBadgeMap[action.priority]} size="sm">
                        {action.priority} priority
                      </Badge>
                    }
                    rightElement={
                      <Button variant="primary" size="sm" onClick={() => setPendingAction(action)}>
                        Resolve
                      </Button>
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 5. Context / Intelligence / Ecosystem Status */}
        <div className="flex flex-col gap-6">
          <Card variant="outlined">
            <CardHeader>
              <CardTitle>System Integrations</CardTitle>
            </CardHeader>
            <div className="flex flex-col gap-3">
              {Object.entries(data.automationStatus).map(([key, status]) => (
                <div key={key} className="flex items-center justify-between py-2 border-b border-outline-variant last:border-0">
                  <span className="text-[13px] text-on-surface capitalize font-medium">
                    {key.replace("_", " ")}
                  </span>
                  <Badge 
                    variant={status === "CONNECTED" || status === "SUCCESS" || status === "RUNNING" ? "success" : status === "NOT_CONFIGURED" ? "neutral" : "danger"} 
                    size="sm"
                  >
                    {status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Execution Confirmation */}
      <ConfirmationDialog
        isOpen={pendingAction !== null}
        onClose={() => setPendingAction(null)}
        onConfirm={handleExecuteAction}
        title={pendingAction?.title || "Confirm Action"}
        description={pendingAction?.subtitle || "Are you sure you want to execute this action? It may affect live business state."}
        confirmText="Confirm Execution"
        isLoading={isExecuting}
      />
    </div>
  );
}
