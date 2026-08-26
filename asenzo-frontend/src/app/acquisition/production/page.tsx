"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
// Assuming types exist or using local
type ProductionStage = "DRAFT" | "BRIEF" | "RECORDING" | "EDITING" | "FINAL REVIEW" | "SCHEDULED" | "PUBLISHED";
type ContentProductionItem = any;

const STAGES: ProductionStage[] = [
  "DRAFT", "BRIEF", "RECORDING", "EDITING", "FINAL REVIEW", "SCHEDULED", "PUBLISHED"
];

export default function AcquisitionProductionPage() {
  const [items, setItems] = useState<ContentProductionItem[]>([]);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  useEffect(() => {
    const prodStr = localStorage.getItem("asenzo_production_items_v3");
    if (prodStr) {
      setItems(JSON.parse(prodStr));
    } else {
      const defaultItems: any[] = [
        {
          id: "prod_1",
          ideaId: "1",
          workspaceId: "ws_1",
          title: "Consistency isn't your problem. Clarity is.",
          format: "Contrarian Reel",
          channel: "Instagram",
          stage: "DRAFT",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          pillar: "Founder Clarity",
          funnel: "MOF",
          script: "[Hook]\nStop posting 3 times a day...\n\n[Context]\nYou are shouting into the void...",
          objective: "Build Trust",
          cta: "DM for framework",
          requirements: "Vertical video, high energy, fast cuts.",
          notes: "Don't forget the B-roll overlay at 0:05.",
          performance: "N/A"
        },
        {
          id: "prod_2",
          title: "Why scaling before $20k/mo breaks agencies",
          format: "Story Carousel",
          channel: "LinkedIn",
          stage: "RECORDING",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          pillar: "Mistakes",
          funnel: "TOF",
          script: "Slide 1: Breaking your agency...\nSlide 2: The trap...",
          objective: "Reach",
          cta: "Save this post",
          requirements: "Text-based carousel.",
          notes: "Use brand colors only.",
          performance: "N/A"
        }
      ];
      setItems(defaultItems);
      localStorage.setItem("asenzo_production_items_v3", JSON.stringify(defaultItems));
    }
  }, []);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItemId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, newStage: ProductionStage) => {
    e.preventDefault();
    if (!draggedItemId) return;

    const updatedItems = items.map(item => {
      if (item.id === draggedItemId) {
        return { ...item, stage: newStage, updatedAt: new Date().toISOString() };
      }
      return item;
    });

    setItems(updatedItems);
    localStorage.setItem("asenzo_production_items_v3", JSON.stringify(updatedItems));
    setDraggedItemId(null);
  };

  const activeItem = items.find(i => i.id === activeItemId);

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1500px] mx-auto w-full h-[calc(100vh-64px)] flex flex-col">
      <div className="flex justify-between items-start mb-6 shrink-0">
        <div>
          <h2 className="text-[20px] font-bold text-foreground">Content Production</h2>
          <p className="text-[14px] text-muted-foreground mt-1">Track asset creation from approved draft to published via drag-and-drop.</p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-6 flex-1 h-full items-start">
        {STAGES.map(stage => {
          const stageItems = items.filter(i => i.stage === stage);

          return (
            <div
              key={stage}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage)}
              className="min-w-[280px] w-[280px] flex-shrink-0 bg-secondary/30 border border-secondary/50 rounded-[12px] p-4 flex flex-col max-h-[100%] overflow-hidden"
            >
              <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex justify-between items-center shrink-0">
                {stage} <span className="bg-muted px-2 py-0.5 rounded text-foreground">{stageItems.length}</span>
              </h3>

              <div className="flex flex-col gap-3 overflow-y-auto pr-1 hide-scrollbar h-full pb-10">
                {stageItems.length === 0 && (
                  <div className="border border-dashed border-border/50 text-muted-foreground/50 rounded-[8px] p-4 text-center text-[11px] font-bold uppercase tracking-widest pointer-events-none">
                    Drag cards here
                  </div>
                )}
                {stageItems.map(item => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    onClick={() => setActiveItemId(item.id)}
                    className="group p-4 bg-card border border-border shadow-sm rounded-[8px] cursor-grab active:cursor-grabbing hover:border-foreground/30 transition-colors relative"
                  >
                    <div className="absolute top-4 right-3 opacity-0 group-hover:opacity-100 text-muted-foreground transition-opacity">
                      <span className="material-symbols-outlined text-[14px]">drag_indicator</span>
                    </div>

                    <div className="flex justify-between items-center mb-2 gap-2">
                      <span className="text-[10px] uppercase font-bold bg-muted/60 text-foreground px-2 py-0.5 rounded tracking-widest truncate">
                        {item.format}
                      </span>
                      <div className="flex gap-1 shrink-0">
                        <span className="text-[9px] uppercase font-bold border border-border/50 text-muted-foreground px-1 py-0.5 rounded tracking-widest">{(item as any).funnel || "TOF"}</span>
                      </div>
                    </div>

                    <h4 className="text-[13px] font-bold text-foreground leading-snug mb-3 pr-4">{item.title}</h4>

                    <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold tracking-widest uppercase pt-2 border-t border-border/50">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">podcasts</span>
                        {item.channel}
                      </span>
                      <span className="flex items-center gap-1">
                        {item.pillar}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {activeItemId && activeItem && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-[500px] h-full bg-card border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right-8 duration-300">
            <div className="p-6 border-b border-border/50 flex justify-between items-center bg-muted/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Production Details</span>
              </div>
              <button onClick={() => setActiveItemId(null)} className="text-muted-foreground hover:text-foreground"><span className="material-symbols-outlined">close</span></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h2 className="text-[20px] font-bold text-foreground mb-4">{activeItem.title}</h2>
                <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest">
                  <span className="bg-foreground text-background px-2 py-1 rounded">{activeItem.stage}</span>
                  <span className="bg-muted/50 text-foreground px-2 py-1 rounded border border-border/50">{activeItem.funnel}</span>
                  <span className="bg-muted/50 text-foreground px-2 py-1 rounded border border-border/50">{activeItem.pillar}</span>
                  <span className="bg-muted/50 text-foreground px-2 py-1 rounded border border-border/50">{activeItem.format}</span>
                </div>
              </div>

              <div className="space-y-6 text-[13px]">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Content Objective</span>
                  <p className="font-medium text-foreground">{activeItem.objective}</p>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Call to Action (CTA)</span>
                  <p className="font-medium text-foreground">{activeItem.cta}</p>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Production Requirements</span>
                  <p className="font-medium text-foreground">{activeItem.requirements}</p>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Notes</span>
                  <p className="font-medium text-foreground">{activeItem.notes}</p>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Performance (If Published)</span>
                  <p className="font-medium text-foreground">{activeItem.performance}</p>
                </div>

                <div className="border border-border/50 rounded-[8px] overflow-hidden">
                  <div className="bg-muted/30 border-b border-border/50 p-3 flex justify-between items-center">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-foreground">Approved Script</span>
                    <button className="text-[11px] font-bold text-muted-foreground hover:text-foreground flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">content_copy</span> Copy</button>
                  </div>
                  <div className="p-4 bg-background text-[13px] whitespace-pre-wrap font-medium">
                    {activeItem.script}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
