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
  Table as TableIcon
} from "lucide-react";
import { createLead } from "@/app/actions/leadActions";
import { bulkImportLeads } from "@/app/actions/csvImportActions";
import KanbanDealsBoard from "./KanbanDealsBoard";

export default function LeadManagementView({
  initialLeads,
  pipelineData
}: {
  initialLeads: any[];
  pipelineData: { pipeline: any; deals: any[] };
}) {
  const [viewMode, setViewMode] = useState<"board" | "table">("board");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sourceFilter, setSourceFilter] = useState("ALL");

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
                <th className="p-4">Contact Name</th>
                <th className="p-4">Company</th>
                <th className="p-4">Phone & Email</th>
                <th className="p-4">Source</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assignee</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="p-4 font-medium text-gray-900">
                    <Link href={`/leads/${lead.id}`} className="hover:text-indigo-600 font-semibold hover:underline">
                      {lead.name}
                    </Link>
                    {lead.tags && (
                      <div className="flex gap-1 mt-1">
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
                  <td className="p-4 text-sm text-gray-700">{lead.assignee?.name || "Unassigned"}</td>
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
    </div>
  );
}
