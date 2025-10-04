import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SetupProgress {
  greeting: boolean;
  letter: boolean;
  slides: boolean;
  quiz: boolean;
  gift: boolean;
}

export interface GeneratedLink {
  slug: string;
  fullUrl: string;
  createdAt: Date;
  expiryDate: Date | null;
  views: number;
}

interface SetupStore {
  // Progress tracking
  progress: SetupProgress;
  
  // Generated link data
  generatedLink: GeneratedLink | null;
  
  // Actions
  updateProgress: (section: keyof SetupProgress, isComplete: boolean) => void;
  checkAllComplete: () => boolean;
  getCompletionPercentage: () => number;
  setGeneratedLink: (link: GeneratedLink) => void;
  clearGeneratedLink: () => void;
  incrementViews: () => void;
  
  // Reset
  resetProgress: () => void;
}

export const useSetupStore = create<SetupStore>()(
  persist(
    (set, get) => ({
      progress: {
        greeting: false,
        letter: false,
        slides: false,
        quiz: false,
        gift: false,
      },
      
      generatedLink: null,
      
      updateProgress: (section, isComplete) => {
        set((state) => ({
          progress: {
            ...state.progress,
            [section]: isComplete,
          },
        }));
      },
      
      checkAllComplete: () => {
        const { progress } = get();
        return Object.values(progress).every((value) => value === true);
      },
      
      getCompletionPercentage: () => {
        const { progress } = get();
        const completed = Object.values(progress).filter((value) => value).length;
        const total = Object.keys(progress).length;
        return Math.round((completed / total) * 100);
      },
      
      setGeneratedLink: (link) => {
        set({ generatedLink: link });
      },
      
      clearGeneratedLink: () => {
        set({ generatedLink: null });
      },
      
      incrementViews: () => {
        set((state) => {
          if (!state.generatedLink) return state;
          return {
            generatedLink: {
              ...state.generatedLink,
              views: state.generatedLink.views + 1,
            },
          };
        });
      },
      
      resetProgress: () => {
        set({
          progress: {
            greeting: false,
            letter: false,
            slides: false,
            quiz: false,
            gift: false,
          },
          generatedLink: null,
        });
      },
    }),
    {
      name: 'lovely-card-setup',
    }
  )
);
