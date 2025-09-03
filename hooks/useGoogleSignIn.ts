import { useAuthRequest } from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "./useAuth";

export function useGoogleSignIn() {
  const router = useRouter();
  const { googleSignIn } = useAuth();

  const [request, response, promptAsync] = useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    const handleResponse = async () => {
      if (response?.type === "success") {
        try {
          const result = await googleSignIn({
            access_token: response.authentication!.accessToken,
          });
          if (result.newUser) {
            router.replace({ pathname: "/sign-up", params: { social: "true" } });
          } else {
            router.replace("/");
          }
        } catch (error) {
          console.error("Google sign in failed:", error);
        }
      }
    };

    handleResponse();
  }, [response, router]);

  const handleGoogleSignIn = async (accessToken: string) => {
    try {
      const result = await googleSignIn({
        access_token: accessToken,
      });
      if (result.newUser) {
        router.replace({ pathname: "/sign-up", params: { social: "true" } });
      } else {
        router.replace("/");
      }
    } catch (error) {
      console.error("Google sign in failed:", error);
    }
  };

  const promptMobileAsync = () => {
    promptAsync();
  };

  return {
    isReady: !!request,
    promptMobileAsync,
    handleGoogleSignIn,
  };
}
