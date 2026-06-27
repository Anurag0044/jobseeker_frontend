import { create } from 'zustand';

export type ViewMode = 'grid' | 'list' | 'compact' | 'showcase';
export type SortMethod = 'latest' | 'oldest' | 'views' | 'likes' | 'a-z';

interface ProjectUIStore {
  viewMode: ViewMode;
  sortMethod: SortMethod;
  searchQuery: string;
  activeTags: string[];
  activeCategory: string | null;
  isManageMode: boolean;
  selectedProjectIds: string[];

  setViewMode: (mode: ViewMode) => void;
  setSortMethod: (method: SortMethod) => void;
  setSearchQuery: (query: string) => void;
  setActiveTags: (tags: string[]) => void;
  setActiveCategory: (category: string | null) => void;
  setManageMode: (mode: boolean) => void;
  toggleProjectSelection: (id: string) => void;
  clearSelection: () => void;
}

export const useProjectStore = create<ProjectUIStore>()((set) => ({
  viewMode: 'grid',
  sortMethod: 'latest',
  searchQuery: '',
  activeTags: [],
  activeCategory: null,
  isManageMode: false,
  selectedProjectIds: [],

  setViewMode: (mode) => set({ viewMode: mode }),
  setSortMethod: (method) => set({ sortMethod: method }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveTags: (tags) => set({ activeTags: tags }),
  setActiveCategory: (category) => set({ activeCategory: category }),
  setManageMode: (mode) => set((state) => ({
    isManageMode: mode,
    selectedProjectIds: mode ? state.selectedProjectIds : [],
  })),
  toggleProjectSelection: (id) => set((state) => ({
    selectedProjectIds: state.selectedProjectIds.includes(id)
      ? state.selectedProjectIds.filter((pid) => pid !== id)
      : [...state.selectedProjectIds, id],
  })),
  clearSelection: () => set({ selectedProjectIds: [] }),
}));
