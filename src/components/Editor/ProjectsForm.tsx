import { Plus, Trash2, GripVertical } from 'lucide-react';
import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableProjectItem: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
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

  const handleHighlightChange = (projId: string, index: number, value: string) => {
    const proj = projects.find(p => p.id === projId);
    if (!proj) return;
    
    const newHighlights = [...proj.highlights];
    newHighlights[index] = value;
    updateProject(projId, { highlights: newHighlights });
  };

  const addHighlight = (projId: string) => {
    const proj = projects.find(p => p.id === projId);
    if (!proj) return;
    
    updateProject(projId, { highlights: [...proj.highlights, ''] });
  };

  const removeHighlight = (projId: string, index: number) => {
    const proj = projects.find(p => p.id === projId);
    if (!proj) return;
    
    const newHighlights = proj.highlights.filter((_, i) => i !== index);
    updateProject(projId, { highlights: newHighlights });
  };

  const handleTechChange = (projId: string, value: string) => {
    const techArray = value.split(',').map(s => s.trim()).filter(Boolean);
    updateProject(projId, { technologies: techArray });
  };

  return (
    <section className="space-y-6">
      <div className="border-b border-gray-200 pb-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Projects</h3>
        <button 
          onClick={addProject}
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
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
                  className="absolute right-4 top-4 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove Project"
                >
                  <Trash2 size={18} />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-6">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Project Name</label>
                    <input
                      type="text"
                      value={proj.name}
                      onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>
                  
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Short Description</label>
                    <input
                      type="text"
                      value={proj.description}
                      onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">URL / Link</label>
                    <input
                      type="text"
                      placeholder="e.g. github.com/user/project"
                      value={proj.url}
                      onChange={(e) => updateProject(proj.id, { url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Technologies (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. React, Node.js, MongoDB"
                      value={proj.technologies.join(', ')}
                      onChange={(e) => handleTechChange(proj.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>
                  
                  <div className="sm:col-span-2 space-y-3 mt-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-700">Highlights (Bullet Points)</label>
                    </div>
                    {proj.highlights.map((bullet, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0"></div>
                        <textarea
                          value={bullet}
                          onChange={(e) => handleHighlightChange(proj.id, i, e.target.value)}
                          rows={2}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white resize-y"
                          placeholder="Describe key features or achievements..."
                        />
                        <button 
                          onClick={() => removeHighlight(proj.id, i)}
                          className="p-2 text-gray-400 hover:text-red-500 mt-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => addHighlight(proj.id)}
                      className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 mt-2"
                    >
                      <Plus size={14} /> Add Highlight
                    </button>
                  </div>
                </div>
              </SortableProjectItem>
            ))}
          </SortableContext>
        </DndContext>
        
        {projects.length === 0 && (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            No projects added yet.
          </div>
        )}
      </div>
    </section>
  );
}
