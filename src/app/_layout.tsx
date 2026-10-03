import { Stack } from "expo-router";
import { DefaultTheme, ThemeProvider } from "expo-router/react-navigation";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { ToastProvider } from "@/components";
import { AuthProvider } from "@/context/AuthContext";
import { LibraryProvider } from "@/context/LibraryContext";
import SplashScreen from "@/screens/Splash/SplashScreen";
import { colors } from "@/theme";

export const unstable_settings = {
  // Ensures deep links into pushed screens still have the tabs underneath.
  anchor: "(tabs)",
};

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
  },
};

/**
 * Root navigator.
 *  (splash)     → animated overlay while the navigator resolves the first route
 *  onboarding   → first-run intro
 *  (auth)       → phone login + OTP
 *  (tabs)       → main app (Home, Explore, Create, Saved, Profile); redirects to
 *                 onboarding / login when signed out
 *  search, place/[id], creator/[id], settings, edit-profile → pushed screens
 */
export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const hideSplash = useCallback(() => setShowSplash(false), []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={navigationTheme}>
        <AuthProvider>
          <LibraryProvider>
            <ToastProvider>
              <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
                <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
                <Stack.Screen name="onboarding" options={{ animation: "fade" }} />
                <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
                <Stack.Screen name="search" options={{ animation: "fade_from_bottom" }} />
                <Stack.Screen name="place/[id]" />
                <Stack.Screen name="creator/[id]" />
                <Stack.Screen name="settings" />
                <Stack.Screen name="edit-profile" options={{ presentation: "modal" }} />
              </Stack>
              <StatusBar style="dark" />
              {showSplash && <SplashScreen onFinish={hideSplash} />}
            </ToastProvider>
          </LibraryProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
