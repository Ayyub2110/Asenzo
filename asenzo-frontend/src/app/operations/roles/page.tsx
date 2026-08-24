"use client";
import React from "react";
import { getOperations } from "@/lib/adapters";
import { useAdapter } from "@/hooks/useAdapter";

export default function RolesPage() {
  const { localData, loading, error } = useAdapter(getOperations);

  if (loading) return <div className="p-10 animate-pulse h-96 w-full bg-muted/20 rounded-[16px]" />;
  if (error || !localData) return <div className="p-10">Error loading Roles.</div>;

  return (
    <div className="p-6 md:p-10 pb-32">
      <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-6">Roles & Ownership Map</h2>
      
      <div className="bg-card border border-border p-8 rounded-[16px] shadow-sm mb-8 text-center text-[14px]">
        <span className="material-symbols-outlined text-[32px] text-muted-foreground mb-4">account_tree</span>
        <h3 className="font-bold text-foreground mb-2">Responsibility Mapping</h3>
        <p className="text-muted-foreground">This capability visualizes RACI models across cross-center functional workflows, protecting Founder bottlenecks.</p>
      </div>
    </div>
  );
}
