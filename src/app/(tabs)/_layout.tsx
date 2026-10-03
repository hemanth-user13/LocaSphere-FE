import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import type { ColorValue } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CreateTabButton, TabButton } from "@/components/navigation/TabButtons";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/theme";
import type { IconName } from "@/types/models";

type TabIconProps = { name: IconName; active: IconName; color: ColorValue; focused: boolean };

function TabIcon({ name, active, color, focused }: TabIconProps) {
  return <Ionicons name={focused ? active : name} size={24} color={color as string} />;
}

const icon = (name: IconName, active: IconName) =>
  function TabBarIcon({ color, focused }: { color: ColorValue; focused: boolean }) {
    return <TabIcon name={name} active={active} color={color} focused={focused} />;
  };

/** Main tab navigator: Home · Explore · Create · Saved · Profile. */
export default function TabLayout() {
  const { colors } = useTheme();
  const { isSignedIn, hasOnboarded } = useAuth();
  const insets = useSafeAreaInsets();

  if (!isSignedIn) return <Redirect href={hasOnboarded ? "/login" : "/onboarding"} />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: TabButton,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          // Let the navigator add the safe-area inset; we only add breathing room.
          height: 64 + insets.bottom,
          paddingTop: 8,
        },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: icon("home-outline", "home") }} />
      <Tabs.Screen name="explore" options={{ title: "Explore", tabBarIcon: icon("compass-outline", "compass") }} />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarButton: CreateTabButton,
          tabBarAccessibilityLabel: "Create a post",
        }}
      />
      <Tabs.Screen name="saved" options={{ title: "Saved", tabBarIcon: icon("bookmark-outline", "bookmark") }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: icon("person-outline", "person") }} />
    </Tabs>
  );
}
