"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LifeBuoy, Plus, Clock, User, CheckCircle2, AlertTriangle, MessageSquare } from "lucide-react";
import { createTicket, updateTicketStatus } from "@/app/actions/ticketActions";

export default function TicketsView({ initialTickets, leads }: { initialTickets: any[]; leads: any[] }) {
  const [tickets, setTickets] = useState(initialTickets);
  const [showModal, setShowModal] = useState(false);
  const [contactId, setContactId] = useState(leads[0]?.id || "");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");

  const handleStatusChange = async (id: string, newStatus: string) => {
    setTickets(tickets.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
    await updateTicketStatus(id, newStatus);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !contactId) return;

    const res = await createTicket({
      contact_id: contactId,
      subject,
      description,
      priority
    });

    if (res.success && res.ticket) {
      setTickets([res.ticket, ...tickets]);
      setShowModal(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Support Helpdesk & SLA</h1>
          <p className="text-sm text-gray-500 mt-1">Manage post-sale customer tickets, SLA resolution timers, and escalations.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Open Support Ticket
        </button>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex-1">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
            <tr>
              <th className="p-4">Ticket #</th>
              <th className="p-4">Contact / Company</th>
              <th className="p-4">Subject</th>
              <th className="p-4">Priority</th>
              <th className="p-4">SLA Resolution Timer</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tickets.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50/70 transition-colors">
                <td className="p-4 font-mono font-bold text-indigo-600">{t.ticket_number}</td>
                <td className="p-4 font-medium text-gray-900">
                  <Link href={`/leads/${t.contact?.id}`} className="hover:underline">
                    {t.contact?.name}
                  </Link>
                  <span className="block text-xs text-gray-400 font-normal">{t.contact?.company_name || "N/A"}</span>
                </td>
                <td className="p-4 font-semibold text-gray-800">{t.subject}</td>
                <td className="p-4">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                    t.priority === "URGENT" || t.priority === "HIGH"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {t.priority}
                  </span>
                </td>
                <td className="p-4 text-xs font-semibold text-indigo-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Due: {new Date(t.sla_due_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </td>
                <td className="p-4">
                  <select
                    value={t.status}
                    onChange={(e) => handleStatusChange(t.id, e.target.value)}
                    className="text-xs font-bold px-2.5 py-1 rounded-full border border-gray-300 bg-white"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </td>
                <td className="p-4 text-right">
                  <Link
                    href={`/leads/${t.contact?.id}`}
                    className="text-xs text-indigo-600 font-semibold hover:underline"
                  >
                    View Contact →
                  </Link>
                </td>
              </tr>
            ))}

            {tickets.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400">
                  No support tickets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Open Customer Support Ticket</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Select Contact</label>
                <select
                  value={contactId}
                  onChange={(e) => setContactId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.company_name || "N/A"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Need assistance with Meta API token"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent SLA</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
