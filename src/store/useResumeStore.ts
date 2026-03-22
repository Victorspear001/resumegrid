import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { ResumeData, Experience, Education, Project, SkillCategory, SectionType, ResumeTheme } from '../types/resume';

interface ResumeState {
  resumeId: string;
  data: ResumeData;
  logoUrl: string | null;
  setResumeId: (id: string) => void;
  setLogoUrl: (url: string | null) => void;
  updatePersonalInfo: (data: Partial<ResumeData['personalInfo']>) => void;
  
  // Experience
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  reorderExperience: (startIndex: number, endIndex: number) => void;
  
  // Education
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  reorderEducation: (startIndex: number, endIndex: number) => void;
  
  // Projects
  addProject: () => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;
  reorderProjects: (startIndex: number, endIndex: number) => void;
  
  // Skills
  addSkillCategory: () => void;
  updateSkillCategory: (id: string, data: Partial<SkillCategory>) => void;
  removeSkillCategory: (id: string) => void;
  reorderSkillCategories: (startIndex: number, endIndex: number) => void;
  
  // Theme & Layout
  updateTheme: (theme: Partial<ResumeTheme>) => void;
  reorderSections: (startIndex: number, endIndex: number) => void;
  
  // Load/Save
  loadData: (data: ResumeData) => void;
}

const initialData: ResumeData = {
  personalInfo: {
    fullName: 'Jane Doe',
    jobTitle: 'Senior Software Engineer',
    email: 'jane.doe@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    website: 'janedoe.dev',
    linkedin: 'linkedin.com/in/janedoe',
    summary: 'Experienced software engineer with a passion for building scalable web applications and leading high-performing teams. Proven track record of delivering complex projects on time and improving system performance.',
    profilePicture: '',
  },
  experience: [
    {
      id: uuidv4(),
      company: 'Tech Innovators Inc.',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: 'Jan 2020',
      endDate: 'Present',
      current: true,
      description: [
        'Led a team of 5 engineers to rebuild the core customer portal, reducing load times by 40%.',
        'Architected and implemented a microservices architecture using Node.js and Docker.',
        'Mentored junior developers and established best practices for code reviews and testing.',
      ],
    },
    {
      id: uuidv4(),
      company: 'Web Solutions LLC',
      position: 'Software Engineer',
      location: 'Austin, TX',
      startDate: 'Jun 2016',
      endDate: 'Dec 2019',
      current: false,
      description: [
        'Developed RESTful APIs for a high-traffic e-commerce platform using Python and Django.',
        'Integrated third-party payment gateways, increasing successful transactions by 15%.',
        'Collaborated with product managers to define technical requirements and project scopes.',
      ],
    }
  ],
  education: [
    {
      id: uuidv4(),
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      location: 'Berkeley, CA',
      startDate: 'Aug 2012',
      endDate: 'May 2016',
      percentage: '95%',
      description: [],
    }
  ],
  projects: [
    {
      id: uuidv4(),
      name: 'Open Source Task Manager',
      description: 'A lightweight, terminal-based task management tool.',
      url: 'github.com/janedoe/task-cli',
      technologies: ['Rust', 'SQLite'],
      highlights: [
        'Achieved 1,000+ stars on GitHub within the first month of release.',
        'Implemented a custom query language for advanced task filtering.',
      ],
    }
  ],
  skills: [
    {
      id: uuidv4(),
      name: 'Languages',
      skills: ['JavaScript', 'TypeScript', 'Python', 'Rust', 'HTML/CSS'],
    },
    {
      id: uuidv4(),
      name: 'Frameworks & Tools',
      skills: ['React', 'Node.js', 'Docker', 'AWS', 'Git', 'PostgreSQL'],
    }
  ],
  sectionOrder: ['personal', 'experience', 'education', 'skills', 'projects'],
  theme: {
    accentColor: '#2563eb', // blue-600
    fontFamily: 'Inter',
    headingFontFamily: 'Inter',
    spacing: 'normal',
    template: 'minimal',
    margin: 16,
    lineHeight: 1.4,
  }
};

export const useResumeStore = create<ResumeState>((set) => ({
  resumeId: uuidv4(),
  data: initialData,
  logoUrl: null,
  
  setResumeId: (id) => set({ resumeId: id }),
  setLogoUrl: (url) => set({ logoUrl: url }),

  updatePersonalInfo: (info) => set((state) => ({
    data: { ...state.data, personalInfo: { ...state.data.personalInfo, ...info } }
  })),
  
  // Experience
  addExperience: () => set((state) => ({
    data: {
      ...state.data,
      experience: [
        ...state.data.experience,
        {
          id: uuidv4(),
          company: '',
          position: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: [''],
        }
      ]
    }
  })),
  updateExperience: (id, expData) => set((state) => ({
    data: {
      ...state.data,
      experience: state.data.experience.map((exp) => exp.id === id ? { ...exp, ...expData } : exp)
    }
  })),
  removeExperience: (id) => set((state) => ({
    data: {
      ...state.data,
      experience: state.data.experience.filter((exp) => exp.id !== id)
    }
  })),
  reorderExperience: (startIndex, endIndex) => set((state) => {
    const newExp = Array.from(state.data.experience);
    const [removed] = newExp.splice(startIndex, 1);
    newExp.splice(endIndex, 0, removed);
    return { data: { ...state.data, experience: newExp } };
  }),
  
  // Education
  addEducation: () => set((state) => ({
    data: {
      ...state.data,
      education: [
        ...state.data.education,
        {
          id: uuidv4(),
          institution: '',
          degree: '',
          fieldOfStudy: '',
          location: '',
          startDate: '',
          endDate: '',
          percentage: '',
          description: [],
        }
      ]
    }
  })),
  updateEducation: (id, eduData) => set((state) => ({
    data: {
      ...state.data,
      education: state.data.education.map((edu) => edu.id === id ? { ...edu, ...eduData } : edu)
    }
  })),
  removeEducation: (id) => set((state) => ({
    data: {
      ...state.data,
      education: state.data.education.filter((edu) => edu.id !== id)
    }
  })),
  reorderEducation: (startIndex, endIndex) => set((state) => {
    const newEdu = Array.from(state.data.education);
    const [removed] = newEdu.splice(startIndex, 1);
    newEdu.splice(endIndex, 0, removed);
    return { data: { ...state.data, education: newEdu } };
  }),
  
  // Projects
  addProject: () => set((state) => ({
    data: {
      ...state.data,
      projects: [
        ...state.data.projects,
        {
          id: uuidv4(),
          name: '',
          description: '',
          url: '',
          technologies: [],
          highlights: [''],
        }
      ]
    }
  })),
  updateProject: (id, projData) => set((state) => ({
    data: {
      ...state.data,
      projects: state.data.projects.map((proj) => proj.id === id ? { ...proj, ...projData } : proj)
    }
  })),
  removeProject: (id) => set((state) => ({
    data: {
      ...state.data,
      projects: state.data.projects.filter((proj) => proj.id !== id)
    }
  })),
  reorderProjects: (startIndex, endIndex) => set((state) => {
    const newProj = Array.from(state.data.projects);
    const [removed] = newProj.splice(startIndex, 1);
    newProj.splice(endIndex, 0, removed);
    return { data: { ...state.data, projects: newProj } };
  }),
  
  // Skills
  addSkillCategory: () => set((state) => ({
    data: {
      ...state.data,
      skills: [
        ...state.data.skills,
        {
          id: uuidv4(),
          name: '',
          skills: [],
        }
      ]
    }
  })),
  updateSkillCategory: (id, skillData) => set((state) => ({
    data: {
      ...state.data,
      skills: state.data.skills.map((skill) => skill.id === id ? { ...skill, ...skillData } : skill)
    }
  })),
  removeSkillCategory: (id) => set((state) => ({
    data: {
      ...state.data,
      skills: state.data.skills.filter((skill) => skill.id !== id)
    }
  })),
  reorderSkillCategories: (startIndex, endIndex) => set((state) => {
    const newSkills = Array.from(state.data.skills);
    const [removed] = newSkills.splice(startIndex, 1);
    newSkills.splice(endIndex, 0, removed);
    return { data: { ...state.data, skills: newSkills } };
  }),
  
  // Theme & Layout
  updateTheme: (theme) => set((state) => ({
    data: { ...state.data, theme: { ...state.data.theme, ...theme } }
  })),
  reorderSections: (startIndex, endIndex) => set((state) => {
    const newOrder = Array.from(state.data.sectionOrder);
    const [removed] = newOrder.splice(startIndex, 1);
    newOrder.splice(endIndex, 0, removed);
    return { data: { ...state.data, sectionOrder: newOrder } };
  }),
  
  loadData: (data) => set({ data }),
}));
