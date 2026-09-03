"use client";

import React, { useState } from "react";
import { Zap, Plus, CheckCircle2, Play, ToggleLeft, ToggleRight, ArrowRight, Settings } from "lucide-react";
import { createWorkflowRule, toggleWorkflowStatus } from "@/app/actions/workflowActions";

export default function WorkflowsView({ initialRules }: { initialRules: any[] }) {
  const [rules, setRules] = useState(initialRules);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [triggerEvent, setTriggerEvent] = useState("LEAD_CREATED");
  const [actionType, setActionType] = useState("SEND_WHATSAPP");
  const [message, setMessage] = useState("Hello! Welcome to Apex Global.");

  const handleToggle = async (id: string, is_active: boolean) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, is_active: !is_active } : r)));
    await toggleWorkflowStatus(id, is_active);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const res = await createWorkflowRule({
      name,
      trigger_event: triggerEvent,
      action_type: actionType,
      action_config: JSON.stringify({ message })
    });

    if (res.success && res.rule) {
      setRules([res.rule, ...rules]);
      setShowModal(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Visual Workflow & Automation Engine</h1>
          <p className="text-sm text-gray-500 mt-1">Build 'If-This-Then-That' rules to automate WhatsApp messages, tags, and lead assignment.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Automation Rule
        </button>
      </div>

      {/* Rules List */}
      <div className="space-y-4 flex-1 overflow-y-auto">
        {rules.map((rule) => {
          const config = JSON.parse(rule.action_config || "{}");
          return (
            <div
              key={rule.id}
              className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between hover:border-indigo-300 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white ${
                  rule.is_active ? "bg-indigo-600" : "bg-gray-400"
                }`}>
                  <Zap className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-gray-900 text-base">{rule.name}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      rule.is_active ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                    }`}>
                      {rule.is_active ? "ACTIVE RULE" : "PAUSED"}
                    </span>
                  </div>

                  {/* Flow Diagram Line */}
                  <div className="flex items-center gap-2 text-xs text-gray-600 mt-2 font-medium">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100">
                      IF: {rule.trigger_event}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-100">
                      THEN: {rule.action_type}
                    </span>
                    {config.message && (
                      <span className="text-gray-400 italic max-w-xs truncate">"{config.message}"</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleToggle(rule.id, rule.is_active)}
                className="text-gray-500 hover:text-indigo-600 p-2"
              >
                {rule.is_active ? (
                  <ToggleRight className="w-8 h-8 text-emerald-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-400" />
                )}
              </button>
            </div>
          );
        })}

        {rules.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Zap className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p>No automation rules created yet.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Create Visual Automation Rule</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Welcome Message on New WhatsApp Lead"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Trigger Event (IF)</label>
                <select
                  value={triggerEvent}
                  onChange={(e) => setTriggerEvent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="LEAD_CREATED">New Lead Created</option>
                  <option value="STATUS_CHANGED">Lead Status Changes</option>
                  <option value="NO_REPLY_2_DAYS">No Reply for 2 Days</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Action (THEN)</label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="SEND_WHATSAPP">Send WhatsApp Message</option>
                  <option value="SEND_EMAIL">Send Email Notification</option>
                  <option value="REASSIGN_LEAD">Round-Robin Reassign</option>
                  <option value="ADD_TAG">Add High Priority Tag</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Message / Config</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700"
                >
                  Save & Enable Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
