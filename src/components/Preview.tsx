import { useRef, useEffect, useState } from 'react';
import { ResumeTemplate } from './Preview/ResumeTemplate';
import { ZoomIn, ZoomOut, RefreshCcw } from 'lucide-react';

export function Preview() {
  const componentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(1122); // Default A4 height in px at 96dpi

  // Auto-scale to fit container
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && componentRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const componentWidth = 794; // A4 width in pixels (210mm at 96dpi)
        
        // Add some padding (40px)
        const availableWidth = containerWidth - 40;
        
        if (availableWidth < componentWidth) {
          setScale(availableWidth / componentWidth);
        } else {
          setScale(1);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track content height for proper scrolling with transform: scale
  useEffect(() => {
    if (!componentRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContentHeight(entry.contentRect.height);
      }
    });
    
    observer.observe(componentRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col h-full w-full relative bg-gray-100">
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-white rounded-md shadow-sm border border-gray-200 p-1">
        <button 
          onClick={() => setScale(s => Math.max(0.25, s - 0.1))}
          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded"
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
        <span className="text-xs font-medium w-12 text-center text-gray-600">
          {Math.round(scale * 100)}%
        </span>
        <button 
          onClick={() => setScale(s => Math.min(2, s + 0.1))}
          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded"
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
        <div className="w-px h-4 bg-gray-200 mx-1"></div>
        <button 
          onClick={() => setScale(1)}
          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded"
          title="Reset Zoom"
        >
          <RefreshCcw size={16} />
        </button>
      </div>

      {/* Preview Container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto p-8"
      >
        <div className="flex justify-center min-h-full">
          <div 
            style={{ 
              width: 794 * scale, // 210mm in px * scale
              height: contentHeight * scale,
              position: 'relative',
            }}
          >
            <div 
              style={{ 
                transform: `scale(${scale})`, 
                transformOrigin: 'top left',
                transition: 'transform 0.2s ease-out',
                width: '210mm',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            >
              <ResumeTemplate ref={componentRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
