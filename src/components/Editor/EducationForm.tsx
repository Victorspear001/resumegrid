import { Plus, Trash2, GripVertical } from 'lucide-react';
import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableEducationItem: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: 'relative' as const,
  };

  return (
    <div ref={setNodeRef} style={style} className={`p-5 border border-gray-800 rounded-lg bg-[#0a0a0a] relative group ${isDragging ? 'shadow-[0_0_20px_rgba(59,130,246,0.3)] ring-2 ring-blue-500 opacity-90' : ''}`}>
      <div 
        {...attributes} 
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-600 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-800 rounded"
      >
        <GripVertical size={20} />
      </div>
      {children}
    </div>
  );
}

export function EducationForm() {
  const { data, addEducation, updateEducation, removeEducation, reorderEducation } = useResumeStore();
  const { education } = data;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = education.findIndex(e => e.id === active.id);
      const newIndex = education.findIndex(e => e.id === over.id);
      reorderEducation(oldIndex, newIndex);
    }
  };

  return (
    <section className="space-y-6">
      <div className="border-b border-gray-800 pb-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-200">Education</h3>
        <button 
          onClick={addEducation}
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
        >
          <Plus size={16} /> Add Education
        </button>
      </div>
      
      <div className="space-y-8">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={education.map(e => e.id)} strategy={verticalListSortingStrategy}>
            {education.map((edu, index) => (
              <SortableEducationItem key={edu.id} id={edu.id}>
                <button 
                  onClick={() => removeEducation(edu.id)}
                  className="absolute right-4 top-4 text-gray-600 hover:text-red-500 transition-colors"
                  title="Remove Education"
                >
                  <Trash2 size={18} />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-6">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-400">Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900 bg-[#050505] text-gray-300"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-400">Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900 bg-[#050505] text-gray-300"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-400">Field of Study</label>
                    <input
                      type="text"
                      value={edu.fieldOfStudy}
                      onChange={(e) => updateEducation(edu.id, { fieldOfStudy: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900 bg-[#050505] text-gray-300"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-400">Location</label>
                    <input
                      type="text"
                      value={edu.location}
                      onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900 bg-[#050505] text-gray-300"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-400">Start Date</label>
                      <input
                        type="text"
                        placeholder="e.g. Aug 2012"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900 bg-[#050505] text-gray-300"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-400">End Date</label>
                      <input
                        type="text"
                        placeholder="e.g. May 2016"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900 bg-[#050505] text-gray-300"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-400">Percentage (Optional)</label>
                    <input
                      type="text"
                      value={edu.percentage}
                      onChange={(e) => updateEducation(edu.id, { percentage: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900 bg-[#050505] text-gray-300"
                    />
                  </div>
                </div>
              </SortableEducationItem>
            ))}
          </SortableContext>
        </DndContext>
        
        {education.length === 0 && (
          <div className="text-center py-8 text-gray-600 border-2 border-dashed border-gray-800 rounded-lg">
            No education added yet.
          </div>
        )}
      </div>
    </section>
  );
}

