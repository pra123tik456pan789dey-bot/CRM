"use client";

import React, { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Lightbulb,
  Target,
  FileText,
  Lock,
  Flame,
  Check,
  AlertTriangle,
  FolderOpen
} from "lucide-react";

export default function PersonalSpaceView() {
  const [activeTab, setActiveTab] = useState<"TASKS" | "IDEAS" | "HABITS" | "REMINDERS">("TASKS");

  // Personal Tasks state
  const [tasks, setTasks] = useState<any[]>([
    { id: 1, title: "Review Q4 Agency Marketing Pitch Deck", dueDate: "2026-10-25", priority: "High", completed: false },
    { id: 2, title: "Call Ravi regarding high-ticket dental lead closing", dueDate: "2026-10-22", priority: "High", completed: true },
    { id: 3, title: "Configure Meta Lead Webhook verify token", dueDate: "2026-10-24", priority: "Medium", completed: false },
    { id: 4, title: "Verify GST tax invoice reports for October", dueDate: "2026-10-28", priority: "Low", completed: false },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("2026-10-25");
  const [newTaskPriority, setNewTaskPriority] = useState<"High" | "Medium" | "Low">("Medium");

  // Habits tracker state
  const [habits, setHabits] = useState<any[]>([
    { id: 1, title: "Review Open Pipeline & Warm Deals", streak: 12, doneToday: true },
    { id: 2, title: "15-min Team Sync with Sales Executives", streak: 8, doneToday: true },
    { id: 3, title: "Audit Uncontacted Facebook Leads", streak: 21, doneToday: false },
  ]);

  // Ideas state
  const [ideas, setIdeas] = useState<string[]>([
    "Launch automated WhatsApp re-engagement campaign for leads lost > 30 days ago",
    "Partner with local Shopify web developers for lead referral exchange",
    "Introduce ₹999 starter consultation package on Instagram bio Linktree"
  ]);
  const [newIdea, setNewIdea] = useState("");

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks([
      { id: Date.now(), title: newTaskTitle, dueDate: newTaskDate, priority: newTaskPriority, completed: false },
      ...tasks
    ]);
    setNewTaskTitle("");
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const focusPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 100;
  const overdueCount = tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date("2026-10-21")).length;
  const highCount = tasks.filter(t => !t.completed && t.priority === "High").length;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-sans">
      {/* Top Banner (Zepfly Style) */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Personal Space</h1>
            <p className="text-xs font-semibold text-gray-500">Your private workspace — visible only to you.</p>
          </div>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "TASKS", label: "Tasks" },
            { id: "IDEAS", label: "Ideas" },
            { id: "HABITS", label: "Habits" },
            { id: "REMINDERS", label: "Reminders" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-gray-900 text-white shadow-sm"
                  : "bg-gray-100/80 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Focus & Productivity Widget Bar */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {/* Circular Progress Ring */}
          <div className="relative w-16 h-16 rounded-full flex items-center justify-center border-4 border-indigo-100">
            <div
              className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent"
              style={{ transform: `rotate(${focusPercent * 3.6}deg)` }}
            />
            <span className="text-sm font-black text-gray-900">{focusPercent}%</span>
          </div>

          <div>
            <h4 className="text-sm font-black text-gray-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" /> My Focus
            </h4>
            <p className="text-xs text-gray-500">
              {focusPercent === 100 ? "All clear — nothing open." : `${tasks.length - completedCount} open tasks pending today.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-center">
          <div className="bg-gray-50 border border-gray-200/70 px-4 py-2 rounded-2xl min-w-[70px]">
            <span className="text-xs font-bold text-gray-400 block">To do</span>
            <span className="text-lg font-black text-gray-900">{tasks.length - completedCount}</span>
          </div>

          <div className="bg-gray-50 border border-gray-200/70 px-4 py-2 rounded-2xl min-w-[70px]">
            <span className="text-xs font-bold text-gray-400 block">Overdue</span>
            <span className="text-lg font-black text-amber-600">{overdueCount}</span>
          </div>

          <div className="bg-gray-50 border border-gray-200/70 px-4 py-2 rounded-2xl min-w-[70px]">
            <span className="text-xs font-bold text-gray-400 block">High</span>
            <span className="text-lg font-black text-red-600">{highCount}</span>
          </div>
        </div>
      </div>

      {/* Tab 1: Tasks View */}
      {activeTab === "TASKS" && (
        <div className="space-y-4">
          {/* Quick Add Task Bar (Zepfly Style) */}
          <form onSubmit={handleAddTask} className="bg-white p-2 sm:p-3 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center gap-2 w-full flex-1 px-2">
              <Plus className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Add a personal task and press Enter..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full text-xs font-medium bg-transparent outline-none text-gray-800"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <input
                type="date"
                value={newTaskDate}
                onChange={(e) => setNewTaskDate(e.target.value)}
                className="px-2.5 py-1.5 border border-gray-200 rounded-xl text-xs bg-gray-50 font-bold text-gray-600 outline-none"
              />

              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as any)}
                className="px-2.5 py-1.5 border border-gray-200 rounded-xl text-xs bg-gray-50 font-bold text-gray-600 outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                + Add
              </button>
            </div>
          </form>

          {/* Tasks List */}
          <div className="bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-sm divide-y divide-gray-100">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50/60 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                      task.completed
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-gray-300 hover:border-gray-500 bg-white"
                    }`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div>
                    <p className={`text-xs font-bold transition-all ${task.completed ? "line-through text-gray-400" : "text-gray-900"}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-400 font-semibold">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {task.dueDate}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded font-bold ${
                        task.priority === "High" ? "bg-red-50 text-red-600" : task.priority === "Medium" ? "bg-amber-50 text-amber-600" : "bg-gray-100 text-gray-600"
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Habits View */}
      {activeTab === "HABITS" && (
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm space-y-4">
          <h3 className="font-black text-gray-900 text-base">Daily Agency Habits</h3>
          <div className="space-y-3">
            {habits.map((h) => (
              <div key={h.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200/70 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{h.title}</h4>
                  <span className="text-xs font-semibold text-amber-600 flex items-center gap-1 mt-1">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {h.streak} day streak
                  </span>
                </div>
                <button
                  onClick={() => setHabits(habits.map(x => x.id === h.id ? { ...x, doneToday: !x.doneToday } : x))}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    h.doneToday ? "bg-emerald-600 text-white" : "bg-white border border-gray-300 text-gray-700"
                  }`}
                >
                  {h.doneToday ? "✓ Done Today" : "Mark Done"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Ideas Board */}
      {activeTab === "IDEAS" && (
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm space-y-4">
          <h3 className="font-black text-gray-900 text-base">Brainstorming & Growth Ideas</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Record a fresh marketing or sales strategy idea..."
              value={newIdea}
              onChange={(e) => setNewIdea(e.target.value)}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => {
                if (newIdea.trim()) {
                  setIdeas([newIdea, ...ideas]);
                  setNewIdea("");
                }
              }}
              className="px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-2xl shadow-sm"
            >
              Save Idea
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {ideas.map((idea, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs font-medium space-y-2 relative">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <p>{idea}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Reminders */}
      {activeTab === "REMINDERS" && (
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm space-y-3">
          <h3 className="font-black text-gray-900 text-base">Automated Daily Reminders</h3>
          <p className="text-xs text-gray-500">Scheduled notifications sent to your WhatsApp and email.</p>
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs font-semibold text-indigo-900 flex items-center justify-between">
            <span>⏰ 10:00 AM: Daily Leads Summary & Unattended Inquiries</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Active</span>
          </div>
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs font-semibold text-indigo-900 flex items-center justify-between">
            <span>⏰ 06:30 PM: Daily Closed Deals & Executive Call Log Review</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Active</span>
          </div>
        </div>
      )}
    </div>
  );
}
