"use client";

import { useState } from "react";
import { Zap, Bot, Save, ToggleLeft, ToggleRight, MessageSquareText, ShieldAlert } from "lucide-react";

export default function AIChatbotSettingsPage() {
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [botName, setBotName] = useState("Sales Bot Pro");
  const [businessContext, setBusinessContext] = useState("We are a premium digital marketing agency offering SEO, Facebook Ads, and Website Development. Our minimum package starts at ₹15,000/month.");
  const [rules, setRules] = useState("- Always be polite and professional.\n- Do not offer discounts above 10%.\n- Try to book a consultation call.");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API call
    setTimeout(() => setSaving(false), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto pb-10 font-sans text-gray-800">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-yellow-500" />
            AI Chatbot Configuration
          </h1>
          <p className="text-gray-500 mt-1">Train your AI to automatically reply to WhatsApp leads 24/7.</p>
        </div>
        
        <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
          <span className={`text-sm font-semibold ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
            {isActive ? 'Bot is Active' : 'Bot is Paused'}
          </span>
          <button onClick={() => setIsActive(!isActive)} className="text-gray-600 hover:text-gray-900">
            {isActive ? (
              <ToggleRight className="w-8 h-8 text-green-500" />
            ) : (
              <ToggleLeft className="w-8 h-8 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Configuration Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bot Name</label>
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="e.g. Sales Assistant"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Business Knowledge Base (Context)</label>
              <p className="text-xs text-gray-500 mb-2">Tell the AI everything about your products, pricing, and services so it can answer customer questions.</p>
              <textarea
                rows={5}
                value={businessContext}
                onChange={(e) => setBusinessContext(e.target.value)}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="What does your business do? What are your prices?"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Strict Rules & Guidelines</label>
              <p className="text-xs text-gray-500 mb-2">What should the AI NEVER do? (e.g. Don't give discounts, don't promise deadlines).</p>
              <textarea
                rows={4}
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono"
                placeholder="- Rule 1\n- Rule 2"
              />
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-indigo-600 text-white py-2.5 px-6 rounded-lg hover:bg-indigo-700 transition-colors flex items-center font-medium shadow-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving Brain..." : "Save AI Training"}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Info & Test */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl text-white shadow-md">
            <Bot className="w-8 h-8 mb-4 opacity-90" />
            <h3 className="font-bold text-lg mb-2">How it works</h3>
            <p className="text-indigo-100 text-sm mb-4">
              When a new WhatsApp message arrives, the CRM forwards it to Google Gemini AI. The AI reads your knowledge base above and instantly drafts a polite, intelligent reply!
            </p>
            <ul className="text-sm space-y-2 text-indigo-100 font-medium">
              <li className="flex items-center"><CheckCircleIcon /> 24/7 Availability</li>
              <li className="flex items-center"><CheckCircleIcon /> Human-like responses</li>
              <li className="flex items-center"><CheckCircleIcon /> Automatic Lead Qualification</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-2xl">
            <ShieldAlert className="w-6 h-6 text-yellow-600 mb-3" />
            <h3 className="font-bold text-yellow-900 text-sm mb-2">Safety Guardrails</h3>
            <p className="text-xs text-yellow-800 leading-relaxed">
              If the AI doesn't know the answer to a specific question, it is programmed to automatically hand over the chat to a human agent and alert you via a notification.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

function CheckCircleIcon() {
  return (
    <svg className="w-4 h-4 mr-2 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
