import * as AuthSession from "expo-auth-session";
import { useAuthRequest } from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { Platform } from "react-native";
import { useAuth } from "./useAuth";

WebBrowser.maybeCompleteAuthSession();

export function useGoogleSignIn() {
  const router = useRouter();
  const { googleSignIn } = useAuth();

  const [request, response, promptAsync] = useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    ...(Platform.OS !== "web" && {
      redirectUri: AuthSession.makeRedirectUri({
        scheme: "app",
        path: "sign-in",
      }),
    }),
  });

  useEffect(() => {
    const handleResponse = async () => {
      if (response?.type === "success") {
        try {
          const result = await googleSignIn({
            access_token: response.authentication!.accessToken,
          });
          if (result.newUser) {
            router.replace({
              pathname: "/sign-up",
              params: { social: "true" },
            });
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

  return {
    isReady: !!request,
    promptAsync,
  };
}
