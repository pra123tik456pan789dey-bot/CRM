"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Plus,
  Calendar,
  User,
  Clock,
  AlertCircle,
  CheckSquare
} from "lucide-react";
import { toggleTaskStatus, createTask } from "@/app/actions/taskActions";

export default function TasksView({ initialTasks, leads }: { initialTasks: any[]; leads: any[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState<"ALL" | "TODAY" | "PENDING" | "COMPLETED">("PENDING");

  // New task modal
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [contactId, setContactId] = useState(leads[0]?.id || "");

  const handleToggle = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "COMPLETED" ? "PENDING" : "COMPLETED";
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
    await toggleTaskStatus(taskId, currentStatus);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    const res = await createTask({
      contact_id: contactId,
      title,
      due_date: dueDate,
      priority
    });

    if (res.success && res.task) {
      setTasks([res.task, ...tasks]);
    }
    setTitle("");
    setShowModal(false);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "PENDING") return task.status === "PENDING";
    if (filter === "COMPLETED") return task.status === "COMPLETED";
    if (filter === "TODAY") {
      const today = new Date().toDateString();
      return new Date(task.due_date).toDateString() === today;
    }
    return true;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task & Follow-up Management</h1>
          <p className="text-sm text-gray-500 mt-1">Keep track of client follow-ups, scheduled calls, and reminders.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Task
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 mb-6">
        {(["PENDING", "TODAY", "ALL", "COMPLETED"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`pb-3 px-4 font-semibold text-sm transition-colors border-b-2 ${
              filter === tab
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            {tab === "PENDING" && "Pending Tasks"}
            {tab === "TODAY" && "My Tasks Today"}
            {tab === "ALL" && "All Tasks"}
            {tab === "COMPLETED" && "Completed"}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3 flex-1 overflow-y-auto">
        {filteredTasks.map((task) => {
          const isDone = task.status === "COMPLETED";
          return (
            <div
              key={task.id}
              className={`p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-between transition-all ${
                isDone ? "opacity-60 bg-gray-50" : "hover:border-indigo-300"
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => handleToggle(task.id, task.status)}
                  className="mt-0.5 text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div>
                  <h4 className={`font-semibold text-sm text-gray-900 ${isDone ? "line-through text-gray-500" : ""}`}>
                    {task.title}
                  </h4>
                  {task.contact && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <User className="w-3 h-3 text-gray-400" /> Linked Contact:{" "}
                      <Link href={`/leads/${task.contact.id}`} className="text-indigo-600 hover:underline font-medium">
                        {task.contact.name} ({task.contact.company_name || "N/A"})
                      </Link>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-400" /> {new Date(task.due_date).toLocaleDateString()}
                  </span>
                </div>

                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                    task.priority === "HIGH"
                      ? "bg-red-100 text-red-700"
                      : task.priority === "MEDIUM"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {task.priority}
                </span>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <CheckSquare className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="font-medium">No tasks found in this view.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Schedule New Task</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Send updated pricing proposal"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Link Contact</label>
                <select
                  value={contactId}
                  onChange={(e) => setContactId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.company_name || "N/A"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Due Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
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
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
