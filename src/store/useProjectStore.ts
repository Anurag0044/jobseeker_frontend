import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ProjectStatus = 'Draft' | 'Published' | 'Private' | 'Archived' | 'Under Review';

export interface ProjectAnalytics {
  views: number;
  likes: number;
  bookmarks: number;
  comments: number;
  shares: number;
  forks: number;
  dailyData: { day: string; views: number; clicks: number }[];
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  type: string;
  tags: string[];
  status: ProjectStatus;
  featured: boolean;
  verified: boolean;
  media: {
    cover: string;
    thumbnail: string;
    gallery: string[];
    demoVideo: string;
  };
  links: {
    github: string;
    demo: string;
    docs: string;
    figma: string;
  };
  metrics: ProjectAnalytics;
  createdAt: string;
  updatedAt: string;
  completionPercentage: number;
  color: string; // The UI gradient color
}

export type ViewMode = 'grid' | 'list' | 'compact' | 'showcase';
export type SortMethod = 'latest' | 'oldest' | 'views' | 'likes' | 'a-z';

interface ProjectStore {
  projects: Project[];
  viewMode: ViewMode;
  sortMethod: SortMethod;
  searchQuery: string;
  
  // Actions
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setSortMethod: (method: SortMethod) => void;
  setSearchQuery: (query: string) => void;
}

const generateMockDailyData = () => {
  const data = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  for (let i = 0; i < 7; i++) {
    data.push({
      day: days[i],
      views: Math.floor(Math.random() * 500) + 100,
      clicks: Math.floor(Math.random() * 200) + 20,
    });
  }
  return data;
};

const initialProjects: Project[] = [
  {
    id: '1',
    title: 'Orion AI Agent',
    tagline: 'Multi-agent AI system for workflow automation.',
    description: 'Orion is a scalable, multi-agent AI system designed to automate complex developer workflows. It integrates directly into your terminal and IDE to provide seamless, context-aware assistance.',
    category: 'AI Project',
    type: 'Open Source',
    tags: ['Next.js', 'TypeScript', 'OpenAI', 'Tailwind CSS', 'Python'],
    status: 'Published',
    featured: true,
    verified: true,
    media: {
      cover: '',
      thumbnail: '',
      gallery: [],
      demoVideo: '',
    },
    links: {
      github: 'https://github.com/sujal/orion-ai',
      demo: 'https://orion-ai.dev',
      docs: '',
      figma: '',
    },
    metrics: {
      views: 12450,
      likes: 1205,
      bookmarks: 340,
      comments: 56,
      shares: 89,
      forks: 432,
      dailyData: generateMockDailyData(),
    },
    createdAt: new Date(Date.now() - 10000000000).toISOString(),
    updatedAt: new Date(Date.now() - 50000000).toISOString(),
    completionPercentage: 100,
    color: 'from-[#5e5ce6]/20 to-[#1A1A1A]',
  },
  {
    id: '2',
    title: 'DevFlow',
    tagline: 'Developer collaboration platform.',
    description: 'A beautiful workspace for developers to collaborate in real-time, sharing code snippets, running interactive pair-programming sessions, and managing project milestones.',
    category: 'SaaS',
    type: 'Web App',
    tags: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
    status: 'Published',
    featured: false,
    verified: false,
    media: {
      cover: '',
      thumbnail: '',
      gallery: [],
      demoVideo: '',
    },
    links: {
      github: '',
      demo: 'https://devflow.app',
      docs: '',
      figma: '',
    },
    metrics: {
      views: 8920,
      likes: 856,
      bookmarks: 210,
      comments: 34,
      shares: 45,
      forks: 12,
      dailyData: generateMockDailyData(),
    },
    createdAt: new Date(Date.now() - 20000000000).toISOString(),
    updatedAt: new Date(Date.now() - 100000000).toISOString(),
    completionPercentage: 100,
    color: 'from-[#b19cd9]/10 to-[#1A1A1A]',
  },
  {
    id: '3',
    title: 'ForgeX Design System',
    tagline: 'Premium component library for modern SaaS.',
    description: 'A comprehensive collection of beautifully crafted, accessible, and deeply customizable React components built on top of Tailwind CSS and Framer Motion.',
    category: 'Design System',
    type: 'Open Source',
    tags: ['React', 'Tailwind CSS', 'Framer Motion', 'Storybook'],
    status: 'Draft',
    featured: false,
    verified: true,
    media: {
      cover: '',
      thumbnail: '',
      gallery: [],
      demoVideo: '',
    },
    links: {
      github: '',
      demo: '',
      docs: '',
      figma: 'https://figma.com/file/forgex',
    },
    metrics: {
      views: 0,
      likes: 0,
      bookmarks: 0,
      comments: 0,
      shares: 0,
      forks: 0,
      dailyData: generateMockDailyData(),
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completionPercentage: 65,
    color: 'from-[#06B6D4]/10 to-[#1A1A1A]',
  }
];

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      projects: initialProjects,
      viewMode: 'grid',
      sortMethod: 'latest',
      searchQuery: '',

      addProject: (projectData) => set((state) => ({
        projects: [
          {
            ...projectData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          ...state.projects
        ]
      })),

      updateProject: (id, data) => set((state) => ({
        projects: state.projects.map((p) => 
          p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
        )
      })),

      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter((p) => p.id !== id)
      })),

      duplicateProject: (id) => set((state) => {
        const projectToDuplicate = state.projects.find(p => p.id === id);
        if (!projectToDuplicate) return state;

        const duplicated: Project = {
          ...projectToDuplicate,
          id: crypto.randomUUID(),
          title: `${projectToDuplicate.title} (Copy)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'Draft',
          metrics: {
            views: 0, likes: 0, bookmarks: 0, comments: 0, shares: 0, forks: 0, dailyData: generateMockDailyData()
          }
        };

        return { projects: [duplicated, ...state.projects] };
      }),

      setViewMode: (mode) => set({ viewMode: mode }),
      setSortMethod: (method) => set({ sortMethod: method }),
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: 'forgex-projects-storage',
    }
  )
);
