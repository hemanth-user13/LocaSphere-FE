import { Stack } from "expo-router";
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from "expo-router/react-navigation";
import { StatusBar } from "expo-status-bar";
import { useCallback, useMemo, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { ToastProvider } from "@/components";
import { AuthProvider } from "@/context/AuthContext";
import { LibraryProvider } from "@/context/LibraryContext";
import SplashScreen from "@/screens/Splash/SplashScreen";
import { ThemeProvider, useTheme } from "@/theme";

export const unstable_settings = {
  // Ensures deep links into pushed screens still have the tabs underneath.
  anchor: "(tabs)",
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
function RootNavigator() {
  const { colors, isDark } = useTheme();
  const [showSplash, setShowSplash] = useState(true);
  const hideSplash = useCallback(() => setShowSplash(false), []);

  // Navigation chrome (screen backgrounds, transitions) follows the active scheme.
  const navigationTheme = useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
      },
    };
  }, [colors, isDark]);

  return (
    <NavigationThemeProvider value={navigationTheme}>
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
      <StatusBar style={isDark ? "light" : "dark"} />
      {showSplash && <SplashScreen onFinish={hideSplash} />}
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <LibraryProvider>
            <ToastProvider>
              <RootNavigator />
            </ToastProvider>
          </LibraryProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
