import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { cn } from '../../lib/utils';
import { SectionType } from '../../types/resume';
import { AlertTriangle } from 'lucide-react';

export const ResumeTemplate = forwardRef<HTMLDivElement>((props, ref) => {
  const { data } = useResumeStore();
  const { personalInfo, experience, education, skills, projects, sectionOrder, theme } = data;
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [scaleFactor, setScaleFactor] = useState(1);

  // Check for overflow and auto-scale
  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        // Reset scale first to measure natural height
        contentRef.current.style.transform = 'scale(1)';
        
        const contentHeight = contentRef.current.scrollHeight;
        const targetHeight = 1120; // ~A4 height in pixels at 96dpi minus some safe margin
        
        if (contentHeight > targetHeight) {
          // Calculate required scale, minimum 0.8
          const requiredScale = Math.max(0.8, targetHeight / contentHeight);
          setScaleFactor(requiredScale);
          
          // If even at min scale it overflows, show warning
          if (requiredScale <= 0.8 && contentHeight * 0.8 > targetHeight) {
            setIsOverflowing(true);
          } else {
            setIsOverflowing(false);
          }
        } else {
          setScaleFactor(1);
          setIsOverflowing(false);
        }
      }
    };

    checkOverflow();
    const timeout = setTimeout(checkOverflow, 100);
    
    window.addEventListener('resize', checkOverflow);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [data]);

  // Spacing classes based on theme
  const spacingClasses = {
    compact: 'space-y-2',
    normal: 'space-y-4',
    spacious: 'space-y-6',
  };

  const sectionSpacing = spacingClasses[theme.spacing];
  const itemSpacing = theme.spacing === 'compact' ? 'space-y-1' : theme.spacing === 'normal' ? 'space-y-2' : 'space-y-3';

  const renderSectionHeader = (title: string) => {
    if (theme.template === 'executive') {
      return (
        <h2 
          className="text-lg font-bold uppercase tracking-wider mb-2 pb-1 border-b-2"
          style={{ color: '#1f2937', borderColor: theme.accentColor, fontFamily: theme.headingFontFamily }}
        >
          {title}
        </h2>
      );
    }
    
    if (theme.template === 'creative') {
      return (
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.accentColor }}></div>
          <h2 
            className="text-xl font-bold tracking-wide"
            style={{ color: theme.accentColor, fontFamily: theme.headingFontFamily }}
          >
            {title}
          </h2>
        </div>
      );
    }

    // Minimal (default)
    return (
      <h2 
        className="text-lg font-bold uppercase tracking-wider border-b pb-1 mb-2"
        style={{ color: theme.accentColor, borderColor: `${theme.accentColor}40`, fontFamily: theme.headingFontFamily }}
      >
        {title}
      </h2>
    );
  };

  const renderSection = (section: SectionType) => {
    switch (section) {
      case 'experience':
        if (experience.length === 0) return null;
        return (
          <div key="experience" className={sectionSpacing}>
            {renderSectionHeader('Experience')}
            <div className={cn("flex flex-col", itemSpacing)}>
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900">{exp.position}</h3>
                    <span className="text-sm font-medium text-gray-600 shrink-0 ml-4">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-medium text-gray-700 italic">{exp.company}</span>
                    <span className="text-sm text-gray-500 shrink-0 ml-4">{exp.location}</span>
                  </div>
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-sm text-gray-800">
                    {exp.description.map((bullet, i) => (
                      bullet.trim() && <li key={i} className="pl-1 leading-snug">{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
        if (education.length === 0) return null;
        return (
          <div key="education" className={sectionSpacing}>
            {renderSectionHeader('Education')}
            <div className={cn("flex flex-col", itemSpacing)}>
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900">{edu.institution}</h3>
                    <span className="text-sm font-medium text-gray-600 shrink-0 ml-4">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="font-medium text-gray-700 italic">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</span>
                    <span className="text-sm text-gray-500 shrink-0 ml-4">{edu.location}</span>
                  </div>
                  {edu.percentage && <div className="text-sm text-gray-600 mt-0.5">Percentage: {edu.percentage}</div>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'skills':
        if (skills.length === 0) return null;
        return (
          <div key="skills" className={sectionSpacing}>
            {renderSectionHeader('Skills')}
            <div className="grid grid-cols-1 gap-1.5 text-sm">
              {skills.map((category) => (
                <div key={category.id} className="flex items-start">
                  <span className="font-bold text-gray-900 w-32 shrink-0">{category.name}:</span>
                  <span className="text-gray-800 leading-snug">{category.skills.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'projects':
        if (projects.length === 0) return null;
        return (
          <div key="projects" className={sectionSpacing}>
            {renderSectionHeader('Projects')}
            <div className={cn("flex flex-col", itemSpacing)}>
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">{proj.name}</h3>
                      {proj.url && (
                        <a href={`https://${proj.url.replace(/^https?:\/\//, '')}`} className="text-sm text-blue-600 hover:underline">
                          {proj.url}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 italic mb-1">{proj.description}</div>
                  {proj.technologies.length > 0 && (
                    <div className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Technologies:</span> {proj.technologies.join(', ')}
                    </div>
                  )}
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-sm text-gray-800">
                    {proj.highlights.map((bullet, i) => (
                      bullet.trim() && <li key={i} className="pl-1 leading-snug">{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderHeader = () => {
    if (theme.template === 'executive') {
      return (
        <header className="mb-6 border-b-4 pb-4" style={{ borderColor: theme.accentColor }}>
          <div className="flex justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              {personalInfo.profilePicture && (
                <img 
                  src={personalInfo.profilePicture} 
                  alt="Profile" 
                  className="w-auto h-24 rounded-md object-contain shrink-0 border border-gray-200 shadow-sm" 
                />
              )}
              <div>
                <h1 
                  className="text-4xl font-bold text-gray-900 mb-1 tracking-tight uppercase"
                  style={{ fontFamily: theme.headingFontFamily }}
                >
                  {personalInfo.fullName}
                </h1>
                {personalInfo.jobTitle && (
                  <div className="text-xl font-medium" style={{ color: theme.accentColor }}>
                    {personalInfo.jobTitle}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right text-sm text-gray-600 space-y-0.5 shrink-0">
              {personalInfo.email && <div>{personalInfo.email}</div>}
              {personalInfo.phone && <div>{personalInfo.phone}</div>}
              {personalInfo.location && <div>{personalInfo.location}</div>}
              {personalInfo.website && (
                <div>
                  <a href={`https://${personalInfo.website.replace(/^https?:\/\//, '')}`} className="hover:underline">
                    {personalInfo.website}
                  </a>
                </div>
              )}
              {personalInfo.linkedin && (
                <div>
                  <a href={`https://${personalInfo.linkedin.replace(/^https?:\/\//, '')}`} className="hover:underline">
                    {personalInfo.linkedin}
                  </a>
                </div>
              )}
            </div>
          </div>
        </header>
      );
    }

    if (theme.template === 'creative') {
      return (
        <header className="mb-8 flex justify-between items-start gap-6">
          <div className="flex">
            <div className="w-4 shrink-0 mr-6" style={{ backgroundColor: theme.accentColor }}></div>
            <div className="py-2">
              <h1 
                className="text-5xl font-black text-gray-900 mb-2 tracking-tighter"
                style={{ fontFamily: theme.headingFontFamily }}
              >
                {personalInfo.fullName}
              </h1>
              {personalInfo.jobTitle && (
                <div className="text-2xl font-light mb-4 text-gray-600">
                  {personalInfo.jobTitle}
                </div>
              )}
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium" style={{ color: theme.accentColor }}>
                {personalInfo.email && <span>{personalInfo.email}</span>}
                {personalInfo.phone && <span>{personalInfo.phone}</span>}
                {personalInfo.location && <span>{personalInfo.location}</span>}
                {personalInfo.website && (
                  <a href={`https://${personalInfo.website.replace(/^https?:\/\//, '')}`} className="hover:underline">
                    {personalInfo.website}
                  </a>
                )}
                {personalInfo.linkedin && (
                  <a href={`https://${personalInfo.linkedin.replace(/^https?:\/\//, '')}`} className="hover:underline">
                    {personalInfo.linkedin}
                  </a>
                )}
              </div>
            </div>
          </div>
          {personalInfo.profilePicture && (
            <img 
              src={personalInfo.profilePicture} 
              alt="Profile" 
              className="w-auto h-32 rounded-md object-contain shrink-0 shadow-md border border-gray-100" 
            />
          )}
        </header>
      );
    }

    // Minimal (default)
    return (
      <header className="text-center mb-6 flex flex-col items-center">
        {personalInfo.profilePicture && (
          <img src={personalInfo.profilePicture} alt="Profile" className="w-auto h-28 rounded-md object-contain mb-4 shadow-sm" />
        )}
        <h1 
          className="text-4xl font-bold text-gray-900 mb-1 tracking-tight"
          style={{ fontFamily: theme.headingFontFamily }}
        >
          {personalInfo.fullName}
        </h1>
        {personalInfo.jobTitle && (
          <div className="text-xl font-medium mb-3" style={{ color: theme.accentColor }}>
            {personalInfo.jobTitle}
          </div>
        )}
        
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-sm text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.email && personalInfo.phone && <span>•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {(personalInfo.email || personalInfo.phone) && personalInfo.location && <span>•</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-sm text-gray-600 mt-1">
          {personalInfo.website && (
            <a href={`https://${personalInfo.website.replace(/^https?:\/\//, '')}`} className="hover:underline">
              {personalInfo.website}
            </a>
          )}
          {personalInfo.website && personalInfo.linkedin && <span>•</span>}
          {personalInfo.linkedin && (
            <a href={`https://${personalInfo.linkedin.replace(/^https?:\/\//, '')}`} className="hover:underline">
              {personalInfo.linkedin}
            </a>
          )}
        </div>
      </header>
    );
  };

  return (
    <div className="relative group">
      {isOverflowing && (
        <div className="absolute -top-12 left-0 right-0 bg-amber-100 text-amber-800 px-4 py-2 rounded-md shadow-sm border border-amber-200 flex items-center gap-2 text-sm font-medium z-10 print:hidden animate-in fade-in slide-in-from-top-2">
          <AlertTriangle size={16} className="text-amber-600" />
          Content exceeds one page. Consider using a more compact spacing or removing some items.
        </div>
      )}
      <div 
        ref={ref}
        className={cn(
          "bg-white shadow-2xl mx-auto print:shadow-none print:mx-0 overflow-hidden relative transition-all duration-300",
          isOverflowing ? "ring-2 ring-amber-400 ring-offset-2" : ""
        )}
        style={{ 
          width: '210mm', // A4 width
          height: '297mm', // A4 height (fixed to force overflow detection)
          fontFamily: theme.fontFamily,
        }}
      >
        <div 
          ref={contentRef}
          className="w-full origin-top-left transition-transform duration-200"
          style={{ 
            padding: '20mm',
            transform: `scale(${scaleFactor})`,
            width: `${100 / scaleFactor}%`,
          }}
        >
          {renderHeader()}

          {/* Summary */}
          {personalInfo.summary && (
            <div className="mb-6 text-sm text-gray-800 leading-relaxed text-justify">
              {personalInfo.summary}
            </div>
          )}

          {/* Dynamic Sections */}
          <div className={cn("flex flex-col", sectionSpacing)}>
            {sectionOrder.map(renderSection)}
          </div>
        </div>
      </div>
    </div>
  );
});

ResumeTemplate.displayName = 'ResumeTemplate';
