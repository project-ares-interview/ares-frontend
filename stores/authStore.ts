import { Platform } from "react-native";
import { create } from "zustand";
import { storage } from "../utils/storage";

import { useInterviewSessionStore, useInterviewSettingsStore } from "./interviewStore";

interface User {
  id: number;
  email: string;
  name: string;
}

interface SocialSignUpData {
  email: string;
  name: string;
  provider: string;
  signed_data: string;
}

interface AuthState {
  user: User | null;
  access: string | null;
  refresh: string | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  socialSignUpData: SocialSignUpData | null;
  setTokens: (access: string | null, refresh?: string | null) => void;
  setUser: (user: User | null) => void;
  setSocialSignUpData: (data: SocialSignUpData | null) => void;
  setAuthLoading: (isLoading: boolean) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  access: null,
  refresh: null,
  isAuthenticated: false,
  isAuthLoading: true,
  socialSignUpData: null,
  setTokens: async (access, refresh) => {
    const stateUpdate: Partial<AuthState> = { access };
    if (refresh !== undefined) {
      stateUpdate.refresh = refresh;
    }
    set(stateUpdate);

    if (Platform.OS !== "web") {
      if (refresh) {
        await storage.setItem("refresh", refresh);
      } else if (refresh === null) {
        await storage.deleteItem("refresh");
      }
    }
  },
  setUser: (user) => set({ user }),
  setSocialSignUpData: (data) => set({ socialSignUpData: data }),
  setAuthLoading: (isLoading) => set({ isAuthLoading: isLoading }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  logout: async () => {
    if (Platform.OS !== "web") {
      await storage.deleteItem("refresh");
    }
    set({
      user: null,
      access: null,
      refresh: null,
      isAuthenticated: false,
      isAuthLoading: false,
      socialSignUpData: null,
    });
  },
}));
