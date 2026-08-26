"use client";

import React, { useState } from "react";

type StoryFrame = {
  id: string;
  type: string;
  desc: string;
};

type Sequence = {
  id: string;
  name: string;
  goal: string;
  funnel: string;
  frames: StoryFrame[];
};

const initialSequences: Sequence[] = [
  {
    id: "seq1",
    name: "Pattern Interrupt",
    goal: "Break attention and introduce insight",
    funnel: "TOF",
    frames: [
      { id: "f1", type: "Interrupt", desc: "Start with an unconventional hook." },
      { id: "f2", type: "Insight", desc: "Explain the counter-perspective." },
      { id: "f3", type: "Poll", desc: "Ask the audience what they think." }
    ]
  },
  {
    id: "seq2",
    name: "Objection Removal (Offer)",
    goal: "Handle price/time objections",
    funnel: "BOF",
    frames: [
      { id: "f1", type: "FAQ / Question Box", desc: "Share a screenshot of a real DM asking about pricing." },
      { id: "f2", type: "Belief Shift", desc: "Explain why cheap solutions actually cost more in lost velocity." },
      { id: "f3", type: "Risk Reversal (Offer)", desc: "Highlight the guarantee to remove purchase friction." },
      { id: "f4", type: "Direct CTA / Urgency", desc: "Link to Application. Mention limited capacity." }
    ]
  }
];

export default function AcquisitionStoriesPage() {
  const [sequences, setSequences] = useState<Sequence[]>(initialSequences);
  const [activeSeqId, setActiveSeqId] = useState<string>("seq2");
  const [showNewModal, setShowNewModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const activeSeq = sequences.find(s => s.id === activeSeqId);

  const handleCreateSequence = () => {
    const name = (document.getElementById('seqName') as HTMLInputElement).value || "New Sequence";
    const goal = (document.getElementById('seqGoal') as HTMLInputElement).value || "Goal";
    const funnel = (document.getElementById('seqFunnel') as HTMLSelectElement).value;

    // Auto-generate some empty frames based on requirements: Story 1-4 + CTA
    const newSeq: Sequence = {
      id: `seq_${Date.now()}`,
      name,
      goal,
      funnel,
      frames: [
        { id: `f_${Date.now()}_1`, type: "Story 1", desc: "" },
        { id: `f_${Date.now()}_2`, type: "Story 2", desc: "" },
        { id: `f_${Date.now()}_3`, type: "Story 3", desc: "" },
        { id: `f_${Date.now()}_4`, type: "Story 4", desc: "" },
        { id: `f_${Date.now()}_5`, type: "CTA", desc: "" }
      ]
    };

    setSequences([newSeq, ...sequences]);
    setActiveSeqId(newSeq.id);
    setIsEditing(true);
    setShowNewModal(false);
  };

  const updateFrameDesc = (frameId: string, text: string) => {
    const updated = sequences.map(s => {
      if (s.id !== activeSeqId) return s;
      return { ...s, frames: s.frames.map(f => f.id === frameId ? { ...f, desc: text } : f) };
    });
    setSequences(updated);
  };

  const updateFrameType = (frameId: string, text: string) => {
    const updated = sequences.map(s => {
      if (s.id !== activeSeqId) return s;
      return { ...s, frames: s.frames.map(f => f.id === frameId ? { ...f, type: text } : f) };
    });
    setSequences(updated);
  };

  const addFrame = () => {
    const updated = sequences.map(s => {
      if (s.id !== activeSeqId) return s;
      return { ...s, frames: [...s.frames, { id: `f_${Date.now()}`, type: "New Frame", desc: "" }] };
    });
    setSequences(updated);
  };

  const removeFrame = (frameId: string) => {
    const updated = sequences.map(s => {
      if (s.id !== activeSeqId) return s;
      return { ...s, frames: s.frames.filter(f => f.id !== frameId) };
    });
    setSequences(updated);
  };

  const moveFrame = (index: number, direction: -1 | 1) => {
    const updated = sequences.map(s => {
      if (s.id !== activeSeqId) return s;
      const newFrames = [...s.frames];
      if (index + direction < 0 || index + direction >= newFrames.length) return s;
      const temp = newFrames[index];
      newFrames[index] = newFrames[index + direction];
      newFrames[index + direction] = temp;
      return { ...s, frames: newFrames };
    });
    setSequences(updated);
  };

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1500px] mx-auto w-full pb-32">
      <div className="flex justify-between items-start mb-8 pb-6 border-b border-border/50">
        <div>
          <h2 className="text-[20px] font-bold text-foreground">Story Sequence Center</h2>
          <p className="text-[14px] text-muted-foreground mt-1">Design daily narrative arcs and interactive sequences.</p>
        </div>
        <button onClick={() => setShowNewModal(true)} className="bg-foreground text-background px-4 py-2.5 rounded-[6px] text-[12px] uppercase tracking-widest font-bold flex items-center gap-2 hover:bg-foreground/90 transition-colors">
          + New Sequence
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Templates / Saved Sequences */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Saved Sequences</h3>

          {sequences.map(seq => (
            <div
              key={seq.id}
              onClick={() => { setActiveSeqId(seq.id); setIsEditing(false); }}
              className={`p-5 border bg-card rounded-[12px] cursor-pointer transition-colors ${activeSeqId === seq.id ? 'border-foreground shadow-sm' : 'border-border hover:border-foreground/40'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-[14px] font-bold text-foreground truncate pl-1">{seq.name}</h4>
                <span className="text-[9px] uppercase tracking-widest bg-muted/50 px-2 py-0.5 rounded font-bold text-muted-foreground">{seq.funnel}</span>
              </div>
              <p className="text-[12px] text-muted-foreground mb-4 pl-1 line-clamp-1">{seq.goal}</p>
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex-wrap">
                {seq.frames.map((f, i) => (
                  <React.Fragment key={f.id}>
                    <span className="bg-background border border-border/50 px-1.5 py-0.5 rounded text-foreground max-w-[80px] truncate">{f.type}</span>
                    {i < seq.frames.length - 1 && <span className="opacity-50">→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Builder */}
        <div className="md:col-span-2 p-8 bg-card border border-border rounded-[12px] min-h-[600px] flex flex-col">
          {activeSeq ? (
            <>
              <div className="flex justify-between items-center mb-8 border-b border-border/50 pb-4">
                <div>
                  <h3 className="text-[16px] font-bold text-foreground">Sequence Builder: {activeSeq.name}</h3>
                  <p className="text-[13px] text-muted-foreground mt-1">Goal: {activeSeq.goal}</p>
                </div>
                <button onClick={() => setIsEditing(!isEditing)} className="px-4 py-2 text-[11px] font-bold text-foreground border border-border/50 rounded flex items-center gap-2 hover:bg-muted transition-colors">
                  <span className="material-symbols-outlined text-[14px]">{isEditing ? 'done' : 'edit'}</span> {isEditing ? 'Done Editing' : 'Edit Sequence'}
                </button>
              </div>

              <div className="flex flex-col gap-6 relative flex-1">
                <div className="absolute left-6 top-6 bottom-6 w-[2px] bg-border/80 z-0"></div>

                {activeSeq.frames.map((frame, i) => (
                  <div key={frame.id} className="relative z-10 flex gap-5 group">
                    <div className="w-12 h-12 bg-background border-2 border-border/80 rounded-full flex items-center justify-center font-bold text-[14px] text-foreground shrink-0 shadow-sm mt-1 bg-card">
                      {i + 1}
                    </div>
                    <div className="flex-1 bg-background border border-border p-5 rounded-[12px] group-hover:border-foreground/30 transition-colors shadow-sm">
                      {isEditing ? (
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between items-center gap-4">
                            <input
                              type="text"
                              value={frame.type}
                              onChange={(e) => updateFrameType(frame.id, e.target.value)}
                              className="text-[13px] font-bold text-foreground bg-transparent outline-none border-b border-border/50 focus:border-foreground py-1 w-full"
                              placeholder="Frame Type (e.g. FAQ, Insight, CTA)"
                            />
                            <div className="flex items-center gap-1 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => moveFrame(i, -1)} disabled={i === 0} className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:bg-muted rounded"><span className="material-symbols-outlined text-[14px]">arrow_upward</span></button>
                              <button onClick={() => moveFrame(i, 1)} disabled={i === activeSeq.frames.length - 1} className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:bg-muted rounded"><span className="material-symbols-outlined text-[14px]">arrow_downward</span></button>
                              <button onClick={() => removeFrame(frame.id)} className="w-6 h-6 flex items-center justify-center text-warning hover:bg-warning/10 rounded ml-1"><span className="material-symbols-outlined text-[14px]">delete</span></button>
                            </div>
                          </div>
                          <textarea
                            value={frame.desc}
                            onChange={(e) => updateFrameDesc(frame.id, e.target.value)}
                            className="w-full text-[13px] text-foreground bg-transparent outline-none resize-none h-16 border-b border-transparent focus:border-border/50"
                            placeholder="Describe the content of this frame..."
                          />
                        </div>
                      ) : (
                        <>
                          <h4 className="text-[14px] font-bold text-foreground mb-2">{frame.type || "Untitled Frame"}</h4>
                          <p className="text-[13px] text-muted-foreground whitespace-pre-wrap">{frame.desc || "No description provided."}</p>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {isEditing && (
                  <div className="relative z-10 flex gap-5">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-[14px] shrink-0 mt-1">
                    </div>
                    <button onClick={addFrame} className="flex-1 bg-transparent border-2 border-dashed border-border/80 text-muted-foreground font-bold text-[12px] uppercase tracking-widest p-4 rounded-[12px] hover:border-foreground/50 hover:text-foreground transition-colors flex justify-center items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">add</span> Add Frame
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <span className="material-symbols-outlined text-[32px] mb-4 opacity-50">web_stories</span>
              <p className="text-[14px] font-medium">Select or create a sequence to begin editing.</p>
            </div>
          )}
        </div>
      </div>

      {showNewModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-[12px] max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border/50 flex justify-between items-center bg-muted/10">
              <span className="text-[14px] font-bold text-foreground uppercase tracking-widest">Create New Sequence</span>
              <button onClick={() => setShowNewModal(false)} className="text-muted-foreground hover:text-foreground"><span className="material-symbols-outlined">close</span></button>
            </div>

            <div className="p-8 space-y-5">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Sequence Name</label>
                <input id="seqName" type="text" placeholder="e.g. Launch Sequence" className="w-full bg-background border border-border/50 rounded-[6px] p-3 text-[14px] outline-none" />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Sequence Goal</label>
                <input id="seqGoal" type="text" placeholder="e.g. Announce new mastermind" className="w-full bg-background border border-border/50 rounded-[6px] p-3 text-[14px] outline-none" />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Funnel Stage</label>
                <select id="seqFunnel" className="w-full bg-background border border-border/50 rounded-[6px] p-3 text-[14px] outline-none font-bold">
                  <option value="TOF">TOF (Reach & Attention)</option>
                  <option value="MOF">MOF (Trust & Nurture)</option>
                  <option value="BOF">BOF (Conversion)</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-border/50 flex justify-end gap-3 bg-muted/10">
              <button onClick={() => setShowNewModal(false)} className="px-5 py-2.5 text-[12px] font-bold text-muted-foreground hover:text-foreground">Cancel</button>
              <button onClick={handleCreateSequence} className="px-5 py-2.5 bg-foreground text-background text-[12px] font-bold uppercase tracking-widest rounded-[6px] hover:bg-foreground/90 transition-colors">Start Building</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
