import { useState, useEffect } from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { Toolbar } from './components/Toolbar';
import { AutoSaver } from './components/AutoSaver';

export default function App() {
  const [isDistractionFree, setIsDistractionFree] = useState(false);

  useEffect(() => {
    // Initialize the database table if it doesn't exist
    const url = localStorage.getItem('TURSO_DATABASE_URL') || '';
    const token = localStorage.getItem('TURSO_AUTH_TOKEN') || '';
    
    if (url && token) {
      fetch('/api/init-db', { 
        method: 'POST',
        headers: {
          'x-turso-url': url,
          'x-turso-token': token
        }
      }).catch(console.error);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-black text-gray-100 overflow-hidden font-sans">
      <Toolbar 
        isDistractionFree={isDistractionFree} 
        setIsDistractionFree={setIsDistractionFree} 
      />
      
      <main className="flex-1 flex overflow-hidden">
        {/* Left Side: Editor */}
        <div className={`flex-1 overflow-y-auto border-r border-gray-800 bg-[#0a0a0a] transition-all duration-300 ${isDistractionFree ? 'max-w-3xl mx-auto border-l shadow-[0_0_15px_rgba(0,243,255,0.1)]' : 'w-1/2'}`}>
          <Editor />
        </div>
        
        {/* Right Side: Live Preview */}
        {!isDistractionFree && (
          <div className="flex-1 overflow-y-auto bg-black p-8 flex justify-center">
            <Preview />
          </div>
        )}
      </main>

      <AutoSaver />
    </div>
  );
}
