"use client";

import React, { useState } from "react";
import {
  Wallet,
  TrendingUp,
  CreditCard,
  Clock,
  ArrowUpRight,
  DollarSign,
  PieChart as PieIcon,
  CheckCircle2,
  FileText,
  AlertCircle
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ComposedChart
} from "recharts";

export default function FinanceStudioView({ initialInvoices }: { initialInvoices: any[] }) {
  const [timeFilter, setTimeFilter] = useState<"ALL" | "MONTH" | "TODAY">("ALL");
  const [financeTab, setFinanceTab] = useState<"PROJECT" | "ALL">("PROJECT");

  // Sample or live monthly finance chart data (Nov to Oct)
  const chartData = [
    { month: "Nov 25", workBooked: 20000, paymentBooked: 10000, mrr: 10000 },
    { month: "Jan 26", workBooked: 50000, paymentBooked: 40000, mrr: 20000 },
    { month: "Mar", workBooked: 90000, paymentBooked: 70000, mrr: 40000 },
    { month: "May", workBooked: 140000, paymentBooked: 90000, mrr: 60000 },
    { month: "Jun", workBooked: 280000, paymentBooked: 120000, mrr: 80000 },
    { month: "Jul", workBooked: 450000, paymentBooked: 290000, mrr: 90000 },
    { month: "Aug", workBooked: 680000, paymentBooked: 420000, mrr: 100000 },
    { month: "Sept", workBooked: 520000, paymentBooked: 350000, mrr: 100000 },
    { month: "Oct", workBooked: 480000, paymentBooked: 240000, mrr: 100000 }
  ];

  const clientsCollecting = [
    { name: "Apex Diagnostics", booked: "₹3.85L", paid: "₹2.15L", pending: "₹1.70L", percent: 56 },
    { name: "Royal Banquets", booked: "₹2.40L", paid: "₹1.20L", pending: "₹1.20L", percent: 50 },
    { name: "Spice Route Foods", booked: "₹1.50L", paid: "₹0.75L", pending: "₹0.75L", percent: 50 },
    { name: "Nova Interiors", booked: "₹1.80L", paid: "₹1.20L", pending: "₹0.60L", percent: 66 },
    { name: "SmileCare Dental", booked: "₹2.20L", paid: "₹1.50L", pending: "₹0.70L", percent: 68 },
    { name: "Urban Threads", booked: "₹1.95L", paid: "₹1.50L", pending: "₹0.45L", percent: 77 }
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-sans">
      {/* Top Banner (Zepfly Style) */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Finance</h1>
            <p className="text-xs font-semibold text-gray-500">Project money & company ledger</p>
          </div>
        </div>

        {/* Top Right Switches */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 p-1 rounded-2xl">
            <button
              onClick={() => setFinanceTab("PROJECT")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                financeTab === "PROJECT" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Company project finance
            </button>
            <button
              onClick={() => setFinanceTab("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                financeTab === "ALL" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              All over finance
            </button>
          </div>
        </div>
      </div>

      {/* Revenue Section Header with Time Filters */}
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200/70 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-lg font-black text-gray-900">Revenue</h3>
            <p className="text-xs text-gray-500">Project money and where every rupee comes from and goes</p>
          </div>

          <div className="flex items-center bg-gray-100 p-1 rounded-full text-xs font-bold">
            <button
              onClick={() => setTimeFilter("ALL")}
              className={`px-3.5 py-1 rounded-full transition-all ${
                timeFilter === "ALL" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              All time
            </button>
            <button
              onClick={() => setTimeFilter("MONTH")}
              className={`px-3.5 py-1 rounded-full transition-all ${
                timeFilter === "MONTH" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              This month
            </button>
            <button
              onClick={() => setTimeFilter("TODAY")}
              className={`px-3.5 py-1 rounded-full transition-all ${
                timeFilter === "TODAY" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Today
            </button>
          </div>
        </div>

        {/* 5 Financial Metric Badges */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-2">
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">MRR</span>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">₹1L</p>
            <span className="text-[10px] text-gray-400">Set by hand, every month</span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">WORK BOOKED</span>
            <p className="text-2xl font-black text-gray-900 mt-0.5">₹20.97L</p>
            <span className="text-[10px] text-gray-400">Project value added</span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">PAYMENT BOOKED</span>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">₹11.56L</p>
            <span className="text-[10px] text-gray-400">Money in all time</span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">TOTAL WORK</span>
            <p className="text-2xl font-black text-gray-900 mt-0.5">₹20.97L</p>
            <span className="text-[10px] text-gray-400">₹11.56L booked so far</span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">PENDING</span>
            <p className="text-2xl font-black text-amber-500 mt-0.5">₹9.41L</p>
            <span className="text-[10px] text-gray-400">Still to collect</span>
          </div>
        </div>

        {/* Monthly Bar & Line Chart (Zepfly Style) */}
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#9ca3af"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
              />
              <Tooltip
                formatter={(val: any) => [`₹${(Number(val) / 1000).toFixed(0)}k`, ""]}
                contentStyle={{ borderRadius: "16px", border: "1px solid #e5e7eb", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", fontWeight: "bold" }} />
              <Bar dataKey="workBooked" name="Work booked" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={20} />
              <Bar dataKey="paymentBooked" name="Payment booked" fill="#10b981" radius={[6, 6, 0, 0]} barSize={20} />
              <Line type="monotone" dataKey="mrr" name="MRR" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Money to Collect by Client Section (Exact Zepfly Design) */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-black text-gray-900">Money to collect · by client</h3>
            <p className="text-xs text-gray-500">Track pending balances and milestones</p>
          </div>
          <span className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer">All clients</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {clientsCollecting.map((client, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-200/70 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900 text-sm">{client.name}</span>
                <span className="font-black text-amber-600 text-sm">{client.pending}</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-teal-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${client.percent}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-gray-500 font-semibold">
                <span>{client.paid} booked of {client.booked}</span>
                <span>{client.percent}% collected</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
