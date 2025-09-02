import { Stack } from "expo-router";
import { Suspense } from "react";
import { View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import Header from "@/components/ui/Header";
import "@/i18n";

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

          <Stack
            screenOptions={{
              headerShown: false,
              animation: "none",
            }}
          />
        </View>
      </SafeAreaProvider>
    </Suspense>
  );
}
