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
  Smartphone
} from "lucide-react";
import { signOut } from "next-auth/react";
import { createEmployeeUserAction } from "@/app/actions/authActions";

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
      setUserMsg(res.message);
      setNewUserName("");
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserPhone("");
      setShowGlobalAddUserModal(false);
      setTimeout(() => setUserMsg(null), 4000);
    } else {
      setUserMsg(`Error: ${res.error}`);
    }
  };

  const currentUser = session?.user || { name: "User", email: "user@crm.com", role: "SALESEXECUTIVE" };
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

  const navLinks = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard, category: "main" },
    { href: "/leads", label: "Leads & Deals", icon: Users, category: "main" },
    { href: "/tasks", label: "Tasks & Reminders", icon: CheckSquare, category: "main" },
    { href: "/messages", label: "WhatsApp Inbox", icon: MessageSquare, category: "comm" },
    { href: "/calls", label: "Telephony & Calls", icon: PhoneCall, category: "comm" },
    { href: "/invoices", label: "GST Billing", icon: FileText, category: "module" },
    { href: "/tickets", label: "Helpdesk SLA", icon: LifeBuoy, category: "module" },
    { href: "/ads", label: "Ads Analytics", icon: BarChart3, category: "comm" },
  ];

  if (userRole !== "SALESEXECUTIVE") {
    navLinks.push({ href: "/automations", label: "Automations", icon: Zap, category: "module" });
  }

  return (
    <div className="flex h-screen bg-gray-50/50 text-gray-800 font-sans overflow-hidden">
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col shadow-sm z-20 flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-100 mb-2 mt-1">
          <div className="flex items-center space-x-2.5 text-indigo-600 font-bold text-xl">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-extrabold shadow-md shadow-indigo-500/20">
              A
            </div>
            <span className="tracking-tight text-gray-900 font-black">Apex<span className="text-indigo-600">CRM</span></span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-6">
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2 block">Main Menu</span>
            <ul className="space-y-1">
              {navLinks.filter(l => l.category === "main").map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                        active ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "text-gray-600 hover:bg-gray-100/70"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? "text-white" : "text-gray-500"}`} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2 block">Communications</span>
            <ul className="space-y-1">
              {navLinks.filter(l => l.category === "comm").map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                        active ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "text-gray-600 hover:bg-gray-100/70"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? "text-white" : "text-gray-500"}`} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2 block">Modules</span>
            <ul className="space-y-1">
              {navLinks.filter(l => l.category === "module").map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                        active ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "text-gray-600 hover:bg-gray-100/70"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? "text-white" : "text-gray-500"}`} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        <div className="p-3 border-t border-gray-100 space-y-1.5 bg-gray-50/50">
          {userRole === "SUPERADMIN" && (
            <Link
              href="/super-admin"
              className="flex items-center gap-2.5 px-3 py-2 text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl font-bold text-xs transition-colors"
            >
              <Shield className="w-4 h-4 text-purple-600" />
              SaaS Super Panel
            </Link>
          )}

          {userRole !== "SALESEXECUTIVE" && (
            <Link
              href="/settings"
              className="flex items-center gap-2.5 px-3 py-2 text-gray-700 hover:bg-white rounded-xl font-semibold text-xs transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-500" />
              Settings
            </Link>
          )}

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl font-semibold text-xs transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-500" /> Logout ({currentUser.name?.split(" ")[0]})
          </button>
        </div>
      </aside>

      {/* Mobile Slide-Over Menu Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-Over Navigation Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-72 bg-white z-50 flex flex-col transform transition-transform duration-300 ease-in-out md:hidden shadow-2xl ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100">
          <div className="flex items-center space-x-2 text-indigo-600 font-bold text-lg">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              A
            </div>
            <span className="text-gray-900 font-black">ApexCRM</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-100 bg-indigo-50/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-md">
            {getInitials(currentUser.name)}
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900">{currentUser.name}</p>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
              {getRoleLabel(userRole)}
            </span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-4">
          <ul className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl font-semibold text-xs transition-colors ${
                      active ? "bg-indigo-600 text-white font-bold" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? "text-white" : "text-indigo-600"}`} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2">
          {userRole === "SUPERADMIN" && (
            <Link
              href="/super-admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 text-purple-700 bg-purple-50 rounded-xl font-bold text-xs"
            >
              <Shield className="w-4 h-4 text-purple-600" />
              SaaS Super Panel
            </Link>
          )}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              signOut({ callbackUrl: "/login" });
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-red-600 hover:bg-red-50 rounded-xl font-bold text-xs"
          >
            <LogOut className="w-4 h-4 text-red-500" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Responsive Header Bar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger Button for Mobile */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2 md:hidden">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                A
              </div>
              <span className="font-extrabold text-gray-900 text-base">ApexCRM</span>
            </div>

            {/* Desktop Search */}
            <div className="relative hidden md:block w-72 lg:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search leads, calls, invoices..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {userRole === "SUPERADMIN" && (
              <button
                onClick={() => setShowGlobalAddUserModal(true)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
              >
                <Users className="w-4 h-4" />
                <span>+ Create Staff ID</span>
              </button>
            )}

            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            {/* Desktop User Badge */}
            <div className="hidden sm:flex items-center gap-2.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px]">
                {getInitials(currentUser.name)}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-gray-900 leading-none">{currentUser.name?.split(" ")[0]}</p>
                <span className="text-[9px] font-bold text-indigo-700 block mt-0.5">{getRoleLabel(userRole)}</span>
              </div>
            </div>
          </div>
        </header>

        {userMsg && (
          <div className="mx-4 sm:mx-8 mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold rounded-xl flex justify-between items-center shadow-sm">
            <span>✅ {userMsg}</span>
            <button onClick={() => setUserMsg(null)} className="font-extrabold text-sm ml-2">×</button>
          </div>
        )}

        {/* Page Main Content Container with Mobile Bottom Padding */}
        <div className="flex-1 overflow-auto p-3 sm:p-6 lg:p-8 pb-20 md:pb-8">
          {children}
        </div>

        {/* Global Create Staff Account Modal */}
        {showGlobalAddUserModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-bold text-gray-900 text-base">Create Staff / Manager ID & Password</h3>
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

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Role / Designation *</label>
                  <select
                    value={newUserRole}
                    onChange={(e: any) => setNewUserRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="SALESEXECUTIVE">Sales Executive (Employee)</option>
                    <option value="MANAGER">Manager / HR</option>
                    <option value="SUPERADMIN">Super Admin / Business Owner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Phone (Optional)</label>
                  <input
                    type="text"
                    placeholder="+919876543210"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowGlobalAddUserModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-xs font-bold hover:shadow-lg transition-all"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 📱 Mobile Native Bottom App Navigation Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 z-40 flex items-center justify-around px-2 shadow-lg">
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl ${
              pathname === "/" ? "text-indigo-600 font-bold" : "text-gray-500"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px]">Home</span>
          </Link>

          <Link
            href="/leads"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl ${
              pathname?.startsWith("/leads") ? "text-indigo-600 font-bold" : "text-gray-500"
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px]">Leads</span>
          </Link>

          <Link
            href="/messages"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl relative ${
              pathname === "/messages" ? "text-indigo-600 font-bold" : "text-gray-500"
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px]">WhatsApp</span>
          </Link>

          <Link
            href="/calls"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl ${
              pathname === "/calls" ? "text-indigo-600 font-bold" : "text-gray-500"
            }`}
          >
            <PhoneCall className="w-5 h-5" />
            <span className="text-[10px]">Calls</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center gap-1 py-1 px-3 text-gray-500"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px]">Menu</span>
          </button>
        </nav>
      </main>
    </div>
  );
}

