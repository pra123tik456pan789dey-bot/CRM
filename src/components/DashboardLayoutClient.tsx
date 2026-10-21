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
  Menu,
  X,
  Smartphone,
  UserPlus,
  Filter,
  Wallet,
  Sparkles,
  Download
} from "lucide-react";
import { signOut } from "next-auth/react";
import { createEmployeeUserAction } from "@/app/actions/authActions";
import TopDemoWorkspaceBanner from "@/components/TopDemoWorkspaceBanner";
import FloatingAIVoiceOrb from "@/components/FloatingAIVoiceOrb";

export default function DashboardLayoutClient({
  children,
  session
}: {
  children: React.ReactNode;
  session: any;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global Add Staff Account Modal State
  const [showGlobalAddUserModal, setShowGlobalAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<"MANAGER" | "SALESEXECUTIVE" | "SUPERADMIN">("SALESEXECUTIVE");
  const [newUserPhone, setNewUserPhone] = useState("");
  const [userMsg, setUserMsg] = useState<string | null>(null);

  const handleGlobalCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail || !newUserPassword) return;
    const res = await createEmployeeUserAction({
      name: newUserName,
      email: newUserEmail,
      password: newUserPassword,
      role: newUserRole,
      phone: newUserPhone
    });

    if (res.success) {
      setUserMsg(res.message || "Account created successfully");
      setNewUserName("");
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserPhone("");
      setShowGlobalAddUserModal(false);
      setTimeout(() => setUserMsg(null), 4000);
    } else {
      setUserMsg(`Error: ${res.error || "Failed to create account"}`);
    }
  };

  const currentUser = session?.user || { name: "Aarav Mehta", email: "demo@brightwave.app", role: "SUPERADMIN" };
  const userRole = currentUser.role || "SALESEXECUTIVE";

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

  // Zepfly-Style Categorized Navigation
  const allNavLinks = [
    // AGENCY
    { href: "/", label: userRole === "SALESEXECUTIVE" ? "Calling Desk" : userRole === "MANAGER" ? "Command Center" : "Command Center", icon: LayoutDashboard, category: "agency", roles: ["SUPERADMIN", "MANAGER", "SALESEXECUTIVE"] },
    { href: "/pipeline", label: "Sales Pipeline", icon: Filter, category: "agency", roles: ["SUPERADMIN", "MANAGER", "SALESEXECUTIVE"] },
    { href: "/leads", label: "Leads & Opportunities", icon: Users, category: "agency", roles: ["SUPERADMIN", "MANAGER", "SALESEXECUTIVE"] },

    // OPERATE
    { href: "/finance", label: "Finance & MRR", icon: Wallet, category: "operate", roles: ["SUPERADMIN", "MANAGER"] },
    { href: "/hr", label: "Team & HR", icon: Users, category: "operate", roles: ["SUPERADMIN", "MANAGER"] },
    { href: "/personal", label: "Personal Space", icon: Sparkles, category: "operate", roles: ["SUPERADMIN", "MANAGER", "SALESEXECUTIVE"] },

    // COMMUNICATIONS & OPERATIONS
    { href: "/messages", label: "WhatsApp Inbox", icon: MessageSquare, category: "comm", roles: ["SUPERADMIN", "MANAGER", "SALESEXECUTIVE"] },
    { href: "/calls", label: "Telephony & Calls", icon: PhoneCall, category: "comm", roles: ["SUPERADMIN", "MANAGER", "SALESEXECUTIVE"] },
    { href: "/tasks", label: "Tasks & Reminders", icon: CheckSquare, category: "comm", roles: ["SUPERADMIN", "MANAGER", "SALESEXECUTIVE"] },

    // MARKETING & BILLING
    { href: "/ads", label: "Meta Ads Analytics", icon: BarChart3, category: "module", roles: ["SUPERADMIN", "MANAGER"] },
    { href: "/invoices", label: "GST Billing", icon: FileText, category: "module", roles: ["SUPERADMIN"] },
    { href: "/tickets", label: "Helpdesk SLA", icon: LifeBuoy, category: "module", roles: ["SUPERADMIN", "MANAGER"] },
    { href: "/automations", label: "Automations", icon: Zap, category: "module", roles: ["SUPERADMIN"] },
  ];

  const navLinks = allNavLinks.filter((item) => item.roles.includes(userRole));

  // PWA Quick Install trigger
  const handleInstallClick = () => {
    // If beforeinstallprompt exists, trigger it; else show instructions
    const promptEvent = (window as any).__deferredPwaPrompt;
    if (promptEvent) {
      promptEvent.prompt();
    } else {
      alert("📲 To install this CRM as an app on your phone or PC:\n\n1. In Chrome/Edge: Click the 'Install' icon in the URL bar, or click Menu (3 dots) -> 'Install App' / 'Add to Home Screen'.\n2. On iPhone Safari: Tap Share -> 'Add to Home Screen'.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#eef2fb]/60 text-gray-800 font-sans overflow-hidden">
      {/* Top Demo Workspace Banner (Zepfly Style) */}
      <TopDemoWorkspaceBanner />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar (Zepfly Agency OS Design) */}
        <aside className="hidden md:flex w-64 bg-white/90 backdrop-blur-xl border-r border-gray-200/80 flex-col shadow-xs z-20 flex-shrink-0">
          <div className="h-16 flex items-center px-6 border-b border-gray-100 mb-1 mt-1">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-500/20 text-sm">
                A
              </div>
              <div>
                <span className="tracking-tight text-gray-900 font-black text-base block leading-none">
                  Brightwave
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Agency OS
                </span>
              </div>
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-5 scrollbar-thin">
            {/* AGENCY */}
            <div>
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider px-3 mb-1.5 block">
                Agency
              </span>
              <ul className="space-y-1">
                {navLinks.filter(l => l.category === "agency").map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-3.5 py-2 rounded-xl font-bold text-xs transition-all ${
                          active
                            ? "bg-gray-900 text-white shadow-sm"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${active ? "text-cyan-400" : "text-gray-500"}`} />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* OPERATE */}
            <div>
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider px-3 mb-1.5 block">
                Operate
              </span>
              <ul className="space-y-1">
                {navLinks.filter(l => l.category === "operate").map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href || pathname?.startsWith(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-3.5 py-2 rounded-xl font-bold text-xs transition-all ${
                          active
                            ? "bg-gray-900 text-white shadow-sm"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${active ? "text-cyan-400" : "text-gray-500"}`} />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* COMMUNICATIONS */}
            <div>
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider px-3 mb-1.5 block">
                Communications
              </span>
              <ul className="space-y-1">
                {navLinks.filter(l => l.category === "comm").map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-3.5 py-2 rounded-xl font-bold text-xs transition-all ${
                          active
                            ? "bg-gray-900 text-white shadow-sm"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${active ? "text-cyan-400" : "text-gray-500"}`} />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* MARKETING & BILLING */}
            {navLinks.some(l => l.category === "module") && (
              <div>
                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider px-3 mb-1.5 block">
                  Marketing & Billing
                </span>
                <ul className="space-y-1">
                  {navLinks.filter(l => l.category === "module").map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 px-3.5 py-2 rounded-xl font-bold text-xs transition-all ${
                            active
                              ? "bg-gray-900 text-white shadow-sm"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${active ? "text-cyan-400" : "text-gray-500"}`} />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </nav>

          {/* Sidebar Footer Controls */}
          <div className="p-3 border-t border-gray-100 space-y-1 bg-gray-50/50">
            {(userRole === "SUPERADMIN" || userRole === "MANAGER") && (
              <Link
                href="/settings"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-xs transition-colors ${
                  pathname === "/settings" ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-white"
                }`}
              >
                <Settings className="w-4 h-4 text-gray-500" />
                Settings & Integrations
              </Link>
            )}

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl font-bold text-xs transition-colors"
            >
              <LogOut className="w-4 h-4 text-red-500" /> Logout ({currentUser.name?.split(" ")[0]})
            </button>
          </div>
        </aside>

        {/* Mobile Slide-Over Navigation Menu */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <div
          className={`fixed top-0 left-0 bottom-0 w-72 bg-white z-50 flex flex-col transform transition-transform duration-300 md:hidden shadow-2xl ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100">
            <div className="flex items-center space-x-2 text-indigo-600 font-bold text-lg">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white flex items-center justify-center font-bold">
                A
              </div>
              <span className="text-gray-900 font-black">Brightwave OS</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-900 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-3">
            <ul className="space-y-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs ${
                        active ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Main Content Workspace */}
        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Top Header Bar */}
          <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200/80 flex items-center justify-between px-4 sm:px-6 z-10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl md:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Search or jump to... (with ⌘K shortcut hint - Zepfly Style) */}
              <div className="relative hidden md:block w-72 lg:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search or jump to... (⌘K / Ctrl+K)"
                  className="w-full pl-9 pr-10 py-1.5 bg-gray-100/80 border border-transparent focus:border-gray-300 rounded-full text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-200">
                  ⌘K
                </span>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* 📲 PWA App Download Button */}
              <button
                onClick={handleInstallClick}
                className="px-3 py-1.5 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-teal-500/20 cursor-pointer"
                title="Download CRM as Android / PC App"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install App</span>
              </button>

              {/* + Create Staff ID Button */}
              {(userRole === "SUPERADMIN" || userRole === "MANAGER") && (
                <button
                  onClick={() => setShowGlobalAddUserModal(true)}
                  className="hidden sm:flex px-3.5 py-1.5 bg-gray-900 text-white rounded-full text-xs font-bold hover:bg-black transition-all items-center gap-1.5 shadow-sm"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Staff ID</span>
                </button>
              )}

              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full border border-white" />
              </button>

              {/* User Avatar Circle */}
              <div className="flex items-center gap-2 pl-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                  {getInitials(currentUser.name)}
                </div>
              </div>
            </div>
          </header>

          {/* Feedback message banner */}
          {userMsg && (
            <div className="mx-4 sm:mx-8 mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold rounded-2xl flex justify-between items-center shadow-xs">
              <span>✅ {userMsg}</span>
              <button onClick={() => setUserMsg(null)} className="font-extrabold text-sm ml-2">×</button>
            </div>
          )}

          {/* Page Main Content Area */}
          <div className="flex-1 overflow-auto p-3 sm:p-6 lg:p-8 pb-24 md:pb-10">
            {children}
          </div>
        </main>
      </div>

      {/* Floating 3D Siri / Gemini Voice AI Orb (Active Everywhere) */}
      <FloatingAIVoiceOrb />

      {/* Global Create Staff Account Modal */}
      {showGlobalAddUserModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-900 text-base">Create Staff ID & Password</h3>
              <button onClick={() => setShowGlobalAddUserModal(false)} className="text-gray-400 hover:text-gray-700 font-bold">×</button>
            </div>

            <form onSubmit={handleGlobalCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Work Email (Login ID) *</label>
                <input
                  type="email"
                  placeholder="priya@company.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Login Password *</label>
                <input
                  type="password"
                  placeholder="Set password (e.g. Priya@123)"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Role / Designation *</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="SALESEXECUTIVE">Sales Executive</option>
                    <option value="MANAGER">Sales Manager</option>
                    <option value="SUPERADMIN">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number</label>
                  <input
                    type="text"
                    placeholder="9876543210"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-indigo-600 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Create Staff Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
