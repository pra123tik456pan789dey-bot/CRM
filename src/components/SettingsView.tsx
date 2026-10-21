"use client";

import React, { useState } from "react";
import {
  Building2,
  Users,
  Cpu,
  LayoutTemplate,
  Bell,
  Shield,
  Palette,
  FileClock,
  CheckCircle2,
  Plus,
  Save,
  Key,
  Eye,
  EyeOff,
  Trash2,
  Smartphone,
  Phone,
  MessageSquare,
  Sparkles,
  Zap,
  Lock,
  Check
} from "lucide-react";
import { createEmployeeUserAction } from "@/app/actions/authActions";

export default function SettingsView({ users: initialUsers, company }: { users: any[]; company: any }) {
  const [activeTab, setActiveTab] = useState<
    "COMPANY" | "USERS" | "INTEGRATIONS" | "SIDEBAR" | "NOTIFICATIONS" | "PERMISSIONS" | "WHITELABEL" | "AUDIT"
  >("USERS");

  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const showSaveSuccess = (msg: string = "Settings saved successfully!") => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), 3500);
  };

  // 1. Company Profile State
  const [companyName, setCompanyName] = useState(company?.name || "Apex Technologies & Marketing");
  const [companyGst, setCompanyGst] = useState("08AAACA1234A1Z5");
  const [companyPhone, setCompanyPhone] = useState("+91 98100 00000");
  const [companyEmail, setCompanyEmail] = useState("admin@brightwave.app");
  const [companyCurrency, setCompanyCurrency] = useState("INR (₹)");

  // 2. Founders State (Zepfly Style)
  const [founders, setFounders] = useState<string[]>(["u_aarav", "u_ishita"]);

  // 3. Users list with password reveal
  const [usersList, setUsersList] = useState<any[]>(
    initialUsers.length > 0
      ? initialUsers.map((u: any) => ({
          ...u,
          revealed: false,
          phone: u.phone || "+91 98101 23456",
          rawPassword: "Password@123",
          active: true
        }))
      : [
          { id: "u_aarav", name: "Aarav Mehta", email: "demo@brightwave.app", role: "SUPERADMIN", phone: "9810000000", rawPassword: "Admin@2026", active: true, revealed: false },
          { id: "u_ishita", name: "Ishita Kapoor", email: "ishita@brightwave.app", role: "SUPERADMIN", phone: "9817654321", rawPassword: "Ishita@2026", active: true, revealed: false },
          { id: "u_ananya", name: "Ananya Iyer", email: "ananya@brightwave.app", role: "SALESEXECUTIVE", phone: "9848271605", rawPassword: "Ananya@123", active: true, revealed: false },
          { id: "u_kabir", name: "Kabir Singh", email: "kabir@brightwave.app", role: "SALESEXECUTIVE", phone: "9840617284", rawPassword: "Kabir@123", active: true, revealed: false },
          { id: "u_ravi", name: "Ravi Kumar", email: "ravi@gmail.com", role: "SALESEXECUTIVE", phone: "9876543210", rawPassword: "Ravi@123", active: true, revealed: false },
          { id: "u_neha", name: "Neha Sharma", email: "neha@brightwave.app", role: "MANAGER", phone: "9810234567", rawPassword: "Neha@123", active: true, revealed: false },
          { id: "u_harsh", name: "Harsh Malhotra", email: "harsh@brightwave.app", role: "SALESEXECUTIVE", phone: "9810185185", rawPassword: "Harsh@123", active: true, revealed: false },
          { id: "u_vikram", name: "Vikram Joshi", email: "vikram@brightwave.app", role: "SALESEXECUTIVE", phone: "9820394857", rawPassword: "Vikram@123", active: true, revealed: false }
        ]
  );

  // Add User Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<string>("SALESEXECUTIVE");
  const [newUserPhone, setNewUserPhone] = useState("");

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail || !newUserPassword) return;

    const res = await createEmployeeUserAction({
      name: newUserName,
      email: newUserEmail,
      password: newUserPassword,
      role: newUserRole as any,
      phone: newUserPhone
    });

    if (res.success) {
      setUsersList([
        {
          id: "u_" + Date.now(),
          name: newUserName,
          email: newUserEmail,
          role: newUserRole,
          phone: newUserPhone || "9810000000",
          rawPassword: newUserPassword,
          active: true,
          revealed: false
        },
        ...usersList
      ]);
      setShowAddUserModal(false);
      setNewUserName("");
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserPhone("");
      showSaveSuccess("Staff Account created successfully!");
    } else {
      alert(res.error || "Failed to create user");
    }
  };

  const togglePasswordReveal = (id: string) => {
    setUsersList(usersList.map(u => u.id === id ? { ...u, revealed: !u.revealed } : u));
  };

  const toggleFounder = (id: string) => {
    if (founders.includes(id)) {
      setFounders(founders.filter(f => f !== id));
    } else {
      setFounders([...founders, id]);
    }
  };

  // 4. Integrations Form State
  const [aiKey, setAiKey] = useState("sk-************************************");
  const [aiProvider, setAiProvider] = useState("gemini");
  const [aiModel, setAiModel] = useState("gemini-2.5-flash");
  const [claudeKey, setClaudeKey] = useState("");

  // WhatsApp & Twilio
  const [waPhoneId, setWaPhoneId] = useState("109823471092834");
  const [waToken, setWaToken] = useState("EAAG123456789SAMPLETOKEN");
  const [twilioSid, setTwilioSid] = useState("AC_sample_twilio_sid_9876");
  const [twilioToken, setTwilioToken] = useState("sample_twilio_auth_token_4321");
  const [twilioPhone, setTwilioPhone] = useState("+919876543210");

  // 5. Sidebar Modules Toggles State (Zepfly Style)
  const [sidebarModules, setSidebarModules] = useState([
    { id: "command", name: "Command Center", section: "AGENCY", visible: true },
    { id: "pipeline", name: "Sales Pipeline", section: "AGENCY", visible: true },
    { id: "leads", name: "Leads", section: "AGENCY", visible: true },
    { id: "clients", name: "Clients & Projects", section: "AGENCY", visible: true },
    { id: "finance", name: "Finance & MRR Ledger", section: "OPERATE", visible: true },
    { id: "hr", name: "Team & HR", section: "OPERATE", visible: true },
    { id: "personal", name: "Personal Space", section: "OPERATE", visible: true },
    { id: "whatsapp", name: "WhatsApp Inbox", section: "COMMUNICATION", visible: true },
    { id: "telephony", name: "Telephony & Calls", section: "COMMUNICATION", visible: true },
    { id: "ads", name: "Meta Ads Analytics", section: "MARKETING", visible: true },
    { id: "invoices", name: "GST Billing", section: "FINANCE", visible: true },
    { id: "automations", name: "Automations", section: "SYSTEM", visible: true }
  ]);

  const toggleSidebarModule = (id: string) => {
    setSidebarModules(sidebarModules.map(m => m.id === id ? { ...m, visible: !m.visible } : m));
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-sans">
      {/* Top Breadcrumb & Page Banner */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Settings</h1>
            <p className="text-xs font-semibold text-gray-500">Organization, integrations, roles, and audit control</p>
          </div>
        </div>

        {savedNotice && (
          <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {savedNotice}
          </div>
        )}
      </div>

      {/* 8 Zepfly Settings Navigation Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none bg-white p-2 rounded-2xl border border-gray-200/80 shadow-xs">
        {[
          { id: "COMPANY", label: "Company", icon: Building2 },
          { id: "USERS", label: "Users & Access", icon: Users },
          { id: "INTEGRATIONS", label: "Integrations", icon: Cpu },
          { id: "SIDEBAR", label: "Sidebar", icon: LayoutTemplate },
          { id: "NOTIFICATIONS", label: "Notifications", icon: Bell },
          { id: "PERMISSIONS", label: "Roles & Permissions", icon: Shield },
          { id: "WHITELABEL", label: "White-label", icon: Palette },
          { id: "AUDIT", label: "Audit Log", icon: FileClock }
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                active
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Company Profile */}
      {activeTab === "COMPANY" && (
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm space-y-6">
          <h3 className="font-black text-gray-900 text-base">Company & Billing Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">GSTIN / Tax ID</label>
              <input
                type="text"
                value={companyGst}
                onChange={(e) => setCompanyGst(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Official Contact Phone</label>
              <input
                type="text"
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Support Email</label>
              <input
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold"
              />
            </div>
          </div>
          <button
            onClick={() => showSaveSuccess("Company details updated successfully!")}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
          >
            Save Company Details
          </button>
        </div>
      )}

      {/* TAB 2: Users & Access (Founders & Accounts Matrix - Exact Zepfly Screenshots 1 & 2) */}
      {activeTab === "USERS" && (
        <div className="space-y-6">
          {/* Founders & Decision Makers Card (Screenshot 1) */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 text-amber-700 rounded-xl mt-0.5">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-base">Founders & decision makers</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Tick the owners. They keep their login and access, but are not counted as team — they don't show in Team & HR, Attendance, Payroll, Employee Management or the dashboard's team list.
                  </p>
                </div>
              </div>

              <button
                onClick={() => showSaveSuccess("Founders saved successfully!")}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Save
              </button>
            </div>

            {/* Founders Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {usersList.map((user) => {
                const isFounder = founders.includes(user.id);
                return (
                  <div
                    key={user.id}
                    onClick={() => toggleFounder(user.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isFounder
                        ? "bg-amber-50/70 border-amber-300 shadow-xs ring-1 ring-amber-300"
                        : "bg-gray-50/60 border-gray-200/80 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isFounder}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-indigo-600"
                      />
                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px]">
                        {user.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900 leading-tight">{user.name}</p>
                        <p className="text-[10px] text-gray-400">{user.role}</p>
                      </div>
                    </div>

                    {isFounder && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black tracking-wider">
                        FOUNDER
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 15 Accounts List (Screenshot 2) */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <h3 className="font-black text-gray-900 text-base">{usersList.length} accounts</h3>
                <p className="text-xs text-gray-500">Create logins, set pictures, reveal passwords, deactivate or delete.</p>
              </div>

              <button
                onClick={() => setShowAddUserModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-teal-600 to-indigo-600 text-white rounded-xl text-xs font-bold hover:shadow-lg transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
              >
                <Plus className="w-4 h-4" /> Add user
              </button>
            </div>

            {/* Accounts Table */}
            <div className="divide-y divide-gray-100 pt-2">
              {usersList.map((user) => (
                <div
                  key={user.id}
                  className="py-3.5 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-gray-50/60 rounded-xl px-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                      {user.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-gray-900">{user.name}</span>
                        {user.id === "u_aarav" && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 font-bold">YOU</span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 flex items-center gap-2">
                        <span>{user.email}</span>
                        <span>•</span>
                        <span>{user.phone}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Role selector dropdown */}
                    <select
                      value={user.role}
                      onChange={(e) => {
                        setUsersList(usersList.map(u => u.id === user.id ? { ...u, role: e.target.value } : u));
                        showSaveSuccess(`Updated ${user.name}'s role.`);
                      }}
                      className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none"
                    >
                      <option value="SUPERADMIN">Admin</option>
                      <option value="MANAGER">Manager</option>
                      <option value="HR">HR</option>
                      <option value="SALESEXECUTIVE">Sales Agent</option>
                      <option value="EMPLOYEE">Employee</option>
                    </select>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active
                    </span>

                    {/* Reveal Password Eye Button */}
                    <button
                      onClick={() => togglePasswordReveal(user.id)}
                      className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Reveal Password"
                    >
                      {user.revealed ? <EyeOff className="w-4 h-4 text-indigo-600" /> : <Eye className="w-4 h-4" />}
                    </button>

                    {user.revealed && (
                      <span className="px-2 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded font-mono text-[10px] font-bold">
                        {user.rawPassword}
                      </span>
                    )}

                    <button
                      onClick={() => {
                        setUsersList(usersList.filter(u => u.id !== user.id));
                        showSaveSuccess(`Deleted user ${user.name}`);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Integrations (Zepfly AI Brain, Claude, WhatsApp, Twilio - Screenshot 3) */}
      {activeTab === "INTEGRATIONS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Zepfly AI Brain (ChatGPT / Gemini / Groq / DeepSeek / Ollama) */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white rounded-2xl shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Apex AI Brain (Gemini / ChatGPT)</h3>
                  <p className="text-xs text-gray-400">Powers Voice Assistant, CRM Analysis & Digests</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Connected
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">API Key</label>
                <input
                  type="password"
                  value={aiKey}
                  onChange={(e) => setAiKey(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono"
                  placeholder="Paste secret key"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Provider</label>
                <select
                  value={aiProvider}
                  onChange={(e) => setAiProvider(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold"
                >
                  <option value="gemini">Google Gemini (Recommended & Active)</option>
                  <option value="openai">OpenAI (ChatGPT)</option>
                  <option value="groq">Groq (Ultra-fast free tier)</option>
                  <option value="deepseek">DeepSeek</option>
                  <option value="ollama">Local Ollama</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Model (optional)</label>
                <input
                  type="text"
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                  placeholder="e.g. gemini-2.5-flash"
                />
              </div>

              <button
                onClick={() => showSaveSuccess("AI Brain credentials saved!")}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Save AI Configuration
              </button>
            </div>
          </div>

          {/* Anthropic (Claude) Integration */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-100 text-purple-700 rounded-2xl shadow-sm">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Anthropic (Claude)</h3>
                  <p className="text-xs text-gray-400">Powers deep research and proposal generation</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">
                Optional
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Claude API Key</label>
                <input
                  type="password"
                  value={claudeKey}
                  onChange={(e) => setClaudeKey(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono"
                  placeholder="Paste sk-ant-..."
                />
              </div>

              <button
                onClick={() => showSaveSuccess("Anthropic Claude saved!")}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Save Claude Key
              </button>
            </div>
          </div>

          {/* WhatsApp Integration */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-3">
            <div className="flex items-center gap-3 border-b pb-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-2xl">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Meta WhatsApp Cloud API</h3>
                <p className="text-xs text-gray-500">Official WhatsApp Business 2-Way Chat</p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number ID</label>
              <input
                type="text"
                value={waPhoneId}
                onChange={(e) => setWaPhoneId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono"
              />
            </div>
            <button
              onClick={() => showSaveSuccess("WhatsApp Credentials saved!")}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all"
            >
              Save WhatsApp
            </button>
          </div>

          {/* Twilio Telephony Integration */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-3">
            <div className="flex items-center gap-3 border-b pb-3">
              <div className="p-2.5 bg-blue-100 text-blue-600 rounded-2xl">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Cloud Telephony / Twilio</h3>
                <p className="text-xs text-gray-500">Virtual Outbound Caller ID & Auto-Recording</p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Business Outbound Phone Number</label>
              <input
                type="text"
                value={twilioPhone}
                onChange={(e) => setTwilioPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono"
              />
            </div>
            <button
              onClick={() => showSaveSuccess("Telephony Credentials saved!")}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all"
            >
              Save Twilio
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: Manage Sidebar (Screenshot 4) */}
      {activeTab === "SIDEBAR" && (
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h3 className="font-black text-gray-900 text-base">Manage sidebar</h3>
              <p className="text-xs text-gray-500">Choose which modules show in your sidebar. Hidden ones stay reachable via ⌘K search.</p>
            </div>
            <button
              onClick={() => showSaveSuccess("Sidebar layout saved!")}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Save changes
            </button>
          </div>

          <div className="divide-y divide-gray-100 pt-2">
            {sidebarModules.map((mod) => (
              <div key={mod.id} className="py-3.5 flex items-center justify-between hover:bg-gray-50/60 px-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                    {mod.section}
                  </span>
                  <span className="text-xs font-bold text-gray-900">{mod.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-semibold">{mod.visible ? "Visible" : "Hidden"}</span>
                  <button
                    onClick={() => toggleSidebarModule(mod.id)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      mod.visible ? "bg-indigo-600" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        mod.visible ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Notifications */}
      {activeTab === "NOTIFICATIONS" && (
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm space-y-4">
          <h3 className="font-black text-gray-900 text-base">Alerts & Real-Time Triggers</h3>
          <p className="text-xs text-gray-500">Configure how leads, deal updates, and team notifications are delivered.</p>
          <div className="space-y-3 pt-2">
            {[
              { title: "Instant WhatsApp Alert on New Meta Lead", desc: "Notify business owner whenever Facebook/Instagram ad form is submitted", active: true },
              { title: "Client Unattended Call Alert", desc: "Send SMS/WhatsApp if a client call was missed by executive", active: true },
              { title: "Deal Won Celebration Digest", desc: "Notify full team channel when a deal moves to Won stage", active: true },
              { title: "Daily Morning Pipeline Summary", desc: "Send daily morning briefing at 9:00 AM", active: false }
            ].map((n, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-200/70 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{n.title}</h4>
                  <p className="text-xs text-gray-500">{n.desc}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  n.active ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-600"
                }`}>
                  {n.active ? "Enabled" : "Disabled"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Roles & Permissions Matrix (Screenshot 5) */}
      {activeTab === "PERMISSIONS" && (
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm space-y-4">
          <h3 className="font-black text-gray-900 text-base">Server-Enforced Role-Based Access Control (RBAC)</h3>
          <p className="text-xs text-gray-500">Fine-grained security matrix enforced across database models.</p>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                <tr>
                  <th className="p-3">Module</th>
                  <th className="p-3">Admin</th>
                  <th className="p-3">Manager</th>
                  <th className="p-3">Sales Agent</th>
                  <th className="p-3">Employee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                {[
                  { name: "Command Center", admin: "Full", mgr: "Full", agent: "View", emp: "View" },
                  { name: "Sales Pipeline", admin: "Full", mgr: "Full", agent: "Own Only", emp: "None" },
                  { name: "Leads", admin: "Full", mgr: "Full", agent: "Own Only", emp: "None" },
                  { name: "Clients & Projects", admin: "Full", mgr: "Full", agent: "None", emp: "None" },
                  { name: "Finance & Invoices", admin: "Full", mgr: "View", agent: "None", emp: "None" },
                  { name: "Personal Space", admin: "Full", mgr: "Full", agent: "Full", emp: "Full" }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/60">
                    <td className="p-3 font-bold text-gray-900">{row.name}</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">{row.admin}</span></td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 text-[10px] font-bold">{row.mgr}</span></td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">{row.agent}</span></td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-bold">{row.emp}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: White-label */}
      {activeTab === "WHITELABEL" && (
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm space-y-4">
          <h3 className="font-black text-gray-900 text-base">White-label Branding & Client Portal</h3>
          <p className="text-xs text-gray-500">Provide clients with their own login under your agency brand.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Custom Brand Logo URL</label>
              <input type="text" placeholder="https://youragency.com/logo.png" className="w-full px-3 py-2 border rounded-xl text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Custom CNAME Domain</label>
              <input type="text" placeholder="crm.youragency.com" className="w-full px-3 py-2 border rounded-xl text-xs" />
            </div>
          </div>
          <button onClick={() => showSaveSuccess("Branding saved!")} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold">
            Save Branding
          </button>
        </div>
      )}

      {/* TAB 8: Audit Log */}
      {activeTab === "AUDIT" && (
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm space-y-4">
          <h3 className="font-black text-gray-900 text-base">Security & Activity Audit Log</h3>
          <div className="divide-y divide-gray-100 text-xs font-medium text-gray-600">
            {[
              { time: "Today, 02:45 PM", user: "Aarav Mehta", event: "Generated October GST invoice for Apex Diagnostics" },
              { time: "Today, 01:15 PM", user: "Ravi Kumar", event: "Updated deal stage 'Spice Route Foods' to QUALIFIED" },
              { time: "Today, 11:30 AM", user: "AI Voice Brain", event: "Grounded voice query: 'Show today's pending invoices'" },
              { time: "Yesterday, 06:10 PM", user: "Ishita Kapoor", event: "Exported monthly sales commission report" }
            ].map((log, i) => (
              <div key={i} className="py-3 flex justify-between items-center">
                <div>
                  <span className="font-bold text-gray-900">{log.user}: </span>
                  <span>{log.event}</span>
                </div>
                <span className="text-[10px] text-gray-400 font-mono">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-900 text-base">Add New Team Member / Staff ID</h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-gray-400 hover:text-gray-700 font-bold">×</button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Priyanshu Singh"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email (Login ID) *</label>
                <input
                  type="email"
                  placeholder="priyanshu@brightwave.app"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Login Password *</label>
                <input
                  type="password"
                  placeholder="Set password (e.g. Pass@123)"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Role *</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-bold"
                  >
                    <option value="SALESEXECUTIVE">Sales Agent</option>
                    <option value="MANAGER">Manager</option>
                    <option value="HR">HR</option>
                    <option value="SUPERADMIN">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="9810000000"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-indigo-600 text-white rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all"
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
