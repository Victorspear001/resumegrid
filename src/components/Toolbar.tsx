import { Download, LayoutTemplate, Maximize, Minimize, Settings, ChevronDown, FileText, Image as ImageIcon } from 'lucide-react';
import { useResumeStore } from '../store/useResumeStore';
import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ToolbarProps {
  isDistractionFree: boolean;
  setIsDistractionFree: (val: boolean) => void;
}

export function Toolbar({ isDistractionFree, setIsDistractionFree }: ToolbarProps) {
  const { data, updateTheme } = useResumeStore();
  const [showTemplates, setShowTemplates] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const templatesRef = useRef<HTMLDivElement>(null);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (templatesRef.current && !templatesRef.current.contains(event.target as Node)) {
        setShowTemplates(false);
      }
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
        setShowDownloadMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getResumeElement = () => {
    return document.getElementById('resume-preview-template');
  };

  const handleDownloadPDF = async () => {
    const element = getResumeElement();
    if (!element) return;
    
    setShowDownloadMenu(false);
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('resume-preview-template');
          if (clonedElement && clonedElement.parentElement) {
            clonedElement.parentElement.style.transform = 'none';
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${data.personalInfo.fullName || 'Resume'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleDownloadJPG = async () => {
    const element = getResumeElement();
    if (!element) return;
    
    setShowDownloadMenu(false);
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('resume-preview-template');
          if (clonedElement && clonedElement.parentElement) {
            clonedElement.parentElement.style.transform = 'none';
          }
        }
      });
      
      const link = document.createElement('a');
      link.download = `${data.personalInfo.fullName || 'Resume'}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 1.0);
      link.click();
    } catch (error) {
      console.error('Error generating JPG:', error);
      alert('Failed to generate JPG. Please try again.');
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
        <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
          RG
        </div>
        <h1 className="font-semibold text-gray-900">ResumeGrid</h1>
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
