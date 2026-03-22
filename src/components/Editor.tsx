import React from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { PersonalInfoForm } from './Editor/PersonalInfoForm';
import { ExperienceForm } from './Editor/ExperienceForm';
import { EducationForm } from './Editor/EducationForm';
import { SkillsForm } from './Editor/SkillsForm';
import { ProjectsForm } from './Editor/ProjectsForm';
import { ThemeSettings } from './Editor/ThemeSettings';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { SectionType } from '../types/resume';

const SortableSection: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: 'relative' as const,
  };

  return (
    <div ref={setNodeRef} style={style} className={`relative bg-[#0a0a0a] rounded-lg border border-gray-800 shadow-sm ${isDragging ? 'shadow-[0_0_20px_rgba(0,243,255,0.2)] ring-2 ring-blue-500 opacity-90' : ''}`}>
      <div 
        {...attributes} 
        {...listeners}
        className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-gray-900 rounded-l-lg border-r border-gray-800 text-gray-600 hover:text-neon-blue transition-colors"
      >
        <GripVertical size={20} />
      </div>
      <div className="pl-12 pr-6 py-6">
        {children}
      </div>
    </div>
  );
}

export function Editor() {
  const { data, reorderSections } = useResumeStore();

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
      const oldIndex = data.sectionOrder.indexOf(active.id as SectionType);
      const newIndex = data.sectionOrder.indexOf(over.id as SectionType);
      reorderSections(oldIndex, newIndex);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8 pb-32">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-white neon-text-blue">Resume Content</h2>
        <p className="text-gray-500">Fill in your details below. The preview will update automatically.</p>
      </div>

      <ThemeSettings />
      
      <div className="bg-[#0a0a0a] rounded-lg border border-gray-800 shadow-sm p-6">
        <PersonalInfoForm />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-300 px-1">Reorderable Sections</h3>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={data.sectionOrder} strategy={verticalListSortingStrategy}>
            <div className="space-y-6">
              {data.sectionOrder.map((section) => {
                // Personal info is always at top, not reorderable in the list
                if (section === 'personal') return null;
                
                let content = null;
                switch (section) {
                  case 'experience':
                    content = <ExperienceForm />;
                    break;
                  case 'education':
                    content = <EducationForm />;
                    break;
                  case 'skills':
                    content = <SkillsForm />;
                    break;
                  case 'projects':
                    content = <ProjectsForm />;
                    break;
                }

                if (!content) return null;

                return (
                  <SortableSection key={section} id={section}>
                    {content}
                  </SortableSection>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}


