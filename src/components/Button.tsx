import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { makeStyles, radius, spacing, typography, useTheme, type Colors } from "@/theme";
import type { IconName } from "@/types/models";

import { AppText } from "./AppText";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "lg" | "md" | "sm";

export type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  iconRight?: IconName;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

const variants = (colors: Colors): Record<Variant, { bg: string; pressed: string; fg: string; border?: string }> => ({
  primary: { bg: colors.primary, pressed: colors.primaryDark, fg: colors.textOnPrimary },
  secondary: { bg: colors.primarySoft, pressed: colors.primaryMuted, fg: colors.primary },
  outline: { bg: colors.surface, pressed: colors.surfaceMuted, fg: colors.text, border: colors.border },
  ghost: { bg: "transparent", pressed: colors.surfaceMuted, fg: colors.primary },
  danger: { bg: colors.errorSoft, pressed: colors.errorMuted, fg: colors.error },
});

const SIZES: Record<Size, { height: number; px: number; icon: number; text: keyof typeof typography }> = {
  lg: { height: 54, px: spacing.xl, icon: 20, text: "bodyStrong" },
  md: { height: 46, px: spacing.lg, icon: 18, text: "calloutStrong" },
  sm: { height: 36, px: spacing.md, icon: 16, text: "captionStrong" },
};

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "lg",
  icon,
  iconRight,
  loading,
  disabled,
  fullWidth = true,
  style,
  accessibilityLabel,
}: ButtonProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const v = variants(colors)[variant];
  const s = SIZES[size];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      hitSlop={size === "sm" ? 6 : 0}
      style={({ pressed }) => [
        styles.base,
        {
          height: s.height,
          paddingHorizontal: s.px,
          backgroundColor: pressed ? v.pressed : v.bg,
          borderColor: v.border ?? "transparent",
          borderWidth: v.border ? StyleSheet.hairlineWidth * 2 : 0,
          alignSelf: fullWidth ? "stretch" : "flex-start",
          opacity: disabled && !loading ? 0.45 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <View style={styles.content}>
          {icon && <Ionicons name={icon} size={s.icon} color={v.fg} />}
          <AppText variant={s.text} style={{ color: v.fg }} numberOfLines={1}>
            {title}
          </AppText>
          {iconRight && <Ionicons name={iconRight} size={s.icon} color={v.fg} />}
        </View>
      )}
    </Pressable>
  );
}

const useStyles = makeStyles((colors) => ({
  base: {
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
}));
