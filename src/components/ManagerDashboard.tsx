"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  UserCheck,
  Shield,
  Phone,
  MessageCircle,
  Sparkles
} from "lucide-react";

export default function ManagerDashboard({ data }: { data: any }) {
  const stats = data?.stats || { totalLeads: 0, unassignedCount: 0, wonCount: 0, activeExecutivesCount: 0 };
  const executives: any[] = data?.salesExecutives || [];
  const unassignedLeads: any[] = data?.unassignedLeads || [];
  const recentTeamLeads: any[] = data?.recentTeamLeads || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 🟣 TOP MANAGER OPERATIONS HEADER */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-purple-100 mb-2">
            <UserCheck className="w-3.5 h-3.5 text-purple-200" />
            Manager & HR Operations Panel
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Team Performance & Lead Distribution
          </h1>
          <p className="text-xs sm:text-sm text-purple-100/90 mt-1">
            Monitor executive calling activity, distribute incoming leads, and review pipelines.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/leads"
            className="px-4 py-2 bg-white text-purple-900 rounded-xl font-bold text-xs shadow-md hover:bg-purple-50 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-purple-600" /> Distribute Leads
          </Link>
          <Link
            href="/staff"
            className="px-4 py-2 bg-purple-900/60 text-white rounded-xl font-bold text-xs border border-white/20 hover:bg-purple-900/80 transition-all flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" /> Manage Staff
          </Link>
        </div>
      </div>

      {/* 📊 4 KEY TEAM METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">Total Leads</p>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">{stats.totalLeads}</h3>
            <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">Across all campaigns</p>
          </div>
          <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-amber-500 uppercase tracking-wider">Unassigned</p>
            <h3 className="text-xl sm:text-2xl font-black text-amber-600 mt-1">{stats.unassignedCount}</h3>
            <p className="text-[11px] text-amber-700 font-semibold mt-0.5">Needs distribution</p>
          </div>
          <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">Active Callers</p>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">{stats.activeExecutivesCount}</h3>
            <p className="text-[11px] text-purple-600 font-semibold mt-0.5">Sales Executives</p>
          </div>
          <div className="w-11 h-11 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <PhoneCall className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">Won Deals</p>
            <h3 className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">{stats.wonCount}</h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Closed conversions</p>
          </div>
          <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 👔 SALES EXECUTIVES WORKLOAD & CALLS LEADERBOARD */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-gray-900 text-base">Sales Executives & Calling Activity</h3>
            <p className="text-xs text-gray-500">Live lead distribution across your telecalling team.</p>
          </div>
          <Link
            href="/staff"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            Manage Team <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {executives.map((exec) => (
            <div
              key={exec.id}
              className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200/70 space-y-3 hover:border-indigo-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
                    {exec.name?.substring(0, 2).toUpperCase() || "EX"}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{exec.name}</h4>
                    <p className="text-[11px] text-gray-500 font-mono">{exec.email}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200/50 text-center">
                <div className="bg-white p-2 rounded-xl border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase block">Assigned Leads</span>
                  <span className="text-base font-black text-gray-900">{exec._count?.assignedLeads || 0}</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase block">Total Calls</span>
                  <span className="text-base font-black text-indigo-600">{exec._count?.callLogs || 0}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-xs text-gray-500 font-mono">{exec.phone || "No direct phone"}</span>
                <Link
                  href={`/leads`}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  View Leads →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ⚠️ UNASSIGNED LEADS WAITING FOR ALLOCATION */}
      {unassignedLeads.length > 0 && (
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-3xl p-5 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-gray-900 text-sm">
                Unassigned Leads Waiting ({unassignedLeads.length})
              </h3>
            </div>
            <Link
              href="/leads"
              className="px-3 py-1.5 bg-amber-600 text-white rounded-xl font-bold text-xs shadow-xs hover:bg-amber-700 transition-colors"
            >
              Bulk Distribute Now →
            </Link>
          </div>

          <div className="space-y-2">
            {unassignedLeads.map((lead) => (
              <div
                key={lead.id}
                className="bg-white p-3 rounded-2xl border border-amber-200/60 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-gray-900">{lead.name}</span>
                  <span className="text-gray-400 ml-2 font-mono">{lead.phone || "No phone"}</span>
                  <span className="text-gray-400 ml-2">Source: {lead.source}</span>
                </div>
                <Link
                  href={`/leads/${lead.id}`}
                  className="text-indigo-600 font-bold hover:underline"
                >
                  Assign →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
