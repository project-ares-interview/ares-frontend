import { create } from "zustand";
import {
    CoverLetter,
    CoverLetterCreate,
    CoverLetterUpdate,
} from "../schemas/coverLetter";
import { coverLetterService } from "../services/coverLetterService";

interface CoverLetterState {
  coverLetters: CoverLetter[];
  selectedCoverLetter: CoverLetter | null;
  isLoading: boolean;
  error: string | null;
  fetchCoverLetters: () => Promise<void>;
  fetchCoverLetterById: (id: number) => Promise<void>;
  createCoverLetter: (data: CoverLetterCreate) => Promise<void>;
  updateCoverLetter: (id: number, data: CoverLetterUpdate) => Promise<void>;
  deleteCoverLetter: (id: number) => Promise<void>;
  selectCoverLetter: (coverLetter: CoverLetter | null) => void;
  clearSelectedCoverLetter: () => void;
}

export const useCoverLetterStore = create<CoverLetterState>((set) => ({
  coverLetters: [],
  selectedCoverLetter: null,
  isLoading: false,
  error: null,

  fetchCoverLetters: async () => {
    set({ isLoading: true, error: null });
    try {
      const coverLetters = await coverLetterService.getAll();
      set({ coverLetters, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch cover letters.", isLoading: false });
      console.error(error);
    }
  },

  fetchCoverLetterById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const coverLetter = await coverLetterService.getById(id);
      set({ selectedCoverLetter: coverLetter, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch cover letter.", isLoading: false });
      console.error(error);
    }
  },

  createCoverLetter: async (data: CoverLetterCreate) => {
    set({ isLoading: true, error: null });
    try {
      const newCoverLetter = await coverLetterService.create(data);
      set((state) => ({
        coverLetters: [...state.coverLetters, newCoverLetter],
        isLoading: false,
        selectedCoverLetter: newCoverLetter,
      }));
    } catch (error) {
      set({ error: "Failed to create cover letter.", isLoading: false });
      console.error(error);
      throw error;
    }
  },

  updateCoverLetter: async (id: number, data: CoverLetterUpdate) => {
    set({ isLoading: true, error: null });
    try {
      const updatedCoverLetter = await coverLetterService.update(id, data);
      set((state) => ({
        coverLetters: state.coverLetters.map((cl) =>
          cl.id === id ? updatedCoverLetter : cl,
        ),
        selectedCoverLetter:
          state.selectedCoverLetter?.id === id
            ? updatedCoverLetter
            : state.selectedCoverLetter,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: "Failed to update cover letter.", isLoading: false });
      console.error(error);
      throw error;
    }
  },

  deleteCoverLetter: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await coverLetterService.delete(id);
      set((state) => ({
        coverLetters: state.coverLetters.filter((cl) => cl.id !== id),
        selectedCoverLetter:
          state.selectedCoverLetter?.id === id
            ? null
            : state.selectedCoverLetter,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: "Failed to delete cover letter.", isLoading: false });
      console.error(error);
    }
  },

  selectCoverLetter: (coverLetter: CoverLetter | null) => {
    set({ selectedCoverLetter: coverLetter });
  },

  clearSelectedCoverLetter: () => {
    set({ selectedCoverLetter: null });
  },
}));
