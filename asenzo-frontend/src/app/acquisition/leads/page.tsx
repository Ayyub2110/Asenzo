"use client";

import React, { useEffect, useState } from "react";
import { 
  getLeads, qualifyLead, getQualification, 
  getAttributionJourney, getIntentSignals, 
  getLeadEvents, createHandoff, completeHandoff, 
  getConversation, startConversation, addMessage 
} from "@/lib/adapters/acquisition";
import { Lead, AcquisitionQualification, LeadEvent, AttributionEvent, IntentSignal, Conversation } from "@/lib/types";

export default function AcquisitionLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // detail state
  const [qual, setQual] = useState<AcquisitionQualification | undefined>(undefined);
  const [events, setEvents] = useState<LeadEvent[]>([]);
  const [attr, setAttr] = useState<AttributionEvent[]>([]);
  const [signals, setSignals] = useState<IntentSignal[]>([]);
  const [conv, setConv] = useState<Conversation | undefined>(undefined);
  
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");

  const load = async () => {
    setLoading(true);
    setLeads(await getLeads());
    setLoading(false);
  };
  
  useEffect(() => { load(); }, []);

  const openLead = async (lead: Lead) => {
    setSelectedLead(lead);
    const [q, e, a, s, c] = await Promise.all([
      getQualification(lead.id),
      getLeadEvents(lead.id),
      getAttributionJourney(lead.id),
      getIntentSignals(lead.id),
      getConversation(lead.id)
    ]);
    setQual(q);
    setEvents(e);
    setAttr(a);
    setSignals(s);
    setConv(c);
  };

  const handleQualify = async (state: 'QUALIFIED' | 'UNQUALIFIED') => {
    if (!selectedLead) return;
    await qualifyLead({ leadId: selectedLead.id, state, icpFit: 'HIGH', problemFit: 'HIGH', urgency: 'HIGH' });
    await openLead(selectedLead);
    load();
  };

  const handleStartConversation = async () => {
    if (!selectedLead) return;
    await startConversation({ leadId: selectedLead.id, channel: "Email", initialMessage: "Hi, I'd like to learn more.", sender: "LEAD" });
    await openLead(selectedLead);
    load();
  };

  const handleSendReply = async () => {
    if (!selectedLead || !replyText.trim()) return;
    await addMessage(selectedLead.id, replyText, "USER");
    setReplyText("");
    await openLead(selectedLead);
  };

  const handleHandoff = async () => {
    if (!selectedLead) return;
    const handoff = await createHandoff({ leadId: selectedLead.id, notes: "Ready for conversion" });
    
    // Auto-complete handoff for demonstration to Opportunity id
    // Ordinarily you would create an opportunity in the Conversion pipeline here
    await completeHandoff(handoff.id, `opp_${Date.now()}`);
    
    await openLead(selectedLead);
    load();
  };

  return (
    <div className="flex h-[calc(100vh-140px)]">
      {/* Left panel: Lead List */}
      <div className="w-1/3 border-r border-border overflow-y-auto bg-background/50">
        <div className="p-4 border-b border-border bg-card/50 sticky top-0 backdrop-blur z-10 flex justify-between items-center">
            <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">All Leads ({leads.length})</h2>
        </div>
        <div className="flex flex-col">
          {leads.length === 0 && !loading && (
            <p className="p-4 text-[13px] text-muted-foreground italic text-center">No leads available.</p>
          )}
          {leads.map(l => (
            <div 
              key={l.id} 
              onClick={() => openLead(l)}
              className={`p-4 border-b border-border cursor-pointer transition-colors ${selectedLead?.id === l.id ? 'bg-muted' : 'hover:bg-muted/50'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-[14px] font-bold text-foreground">{l.name}</span>
                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${l.status === 'QUALIFIED' || l.status.includes('HANDOFF') ? 'bg-success/20 text-success' : 'bg-secondary text-muted-foreground'}`}>{l.status}</span>
              </div>
              <div className="text-[12px] text-muted-foreground flex gap-3">
                 <span>{l.company}</span>
                 <span>Events: {l.latestTouchAt ? l.latestTouchAt.slice(0, 10) : 'Never'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel: Lead Detail */}
      <div className="flex-1 overflow-y-auto bg-background relative flex flex-col">
        {!selectedLead ? (
          <div className="m-auto text-center text-muted-foreground flex flex-col items-center">
            <span className="material-symbols-outlined text-[48px] mb-4 opacity-50">person_search</span>
            <p className="text-[14px] font-medium">Select a lead to view details.</p>
          </div>
        ) : (
          <div className="p-6 md:p-10 flex-1 max-w-4xl mx-auto w-full">
            <div className="flex justify-between items-start mb-8 pb-6 border-b border-border">
               <div>
                  <h1 className="text-[28px] font-bold text-foreground">{selectedLead.name}</h1>
                  <p className="text-[14px] text-muted-foreground">{selectedLead.role} at {selectedLead.company} • {selectedLead.email}</p>
               </div>
               
               <div className="flex gap-2">
                 {selectedLead.status !== 'HANDED_OFF' && (
                   <button onClick={() => handleQualify(qual?.state === 'QUALIFIED' ? 'UNQUALIFIED' : 'QUALIFIED')} className="border border-border text-foreground px-4 py-2 rounded-[6px] text-[13px] font-semibold hover:bg-muted transition">
                     {qual?.state === 'QUALIFIED' ? 'Unqualify' : 'Qualify Lead'}
                   </button>
                 )}
                 {qual?.state === 'QUALIFIED' && selectedLead.status !== 'HANDED_OFF' && selectedLead.status !== 'READY_FOR_HANDOFF' && (
                    <button onClick={handleHandoff} className="bg-foreground text-background px-4 py-2 rounded-[6px] text-[13px] font-semibold hover:bg-foreground/90 transition">
                      Mark Ready for Handoff
                    </button>
                 )}
                 {selectedLead.status === 'HANDED_OFF' && (
                    <span className="bg-success text-success-foreground px-4 py-2 rounded-[6px] text-[13px] font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span> Handed Off to Conversion
                    </span>
                 )}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
               {/* Left Column */}
               <div className="flex flex-col gap-6">
                 
                 <section className="bg-card border border-border p-5 rounded-[12px]">
                   <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Qualification (Foundation ICP)</h3>
                   {qual ? (
                     <div className="grid grid-cols-2 gap-y-4 text-[13px]">
                       <div><span className="text-muted-foreground">ICP Fit:</span> <span className="font-bold">{qual.icpFit}</span></div>
                       <div><span className="text-muted-foreground">Problem Fit:</span> <span className="font-bold">{qual.problemFit}</span></div>
                       <div><span className="text-muted-foreground">Urgency:</span> <span className="font-bold">{qual.urgency}</span></div>
                       <div><span className="text-muted-foreground">State:</span> <span className="font-bold text-cyan">{qual.state}</span></div>
                     </div>
                   ) : (
                     <p className="text-[13px] text-muted-foreground italic">Not yet qualified.</p>
                   )}
                 </section>

                 <section className="bg-card border border-border p-5 rounded-[12px]">
                   <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Attribution Journey</h3>
                   <div className="flex flex-col gap-3">
                     {attr.length === 0 ? <p className="text-[13px] text-muted-foreground italic">Unknown attribution</p> : attr.map(a => (
                       <div key={a.id} className="text-[12px]">
                         <span className="font-bold text-foreground mr-2">{a.type}</span>
                         <span className="text-muted-foreground">via CTA: {a.ctaId || 'Unknown'} • Conf: {a.confidence}</span>
                       </div>
                     ))}
                   </div>
                 </section>
                 
               </div>

               {/* Right Column */}
               <div className="flex flex-col gap-6">
                 
                 <section className="bg-card border border-border p-5 rounded-[12px]">
                   <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Intent Signals</h3>
                   <div className="flex flex-col gap-2">
                     {signals.length === 0 ? <p className="text-[13px] text-muted-foreground italic">No specific intent signals.</p> : signals.map(s => (
                       <div key={s.id} className="flex justify-between items-center text-[13px]">
                          <span className="font-medium">{s.type}</span>
                          <span className="font-bold text-tertiary">Score: {s.score}</span>
                       </div>
                     ))}
                   </div>
                 </section>

                 <section className="bg-card border border-border p-5 rounded-[12px] flex flex-col h-full max-h-[400px]">
                   <div className="flex justify-between items-center mb-4">
                     <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Conversation</h3>
                     {!conv && <button onClick={handleStartConversation} className="text-[11px] font-bold text-foreground border border-border px-2 py-1 rounded">START</button>}
                   </div>
                   
                   <div className="flex-1 overflow-y-auto flex flex-col gap-3 mb-4">
                     {conv ? conv.messages.map((m, i) => (
                       <div key={m.id} className={`p-3 text-[13px] rounded-[8px] max-w-[80%] ${m.sender === 'USER' || m.sender === 'SYSTEM' ? 'bg-secondary text-foreground self-end' : 'bg-muted/50 border border-border/50 text-foreground self-start'}`}>
                         <span className="text-[10px] font-bold opacity-50 uppercase tracking-wider block mb-1">{m.sender}</span>
                         {m.text}
                       </div>
                     )) : <p className="text-[13px] text-muted-foreground italic m-auto">No conversation history.</p>}
                   </div>

                   {conv && (
                     <div className="flex gap-2 mt-auto">
                       <input 
                          type="text" 
                          value={replyText} 
                          onChange={(e) => setReplyText(e.target.value)} 
                          onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                          className="flex-1 bg-background border border-border px-3 py-2 rounded-[6px] text-[13px]" 
                          placeholder="Type reply..." 
                       />
                       <button onClick={handleSendReply} className="bg-foreground text-background px-3 rounded-[6px] font-bold text-[18px]">
                         <span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span>
                       </button>
                     </div>
                   )}
                 </section>

               </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
