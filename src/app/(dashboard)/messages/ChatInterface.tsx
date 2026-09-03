"use client";

import { useState, useEffect } from "react";
import { Send, Phone, User, CheckCheck, FileText, Sparkles, Image as ImageIcon } from "lucide-react";
import { sendWhatsAppMessage } from "@/app/actions/whatsappActions";
import { initiateClickToCall } from "@/app/actions/telephonyActions";

const TEMPLATES = [
  { id: "welcome_template", name: "Welcome Onboarding", text: "Hello! Welcome to Apex Global. Our team is ready to set up your CRM account. When is a good time for a quick 10-minute demo?" },
  { id: "meeting_reminder", name: "Meeting Reminder", text: "Hi! This is a quick reminder regarding our scheduled follow-up call today. Please let us know if you need to reschedule." },
  { id: "proposal_followup", name: "Proposal & Pricing Followup", text: "Greetings! Have you had a chance to review the proposal sent to your email? We'd love to hear your feedback." }
];

export default function ChatInterface({ initialLeads }: { initialLeads: any[] }) {
  const [leads, setLeads] = useState<any[]>(initialLeads);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(
    initialLeads[0]?.id || null
  );
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [callNotice, setCallNotice] = useState<string | null>(null);

  const activeLead = leads.find((l) => l.id === selectedLeadId || l.phone === selectedLeadId);

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

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Chat List */}
      <div className="w-1/3 border-r border-gray-200 overflow-y-auto bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <span className="font-semibold text-gray-800 text-sm">Active Conversations</span>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
            {leads.length} Contacts
          </span>
        </div>

        {leads.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm">No WhatsApp messages yet.</div>
        ) : (
          leads.map((lead) => {
            const lastMsg =
              lead.messages && lead.messages.length > 0
                ? lead.messages[lead.messages.length - 1]
                : { message_text: "", timestamp: new Date() };

            return (
              <div
                key={lead.id}
                onClick={() => setSelectedLeadId(lead.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedLeadId === lead.id ? "bg-emerald-50/80 border-l-4 border-l-emerald-600" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-semibold text-gray-900 text-sm truncate pr-2">{lead.name}</h4>
                  <span className="text-[11px] text-gray-400">
                    {new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">{lastMsg.message_text}</p>
              </div>
            );
          })
        )}
      </div>

      {/* Chat Window */}
      {activeLead ? (
        <div className="w-2/3 flex flex-col bg-[#efeae2]">
          {/* Header */}
          <div className="bg-white px-6 py-3.5 border-b border-gray-200 flex items-center justify-between shadow-sm z-10">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-3">
                {activeLead.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{activeLead.name}</h3>
                <p className="text-xs text-gray-500">{activeLead.phone || "No phone"} • {activeLead.company_name || "Independent"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowTemplateModal(true)}
                className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" /> Approved Templates
              </button>

              <button
                onClick={handleCall}
                className="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-full transition-colors"
                title="Click to Call"
              >
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {callNotice && (
            <div className="bg-emerald-600 text-white text-xs px-4 py-2 text-center">
              {callNotice}
            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {activeLead.messages?.map((msg: any) => {
              const isOutbound = msg.direction === "OUTBOUND";
              return (
                <div key={msg.id} className={`flex ${isOutbound ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] rounded-2xl p-3.5 shadow-sm relative ${isOutbound ? "bg-[#d9fdd3] text-gray-900 rounded-tr-none" : "bg-white text-gray-900 rounded-tl-none"}`}>
                    {msg.message_type === "TEMPLATE" && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded mb-1 inline-block">
                        TEMPLATE MESSAGE
                      </span>
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message_text}</p>
                    <div className="text-[10px] text-gray-400 mt-1 flex justify-end items-center gap-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      {isOutbound && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Bar */}
          <div className="bg-[#f0f2f5] px-6 py-4 border-t border-gray-200">
            <form onSubmit={handleSend} className="flex items-center gap-3 bg-white rounded-xl px-4 py-2 shadow-sm">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type a WhatsApp message..."
                className="flex-1 bg-transparent border-none text-sm text-gray-800 outline-none"
              />
              <button
                type="submit"
                disabled={!replyText.trim() || isSending}
                className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="w-2/3 bg-[#efeae2] flex items-center justify-center flex-col">
          <p className="text-gray-600 font-medium">Select a conversation from the sidebar</p>
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Meta Pre-approved Templates</h3>
            <p className="text-xs text-gray-500 mb-4">Send standard business templates outside 24-hr window.</p>

            <div className="space-y-3">
              {TEMPLATES.map((tmpl) => (
                <div key={tmpl.id} className="p-4 border border-gray-200 rounded-xl hover:border-emerald-500 transition-colors bg-gray-50/50">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-semibold text-sm text-gray-900">{tmpl.name}</h4>
                    <button
                      onClick={() => handleSendTemplate(tmpl.text, tmpl.id)}
                      className="px-3 py-1 bg-emerald-600 text-white rounded-md text-xs font-semibold hover:bg-emerald-700"
                    >
                      Send Template
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 italic">"{tmpl.text}"</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
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
