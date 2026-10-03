import { Ionicons } from "@expo/vector-icons";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { makeStyles, radius, spacing, useTheme, type Colors } from "@/theme";
import type { IconName } from "@/types/models";

import { AppText } from "./AppText";

type Tone = "neutral" | "primary" | "accent" | "success" | "warning" | "glass";

const tones = (colors: Colors): Record<Tone, { bg: string; fg: string }> => ({
  neutral: { bg: colors.surfaceMuted, fg: colors.textSecondary },
  primary: { bg: colors.primarySoft, fg: colors.primary },
  accent: { bg: colors.accentSoft, fg: colors.accent },
  success: { bg: colors.successSoft, fg: colors.successText },
  warning: { bg: colors.warningSoft, fg: colors.warningText },
  glass: { bg: colors.glass, fg: colors.text },
});

type Props = {
  label: string;
  tone?: Tone;
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
};

/** Small non-interactive pill (category labels, status, badges). */
export function Tag({ label, tone = "neutral", icon, style }: Props) {
  const { colors } = useTheme();
  const styles = useStyles();
  const t = tones(colors)[tone];
  return (
    <View style={[styles.base, { backgroundColor: t.bg }, style]}>
      {icon && <Ionicons name={icon} size={12} color={t.fg} />}
      <AppText variant="label" style={{ color: t.fg }} numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  base: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
}));
