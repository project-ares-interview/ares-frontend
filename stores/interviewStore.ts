import { Platform } from 'react-native';
import { create } from 'zustand';
import { storage as secureStorage } from '../utils/storage';

// --- Storage Abstraction ---
const INTERVIEW_SETTINGS_KEY = 'interview-settings';
const INTERVIEW_SESSION_KEY = 'interview-session';

const interviewStorage = {
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await secureStorage.setItem(key, value);
    }
  },
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await secureStorage.getItem(key);
  },
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await secureStorage.deleteItem(key);
    }
  },
};

// --- Interview Settings Store ---

interface InterviewSettingsData {
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
  jd_context?: string;
  resume_context?: string;
}

interface InterviewSettingsState extends InterviewSettingsData {
  actions: {
    load: () => Promise<void>;
    set: (settings: Partial<InterviewSettingsData>) => void;
    setAnalysisContext: (jd_context: string, resume_context: string) => void;
    clear: () => void;
  };
}

const initialSettingsState: InterviewSettingsData = {
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
  jd_context: '',
  resume_context: '',
};

export const useInterviewSettingsStore = create<InterviewSettingsState>((set, get) => ({
  ...initialSettingsState,
  actions: {
    load: async () => {
      try {
        const stored = await interviewStorage.getItem(INTERVIEW_SETTINGS_KEY);
        if (stored) set(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load interview settings.", e);
      }
    },
    set: (settings) => {
      set((state) => {
        const newState = { ...state, ...settings };
        interviewStorage.setItem(INTERVIEW_SETTINGS_KEY, JSON.stringify(newState));
        return newState;
      });
    },
    setAnalysisContext: (jd_context, resume_context) => {
      get().actions.set({ jd_context, resume_context });
    },
    clear: () => {
      set(initialSettingsState);
      interviewStorage.removeItem(INTERVIEW_SETTINGS_KEY);
    },
  },
}));

// --- Interview Session Store ---

interface InterviewSessionData {
  session_id: string | null;
  current_question: string | null;
  turn_label: string | null;
}

interface InterviewSessionState extends InterviewSessionData {
  actions: {
    load: () => Promise<void>;
    start: (sessionData: InterviewSessionData) => void;
    clear: () => void;
  };
}

const initialSessionState: InterviewSessionData = {
  session_id: null,
  current_question: null,
  turn_label: null,
};

export const useInterviewSessionStore = create<InterviewSessionState>((set) => ({
  ...initialSessionState,
  actions: {
    load: async () => {
      try {
        const stored = await interviewStorage.getItem(INTERVIEW_SESSION_KEY);
        if (stored) set(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load interview session.", e);
      }
    },
    start: (sessionData) => {
      set((state) => {
        const newState = { ...state, ...sessionData };
        interviewStorage.setItem(INTERVIEW_SESSION_KEY, JSON.stringify(newState));
        return newState;
      });
    },
    clear: () => {
      set(initialSessionState);
      interviewStorage.removeItem(INTERVIEW_SESSION_KEY);
    },
  },
}));

// --- Initial Data Loading ---
useInterviewSettingsStore.getState().actions.load();
useInterviewSessionStore.getState().actions.load();

// --- Hooks for easy access ---
export const useInterviewSettings = () => useInterviewSettingsStore((state) => state);
export const useInterviewSettingsActions = () => useInterviewSettingsStore((state) => state.actions);

export const useInterviewSession = () => useInterviewSessionStore((state) => state);
export const useInterviewSessionActions = () => useInterviewSessionStore((state) => state.actions);