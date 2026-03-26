import { useEffect, useState, useRef } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { Cloud, CloudCheck, CloudOff, Loader2 } from 'lucide-react';

export function AutoSaver() {
  const { data, resumeId } = useResumeStore();
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  const saveToCloud = async () => {
    setStatus('saving');
    try {
      const url = localStorage.getItem('TURSO_DATABASE_URL') || '';
      const token = localStorage.getItem('TURSO_AUTH_TOKEN') || '';
      
      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-turso-url': url,
          'x-turso-token': token
        },
        body: JSON.stringify({
          id: resumeId,
          title: data.personalInfo.fullName || 'Untitled Resume',
          data: data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (errorData?.error?.includes('401') || errorData?.error?.includes('SERVER_ERROR')) {
          throw new Error('Database Auth Token Expired');
        }
        throw new Error('Failed to save');
      }
      
      setStatus('saved');
      setLastSaved(new Date());
      setErrorMessage(null);
      
      // Reset to idle after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error: any) {
      console.error('Auto-save error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Save failed');
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setStatus('idle');
    timeoutRef.current = setTimeout(() => {
      saveToCloud();
    }, 2000); // Debounce for 2 seconds

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, resumeId]);

  if (status === 'idle' && !lastSaved) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-lg border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {status === 'saving' && (
        <>
          <Loader2 size={14} className="text-blue-500 animate-spin" />
          <span className="text-xs font-medium text-gray-600">Saving...</span>
        </>
      )}
      {status === 'saved' && (
        <>
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs font-medium text-gray-600">Saved to cloud</span>
        </>
      )}
      {status === 'idle' && lastSaved && (
        <>
          <Cloud size={14} className="text-gray-400" />
          <span className="text-xs font-medium text-gray-400">
            Last saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </>
      )}
      {status === 'error' && (
        <>
          <CloudOff size={14} className="text-red-500" />
          <span className="text-xs font-medium text-red-500" title={errorMessage || 'Save failed'}>
            {errorMessage === 'Database Auth Token Expired' ? 'Auth Token Expired' : 'Save failed'}
          </span>
        </>
      )}
    </div>
  );
}
