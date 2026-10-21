"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Mic, MicOff, Sparkles, Volume2, X, Send, Bot, Compass, Zap } from "lucide-react";

export default function FloatingAIVoiceOrb() {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiReply, setAiReply] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const [micBlocked, setMicBlocked] = useState(false);

  const recognitionRef = useRef<any>(null);

  // Setup Web Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "hi-IN"; // Supports Hindi & Hinglish/English

        recognition.onstart = () => {
          setIsListening(true);
          setMicBlocked(false);
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          setIsListening(false);
          if (event.error === "not-allowed" || event.error === "service-not-allowed") {
            setMicBlocked(true);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        setMicBlocked(true);
      }
    }
  }, []);

  // When speech recognition ends and we have transcript, send to AI automatically
  useEffect(() => {
    if (!isListening && transcript && transcript.trim().length > 1) {
      handleAskAI(transcript);
    }
  }, [isListening]);

  const startListening = () => {
    setAiReply(null);
    setTranscript("");
    setIsOpen(true);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        // Already started
      }
    } else {
      setMicBlocked(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleAskAI = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsLoading(true);
    setAiReply(null);

    try {
      const res = await fetch("/api/ai/voice-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryText, route: pathname })
      });

      const data = await res.json();
      const reply = data.reply || "Done";
      setAiReply(reply);

      // Voice synthesis (Speech aloud)
      speakAloud(reply);

      // If navigation requested
      if (data.navigateTo && data.navigateTo !== pathname) {
        setTimeout(() => {
          router.push(data.navigateTo);
        }, 1200);
      }
    } catch (err) {
      console.error("AI Error:", err);
      setAiReply("Error connecting to AI Brain. Please check internet or API Key.");
    } finally {
      setIsLoading(false);
    }
  };

  const speakAloud = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "hi-IN";
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    setTranscript(textInput);
    handleAskAI(textInput);
    setTextInput("");
  };

  const quickPrompts = [
    { label: "📊 Today's Revenue", q: "Aaj ka kitna revenue aur payment pending hai?" },
    { label: "👥 Recent Leads", q: "Mujhe latest leads aur unka status batao" },
    { label: "📁 Open Pipeline", q: "Open sales pipeline and deals" },
    { label: "💼 Pending Invoices", q: "Kitne pending invoices hain?" }
  ];

  return (
    <>
      {/* 3D Glowing Orb Floating Button (Fixed at Bottom-Right) */}
      <div className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 flex items-center gap-3">
        {/* Floating Tooltip / Status Badge */}
        {!isOpen && (
          <div
            onClick={startListening}
            className="hidden sm:flex items-center gap-2 bg-gray-900/90 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur cursor-pointer hover:bg-black transition-all border border-white/10"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: "6s" }} />
            <span>Apex AI Brain · Ask anything</span>
          </div>
        )}

        {/* The Animated Siri / Gemini 3D Orb */}
        <div className="relative group cursor-pointer" onClick={() => (isOpen ? setIsOpen(false) : startListening())}>
          {/* Pulsing Outer Rings */}
          <div
            className={`absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-pink-500 opacity-60 blur-md transition-all duration-700 ${
              isListening || isSpeaking ? "animate-pulse scale-125 opacity-90" : "group-hover:scale-110 group-hover:opacity-80"
            }`}
          />

          {/* Glowing Glass Sphere */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl flex items-center justify-center p-1 bg-gradient-to-tr from-[#1a1c3d] via-[#2d2260] to-[#0c1836] border border-white/30 backdrop-blur-xl overflow-hidden transition-transform active:scale-95">
            {/* Liquid Glow Inner Shimmer */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.8),rgba(147,51,234,0.5),rgba(236,72,153,0.3))] animate-spin" style={{ animationDuration: "10s" }} />

            {/* Center Dynamic Icon */}
            <div className="relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center shadow-inner border border-white/20">
              {isListening ? (
                <Mic className="w-5 h-5 text-cyan-300 animate-bounce" />
              ) : isSpeaking ? (
                <Volume2 className="w-5 h-5 text-pink-300 animate-pulse" />
              ) : (
                <Bot className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modern Frosted Glass AI Modal Dialog */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-7 w-[92vw] sm:w-[420px] max-h-[80vh] bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-200/80 dark:border-gray-800 z-50 flex flex-col overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-pink-50/50 dark:from-gray-800/50 dark:to-gray-900/50">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  Apex AI Voice Brain
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700 font-bold">Online</span>
                </h4>
                <p className="text-[10px] text-gray-500 flex items-center gap-1">
                  <Compass className="w-2.5 h-2.5" /> Page: <code className="font-mono text-indigo-600 dark:text-indigo-400">{pathname}</code>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-white/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Conversation Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[160px] max-h-[340px]">
            {micBlocked && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl text-xs text-amber-800 dark:text-amber-300">
                ⚠️ <strong>Microphone Notice:</strong> Please allow mic permissions in your browser address bar to use voice, or type your question below!
              </div>
            )}

            {/* Listening Wave Indicator */}
            {isListening && (
              <div className="p-4 bg-indigo-50/80 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 flex flex-col items-center justify-center gap-2 text-center">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-6 bg-cyan-500 rounded-full animate-pulse" />
                  <span className="w-2 h-10 bg-indigo-600 rounded-full animate-pulse delay-75" />
                  <span className="w-2 h-8 bg-purple-500 rounded-full animate-pulse delay-150" />
                  <span className="w-2 h-4 bg-pink-500 rounded-full animate-pulse delay-200" />
                </div>
                <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">
                  Listening... speak in Hindi or English
                </p>
                {transcript && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 italic">"{transcript}"</p>
                )}
              </div>
            )}

            {/* User transcript / query */}
            {transcript && !isListening && (
              <div className="flex justify-end">
                <div className="bg-indigo-600 text-white px-3.5 py-2 rounded-2xl rounded-tr-sm text-xs max-w-[85%] shadow-sm">
                  {transcript}
                </div>
              </div>
            )}

            {/* AI Thinking loader */}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-gray-500 p-2">
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <span>AI is analyzing live CRM database...</span>
              </div>
            )}

            {/* AI Reply Card */}
            {aiReply && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex-shrink-0 flex items-center justify-center text-white shadow-sm mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 rounded-2xl rounded-tl-sm text-xs leading-relaxed max-w-[85%] border border-gray-200/60 dark:border-gray-700 shadow-sm">
                  {aiReply}
                  {isSpeaking && (
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-pink-500 font-bold">
                      <Volume2 className="w-3 h-3 animate-pulse" /> Speaking response aloud...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Suggestion Chips */}
            {!isListening && !isLoading && !aiReply && (
              <div className="space-y-2 pt-2">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Quick Inquiries</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {quickPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setTranscript(p.q);
                        handleAskAI(p.q);
                      }}
                      className="text-left p-2 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-gray-100 dark:border-gray-800 text-[11px] font-semibold text-gray-700 dark:text-gray-300 transition-colors flex items-center justify-between group"
                    >
                      <span>{p.label}</span>
                      <Zap className="w-3 h-3 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action & Input Footer */}
          <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 space-y-2">
            <form onSubmit={handleFormSubmit} className="flex items-center gap-1.5">
              <input
                type="text"
                placeholder="Ask or command in Hindi/English..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />

              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`p-2 rounded-xl transition-all shadow-sm ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                }`}
                title={isListening ? "Stop Listening" : "Start Voice Input"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                type="submit"
                className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors shadow-sm"
                title="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
