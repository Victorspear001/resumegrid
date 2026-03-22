import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { User, Upload, Trash2 } from 'lucide-react';

export function PersonalInfoForm() {
  const { data, updatePersonalInfo } = useResumeStore();
  const { personalInfo } = data;

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

  const careers = [
    'Software Engineer',
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'Mobile App Developer',
    'DevOps Engineer',
    'Cloud Architect',
    'Data Scientist',
    'Data Analyst',
    'Machine Learning Engineer',
    'AI Researcher',
    'Cybersecurity Analyst',
    'QA Engineer',
    'Product Manager',
    'Project Manager',
    'Scrum Master',
    'UI/UX Designer',
    'Graphic Designer',
    'Marketing Manager',
    'Content Writer',
    'SEO Specialist',
    'Sales Executive',
    'Business Analyst',
    'Financial Analyst',
    'HR Manager',
    'Customer Success Manager',
    'Operations Manager',
    'Legal Counsel',
    'Teacher',
    'Doctor',
    'Nurse',
    'Pharmacist',
    'Blockchain Developer',
    'Embedded Systems Engineer',
    'Game Developer',
    'Network Engineer',
    'System Administrator',
    'Database Administrator',
    'Solutions Architect',
    'Technical Lead',
    'CTO',
    'Engineering Manager',
    'Site Reliability Engineer',
    'Security Engineer',
    'Data Engineer',
    'Business Intelligence Developer',
    'Digital Marketer',
    'Social Media Manager',
    'Copywriter',
    'Public Relations Specialist',
    'Accountant',
    'Auditor',
    'Tax Consultant',
    'Investment Banker',
    'Risk Manager',
    'Recruiter',
    'Training and Development Specialist',
    'Office Manager',
    'Executive Assistant',
    'Supply Chain Analyst',
    'Logistics Coordinator',
    'Architect',
    'Civil Engineer',
    'Mechanical Engineer',
    'Electrical Engineer',
    'Chemical Engineer',
    'Biotechnologist',
    'Psychologist',
    'Social Worker',
    'Journalist',
    'Photographer',
    'Video Editor',
    'Chef',
    'Event Planner',
    'Real Estate Agent',
    'Travel Agent'
  ];

  const careerTemplates: Record<string, string> = {
    'Software Engineer': 'Highly motivated Software Engineer with expertise in designing, developing, and maintaining scalable software solutions. Proficient in multiple programming languages and passionate about clean code.',
    'Full Stack Developer': 'Versatile Full Stack Developer with extensive experience in both frontend and backend technologies. Skilled in building responsive web applications from concept to deployment.',
    'Frontend Developer': 'Creative Frontend Developer dedicated to building intuitive and visually appealing user interfaces. Expert in modern JavaScript frameworks and responsive design principles.',
    'Backend Developer': 'Robust Backend Developer focused on building secure and high-performance server-side logic and database management systems. Proficient in API design and microservices.',
    'Mobile App Developer': 'Innovative Mobile App Developer with a track record of creating high-quality iOS and Android applications. Expert in React Native, Flutter, or native development.',
    'DevOps Engineer': 'Results-oriented DevOps Engineer with expertise in automating software delivery pipelines and managing cloud infrastructure. Skilled in CI/CD, Docker, and Kubernetes.',
    'Cloud Architect': 'Strategic Cloud Architect with a deep understanding of cloud computing platforms and architectural patterns. Expert in designing resilient and cost-effective cloud solutions.',
    'Data Scientist': 'Analytical Data Scientist with a passion for extracting insights from complex datasets using statistical modeling and machine learning. Proficient in Python, R, and big data tools.',
    'Data Analyst': 'Detail-oriented Data Analyst with expertise in data cleaning, visualization, and reporting. Skilled in SQL, Excel, and business intelligence platforms.',
    'Machine Learning Engineer': 'Innovative Machine Learning Engineer focused on developing and deploying advanced ML models to solve real-world problems. Expert in deep learning and NLP.',
    'AI Researcher': 'Dedicated AI Researcher with a focus on pushing the boundaries of artificial intelligence through innovative research and development. Published in top-tier conferences.',
    'Cybersecurity Analyst': 'Vigilant Cybersecurity Analyst committed to protecting organizational assets from cyber threats. Expert in threat detection, incident response, and security auditing.',
    'QA Engineer': 'Meticulous QA Engineer with a focus on ensuring software quality through comprehensive manual and automated testing. Skilled in bug tracking and performance analysis.',
    'Product Manager': 'Strategic Product Manager with a passion for building products that solve customer problems and drive business growth. Expert in product lifecycle management.',
    'Project Manager': 'Organized Project Manager with a history of delivering projects on time and within budget. Expert in risk management and stakeholder communication.',
    'Scrum Master': 'Facilitative Scrum Master dedicated to empowering agile teams and fostering a culture of continuous improvement. Expert in Scrum ceremonies and team dynamics.',
    'UI/UX Designer': 'User-centric UI/UX Designer with a focus on creating seamless and engaging digital experiences. Proficient in Figma, Adobe XD, and user research.',
    'Graphic Designer': 'Creative Graphic Designer with a passion for visual storytelling and brand development. Skilled in Adobe Creative Suite and typography.',
    'Marketing Manager': 'Data-driven Marketing Manager with expertise in developing and executing comprehensive marketing strategies. Skilled in digital marketing and brand management.',
    'Content Writer': 'Versatile Content Writer with a talent for creating engaging and informative content across various platforms. Skilled in storytelling and SEO.',
    'SEO Specialist': 'Strategic SEO Specialist focused on improving organic search visibility and driving high-quality traffic. Expert in keyword research and technical SEO.',
    'Sales Executive': 'Results-driven Sales Executive with a proven track record of exceeding targets and building strong client relationships. Skilled in negotiation and market analysis.',
    'Business Analyst': 'Analytical Business Analyst with expertise in identifying business needs and developing effective solutions. Skilled in requirements gathering and process mapping.',
    'Financial Analyst': 'Detail-oriented Financial Analyst with a focus on financial modeling, forecasting, and investment analysis. Proficient in Excel and financial software.',
    'HR Manager': 'Empathetic HR Manager dedicated to building high-performing teams and fostering a positive workplace culture. Expert in talent acquisition and employee relations.',
    'Customer Success Manager': 'Customer-focused Success Manager dedicated to ensuring client satisfaction and driving long-term value. Skilled in relationship management and problem-solving.',
    'Operations Manager': 'Efficient Operations Manager with a focus on optimizing business processes and improving organizational productivity. Skilled in supply chain and logistics.',
    'Legal Counsel': 'Strategic Legal Counsel with expertise in corporate law, contract negotiation, and regulatory compliance. Committed to protecting organizational interests.',
    'Teacher': 'Dedicated Teacher with a passion for fostering student growth and creating engaging learning environments. Experienced in curriculum development and classroom management.',
    'Doctor': 'Compassionate and highly skilled Medical Doctor with a commitment to providing exceptional patient care. Expert in diagnosis and treatment planning.',
    'Nurse': 'Dedicated Registered Nurse with a focus on providing high-quality patient care and support. Skilled in clinical assessment and patient advocacy.',
    'Pharmacist': 'Detail-oriented Pharmacist committed to ensuring safe and effective medication use. Expert in pharmacology and patient counseling.',
    'Blockchain Developer': 'Forward-thinking Blockchain Developer with expertise in decentralized applications and smart contract development. Proficient in Solidity and blockchain protocols.',
    'Game Developer': 'Creative Game Developer with a passion for building immersive and engaging gaming experiences. Skilled in C++, C#, and game engines like Unity or Unreal.',
    'Architect': 'Visionary Architect with a focus on designing sustainable and aesthetically pleasing structures. Experienced in project management and urban planning.',
    'Chef': 'Passionate Chef with a talent for creating innovative and delicious culinary experiences. Skilled in kitchen management and menu development.'
  };

  const handleCareerSelect = (career: string) => {
    updatePersonalInfo({ 
      jobTitle: career,
      summary: careerTemplates[career] || personalInfo.summary
    });
  };

  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-gray-800 pb-4">
        <h3 className="text-xl font-bold text-gray-200 neon-text-blue">Personal Information</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="sm:col-span-2 flex items-center gap-6 mb-2">
          <div className="h-24 min-w-[6rem] rounded-md bg-black border-2 border-dashed border-gray-800 flex items-center justify-center overflow-hidden shrink-0 relative group shadow-[0_0_5px_rgba(0,0,0,0.5)]">
            {personalInfo.profilePicture ? (
              <>
                <img src={personalInfo.profilePicture} alt="Profile" className="w-auto h-full object-contain" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={removeImage}
                    className="p-1.5 bg-[#8b0000] text-white rounded-full hover:bg-red-900 transition-all duration-300 shadow-[0_0_5px_rgba(139,0,0,0.3)]"
                    title="Remove photo"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </>
            ) : (
              <User className="w-10 h-10 text-gray-700" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-300 mb-1">Profile Picture</h4>
            <p className="text-[10px] text-gray-500 mb-3">Add a photo to your resume (optional).</p>
            <div className="flex gap-2">
              <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-[#050505] border border-gray-800 rounded-md text-xs font-bold text-gray-400 hover:text-neon-blue hover:border-neon-blue transition-all duration-300 shadow-sm">
                <Upload size={14} />
                Upload Photo
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
          </div>
        </div>

        <div className="sm:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quick Select Career Role</label>
            <button 
              onClick={() => updatePersonalInfo({ jobTitle: '' })}
              className="text-[10px] font-bold text-neon-red hover:underline"
            >
              Manual Entry
            </button>
          </div>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-[#050505] rounded-lg border border-gray-800 custom-scrollbar">
            {careers.map((career) => (
              <button
                key={career}
                type="button"
                onClick={() => handleCareerSelect(career)}
                className={`px-3 py-1 text-[10px] font-bold rounded-full border transition-all duration-300 ${
                  personalInfo.jobTitle === career
                    ? 'bg-neon-blue/10 border-neon-blue/50 text-neon-blue shadow-[0_0_5px_rgba(0,153,204,0.1)]'
                    : 'bg-[#0a0a0a] border-gray-800 text-gray-600 hover:border-gray-700 hover:text-gray-400'
                }`}
              >
                {career}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-gray-600 italic">Selecting a role will also provide a professional summary template.</p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="fullName" className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={personalInfo.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-black border border-gray-800 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-neon-blue focus:border-neon-blue transition-all duration-300"
            placeholder="e.g. John Doe"
          />
        </div>
        
        <div className="space-y-1.5">
          <label htmlFor="jobTitle" className="text-xs font-bold text-gray-400 uppercase tracking-wider">Job Title</label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={personalInfo.jobTitle}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-black border border-gray-800 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-neon-blue focus:border-neon-blue transition-all duration-300"
            placeholder="e.g. Senior Software Engineer"
          />
        </div>
        
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={personalInfo.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-black border border-gray-800 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-neon-blue focus:border-neon-blue transition-all duration-300"
            placeholder="e.g. john@example.com"
          />
        </div>
        
        <div className="space-y-1.5">
          <label htmlFor="phone" className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={personalInfo.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-black border border-gray-800 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-neon-blue focus:border-neon-blue transition-all duration-300"
            placeholder="e.g. +1 234 567 890"
          />
        </div>
        
        <div className="space-y-1.5">
          <label htmlFor="location" className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={personalInfo.location}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-black border border-gray-800 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-neon-blue focus:border-neon-blue transition-all duration-300"
            placeholder="e.g. New York, NY"
          />
        </div>
        
        <div className="space-y-1.5">
          <label htmlFor="website" className="text-xs font-bold text-gray-400 uppercase tracking-wider">Website / Portfolio</label>
          <input
            type="url"
            id="website"
            name="website"
            value={personalInfo.website}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-black border border-gray-800 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-neon-blue focus:border-neon-blue transition-all duration-300"
            placeholder="e.g. portfolio.com"
          />
        </div>
        
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="linkedin" className="text-xs font-bold text-gray-400 uppercase tracking-wider">LinkedIn URL</label>
          <input
            type="url"
            id="linkedin"
            name="linkedin"
            value={personalInfo.linkedin}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-black border border-gray-800 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-neon-blue focus:border-neon-blue transition-all duration-300"
            placeholder="e.g. linkedin.com/in/johndoe"
          />
        </div>
        
        <div className="space-y-1.5 sm:col-span-2">
          <div className="flex justify-between items-center">
            <label htmlFor="summary" className="text-xs font-bold text-gray-400 uppercase tracking-wider">Professional Summary</label>
          </div>
          <textarea
            id="summary"
            name="summary"
            rows={4}
            value={personalInfo.summary}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-black border border-gray-800 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-neon-blue focus:border-neon-blue transition-all duration-300 resize-y"
            placeholder="Briefly describe your professional background and key strengths..."
          />
        </div>
      </div>
    </section>
  );
}
