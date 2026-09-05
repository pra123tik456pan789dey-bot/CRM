"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Shield,
  Search,
  Key,
  Mail,
  Phone,
  Trash2,
  Copy,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  Briefcase
} from "lucide-react";
import { createEmployeeUserAction, getStaffUsersAction, deleteUserAction } from "@/app/actions/authActions";

export default function StaffPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"SALESEXECUTIVE" | "MANAGER" | "SUPERADMIN">("SALESEXECUTIVE");
  const [phone, setPhone] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const res = await getStaffUsersAction();
    if (res.success && res.users) {
      setUsers(res.users);
    }
    setLoading(false);
  };

  const handleGeneratePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$";
    let gen = "";
    for (let i = 0; i < 10; i++) {
      gen += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(gen);
    setShowPassword(true);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setMessage({ type: "error", text: "Name, Email, and Password are required!" });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    const res = await createEmployeeUserAction({
      name,
      email,
      password,
      role,
      phone,
    });

    setSubmitting(false);

    if (res.success) {
      setMessage({
        type: "success",
        text: `Success! Account created for ${name} (${role === "MANAGER" ? "Manager" : role === "SUPERADMIN" ? "Super Admin" : "Employee"}).`,
      });
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setRole("SALESEXECUTIVE");
      loadUsers();
    } else {
      setMessage({ type: "error", text: res.error || "Failed to create account" });
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete account for ${userName}?`)) return;
    const res = await deleteUserAction(userId);
    if (res.success) {
      setMessage({ type: "success", text: `Deleted account for ${userName}` });
      loadUsers();
    } else {
      setMessage({ type: "error", text: res.error || "Failed to delete user" });
    }
  };

  const handleCopyCredentials = (u: any) => {
    const text = `ApexCRM Login Credentials:\nWebsite Link: https://my-crm-nu-two.vercel.app\nLogin Email: ${u.email}\nRole: ${u.role}`;
    navigator.clipboard.writeText(text);
    setCopiedId(u.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-2 sm:p-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-indigo-600/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-200 text-xs font-extrabold uppercase tracking-widest mb-2">
            <Shield className="w-4 h-4 text-amber-400" /> Staff & Access Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Create Employee & Manager IDs</h1>
          <p className="text-indigo-100 text-sm mt-1 max-w-xl font-medium">
            Create login credentials for Employees, Managers, HR, and Admins. Share their login email & password to access ApexCRM.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 flex items-center gap-4">
          <div>
            <span className="text-2xl font-black text-white">{users.length}</span>
            <p className="text-xs text-indigo-100 font-semibold">Total Active Accounts</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Alert Message */}
      {message && (
        <div
          className={`p-4 rounded-2xl border text-sm font-semibold flex items-center justify-between shadow-sm transition-all ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-red-50 border-red-200 text-red-900"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-gray-400 hover:text-gray-700 font-extrabold text-base"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Grid: Left Side Form (Create User), Right Side (Users List) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Create Staff Account Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900">Create New Staff ID</h2>
              <p className="text-xs text-gray-500 font-medium">Set Login Email & Password</p>
            </div>
          </div>

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-indigo-600 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Work Email (Login ID) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="rahul@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-indigo-600 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  Login Password <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="text-[11px] font-extrabold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  ⚡ Auto-Generate Password
                </button>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Set Password (e.g. Rahul@123)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-indigo-600 outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Role / Designation <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <select
                  value={role}
                  onChange={(e: any) => setRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-indigo-600 outline-none transition-all appearance-none"
                >
                  <option value="SALESEXECUTIVE">Sales Executive (Employee)</option>
                  <option value="MANAGER">Manager / HR</option>
                  <option value="SUPERADMIN">Super Admin / Business Owner</option>
                </select>
              </div>
              <p className="text-[11px] text-gray-500 mt-1 font-medium">
                {role === "SALESEXECUTIVE" && "• Access to assigned leads, tasks & calling."}
                {role === "MANAGER" && "• Access to full team leads, automations & reports."}
                {role === "SUPERADMIN" && "• Complete access to all settings, staff & billing."}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Mobile Phone (Optional)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-indigo-600 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-extrabold hover:shadow-lg hover:shadow-indigo-600/30 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
            >
              <UserPlus className="w-4 h-4" />
              {submitting ? "Creating Account..." : "Create Staff Account Now"}
            </button>
          </form>
        </div>

        {/* Right Side: Staff Members Table */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-gray-900">All Registered Staff & Accounts</h2>
              <p className="text-xs text-gray-500 font-medium">List of active Employee, Manager, and Admin accounts</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search staff..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium outline-none focus:border-indigo-600"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="py-1.5 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 outline-none"
              >
                <option value="ALL">All Roles</option>
                <option value="SALESEXECUTIVE">Employees</option>
                <option value="MANAGER">Managers</option>
                <option value="SUPERADMIN">Admins</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm font-semibold text-gray-400">
              Loading staff accounts...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Users className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-sm font-bold text-gray-600">No accounts found</p>
              <p className="text-xs text-gray-400">Create a new staff ID using the form on the left.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-y border-gray-200">
                  <tr>
                    <th className="p-3">Staff Name</th>
                    <th className="p-3">Login Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-xs">
                            {u.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{u.name}</p>
                            {u.phone && <p className="text-[10px] text-gray-400">{u.phone}</p>}
                          </div>
                        </div>
                      </td>

                      <td className="p-3 font-semibold text-gray-700">{u.email}</td>

                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold inline-flex items-center gap-1 ${
                            u.role === "SUPERADMIN"
                              ? "bg-purple-100 text-purple-800 border border-purple-200"
                              : u.role === "MANAGER"
                              ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                              : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          }`}
                        >
                          {u.role === "SUPERADMIN" ? "Super Admin" : u.role === "MANAGER" ? "Manager / HR" : "Sales Employee"}
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleCopyCredentials(u)}
                            title="Copy Login Details"
                            className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold"
                          >
                            {copiedId === u.id ? (
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            title="Delete Account"
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
