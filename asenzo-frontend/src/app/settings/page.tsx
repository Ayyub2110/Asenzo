"use client";

import React, { useState } from "react";
import { 
  getSettings, 
  updateSettings 
} from "@/lib/adapters";
import { 
  SettingsData,
  NotificationPriorityThreshold
} from "@/lib/types";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select, FormField } from "@/components/ui/Forms";
import { Skeleton, CardSkeleton } from "@/components/ui/States";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { useAdapter } from "@/hooks/useAdapter";

export default function SettingsWorkspace() {
  const { setData, localData, setLocalData, loading, error, reload: loadData } = useAdapter(getSettings);
  
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Edit Buffer
  const [isEditing, setIsEditing] = useState(false);
  const [draftSettings, setDraftSettings] = useState<SettingsData | null>(null);

  // --------------- EDIT BOUNDARY ---------------
  function handleEdit() {
    if (!localData) return;
    setMutationError(null);
    setDraftSettings(JSON.parse(JSON.stringify(localData))); // Deep isolated copy
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setMutationError(null);
    setDraftSettings(null);
    setIsEditing(false);
  }

  async function handleSaveSettings() {
    if (!draftSettings) return;
    setMutationError(null);
    setIsSaving(true);
    try {
      const res = await updateSettings(draftSettings);
      setLocalData(res);
      setData(res);
      setIsEditing(false);
      setDraftSettings(null);
    } catch (err: unknown) {
      setMutationError("Configuration persistence failed: " + (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-[1000px] mx-auto p-6 md:p-8 animate-in fade-in duration-500 space-y-8">
        <header className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </header>
        <div className="space-y-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error || !localData) {
    return (
      <div className="max-w-[800px] mx-auto mt-12 p-6 md:p-8 space-y-10">
        <section>
          <h2 className="text-[14px] uppercase font-bold tracking-wider text-on-surface-variant mb-4">Diagnostic Recovery</h2>
          <Alert variant="danger" title="System Synchronization Failure">
            {error}
            <div className="mt-4">
              <Button variant="secondary" onClick={loadData}>Retry Connection</Button>
            </div>
          </Alert>
        </section>
      </div>
    );
  }

  // Active render state is strictly draft if editing, otherwise canonical localData.
  const renderData = isEditing && draftSettings ? draftSettings : localData;

  return (
    <div className="max-w-[1000px] mx-auto p-6 md:p-8 space-y-10 animate-in fade-in duration-500">
      
      {/* -------------------- HEADER -------------------- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant pb-6">
        <div>
          <h1 className="text-[28px] font-display font-medium text-on-surface tracking-tight">System Preferences</h1>
          <p className="text-on-surface-variant text-[15px] mt-1">Configure global application boundaries and operator profile.</p>
        </div>
        
        <div className="flex gap-2">
          {!isEditing ? (
            <Button variant="secondary" onClick={handleEdit}>Edit Preferences</Button>
          ) : (
            <>
              <Button variant="secondary" onClick={handleCancelEdit} disabled={isSaving}>Cancel</Button>
              <Button variant="primary" onClick={handleSaveSettings} isLoading={isSaving}>Save Preferences</Button>
            </>
          )}
        </div>
      </header>

      {/* Surface Mutation Error globally below header */}
      {mutationError && (
        <Alert variant="danger" title="Persistence Failure">
          {mutationError}
        </Alert>
      )}

      {/* -------------------- DIAGNOSTICS (Read Only) -------------------- */}
      <section>
        <div className="flex items-center gap-2 mb-4">
           <span className="material-symbols-outlined text-primary text-[20px]">insights</span>
           <h2 className="text-[14px] uppercase font-bold tracking-wider text-on-surface-variant">System Diagnostics</h2>
        </div>
        <div className="bg-primary/5 text-[14px] font-medium text-primary-dark px-4 py-3 rounded-lg border border-primary/20 leading-relaxed shadow-sm">
           {localData.intelligenceSignal || "All systems operating optimally. No configuration adjustments recommended at this time."}
        </div>
      </section>

      {/* -------------------- USER PROFILE -------------------- */}
      <section>
        <div className="flex items-center gap-2 mb-4">
           <span className="material-symbols-outlined text-on-surface-variant text-[20px]">person</span>
           <h2 className="text-[14px] uppercase font-bold tracking-wider text-on-surface-variant">Operator Profile</h2>
        </div>
        <Card className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {!isEditing ? (
              <>
                <div className="space-y-1">
                  <span className="block text-[11px] font-bold text-on-surface-variant uppercase">Display Name</span>
                  <p className="font-medium text-on-surface text-[15px]">{renderData.profile.displayName}</p>
                </div>
                <div className="space-y-1">
                  <span className="block text-[11px] font-bold text-on-surface-variant uppercase">Role / Title</span>
                  <p className="font-medium text-on-surface text-[15px]">{renderData.profile.role}</p>
                </div>
                <div className="space-y-1">
                  <span className="block text-[11px] font-bold text-on-surface-variant uppercase">Email Contact</span>
                  <p className="font-medium text-on-surface text-[15px]">{renderData.profile.email}</p>
                </div>
              </>
            ) : (
              <>
                <FormField label="Display Name">
                  <Input 
                    value={renderData.profile.displayName} 
                    onChange={e => setDraftSettings(prev => prev ? {...prev, profile: {...prev.profile, displayName: e.target.value}} : null)}
                  />
                </FormField>
                <FormField label="Role / Title">
                  <Input 
                    value={renderData.profile.role} 
                    onChange={e => setDraftSettings(prev => prev ? {...prev, profile: {...prev.profile, role: e.target.value}} : null)}
                  />
                </FormField>
                <FormField label="Email Contact">
                  <Input 
                    value={renderData.profile.email} 
                    type="email"
                    onChange={e => setDraftSettings(prev => prev ? {...prev, profile: {...prev.profile, email: e.target.value}} : null)}
                  />
                </FormField>
              </>
            )}
          </div>
        </Card>
      </section>

      {/* -------------------- NOTIFICATIONS -------------------- */}
      <section>
        <div className="flex items-center gap-2 mb-4">
           <span className="material-symbols-outlined text-on-surface-variant text-[20px]">notifications</span>
           <h2 className="text-[14px] uppercase font-bold tracking-wider text-on-surface-variant">Notification Architecture</h2>
        </div>
        <Card className="p-6 md:p-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             
             {!isEditing ? (
                <>
                  <div className="space-y-4">
                    <h4 className="text-[12px] font-bold text-on-surface-variant uppercase border-b border-outline-variant pb-2">Channels Enabled</h4>
                    <div className="flex justify-between items-center bg-surface-container px-4 py-2.5 rounded-md border border-outline-variant">
                      <span className="text-[14px]">Email Alerts</span>
                      <Badge variant={renderData.notifications.emailAlertsEnabled ? "success" : "neutral"}>{renderData.notifications.emailAlertsEnabled ? "ACTIVE" : "OFF"}</Badge>
                    </div>
                    <div className="flex justify-between items-center bg-surface-container px-4 py-2.5 rounded-md border border-outline-variant">
                      <span className="text-[14px]">In-App Surface Alerts</span>
                      <Badge variant={renderData.notifications.inAppAlertsEnabled ? "success" : "neutral"}>{renderData.notifications.inAppAlertsEnabled ? "ACTIVE" : "OFF"}</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-[12px] font-bold text-on-surface-variant uppercase border-b border-outline-variant pb-2">Delivery Thresholds</h4>
                    <div className="space-y-1 mt-2">
                       <span className="block text-[11px] font-bold text-on-surface-variant uppercase">Digest Frequency</span>
                       <p className="font-medium text-on-surface">{renderData.notifications.digestFrequency}</p>
                    </div>
                    <div className="space-y-1 mt-4">
                       <span className="block text-[11px] font-bold text-on-surface-variant uppercase">Priority Threshold</span>
                       <p className="font-medium text-on-surface">{renderData.notifications.priorityThreshold.replace("_", " ")}</p>
                    </div>
                  </div>
                </>
             ) : (
                <>
                  <div className="space-y-4">
                    <h4 className="text-[12px] font-bold text-on-surface-variant uppercase border-b border-outline-variant pb-2 mb-4">Channels Enabled</h4>
                    <FormField label="Email Alerts">
                       <Select 
                          value={renderData.notifications.emailAlertsEnabled ? "ON" : "OFF"}
                          onChange={e => setDraftSettings(prev => prev ? {...prev, notifications: {...prev.notifications, emailAlertsEnabled: e.target.value === "ON"}} : null)}
                       >
                          <option value="ON">Enabled</option>
                          <option value="OFF">Disabled</option>
                       </Select>
                    </FormField>
                    <FormField label="In-App Surface Alerts">
                       <Select 
                          value={renderData.notifications.inAppAlertsEnabled ? "ON" : "OFF"}
                          onChange={e => setDraftSettings(prev => prev ? {...prev, notifications: {...prev.notifications, inAppAlertsEnabled: e.target.value === "ON"}} : null)}
                       >
                          <option value="ON">Enabled</option>
                          <option value="OFF">Disabled</option>
                       </Select>
                    </FormField>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-[12px] font-bold text-on-surface-variant uppercase border-b border-outline-variant pb-2 mb-4">Delivery Thresholds</h4>
                    <FormField label="Digest Frequency">
                       <Select 
                          value={renderData.notifications.digestFrequency}
                          onChange={e => setDraftSettings(prev => prev ? {...prev, notifications: {...prev.notifications, digestFrequency: e.target.value as "DAILY"|"WEEKLY"|"NEVER"}} : null)}
                       >
                          <option value="DAILY">Daily Digest</option>
                          <option value="WEEKLY">Weekly Rollup</option>
                          <option value="NEVER">Never / Realtime Only</option>
                       </Select>
                    </FormField>
                    <FormField label="Priority Threshold (Minimum to Alert)">
                       <Select 
                          value={renderData.notifications.priorityThreshold}
                          onChange={e => setDraftSettings(prev => prev ? {...prev, notifications: {...prev.notifications, priorityThreshold: e.target.value as NotificationPriorityThreshold}} : null)}
                       >
                          <option value="ALL">All Activity</option>
                          <option value="IMPORTANT">Important & Critical</option>
                          <option value="CRITICAL_ONLY">Critical Only</option>
                          <option value="NONE">Muted Completely</option>
                       </Select>
                    </FormField>
                  </div>
                </>
             )}

           </div>
        </Card>
      </section>

      {/* -------------------- SYSTEM BEHAVIORS -------------------- */}
      <section>
        <div className="flex items-center gap-2 mb-4">
           <span className="material-symbols-outlined text-on-surface-variant text-[20px]">lan</span>
           <h2 className="text-[14px] uppercase font-bold tracking-wider text-on-surface-variant">System Behaviors</h2>
        </div>
        <Card className="p-6 md:p-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {!isEditing ? (
                 <>
                   <div className="space-y-1">
                     <span className="block text-[11px] font-bold text-on-surface-variant uppercase">Timezone Rendering</span>
                     <p className="font-medium text-on-surface text-[14.5px]">{renderData.system.defaultTimezone}</p>
                   </div>
                   <div className="space-y-1">
                     <span className="block text-[11px] font-bold text-on-surface-variant uppercase">Auto-Delegation Routing</span>
                     <p className="font-medium text-on-surface flex items-center gap-2 text-[14.5px]">
                       {renderData.system.enableAutoDelegationRouting ? (
                          <><span className="w-2 h-2 rounded-full bg-success"></span> Enabled</>
                       ) : (
                          <><span className="w-2 h-2 rounded-full bg-outline"></span> Disabled</>
                       )}
                     </p>
                   </div>
                   <div className="space-y-1 md:col-span-2 mt-2">
                     <span className="block text-[11px] font-bold text-on-surface-variant uppercase">AI Intelligence Aggressiveness</span>
                     <p className="font-medium text-on-surface text-[14.5px]">{renderData.system.intelligenceAggressiveness}</p>
                     <p className="text-[13px] text-on-surface-variant mt-1.5 max-w-[600px]">Controls how proactive the system is at generating read-only intelligence signals across operational modules regarding risks and required actions.</p>
                   </div>
                 </>
              ) : (
                 <>
                   <FormField label="Timezone Rendering">
                     <Select 
                        value={renderData.system.defaultTimezone}
                        onChange={e => setDraftSettings(prev => prev ? {...prev, system: {...prev.system, defaultTimezone: e.target.value}} : null)}
                     >
                        <option value="America/New_York">America/New_York (EST)</option>
                        <option value="America/Chicago">America/Chicago (CST)</option>
                        <option value="America/Denver">America/Denver (MST)</option>
                        <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                        <option value="Europe/London">Europe/London (GMT)</option>
                        <option value="UTC">Coordinated Universal Time (UTC)</option>
                     </Select>
                   </FormField>
                   <FormField label="Auto-Delegation Routing">
                     <Select 
                        value={renderData.system.enableAutoDelegationRouting ? "ON" : "OFF"}
                        onChange={e => setDraftSettings(prev => prev ? {...prev, system: {...prev.system, enableAutoDelegationRouting: e.target.value === "ON"}} : null)}
                     >
                        <option value="ON">Enabled - Enact automated task handoffs</option>
                        <option value="OFF">Disabled - Strictly manual task routing</option>
                     </Select>
                   </FormField>
                   <div className="md:col-span-2">
                     <FormField label="AI Intelligence Aggressiveness">
                       <Select 
                          value={renderData.system.intelligenceAggressiveness}
                          onChange={e => setDraftSettings(prev => prev ? {...prev, system: {...prev.system, intelligenceAggressiveness: e.target.value as "CONSERVATIVE"|"BALANCED"|"PROACTIVE"}} : null)}
                       >
                          <option value="CONSERVATIVE">CONSERVATIVE - Only critical risk flags generated</option>
                          <option value="BALANCED">BALANCED - Standard recommendations and context signals</option>
                          <option value="PROACTIVE">PROACTIVE - Aggressively identifies pipeline optimizations</option>
                       </Select>
                     </FormField>
                   </div>
                 </>
              )}
           </div>
        </Card>
      </section>

    </div>
  );
}
