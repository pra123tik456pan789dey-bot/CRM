"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  FileText,
  Zap,
  LifeBuoy,
  MessageSquare,
  PhoneCall,
  BarChart3,
  Shield,
  Settings,
  Search,
  Bell,
  LogOut,
  UserCheck,
  User
} from "lucide-react";
import { signOut } from "next-auth/react";

export default function DashboardLayoutClient({
  children,
  session
}: {
  children: React.ReactNode;
  session: any;
}) {
  const pathname = usePathname();
  const currentUser = session?.user || { name: "Amit Sharma", email: "admin@crm.com", role: "SUPERADMIN" };
  const userRole = currentUser.role || "SUPERADMIN";

  const getInitials = (name: string) => {
    if (!name) return "US";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getRoleLabel = (role: string) => {
    if (role === "SUPERADMIN") return "Super Admin";
    if (role === "MANAGER") return "Sales Manager";
    return "Sales Executive";
  };

  return (
    <div className="flex h-screen bg-gray-50/50 text-gray-800 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm z-10">
        <div className="h-16 flex items-center px-6 border-b border-gray-100 mb-4 mt-2">
          <div className="flex items-center space-x-2 text-indigo-600 font-bold text-2xl">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
              A
            </div>
            <span>ApexCRM</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1 px-4">
            <li className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-4 px-2">
              Main CRM
            </li>
            <li>
              <Link
                href="/"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  pathname === "/" ? "bg-indigo-50 text-indigo-700 font-bold" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <LayoutDashboard className="w-5 h-5 text-indigo-600" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/leads"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  pathname?.startsWith("/leads") ? "bg-indigo-50 text-indigo-700 font-bold" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Users className="w-5 h-5 text-indigo-600" />
                Leads & Deals
              </Link>
            </li>
            <li>
              <Link
                href="/tasks"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  pathname === "/tasks" ? "bg-indigo-50 text-indigo-700 font-bold" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <CheckSquare className="w-5 h-5 text-indigo-600" />
                Tasks & Reminders
              </Link>
            </li>

            {/* Enterprise Modules */}
            <li className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6 px-2">
              Enterprise Modules
            </li>
            <li>
              <Link
                href="/invoices"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  pathname === "/invoices" ? "bg-purple-50 text-purple-700 font-bold" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FileText className="w-5 h-5 text-purple-600" />
                GST Invoicing & Billing
              </Link>
            </li>

            {userRole !== "SALESEXECUTIVE" && (
              <li>
                <Link
                  href="/automations"
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                    pathname === "/automations" ? "bg-amber-50 text-amber-700 font-bold" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Zap className="w-5 h-5 text-amber-500" />
                  Workflow Automations
                </Link>
              </li>
            )}

            <li>
              <Link
                href="/tickets"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  pathname === "/tickets" ? "bg-rose-50 text-rose-700 font-bold" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <LifeBuoy className="w-5 h-5 text-rose-600" />
                Support Helpdesk SLA
              </Link>
            </li>

            <li className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6 px-2">
              Communications
            </li>
            <li>
              <Link
                href="/messages"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  pathname === "/messages" ? "bg-emerald-50 text-emerald-700 font-bold" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                WhatsApp Inbox
              </Link>
            </li>
            <li>
              <Link
                href="/calls"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  pathname === "/calls" ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <PhoneCall className="w-5 h-5 text-blue-600" />
                Telephony & Calls
              </Link>
            </li>
            <li>
              <Link
                href="/ads"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  pathname === "/ads" ? "bg-purple-50 text-purple-700 font-bold" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Ads Analytics
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-1">
          {userRole === "SUPERADMIN" && (
            <Link
              href="/super-admin"
              className="flex items-center gap-3 px-3 py-2 text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg font-semibold text-xs transition-colors"
            >
              <Shield className="w-4 h-4 text-purple-600" />
              SaaS Super Panel
            </Link>
          )}

          {userRole !== "SALESEXECUTIVE" && (
            <Link
              href="/settings"
              className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-400" />
              Settings
            </Link>
          )}

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium text-xs transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-500" /> Logout ({currentUser.name?.split(" ")[0]})
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Global Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 z-10">
          <div className="flex-1 max-w-xl">
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search leads, invoices, tickets, automations..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-5 ml-4">
            <button className="text-gray-400 hover:text-gray-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Logged in User Profile Info */}
            <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                {getInitials(currentUser.name)}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-gray-900 leading-tight">{currentUser.name || "User"}</p>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  userRole === "SUPERADMIN" ? "bg-purple-100 text-purple-800" :
                  userRole === "MANAGER" ? "bg-indigo-100 text-indigo-800" : "bg-emerald-100 text-emerald-800"
                }`}>
                  {getRoleLabel(userRole)}
                </span>
              </div>
            </div>

            <Link
              href="/login"
              className="text-xs font-semibold text-indigo-600 hover:underline border border-indigo-200 px-3 py-1.5 rounded-lg bg-indigo-50/50"
            >
              Switch Login
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
