"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Phone, Mail, MoreVertical } from 'lucide-react';
import { updateLeadStatus } from '@/app/actions/leadActions';

const COLUMNS = [
  { id: 'NEW', title: 'New Leads', color: 'bg-blue-100 text-blue-800' },
  { id: 'CONTACTED', title: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'PROPOSAL', title: 'Proposal Sent', color: 'bg-purple-100 text-purple-800' },
  { id: 'WON', title: 'Closed Won', color: 'bg-green-100 text-green-800' },
  { id: 'LOST', title: 'Closed Lost', color: 'bg-gray-100 text-gray-800' },
];

function SortableLeadCard({ id, lead }: { id: string, lead: any }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing mb-3 group hover:border-indigo-300">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-900"><Link href={`/leads/${lead.id}`} className="hover:text-indigo-600 hover:underline">{lead.name}</Link></h4>
        <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-3">{lead.email}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-900">Live DB Record</span>
        <div className="flex gap-2">
          <button className="p-1.5 bg-gray-50 rounded text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"><Phone className="w-3.5 h-3.5" /></button>
          <button className="p-1.5 bg-gray-50 rounded text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"><Mail className="w-3.5 h-3.5" /></button>
        </div>
      </div>
    </div>
  );
}

export default function PipelineBoard({ initialLeads }: { initialLeads: any[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Find lead and determine new status
    const draggedLead = leads.find(l => l.id === activeId);
    if (!draggedLead) return;

    // Check if dropped over a column directly or over another item
    const isOverColumn = COLUMNS.some(c => c.id === overId);
    let newStatus = draggedLead.status;

    if (isOverColumn) {
      newStatus = overId;
    } else {
      const overLead = leads.find(l => l.id === overId);
      if (overLead) newStatus = overLead.status;
    }

    if (draggedLead.status !== newStatus) {
      // Optimistic UI Update
      setLeads(leads.map(l => l.id === activeId ? { ...l, status: newStatus } : l));
      
      // Server Action Update
      await updateLeadStatus(activeId, newStatus);
    }
  };

  if (!isMounted) {
    return null; // Prevents hydration mismatch with DndKit
  }

  return (
    <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        {COLUMNS.map(column => {
          const columnLeads = leads.filter(l => l.status === column.id);
          return (
            <div key={column.id} className="w-80 flex-shrink-0 flex flex-col bg-gray-50/50 rounded-xl border border-gray-200">
              {/* Droppable Area for Column (Allows dropping into empty columns) */}
              <SortableContext items={[column.id, ...columnLeads.map(l => l.id)]} strategy={verticalListSortingStrategy}>
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white rounded-t-xl z-10 sticky top-0">
                  <h3 className="font-semibold text-gray-700">{column.title}</h3>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${column.color}`}>
                    {columnLeads.length}
                  </span>
                </div>
                
                <div className="flex-1 p-3 overflow-y-auto min-h-[200px]" id={column.id}>
                  {columnLeads.map(lead => (
                    <SortableLeadCard key={lead.id} id={lead.id} lead={lead} />
                  ))}
                  {columnLeads.length === 0 && (
                    <div className="h-full border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                      Drop here
                    </div>
                  )}
                </div>
              </SortableContext>
            </div>
          );
        })}
      </DndContext>
    </div>
  );
}
