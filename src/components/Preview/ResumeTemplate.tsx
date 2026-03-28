import React, { forwardRef, useEffect } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { cn } from '../../lib/utils';
import { SectionType } from '../../types/resume';

export const ResumeTemplate = forwardRef<HTMLDivElement>((props, ref) => {
  const { data } = useResumeStore();
  const { personalInfo, experience, education, skills, projects, sectionOrder, theme } = data;

  // Pagination logic removed as per user request to let height adjust automatically
  // and use a fixed margin/line-height.
  
  // Spacing classes based on theme
  const spacingClasses = {
    compact: 'space-y-1',
    normal: 'space-y-2',
    spacious: 'space-y-4',
  };

  const sectionSpacing = spacingClasses[theme.spacing];
  const itemSpacing = theme.spacing === 'compact' ? 'space-y-0.5' : theme.spacing === 'normal' ? 'space-y-1' : 'space-y-2';

  const renderSectionHeader = (title: string) => {
    const template = theme.template;
    
    if (template === 'executive') {
      return (
        <h2 
          className="text-lg font-bold uppercase tracking-wider mb-1 pb-1 border-b-2 break-inside-avoid"
          style={{ color: theme.headingColor, borderColor: theme.accentColor, fontFamily: theme.headingFontFamily }}
        >
          {title}
        </h2>
      );
    }
    
    if (template === 'creative' || template === 'visionary' || template === 'spark') {
      return (
        <div className="flex items-center gap-2 mb-1 break-inside-avoid">
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

    if (template === 'awesome-cv' || template === 'modern-cv') {
      return (
        <div className="flex items-center gap-4 mb-2 break-inside-avoid">
          <h2 
            className="text-lg font-bold uppercase tracking-tight whitespace-nowrap"
            style={{ color: theme.headingColor, fontFamily: theme.headingFontFamily }}
          >
            <span style={{ color: theme.accentColor }}>{title.slice(0, 3)}</span>{title.slice(3)}
          </h2>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>
      );
    }

    if (template === 'deedy' || template === 'plasmati') {
      return (
        <h2 
          className="text-base font-bold uppercase tracking-widest mb-1 break-inside-avoid"
          style={{ color: theme.accentColor, fontFamily: theme.headingFontFamily }}
        >
          {title}
        </h2>
      );
    }

    if (template === 'alta-cv') {
      return (
        <div className="mb-2 break-inside-avoid">
          <h2 
            className="text-sm font-black uppercase tracking-widest inline-block px-2 py-0.5 text-white"
            style={{ backgroundColor: theme.accentColor, fontFamily: theme.headingFontFamily }}
          >
            {title}
          </h2>
        </div>
      );
    }

    if (template === 'calligraphic') {
      return (
        <h2 
          className="text-2xl italic font-serif mb-2 border-b break-inside-avoid"
          style={{ color: theme.accentColor, borderColor: `${theme.accentColor}40`, fontFamily: '"Playfair Display", serif' }}
        >
          {title}
        </h2>
      );
    }

    if (template === 'pastel') {
      return (
        <h2 
          className="text-lg font-bold mb-2 px-3 py-1 rounded-r-full inline-block break-inside-avoid"
          style={{ backgroundColor: `${theme.accentColor}15`, color: theme.accentColor, fontFamily: theme.headingFontFamily }}
        >
          {title}
        </h2>
      );
    }

    // Minimal (default)
    return (
      <h2 
        className="text-lg font-bold uppercase tracking-wider border-b pb-1 mb-1 break-inside-avoid"
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
                <div key={exp.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold">{exp.position}</h3>
                    <span className="text-sm font-medium opacity-80 shrink-0 ml-4">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="font-medium italic text-sm opacity-90">{exp.company}</span>
                    <span className="text-xs opacity-70 shrink-0 ml-4">{exp.location}</span>
                  </div>
                  <div 
                    className="rich-text-content text-sm"
                    dangerouslySetInnerHTML={{ __html: exp.description }}
                  />
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
                <div key={edu.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold">{edu.institution}</h3>
                    <span className="text-sm font-medium opacity-80 shrink-0 ml-4">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="font-medium italic text-sm opacity-90">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</span>
                    <span className="text-xs opacity-70 shrink-0 ml-4">{edu.location}</span>
                  </div>
                  {edu.percentage && <div className="text-xs text-gray-600">Percentage: {edu.percentage}</div>}
                  {edu.description && (
                    <div 
                      className="rich-text-content text-xs mt-1"
                      dangerouslySetInnerHTML={{ __html: edu.description }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'skills':
        if (skills.length === 0) return null;
        if (theme.template === 'alta-cv') {
          return (
            <div key="skills" className={sectionSpacing}>
              {renderSectionHeader('Skills')}
              <div className="flex flex-wrap gap-2">
                {skills.flatMap(cat => cat.skills).map((skill, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 text-[10px] font-bold uppercase tracking-wider rounded border" style={{ borderColor: `${theme.accentColor}40`, color: theme.accentColor }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        }
        return (
          <div key="skills" className={sectionSpacing}>
            {renderSectionHeader('Skills')}
            <div className="grid grid-cols-1 gap-1 text-sm">
              {skills.map((category) => (
                <div key={category.id} className="flex items-start break-inside-avoid">
                  <span className="font-bold w-32 shrink-0">{category.name}:</span>
                  <span className="leading-tight">{category.skills.join(', ')}</span>
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
                <div key={proj.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{proj.name}</h3>
                      {proj.url && (
                        <a href={`https://${proj.url.replace(/^https?:\/\//, '')}`} className="text-xs text-blue-600 hover:underline">
                          {proj.url}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 italic">{proj.description}</div>
                  {proj.technologies.length > 0 && (
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Technologies:</span> {proj.technologies.join(', ')}
                    </div>
                  )}
                  <div 
                    className="rich-text-content text-sm mt-1"
                    dangerouslySetInnerHTML={{ __html: proj.highlights }}
                  />
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
    const template = theme.template;

    if (template === 'awesome-cv') {
      return (
        <header className="text-center mb-6 break-inside-avoid">
          <h1 className="text-4xl font-light tracking-tight mb-2" style={{ fontFamily: theme.headingFontFamily, color: theme.headingColor }}>
            <span className="font-bold">{personalInfo.fullName.split(' ')[0]}</span> {personalInfo.fullName.split(' ').slice(1).join(' ')}
          </h1>
          {personalInfo.jobTitle && (
            <div className="text-lg font-medium uppercase tracking-widest mb-3" style={{ color: theme.accentColor }}>
              {personalInfo.jobTitle}
            </div>
          )}
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-xs opacity-80">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.website && <span>{personalInfo.website}</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          </div>
        </header>
      );
    }

    if (template === 'deedy') {
      return (
        <header className="mb-6 break-inside-avoid">
          <h1 className="text-5xl font-bold uppercase tracking-tighter mb-1" style={{ fontFamily: theme.headingFontFamily, color: theme.headingColor }}>
            {personalInfo.fullName}
          </h1>
          <div className="flex justify-between items-baseline border-b-2 pb-1" style={{ borderColor: theme.accentColor }}>
            <div className="text-lg font-medium opacity-80">{personalInfo.jobTitle}</div>
            <div className="text-xs opacity-70 space-x-2">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>| {personalInfo.phone}</span>}
              {personalInfo.location && <span>| {personalInfo.location}</span>}
            </div>
          </div>
        </header>
      );
    }

    if (template === 'calligraphic') {
      return (
        <header className="text-center mb-8 break-inside-avoid">
          <h1 className="text-5xl italic font-serif mb-2" style={{ fontFamily: '"Playfair Display", serif', color: theme.accentColor }}>
            {personalInfo.fullName}
          </h1>
          <div className="h-px w-32 bg-gray-300 mx-auto mb-4"></div>
          <div className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-4">{personalInfo.jobTitle}</div>
          <div className="flex justify-center gap-6 text-xs italic text-gray-600 font-serif">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
        </header>
      );
    }

    if (template === 'pastel') {
      return (
        <header className="mb-8 flex items-center gap-8 break-inside-avoid">
          {personalInfo.profilePicture && (
            <img src={personalInfo.profilePicture} alt="Profile" className="w-32 h-32 rounded-2xl object-cover shadow-lg" />
          )}
          <div className="flex-1">
            <h1 className="text-4xl font-black mb-1" style={{ color: '#333', fontFamily: theme.headingFontFamily }}>
              {personalInfo.fullName}
            </h1>
            <div className="text-xl font-medium mb-4" style={{ color: theme.accentColor }}>{personalInfo.jobTitle}</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500">
              {personalInfo.email && <div className="flex items-center gap-2"><span>✉</span> {personalInfo.email}</div>}
              {personalInfo.phone && <div className="flex items-center gap-2"><span>📞</span> {personalInfo.phone}</div>}
              {personalInfo.location && <div className="flex items-center gap-2"><span>📍</span> {personalInfo.location}</div>}
              {personalInfo.website && <div className="flex items-center gap-2"><span>🌐</span> {personalInfo.website}</div>}
            </div>
          </div>
        </header>
      );
    }

    if (template === 'monochrome') {
      return (
        <header className="mb-8 border-l-8 pl-6 py-2 break-inside-avoid" style={{ borderColor: '#000' }}>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-1">{personalInfo.fullName}</h1>
          <div className="text-2xl font-light text-gray-500 mb-4">{personalInfo.jobTitle}</div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          </div>
        </header>
      );
    }

    if (template === 'visionary') {
      return (
        <header className="mb-10 relative break-inside-avoid">
          <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4" style={{ borderColor: theme.accentColor }}></div>
          <div className="pt-4 pl-4">
            <h1 className="text-6xl font-black tracking-tighter leading-none mb-2" style={{ fontFamily: theme.headingFontFamily }}>
              {personalInfo.fullName.split(' ').map((name, i) => (
                <span key={i} className={i % 2 === 0 ? 'font-bold' : ''} style={i % 2 !== 0 ? { color: theme.accentColor } : {}}>{name} </span>
              ))}
            </h1>
            <div className="text-xl font-bold tracking-[0.2em] uppercase text-gray-400 mb-6">{personalInfo.jobTitle}</div>
            <div className="flex flex-col gap-1 text-xs font-medium text-gray-600">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.location && <span>{personalInfo.location}</span>}
            </div>
          </div>
        </header>
      );
    }

    if (template === 'alta-cv') {
      return (
        <header className="mb-6 break-inside-avoid">
          <div className="flex justify-between items-center bg-gray-900 text-white p-6 -mx-8" style={{ backgroundColor: theme.accentColor }}>
            <div className="flex-1">
              <h1 className="text-4xl font-black uppercase tracking-widest leading-none mb-1">{personalInfo.fullName}</h1>
              <div className="text-lg font-medium opacity-80 uppercase tracking-widest">{personalInfo.jobTitle}</div>
            </div>
            <div className="text-right text-[10px] space-y-1 opacity-90">
              {personalInfo.email && <div className="flex items-center justify-end gap-2">{personalInfo.email} ✉</div>}
              {personalInfo.phone && <div className="flex items-center justify-end gap-2">{personalInfo.phone} 📞</div>}
              {personalInfo.location && <div className="flex items-center justify-end gap-2">{personalInfo.location} 📍</div>}
            </div>
          </div>
        </header>
      );
    }

    if (template === 'spark' || template === 'inspire') {
      return (
        <header className="mb-8 text-center break-inside-avoid">
          <div className="inline-block px-8 py-4 border-4 border-double mb-4" style={{ borderColor: theme.accentColor }}>
            <h1 className="text-4xl font-black uppercase tracking-tighter" style={{ fontFamily: theme.headingFontFamily }}>{personalInfo.fullName}</h1>
          </div>
          <div className="text-xl font-bold tracking-widest text-gray-400 uppercase mb-4">{personalInfo.jobTitle}</div>
          <div className="flex justify-center gap-4 text-xs font-bold text-gray-500">
            {personalInfo.email && <span className="px-2 py-0.5 bg-gray-100 rounded">{personalInfo.email}</span>}
            {personalInfo.phone && <span className="px-2 py-0.5 bg-gray-100 rounded">{personalInfo.phone}</span>}
            {personalInfo.location && <span className="px-2 py-0.5 bg-gray-100 rounded">{personalInfo.location}</span>}
          </div>
        </header>
      );
    }

    if (template === 'modern-cv') {
      return (
        <header className="mb-8 flex justify-between items-end border-b-2 pb-4 break-inside-avoid" style={{ borderColor: theme.accentColor }}>
          <div>
            <h1 className="text-5xl font-light tracking-tight" style={{ fontFamily: theme.headingFontFamily }}>
              <span className="font-bold" style={{ color: theme.accentColor }}>{personalInfo.fullName.split(' ')[0]}</span> {personalInfo.fullName.split(' ').slice(1).join(' ')}
            </h1>
            <div className="text-xl text-gray-500 mt-1">{personalInfo.jobTitle}</div>
          </div>
          <div className="text-right text-xs text-gray-400 space-y-1">
            {personalInfo.email && <div>{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
          </div>
        </header>
      );
    }

    if (template === 'imprecv' || template === 'chicv' || template === 'minimalist-white-grey') {
      return (
        <header className="mb-10 break-inside-avoid">
          <h1 className="text-4xl font-bold tracking-tight mb-2" style={{ fontFamily: theme.headingFontFamily }}>{personalInfo.fullName}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="font-medium" style={{ color: theme.accentColor }}>{personalInfo.jobTitle}</span>
            <span className="text-gray-300">|</span>
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
        </header>
      );
    }

    if (template === 'executive') {
      return (
        <header className="mb-4 border-b-4 pb-2 break-inside-avoid" style={{ borderColor: theme.accentColor }}>
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              {personalInfo.profilePicture && (
                <img 
                  src={personalInfo.profilePicture} 
                  alt="Profile" 
                  className="w-auto h-20 rounded-md object-contain shrink-0 border border-gray-200 shadow-sm" 
                />
              )}
              <div className="flex-1 min-w-0 pt-1">
                <h1 
                  className="text-3xl font-bold mb-0.5 tracking-tight uppercase break-words leading-tight"
                  style={{ fontFamily: theme.headingFontFamily, color: theme.headingColor }}
                >
                  {personalInfo.fullName}
                </h1>
                {personalInfo.jobTitle && (
                  <div className="text-lg font-medium break-words" style={{ color: theme.accentColor }}>
                    {personalInfo.jobTitle}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right text-xs opacity-80 space-y-0 shrink-0 max-w-[40%] break-words pt-1">
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
        <header className="mb-6 flex justify-between items-start gap-4 break-inside-avoid">
          <div className="flex flex-1 min-w-0">
            <div className="w-3 shrink-0 mr-4" style={{ backgroundColor: theme.accentColor }}></div>
            <div className="py-1 flex-1 min-w-0">
              <h1 
                className="text-4xl font-black mb-1 tracking-tighter break-words leading-tight"
                style={{ fontFamily: theme.headingFontFamily, color: theme.headingColor }}
              >
                {personalInfo.fullName}
              </h1>
              {personalInfo.jobTitle && (
                <div className="text-xl font-light mb-2 opacity-80 break-words">
                  {personalInfo.jobTitle}
                </div>
              )}
              
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium" style={{ color: theme.accentColor }}>
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
          <div className="flex flex-col items-end gap-2">
            {personalInfo.profilePicture && (
              <img 
                src={personalInfo.profilePicture} 
                alt="Profile" 
                className="w-auto h-24 rounded-md object-contain shrink-0 shadow-md border border-gray-100" 
              />
            )}
          </div>
        </header>
      );
    }

    // Minimal (default)
    return (
      <header className="text-center mb-4 flex flex-col items-center break-inside-avoid">
        {personalInfo.profilePicture && (
          <img src={personalInfo.profilePicture} alt="Profile" className="w-auto h-24 rounded-md object-contain mb-2 shadow-sm" />
        )}
        <h1 
          className="text-3xl font-bold mb-0.5 tracking-tight"
          style={{ fontFamily: theme.headingFontFamily, color: theme.headingColor }}
        >
          {personalInfo.fullName}
        </h1>
        {personalInfo.jobTitle && (
          <div className="text-lg font-medium mb-1" style={{ color: theme.accentColor }}>
            {personalInfo.jobTitle}
          </div>
        )}
        
        <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-0.5 text-xs opacity-80">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.email && personalInfo.phone && <span>•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {(personalInfo.email || personalInfo.phone) && personalInfo.location && <span>•</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-0.5 text-xs opacity-80 mt-0.5">
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

  const isTwoColumn = ['deedy', 'alta-cv', 'plasmati'].includes(theme.template);

  return (
    <div className="relative group pb-12">
      <div 
        id="resume-preview-template"
        ref={ref}
        className={cn(
          "bg-white shadow-2xl mx-auto print:shadow-none print:mx-0 relative transition-all duration-300 print:bg-none"
        )}
        style={{ 
          width: '210mm', // A4 width
          minHeight: '297mm', // A4 height
          height: 'auto',
          fontFamily: theme.fontFamily,
        }}
      >
        <div 
          className="w-full min-h-full break-words"
          style={{ 
            padding: '15mm',
            lineHeight: 1.5,
            color: theme.textColor,
            boxSizing: 'border-box',
          }}
        >
          {renderHeader()}

          {/* Summary */}
          {personalInfo.summary && (
            <div 
              className="rich-text-content mb-4 text-sm leading-snug break-inside-avoid"
              dangerouslySetInnerHTML={{ __html: personalInfo.summary }}
            />
          )}

          {/* Dynamic Sections */}
          {isTwoColumn ? (
            <div className="grid grid-cols-[1fr_2fr] gap-8">
              <div className={cn("flex flex-col", sectionSpacing)}>
                {sectionOrder.filter(s => ['skills', 'education'].includes(s)).map(renderSection)}
              </div>
              <div className={cn("flex flex-col", sectionSpacing)}>
                {sectionOrder.filter(s => !['skills', 'education'].includes(s)).map(renderSection)}
              </div>
            </div>
          ) : (
            <div className={cn("flex flex-col", sectionSpacing)}>
              {sectionOrder.map(renderSection)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ResumeTemplate.displayName = 'ResumeTemplate';
