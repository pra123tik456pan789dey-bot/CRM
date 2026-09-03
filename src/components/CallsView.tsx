"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Phone, Clock, Play, User, PhoneCall, PhoneIncoming, PhoneOutgoing, PhoneMissed } from "lucide-react";
import { initiateClickToCall } from "@/app/actions/telephonyActions";

export default function CallsView({ logs, leads }: { logs: any[]; leads: any[] }) {
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || "");
  const [isDialing, setIsDialing] = useState(false);
  const [dialResult, setDialResult] = useState<string | null>(null);

  const handleDial = async () => {
    if (!selectedLeadId) return;
    setIsDialing(true);
    setDialResult(null);
    const res = await initiateClickToCall(selectedLeadId);
    setIsDialing(false);
    if (res.success) {
      setDialResult("Call initiated! Twilio connected to agent and customer phone.");
    } else {
      setDialResult(`Failed to initiate call: ${res.error}`);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Cloud Telephony & Call Logs</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Review call duration, status, and listen to recorded calls.</p>
        </div>

        {/* Quick Dialer Bar */}
        <div className="flex items-center gap-2 bg-white p-2 border border-gray-200 rounded-xl shadow-sm">
          <select
            value={selectedLeadId}
            onChange={(e) => setSelectedLeadId(e.target.value)}
            className="w-full sm:w-auto px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800 bg-white"
          >
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.phone || "No Phone"})
              </option>
            ))}
          </select>

          <button
            onClick={handleDial}
            disabled={isDialing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors flex-shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5" /> {isDialing ? "Dialing..." : "Call"}
          </button>
        </div>
      </div>

      {dialResult && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex justify-between items-center">
          <span>{dialResult}</span>
          <button onClick={() => setDialResult(null)} className="font-bold text-sm ml-2">×</button>
        </div>
      )}

      {/* Call Logs Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
              <th className="py-3 px-6">Contact / Lead</th>
              <th className="py-3 px-6">Direction & Status</th>
              <th className="py-3 px-6">Numbers (From → To)</th>
              <th className="py-3 px-6">Duration</th>
              <th className="py-3 px-6">Timestamp</th>
              <th className="py-3 px-6 text-right">Recording Playback</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map((log) => {
              const isOutbound = log.direction === "OUTBOUND";
              const isMissed = log.status === "MISSED" || log.status === "no-answer";

              return (
                <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900">
                    <Link href={`/leads/${log.contact.id}`} className="hover:text-indigo-600 font-semibold hover:underline">
                      {log.contact?.name}
                    </Link>
                    <span className="block text-xs text-gray-400 font-normal">{log.contact?.company_name || "N/A"}</span>
                  </td>

                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      isMissed
                        ? "bg-red-100 text-red-700"
                        : isOutbound
                        ? "bg-indigo-100 text-indigo-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {isMissed ? <PhoneMissed className="w-3.5 h-3.5" /> : isOutbound ? <PhoneOutgoing className="w-3.5 h-3.5" /> : <PhoneIncoming className="w-3.5 h-3.5" />}
                      {log.direction} ({log.status})
                    </span>
                  </td>

                  <td className="py-4 px-6 font-mono text-xs text-gray-600">
                    {log.from_number || "Caller"} → {log.to_number || "Receiver"}
                  </td>

                  <td className="py-4 px-6 text-gray-600 font-medium">
                    {Math.floor(log.duration_seconds / 60)}m {log.duration_seconds % 60}s
                  </td>

                  <td className="py-4 px-6 text-xs text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>

                  <td className="py-4 px-6 text-right">
                    {log.recording_url ? (
                      <audio controls className="h-8 inline-block max-w-[220px]">
                        <source src={log.recording_url} type="audio/mpeg" />
                      </audio>
                    ) : (
                      <span className="text-xs text-gray-400 italic">No recording</span>
                    )}
                  </td>
                </tr>
              );
            })}

            {logs.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400">
                  No call logs available yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
