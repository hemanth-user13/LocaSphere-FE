import { Pressable, StyleSheet, View } from "react-native";

import { layout, spacing } from "@/theme";

import { AppText } from "./AppText";

type Props = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  inset?: boolean;
};

export function SectionHeader({ title, subtitle, actionLabel = "See all", onAction, inset = true }: Props) {
  return (
    <View style={[styles.row, inset && { paddingHorizontal: layout.screenPadding }]}>
      <View style={styles.text}>
        <AppText variant="h2" accessibilityRole="header">
          {title}
        </AppText>
        {subtitle && (
          <AppText variant="caption" color="textSecondary">
            {subtitle}
          </AppText>
        )}
      </View>
      {onAction && (
        <Pressable onPress={onAction} hitSlop={12} accessibilityRole="button">
          <AppText variant="calloutStrong" color="primary">
            {actionLabel}
          </AppText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  text: { flex: 1, gap: 2 },
});
