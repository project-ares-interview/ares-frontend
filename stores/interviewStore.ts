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
  loadSettings: () => Promise<void>;
  setSettings: (settings: Partial<InterviewSettingsData>) => void;
  setAnalysisContext: (jd_context: string, resume_context: string) => void;
  clearSettings: () => void;
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
  loadSettings: async () => {
    try {
      const stored = await interviewStorage.getItem(INTERVIEW_SETTINGS_KEY);
      if (stored) {
        set(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load interview settings.", e);
    }
  },
  setSettings: (settings) => {
    set((state) => {
      const newState = { ...state, ...settings };
      const dataToStore: InterviewSettingsData = {
        name: newState.name,
        gender: newState.gender,
        company: newState.company,
        job_title: newState.job_title,
        interviewer_mode: newState.interviewer_mode,
        difficulty: newState.difficulty,
        department: newState.department,
        skills: newState.skills,
        certifications: newState.certifications,
        activities: newState.activities,
        jd_context: newState.jd_context,
        resume_context: newState.resume_context,
      };
      interviewStorage.setItem(INTERVIEW_SETTINGS_KEY, JSON.stringify(dataToStore));
      return settings;
    });
  },
  setAnalysisContext: (jd_context, resume_context) => {
    get().setSettings({ jd_context, resume_context });
  },
  clearSettings: () => {
    set(initialSettingsState);
    interviewStorage.removeItem(INTERVIEW_SETTINGS_KEY);
  },
}));

// --- Interview Session Store ---

interface InterviewSessionData {
  session_id: string | null;
  current_question: string | null;
  turn_label: string | null;
}

interface InterviewSessionState extends InterviewSessionData {
  loadSession: () => Promise<void>;
  startSession: (sessionData: Partial<InterviewSessionData>) => void;
  setNextQuestion: (question: string | null) => void;
  endSession: () => void;
  clearSession: () => void;
}

const initialSessionState: InterviewSessionData = {
  session_id: null,
  current_question: null,
  turn_label: null,
};

export const useInterviewSessionStore = create<InterviewSessionState>((set, get) => ({
  ...initialSessionState,
  loadSession: async () => {
    try {
      const stored = await interviewStorage.getItem(INTERVIEW_SESSION_KEY);
      if (stored) {
        set(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load interview session.", e);
    }
  },
  startSession: (sessionData) => {
    set((state) => {
      const newState = { ...state, ...sessionData };
      const dataToStore: InterviewSessionData = {
        session_id: newState.session_id,
        current_question: newState.current_question,
        turn_label: newState.turn_label,
      };
      interviewStorage.setItem(INTERVIEW_SESSION_KEY, JSON.stringify(dataToStore));
      return newState;
    });
  },
  setNextQuestion: (question) => {
    set((state) => {
      const newState = { ...state, current_question: question };
      interviewStorage.setItem(INTERVIEW_SESSION_KEY, JSON.stringify(newState));
      return { current_question: question };
    });
  },
  endSession: () => {
    set(initialSessionState);
    interviewStorage.removeItem(INTERVIEW_SESSION_KEY);
  },
  clearSession: () => {
    set(initialSessionState);
    interviewStorage.removeItem(INTERVIEW_SESSION_KEY);
  },
}));

// --- Initial Data Loading ---
useInterviewSettingsStore.getState().loadSettings();
useInterviewSessionStore.getState().loadSession();