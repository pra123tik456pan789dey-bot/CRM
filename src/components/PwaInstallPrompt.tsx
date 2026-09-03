"use client";

import { useEffect, useState } from "react";
import { Download, X, Smartphone, RefreshCw, Sparkles } from "lucide-react";

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // 1. PWA Install Prompt Listener
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 2. Service Worker & Version Auto-Update Listener
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
              }
            });
          }
        });
      });
    }

    // Periodic check for new app deployments
    const interval = setInterval(() => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistration().then((reg) => {
          if (reg) reg.update();
        });
      }
    }, 60000); // Check every 60s for updates

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      clearInterval(interval);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstallPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleApplyUpdate = () => {
    window.location.reload();
  };

  return (
    <>
      {/* 🚀 Auto-Update Notification Banner */}
      {updateAvailable && (
        <div className="fixed top-4 right-4 z-[100] max-w-md w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-2xl shadow-2xl border border-white/20 animate-bounce">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Sparkles className="h-5 w-5 text-yellow-300" />
              </div>
              <div>
                <h4 className="font-bold text-sm">New Update Available!</h4>
                <p className="text-xs text-indigo-100">Admin published new features. Click to update instantly.</p>
              </div>
            </div>

            <button
              onClick={handleApplyUpdate}
              className="px-3.5 py-1.5 bg-white text-indigo-700 hover:bg-indigo-50 text-xs font-bold rounded-lg shadow transition flex items-center gap-1.5 flex-shrink-0"
            >
              <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Update Now
            </button>
          </div>
        </div>
      )}

      {/* 📲 PWA Install Prompt Banner */}
      {showInstallPrompt && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl border border-indigo-500/30 shadow-2xl">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-indigo-600/40">
              <Smartphone className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-slate-100">Install Apex CRM App</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Install on your Android, iPhone, or PC home screen for 1-click access.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={handleInstallClick}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Install App</span>
                </button>
                <button
                  onClick={() => setShowInstallPrompt(false)}
                  className="px-2.5 py-1.5 text-slate-400 hover:text-slate-200 text-xs font-medium transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowInstallPrompt(false)}
              className="text-slate-400 hover:text-slate-200 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

