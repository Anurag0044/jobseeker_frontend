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

const initialProjects: Project[] = [];

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
            views: 0, likes: 0, bookmarks: 0, comments: 0, shares: 0, forks: 0, dailyData: []
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
