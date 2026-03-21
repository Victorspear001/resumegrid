import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { User, Upload, Trash2, Wand2, Loader2 } from 'lucide-react';
import { generateProfessionalSummary } from '../../services/aiService';

export function PersonalInfoForm() {
  const { data, updatePersonalInfo } = useResumeStore();
  const { personalInfo, skills } = data;
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updatePersonalInfo({ [name]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonalInfo({ profilePicture: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    updatePersonalInfo({ profilePicture: '' });
  };

  const handleGenerateSummary = async () => {
    if (!personalInfo.jobTitle) {
      alert("Please enter a Job Title first to generate a summary.");
      return;
    }
    
    setIsGenerating(true);
    try {
      const skillNames = skills.map(s => s.name);
      const generatedSummary = await generateProfessionalSummary(personalInfo.jobTitle, skillNames);
      updatePersonalInfo({ summary: generatedSummary });
    } catch (error) {
      alert("Failed to generate summary. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const careers = [
    'Sales Executive',
    'Sales Manager',
    'Billing Executive',
    'Teacher',
    'Doctor',
    'Developer',
    'Tester',
    'Data Analyst',
    'Project Manager',
    'Marketing Specialist',
    'Designer',
    'Customer Support'
  ];

  const careerTemplates: Record<string, string> = {
    'Sales Executive': 'Results-driven Sales Executive with a proven track record of exceeding targets and building strong client relationships. Skilled in lead generation, negotiation, and market analysis.',
    'Sales Manager': 'Strategic Sales Manager with extensive experience in leading high-performing teams and developing effective sales strategies. Expert in CRM management and revenue growth.',
    'Billing Executive': 'Detail-oriented Billing Executive with expertise in financial record-keeping, invoice processing, and account reconciliation. Proficient in accounting software and compliance.',
    'Teacher': 'Dedicated Teacher with a passion for fostering student growth and creating engaging learning environments. Experienced in curriculum development and classroom management.',
    'Doctor': 'Compassionate and highly skilled Medical Doctor with a commitment to providing exceptional patient care. Expert in diagnosis, treatment planning, and medical research.',
    'Developer': 'Innovative Software Developer with a strong background in full-stack development and problem-solving. Proficient in modern frameworks and agile methodologies.',
    'Tester': 'Meticulous QA Tester with a focus on ensuring software quality through comprehensive manual and automated testing. Skilled in bug tracking and performance analysis.',
    'Data Analyst': 'Analytical Data Analyst with expertise in interpreting complex data sets and providing actionable insights. Proficient in SQL, Python, and data visualization tools.',
    'Project Manager': 'Organized Project Manager with a history of delivering projects on time and within budget. Expert in risk management and stakeholder communication.',
    'Marketing Specialist': 'Creative Marketing Specialist with a focus on digital marketing, brand development, and campaign management. Skilled in SEO, content creation, and social media.',
    'Designer': 'Versatile Graphic Designer with a passion for visual storytelling and user-centric design. Proficient in Adobe Creative Suite and UI/UX principles.',
    'Customer Support': 'Empathetic Customer Support Specialist with a focus on resolving issues and enhancing customer satisfaction. Skilled in communication and conflict resolution.'
  };

  const handleCareerSelect = (career: string) => {
    updatePersonalInfo({ 
      jobTitle: career,
      summary: careerTemplates[career] || personalInfo.summary
    });
  };

  return (
    <section className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2 flex items-center gap-6 mb-2">
          <div className="h-24 min-w-[6rem] rounded-md bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden shrink-0 relative group">
            {personalInfo.profilePicture ? (
              <>
                <img src={personalInfo.profilePicture} alt="Profile" className="w-auto h-full object-contain" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={removeImage}
                    className="p-1.5 bg-white text-red-600 rounded-full hover:bg-red-50 transition-colors"
                    title="Remove photo"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </>
            ) : (
              <User className="w-10 h-10 text-gray-400" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">Profile Picture</h4>
            <p className="text-xs text-gray-500 mb-3">Add a photo to your resume (optional).</p>
            <div className="flex gap-2">
              <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Upload size={16} />
                Upload Photo
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
          </div>
        </div>

        <div className="sm:col-span-2 space-y-2">
          <label className="text-sm font-medium text-gray-700">Quick Select Career Role</label>
          <div className="flex flex-wrap gap-2">
            {careers.map((career) => (
              <button
                key={career}
                type="button"
                onClick={() => handleCareerSelect(career)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  personalInfo.jobTitle === career
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                }`}
              >
                {career}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 italic">Selecting a role will also provide a professional summary template.</p>
        </div>

        <div className="space-y-1">
          <label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={personalInfo.fullName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="space-y-1">
          <label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">Job Title</label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={personalInfo.jobTitle}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={personalInfo.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="space-y-1">
          <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={personalInfo.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="space-y-1">
          <label htmlFor="location" className="text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={personalInfo.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="space-y-1">
          <label htmlFor="website" className="text-sm font-medium text-gray-700">Website / Portfolio</label>
          <input
            type="url"
            id="website"
            name="website"
            value={personalInfo.website}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="space-y-1 sm:col-span-2">
          <label htmlFor="linkedin" className="text-sm font-medium text-gray-700">LinkedIn URL</label>
          <input
            type="url"
            id="linkedin"
            name="linkedin"
            value={personalInfo.linkedin}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="space-y-1 sm:col-span-2">
          <div className="flex justify-between items-center">
            <label htmlFor="summary" className="text-sm font-medium text-gray-700">Professional Summary</label>
            <button
              type="button"
              onClick={handleGenerateSummary}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
              {isGenerating ? 'Generating...' : 'Generate with AI'}
            </button>
          </div>
          <textarea
            id="summary"
            name="summary"
            rows={4}
            value={personalInfo.summary}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
            placeholder="Briefly describe your professional background and key strengths..."
          />
        </div>
      </div>
    </section>
  );
}
