import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { colors, radius, spacing } from "@/theme";
import type { IconName } from "@/types/models";

import { AppText } from "./AppText";

type Tone = "neutral" | "primary" | "accent" | "success" | "warning" | "glass";

const TONES: Record<Tone, { bg: string; fg: string }> = {
  neutral: { bg: colors.surfaceMuted, fg: colors.textSecondary },
  primary: { bg: colors.primarySoft, fg: colors.primary },
  accent: { bg: colors.accentSoft, fg: colors.accent },
  success: { bg: colors.successSoft, fg: "#047857" },
  warning: { bg: colors.warningSoft, fg: "#B45309" },
  glass: { bg: colors.glass, fg: colors.text },
};

type Props = {
  label: string;
  tone?: Tone;
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
};

/** Small non-interactive pill (category labels, status, badges). */
export function Tag({ label, tone = "neutral", icon, style }: Props) {
  const t = TONES[tone];
  return (
    <View style={[styles.base, { backgroundColor: t.bg }, style]}>
      {icon && <Ionicons name={icon} size={12} color={t.fg} />}
      <AppText variant="label" style={{ color: t.fg }} numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
});
