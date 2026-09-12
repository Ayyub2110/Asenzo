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

import { Skeleton, CardSkeleton } from "@/components/ui/States";
import { Alert } from "@/components/ui/Alert";
import { useAdapter } from "@/hooks/useAdapter";
import { useConversionOS } from "@/contexts/ConversionOSContext";
import { useRevenueOS } from "@/contexts/RevenueOSContext";

export default function SettingsWorkspace() {
  const { setData, localData, setLocalData, loading, error, reload: loadData } = useAdapter(getSettings);
  
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // OS Contexts for Dev Data
  const { seedDemoData: seedConversion, resetDemoData: resetConversion } = useConversionOS();
  const { seedDemoData: seedRevenue, resetDemoData: resetRevenue } = useRevenueOS();

  const handleSeedData = () => {
      seedConversion();
      seedRevenue();
      alert("Realistic Demo Data seeded successfully across Conversion and Revenue OS.");
  };

  const handleResetData = () => {
      resetConversion();
      resetRevenue();
      alert("Demo Data erased.");
  };

  // Nav state
  const [activeTab, setActiveTab] = useState<"Profile" | "Notifications" | "System">("Profile");

  // Edit Buffer
  const [isEditing, setIsEditing] = useState(false);
  const [draftSettings, setDraftSettings] = useState<SettingsData | null>(null);

  function handleEdit() {
    if (!localData) return;
    setMutationError(null);
    setDraftSettings(JSON.parse(JSON.stringify(localData))); 
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
      <div className="p-container-padding max-w-[1440px] mx-auto space-y-8 animate-in fade-in duration-500 flex h-[calc(100vh-80px)]">
        <div className="w-[280px]">
            <Skeleton className="h-8 w-48 mb-6" />
            <Skeleton className="h-12 w-full mb-2" />
            <Skeleton className="h-12 w-full mb-2" />
            <Skeleton className="h-12 w-full" />
        </div>
        <div className="flex-1 max-w-4xl space-y-6">
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
              <button className="bg-primary text-white px-4 py-2 rounded-lg" onClick={loadData}>Retry Connection</button>
            </div>
          </Alert>
        </section>
      </div>
    );
  }

  const renderData = isEditing && draftSettings ? draftSettings : localData;



  return (
    <>


      <div className="flex-1 overflow-y-auto p-container-padding pt-8 flex flex-col lg:flex-row gap-card-gap max-w-[1440px] mx-auto pb-32">
        
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-[280px] flex-shrink-0">
            <h2 className="font-headline-sm text-headline-sm mb-6 px-4 text-primary">Configuration</h2>
            <nav className="flex flex-col gap-2">
                {[
                    {label: "Operator Profile", id: "Profile"},
                    {label: "Notifications", id: "Notifications"},
                    {label: "System Behaviors", id: "System"}
                ].map(item => {
                    const isActive = activeTab === item.id;
                    if (isActive) {
                        return (
                            <button 
                                key={item.id}
                                className="px-4 py-3 rounded-xl font-body-sm text-body-sm text-on-surface font-semibold bg-surface-container-low border border-outline-variant/30 flex justify-between items-center relative overflow-hidden transition-all shadow-sm w-full text-left"
                            >
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl"></div>
                                {item.label}
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </button>
                        )
                    }
                    return (
                        <button 
                            key={item.id}
                            onClick={() => { setActiveTab(item.id as "Profile" | "Notifications" | "System"); setIsEditing(false); }}
                            className="px-4 py-3 rounded-xl font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50 transition-colors flex justify-between items-center w-full text-left"
                        >
                            {item.label}
                        </button>
                    )
                })}
            </nav>

            <div className="mt-8 px-4">
                <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 ambient-shadow">
                    <h4 className="text-[11px] font-bold text-on-surface-variant uppercase mb-2">Diagnostics</h4>
                    <p className="text-[13px] text-on-surface-variant leading-relaxed">
                        {localData.intelligenceSignal || "All systems operating optimally. No manual intervention required."}
                    </p>
                </div>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 max-w-4xl">
            {mutationError && (
                <Alert variant="danger" title="Persistence Failure" className="mb-6">
                {mutationError}
                </Alert>
            )}

            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="font-display-lg text-display-lg text-primary mb-2">
                        {activeTab === "Profile" && "Operations Profile"}
                        {activeTab === "Notifications" && "Notification Architecture"}
                        {activeTab === "System" && "System Behaviors"}
                    </h1>
                    <p className="font-body-lg text-body-lg text-secondary">
                        {activeTab === "Profile" && "Configure global application boundaries and operations identity."}
                        {activeTab === "Notifications" && "Direct alert routing, priority thresholds, and signal delivery."}
                        {activeTab === "System" && "Establish environment rendering and automation protocols."}
                    </p>
                </div>
                
                <div className="flex gap-3">
                    {!isEditing ? (
                        <button 
                            onClick={handleEdit} 
                            className="bg-surface-container text-on-surface font-body-sm font-medium px-4 py-2 rounded-lg border border-outline-variant/50 hover:bg-surface-container-high transition-colors"
                        >
                            Edit Configuration
                        </button>
                    ) : (
                        <>
                            <button 
                                onClick={handleCancelEdit} disabled={isSaving}
                                className="bg-surface-container text-on-surface font-body-sm font-medium px-4 py-2 rounded-lg border border-outline-variant/50 hover:bg-surface-container-high transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveSettings} disabled={isSaving}
                                className="bg-primary text-white font-body-sm font-medium px-6 py-2 rounded-lg shadow-sm border border-primary hover:bg-primary-dark transition-colors flex items-center justify-center min-w-[120px]"
                            >
                                {isSaving ? "Saving..." : "Save Edits"}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Content Switcher */}
            {activeTab === "Profile" && (
                <div className="bg-surface-container-lowest rounded-2xl p-8 mb-8 border border-outline-variant/30 ambient-shadow">
                    <h3 className="font-headline-sm text-headline-sm text-primary mb-6 border-b border-outline-variant/20 pb-4">Identity Specification</h3>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">DISPLAY NAME</label>
                            {isEditing ? (
                                <input 
                                    className="w-full bg-white border border-outline-variant/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow text-on-surface font-body-lg text-body-lg" 
                                    type="text" 
                                    value={renderData.profile.displayName} 
                                    onChange={e => setDraftSettings(prev => prev ? {...prev, profile: {...prev.profile, displayName: e.target.value}} : null)}
                                />
                            ) : (
                                <div className="font-body-lg text-body-lg text-on-surface font-medium border border-transparent px-4 py-3">{renderData.profile.displayName}</div>
                            )}
                        </div>
                        <div>
                            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">ROLE / TITLE</label>
                            {isEditing ? (
                                <input 
                                    className="w-full bg-white border border-outline-variant/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow text-on-surface font-body-lg text-body-lg" 
                                    type="text" 
                                    value={renderData.profile.role}
                                    onChange={e => setDraftSettings(prev => prev ? {...prev, profile: {...prev.profile, role: e.target.value}} : null)}
                                />
                            ) : (
                                <div className="font-body-lg text-body-lg text-on-surface font-medium border border-transparent px-4 py-3">{renderData.profile.role}</div>
                            )}
                        </div>
                        <div>
                            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">EMAIL CONTACT</label>
                            {isEditing ? (
                                <input 
                                    className="w-full bg-white border border-outline-variant/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow text-on-surface font-body-lg text-body-lg" 
                                    type="email" 
                                    value={renderData.profile.email}
                                    onChange={e => setDraftSettings(prev => prev ? {...prev, profile: {...prev.profile, email: e.target.value}} : null)}
                                />
                            ) : (
                                <div className="font-body-lg text-body-lg text-on-surface font-medium border border-transparent px-4 py-3">{renderData.profile.email}</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "Notifications" && (
                <>
                <div className="bg-surface-container-lowest rounded-2xl p-8 mb-8 border border-outline-variant/30 ambient-shadow">
                    <h3 className="font-headline-sm text-headline-sm text-primary mb-6 border-b border-outline-variant/20 pb-4">Channels</h3>
                    
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
                            <div>
                                <h4 className="font-body-lg text-body-lg text-on-surface font-medium">Email Alerts</h4>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">Critical state changes pushed to external inbox.</p>
                            </div>
                            <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                                <input 
                                    disabled={!isEditing}
                                    type="checkbox" id="emailAlerts" 
                                    checked={renderData.notifications.emailAlertsEnabled}
                                    onChange={e => setDraftSettings(prev => prev ? {...prev, notifications: {...prev.notifications, emailAlertsEnabled: e.target.checked}} : null)}
                                    className={`absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none z-10 transition-transform duration-300 ease-in-out ${renderData.notifications.emailAlertsEnabled ? 'transform translate-x-6 border-success' : 'border-outline-variant'} ${isEditing? 'cursor-pointer' : 'opacity-80'}`}
                                />
                                <label htmlFor="emailAlerts" className={`block overflow-hidden h-6 rounded-full transition-colors duration-300 ease-in-out ${renderData.notifications.emailAlertsEnabled ? 'bg-success' : 'bg-surface-variant bg-surface-variant'} ${isEditing? 'cursor-pointer' : ''}`}></label>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
                            <div>
                                <h4 className="font-body-lg text-body-lg text-on-surface font-medium">In-App Indicators</h4>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">Global navigation badges and toast alerts.</p>
                            </div>
                            <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                                <input 
                                    disabled={!isEditing}
                                    type="checkbox" id="inAppAlerts" 
                                    checked={renderData.notifications.inAppAlertsEnabled}
                                    onChange={e => setDraftSettings(prev => prev ? {...prev, notifications: {...prev.notifications, inAppAlertsEnabled: e.target.checked}} : null)}
                                    className={`absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none z-10 transition-transform duration-300 ease-in-out ${renderData.notifications.inAppAlertsEnabled ? 'transform translate-x-6 border-success' : 'border-outline-variant'} ${isEditing? 'cursor-pointer' : 'opacity-80'}`}
                                />
                                <label htmlFor="inAppAlerts" className={`block overflow-hidden h-6 rounded-full transition-colors duration-300 ease-in-out ${renderData.notifications.inAppAlertsEnabled ? 'bg-success' : 'bg-surface-variant bg-surface-variant'} ${isEditing? 'cursor-pointer' : ''}`}></label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-surface-container-lowest rounded-2xl p-8 mb-8 border border-outline-variant/30 ambient-shadow">
                    <h3 className="font-headline-sm text-headline-sm text-primary mb-6 border-b border-outline-variant/20 pb-4">Delivery Thresholds</h3>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">DIGEST FREQUENCY</label>
                            {isEditing ? (
                                <select 
                                    className="w-full bg-white border border-outline-variant/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow text-on-surface font-body-lg text-body-lg" 
                                    value={renderData.notifications.digestFrequency}
                                    onChange={e => setDraftSettings(prev => prev ? {...prev, notifications: {...prev.notifications, digestFrequency: e.target.value as "DAILY" | "WEEKLY" | "NEVER"}} : null)}
                                >
                                    <option value="DAILY">Daily Digest</option>
                                    <option value="WEEKLY">Weekly Rollup</option>
                                    <option value="NEVER">Never / Realtime Only</option>
                                </select>
                            ) : (
                                <div className="font-body-lg text-body-lg text-on-surface font-medium border border-transparent px-4 py-3">{renderData.notifications.digestFrequency}</div>
                            )}
                        </div>
                        <div>
                            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">PRIORITY THRESHOLD</label>
                            {isEditing ? (
                                <select 
                                    className="w-full bg-white border border-outline-variant/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow text-on-surface font-body-lg text-body-lg" 
                                    value={renderData.notifications.priorityThreshold}
                                    onChange={e => setDraftSettings(prev => prev ? {...prev, notifications: {...prev.notifications, priorityThreshold: e.target.value as NotificationPriorityThreshold}} : null)}
                                >
                                    <option value="ALL">All Activity</option>
                                    <option value="IMPORTANT">Important & Critical</option>
                                    <option value="CRITICAL_ONLY">Critical Only</option>
                                    <option value="NONE">Muted Completely</option>
                                </select>
                            ) : (
                                <div className="font-body-lg text-body-lg text-on-surface font-medium border border-transparent px-4 py-3">{renderData.notifications.priorityThreshold.replace("_", " ")}</div>
                            )}
                        </div>
                    </div>
                </div>
                </>
            )}

            {activeTab === "System" && (
              <>
                <div className="bg-surface-container-lowest rounded-2xl p-8 mb-8 border border-outline-variant/30 ambient-shadow">
                    <h3 className="font-headline-sm text-headline-sm text-primary mb-6 border-b border-outline-variant/20 pb-4">Global Parameters</h3>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">RENDER TIMEZONE</label>
                            {isEditing ? (
                                <select 
                                    className="w-full bg-white border border-outline-variant/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow text-on-surface font-body-lg text-body-lg" 
                                    value={renderData.system.defaultTimezone}
                                    onChange={e => setDraftSettings(prev => prev ? {...prev, system: {...prev.system, defaultTimezone: e.target.value}} : null)}
                                >
                                    <option value="America/New_York">America/New_York (EST)</option>
                                    <option value="America/Chicago">America/Chicago (CST)</option>
                                    <option value="America/Denver">America/Denver (MST)</option>
                                    <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                                    <option value="Europe/London">Europe/London (GMT)</option>
                                    <option value="UTC">Coordinated Universal Time (UTC)</option>
                                </select>
                            ) : (
                                <div className="font-body-lg text-body-lg text-on-surface font-medium border border-transparent px-4 py-3">{renderData.system.defaultTimezone}</div>
                            )}
                        </div>

                        <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
                            <div>
                                <h4 className="font-body-lg text-body-lg text-on-surface font-medium">Auto-Delegation Routing</h4>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">Enact automated task handoffs without manual approval.</p>
                            </div>
                            <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                                <input 
                                    disabled={!isEditing}
                                    type="checkbox" id="autoDelegation" 
                                    checked={renderData.system.enableAutoDelegationRouting}
                                    onChange={e => setDraftSettings(prev => prev ? {...prev, system: {...prev.system, enableAutoDelegationRouting: e.target.checked}} : null)}
                                    className={`absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none z-10 transition-transform duration-300 ease-in-out ${renderData.system.enableAutoDelegationRouting ? 'transform translate-x-6 border-primary' : 'border-outline-variant'} ${isEditing? 'cursor-pointer' : 'opacity-80'}`}
                                />
                                <label htmlFor="autoDelegation" className={`block overflow-hidden h-6 rounded-full transition-colors duration-300 ease-in-out ${renderData.system.enableAutoDelegationRouting ? 'bg-primary' : 'bg-surface-variant bg-surface-variant'} ${isEditing? 'cursor-pointer' : ''}`}></label>
                            </div>
                        </div>

                        <div>
                            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">INTELLIGENCE AGGRESSIVENESS</label>
                            {isEditing ? (
                                <select 
                                    className="w-full bg-white border border-outline-variant/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow text-on-surface font-body-lg text-body-lg" 
                                    value={renderData.system.intelligenceAggressiveness}
                                    onChange={e => setDraftSettings(prev => prev ? {...prev, system: {...prev.system, intelligenceAggressiveness: e.target.value as "CONSERVATIVE" | "BALANCED" | "PROACTIVE"}} : null)}
                                >
                                    <option value="CONSERVATIVE">Conservative</option>
                                    <option value="BALANCED">Balanced</option>
                                    <option value="PROACTIVE">Proactive</option>
                                </select>
                            ) : (
                                <div className="font-body-lg text-body-lg text-on-surface font-medium border border-transparent px-4 py-3">{renderData.system.intelligenceAggressiveness}</div>
                            )}
                            <p className="text-[13px] text-on-surface-variant px-4 mt-1">Controls how proactive the system is at generating read-only intelligence signals across operational modules.</p>
                        </div>
                    </div>
                </div>
                
                {/* DEV DATA CONTROLS */}
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-8 mb-8 relative">
                    <div className="absolute top-0 right-0 bg-slate-100 text-slate-500 text-[9px] font-extrabold px-3 py-1 uppercase rounded-bl-xl">Dev Only</div>
                    <h3 className="font-headline-sm text-headline-sm text-slate-800 mb-2">Development Data Setup</h3>
                    <p className="font-body-sm text-sm text-slate-500 mb-6">Use these controls to safely seed realistic end-to-end OS data into local memory or reset back to production defaults.</p>
                    
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleSeedData}
                            className="bg-emerald-600 text-white font-bold text-[12px] px-6 py-2.5 rounded-xl shadow-sm hover:bg-emerald-700 transition-colors"
                        >
                            Seed Realistic Dataset
                        </button>
                        <button 
                            onClick={handleResetData}
                            className="bg-white border border-slate-300 text-slate-700 font-bold text-[12px] px-6 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            Purge Seed Data
                        </button>
                    </div>
                </div>
              </>
            )}

        </div>
      </div>

    </>
  );
}
