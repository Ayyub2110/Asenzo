"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function DemoReadOnlyBanner() {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (!user?.isDemo || dismissed) {
    return null;
  }

  return (
    <div className="w-full bg-amber-500/10 border-b border-amber-500/20 px-6 py-2 flex items-center justify-between text-xs text-amber-200 shrink-0 relative z-50 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-[16px] text-amber-400">visibility</span>
        <span className="font-semibold text-amber-300">Read-Only Demo Mode:</span>
        <span className="text-amber-200/90">
          You are logged in as a test demo account. Database writing operations are disabled for demo safety.
        </span>
      </div>

      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="text-amber-400 hover:text-amber-100 transition-colors p-1 rounded hover:bg-amber-500/20"
        title="Dismiss notice"
      >
        <span className="material-symbols-outlined text-[14px]">close</span>
      </button>
    </div>
  );
}
