import { Plus, Trash2, GripVertical, Wand2, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { generateExperienceDescription } from '../../services/aiService';

const SortableExperienceItem: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: 'relative' as const,
  };

  return (
    <div ref={setNodeRef} style={style} className={`p-5 border border-gray-200 rounded-lg bg-gray-50 relative group ${isDragging ? 'shadow-lg ring-2 ring-blue-500 opacity-90' : ''}`}>
      <div 
        {...attributes} 
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
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
  const [generatingId, setGeneratingId] = useState<string | null>(null);

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

  const handleGenerateDescription = async (expId: string, position: string, company: string) => {
    if (!position || !company) {
      alert("Please enter both Company and Position first.");
      return;
    }

    setGeneratingId(expId);
    try {
      const generatedText = await generateExperienceDescription(position, company);
      // Split by newlines and clean up bullets
      const bullets = generatedText
        .split('\n')
        .map(line => line.replace(/^-\s*/, '').trim())
        .filter(line => line.length > 0);
      
      updateExperience(expId, { description: bullets });
    } catch (error) {
      alert("Failed to generate description. Please try again.");
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <section className="space-y-6">
      <div className="border-b border-gray-200 pb-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Work Experience</h3>
        <button 
          onClick={addExperience}
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
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
                  className="absolute right-4 top-4 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove Experience"
                >
                  <Trash2 size={18} />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-6">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Position</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Start Date</label>
                      <input
                        type="text"
                        placeholder="e.g. Jan 2020"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">End Date</label>
                      <input
                        type="text"
                        placeholder="e.g. Present"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                        disabled={exp.current}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2 flex items-center gap-2 mt-1">
                    <input
                      type="checkbox"
                      id={`current-${exp.id}`}
                      checked={exp.current}
                      onChange={(e) => updateExperience(exp.id, { current: e.target.checked, endDate: e.target.checked ? 'Present' : '' })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`current-${exp.id}`} className="text-sm text-gray-700">I currently work here</label>
                  </div>
                  
                  <div className="sm:col-span-2 space-y-3 mt-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-700">Description (Bullet Points)</label>
                      <button
                        type="button"
                        onClick={() => handleGenerateDescription(exp.id, exp.position, exp.company)}
                        disabled={generatingId === exp.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {generatingId === exp.id ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                        {generatingId === exp.id ? 'Generating...' : 'Generate with AI'}
                      </button>
                    </div>
                    {exp.description.map((bullet, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0"></div>
                        <textarea
                          value={bullet}
                          onChange={(e) => handleBulletChange(exp.id, i, e.target.value)}
                          rows={2}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white resize-y"
                          placeholder="Describe your achievements..."
                        />
                        <button 
                          onClick={() => removeBullet(exp.id, i)}
                          className="p-2 text-gray-400 hover:text-red-500 mt-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => addBullet(exp.id)}
                      className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 mt-2"
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
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            No work experience added yet.
          </div>
        )}
      </div>
    </section>
  );
}
