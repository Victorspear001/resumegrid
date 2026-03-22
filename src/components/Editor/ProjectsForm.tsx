import { Plus, Trash2, GripVertical } from 'lucide-react';
import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { RichTextEditor } from './RichTextEditor';

const SortableProjectItem: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
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

export function ProjectsForm() {
  const { data, addProject, updateProject, removeProject, reorderProjects } = useResumeStore();
  const { projects } = data;

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
      const oldIndex = projects.findIndex(p => p.id === active.id);
      const newIndex = projects.findIndex(p => p.id === over.id);
      reorderProjects(oldIndex, newIndex);
    }
  };

  const handleTechChange = (projId: string, value: string) => {
    const techArray = value.split(',').map(s => s.trim()).filter(Boolean);
    updateProject(projId, { technologies: techArray });
  };

  return (
    <section className="space-y-6">
      <div className="border-b border-gray-800 pb-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-200">Projects</h3>
        <button 
          onClick={addProject}
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>
      
      <div className="space-y-8">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
            {projects.map((proj, index) => (
              <SortableProjectItem key={proj.id} id={proj.id}>
                <button 
                  onClick={() => removeProject(proj.id)}
                  className="absolute right-4 top-4 text-gray-600 hover:text-red-500 transition-colors"
                  title="Remove Project"
                >
                  <Trash2 size={18} />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-6">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-sm font-medium text-gray-400">Project Name</label>
                    <input
                      type="text"
                      value={proj.name}
                      onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900 bg-[#050505] text-gray-300"
                    />
                  </div>
                  
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-sm font-medium text-gray-400">Short Description</label>
                    <input
                      type="text"
                      value={proj.description}
                      onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900 bg-[#050505] text-gray-300"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-400">URL / Link</label>
                    <input
                      type="text"
                      placeholder="e.g. github.com/user/project"
                      value={proj.url}
                      onChange={(e) => updateProject(proj.id, { url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900 bg-[#050505] text-gray-300"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-400">Technologies (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. React, Node.js, MongoDB"
                      value={proj.technologies.join(', ')}
                      onChange={(e) => handleTechChange(proj.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900 bg-[#050505] text-gray-300"
                    />
                  </div>
                  
                  <div className="sm:col-span-2 space-y-3 mt-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-400">Key Features & Achievements</label>
                    </div>
                    <RichTextEditor
                      value={proj.highlights}
                      onChange={(content) => updateProject(proj.id, { highlights: content })}
                      placeholder="Describe key features or achievements..."
                    />
                  </div>
                </div>
              </SortableProjectItem>
            ))}
          </SortableContext>
        </DndContext>
        
        {projects.length === 0 && (
          <div className="text-center py-8 text-gray-600 border-2 border-dashed border-gray-800 rounded-lg">
            No projects added yet.
          </div>
        )}
      </div>
    </section>
  );
}
