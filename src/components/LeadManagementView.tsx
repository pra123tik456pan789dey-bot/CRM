"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Upload,
  Search,
  Filter,
  Phone,
  Mail,
  User,
  Building,
  Kanban,
  Table as TableIcon,
  Flame,
  Clock,
  CheckSquare,
  Square,
  Users,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { createLead, bulkAssignLeadsAction } from "@/app/actions/leadActions";
import { bulkImportLeads } from "@/app/actions/csvImportActions";
import KanbanDealsBoard from "./KanbanDealsBoard";

export default function LeadManagementView({
  initialLeads,
  pipelineData,
  staffUsers = []
}: {
  initialLeads: any[];
  pipelineData: { pipeline: any; deals: any[] };
  staffUsers?: any[];
}) {
  const [viewMode, setViewMode] = useState<"board" | "table">("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sourceFilter, setSourceFilter] = useState("ALL");

  // Bulk Selection & Manual Distribution State
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [targetStaffId, setTargetStaffId] = useState("");
  const [isBulkAssigning, setIsBulkAssigning] = useState(false);
  const [bulkMessage, setBulkMessage] = useState<string | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);

  // New Lead Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [source, setSource] = useState("MANUAL");
  const [tags, setTags] = useState("");

  // CSV Import State
  const [csvRawText, setCsvRawText] = useState("");
  const [importResult, setImportResult] = useState<{ created: number; duplicates: number } | null>(null);

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createLead({
      name,
      email,
      phone,
      company_name: companyName,
      source,
      tags
    });
    setName("");
    setEmail("");
    setPhone("");
    setCompanyName("");
    setShowAddModal(false);
  };

  const handleCsvImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvRawText.trim()) return;

    // Simple CSV parser (Header: name, email, phone, company, source)
    const lines = csvRawText.split("\n").filter((l) => l.trim());
    const parsedLeads = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (i === 0 && line.toLowerCase().includes("name")) continue; // header skip

      const parts = line.split(",").map((p) => p.trim().replace(/^["']|["']$/g, ""));
      if (parts[0]) {
        parsedLeads.push({
          name: parts[0],
          email: parts[1] || undefined,
          phone: parts[2] || undefined,
          company_name: parts[3] || undefined,
          source: parts[4] || "CSV_IMPORT"
        });
      }
    }

    const res = await bulkImportLeads(parsedLeads);
    if (res.success) {
      setImportResult({ created: res.createdCount || 0, duplicates: res.duplicateCount || 0 });
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLeadIds(filteredLeads.map((l) => l.id));
    } else {
      setSelectedLeadIds([]);
    }
  };

  const handleToggleLead = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExecuteBulkAssign = async () => {
    if (!targetStaffId) {
      alert("Please select a team member / executive to assign leads.");
      return;
    }
    if (selectedLeadIds.length === 0) return;

    setIsBulkAssigning(true);
    setBulkMessage(null);
    try {
      const res = await bulkAssignLeadsAction(selectedLeadIds, targetStaffId);
      if (res.success) {
        setBulkMessage(res.message || `Successfully assigned ${selectedLeadIds.length} lead(s)!`);
        setSelectedLeadIds([]);
        setTimeout(() => setBulkMessage(null), 4000);
      } else {
        alert(res.error || "Failed to assign leads");
      }
    } catch (err: any) {
      alert(err.message || "Error assigning leads");
    } finally {
      setIsBulkAssigning(false);
    }
  };

  const filteredLeads = initialLeads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      (lead.email && lead.email.toLowerCase().includes(search.toLowerCase())) ||
      (lead.company_name && lead.company_name.toLowerCase().includes(search.toLowerCase())) ||
      (lead.phone && lead.phone.includes(search));

    const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter;
    const matchesSource = sourceFilter === "ALL" || lead.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div className="h-full flex flex-col space-y-4 sm:space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Lead & Deal Management</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Track pipeline stages, search leads, and import bulk contacts.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* View toggle */}
          <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
            <button
              onClick={() => setViewMode("board")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "board" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Kanban className="w-3.5 h-3.5" /> Board
            </button>

            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "table" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" /> Table
            </button>
          </div>

          <button
            onClick={() => setShowCsvModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50"
          >
            <Upload className="w-3.5 h-3.5 text-gray-500" /> Import
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Add Lead
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by name, email, company..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium flex-1 sm:flex-none">
            <Filter className="w-3.5 h-3.5" /> Status:
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-2.5 py-1.5 border border-gray-300 rounded-xl text-xs text-gray-800 bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="PROPOSAL">Proposal Sent</option>
              <option value="WON">Closed Won</option>
              <option value="LOST">Closed Lost</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium flex-1 sm:flex-none">
            Source:
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full sm:w-auto px-2.5 py-1.5 border border-gray-300 rounded-xl text-xs text-gray-800 bg-white"
            >
              <option value="ALL">All Sources</option>
              <option value="WEBSITE">Website</option>
              <option value="FACEBOOK">Facebook Ads</option>
              <option value="GOOGLE">Google Ads</option>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="REFERRAL">Referral</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main View Display */}
      {viewMode === "board" ? (
        <div className="overflow-x-auto pb-4">
          <KanbanDealsBoard
            initialPipeline={pipelineData.pipeline}
            initialDeals={pipelineData.deals}
            leads={filteredLeads}
          />
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-x-auto shadow-sm flex-1">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
              <tr>
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    checked={filteredLeads.length > 0 && selectedLeadIds.length === filteredLeads.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-4">Contact Name</th>
                <th className="p-4">Company</th>
                <th className="p-4">Phone & Email</th>
                <th className="p-4">Arrival Date & Time</th>
                <th className="p-4">Source</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assignee</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className={`hover:bg-gray-50/70 transition-colors ${
                    selectedLeadIds.includes(lead.id) ? "bg-indigo-50/40" : ""
                  }`}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      checked={selectedLeadIds.includes(lead.id)}
                      onChange={() => handleToggleLead(lead.id)}
                    />
                  </td>
                  <td className="p-4 font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <Link href={`/leads/${lead.id}`} className="hover:text-indigo-600 font-semibold hover:underline">
                        {lead.name}
                      </Link>
                      {(lead.inquiry_count && lead.inquiry_count > 1) ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 shadow-sm animate-pulse">
                          <Flame className="w-3 h-3 text-amber-600 fill-amber-500" />
                          {lead.inquiry_count}x Enquiry
                        </span>
                      ) : null}
                    </div>
                    {lead.tags && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {lead.tags.split(",").map((t: string, i: number) => (
                          <span key={i} className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-medium">
                            {t.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-gray-600">{lead.company_name || "Independent"}</td>
                  <td className="p-4">
                    <div className="text-xs text-gray-900 font-mono">{lead.phone || "No phone"}</div>
                    <div className="text-xs text-gray-400">{lead.email || "No email"}</div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </div>
                    <div className="text-[11px] text-gray-500 ml-5 font-mono">
                      {new Date(lead.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                      })}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-700 rounded-md">
                      {lead.source}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      lead.status === "WON" ? "bg-green-100 text-green-800" :
                      lead.status === "PROPOSAL" ? "bg-purple-100 text-purple-800" :
                      lead.status === "QUALIFIED" ? "bg-indigo-100 text-indigo-800" : "bg-blue-100 text-blue-800"
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-700">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                      {lead.assignee?.name || "Unassigned"}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/leads/${lead.id}`}
                      className="px-3 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors"
                    >
                      View Timeline
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Contact / Lead</h3>
            <form onSubmit={handleAddLead} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikram Sharma"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+919876543210"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vikram@corp.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Tech Solutions Ltd"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Lead Source</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="WEBSITE">Website</option>
                  <option value="FACEBOOK">Facebook Ads</option>
                  <option value="GOOGLE">Google Ads</option>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="REFERRAL">Referral</option>
                  <option value="COLD_CALL">Cold Call</option>
                  <option value="MANUAL">Manual Entry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="VIP Lead, High Budget"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Bulk CSV Import Leads</h3>
            <p className="text-xs text-gray-500 mb-4">
              Paste comma-separated rows in format: <br />
              <code className="bg-gray-100 px-1 py-0.5 rounded text-indigo-700 font-mono">
                Name, Email, Phone, Company, Source
              </code>
            </p>

            <form onSubmit={handleCsvImport} className="space-y-4">
              <textarea
                rows={6}
                value={csvRawText}
                onChange={(e) => setCsvRawText(e.target.value)}
                placeholder={`Name, Email, Phone, Company, Source\nRohan Gupta, rohan@corp.in, +919811122233, Gupta Traders, Website\nSneha Rao, sneha@tech.com, +919822233344, Tech Stack, Referral`}
                className="w-full p-3 font-mono text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {importResult && (
                <div className="p-3 bg-indigo-50 text-indigo-900 border border-indigo-200 rounded-lg text-xs">
                  ✅ <strong>{importResult.created}</strong> leads imported successfully! <br />
                  ⚠️ <strong>{importResult.duplicates}</strong> duplicate entries skipped (matched existing phone/email).
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCsvModal(false);
                    setImportResult(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700"
                >
                  Import Leads
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Bulk Action Bar */}
      {selectedLeadIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-gray-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-gray-700 flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">
              {selectedLeadIds.length}
            </span>
            <span className="text-xs sm:text-sm font-semibold">Leads Selected</span>
          </div>

          <div className="h-4 w-px bg-gray-700" />

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <select
              value={targetStaffId}
              onChange={(e) => setTargetStaffId(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-xs sm:text-sm text-gray-100 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="">Assign to Executive...</option>
              {staffUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleExecuteBulkAssign}
            disabled={isBulkAssigning || !targetStaffId}
            className="px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isBulkAssigning ? (
              "Assigning..."
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" /> Distribute / Assign
              </>
            )}
          </button>

          <button
            onClick={() => setSelectedLeadIds([])}
            className="text-xs text-gray-400 hover:text-white underline cursor-pointer ml-1"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Toast feedback for bulk assignment */}
      {bulkMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          {bulkMessage}
        </div>
      )}
    </div>
  );
}
