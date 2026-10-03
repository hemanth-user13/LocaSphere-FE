import { Ionicons } from "@expo/vector-icons";
import { Pressable, View, type StyleProp, type ViewStyle } from "react-native";

import { makeStyles, radius, shadows, useTheme, type Colors } from "@/theme";
import type { IconName } from "@/types/models";

type Variant = "surface" | "glass" | "soft" | "plain" | "primary";

type Props = {
  icon: IconName;
  onPress?: () => void;
  accessibilityLabel: string;
  variant?: Variant;
  size?: number;
  iconColor?: string;
  badge?: boolean;
  style?: StyleProp<ViewStyle>;
};

const background = (colors: Colors): Record<Variant, string> => ({
  surface: colors.surface,
  glass: colors.glass,
  soft: colors.primarySoft,
  plain: "transparent",
  primary: colors.primary,
});

/** Circular icon button with a guaranteed 44pt+ touch target. */
export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  variant = "surface",
  size = 44,
  iconColor,
  badge,
  style,
}: Props) {
  const { colors } = useTheme();
  const styles = useStyles();
  const fg =
    iconColor ?? (variant === "primary" ? colors.white : variant === "soft" ? colors.primary : colors.text);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={size < 44 ? (44 - size) / 2 : 0}
      style={({ pressed }) => [
        styles.base,
        {
          width: size,
          height: size,
          backgroundColor: background(colors)[variant],
          opacity: pressed ? 0.75 : 1,
        },
        variant === "surface" && styles.bordered,
        variant === "glass" && shadows.sm,
        style,
      ]}
    >
      <Ionicons name={icon} size={Math.round(size * 0.45)} color={fg} />
      {badge && <View style={styles.badge} />}
    </Pressable>
  );
}

const useStyles = makeStyles((colors) => ({
  base: {
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  bordered: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
}));
