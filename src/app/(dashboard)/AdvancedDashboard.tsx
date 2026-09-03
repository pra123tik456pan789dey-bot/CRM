"use client";

import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from "recharts";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  DollarSign,
  Phone,
  MessageCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles
} from "lucide-react";

const SOURCE_COLORS: Record<string, string> = {
  WEBSITE: "#3B82F6",
  FACEBOOK: "#8B5CF6",
  GOOGLE: "#10B981",
  WHATSAPP: "#22C55E",
  REFERRAL: "#F59E0B",
  MANUAL: "#64748B"
};

export default function AdvancedDashboard({ stats }: { stats: any }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="p-8 text-center text-gray-500">Loading Dashboard Analytics...</div>;

  const pieData = (stats.leadSourceBreakdown || []).map((item: any) => ({
    name: item.source,
    value: item._count.source
  }));

  const statusData = (stats.leadStatusBreakdown || []).map((item: any) => ({
    name: item.status,
    count: item._count.status
  }));

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">Total Leads</p>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">{stats.totalLeads || 0}</h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12% this month
            </p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Revenue Pipeline</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">
              ₹{(stats.totalPipelineValue || 0).toLocaleString("en-IN")}
            </h3>
            <p className="text-xs text-gray-500 mt-1">Deals in active stages</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">WhatsApp Messages</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalMessages || 0}</h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1">Meta Cloud API Live</p>
          </div>
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Calls Recorded</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalCalls || 0}</h3>
            <p className="text-xs text-indigo-600 font-semibold mt-1">Twilio Integration</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Phone className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Middle Row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Pipeline Stage Breakdown */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 text-base mb-1">Sales Pipeline Funnel</h3>
          <p className="text-xs text-gray-500 mb-6">Distribution of leads across active status stages.</p>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{ fill: "#f8fafc" }} />
                <Bar dataKey="count" fill="#4F46E5" radius={[6, 6, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Source Pie Chart */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-base mb-1">Lead Source Attribution</h3>
            <p className="text-xs text-gray-500 mb-4">Where your highest converting leads come from.</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  dataKey="value"
                  paddingAngle={4}
                >
                  {pieData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={SOURCE_COLORS[entry.name] || "#4F46E5"} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-2 justify-center pt-2">
            {pieData.map((item: any, i: number) => (
              <span key={i} className="text-xs font-semibold px-2.5 py-1 rounded-md text-gray-700 border flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: SOURCE_COLORS[item.name] || "#4F46E5" }}
                />
                {item.name}: {item.value}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Unified Activity Feed */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" /> Recent Live Interaction Stream
          </h3>
          <Link href="/leads" className="text-xs font-semibold text-indigo-600 hover:underline">
            View All Leads →
          </Link>
        </div>

        <div className="divide-y divide-gray-100">
          {(stats.recentActivities || []).map((act: any) => (
            <div key={act.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                  {act.type.substring(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{act.content}</p>
                  <p className="text-xs text-gray-500">
                    Lead: <span className="font-semibold">{act.contact?.name}</span> • Agent: {act.agent?.name || "System"}
                  </p>
                </div>
              </div>

              <span className="text-xs text-gray-400 font-mono">
                {new Date(act.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
