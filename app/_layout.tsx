import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { Suspense, useEffect } from "react";
import { View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { authService } from "../services/authService";
import { useAuthStore } from "../stores/authStore";

import Header from "@/components/ui/Header";
import "@/i18n";

SplashScreen.preventAutoHideAsync();

const AuthLayout = () => {
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    authService.initializeAuth();
  }, []);

  useEffect(() => {
    if (isAuthLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inProtectedGroup = segments[0] === "(protected)";

    if (isAuthenticated && inAuthGroup) {
      router.replace("/");
    } else if (!isAuthenticated && inProtectedGroup) {
      router.replace("/(auth)/sign-in");
    }

    SplashScreen.hideAsync();
  }, [isAuthenticated, isAuthLoading, segments, router]);

  return <Stack screenOptions={{ headerShown: false, animation: "none" }} />;
};

export default function RootLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Suspense fallback={null}>
      <SafeAreaProvider>
        <View
          style={{
            flex: 1,
            paddingBottom: insets.bottom,
          }}
        >
          <Header />
          <AuthLayout />
        </View>
      </SafeAreaProvider>
    </Suspense>
  );
}
