"use client";

import React, { useState } from "react";
import {
  Users,
  Clock,
  Calendar,
  CheckCircle2,
  FileText,
  UserCheck,
  UserX,
  Plus,
  Shield,
  Briefcase
} from "lucide-react";

export default function TeamHRView({ users }: { users: any[] }) {
  const [activeTab, setActiveTab] = useState<"ATTENDANCE" | "LEAVES" | "PAYROLL">("ATTENDANCE");

  // Sample or live attendance records
  const [attendance, setAttendance] = useState([
    { name: "Ravi Kumar", role: "Sales Executive", clockIn: "09:30 AM", clockOut: "Running", status: "PRESENT", callsMade: 42 },
    { name: "Ananya Iyer", role: "Sales Executive", clockIn: "09:45 AM", clockOut: "Running", status: "PRESENT", callsMade: 38 },
    { name: "Kabir Singh", role: "Business Dev Exec", clockIn: "10:00 AM", clockOut: "Running", status: "PRESENT", callsMade: 29 },
    { name: "Neha Sharma", role: "HR & Admin Lead", clockIn: "09:15 AM", clockOut: "Running", status: "PRESENT", callsMade: 5 },
    { name: "Harsh Malhotra", role: "SEO Specialist", clockIn: "--", clockOut: "--", status: "LEAVE", callsMade: 0 }
  ]);

  const [leaves, setLeaves] = useState([
    { employee: "Harsh Malhotra", type: "Sick Leave", dates: "21 Oct - 22 Oct", reason: "Viral fever", status: "APPROVED" },
    { employee: "Ravi Kumar", type: "Casual Leave", dates: "28 Oct", reason: "Family event", status: "PENDING" }
  ]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-sans">
      {/* Top Banner (Zepfly Style) */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Team & HR</h1>
            <p className="text-xs font-semibold text-gray-500">Attendance, leave approvals & auto-payroll</p>
          </div>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center gap-1.5">
          {[
            { id: "ATTENDANCE", label: "Live Attendance" },
            { id: "LEAVES", label: "Leave Requests" },
            { id: "PAYROLL", label: "Payroll Preview" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-gray-900 text-white shadow-sm"
                  : "bg-gray-100/80 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm">
          <p className="text-xs font-bold text-gray-400">Total Staff</p>
          <h3 className="text-2xl font-black text-gray-900 mt-1">{users.length > 0 ? users.length : 15}</h3>
          <p className="text-[11px] text-gray-400 mt-1">active accounts</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm">
          <p className="text-xs font-bold text-gray-400">Present Today</p>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">4 Staff</h3>
          <p className="text-[11px] text-gray-400 mt-1">clocked in & active</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm">
          <p className="text-xs font-bold text-gray-400">On Leave</p>
          <h3 className="text-2xl font-black text-amber-500 mt-1">1 Staff</h3>
          <p className="text-[11px] text-gray-400 mt-1">approved leave</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm">
          <p className="text-xs font-bold text-gray-400">Calls Handled Today</p>
          <h3 className="text-2xl font-black text-indigo-600 mt-1">109 Calls</h3>
          <p className="text-[11px] text-gray-400 mt-1">across all sales executives</p>
        </div>
      </div>

      {/* Tab 1: Live Attendance */}
      {activeTab === "ATTENDANCE" && (
        <div className="bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold border-b border-gray-100">
              <tr>
                <th className="p-4">Employee</th>
                <th className="p-4">Designation</th>
                <th className="p-4">Clock In</th>
                <th className="p-4">Clock Out</th>
                <th className="p-4">Today's Calls</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
              {attendance.map((att, idx) => (
                <tr key={idx} className="hover:bg-gray-50/70 transition-colors">
                  <td className="p-4 font-bold text-gray-900">{att.name}</td>
                  <td className="p-4 text-gray-500">{att.role}</td>
                  <td className="p-4 font-mono text-gray-600">{att.clockIn}</td>
                  <td className="p-4 font-mono text-gray-600">{att.clockOut}</td>
                  <td className="p-4 font-bold text-indigo-600">{att.callsMade} calls</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      att.status === "PRESENT" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      {att.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Leaves */}
      {activeTab === "LEAVES" && (
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm space-y-4">
          <h3 className="font-black text-gray-900 text-base">Leave Applications</h3>
          <div className="space-y-3">
            {leaves.map((leave, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-200/70 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{leave.employee} — <span className="text-gray-500">{leave.type}</span></h4>
                  <p className="text-xs text-gray-500 mt-0.5">Dates: {leave.dates} · Reason: {leave.reason}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    leave.status === "APPROVED" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    {leave.status}
                  </span>
                  {leave.status === "PENDING" && (
                    <button
                      onClick={() => setLeaves(leaves.map((l, i) => i === idx ? { ...l, status: "APPROVED" } : l))}
                      className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Payroll Preview */}
      {activeTab === "PAYROLL" && (
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm space-y-4">
          <h3 className="font-black text-gray-900 text-base">October 2026 Salary Slips Preview</h3>
          <p className="text-xs text-gray-500">Auto-generated based on attendance and closed deal commissions.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {[
              { name: "Ravi Kumar", base: "₹25,000", incentive: "₹8,500 (Won 2 deals)", total: "₹33,500" },
              { name: "Ananya Iyer", base: "₹25,000", incentive: "₹6,000 (Won 1 deal)", total: "₹31,000" },
              { name: "Kabir Singh", base: "₹30,000", incentive: "₹12,000 (Won 3 deals)", total: "₹42,000" },
              { name: "Neha Sharma", base: "₹35,000", incentive: "₹0", total: "₹35,000" }
            ].map((p, i) => (
              <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-200/70 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-gray-900 text-sm">{p.name}</h4>
                  <span className="text-base font-black text-emerald-600">{p.total}</span>
                </div>
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>Base: {p.base}</span>
                  <span>Incentive: {p.incentive}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
