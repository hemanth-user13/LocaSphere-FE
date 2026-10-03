import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";

import { useLibrary } from "@/context/LibraryContext";
import { makeStyles, radius, shadows, useTheme } from "@/theme";
import type { ID } from "@/types/models";

type Props = {
  id: ID;
  /** "overlay" floats on an image; "inline" sits on a white surface. */
  variant?: "overlay" | "inline";
  size?: number;
};

export function SaveButton({ id, variant = "overlay", size = 36 }: Props) {
  const { colors } = useTheme();
  const styles = useStyles();
  const { isSaved, toggleSave } = useLibrary();
  const saved = isSaved(id);
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    <Pressable
      onPress={() => {
        scale.set(withSequence(withTiming(1.25, { duration: 120 }), withTiming(1, { duration: 160 })));
        toggleSave(id);
      }}
      hitSlop={(48 - size) / 2}
      accessibilityRole="button"
      accessibilityLabel={saved ? "Remove from saved" : "Save"}
      accessibilityState={{ selected: saved }}
      style={[
        styles.base,
        { width: size, height: size },
        variant === "overlay" ? [styles.overlay, shadows.sm] : styles.inline,
      ]}
    >
      <Animated.View style={animated}>
        <Ionicons
          name={saved ? "bookmark" : "bookmark-outline"}
          size={size * 0.5}
          color={saved ? colors.primary : colors.text}
        />
      </Animated.View>
    </Pressable>
  );
}

const useStyles = makeStyles((colors) => ({
  base: { borderRadius: radius.pill, alignItems: "center", justifyContent: "center" },
  overlay: { backgroundColor: colors.glass },
  inline: { backgroundColor: colors.surfaceMuted },
}));
