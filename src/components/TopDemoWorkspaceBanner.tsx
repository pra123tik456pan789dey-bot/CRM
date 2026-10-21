"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, CheckCircle2, Shield, X, Eye } from "lucide-react";

export default function TopDemoWorkspaceBanner() {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("apex_demo_mode");
    if (saved === "true") {
      setIsDemoMode(true);
    }
  }, []);

  const toggleDemoMode = () => {
    const nextState = !isDemoMode;
    setIsDemoMode(nextState);
    localStorage.setItem("apex_demo_mode", String(nextState));
    // Trigger custom event or reload to update sample data state
    window.dispatchEvent(new Event("demo_mode_changed"));
  };

  if (dismissed && !isDemoMode) return null;

  return (
    <div className={`w-full px-4 py-1.5 text-xs font-semibold flex items-center justify-between transition-colors z-30 ${
      isDemoMode
        ? "bg-emerald-700 text-white shadow-sm"
        : "bg-slate-900 text-slate-200 border-b border-slate-800"
    }`}>
      <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap mx-auto sm:mx-0">
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isDemoMode ? "bg-emerald-300" : "bg-cyan-400"}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${isDemoMode ? "bg-white" : "bg-cyan-400"}`} />
        </span>
        <span className="text-[11px] sm:text-xs">
          {isDemoMode ? (
            <>
              <strong>Live demo workspace</strong> — sample company & dummy data active. Feel free to explore; it resets every night.
            </>
          ) : (
            <>
              <strong>Apex OS Workspace</strong> — Enterprise CRM & Agency Suite with Live AI Brain.
            </>
          )}
        </span>
      </div>

      <div className="hidden sm:flex items-center gap-3">
        <button
          onClick={toggleDemoMode}
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all flex items-center gap-1 ${
            isDemoMode
              ? "bg-white text-emerald-800 hover:bg-emerald-50"
              : "bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30"
          }`}
        >
          <Eye className="w-3 h-3" />
          <span>{isDemoMode ? "Exit Demo Mode" : "Switch to Demo Mode"}</span>
        </button>

        {!isDemoMode && (
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
