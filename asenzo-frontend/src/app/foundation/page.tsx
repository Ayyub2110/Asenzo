"use client";

import React, { useState } from "react";
import { getFoundation, updateFoundation } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

import { Skeleton, CardSkeleton } from "@/components/ui/States";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";

export default function FoundationPage() {
  const { data, setData, localData, setLocalData, loading, error, reload: loadData } = useAdapter(getFoundation);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  function handleCancel() {
    setLocalData(data); // revert to canonical explicitly
    setIsEditing(false);
  }

  async function handleSave() {
    if (!localData) return;
    setIsSaving(true);
    try {
      const res = await updateFoundation(localData);
      setData(res);
      setLocalData(res);
      setIsEditing(false);
    } catch (err: unknown) {
      alert("Failed to save. " + (err instanceof Error ? err.message : ""));
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-10 max-w-[1440px] mx-auto w-full space-y-8 animate-in fade-in duration-300">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-48 mb-8" />
        <CardSkeleton />
        <div className="mt-8">
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error || !data || !localData) {
    return (
      <div className="p-10 max-w-[1440px] mx-auto w-full space-y-8">
        <Alert variant="danger" title="Load Error">
          {error || "Foundation context could not be loaded."}
          <div className="mt-4">
            <Button variant="secondary" size="sm" onClick={loadData}>Retry</Button>
          </div>
        </Alert>
      </div>
    );
  }

  const handleDNAChange = (field: keyof typeof localData.coreDna, value: string) => {
    setLocalData((prev) => prev ? { ...prev, coreDna: { ...prev.coreDna, [field]: value } } : prev);
  };
  const handleICPChange = (field: keyof typeof localData.icp, value: string | string[]) => {
    setLocalData((prev) => prev ? { ...prev, icp: { ...prev.icp, [field]: value } } : prev);
  };
  const handleOfferChange = (field: keyof typeof localData.offer, value: string | string[]) => {
    setLocalData((prev) => prev ? { ...prev, offer: { ...prev.offer, [field]: value } } : prev);
  };
  const handleBrandVoiceChange = (field: keyof typeof localData.brandVoice, value: string | string[]) => {
    setLocalData((prev) => prev ? { ...prev, brandVoice: { ...prev.brandVoice, [field]: value } } : prev);
  };
  const handleFounderVoiceChange = (field: keyof typeof localData.founderVoice, value: string | string[] | boolean) => {
    setLocalData((prev) => prev ? { ...prev, founderVoice: { ...prev.founderVoice, [field]: value } } : prev);
  };

  return (
    <div className="flex-1 p-container-padding max-w-[1440px] mx-auto w-full flex flex-col lg:flex-row gap-card-gap">
      <div className="flex-1 flex flex-col space-y-card-gap">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
          <div>
            <h3 className="font-headline-md-lg text-display-lg text-on-surface tracking-tight">Foundation DNA</h3>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">Configure the core parameters driving your Growth OS.</p>
          </div>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={handleCancel}
                disabled={isSaving}
                className="inline-flex items-center justify-center px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl font-headline-sm text-headline-sm text-on-surface shadow-sm hover:bg-surface-container-low transition-colors gap-2"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center justify-center px-4 py-2 bg-primary text-on-primary border border-outline-variant rounded-xl font-headline-sm text-headline-sm shadow-sm hover:bg-primary/90 transition-colors gap-2"
              >
                Save Context
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center justify-center px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl font-headline-sm text-headline-sm text-on-surface shadow-sm hover:bg-surface-container-low transition-colors gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">edit_note</span>
              Edit Context
            </button>
          )}
        </div>

        <section className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] border border-outline-variant/10">
          <h4 className="font-headline-sm text-headline-sm text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">fingerprint</span>
            Core DNA
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant block">Business Name</label>
              <input 
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary transition-colors" 
                type="text" 
                readOnly={!isEditing}
                value={localData.coreDna.businessName}
                onChange={(e) => handleDNAChange('businessName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant block">Business Model</label>
              <input 
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary transition-colors appearance-none"
                value={localData.coreDna.businessModel}
                readOnly={!isEditing}
                onChange={(e) => handleDNAChange('businessModel', e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant block">Core Description</label>
              <textarea 
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary transition-colors resize-none" 
                rows={2}
                readOnly={!isEditing}
                value={localData.coreDna.businessDescription}
                onChange={(e) => handleDNAChange('businessDescription', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant block">Primary Problem Solved</label>
              <input 
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary transition-colors" 
                type="text" 
                readOnly={!isEditing}
                value={localData.coreDna.coreProblemSolved}
                onChange={(e) => handleDNAChange('coreProblemSolved', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant block">Primary Transformation</label>
              <input 
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary transition-colors" 
                type="text" 
                readOnly={!isEditing}
                value={localData.coreDna.primaryTransformation}
                onChange={(e) => handleDNAChange('primaryTransformation', e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] border border-outline-variant/10">
          <h4 className="font-headline-sm text-headline-sm text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">group</span>
            Ideal Customer Profile (ICP)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant block">Profile Description</label>
              <textarea 
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary transition-colors resize-none" 
                rows={2}
                readOnly={!isEditing}
                value={localData.icp.description}
                onChange={(e) => handleICPChange('description', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant block">Target Industry</label>
              <input 
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary transition-colors" 
                type="text" 
                readOnly={!isEditing}
                value={localData.icp.industry}
                onChange={(e) => handleICPChange('industry', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant block">Key Disqualifiers</label>
              <input 
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary transition-colors" 
                type="text" 
                readOnly={!isEditing}
                value={localData.icp.disqualifiers.join(', ')}
                onChange={(e) => handleICPChange('disqualifiers', e.target.value.split(','))}
              />
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] border border-outline-variant/10">
          <h4 className="font-headline-sm text-headline-sm text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">view_in_ar</span>
            Offer Builder
          </h4>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant block">Core Deliverables</label>
              <div className="flex flex-wrap gap-2">
                {localData.offer.deliverables.map((item, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-surface-container border border-outline-variant/30 rounded-md font-body-sm text-body-sm text-on-surface flex items-center gap-1">
                        {item} {isEditing && <span className="material-symbols-outlined text-[14px] cursor-pointer hover:text-error">close</span>}
                    </span>
                ))}
                {isEditing && (
                    <button className="px-3 py-1.5 border border-dashed border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary transition-colors rounded-md font-body-sm text-body-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">add</span> Add Item
                    </button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant block">Proof Mechanism</label>
              <input 
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary transition-colors" 
                type="text" 
                readOnly={!isEditing}
                value={localData.offer.proof}
                onChange={(e) => handleOfferChange('proof', e.target.value)}
              />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-card-gap">
          <section className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] border border-outline-variant/10">
            <h4 className="font-headline-sm text-headline-sm text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">record_voice_over</span>
              Brand Voice
            </h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant block">Primary Tone</label>
                <input 
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                    value={localData.brandVoice.tone}
                    readOnly={!isEditing}
                    onChange={(e) => handleBrandVoiceChange('tone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant block">Constrained Words (Avoid)</label>
                <input 
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary transition-colors" 
                  type="text" 
                  readOnly={!isEditing}
                  value={localData.brandVoice.avoidWords.join(', ')}
                  onChange={(e) => handleBrandVoiceChange('avoidWords', e.target.value.split(','))}
                />
              </div>
            </div>
          </section>

          <section className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] border border-outline-variant/10">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person_check</span>
                Founder Voice
              </h4>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input 
                  checked={localData.founderVoice.configured} 
                  onChange={(e) => handleFounderVoiceChange('configured', e.target.checked)}
                  disabled={!isEditing}
                  className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-surface-container-lowest border-4 appearance-none cursor-pointer border-primary bg-primary right-0" 
                  id="toggle1" name="toggle" type="checkbox"
                />
                <label className="toggle-label block overflow-hidden h-5 rounded-full bg-primary cursor-pointer" htmlFor="toggle1"></label>
              </div>
            </div>
            <div className={`space-y-4 ${!localData.founderVoice.configured ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant block">Content Cadence</label>
                <input 
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary transition-colors" 
                  type="text" 
                  readOnly={!isEditing}
                  value={localData.founderVoice.cadence}
                  onChange={(e) => handleFounderVoiceChange('cadence', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant block">Common Expressions</label>
                <textarea 
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary transition-colors resize-none" 
                  rows={2}
                  readOnly={!isEditing}
                  value={localData.founderVoice.phrases.join(', ')}
                  onChange={(e) => handleFounderVoiceChange('phrases', e.target.value.split(','))}
                />
              </div>
            </div>
          </section>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-4 pt-4 pb-8">
            <button onClick={handleCancel} className="px-6 py-2.5 bg-surface-container-lowest border border-outline-variant/50 rounded-xl font-headline-sm text-headline-sm text-on-surface hover:bg-surface-container transition-colors shadow-sm">
                Cancel
            </button>
            <button onClick={handleSave} className="px-6 py-2.5 bg-primary rounded-xl font-headline-sm text-headline-sm text-on-primary hover:bg-primary/90 transition-colors shadow-md">
                Save DNA
            </button>
          </div>
        )}
      </div>

      <aside className="w-full lg:w-80 flex-shrink-0 flex flex-col space-y-card-gap">
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/10 sticky top-[88px]">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-headline-sm text-headline-sm text-on-surface">Data Readiness</h4>
            <span className="material-symbols-outlined text-on-surface-variant">info</span>
          </div>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                <circle className="stroke-surface-container-highest" cx="18" cy="18" fill="none" r="16" strokeWidth="3"></circle>
                <circle className="stroke-primary" cx="18" cy="18" fill="none" r="16" strokeDasharray="100 100" strokeDashoffset={100 - data.readiness.percentage} strokeWidth="3"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-headline-md-lg text-display-lg text-primary tracking-tight">{data.readiness.percentage}%</span>
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-4 text-center">System is {data.readiness.status.toLowerCase()} and awaiting final DNA inputs.</p>
          </div>
          
          <hr className="border-outline-variant/20 my-6" />
          
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className={`material-symbols-outlined text-[20px] mt-0.5 ${localData.coreDna.businessName ? 'text-primary' : 'text-outline-variant opacity-60'}`}>
                {localData.coreDna.businessName ? 'check_circle' : 'radio_button_unchecked'}
              </span>
              <div>
                <p className="font-headline-sm text-body-sm text-on-surface">Core DNA Defined</p>
                <p className="font-label-muted text-label-muted text-on-surface-variant mt-0.5">Basic parameters set.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className={`material-symbols-outlined text-[20px] mt-0.5 ${localData.icp.description ? 'text-primary' : 'text-outline-variant opacity-60'}`}>
                {localData.icp.description ? 'check_circle' : 'radio_button_unchecked'}
              </span>
              <div>
                <p className="font-headline-sm text-body-sm text-on-surface">ICP Mapped</p>
                <p className="font-label-muted text-label-muted text-on-surface-variant mt-0.5">Audience constraints locked.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className={`material-symbols-outlined text-[20px] mt-0.5 ${localData.offer.proof ? 'text-primary' : 'text-outline-variant opacity-60'}`}>
                {localData.offer.proof ? 'check_circle' : 'radio_button_unchecked'}
              </span>
              <div>
                <p className="font-headline-sm text-body-sm text-on-surface">Offer Architecture</p>
                <p className="font-label-muted text-label-muted text-on-surface-variant mt-0.5">Deliverables structured.</p>
              </div>
            </li>
            <li className={`flex items-start gap-3 ${!localData.founderVoice.configured ? 'opacity-60' : ''}`}>
              <span className={`material-symbols-outlined text-[20px] mt-0.5 ${localData.founderVoice.configured ? 'text-primary' : 'text-outline-variant'}`}>
                {localData.founderVoice.configured ? 'check_circle' : 'radio_button_unchecked'}
              </span>
              <div>
                <p className="font-headline-sm text-body-sm text-on-surface">Voice Calibration</p>
                <p className="font-label-muted text-label-muted text-on-surface-variant mt-0.5">{localData.founderVoice.configured ? 'Configured.' : 'Awaiting final founder input.'}</p>
              </div>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
