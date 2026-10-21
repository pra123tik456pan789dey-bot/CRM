"use client";

import React, { useState } from "react";
import {
  Filter,
  Layers,
  Trophy,
  Percent,
  Gauge,
  Plus,
  Search,
  LayoutGrid,
  List as ListIcon,
  Calendar,
  MoreVertical,
  CheckCircle2,
  DollarSign,
  ArrowRight
} from "lucide-react";
import { createDeal, updateDealStage } from "@/app/actions/dealActions";

export default function ZepflySalesPipelineView({ initialDeals, leads, users }: { initialDeals: any[]; leads: any[]; users: any[] }) {
  const [deals, setDeals] = useState<any[]>(
    initialDeals.length > 0 ? initialDeals : [
      { id: "d1", title: "Spice Route Foods", contact: { name: "Shopify migration" }, value: 75000, stage: "LEAD", probability: 20, expected_close_date: "2026-11-28", assignee: { name: "Aarav Iyer" } },
      { id: "d2", title: "Nova Interiors", contact: { name: "Brand refresh" }, value: 120000, stage: "QUALIFIED", probability: 30, expected_close_date: "2026-11-16", assignee: { name: "Ananya" } },
      { id: "d3", title: "Royal Banquets", contact: { name: "Website + SEO retainer" }, value: 240000, stage: "PROPOSAL", probability: 50, expected_close_date: "2026-11-30", assignee: { name: "Kabir Singh" } },
      { id: "d4", title: "SmileCare Dental", contact: { name: "Clinic booking app" }, value: 180000, stage: "MEETING", probability: 60, expected_close_date: "2026-11-22", assignee: { name: "Vikram Joshi" } },
      { id: "d5", title: "Urban Threads", contact: { name: "Meta ads - 3 months" }, value: 95000, stage: "QUALIFIED", probability: 30, expected_close_date: "2026-11-19", assignee: { name: "Harsh Malhotra" } },
      { id: "d6", title: "Prime Properties", contact: { name: "CRM + WhatsApp bot" }, value: 310000, stage: "PROPOSAL", probability: 50, expected_close_date: "2026-12-05", assignee: { name: "Neha Sharma" } },
      { id: "d7", title: "FitLife Gym Chain", contact: { name: "Performance marketing" }, value: 129000, stage: "WON", probability: 100, expected_close_date: "2026-10-18", assignee: { name: "Aarav Mehta" } },
    ]
  );

  const [viewMode, setViewMode] = useState<"BOARD" | "LIST">("BOARD");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Deal Form State
  const [newTitle, setNewTitle] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newLeadId, setNewLeadId] = useState(leads[0]?.id || "");
  const [newStage, setNewStage] = useState("LEAD");
  const [newProbability, setNewProbability] = useState(30);

  const stages = [
    { key: "LEAD", label: "Lead", color: "bg-blue-500" },
    { key: "QUALIFIED", label: "Qualified", color: "bg-indigo-500" },
    { key: "PROPOSAL", label: "Proposal", color: "bg-purple-500" },
    { key: "MEETING", label: "Meeting", color: "bg-amber-500" },
    { key: "WON", label: "Won", color: "bg-emerald-500" }
  ];

  // Pipeline Metrics Calculation
  const totalOpenDeals = deals.filter(d => d.stage !== "WON" && d.stage !== "LOST");
  const wonDeals = deals.filter(d => d.stage === "WON");
  const weightedPipeline = totalOpenDeals.reduce((sum, d) => sum + (d.value * (d.probability / 100)), 0);
  const wonThisMonth = wonDeals.reduce((sum, d) => sum + d.value, 0);
  const winRate = deals.length > 0 ? Math.round((wonDeals.length / deals.length) * 100) : 100;

  const handleStageChange = async (dealId: string, targetStage: string) => {
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, stage: targetStage } : d));
    try {
      await updateDealStage(dealId, targetStage, targetStage);
    } catch (e) {
      console.warn("Could not persist stage change to DB:", e);
    }
  };

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newValue) return;

    const dealObj = {
      id: "deal_" + Date.now(),
      title: newTitle,
      value: parseFloat(newValue) || 0,
      stage: newStage,
      probability: newProbability,
      expected_close_date: new Date().toISOString().split("T")[0],
      contact: { name: "Direct Client" },
      assignee: { name: "You" }
    };

    setDeals(prev => [dealObj, ...prev]);
    setShowAddModal(false);
    setNewTitle("");
    setNewValue("");

    if (newLeadId) {
      try {
        await createDeal({
          title: newTitle,
          value: parseFloat(newValue) || 0,
          contact_id: newLeadId
        });
      } catch (err) {
        console.warn("Could not save to DB:", err);
      }
    }
  };

  const filteredDeals = deals.filter(d =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.contact?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.assignee?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-sans">
      {/* Top Breadcrumb & Page Banner (Zepfly Style) */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Filter className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Sales Pipeline</h1>
            <p className="text-xs font-semibold text-gray-500">Track deals from first touch to close</p>
          </div>
        </div>

        {/* Top Badges & Action */}
        <div className="flex items-center flex-wrap gap-2.5">
          <span className="px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            • ₹{(weightedPipeline / 100000).toFixed(2)}L <span className="text-[10px] text-blue-500 font-medium">WEIGHTED</span>
          </span>
          <span className="px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold">
            • {totalOpenDeals.length} <span className="text-[10px] text-purple-500 font-medium">OPEN</span>
          </span>
          <span className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
            • {winRate}% <span className="text-[10px] text-emerald-500 font-medium">WIN RATE</span>
          </span>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-full text-xs font-bold transition-all shadow-md shadow-teal-600/20 flex items-center gap-1.5 ml-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New deal
          </button>
        </div>
      </div>

      {/* 4 Stat KPI Cards (Exact Zepfly Design) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Weighted Pipeline */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/70 p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-500">Weighted pipeline</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">₹{(weightedPipeline / 100000).toFixed(2)}L</h3>
              <p className="text-[11px] text-gray-400 mt-1">open deals, by probability</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Gauge className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Open Deals */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/70 p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-500">Open deals</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">{totalOpenDeals.length}</h3>
              <p className="text-[11px] text-gray-400 mt-1">active proposals</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Won This Month */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/70 p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-500">Won this month</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">₹{(wonThisMonth / 100000).toFixed(2)}L</h3>
              <p className="text-[11px] text-gray-400 mt-1">{wonDeals.length} closed deals</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Win Rate */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/70 p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-500">Win rate</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">{winRate}%</h3>
              <p className="text-[11px] text-gray-400 mt-1">all closed deals</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Percent className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: View Switcher & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center bg-white border border-gray-200 rounded-full p-1 shadow-sm">
          <button
            onClick={() => setViewMode("BOARD")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              viewMode === "BOARD" ? "bg-gray-900 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Board
          </button>
          <button
            onClick={() => setViewMode("LIST")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              viewMode === "LIST" ? "bg-gray-900 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <ListIcon className="w-3.5 h-3.5" /> List
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search deals, clients, owners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-full text-xs outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
          />
        </div>
      </div>

      {/* Board View (Kanban Columns) */}
      {viewMode === "BOARD" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-6">
          {stages.map((stage) => {
            const stageDeals = filteredDeals.filter(d => (d.stage || "LEAD").toUpperCase() === stage.key);
            const stageSum = stageDeals.reduce((acc, d) => acc + (d.value || 0), 0);

            return (
              <div key={stage.key} className="bg-gray-100/70 rounded-3xl p-3 flex flex-col min-h-[500px]">
                {/* Column Header */}
                <div className="flex items-center justify-between px-2 py-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                    <span className="text-xs font-black text-gray-800 tracking-tight">{stage.label}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-gray-600 shadow-xs">
                      {stageDeals.length}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">
                    ₹{(stageSum / 1000).toFixed(0)}k
                  </span>
                </div>

                {/* Deal Cards Container */}
                <div className="flex-1 space-y-3">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all group space-y-3 cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-teal-600 transition-colors">
                            {deal.title}
                          </h4>
                          <p className="text-[11px] text-gray-400 mt-0.5">{deal.contact?.name || "Client project"}</p>
                        </div>
                      </div>

                      <div className="text-base font-black text-gray-900">
                        ₹{deal.value?.toLocaleString("en-IN")}
                      </div>

                      {/* Card Bottom Meta */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[10px] font-semibold text-gray-500">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-gray-100 font-bold text-gray-700">
                            {deal.probability}%
                          </span>
                          <span className="flex items-center gap-1 text-gray-400">
                            <Calendar className="w-3 h-3" />
                            {deal.expected_close_date ? deal.expected_close_date.substring(5) : "28 Nov"}
                          </span>
                        </div>

                        {/* Move stage dropdown quick action */}
                        <select
                          value={deal.stage}
                          onChange={(e) => handleStageChange(deal.id, e.target.value)}
                          className="bg-gray-50 border border-gray-200 text-[10px] font-bold rounded-lg px-1.5 py-0.5 outline-none hover:bg-gray-100"
                        >
                          {stages.map(s => (
                            <option key={s.key} value={s.key}>{s.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  {stageDeals.length === 0 && (
                    <div className="h-28 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center text-xs text-gray-400 font-medium">
                      No deals in {stage.label}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold border-b border-gray-100">
              <tr>
                <th className="p-4">Deal Title</th>
                <th className="p-4">Client</th>
                <th className="p-4">Value</th>
                <th className="p-4">Stage</th>
                <th className="p-4">Probability</th>
                <th className="p-4">Expected Date</th>
                <th className="p-4">Assignee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
              {filteredDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="p-4 font-bold text-gray-900">{deal.title}</td>
                  <td className="p-4 text-gray-500">{deal.contact?.name || "Direct"}</td>
                  <td className="p-4 font-black text-gray-900">₹{deal.value?.toLocaleString("en-IN")}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {deal.stage}
                    </span>
                  </td>
                  <td className="p-4">{deal.probability}%</td>
                  <td className="p-4 text-gray-400">{deal.expected_close_date || "28 Nov 2026"}</td>
                  <td className="p-4">{deal.assignee?.name || "Aarav"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Deal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-900 text-base">Create New Pipeline Deal</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-700 font-bold">×</button>
            </div>

            <form onSubmit={handleCreateDeal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Deal Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Royal Banquets Website"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Deal Value (₹) *</label>
                <input
                  type="number"
                  placeholder="e.g. 150000"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Stage</label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-bold"
                  >
                    {stages.map(s => (
                      <option key={s.key} value={s.key}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Probability (%)</label>
                  <input
                    type="number"
                    value={newProbability}
                    onChange={(e) => setNewProbability(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-bold text-xs shadow-md shadow-teal-600/20 hover:from-teal-700 hover:to-cyan-700 transition-all cursor-pointer"
              >
                Save Deal to Pipeline
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
