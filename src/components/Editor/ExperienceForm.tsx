import { Plus, Trash2, GripVertical } from 'lucide-react';
import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableExperienceItem: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
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

export function ExperienceForm() {
  const { data, addExperience, updateExperience, removeExperience, reorderExperience } = useResumeStore();
  const { experience } = data;

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
      const oldIndex = experience.findIndex(e => e.id === active.id);
      const newIndex = experience.findIndex(e => e.id === over.id);
      reorderExperience(oldIndex, newIndex);
    }
  };

  const handleBulletChange = (expId: string, index: number, value: string) => {
    const exp = experience.find(e => e.id === expId);
    if (!exp) return;
    
    const newDesc = [...exp.description];
    newDesc[index] = value;
    updateExperience(expId, { description: newDesc });
  };

  const addBullet = (expId: string) => {
    const exp = experience.find(e => e.id === expId);
    if (!exp) return;
    
    updateExperience(expId, { description: [...exp.description, ''] });
  };

  const removeBullet = (expId: string, index: number) => {
    const exp = experience.find(e => e.id === expId);
    if (!exp) return;
    
    const newDesc = exp.description.filter((_, i) => i !== index);
    updateExperience(expId, { description: newDesc });
  };

  return (
    <section className="space-y-6">
      <div className="border-b border-gray-800 pb-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-200">Work Experience</h3>
        <button 
          onClick={addExperience}
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
        >
          <Plus size={16} /> Add Experience
        </button>
      </div>
      
      <div className="space-y-8">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={experience.map(e => e.id)} strategy={verticalListSortingStrategy}>
            {experience.map((exp, index) => (
              <SortableExperienceItem key={exp.id} id={exp.id}>
                <button 
                  onClick={() => removeExperience(exp.id)}
                  className="absolute right-4 top-4 text-gray-600 hover:text-red-500 transition-colors"
                  title="Remove Experience"
                >
                  <Trash2 size={18} />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-6">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-400">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900 bg-[#050505] text-gray-300"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-400">Position</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900 bg-[#050505] text-gray-300"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-400">Location</label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900 bg-[#050505] text-gray-300"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-400">Start Date</label>
                      <input
                        type="text"
                        placeholder="e.g. Jan 2020"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900 bg-[#050505] text-gray-300"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-400">End Date</label>
                      <input
                        type="text"
                        placeholder="e.g. Present"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                        disabled={exp.current}
                        className="w-full px-3 py-2 border border-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900 bg-[#050505] text-gray-300 disabled:bg-gray-900 disabled:text-gray-600"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2 flex items-center gap-2 mt-1">
                    <input
                      type="checkbox"
                      id={`current-${exp.id}`}
                      checked={exp.current}
                      onChange={(e) => updateExperience(exp.id, { current: e.target.checked, endDate: e.target.checked ? 'Present' : '' })}
                      className="rounded border-gray-800 bg-black text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`current-${exp.id}`} className="text-sm text-gray-400">I currently work here</label>
                  </div>
                  
                  <div className="sm:col-span-2 space-y-3 mt-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-400">Description (Bullet Points)</label>
                    </div>
                    {exp.description.map((bullet, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-gray-600 shrink-0"></div>
                        <textarea
                          value={bullet}
                          onChange={(e) => handleBulletChange(exp.id, i, e.target.value)}
                          rows={2}
                          className="flex-1 px-3 py-2 border border-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900 bg-[#050505] text-gray-300 resize-y"
                          placeholder="Describe your achievements..."
                        />
                        <button 
                          onClick={() => removeBullet(exp.id, i)}
                          className="p-2 text-gray-600 hover:text-red-500 mt-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => addBullet(exp.id)}
                      className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-500 mt-2"
                    >
                      <Plus size={14} /> Add Bullet Point
                    </button>
                  </div>
                </div>
              </SortableExperienceItem>
            ))}
          </SortableContext>
        </DndContext>
        
        {experience.length === 0 && (
          <div className="text-center py-8 text-gray-600 border-2 border-dashed border-gray-800 rounded-lg">
            No work experience added yet.
          </div>
        )}
      </div>
    </section>
  );
}
