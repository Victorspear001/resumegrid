import { useEffect, useState } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { FileText, Trash2, Edit, Calendar, Clock, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface SavedResume {
  id: string;
  title: string;
  data: string;
  updated_at: string;
}

export function SavedResumes({ onEdit }: { onEdit: () => void }) {
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { loadData, setResumeId } = useResumeStore();

  const getUserId = () => {
    let userId = localStorage.getItem('resume_user_id');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('resume_user_id', userId);
    }
    return userId;
  };

  const fetchResumes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userId = getUserId();
      const response = await fetch(`/api/resumes?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch resumes');
      }
      const data = await response.json();
      setResumes(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleEdit = async (resume: SavedResume) => {
    try {
      const userId = getUserId();
      const response = await fetch(`/api/resumes/${resume.id}?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch resume data');
      }
      const data = await response.json();
      const parsedData = JSON.parse(data.data);
      loadData(parsedData);
      setResumeId(resume.id);
      onEdit();
    } catch (err) {
      console.error('Failed to load resume data:', err);
      alert('Failed to load resume data. It might be corrupted.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    
    try {
      const userId = getUserId();
      const response = await fetch(`/api/resumes/${id}?userId=${userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete resume');
      }
      
      setResumes(resumes.filter(r => r.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete resume');
    }
  };

  const handleCreateNew = () => {
    // We can just reload the page or reset the store to initial state
    // But since we don't have a reset function in store, reloading is easiest
    window.location.reload();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="flex-1 overflow-y-auto bg-black p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800">
          <div>
            <h2 className="text-3xl font-bold text-gray-100 tracking-tight">Saved Resumes</h2>
            <p className="text-gray-400 mt-1">Manage and edit your previously saved resumes.</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-neon-blue/10 text-neon-blue border border-neon-blue/30 hover:bg-neon-blue hover:text-black rounded-md transition-all duration-300 font-medium shadow-[0_0_15px_rgba(0,243,255,0.15)] hover:shadow-[0_0_20px_rgba(0,243,255,0.4)]"
          >
            <Plus size={18} />
            Create New
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-blue"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 rounded-lg flex items-center justify-center">
            <p>{error}</p>
          </div>
        ) : resumes.length === 0 ? (
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-12 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-4 border border-gray-800">
              <FileText size={32} className="text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-200 mb-2">No saved resumes yet</h3>
            <p className="text-gray-500 max-w-md mb-6">
              Create your first resume in the editor. It will be automatically saved here for you to access later.
            </p>
            <button
              onClick={onEdit}
              className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors font-medium"
            >
              Go to Editor
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => {
              const { date, time } = formatDate(resume.updated_at);
              return (
                <div 
                  key={resume.id} 
                  className="bg-[#0a0a0a] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-all duration-300 group flex flex-col h-full shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                >
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center border border-gray-800 group-hover:border-neon-blue/30 group-hover:text-neon-blue transition-colors">
                        <FileText size={24} />
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-100 mb-2 line-clamp-1 group-hover:text-neon-blue transition-colors">
                      {resume.title}
                    </h3>
                    
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar size={14} className="mr-2 opacity-70" />
                        <span>{date}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock size={14} className="mr-2 opacity-70" />
                        <span>{time}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-800 p-3 bg-black/50 flex items-center justify-between">
                    <button
                      onClick={() => handleEdit(resume)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <div className="w-px h-6 bg-gray-800 mx-2"></div>
                    <button
                      onClick={() => handleDelete(resume.id)}
                      className="p-2 text-gray-500 hover:text-neon-red hover:bg-red-900/20 rounded-md transition-colors"
                      title="Delete Resume"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
