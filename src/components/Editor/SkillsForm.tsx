import { Plus, Trash2, GripVertical } from 'lucide-react';
import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableSkillItem: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
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

export function SkillsForm() {
  const { data, addSkillCategory, updateSkillCategory, removeSkillCategory, reorderSkillCategories } = useResumeStore();
  const { skills } = data;

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
      const oldIndex = skills.findIndex(s => s.id === active.id);
      const newIndex = skills.findIndex(s => s.id === over.id);
      reorderSkillCategories(oldIndex, newIndex);
    }
  };

  const handleSkillsChange = (id: string, value: string) => {
    // Split by comma and trim
    const skillsArray = value.split(',').map(s => s.trim()).filter(Boolean);
    updateSkillCategory(id, { skills: skillsArray });
  };

  return (
    <section className="space-y-6">
      <div className="border-b border-gray-200 pb-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Skills</h3>
        <button 
          onClick={addSkillCategory}
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>
      
      <div className="space-y-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={skills.map(s => s.id)} strategy={verticalListSortingStrategy}>
            {skills.map((category, index) => (
              <SortableSkillItem key={category.id} id={category.id}>
                <button 
                  onClick={() => removeSkillCategory(category.id)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove Category"
                >
                  <Trash2 size={18} />
                </button>

                <div className="grid grid-cols-1 gap-4 ml-6">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Category Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Programming Languages"
                      value={category.name}
                      onChange={(e) => updateSkillCategory(category.id, { name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Skills (comma separated)</label>
                    <textarea
                      placeholder="e.g. JavaScript, React, Node.js"
                      value={category.skills.join(', ')}
                      onChange={(e) => handleSkillsChange(category.id, e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white resize-y"
                    />
                  </div>
                </div>
              </SortableSkillItem>
            ))}
          </SortableContext>
        </DndContext>
        
        {skills.length === 0 && (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            No skills added yet.
          </div>
        )}
      </div>
    </section>
  );
}
