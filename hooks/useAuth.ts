import { SignInSchema } from "@/schemas/auth";
import { useRouter } from "expo-router";
import { authService, type AuthResponse, type GoogleLoginPayload } from "../services/authService";
import { useAuthStore } from "../stores/authStore";
import { useInterviewStore } from "@/stores/interviewStore";

export function useAuth() {
  const router = useRouter();
  const {
    setTokens,
    setUser,
    setAuthenticated,
    setSocialSignUpData,
    logout: clearAuthStore,
  } = useAuthStore();

  const signIn = async (data: SignInSchema) => {
    const authData = await authService.signIn(data);
    if (authData) {
      useInterviewStore.getState().actions.clearInterviewSettings();
      setTokens(authData.access, authData.refresh);
      setUser(authData.user);
      setAuthenticated(true);
    }
  };

  const googleSignIn = async (data: GoogleLoginPayload) => {
    useInterviewStore.getState().actions.clearInterviewSettings();
    const response = await authService.googleLogin(data);
    if ("status" in response && response.status === "registration_required") {
      setSocialSignUpData({
        email: response.email,
        name: response.name,
        provider: "google",
        signed_data: response.signed_data,
      });
      return { newUser: true };
    }

    const authResponse = response as AuthResponse;
    setTokens(authResponse.access, authResponse.refresh);
    setUser(authResponse.user);
    setAuthenticated(true);
    return { newUser: false };
  };

  const logout = async () => {
    try {
      useInterviewStore.getState().actions.clearInterviewSettings();
      await authService.logout();
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      await clearAuthStore();
      router.replace("/");
    }
  };

  return { signIn, googleSignIn, logout };
}
