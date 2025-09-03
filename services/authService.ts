import { Platform } from "react-native";
import { type SignInSchema } from "../schemas/auth";
import { useAuthStore } from "../stores/authStore";
import { storage } from "../utils/storage";
import api from "./api";

export interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

interface SignUpPayload {
  email: string;
  password?: string;
  name: string;
  gender: string;
  birth: string;
  phone_number: string;
}

export interface GoogleLoginPayload {
  access_token: string;
}

interface SocialSignUpPayload {
  email: string;
  name: string;
  gender: string;
  birth: string;
  phone_number: string;
  signed_data: string;
}

export const authService = {
  signUp: async (data: SignUpPayload) => {
    const response = await api.post<AuthResponse>("/auth/registration/", data);
    const { access, refresh, user } = response.data;
    useAuthStore.getState().setTokens(access, refresh);
    useAuthStore.getState().setUser(user);
    return response.data;
  },

  socialSignUp: async (provider: string, data: SocialSignUpPayload) => {
    const response = await api.post<AuthResponse>(
      `/auth/${provider}/register/`,
      data,
    );
    const { access, refresh, user } = response.data;
    useAuthStore.getState().setTokens(access, refresh);
    useAuthStore.getState().setUser(user);
    return response.data;
  },

  signIn: async (data: SignInSchema) => {
    const response = await api.post<AuthResponse>("/auth/login/", data);
    return response.data;
  },

  googleLogin: async (data: GoogleLoginPayload) => {
    const response = await api.post<
      | AuthResponse
      | {
          status: string;
          email: string;
          name: string;
          signed_data: string;
        }
    >("/auth/google/", data);
    return response.data;
  },

  logout: async () => {
    // This will be called by the useAuth hook.
    // It's responsible for invalidating the token on the server side.
    await api.post("/auth/logout/");
  },

  initializeAuth: async () => {
    const { setAuthLoading, setUser, setAuthenticated, logout } =
      useAuthStore.getState();

    setAuthLoading(true);
    try {
      // On web, the presence of an HttpOnly cookie is our signal for a valid session.
      // We can't check for it directly, so we proceed to fetch the user.
      // On mobile, we check for a token in SecureStore.
      const hasSession =
        Platform.OS === "web" || !!(await storage.getItem("refresh"));

      if (hasSession) {
        const response = await api.get("/auth/user/");
        setUser(response.data);
        setAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth initialization failed:", error);
      // The axios interceptor will handle token refresh, if it fails, it will logout.
      // If the initial user fetch fails (e.g., invalid cookie), we should also logout.
      await logout();
    } finally {
      setAuthLoading(false);
    }
  },

  getUser: async () => {
    const response = await api.get("/user/");
    useAuthStore.getState().setUser(response.data);
    return response.data;
  },
};
