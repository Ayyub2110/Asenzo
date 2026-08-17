"use client";

import React, { useState, useEffect } from "react";
import { getFoundation, updateFoundation } from "@/lib/adapters";
import { FoundationData } from "@/lib/types";
import { useAdapter } from "@/hooks/useAdapter";

import { Card, CardTitle, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormField, Input, Textarea } from "@/components/ui/Forms";
import { Badge } from "@/components/ui/Badge";
import { Skeleton, CardSkeleton } from "@/components/ui/States";
import { Alert } from "@/components/ui/Alert";
import { Tabs } from "@/components/ui/Tabs";

export default function FoundationPage() {
  const { data, setData, localData, setLocalData, loading, error, reload: loadData } = useAdapter(getFoundation);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("core_dna");

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
      <div className="p-6 md:p-8 lg:p-12 max-w-[1240px] mx-auto animate-in fade-in duration-300">
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
      <div className="p-6 md:p-8 lg:p-12 max-w-[1240px] mx-auto">
        <Alert variant="danger" title="Load Error">
          {error || "Foundation context could not be loaded."}
          <div className="mt-4">
            <Button variant="secondary" size="sm" onClick={loadData}>Retry</Button>
          </div>
        </Alert>
      </div>
    );
  }

  // Value bindings for edit vs read
  const handleDNAChange = (field: keyof typeof localData.coreDna, value: string) => {
    setLocalData(prev => prev ? { ...prev, coreDna: { ...prev.coreDna, [field]: value } } : prev);
  };
  
  const handleICPChange = (field: keyof typeof localData.icp, value: string | string[]) => {
    setLocalData(prev => prev ? { ...prev, icp: { ...prev.icp, [field]: value } } : prev);
  };
  
  const handleOfferChange = (field: keyof typeof localData.offer, value: string | string[]) => {
    setLocalData(prev => prev ? { ...prev, offer: { ...prev.offer, [field]: value } } : prev);
  };

  const handleBrandVoiceChange = (field: keyof typeof localData.brandVoice, value: string | string[]) => {
    setLocalData(prev => prev ? { ...prev, brandVoice: { ...prev.brandVoice, [field]: value } } : prev);
  };

  const handleFounderVoiceChange = (field: keyof typeof localData.founderVoice, value: string | string[] | boolean) => {
    setLocalData(prev => prev ? { ...prev, founderVoice: { ...prev.founderVoice, [field]: value } } : prev);
  };

  const tabs = [
    { id: "core_dna", label: "Core DNA" },
    { id: "icp", label: "ICP" },
    { id: "offer", label: "Offer Builder" },
    { id: "brand_voice", label: "Brand Voice" },
    { id: "founder_voice", label: "Founder Voice" }
  ];

  const readinessStatusColor = 
    data.readiness.percentage >= 90 ? "success" :
    data.readiness.percentage >= 50 ? "primary" : "warning";

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-[1240px] mx-auto">
      
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl lg:text-[40px] font-display font-bold text-on-surface tracking-tight leading-tight uppercase relative">
            Foundation
          </h1>
          <h2 className="text-xl font-display font-semibold text-on-surface-variant mt-2 tracking-tight">Business Truth</h2>
          <p className="text-on-surface-variant text-[14.5px] mt-1.5 font-medium max-w-2xl leading-relaxed">
            The canonical source of truth defining your business model, positioning, audience, and voice. ASENZO requires this context to operate intelligently without your intervention.
          </p>
        </div>
        
        {/* READINESS INDICATOR */}
        <Card variant="outlined" className="min-w-[280px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-medium text-[13px] text-on-surface-variant tracking-widest uppercase">Data Readiness</h3>
            <Badge variant={readinessStatusColor} size="sm">{data.readiness.status}</Badge>
          </div>
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="font-display font-bold text-3xl tracking-tighter text-on-surface">{data.readiness.percentage}%</span>
            <span className="text-sm font-medium text-on-surface-variant">Complete</span>
          </div>
          {data.readiness.missingItems.length > 0 && (
            <div className="text-[12px] text-on-surface-variant font-medium mt-2 pt-3 border-t border-outline-variant">
              <span className="text-error uppercase tracking-wider block mb-1.5">Action Needed:</span>
              <ul className="list-disc pl-4 space-y-1">
                {data.readiness.missingItems.map((item, idx) => (
                  <li key={idx} className="mb-1 leading-snug">{item}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </header>

      {/* EDITING CONTROLS */}
      <div className="flex items-center justify-between py-4 border-b border-outline-variant mb-6 min-h-[64px]">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <Button variant="ghost" onClick={handleCancel} disabled={isSaving}>Cancel</Button>
              <Button variant="primary" onClick={handleSave} isLoading={isSaving}>Save Context</Button>
            </>
          ) : (
            <Button variant="secondary" onClick={() => setIsEditing(true)}>Edit Configuration</Button>
          )}
        </div>
      </div>

      {/* TAB PANELS */}
      <div className="animate-in fade-in duration-300">
        
        {activeTab === "core_dna" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Identity</CardTitle>
              </CardHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <FormField label="Business Name">
                  <Input 
                    value={localData.coreDna.businessName} 
                    onChange={(e) => handleDNAChange("businessName", e.target.value)}
                    readOnly={!isEditing}
                  />
                </FormField>
                <FormField label="Business Model">
                  <Input 
                    value={localData.coreDna.businessModel} 
                    onChange={(e) => handleDNAChange("businessModel", e.target.value)}
                    readOnly={!isEditing}
                  />
                </FormField>
                <div className="md:col-span-2">
                  <FormField label="Business Description">
                    <Textarea 
                      value={localData.coreDna.businessDescription} 
                      onChange={(e) => handleDNAChange("businessDescription", e.target.value)}
                      readOnly={!isEditing}
                      rows={3}
                    />
                  </FormField>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Positioning</CardTitle>
              </CardHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <FormField label="Core Problem Solved">
                  <Textarea 
                    value={localData.coreDna.coreProblemSolved} 
                    onChange={(e) => handleDNAChange("coreProblemSolved", e.target.value)}
                    readOnly={!isEditing}
                  />
                </FormField>
                <FormField label="Primary Transformation">
                  <Textarea 
                    value={localData.coreDna.primaryTransformation} 
                    onChange={(e) => handleDNAChange("primaryTransformation", e.target.value)}
                    readOnly={!isEditing}
                  />
                </FormField>
                <FormField label="Contextual Differentiation">
                  <Textarea 
                    value={localData.coreDna.differentiation} 
                    onChange={(e) => handleDNAChange("differentiation", e.target.value)}
                    readOnly={!isEditing}
                  />
                </FormField>
                <FormField label="Market Positioning">
                  <Textarea 
                    value={localData.coreDna.positioning} 
                    onChange={(e) => handleDNAChange("positioning", e.target.value)}
                    readOnly={!isEditing}
                  />
                </FormField>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "icp" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ideal Customer Profile</CardTitle>
              </CardHeader>
              <div className="grid grid-cols-1 gap-6 mt-4">
                <FormField label="Profile Description">
                  <Textarea 
                    value={localData.icp.description} 
                    onChange={(e) => handleICPChange("description", e.target.value)}
                    readOnly={!isEditing}
                    rows={2}
                  />
                </FormField>
                <FormField label="Target Industry & Context">
                  <Input 
                    value={localData.icp.industry} 
                    onChange={(e) => handleICPChange("industry", e.target.value)}
                    readOnly={!isEditing}
                  />
                </FormField>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Active Pain Points (One per line)">
                    <Textarea 
                      value={localData.icp.painPoints.join("\n")} 
                      onChange={(e) => handleICPChange("painPoints", e.target.value.split("\n"))}
                      readOnly={!isEditing}
                      rows={4}
                    />
                  </FormField>
                  <FormField label="Desired Outcomes (One per line)">
                    <Textarea 
                      value={localData.icp.desiredOutcomes.join("\n")} 
                      onChange={(e) => handleICPChange("desiredOutcomes", e.target.value.split("\n"))}
                      readOnly={!isEditing}
                      rows={4}
                    />
                  </FormField>
                </div>
                <div className="border border-error/20 bg-[#FEF2F2] p-4 rounded-xl mt-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-error" />
                  <FormField label="Operational Disqualifiers" className="text-error uppercase tracking-wider text-[11px] font-bold">
                    <Textarea 
                      value={localData.icp.disqualifiers.join("\n")} 
                      onChange={(e) => handleICPChange("disqualifiers", e.target.value.split("\n"))}
                      readOnly={!isEditing}
                      rows={3}
                    />
                  </FormField>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "offer" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Offer Architecture</CardTitle>
              </CardHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="md:col-span-2">
                  <FormField label="Offer Overview">
                    <Input 
                      value={localData.offer.overview} 
                      onChange={(e) => handleOfferChange("overview", e.target.value)}
                      readOnly={!isEditing}
                    />
                  </FormField>
                </div>
                <FormField label="The Problem">
                  <Textarea 
                    value={localData.offer.problem} 
                    onChange={(e) => handleOfferChange("problem", e.target.value)}
                    readOnly={!isEditing}
                  />
                </FormField>
                <FormField label="The Transformation">
                  <Textarea 
                    value={localData.offer.transformation} 
                    onChange={(e) => handleOfferChange("transformation", e.target.value)}
                    readOnly={!isEditing}
                  />
                </FormField>
                <div className="md:col-span-2">
                  <FormField label="Core Deliverables (One per line)">
                    <Textarea 
                      value={localData.offer.deliverables.join("\n")} 
                      onChange={(e) => handleOfferChange("deliverables", e.target.value.split("\n"))}
                      readOnly={!isEditing}
                      rows={3}
                    />
                  </FormField>
                </div>
                <div className="md:col-span-2 bg-surface p-4 border border-outline-variant rounded-xl">
                  <FormField label="Proof & Evidence Mechanism">
                    <Textarea 
                      value={localData.offer.proof} 
                      onChange={(e) => handleOfferChange("proof", e.target.value)}
                      readOnly={!isEditing}
                    />
                  </FormField>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "brand_voice" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Brand Identity</CardTitle>
                <p className="text-[13px] text-on-surface-variant mt-1 max-w-2xl">
                  How the business communicates strategically to the market. Used contextually for generic market collateral.
                </p>
              </CardHeader>
              <div className="grid grid-cols-1 gap-6 mt-4">
                <FormField label="Core Tone">
                  <Textarea 
                    value={localData.brandVoice.tone} 
                    onChange={(e) => handleBrandVoiceChange("tone", e.target.value)}
                    readOnly={!isEditing}
                    rows={2}
                  />
                </FormField>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Brand Terminology (One per line)">
                    <Textarea 
                      value={localData.brandVoice.terminology.join("\n")} 
                      onChange={(e) => handleBrandVoiceChange("terminology", e.target.value.split("\n"))}
                      readOnly={!isEditing}
                      rows={4}
                    />
                  </FormField>
                  <div className="border border-error/20 bg-[#FEF2F2] p-4 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-error" />
                    <FormField label="Constrained Words (Do Not Use)" className="text-error uppercase tracking-wider text-[11px] font-bold">
                      <Textarea 
                        value={localData.brandVoice.avoidWords.join("\n")} 
                        onChange={(e) => handleBrandVoiceChange("avoidWords", e.target.value.split("\n"))}
                        readOnly={!isEditing}
                        rows={4}
                      />
                    </FormField>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "founder_voice" && (
          <div className="space-y-6">
            {!localData.founderVoice.configured && !isEditing ? (
              <Alert variant="warning" title="Founder Voice Unconfigured">
                Your personal communication cadence is not mapped. System intelligence will fall back to general Brand Voice for content generation. Edit configuration to establish your baseline.
              </Alert>
            ) : null}

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Founder Voice</CardTitle>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-[13px] font-bold text-on-surface">Configured Active</span>
                    <input 
                      type="checkbox" 
                      className="accent-primary w-4 h-4 cursor-pointer"
                      checked={localData.founderVoice.configured}
                      onChange={(e) => handleFounderVoiceChange("configured", e.target.checked)}
                      disabled={!isEditing}
                    />
                  </label>
                </div>
                <p className="text-[13px] text-on-surface-variant mt-1 max-w-2xl">
                  Your distinct personal writing pattern. Crucial for authentic Attention generation.
                </p>
              </CardHeader>
              
              <div className={`grid grid-cols-1 gap-6 mt-4 ${!localData.founderVoice.configured ? 'opacity-50 pointer-events-none' : ''}`}>
                <FormField label="Writing Cadence & Personality">
                  <Textarea 
                    value={localData.founderVoice.cadence} 
                    onChange={(e) => handleFounderVoiceChange("cadence", e.target.value)}
                    readOnly={!isEditing}
                    rows={2}
                  />
                </FormField>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Common Expressions (One per line)">
                    <Textarea 
                      value={localData.founderVoice.phrases.join("\n")} 
                      onChange={(e) => handleFounderVoiceChange("phrases", e.target.value.split("\n"))}
                      readOnly={!isEditing}
                      rows={4}
                    />
                  </FormField>
                  <div className="border border-error/20 bg-[#FEF2F2] p-4 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-error" />
                    <FormField label="Uncharacteristic Phrases (Never say)" className="text-error uppercase tracking-wider text-[11px] font-bold">
                      <Textarea 
                        value={localData.founderVoice.neverSay.join("\n")} 
                        onChange={(e) => handleFounderVoiceChange("neverSay", e.target.value.split("\n"))}
                        readOnly={!isEditing}
                        rows={4}
                      />
                    </FormField>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-outline-variant">
                  <h4 className="text-sm font-semibold text-on-surface mb-2">Information Ingestion (Mock Boundary)</h4>
                  <p className="text-[12px] text-on-surface-variant font-medium mb-3">
                    In the future, this interface will allow uploading raw email strings or audio transcripts to train the founder voice logic. Currently restricted in this tier.
                  </p>
                  <Button variant="secondary" size="sm" disabled>Upload Training Data (Coming Soon)</Button>
                </div>
              </div>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
