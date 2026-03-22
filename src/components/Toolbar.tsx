import { Download, LayoutTemplate, Maximize, Minimize, Settings, ChevronDown, FileText, Image as ImageIcon, Cloud, UploadCloud, DownloadCloud, Upload } from 'lucide-react';
import { useResumeStore } from '../store/useResumeStore';
import { useState, useRef, useEffect } from 'react';
import { toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';

interface ToolbarProps {
  isDistractionFree: boolean;
  setIsDistractionFree: (val: boolean) => void;
}

export function Toolbar({ isDistractionFree, setIsDistractionFree }: ToolbarProps) {
  const { resumeId, data, updateTheme, loadData, setResumeId } = useResumeStore();
  const [showTemplates, setShowTemplates] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showCloudMenu, setShowCloudMenu] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [savedResumes, setSavedResumes] = useState<any[]>([]);
  
  const templatesRef = useRef<HTMLDivElement>(null);
  const downloadMenuRef = useRef<HTMLDivElement>(null);
  const cloudMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (templatesRef.current && !templatesRef.current.contains(event.target as Node)) {
        setShowTemplates(false);
      }
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
        setShowDownloadMenu(false);
      }
      if (cloudMenuRef.current && !cloudMenuRef.current.contains(event.target as Node)) {
        setShowCloudMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSavedResumes = async () => {
    try {
      const res = await fetch('/api/resumes');
      if (res.ok) {
        const list = await res.json();
        setSavedResumes(list);
      }
    } catch (err) {
      console.error("Failed to fetch resumes", err);
    }
  };

  const handleSaveToCloud = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: resumeId,
          title: data.personalInfo.fullName || 'Untitled Resume',
          data: data
        })
      });
      if (!res.ok) throw new Error('Failed to save');
      alert('Resume saved to cloud successfully!');
      fetchSavedResumes();
    } catch (error: any) {
      console.error('Save error:', error);
      alert(`Error saving to cloud: ${error.message}`);
    } finally {
      setIsSaving(false);
      setShowCloudMenu(false);
    }
  };

  const handleLoadFromCloud = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/resumes/${id}`);
      if (!res.ok) throw new Error('Failed to load');
      const result = await res.json();
      const parsedData = JSON.parse(result.data);
      loadData(parsedData);
      setResumeId(id);
      setShowCloudMenu(false);
    } catch (error: any) {
      console.error('Load error:', error);
      alert(`Error loading from cloud: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloudMenuToggle = () => {
    if (!showCloudMenu) {
      fetchSavedResumes();
    }
    setShowCloudMenu(!showCloudMenu);
  };

  const generateImage = async () => {
    const element = document.getElementById('resume-preview-template');
    if (!element) throw new Error('Resume element not found');

    // Save original styles
    const parent = element.parentElement;
    const originalParentTransform = parent ? parent.style.transform : '';
    
    const innerDiv = element.firstElementChild as HTMLElement;
    const originalInnerTransform = innerDiv ? innerDiv.style.transform : '';
    const originalInnerWidth = innerDiv ? innerDiv.style.width : '';
    
    const originalBackgroundImage = element.style.backgroundImage;
    const originalBackgroundSize = element.style.backgroundSize;
    const originalBoxShadow = element.style.boxShadow;

    // Apply unscaled styles to real DOM temporarily
    if (parent) parent.style.transform = 'scale(1)';
    if (innerDiv) {
      innerDiv.style.transform = 'scale(1)';
      innerDiv.style.width = '100%';
    }
    
    element.style.backgroundImage = 'none';
    element.style.backgroundSize = 'auto';
    element.style.boxShadow = 'none';

    // Wait for DOM to repaint
    await new Promise(resolve => setTimeout(resolve, 150));

    try {
      const dataUrl = await toJpeg(element, { 
        quality: 1.0, 
        backgroundColor: '#ffffff',
        pixelRatio: 2
      });
      
      return { 
        dataUrl, 
        width: element.offsetWidth, 
        height: element.offsetHeight 
      };
    } finally {
      // Restore original styles
      if (parent) parent.style.transform = originalParentTransform;
      if (innerDiv) {
        innerDiv.style.transform = originalInnerTransform;
        innerDiv.style.width = originalInnerWidth;
      }
      element.style.backgroundImage = originalBackgroundImage;
      element.style.backgroundSize = originalBackgroundSize;
      element.style.boxShadow = originalBoxShadow;
    }
  };

  const handleDownloadPDF = async () => {
    setShowDownloadMenu(false);
    
    try {
      const { dataUrl, width, height } = await generateImage();
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pdfHeight = (height * pdfWidth) / width;
      
      let position = 0;
      let heightLeft = pdfHeight;
      
      pdf.addImage(dataUrl, 'JPEG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft > 1) { // 1mm tolerance to prevent blank pages
        position = position - pageHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, 'JPEG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`${data.personalInfo.fullName || 'Resume'}.pdf`);
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      alert(`Failed to generate PDF: ${error.message || 'Unknown error'}`);
    }
  };

  const handleDownloadJPG = async () => {
    setShowDownloadMenu(false);
    
    try {
      const { dataUrl } = await generateImage();
      const link = document.createElement('a');
      link.download = `${data.personalInfo.fullName || 'Resume'}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (error: any) {
      console.error('Error generating JPG:', error);
      alert(`Failed to generate JPG: ${error.message || 'Unknown error'}`);
    }
  };

  const templates = [
    { 
      category: 'Professional/Technical (LaTeX)',
      items: [
        { id: 'awesome-cv', name: 'Awesome CV', description: 'Highly customizable, clean LaTeX style.' },
        { id: 'deedy', name: 'Deedy', description: 'Two-column, academic layout.' },
        { id: 'alta-cv', name: 'Alta CV', description: 'Infographics-focused professional layout.' },
        { id: 'plasmati', name: 'Plasmati', description: 'Academic and research oriented.' },
      ]
    },
    {
      category: 'Creative/Modern',
      items: [
        { id: 'creative', name: 'Creative', description: 'Bold and modern, ideal for design and tech.' },
        { id: 'calligraphic', name: 'Calligraphic', description: 'Elegant typography-focused design.' },
        { id: 'pastel', name: 'Pastel', description: 'Soft colors and modern layout.' },
        { id: 'monochrome', name: 'Monochrome', description: 'Sleek black and white professional look.' },
        { id: 'color-splash', name: 'Color Splash', description: 'Vibrant accents for a standout resume.' },
        { id: 'visionary', name: 'Visionary', description: 'Forward-thinking, unique structure.' },
      ]
    },
    {
      category: 'Minimalist & Clean',
      items: [
        { id: 'minimal', name: 'Minimal', description: 'Clean and simple, perfect for most industries.' },
        { id: 'modern-cv', name: 'Modern-cv', description: 'Contemporary clean design.' },
        { id: 'imprecv', name: 'Imprecv', description: 'Impressive minimalist structure.' },
        { id: 'chicv', name: 'Chicv', description: 'Chic and professional minimalist look.' },
        { id: 'minimalist-white-grey', name: 'Minimalist White & Grey', description: 'Subtle professional tones.' },
      ]
    },
    {
      category: 'Entry-Level/Recent Grads',
      items: [
        { id: 'spark', name: 'Spark', description: 'Energetic design for newcomers.' },
        { id: 'inspire', name: 'Inspire', description: 'Inspirational layout for career starters.' },
        { id: 'simple-design-freelancer', name: 'Freelancer', description: 'Simple design for independent workers.' },
      ]
    },
    {
      category: 'Classic',
      items: [
        { id: 'executive', name: 'Executive', description: 'Traditional and professional, great for corporate roles.' },
      ]
    }
  ] as const;

  return (
    <header className="h-14 bg-[#0a0a0a] border-b border-gray-800 flex items-center justify-between px-6 shrink-0 z-20 relative shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#8b0000] rounded-md flex items-center justify-center text-white text-sm font-bold shadow-[0_0_5px_rgba(139,0,0,0.3)]">
          RK
        </div>
        <h1 className="font-bold text-gray-200 tracking-tighter ml-1 text-lg neon-text-red">Resume Kill</h1>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={() => setIsDistractionFree(!isDistractionFree)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-neon-blue hover:bg-gray-900 rounded-md transition-all duration-300"
          title={isDistractionFree ? "Show Preview" : "Distraction Free Mode"}
        >
          {isDistractionFree ? <Minimize size={16} /> : <Maximize size={16} />}
          <span className="hidden sm:inline">{isDistractionFree ? "Split View" : "Focus Mode"}</span>
        </button>

        <div className="w-px h-6 bg-gray-800 mx-1"></div>

        <div className="relative" ref={templatesRef}>
          <button 
            onClick={() => setShowTemplates(!showTemplates)}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-300 ${showTemplates ? 'bg-gray-900 text-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.2)]' : 'text-gray-400 hover:text-neon-blue hover:bg-gray-900'}`}
          >
            <LayoutTemplate size={16} />
            <span className="hidden sm:inline">Templates</span>
            <ChevronDown size={14} className={`transition-transform duration-300 ${showTemplates ? 'rotate-180' : ''}`} />
          </button>

          {showTemplates && (
            <div className="absolute top-full right-0 mt-1 w-80 bg-[#0a0a0a] rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-gray-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-2 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {templates.map((category) => (
                  <div key={category.category} className="mb-4 last:mb-0">
                    <div className="px-3 py-1 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">
                      {category.category}
                    </div>
                    {category.items.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          updateTheme({ template: t.id as any });
                          setShowTemplates(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md transition-all duration-200 ${data.theme.template === t.id ? 'bg-gray-900 border-neon-blue/30 text-neon-blue' : 'hover:bg-gray-800 border-transparent text-gray-300'} border mb-1 last:mb-0`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-semibold text-sm">{t.name}</span>
                          {data.theme.template === t.id && (
                            <span className="w-1.5 h-1.5 rounded-full bg-neon-blue shadow-[0_0_5px_rgba(0,243,255,1)]"></span>
                          )}
                        </div>
                        <div className="text-[10px] text-gray-500 line-clamp-1">{t.description}</div>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <button 
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-neon-purple hover:bg-gray-900 rounded-md transition-all duration-300"
          onClick={() => {
            const themeSection = document.getElementById('theme-settings');
            if (themeSection) {
              themeSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <Settings size={16} />
          <span className="hidden sm:inline">Design</span>
        </button>

        <div className="relative" ref={cloudMenuRef}>
          <button 
            onClick={handleCloudMenuToggle}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-300 ${showCloudMenu ? 'bg-gray-900 text-neon-purple shadow-[0_0_10px_rgba(188,19,254,0.2)]' : 'text-gray-400 hover:text-neon-purple hover:bg-gray-900'}`}
          >
            <Cloud size={16} />
            <span className="hidden sm:inline">Cloud</span>
            <ChevronDown size={14} className={`transition-transform duration-300 ${showCloudMenu ? 'rotate-180' : ''}`} />
          </button>

          {showCloudMenu && (
            <div className="absolute top-full right-0 mt-1 w-64 bg-[#0a0a0a] rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-gray-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-2 max-h-60 overflow-y-auto custom-scrollbar">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-3 mb-2 mt-1">
                  Saved Resumes
                </div>
                {savedResumes.length === 0 ? (
                  <div className="text-xs text-gray-500 px-3 py-4 italic text-center">No saved resumes found.</div>
                ) : (
                  savedResumes.map((resume) => (
                    <button
                      key={resume.id}
                      onClick={() => handleLoadFromCloud(resume.id)}
                      disabled={isLoading}
                      className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-900 rounded-md transition-all duration-200 disabled:opacity-50 group"
                    >
                      <DownloadCloud size={14} className="text-gray-600 group-hover:text-neon-purple shrink-0 transition-colors" />
                      <div className="truncate">
                        <div className="font-semibold truncate group-hover:text-white transition-colors">{resume.title}</div>
                        <div className="text-[10px] text-gray-600">{new Date(resume.updated_at).toLocaleDateString()}</div>
                      </div>
                    </button>
                  ))
                )}
                <div className="border-t border-gray-800 mt-2 pt-2 px-2">
                  <button 
                    onClick={handleSaveToCloud}
                    disabled={isSaving}
                    className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-neon-purple hover:bg-neon-purple/10 rounded-md transition-all duration-300 disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Current to Cloud'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={downloadMenuRef}>
          <button 
            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-bold text-gray-100 bg-[#005577] hover:bg-[#004466] rounded-md transition-all duration-300 ml-2 shadow-[0_0_10px_rgba(0,85,119,0.3)]"
          >
            <Download size={16} />
            <span>Download</span>
            <ChevronDown size={14} className={`transition-transform duration-300 ${showDownloadMenu ? 'rotate-180' : ''}`} />
          </button>

          {showDownloadMenu && (
            <div className="absolute top-full right-0 mt-1 w-52 bg-[#0a0a0a] rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-gray-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-1">
                <button
                  onClick={handleDownloadPDF}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-900 rounded-md transition-all duration-200 group"
                >
                  <FileText size={16} className="text-neon-red group-hover:neon-text-red transition-all" />
                  <span className="font-medium">Download as PDF</span>
                </button>
                <button
                  onClick={handleDownloadJPG}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-900 rounded-md transition-all duration-200 group"
                >
                  <ImageIcon size={16} className="text-neon-blue group-hover:neon-text-blue transition-all" />
                  <span className="font-medium">Download as JPG</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
