"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ContentProductionItem, ProductionStage } from "@/lib/types";

const STAGES: ProductionStage[] = [
  "IDEA", "BRIEF", "SCRIPT", "FOUNDER REVIEW", "APPROVED", 
  "RECORDING", "EDITING", "FINAL REVIEW", "SCHEDULED", "PUBLISHED"
];

export default function AcquisitionProductionPage() {
  const [items, setItems] = useState<ContentProductionItem[]>([]);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  useEffect(() => {
    const prodStr = localStorage.getItem("asenzo_production_items");
    if (prodStr) {
      setItems(JSON.parse(prodStr));
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
    localStorage.setItem("asenzo_production_items", JSON.stringify(updatedItems));
    setDraggedItemId(null);
  };

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1500px] mx-auto w-full h-[calc(100vh-64px)] flex flex-col">
      <div className="flex justify-between items-start mb-6 shrink-0">
        <div>
          <h2 className="text-[20px] font-bold text-foreground">Production Center</h2>
          <p className="text-[14px] text-muted-foreground mt-1">Track asset creation from brief to published via drag-and-drop.</p>
        </div>
        <Link href="/acquisition/strategy">
          <button className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-[6px] text-[13px] font-bold hover:bg-foreground/90 transition-colors">
            <span className="material-symbols-outlined text-[16px]">library_add</span>
            Idea Library
          </button>
        </Link>
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
                    className="group p-4 bg-card border border-border shadow-sm rounded-[8px] cursor-grab active:cursor-grabbing hover:border-foreground/30 transition-colors relative"
                  >
                     {/* Drag Handle Indicator */}
                     <div className="absolute top-4 right-3 opacity-0 group-hover:opacity-100 text-muted-foreground transition-opacity">
                        <span className="material-symbols-outlined text-[14px]">drag_indicator</span>
                     </div>
                     
                     <div className="flex justify-between items-center mb-2">
                       <span className="text-[10px] uppercase font-bold bg-muted/60 text-foreground px-2 py-0.5 rounded tracking-widest">
                         {item.format}
                       </span>
                     </div>
                     
                     <h4 className="text-[13px] font-bold text-foreground leading-snug mb-3 pr-4">{item.title}</h4>
                     
                     <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold tracking-widest uppercase pt-2 border-t border-border/50">
                       <span className="flex items-center gap-1">
                         <span className="material-symbols-outlined text-[12px]">podcasts</span>
                         {item.channel}
                       </span>
                       
                       {/* Action Links */}
                       {item.ideaId && (
                         <Link href={`/acquisition/strategy/${item.ideaId}`} onDragStart={e => e.preventDefault()}>
                            <span className="text-tertiary hover:underline cursor-pointer">View Idea</span>
                         </Link>
                       )}
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
