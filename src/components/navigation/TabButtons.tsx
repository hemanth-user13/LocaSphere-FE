import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarButtonProps } from "expo-router/js-tabs";
import { PlatformPressable } from "expo-router/react-navigation";
import { Pressable, View } from "react-native";

import { makeStyles, shadows, useTheme } from "@/theme";
import { haptics } from "@/utils/haptics";

/** Standard tab with a light haptic tap on iOS. */
export function TabButton(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        haptics.selection();
        props.onPressIn?.(ev);
      }}
    />
  );
}

/** Prominent centre "Create" action. */
export function CreateTabButton({ onPress, accessibilityState, style }: BottomTabBarButtonProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const focused = !!accessibilityState?.selected;
  return (
    <View style={[style, styles.wrap]}>
      <Pressable
        onPress={(e) => {
          haptics.light();
          onPress?.(e);
        }}
        accessibilityRole="button"
        accessibilityLabel="Create a post"
        accessibilityState={accessibilityState}
        style={({ pressed }) => [
          styles.button,
          shadows.primary,
          focused && { backgroundColor: colors.primaryDark },
          pressed && { transform: [{ scale: 0.94 }] },
        ]}
      >
        <Ionicons name="add" size={28} color={colors.white} />
      </Pressable>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  wrap: { alignItems: "center", justifyContent: "center" },
  button: {
    marginTop: -16,
    width: 50,
    height: 50,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
}));
