"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Plus, Trash2, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function WhatsAppSettingsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [phoneNumberId, setPhoneNumberId] = useState("");
  const [whatsappBizId, setWhatsappBizId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/whatsapp/accounts")
      .then((res) => res.json())
      .then((data) => {
        setAccounts(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/whatsapp/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumberId, whatsappBizId, accessToken }),
      });

      if (res.ok) {
        const newAccount = await res.json();
        setAccounts((prev) => {
          const exists = prev.find((a) => a.phoneNumberId === newAccount.phoneNumberId);
          if (exists) return prev.map((a) => (a.phoneNumberId === newAccount.phoneNumberId ? newAccount : a));
          return [...prev, newAccount];
        });
        setSuccess(true);
        setPhoneNumberId("");
        setWhatsappBizId("");
        setAccessToken("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex items-center mb-6">
        <Link href="/settings" className="mr-4 text-gray-500 hover:text-gray-900">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">WhatsApp Business Integration</h1>
          <p className="text-gray-500 mt-1">Connect your 25 WhatsApp numbers to the CRM</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Number</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number ID</label>
                <input
                  type="text"
                  required
                  value={phoneNumberId}
                  onChange={(e) => setPhoneNumberId(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. 101416736230485"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Business Account ID</label>
                <input
                  type="text"
                  required
                  value={whatsappBizId}
                  onChange={(e) => setWhatsappBizId(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. 110450945672312"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">System User Access Token</label>
                <textarea
                  required
                  rows={3}
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="EAAI... (Start with EAA)"
                />
              </div>
              
              <div className="flex items-center justify-between pt-2">
                {success ? (
                  <div className="text-green-600 flex items-center text-sm font-medium">
                    <CheckCircle className="w-5 h-5 mr-1" />
                    Number successfully added!
                  </div>
                ) : (
                  <div></div>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors flex items-center font-medium disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Number"}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Numbers ({accounts.length})</h3>
            
            {loading ? (
              <div className="text-center py-4 text-gray-500">Loading numbers...</div>
            ) : accounts.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                No WhatsApp numbers connected yet.
              </div>
            ) : (
              <div className="space-y-3">
                {accounts.map((acc, index) => (
                  <div key={acc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-900">Number {index + 1}</div>
                      <div className="text-xs text-gray-500 mt-1">ID: {acc.phoneNumberId}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Active</span>
                      <button className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-3">Webhook Configuration</h3>
            <p className="text-sm text-blue-800 mb-4">
              To receive messages instantly, you must configure this Webhook URL in your Meta App Dashboard:
            </p>
            <div className="bg-white p-3 rounded border border-blue-200 text-xs text-gray-800 font-mono break-all mb-3">
              https://your-domain.com/api/webhooks/whatsapp
            </div>
            <p className="text-sm text-blue-800 mb-2">
              <strong>Verify Token:</strong> <code className="bg-white px-1 rounded">crm-secret-token-2026</code>
            </p>
            <a href="https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-webhooks" target="_blank" className="text-sm text-blue-600 font-medium hover:underline">
              Read Meta Webhook Guide &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
