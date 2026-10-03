import { Redirect, Stack } from "expo-router";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/theme";

export default function AuthLayout() {
  const { colors } = useTheme();
  const { isSignedIn } = useAuth();
  if (isSignedIn) return <Redirect href="/(tabs)" />;

  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.surface } }} />;
}
