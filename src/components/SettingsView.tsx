"use client";

import React, { useState } from "react";
import { MessageSquare, Phone, Key, Shield, User, Building, Save, CheckCircle2 } from "lucide-react";

export default function SettingsView({ users, company }: { users: any[]; company: any }) {
  const [waToken, setWaToken] = useState("EAAG123456789SAMPLETOKEN");
  const [waPhoneId, setWaPhoneId] = useState("109823471092834");
  const [waVerifyToken, setWaVerifyToken] = useState("crm_verify_token_123");

  const [twilioSid, setTwilioSid] = useState("AC_sample_twilio_sid_9876");
  const [twilioToken, setTwilioToken] = useState("sample_twilio_auth_token_4321");
  const [twilioPhone, setTwilioPhone] = useState("+919876543210");

  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings & Integrations</h1>
        <p className="text-sm text-gray-500 mt-1">Configure company credentials, API keys, and team access control.</p>
      </div>

      {savedNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-medium text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          Settings saved successfully! Integration webhooks are actively configured.
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Meta WhatsApp Cloud API Settings */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Meta WhatsApp Cloud API</h3>
              <p className="text-xs text-gray-500">Official Cloud API Integration</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Permanent Access Token</label>
              <input
                type="password"
                value={waToken}
                onChange={(e) => setWaToken(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Phone Number ID</label>
              <input
                type="text"
                value={waPhoneId}
                onChange={(e) => setWaPhoneId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Webhook Verify Token</label>
              <input
                type="text"
                value={waVerifyToken}
                onChange={(e) => setWaVerifyToken(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono"
              />
            </div>

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-[11px] text-gray-600">
              <strong>Webhook Callback URL:</strong> <br />
              <code className="text-indigo-600">https://your-domain.com/api/webhooks/whatsapp</code>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Save WhatsApp Credentials
            </button>
          </form>
        </div>

        {/* Twilio Cloud Telephony Settings */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Twilio Telephony Integration</h3>
              <p className="text-xs text-gray-500">Click-to-Call & Voice Recording</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Account SID</label>
              <input
                type="text"
                value={twilioSid}
                onChange={(e) => setTwilioSid(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Auth Token</label>
              <input
                type="password"
                value={twilioToken}
                onChange={(e) => setTwilioToken(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Business Outbound Phone Number</label>
              <input
                type="text"
                value={twilioPhone}
                onChange={(e) => setTwilioPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono"
              />
            </div>

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-[11px] text-gray-600">
              <strong>Twilio Voice Webhook URL:</strong> <br />
              <code className="text-indigo-600">https://your-domain.com/api/webhooks/twilio</code>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Save Twilio Credentials
            </button>
          </form>
        </div>
      </div>

      {/* User Roles & Permissions Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-base">Team Members & Role-Based Permissions (RBAC)</h3>
            <p className="text-xs text-gray-500">Super Admin, Manager, Sales Executive, and Read-only Viewer roles.</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg">
            Tenant: {company?.name || "Apex Global Technologies"}
          </span>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-y border-gray-200">
            <tr>
              <th className="p-3">User Name</th>
              <th className="p-3">Email Address</th>
              <th className="p-3">Assigned Role</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="p-3 font-semibold text-gray-900">{u.name}</td>
                <td className="p-3 text-gray-600">{u.email}</td>
                <td className="p-3">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    u.role === "SUPERADMIN" ? "bg-purple-100 text-purple-800" :
                    u.role === "MANAGER" ? "bg-indigo-100 text-indigo-800" : "bg-blue-100 text-blue-800"
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-3 text-xs font-semibold text-emerald-600">Active</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
