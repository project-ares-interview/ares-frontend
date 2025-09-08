import { create } from "zustand";
import { FullResume, Resume, ResumeCreate, ResumeUpdate } from "../schemas/resume";
import { resumeService } from "../services/resumeService";

interface ResumeState {
  resumes: Resume[];
  selectedResume: FullResume | null;
  isLoading: boolean;
  error: string | null;

  // Base Resume
  fetchResumes: () => Promise<void>;
  fetchFullResume: (id: number) => Promise<void>;
  createResume: (data: ResumeCreate) => Promise<Resume | undefined>;
  updateResume: (id: number, data: ResumeUpdate) => Promise<void>;
  deleteResume: (id: number) => Promise<void>;
  clearSelectedResume: () => void;

  // Nested resources - TBD: Add methods for nested resources later if needed
}

export const useResumeStore = create<ResumeState>((set, get) => ({
  resumes: [],
  selectedResume: null,
  isLoading: false,
  error: null,

  // --- Base Resume Actions ---
  fetchResumes: async () => {
    set({ isLoading: true, error: null });
    try {
      const resumes = await resumeService.getAll();
      set({ resumes, isLoading: false });
    } catch (error) {
      const errorMessage = "Failed to fetch resumes.";
      set({ error: errorMessage, isLoading: false });
      console.error(error);
    }
  },

  fetchFullResume: async (id: number) => {
    set({ isLoading: true, error: null, selectedResume: null });
    try {
      const fullResume = await resumeService.getFullResume(id);
      set({ selectedResume: fullResume, isLoading: false });
    } catch (error) {
      const errorMessage = "Failed to fetch resume details.";
      set({ error: errorMessage, isLoading: false });
      console.error(error);
    }
  },

  createResume: async (data: ResumeCreate) => {
    set({ isLoading: true, error: null });
    try {
      const newResume = await resumeService.create(data);
      set((state) => ({
        resumes: [...state.resumes, newResume],
        isLoading: false,
      }));
      return newResume;
    } catch (error) {
      const errorMessage = "Failed to create resume.";
      set({ error: errorMessage, isLoading: false });
      console.error(error);
      throw error;
    }
  },

  updateResume: async (id: number, data: ResumeUpdate) => {
    set({ isLoading: true, error: null });
    try {
      const updatedResume = await resumeService.update(id, data);
      set((state) => ({
        resumes: state.resumes.map((r) => (r.id === id ? updatedResume : r)),
        selectedResume:
          state.selectedResume?.id === id
            ? { ...state.selectedResume, ...updatedResume }
            : state.selectedResume,
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = "Failed to update resume.";
      set({ error: errorMessage, isLoading: false });
      console.error(error);
      throw error;
    }
  },

  deleteResume: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await resumeService.delete(id);
      set((state) => ({
        resumes: state.resumes.filter((r) => r.id !== id),
        selectedResume: state.selectedResume?.id === id ? null : state.selectedResume,
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = "Failed to delete resume.";
      set({ error: errorMessage, isLoading: false });
      console.error(error);
    }
  },

  clearSelectedResume: () => {
    set({ selectedResume: null });
  },
}));
