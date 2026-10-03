import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import { colors, radius, shadows, spacing } from "@/theme";
import type { IconName } from "@/types/models";

import { AppText } from "./AppText";

type Option<T extends string> = { value: T; label: string; icon?: IconName };

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  /** "pill" for compact toggles (Map/List), "tabs" for underline tabs (Profile). */
  variant?: "pill" | "tabs";
};

export function SegmentedControl<T extends string>({ options, value, onChange, variant = "pill" }: Props<T>) {
  if (variant === "tabs") {
    return (
      <View style={styles.tabs} accessibilityRole="tablist">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <Pressable
              key={o.value}
              onPress={() => onChange(o.value)}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              style={styles.tab}
            >
              <AppText variant="calloutStrong" color={active ? "text" : "textMuted"}>
                {o.label}
              </AppText>
              <View style={[styles.indicator, active && { backgroundColor: colors.primary }]} />
            </Pressable>
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.pill} accessibilityRole="tablist">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={[styles.segment, active && [styles.segmentActive, shadows.sm]]}
          >
            {o.icon && (
              <Ionicons name={o.icon} size={16} color={active ? colors.primary : colors.textSecondary} />
            )}
            <AppText variant="captionStrong" color={active ? "primary" : "textSecondary"}>
              {o.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    padding: 3,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  segment: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs + 2,
    height: 36,
    paddingHorizontal: spacing.md + 2,
    borderRadius: radius.sm + 1,
  },
  segmentActive: { backgroundColor: colors.surface },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: { flex: 1, alignItems: "center", paddingTop: spacing.md, gap: spacing.md, minHeight: 48 },
  indicator: { height: 2.5, alignSelf: "stretch", marginHorizontal: spacing.xl, borderRadius: 2 },
});
