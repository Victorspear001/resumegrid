import { useState } from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { Toolbar } from './components/Toolbar';

export default function App() {
  const [isDistractionFree, setIsDistractionFree] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden font-sans">
      <Toolbar 
        isDistractionFree={isDistractionFree} 
        setIsDistractionFree={setIsDistractionFree} 
      />
      
      <main className="flex-1 flex overflow-hidden">
        {/* Left Side: Editor */}
        <div className={`flex-1 overflow-y-auto border-r border-gray-200 bg-white transition-all duration-300 ${isDistractionFree ? 'max-w-3xl mx-auto border-l shadow-sm' : 'w-1/2'}`}>
          <Editor />
        </div>
        
        {/* Right Side: Live Preview */}
        {!isDistractionFree && (
          <div className="flex-1 overflow-y-auto bg-gray-100 p-8 flex justify-center">
            <Preview />
          </div>
        )}
      </main>
    </div>
  );
}
