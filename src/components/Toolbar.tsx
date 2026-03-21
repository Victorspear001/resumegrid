import { Download, LayoutTemplate, Maximize, Minimize, Settings, ChevronDown, FileText, Image as ImageIcon, Cloud, UploadCloud, DownloadCloud } from 'lucide-react';
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

  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    // Check if logo exists
    fetch('/logo.png', { method: 'HEAD' })
      .then(res => {
        if (res.ok) setLogoUrl(`/logo.png?t=${Date.now()}`);
      })
      .catch(() => {});
  }, []);

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
    { id: 'minimal', name: 'Minimal', description: 'Clean and simple, perfect for most industries.' },
    { id: 'executive', name: 'Executive', description: 'Traditional and professional, great for corporate roles.' },
    { id: 'creative', name: 'Creative', description: 'Bold and modern, ideal for design and tech.' },
  ] as const;

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-20 relative">
      <div className="flex items-center gap-2">
        {logoUrl ? (
          <img src={logoUrl} alt="Resume Kill Logo" className="w-8 h-8 rounded-md object-cover shadow-sm" />
        ) : (
          <div className="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center text-white text-lg shadow-sm">
            🔪🖊️
          </div>
        )}
        <h1 className="font-semibold text-gray-900 tracking-tight">Resume Kill</h1>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={() => setIsDistractionFree(!isDistractionFree)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          title={isDistractionFree ? "Show Preview" : "Distraction Free Mode"}
        >
          {isDistractionFree ? <Minimize size={16} /> : <Maximize size={16} />}
          <span className="hidden sm:inline">{isDistractionFree ? "Split View" : "Focus Mode"}</span>
        </button>

        <div className="w-px h-6 bg-gray-200 mx-1"></div>

        <div className="relative" ref={templatesRef}>
          <button 
            onClick={() => setShowTemplates(!showTemplates)}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${showTemplates ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <LayoutTemplate size={16} />
            <span className="hidden sm:inline">Templates</span>
            <ChevronDown size={14} className={`transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
          </button>

          {showTemplates && (
            <div className="absolute top-full right-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
              <div className="p-2">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      updateTheme({ template: t.id });
                      setShowTemplates(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${data.theme.template === t.id ? 'bg-blue-50 border-blue-100' : 'hover:bg-gray-50 border-transparent'} border`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`font-medium ${data.theme.template === t.id ? 'text-blue-700' : 'text-gray-900'}`}>{t.name}</span>
                      {data.theme.template === t.id && (
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{t.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <button 
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          onClick={() => {
            // Scroll to design settings if possible, or maybe we don't need this button if design settings are always visible
            // For now, let's keep it as a UI hint or we can remove it since ThemeSettings is in the Editor
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
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${showCloudMenu ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Cloud size={16} />
            <span className="hidden sm:inline">Cloud</span>
            <ChevronDown size={14} className={`transition-transform ${showCloudMenu ? 'rotate-180' : ''}`} />
          </button>

          {showCloudMenu && (
            <div className="absolute top-full right-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
              <div className="p-2 border-b border-gray-100">
                <button
                  onClick={handleSaveToCloud}
                  disabled={isSaving}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors font-medium disabled:opacity-50"
                >
                  <UploadCloud size={16} />
                  <span>{isSaving ? 'Saving...' : 'Save to Cloud'}</span>
                </button>
              </div>
              <div className="p-2 max-h-60 overflow-y-auto">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2 mt-1">
                  Saved Resumes
                </div>
                {savedResumes.length === 0 ? (
                  <div className="text-sm text-gray-500 px-3 py-2 italic">No saved resumes found.</div>
                ) : (
                  savedResumes.map((resume) => (
                    <button
                      key={resume.id}
                      onClick={() => handleLoadFromCloud(resume.id)}
                      disabled={isLoading}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
                    >
                      <DownloadCloud size={14} className="text-gray-400 shrink-0" />
                      <div className="truncate">
                        <div className="font-medium truncate">{resume.title}</div>
                        <div className="text-xs text-gray-400">{new Date(resume.updated_at).toLocaleDateString()}</div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={downloadMenuRef}>
          <button 
            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors ml-2"
          >
            <Download size={16} />
            <span>Download</span>
            <ChevronDown size={14} className={`transition-transform ${showDownloadMenu ? 'rotate-180' : ''}`} />
          </button>

          {showDownloadMenu && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
              <div className="p-1">
                <button
                  onClick={handleDownloadPDF}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <FileText size={16} className="text-red-500" />
                  <span>Download as PDF</span>
                </button>
                <button
                  onClick={handleDownloadJPG}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <ImageIcon size={16} className="text-blue-500" />
                  <span>Download as JPG</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
