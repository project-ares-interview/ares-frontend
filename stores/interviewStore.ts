import { Platform } from 'react-native';
import { create } from 'zustand';
import { storage as secureStorage } from '../utils/storage';

const INTERVIEW_STORAGE_KEY = 'interview-storage';

const interviewStorage = {
  async setItem(value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(INTERVIEW_STORAGE_KEY, value);
    } else {
      await secureStorage.setItem(INTERVIEW_STORAGE_KEY, value);
    }
  },
  async getItem(): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(INTERVIEW_STORAGE_KEY);
    }
    return await secureStorage.getItem(INTERVIEW_STORAGE_KEY);
  },
  async removeItem(): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(INTERVIEW_STORAGE_KEY);
    } else {
      await secureStorage.deleteItem(INTERVIEW_STORAGE_KEY);
    }
  },
};

interface InterviewStateData {
  name: string;
  gender: 'male' | 'female' | null;
  company: string;
  job_title: string;
  interviewer_mode: 'team_lead' | 'executive' | null;
  difficulty: 'normal' | 'hard' | null;
  department?: string;
  skills?: string;
  certifications?: string;
  activities?: string;
}

interface InterviewState extends InterviewStateData {
  actions: {
    loadInterviewSettings: () => Promise<void>;
    setInterviewSettings: (settings: InterviewStateData) => void;
    clearInterviewSettings: () => void;
  };
}

const initialState: InterviewStateData = {
  name: '',
  gender: null,
  company: '',
  job_title: '',
  interviewer_mode: null,
  difficulty: null,
  department: '',
  skills: '',
  certifications: '',
  activities: '',
};

export const useInterviewStore = create<InterviewState>((set, get) => ({
  ...initialState,
  actions: {
    loadInterviewSettings: async () => {
      try {
        const storedSettings = await interviewStorage.getItem();
        if (storedSettings) {
          set(JSON.parse(storedSettings));
        }
      } catch (e) {
        console.error("Failed to load interview settings.", e);
      }
    },
    setInterviewSettings: (settings) => {
      set(settings);
      interviewStorage.setItem(JSON.stringify(settings));
    },
    clearInterviewSettings: () => {
      set(initialState);
      interviewStorage.removeItem();
    },
  },
}));

// 초기 로딩 시 데이터를 불러옵니다.
useInterviewStore.getState().actions.loadInterviewSettings();

export const useInterviewSettings = () => useInterviewStore((state) => state);
export const useInterviewActions = () => useInterviewStore((state) => state.actions);
