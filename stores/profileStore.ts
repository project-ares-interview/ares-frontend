import { create } from "zustand";
import {
  Career,
  careerApi,
  Disability,
  disabilityApi,
  Education,
  educationApi,
  JobInterest,
  jobInterestApi,
  MilitaryService,
  militaryServiceApi,
  Patriot,
  patriotApi,
} from "../services/profileService";

interface ProfileState {
  militaryService: MilitaryService | null;
  patriot: Patriot | null;
  disabilities: Disability[];
  educations: Education[];
  careers: Career[];
  jobInterests: JobInterest[];
  loading: boolean;
  error: unknown | null;

  // --- Military Service ---
  fetchMilitaryService: () => Promise<void>;
  createMilitaryService: (
    data: Omit<MilitaryService, "id">,
  ) => Promise<MilitaryService | void>;
  updateMilitaryService: (
    id: number,
    data: Partial<Omit<MilitaryService, "id">>,
  ) => Promise<MilitaryService | void>;
  deleteMilitaryService: (id: number) => Promise<void>;

  // --- Patriot ---
  fetchPatriot: () => Promise<void>;
  createPatriot: (data: Omit<Patriot, "id">) => Promise<Patriot | void>;
  updatePatriot: (
    id: number,
    data: Partial<Omit<Patriot, "id">>,
  ) => Promise<Patriot | void>;
  deletePatriot: (id: number) => Promise<void>;

  // --- Disabilities ---
  fetchDisabilities: () => Promise<void>;
  createDisability: (
    data: Omit<Disability, "id">,
  ) => Promise<Disability | void>;
  updateDisability: (
    id: number,
    data: Partial<Omit<Disability, "id">>,
  ) => Promise<Disability | void>;
  deleteDisability: (id: number) => Promise<void>;

  // --- Educations ---
  fetchEducations: () => Promise<void>;
  createEducation: (data: Omit<Education, "id">) => Promise<Education | void>;
  updateEducation: (
    id: number,
    data: Partial<Omit<Education, "id">>,
  ) => Promise<Education | void>;
  deleteEducation: (id: number) => Promise<void>;

  // --- Careers ---
  fetchCareers: () => Promise<void>;
  createCareer: (data: Omit<Career, "id">) => Promise<Career | void>;
  updateCareer: (
    id: number,
    data: Partial<Omit<Career, "id">>,
  ) => Promise<Career | void>;
  deleteCareer: (id: number) => Promise<void>;

  // --- Job Interests ---
  fetchJobInterests: () => Promise<void>;
  createJobInterest: (
    data: Omit<JobInterest, "id">,
  ) => Promise<JobInterest | void>;
  updateJobInterest: (
    id: number,
    data: Partial<Omit<JobInterest, "id">>,
  ) => Promise<JobInterest | void>;
  deleteJobInterest: (id: number) => Promise<void>;

  // --- Utility ---
  fetchAllProfileData: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  militaryService: null,
  patriot: null,
  disabilities: [],
  educations: [],
  careers: [],
  jobInterests: [],
  loading: false,
  error: null,

  // --- Military Service ---
  fetchMilitaryService: async () => {
    try {
      set({ loading: true, error: null });
      const data = await militaryServiceApi.getAll();
      set({ militaryService: data[0] || null, loading: false });
    } catch (error) {
      set({ error, loading: false, militaryService: null });
    }
  },
  createMilitaryService: async (data) => {
    try {
      set({ loading: true, error: null });
      const newData = await militaryServiceApi.create(data);
      set({ militaryService: newData, loading: false });
      return newData;
    } catch (error) {
      set({ error, loading: false });
    }
  },
  updateMilitaryService: async (id, data) => {
    try {
      set({ loading: true, error: null });
      const updatedData = await militaryServiceApi.update(id, data);
      set({ militaryService: updatedData, loading: false });
      return updatedData;
    } catch (error) {
      set({ error, loading: false });
    }
  },
  deleteMilitaryService: async (id) => {
    try {
      set({ loading: true, error: null });
      await militaryServiceApi.delete(id);
      set({ militaryService: null, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },

  // --- Patriot ---
  fetchPatriot: async () => {
    try {
      set({ loading: true, error: null });
      const data = await patriotApi.getAll();
      set({ patriot: data[0] || null, loading: false });
    } catch (error) {
      set({ error, loading: false, patriot: null });
    }
  },
  createPatriot: async (data) => {
    try {
      set({ loading: true, error: null });
      const newData = await patriotApi.create(data);
      set({ patriot: newData, loading: false });
      return newData;
    } catch (error) {
      set({ error, loading: false });
    }
  },
  updatePatriot: async (id, data) => {
    try {
      set({ loading: true, error: null });
      const updatedData = await patriotApi.update(id, data);
      set({ patriot: updatedData, loading: false });
      return updatedData;
    } catch (error) {
      set({ error, loading: false });
    }
  },
  deletePatriot: async (id) => {
    try {
      set({ loading: true, error: null });
      await patriotApi.delete(id);
      set({ patriot: null, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },

  // --- Disabilities ---
  fetchDisabilities: async () => {
    try {
      set({ loading: true, error: null });
      const data = await disabilityApi.getAll();
      set({ disabilities: data, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },
  createDisability: async (data) => {
    try {
      set({ loading: true, error: null });
      const newData = await disabilityApi.create(data);
      set((state) => ({
        disabilities: [...state.disabilities, newData],
        loading: false,
      }));
      return newData;
    } catch (error) {
      set({ error, loading: false });
    }
  },
  updateDisability: async (id, data) => {
    try {
      set({ loading: true, error: null });
      const updatedData = await disabilityApi.update(id, data);
      set((state) => ({
        disabilities: state.disabilities.map((d) =>
          d.id === id ? updatedData : d,
        ),
        loading: false,
      }));
      return updatedData;
    } catch (error) {
      set({ error, loading: false });
    }
  },
  deleteDisability: async (id) => {
    try {
      set({ loading: true, error: null });
      await disabilityApi.delete(id);
      set((state) => ({
        disabilities: state.disabilities.filter((d) => d.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error, loading: false });
    }
  },

  // --- Educations ---
  fetchEducations: async () => {
    try {
      set({ loading: true, error: null });
      const data = await educationApi.getAll();
      set({ educations: data, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },
  createEducation: async (data) => {
    try {
      set({ loading: true, error: null });
      const newData = await educationApi.create(data);
      set((state) => ({
        educations: [...state.educations, newData],
        loading: false,
      }));
      return newData;
    } catch (error) {
      set({ error, loading: false });
    }
  },
  updateEducation: async (id, data) => {
    try {
      set({ loading: true, error: null });
      const updatedData = await educationApi.update(id, data);
      set((state) => ({
        educations: state.educations.map((e) => (e.id === id ? updatedData : e)),
        loading: false,
      }));
      return updatedData;
    } catch (error) {
      set({ error, loading: false });
    }
  },
  deleteEducation: async (id) => {
    try {
      set({ loading: true, error: null });
      await educationApi.delete(id);
      set((state) => ({
        educations: state.educations.filter((e) => e.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error, loading: false });
    }
  },

  // --- Careers ---
  fetchCareers: async () => {
    try {
      set({ loading: true, error: null });
      const data = await careerApi.getAll();
      set({ careers: data, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },
  createCareer: async (data) => {
    try {
      set({ loading: true, error: null });
      const newData = await careerApi.create(data);
      set((state) => ({ careers: [...state.careers, newData], loading: false }));
      return newData;
    } catch (error) {
      set({ error, loading: false });
    }
  },
  updateCareer: async (id, data) => {
    try {
      set({ loading: true, error: null });
      const updatedData = await careerApi.update(id, data);
      set((state) => ({
        careers: state.careers.map((c) => (c.id === id ? updatedData : c)),
        loading: false,
      }));
      return updatedData;
    } catch (error) {
      set({ error, loading: false });
    }
  },
  deleteCareer: async (id) => {
    try {
      set({ loading: true, error: null });
      await careerApi.delete(id);
      set((state) => ({
        careers: state.careers.filter((c) => c.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error, loading: false });
    }
  },

  // --- Job Interests ---
  fetchJobInterests: async () => {
    try {
      set({ loading: true, error: null });
      const data = await jobInterestApi.getAll();
      set({ jobInterests: data, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },
  createJobInterest: async (data) => {
    try {
      set({ loading: true, error: null });
      const newData = await jobInterestApi.create(data);
      set((state) => ({
        jobInterests: [...state.jobInterests, newData],
        loading: false,
      }));
      return newData;
    } catch (error) {
      set({ error, loading: false });
    }
  },
  updateJobInterest: async (id, data) => {
    try {
      set({ loading: true, error: null });
      const updatedData = await jobInterestApi.update(id, data);
      set((state) => ({
        jobInterests: state.jobInterests.map((j) =>
          j.id === id ? updatedData : j,
        ),
        loading: false,
      }));
      return updatedData;
    } catch (error) {
      set({ error, loading: false });
    }
  },
  deleteJobInterest: async (id) => {
    try {
      set({ loading: true, error: null });
      await jobInterestApi.delete(id);
      set((state) => ({
        jobInterests: state.jobInterests.filter((j) => j.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error, loading: false });
    }
  },

  // --- Utility ---
  fetchAllProfileData: async () => {
    set({ loading: true, error: null });
    try {
      await Promise.all([
        get().fetchMilitaryService(),
        get().fetchPatriot(),
        get().fetchDisabilities(),
        get().fetchEducations(),
        get().fetchCareers(),
        get().fetchJobInterests(),
      ]);
    } catch (error) {
      set({ error });
    } finally {
      set({ loading: false });
    }
  },
}));
