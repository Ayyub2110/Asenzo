"use client";

import React, { useState } from "react";
import Link from "next/link";

const FRAMEWORKS = [
  {
    id: "pampc",
    name: "Mechanism / Direct Conversion Framework",
    description: "Best for problem-aware audiences needing a clear mechanism and direct offer CTA.",
    structure: ["1. Problem (Name the core pain)", "2. Agitation (Why it gets worse)", "3. Mechanism (The new way)", "4. Proof (Case study or evidence)", "5. CTA (Direct destination)"]
  },
  {
    id: "story",
    name: "Story & Brand Authority Framework",
    description: "Best for founder personal brand, vulnerability, & narrative trust.",
    structure: ["1. Story Setup (Relatable situation)", "2. Conflict (The breaking point)", "3. Insight (The breakthrough)", "4. Lesson (Actionable takeaway)", "5. CTA (Soft invitation)"]
  },
  {
    id: "contrarian",
    name: "Contrarian & Pattern Disruptor Framework",
    description: "Best for viral hooks, pattern disruption, and reframing common industry beliefs.",
    structure: ["1. Contrarian Claim (Dismantle belief)", "2. Explanation (Why common belief is wrong)", "3. Evidence (Data/Examples)", "4. Reframe (The true perspective)", "5. CTA (Keyword opt-in)"]
  }
];

const SHORTLISTED_IDEAS = [
  {
    id: "idea1",
    title: "Why consistency without positioning clarity is just noise",
    awarenessStage: "Problem-aware",
    context: "Most founders post daily without getting inbound leads. The core issue is lack of positioning mechanism.",
    frameworkRecommended: "pampc"
  },
  {
    id: "idea2",
    title: "Client Acquisition Case Study — Problem-Aware to £34k MRR",
    awarenessStage: "Solution-aware",
    context: "Showcasing how a B2B agency scaled inbound pipeline using content-to-revenue tracking.",
    frameworkRecommended: "story"
  },
  {
    id: "idea3",
    title: "Stop chasing follower counts: 8-figure founders post fewer, high-proof assets",
    awarenessStage: "Unaware",
    context: "Contrarian view on vanity metrics vs high-ticket conversion mechanics.",
    frameworkRecommended: "contrarian"
  }
];

export default function ScriptsPage() {
  const [selectedFramework, setSelectedFramework] = useState(FRAMEWORKS[0]);
  const [selectedIdeaId, setSelectedIdeaId] = useState(SHORTLISTED_IDEAS[0].id);
  const [contextInput, setContextInput] = useState(SHORTLISTED_IDEAS[0].context);
  const [awarenessStage, setAwarenessStage] = useState(SHORTLISTED_IDEAS[0].awarenessStage);
  const [selectedHook, setSelectedHook] = useState("");
  const [generatedHooks, setGeneratedHooks] = useState<string[]>([]);
  const [scriptDraft, setScriptDraft] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const handleSelectIdea = (ideaId: string) => {
    setSelectedIdeaId(ideaId);
    const idea = SHORTLISTED_IDEAS.find((i) => i.id === ideaId);
    if (idea) {
      setContextInput(idea.context);
      setAwarenessStage(idea.awarenessStage);
      const fw = FRAMEWORKS.find((f) => f.id === idea.frameworkRecommended) || FRAMEWORKS[0];
      setSelectedFramework(fw);
    }
  };

  const handleGenerateScript = () => {
    setIsGenerating(true);
    setSendSuccess(false);

    setTimeout(() => {
      const hooks = [
        `"I post every single day and nobody buys" — why consistency isn't your problem.`,
        `If you don't know where your next 5 clients are coming from, your content is missing one critical mechanism.`,
        `We spent £15k on agencies and zero leads before fixing this single messaging flaw.`
      ];
      setGeneratedHooks(hooks);
      setSelectedHook(hooks[0]);

      let scriptText = "";
      if (selectedFramework.id === "pampc") {
        scriptText = `[HOOK]\n${hooks[0]}\n\n[PROBLEM]\nMost founders think the reason they aren't generating leads is because they aren't posting enough. So they grind out 5 posts a week.\n\n[AGITATION]\nBut consistency without positioning clarity is just noise. You end up exhausting yourself while attracting zero qualified buyers.\n\n[MECHANISM]\nThe real fix is an Inbound Acquisition Mechanism: connecting every post directly to your core offer and awareness stage.\n\n[PROOF]\nWhen we adjusted this single mechanism for our clients, lead quality increased by 3.4x without increasing posting frequency.\n\n[CTA]\nComment "MECHANISM" below and I'll send you the exact blueprint.`;
      } else if (selectedFramework.id === "story") {
        scriptText = `[HOOK]\n${hooks[0]}\n\n[STORY SETUP]\nTwo years ago, I was creating content every day. I was exhausted, burnt out, and looking at an empty pipeline.\n\n[CONFLICT]\nI hired agencies, tried cold DMs, tried everything. Nothing worked because I was trying to solve a volume problem with zero strategic clarity.\n\n[INSIGHT]\nThe breakthrough happened when I realized: Buyers don't buy content. They buy clarity on their problem.\n\n[LESSON]\nFocus 80% of your effort on messaging precision and 20% on production.\n\n[CTA]\nWant to see our founder content framework? Drop a comment below.`;
      } else {
        scriptText = `[HOOK]\n${hooks[0]}\n\n[CONTRARIAN CLAIM]\nPosting daily is actually destroying your positioning if your messaging isn't refined.\n\n[EXPLANATION]\nWhen you flood the market with generic education, buyers view you as a commodity teacher, not a high-ticket partner.\n\n[EVIDENCE]\nLook at top founders generating 8-figures: they post fewer, hyper-specific proof assets.\n\n[REFRAME]\nQuality and strategic positioning always beat raw volume in B2B acquisition.\n\n[CTA]\nRead the breakdown in our bio.`;
      }

      setScriptDraft(scriptText);
      setIsGenerating(false);
    }, 1200);
  };

  const handleSendToProduction = () => {
    setSendSuccess(true);
    setTimeout(() => setSendSuccess(false), 3000);
  };

  return (
    <div className="py-6 px-8 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-bold text-slate-900">Content Engine — Script Writing Workspace</h2>
          <p className="text-[12px] text-slate-500">Transform validated opportunities into founder-led scripts using framework structures and AI hook generation.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/acquisition/research" className="px-3 py-1.5 border border-slate-200 text-slate-700 text-[12px] font-semibold rounded-lg hover:bg-slate-50">
            ← Research Ideas
          </Link>
          <button
            onClick={handleSendToProduction}
            disabled={!scriptDraft}
            className="px-4 py-2 bg-slate-900 text-white text-[12px] font-bold rounded-lg hover:bg-slate-800 disabled:opacity-50 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">send</span>
            Send to Production
          </button>
        </div>
      </div>

      {sendSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-[12px] font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          Script approved and sent to Production Kanban (`/acquisition/content`)!
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="col-span-5 space-y-5">
          {/* Framework Selector */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">1. Select Framework</label>
            <div className="space-y-2">
              {FRAMEWORKS.map((fw) => (
                <button
                  key={fw.id}
                  onClick={() => setSelectedFramework(fw)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedFramework.id === fw.id
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="text-[12px] font-bold">{fw.name}</div>
                  <div className={`text-[11px] mt-0.5 ${selectedFramework.id === fw.id ? "text-slate-300" : "text-slate-500"}`}>{fw.description}</div>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Dynamic Script Structure</label>
              <div className="space-y-1">
                {selectedFramework.structure.map((step, idx) => (
                  <div key={idx} className="text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-100 font-medium">
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shortlisted Idea Selector */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">2. Select Shortlisted Idea</label>
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Choose Idea from Research / Ideas Queue</label>
              <select
                value={selectedIdeaId}
                onChange={(e) => handleSelectIdea(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] bg-white font-medium focus:outline-none focus:border-slate-400"
              >
                {SHORTLISTED_IDEAS.map((idea) => (
                  <option key={idea.id} value={idea.id}>
                    {idea.title} ({idea.awarenessStage})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Idea Strategy & Context</label>
              <textarea
                value={contextInput}
                onChange={(e) => setContextInput(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:border-slate-400 bg-slate-50/50"
                placeholder="Selected idea context..."
              />
            </div>

            <button
              onClick={handleGenerateScript}
              disabled={isGenerating}
              className="w-full py-2.5 bg-slate-900 text-white text-[12px] font-bold rounded-lg hover:bg-slate-800 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                  Executing Content Engine...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                  Generate Script & Hooks
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Script Editor */}
        <div className="col-span-7 space-y-5">
          {/* Hook Generator Output */}
          {generatedHooks.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">AI Generated Hooks</label>
                <span className="text-[11px] text-emerald-600 font-semibold">Auto-Selected Strongest</span>
              </div>
              <div className="space-y-2">
                {generatedHooks.map((h, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedHook(h)}
                    className={`w-full text-left p-3 rounded-lg border text-[12px] transition-all flex items-start gap-2 ${
                      selectedHook === h
                        ? "border-blue-500 bg-blue-50/50 text-slate-900 font-medium"
                        : "border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-[10px] font-bold text-slate-400 mt-0.5">{i + 1}.</span>
                    <span>{h}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Script Content */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Script Editor</label>
              <span className="text-[11px] text-slate-400 font-medium">Framework: {selectedFramework.name.split("→")[0]}</span>
            </div>

            <textarea
              value={scriptDraft}
              onChange={(e) => setScriptDraft(e.target.value)}
              rows={16}
              className="w-full p-4 border border-slate-200 rounded-lg text-[13px] font-mono leading-relaxed focus:outline-none focus:border-slate-400 bg-slate-50/50"
              placeholder="Script content will generate here based on the selected framework and hooks..."
            />

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
                Quality Score: <b className="text-slate-900">92/100</b> (Founder Voice & ICP Aligned)
              </div>
              <button
                onClick={() => setScriptDraft("")}
                className="text-[11px] text-slate-400 hover:text-slate-600 font-medium"
              >
                Clear Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
