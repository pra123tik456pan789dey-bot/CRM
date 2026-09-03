"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  MessageCircle,
  Plus,
  Clock,
  User,
  Building,
  Mail,
  MapPin,
  Tag as TagIcon,
  CheckCircle2,
  FileText,
  AlertCircle,
  Play,
  Calendar
} from "lucide-react";
import { initiateClickToCall } from "@/app/actions/telephonyActions";
import { sendWhatsAppMessage } from "@/app/actions/whatsappActions";
import { addLeadNote, updateLeadStatus } from "@/app/actions/leadActions";
import { createTask } from "@/app/actions/taskActions";

export default function LeadDetailView({ lead }: { lead: any }) {
  const [activeTab, setActiveTab] = useState<"timeline" | "tasks" | "deals">("timeline");
  const [noteContent, setNoteContent] = useState("");
  const [waMessage, setWaMessage] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [callMessage, setCallMessage] = useState<string | null>(null);
  const [isSendingWa, setIsSendingWa] = useState(false);

  // New task form state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskPriority, setTaskPriority] = useState("MEDIUM");

  const handleCall = async () => {
    setIsCalling(true);
    setCallMessage(null);
    const res = await initiateClickToCall(lead.id);
    setIsCalling(false);
    if (res.success) {
      setCallMessage("Call initiated successfully! Connected to agent & customer.");
    } else {
      setCallMessage(`Error initiating call: ${res.error}`);
    }
  };

  const handleSendWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waMessage.trim()) return;
    setIsSendingWa(true);
    await sendWhatsAppMessage(lead.id, waMessage);
    setWaMessage("");
    setIsSendingWa(false);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    await addLeadNote(lead.id, noteContent);
    setNoteContent("");
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskDueDate) return;
    await createTask({
      contact_id: lead.id,
      title: taskTitle,
      due_date: taskDueDate,
      priority: taskPriority
    });
    setTaskTitle("");
    setTaskDueDate("");
    setShowTaskModal(false);
  };

  const handleStatusChange = async (newStatus: string) => {
    await updateLeadStatus(lead.id, newStatus);
  };

  // Combine activities, calls, and whatsapp messages into single chronological timeline
  const combinedTimeline = [
    ...(lead.activities || []).map((act: any) => ({
      id: act.id,
      type: act.type,
      title: act.type === "CALL" ? "Phone Call" : act.type === "WHATSAPP" ? "WhatsApp Activity" : act.type === "STATUS_CHANGE" ? "Status Update" : "Note",
      content: act.content,
      metadata: act.metadata ? JSON.parse(act.metadata) : null,
      author: act.agent?.name || "System",
      timestamp: new Date(act.timestamp)
    })),
    ...(lead.messages || []).map((msg: any) => ({
      id: msg.id,
      type: "WHATSAPP_MSG",
      title: `WhatsApp (${msg.direction})`,
      content: msg.message_text,
      media_url: msg.media_url,
      author: msg.direction === "INBOUND" ? lead.name : "Sales Rep",
      timestamp: new Date(msg.timestamp)
    })),
    ...(lead.callLogs || []).map((call: any) => ({
      id: call.id,
      type: "CALL_LOG",
      title: `Call (${call.direction}) - ${call.duration_seconds}s`,
      content: `Status: ${call.status}`,
      recording_url: call.recording_url,
      author: call.agent?.name || "System Agent",
      timestamp: new Date(call.timestamp)
    }))
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="flex flex-col h-full bg-gray-50 -m-6">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
            {lead.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
              <select
                value={lead.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="text-xs font-semibold px-3 py-1 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 cursor-pointer outline-none"
              >
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="PROPOSAL">Proposal Sent</option>
                <option value="NEGOTIATION">Negotiation</option>
                <option value="WON">Closed Won</option>
                <option value="LOST">Closed Lost</option>
              </select>
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
              <Building className="w-3.5 h-3.5" /> {lead.company_name || "Independent Lead"} • Source: <span className="font-semibold">{lead.source}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCall}
            disabled={isCalling}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
          >
            <Phone className="w-4 h-4" /> {isCalling ? "Initiating Call..." : "Click-to-Call"}
          </button>

          <button
            onClick={() => setShowTaskModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Schedule Task
          </button>
        </div>
      </div>

      {callMessage && (
        <div className="mx-8 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm flex items-center justify-between">
          <span>{callMessage}</span>
          <button onClick={() => setCallMessage(null)} className="text-emerald-600 font-bold">×</button>
        </div>
      )}

      {/* Main Grid */}
      <div className="flex-1 flex overflow-hidden p-8 gap-8">
        {/* Left Column: Information & Details */}
        <div className="w-1/3 space-y-6 overflow-y-auto pr-2">
          {/* Contact Cards */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-3">Contact Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-gray-700">
                <span className="flex items-center gap-2 text-gray-500"><Phone className="w-4 h-4" /> Phone</span>
                <span className="font-mono font-medium">{lead.phone || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between text-gray-700">
                <span className="flex items-center gap-2 text-gray-500"><Mail className="w-4 h-4" /> Email</span>
                <span className="font-medium truncate max-w-[180px]">{lead.email || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between text-gray-700">
                <span className="flex items-center gap-2 text-gray-500"><MapPin className="w-4 h-4" /> Location</span>
                <span>{lead.address || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between text-gray-700">
                <span className="flex items-center gap-2 text-gray-500"><User className="w-4 h-4" /> Assignee</span>
                <span className="font-semibold text-indigo-600">{lead.assignee?.name || "Unassigned"}</span>
              </div>
            </div>

            {lead.tags && (
              <div className="pt-3 border-t">
                <span className="text-xs text-gray-500 block mb-2 font-medium">TAGS</span>
                <div className="flex flex-wrap gap-1.5">
                  {lead.tags.split(",").map((tag: string, i: number) => (
                    <span key={i} className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pending Tasks */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" /> Pending Tasks
              </h3>
              <button onClick={() => setShowTaskModal(true)} className="text-xs text-indigo-600 font-semibold hover:underline">+ Add</button>
            </div>
            {lead.tasks && lead.tasks.length > 0 ? (
              <div className="space-y-3">
                {lead.tasks.map((task: any) => (
                  <div key={task.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" /> Due: {new Date(task.due_date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      task.priority === "HIGH" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No pending tasks.</p>
            )}
          </div>

          {/* Linked Deals */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900 border-b pb-3 mb-4">Deals & Opportunities</h3>
            {lead.deals && lead.deals.length > 0 ? (
              <div className="space-y-3">
                {lead.deals.map((deal: any) => (
                  <div key={deal.id} className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100">
                    <p className="font-semibold text-sm text-gray-900">{deal.title}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-lg font-bold text-emerald-600">
                        ₹{deal.value?.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded">
                        {deal.stage}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No deals created yet.</p>
            )}
          </div>
        </div>

        {/* Right Column: Unified Communication Timeline */}
        <div className="w-2/3 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Quick Note & Quick WhatsApp bar */}
          <div className="p-4 border-b border-gray-200 bg-gray-50/50 space-y-3">
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Write a internal team note or call outcome..."
                className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Add Note
              </button>
            </form>

            <form onSubmit={handleSendWhatsApp} className="flex gap-2">
              <input
                type="text"
                value={waMessage}
                onChange={(e) => setWaMessage(e.target.value)}
                placeholder="Send quick WhatsApp message to lead..."
                className="flex-1 px-4 py-2 text-sm border border-emerald-300 bg-emerald-50/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={isSendingWa}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" /> Send WhatsApp
              </button>
            </form>
          </div>

          {/* Timeline Feed Header */}
          <div className="px-6 py-3 border-b border-gray-100 bg-white flex justify-between items-center">
            <h3 className="font-semibold text-gray-900 text-sm">Unified Activity & Communication Feed</h3>
            <span className="text-xs text-gray-500">{combinedTimeline.length} total events</span>
          </div>

          {/* Feed List */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {combinedTimeline.map((item: any) => (
              <div key={item.id} className="flex gap-4">
                {/* Icon badge */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm ${
                  item.type === "CALL" || item.type === "CALL_LOG" ? "bg-blue-600" :
                  item.type === "WHATSAPP" || item.type === "WHATSAPP_MSG" ? "bg-emerald-600" :
                  item.type === "STATUS_CHANGE" ? "bg-purple-600" : "bg-amber-600"
                }`}>
                  {item.type === "CALL" || item.type === "CALL_LOG" ? <Phone className="w-4 h-4" /> :
                   item.type === "WHATSAPP" || item.type === "WHATSAPP_MSG" ? <MessageCircle className="w-4 h-4" /> :
                   item.type === "STATUS_CHANGE" ? <CheckCircle2 className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                </div>

                {/* Card Content */}
                <div className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-200/80">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-semibold text-sm text-gray-900">{item.title}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.timestamp.toLocaleString()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.content}</p>

                  {/* Audio Player if Call Recording exists */}
                  {(item.recording_url || item.metadata?.recording_url) && (
                    <div className="mt-3 p-2.5 bg-white rounded-lg border border-gray-200 flex items-center gap-3">
                      <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                        <Play className="w-3 h-3 text-indigo-600" /> Recording Playback:
                      </span>
                      <audio controls className="h-8 flex-1 max-w-md">
                        <source src={item.recording_url || item.metadata?.recording_url} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}

                  <span className="text-[11px] text-gray-400 block mt-2">Logged by: {item.author}</span>
                </div>
              </div>
            ))}

            {combinedTimeline.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No activity logged for this lead yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Schedule Follow-up Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Call to confirm proposal approval"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Due Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Priority</label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
