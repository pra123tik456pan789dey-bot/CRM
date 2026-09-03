"use client";

import { useState } from "react";
import { Send, Phone, ArrowLeft, CheckCheck, FileText, Sparkles, Search, MessageSquare } from "lucide-react";
import { sendWhatsAppMessage } from "@/app/actions/whatsappActions";
import { initiateClickToCall } from "@/app/actions/telephonyActions";

const TEMPLATES = [
  { id: "welcome_template", name: "Welcome Onboarding", text: "Hello! Welcome to Apex Global. Our team is ready to set up your CRM account. When is a good time for a quick 10-minute demo?" },
  { id: "meeting_reminder", name: "Meeting Reminder", text: "Hi! This is a quick reminder regarding our scheduled follow-up call today. Please let us know if you need to reschedule." },
  { id: "proposal_followup", name: "Proposal & Pricing Followup", text: "Greetings! Have you had a chance to review the proposal sent to your email? We'd love to hear your feedback." }
];

export default function ChatInterface({ initialLeads }: { initialLeads: any[] }) {
  const [leads, setLeads] = useState<any[]>(initialLeads);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [showMobileChat, setShowMobileChat] = useState<boolean>(false);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [callNotice, setCallNotice] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const activeLead = leads.find((l) => l.id === selectedLeadId || l.phone === selectedLeadId);

  const handleSelectLead = (id: string) => {
    setSelectedLeadId(id);
    setShowMobileChat(true);
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeLead) return;

    setIsSending(true);
    const res = await sendWhatsAppMessage(activeLead.id, replyText);
    setIsSending(false);

    if (res.success && res.message) {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === activeLead.id
            ? { ...l, messages: [...(l.messages || []), res.message] }
            : l
        )
      );
    }
    setReplyText("");
  };

  const handleSendTemplate = async (templateText: string, templateName: string) => {
    if (!activeLead) return;
    setIsSending(true);
    const res = await sendWhatsAppMessage(activeLead.id, templateText, undefined, templateName);
    setIsSending(false);
    setShowTemplateModal(false);

    if (res.success && res.message) {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === activeLead.id
            ? { ...l, messages: [...(l.messages || []), res.message] }
            : l
        )
      );
    }
  };

  const handleCall = async () => {
    if (!activeLead) return;
    const res = await initiateClickToCall(activeLead.id);
    if (res.success) {
      setCallNotice("Twilio Call initiated to " + activeLead.phone);
      setTimeout(() => setCallNotice(null), 4000);
    }
  };

  const filteredLeads = leads.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    (l.phone && l.phone.includes(search))
  );

  return (
    <div className="h-[calc(100vh-8.5rem)] flex rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-xl">
      {/* 🟢 WhatsApp Chat List View (Full Width on Mobile when chat not active) */}
      <div
        className={`w-full md:w-80 lg:w-96 border-r border-gray-200 flex flex-col bg-white flex-shrink-0 ${
          showMobileChat ? "hidden md:flex" : "flex"
        }`}
      >
        {/* WhatsApp Mobile Top Bar Header */}
        <div className="bg-[#075e54] text-white px-4 py-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5" />
            <span className="font-bold text-base tracking-wide">WhatsApp Business</span>
          </div>
          <span className="text-[10px] bg-[#128c7e] text-white font-black px-2 py-0.5 rounded-full border border-emerald-400">
            {leads.length} Active
          </span>
        </div>

        {/* Search Bar */}
        <div className="p-2.5 bg-gray-100/80 border-b border-gray-200">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chat or number..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#075e54]"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {filteredLeads.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-xs">No active WhatsApp chats.</div>
          ) : (
            filteredLeads.map((lead) => {
              const lastMsg =
                lead.messages && lead.messages.length > 0
                  ? lead.messages[lead.messages.length - 1]
                  : { message_text: "No message history", timestamp: new Date() };

              const isSelected = selectedLeadId === lead.id;

              return (
                <div
                  key={lead.id}
                  onClick={() => handleSelectLead(lead.id)}
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                    isSelected ? "bg-emerald-50/80 border-l-4 border-l-[#075e54]" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="w-11 h-11 rounded-full bg-[#128c7e] text-white font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                    {lead.name.substring(0, 2).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className="font-bold text-gray-900 text-xs truncate">{lead.name}</h4>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate leading-tight">{lastMsg.message_text}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 💬 WhatsApp Chat Window (Full Width on Mobile when active) */}
      <div
        className={`w-full md:flex-1 flex flex-col bg-[#e5ddd5] ${
          showMobileChat ? "flex" : "hidden md:flex"
        }`}
      >
        {activeLead ? (
          <>
            {/* WhatsApp Chat Header */}
            <div className="bg-[#075e54] text-white px-3 sm:px-5 py-3 flex items-center justify-between shadow-md z-10">
              <div className="flex items-center gap-3">
                {/* ⬅️ Mobile Back Arrow */}
                <button
                  onClick={handleBackToList}
                  className="p-1 text-white hover:bg-white/10 rounded-full md:hidden"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="w-9 h-9 rounded-full bg-white text-[#075e54] font-black flex items-center justify-center text-xs shadow-sm">
                  {activeLead.name.substring(0, 2).toUpperCase()}
                </div>

                <div>
                  <h3 className="font-bold text-white text-xs sm:text-sm leading-tight">{activeLead.name}</h3>
                  <p className="text-[10px] text-emerald-100 font-medium">
                    {activeLead.phone || "No phone"} • online
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTemplateModal(true)}
                  className="px-2.5 py-1 bg-white/15 hover:bg-white/25 text-white rounded-lg text-xs font-bold flex items-center gap-1 border border-white/20"
                >
                  <FileText className="w-3 h-3" /> Templates
                </button>

                <button
                  onClick={handleCall}
                  className="p-2 bg-white/15 hover:bg-white/25 text-white rounded-full transition-colors"
                  title="Call Customer"
                >
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>

            {callNotice && (
              <div className="bg-emerald-700 text-white text-xs px-4 py-2 text-center font-semibold">
                {callNotice}
              </div>
            )}

            {/* Chat Messages Feed */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 bg-[radial-gradient(#0000000a_1px,transparent_1px)] [background-size:16px_16px]">
              {activeLead.messages?.map((msg: any) => {
                const isOutbound = msg.direction === "OUTBOUND";
                return (
                  <div key={msg.id} className={`flex ${isOutbound ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] rounded-xl p-3 shadow-sm relative ${
                        isOutbound
                          ? "bg-[#d9fdd3] text-gray-900 rounded-tr-none"
                          : "bg-white text-gray-900 rounded-tl-none"
                      }`}
                    >
                      {msg.message_type === "TEMPLATE" && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-indigo-100 text-indigo-800 rounded mb-1 inline-block">
                          OFFICIAL TEMPLATE
                        </span>
                      )}
                      <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">{msg.message_text}</p>
                      <div className="text-[9px] text-gray-400 mt-1 flex justify-end items-center gap-1 font-mono">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        {isOutbound && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom WhatsApp Message Bar */}
            <div className="bg-[#f0f2f5] p-2.5 sm:p-3 border-t border-gray-200">
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2 text-xs sm:text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#075e54]"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim() || isSending}
                  className="w-9 h-9 bg-[#128c7e] text-white rounded-full flex items-center justify-center hover:bg-[#075e54] disabled:opacity-50 transition-colors shadow-md flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#128c7e]/10 text-[#128c7e] flex items-center justify-center mb-3">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-gray-800 text-sm">WhatsApp Business Inbox</h3>
            <p className="text-xs text-gray-500 max-w-xs mt-1">Select a contact from the list to start messaging.</p>
          </div>
        )}
      </div>

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-md shadow-2xl">
            <h3 className="text-base font-bold text-gray-900 mb-1">Meta Pre-approved Templates</h3>
            <p className="text-xs text-gray-500 mb-4">Send standard WhatsApp business templates.</p>

            <div className="space-y-2.5">
              {TEMPLATES.map((tmpl) => (
                <div key={tmpl.id} className="p-3 border border-gray-200 rounded-xl hover:border-[#128c7e] transition-colors bg-gray-50/50">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-xs text-gray-900">{tmpl.name}</h4>
                    <button
                      onClick={() => handleSendTemplate(tmpl.text, tmpl.id)}
                      className="px-2.5 py-1 bg-[#128c7e] text-white rounded-lg text-xs font-bold hover:bg-[#075e54]"
                    >
                      Send
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-600 italic">"{tmpl.text}"</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

