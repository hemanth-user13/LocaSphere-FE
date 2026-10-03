import { Redirect, Stack } from "expo-router";

import { useAuth } from "@/context/AuthContext";
import { colors } from "@/theme";

export default function AuthLayout() {
  const { isSignedIn } = useAuth();
  if (isSignedIn) return <Redirect href="/(tabs)" />;

  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.surface } }} />;
}
