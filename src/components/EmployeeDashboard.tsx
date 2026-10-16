"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  MessageCircle,
  Clock,
  Flame,
  CheckCircle2,
  Calendar,
  Send,
  X,
  ChevronRight,
  Search,
  Sparkles,
  PhoneCall,
  User,
  AlertCircle
} from "lucide-react";
import { updateLeadStatus, addLeadNote } from "@/app/actions/leadActions";

export default function EmployeeDashboard({ data }: { data: any }) {
  const user = data?.user || { name: "Sales Executive" };
  const stats = data?.stats || { totalAssigned: 0, wonCount: 0, reInquiryCount: 0, myCallsCount: 0 };
  const initialLeads: any[] = data?.myLeads || [];
  const pendingTasks: any[] = data?.myPendingTasks || [];
  const isFallback = data?.isFallback || false;

  const [search, setSearch] = useState("");
  const [tabFilter, setTabFilter] = useState<"ALL" | "RE_INQUIRY" | "NEW" | "WON">("ALL");
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [quickNote, setQuickNote] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [noteSuccess, setNoteSuccess] = useState(false);

  const filteredLeads = initialLeads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      (lead.phone && lead.phone.includes(search)) ||
      (lead.company_name && lead.company_name.toLowerCase().includes(search.toLowerCase()));

    const matchesTab =
      tabFilter === "ALL"
        ? true
        : tabFilter === "RE_INQUIRY"
        ? lead.inquiry_count && lead.inquiry_count > 1
        : tabFilter === "NEW"
        ? lead.status === "NEW"
        : lead.status === "WON";

    return matchesSearch && matchesTab;
  });

  const handleStatusUpdate = async (leadId: string, status: string) => {
    if (selectedLead) {
      setSelectedLead({ ...selectedLead, status });
    }
    await updateLeadStatus(leadId, status);
  };

  const handleSaveNote = async () => {
    if (!selectedLead || !quickNote.trim()) return;
    setIsSavingNote(true);
    await addLeadNote(selectedLead.id, quickNote.trim(), user.id);
    setQuickNote("");
    setIsSavingNote(false);
    setNoteSuccess(true);
    setTimeout(() => setNoteSuccess(false), 3000);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-12">
      {/* 🟢 TOP WHATSAPP-STYLE WELCOME CARD FOR SALES EMPLOYEE */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 p-5 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold text-emerald-100 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                Employee Sales Desk
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                Namaste, {user.name?.split(" ")[0]}! 👋
              </h1>
              <p className="text-xs text-emerald-100/90 mt-0.5 font-medium">
                Aapka personal mobile calling desk active hai.
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-lg border border-white/20 shadow-inner">
              {user.name?.substring(0, 2).toUpperCase() || "SE"}
            </div>
          </div>

          {/* KPI Numbers Grid */}
          <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-white/15 text-center">
            <div className="bg-black/10 rounded-xl p-2">
              <p className="text-[10px] text-emerald-200 uppercase font-semibold">My Leads</p>
              <p className="text-base sm:text-lg font-black text-white">{stats.totalAssigned}</p>
            </div>
            <div className="bg-black/10 rounded-xl p-2">
              <p className="text-[10px] text-emerald-200 uppercase font-semibold">My Calls</p>
              <p className="text-base sm:text-lg font-black text-white">{stats.myCallsCount}</p>
            </div>
            <div className="bg-black/10 rounded-xl p-2">
              <p className="text-[10px] text-amber-300 uppercase font-semibold">2x Enquiry</p>
              <p className="text-base sm:text-lg font-black text-amber-300">🔥{stats.reInquiryCount}</p>
            </div>
            <div className="bg-black/10 rounded-xl p-2">
              <p className="text-[10px] text-emerald-200 uppercase font-semibold">Won Deals</p>
              <p className="text-base sm:text-lg font-black text-emerald-300">✅{stats.wonCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ⚡ QUICK SHORTCUT BUTTONS (Touch-friendly) */}
      <div className="grid grid-cols-3 gap-2.5">
        <Link
          href="/leads"
          className="p-3 bg-white border border-emerald-200/80 rounded-2xl shadow-xs flex flex-col items-center text-center active:scale-95 transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1">
            <Phone className="w-4 h-4 fill-emerald-600" />
          </div>
          <span className="text-xs font-bold text-gray-900">Leads List</span>
          <span className="text-[10px] text-gray-400">All Clients</span>
        </Link>

        <Link
          href="/calls"
          className="p-3 bg-white border border-indigo-200/80 rounded-2xl shadow-xs flex flex-col items-center text-center active:scale-95 transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-1">
            <PhoneCall className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-xs font-bold text-gray-900">Call Logs</span>
          <span className="text-[10px] text-gray-400">Audio Records</span>
        </Link>

        <Link
          href="/messages"
          className="p-3 bg-white border border-green-200/80 rounded-2xl shadow-xs flex flex-col items-center text-center active:scale-95 transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-green-100 text-green-700 flex items-center justify-center mb-1">
            <MessageCircle className="w-4 h-4 fill-green-600" />
          </div>
          <span className="text-xs font-bold text-gray-900">WhatsApp</span>
          <span className="text-[10px] text-gray-400">Live Chats</span>
        </Link>
      </div>

      {/* ⚠️ FALLBACK NOTICE (If admin hasn't assigned leads to this employee yet) */}
      {isFallback && (
        <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-center gap-2.5 text-xs text-amber-900 shadow-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <p>
            <strong>Notice:</strong> Abhi aapke naam par leads assign nahi hui hain. Admin/Manager se leads assign karwayein. Niche company ki latest leads dikhayi ja rahi hain.
          </p>
        </div>
      )}

      {/* 📋 MY ASSIGNED CLIENT LEADS (WhatsApp Chat-List Layout) */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" /> My Assigned Leads
          </h2>
          <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
            {filteredLeads.length} Contacts
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, phone..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
          <button
            onClick={() => setTabFilter("ALL")}
            className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
              tabFilter === "ALL" ? "bg-emerald-600 text-white shadow-xs" : "bg-gray-100 text-gray-700"
            }`}
          >
            All ({initialLeads.length})
          </button>
          <button
            onClick={() => setTabFilter("RE_INQUIRY")}
            className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
              tabFilter === "RE_INQUIRY" ? "bg-amber-400 text-amber-950 font-black shadow-xs" : "bg-gray-100 text-gray-700"
            }`}
          >
            <Flame className="w-3 h-3 fill-current" /> Re-enquiries ({initialLeads.filter((l) => l.inquiry_count > 1).length})
          </button>
          <button
            onClick={() => setTabFilter("NEW")}
            className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
              tabFilter === "NEW" ? "bg-emerald-600 text-white shadow-xs" : "bg-gray-100 text-gray-700"
            }`}
          >
            New ({initialLeads.filter((l) => l.status === "NEW").length})
          </button>
          <button
            onClick={() => setTabFilter("WON")}
            className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
              tabFilter === "WON" ? "bg-emerald-600 text-white shadow-xs" : "bg-gray-100 text-gray-700"
            }`}
          >
            Won ({initialLeads.filter((l) => l.status === "WON").length})
          </button>
        </div>

        {/* WhatsApp-Style Leads List */}
        <div className="space-y-2 pt-1">
          {filteredLeads.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs">
              Koi lead nahi mili.
            </div>
          ) : (
            filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className="p-3 bg-gray-50/70 hover:bg-gray-100/70 border border-gray-200/60 rounded-2xl flex items-center justify-between gap-3 active:bg-gray-100 transition-colors"
              >
                {/* Avatar */}
                <div
                  className="relative shrink-0 cursor-pointer"
                  onClick={() => setSelectedLead(lead)}
                >
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
                    {lead.name.substring(0, 2).toUpperCase()}
                  </div>
                  {lead.inquiry_count > 1 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full border-2 border-white flex items-center gap-0.5">
                      🔥{lead.inquiry_count}x
                    </span>
                  )}
                </div>

                {/* Details */}
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => setSelectedLead(lead)}
                >
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4 className="font-bold text-gray-900 text-sm truncate">{lead.name}</h4>
                    <span className="text-[10px] text-gray-400 font-mono shrink-0">
                      {new Date(lead.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mb-1">
                    {lead.company_name || lead.phone || "No details"}
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        lead.status === "WON"
                          ? "bg-green-100 text-green-800"
                          : lead.status === "QUALIFIED"
                          ? "bg-indigo-100 text-indigo-800"
                          : lead.status === "PROPOSAL"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {lead.status}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      • {lead.source}
                    </span>
                  </div>
                </div>

                {/* 1-Tap Action Call & WhatsApp Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {lead.phone && (
                    <>
                      <a
                        href={`tel:${lead.phone}`}
                        className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white flex items-center justify-center shadow-xs active:scale-90 transition-all border border-emerald-200"
                        title="Direct SIM Call"
                      >
                        <Phone className="w-4 h-4 fill-emerald-600" />
                      </a>
                      <a
                        href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-9 h-9 rounded-full bg-green-500 text-white hover:bg-green-600 flex items-center justify-center shadow-md active:scale-90 transition-all"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4 fill-white" />
                      </a>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ⏰ TODAY'S PENDING FOLLOW-UP TASKS */}
      {pendingTasks.length > 0 && (
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm p-4 space-y-2.5">
          <h2 className="font-extrabold text-gray-900 text-sm flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-600" /> Priority Follow-ups Today
          </h2>
          <div className="space-y-2">
            {pendingTasks.map((t) => (
              <div
                key={t.id}
                className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-center justify-between gap-2"
              >
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{t.title}</h4>
                  <p className="text-[11px] text-gray-500">
                    Lead: <span className="font-semibold text-indigo-700">{t.contact?.name || "Client"}</span> ({t.contact?.phone || "No phone"})
                  </p>
                </div>
                {t.contact?.phone && (
                  <a
                    href={`tel:${t.contact.phone}`}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs"
                  >
                    <Phone className="w-3 h-3 fill-white" /> Call Now
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 📱 WHATSAPP-STYLE LEAD BOTTOM SHEET DRAWER */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-t-3xl max-h-[85vh] overflow-y-auto p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom-10">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-600 text-white font-extrabold flex items-center justify-center text-base shadow-sm">
                  {selectedLead.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-black text-gray-900 text-base">{selectedLead.name}</h3>
                    {selectedLead.inquiry_count > 1 && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-1.5 py-0.5 rounded-full border border-amber-300">
                        🔥{selectedLead.inquiry_count}x
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 font-mono font-medium">{selectedLead.phone || "No phone"}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Calling & WhatsApp Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={selectedLead.phone ? `tel:${selectedLead.phone}` : "#"}
                className="flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm shadow-md active:scale-95 transition-all"
              >
                <Phone className="w-4 h-4 fill-white" /> Direct SIM Call
              </a>
              <a
                href={selectedLead.phone ? `https://wa.me/${selectedLead.phone.replace(/\D/g, "")}` : "#"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-2xl font-bold text-sm shadow-md active:scale-95 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" /> WhatsApp Chat
              </a>
            </div>

            {/* 1-Tap Status Buttons */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                ⚡ 1-Tap Status Update:
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST"].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusUpdate(selectedLead.id, st)}
                    className={`py-2 px-2 rounded-xl font-bold border transition-all text-center cursor-pointer ${
                      selectedLead.status === st
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {st === "NEW" ? "New Lead" :
                     st === "CONTACTED" ? "Contacted" :
                     st === "QUALIFIED" ? "Interested" :
                     st === "PROPOSAL" ? "Proposal" :
                     st === "WON" ? "Closed Won ✅" : "Lost ❌"}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Note Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">
                📝 Add Call Note / Follow-up:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                  placeholder="e.g. Client interested, agreed on pricing..."
                  className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
                <button
                  onClick={handleSaveNote}
                  disabled={isSavingNote || !quickNote.trim()}
                  className="px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> {isSavingNote ? "..." : "Save"}
                </button>
              </div>
              {noteSuccess && (
                <p className="text-emerald-600 text-xs font-bold">✅ Note saved to CRM timeline!</p>
              )}
            </div>

            {/* Full Profile Link */}
            <div className="pt-2">
              <Link
                href={`/leads/${selectedLead.id}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-100 text-gray-800 rounded-xl font-bold text-xs hover:bg-gray-200 transition-colors"
              >
                View Full Timeline & Details <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
