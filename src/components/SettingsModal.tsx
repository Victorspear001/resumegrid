import { useState, useEffect } from 'react';
import { X, Database, Key, Save } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [url, setUrl] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    if (isOpen) {
      setUrl(localStorage.getItem('TURSO_DATABASE_URL') || '');
      setToken(localStorage.getItem('TURSO_AUTH_TOKEN') || '');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (url) localStorage.setItem('TURSO_DATABASE_URL', url);
    else localStorage.removeItem('TURSO_DATABASE_URL');
    
    if (token) localStorage.setItem('TURSO_AUTH_TOKEN', token);
    else localStorage.removeItem('TURSO_AUTH_TOKEN');
    
    onClose();
    // Reload page to re-initialize DB connection if needed
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#111] border border-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#1a1a1a]">
          <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
            <Database size={18} className="text-neon-blue" />
            Database Settings
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-gray-800"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          <p className="text-sm text-gray-400">
            Enter your Turso database credentials to enable cloud saving. These are stored locally in your browser.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Database URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Database size={14} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="libsql://your-db-name.turso.io"
                  className="w-full bg-[#0a0a0a] border border-gray-700 rounded-md py-2 pl-9 pr-3 text-sm text-gray-200 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Auth Token
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key size={14} className="text-gray-500" />
                </div>
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="ey..."
                  className="w-full bg-[#0a0a0a] border border-gray-700 rounded-md py-2 pl-9 pr-3 text-sm text-gray-200 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-800 bg-[#1a1a1a] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-neon-blue text-black font-bold rounded-md hover:bg-[#00d4ff] transition-colors shadow-[0_0_10px_rgba(0,243,255,0.3)]"
          >
            <Save size={16} />
            Save & Reload
          </button>
        </div>
      </div>
    </div>
  );
}
