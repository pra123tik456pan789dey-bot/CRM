"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Phone, Mail, Plus, DollarSign, Calendar, User } from "lucide-react";
import { updateDealStage, createDeal } from "@/app/actions/dealActions";

function SortableDealCard({ deal }: { deal: any }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: deal.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing mb-3 group hover:border-indigo-400 transition-all"
    >
      <h4 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-indigo-600">
        {deal.title}
      </h4>
      
      <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
        <User className="w-3 h-3 text-gray-400" /> {deal.contact?.name || "No Contact"} ({deal.contact?.company_name || "N/A"})
      </p>

      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <span className="text-sm font-bold text-emerald-600">
          ₹{deal.value?.toLocaleString("en-IN")}
        </span>
        <span className="text-[10px] font-semibold px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
          {deal.probability}% Win
        </span>
      </div>
    </div>
  );
}

export default function KanbanDealsBoard({
  initialPipeline,
  initialDeals,
  leads
}: {
  initialPipeline: any;
  initialDeals: any[];
  leads: any[];
}) {
  const [deals, setDeals] = useState(initialDeals);
  const [isMounted, setIsMounted] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New deal state
  const [dealTitle, setDealTitle] = useState("");
  const [contactId, setContactId] = useState(leads[0]?.id || "");
  const [dealValue, setDealValue] = useState("500000");

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const stages = initialPipeline?.stages || [
    { id: "s1", name: "New Lead", color: "bg-blue-100 text-blue-800" },
    { id: "s2", name: "Contacted", color: "bg-yellow-100 text-yellow-800" },
    { id: "s3", name: "Qualified", color: "bg-indigo-100 text-indigo-800" },
    { id: "s4", name: "Proposal Sent", color: "bg-purple-100 text-purple-800" },
    { id: "s5", name: "Negotiation", color: "bg-amber-100 text-amber-800" },
    { id: "s6", name: "Closed Won", color: "bg-green-100 text-green-800" },
    { id: "s7", name: "Closed Lost", color: "bg-gray-100 text-gray-800" }
  ];

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const draggedDeal = deals.find((d) => d.id === activeId);
    if (!draggedDeal) return;

    // Check if dropped over a column stage directly or over another deal item
    const targetStage = stages.find((s: any) => s.id === overId);
    let newStageId = draggedDeal.stage_id;
    let newStageName = draggedDeal.stage;

    if (targetStage) {
      newStageId = targetStage.id;
      newStageName = targetStage.name;
    } else {
      const overDeal = deals.find((d) => d.id === overId);
      if (overDeal) {
        newStageId = overDeal.stage_id;
        newStageName = overDeal.stage;
      }
    }

    if (draggedDeal.stage_id !== newStageId || draggedDeal.stage !== newStageName) {
      // Optimistic UI Update
      setDeals(
        deals.map((d) =>
          d.id === activeId ? { ...d, stage_id: newStageId, stage: newStageName } : d
        )
      );

      // Server Action Update
      await updateDealStage(activeId, newStageId, newStageName);
    }
  };

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealTitle.trim() || !contactId) return;

    const res = await createDeal({
      contact_id: contactId,
      title: dealTitle,
      value: parseFloat(dealValue) || 0
    });

    if (res.success && res.deal) {
      setDeals([res.deal, ...deals]);
    }
    setDealTitle("");
    setShowCreateModal(false);
  };

  if (!isMounted) return null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header Bar */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Deals & Opportunities Board</h2>
          <p className="text-sm text-gray-500">Drag and drop deals across sales stages to update pipeline revenue.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Deal
        </button>
      </div>

      {/* Kanban Drag and Drop Container */}
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          {stages.map((stage: any) => {
            const stageDeals = deals.filter(
              (d) => d.stage_id === stage.id || d.stage === stage.name
            );
            const totalStageValue = stageDeals.reduce((acc, d) => acc + (d.value || 0), 0);

            return (
              <div
                key={stage.id}
                className="w-72 flex-shrink-0 flex flex-col bg-gray-50/70 rounded-xl border border-gray-200"
              >
                <div className="p-3.5 border-b border-gray-200 bg-white rounded-t-xl sticky top-0 z-10 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">{stage.name}</h3>
                    <span className="text-[11px] font-bold text-emerald-600">
                      ₹{totalStageValue.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${stage.color || "bg-indigo-100 text-indigo-800"}`}>
                    {stageDeals.length}
                  </span>
                </div>

                <SortableContext
                  items={[stage.id, ...stageDeals.map((d) => d.id)]}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex-1 p-3 overflow-y-auto min-h-[250px]" id={stage.id}>
                    {stageDeals.map((deal) => (
                      <SortableDealCard key={deal.id} deal={deal} />
                    ))}
                    {stageDeals.length === 0 && (
                      <div className="h-full border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-xs py-8">
                        Drag deal here
                      </div>
                    )}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </DndContext>
      </div>

      {/* Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Deal</h3>
            <form onSubmit={handleCreateDeal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Deal Title</label>
                <input
                  type="text"
                  required
                  value={dealTitle}
                  onChange={(e) => setDealTitle(e.target.value)}
                  placeholder="e.g. Enterprise License Deal"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Associated Contact</label>
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
                <label className="block text-xs font-semibold text-gray-500 mb-1">Deal Value (₹ INR)</label>
                <input
                  type="number"
                  required
                  value={dealValue}
                  onChange={(e) => setDealValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700"
                >
                  Create Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
