import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import { colors, radius, spacing } from "@/theme";
import type { Category, IconName } from "@/types/models";

import { AppText } from "./AppText";

type ChipProps = {
  label: string;
  icon?: IconName;
  selected?: boolean;
  onPress?: () => void;
};

/** Selectable filter pill. */
export function CategoryChip({ label, icon, selected, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.chipSelected : styles.chipIdle,
        pressed && { opacity: 0.8 },
      ]}
    >
      {icon && <Ionicons name={icon} size={16} color={selected ? colors.white : colors.textSecondary} />}
      <AppText variant="calloutStrong" style={{ color: selected ? colors.white : colors.text }}>
        {label}
      </AppText>
    </Pressable>
  );
}

type TileProps = {
  category: Pick<Category, "label" | "icon" | "tint">;
  onPress?: () => void;
};

/** Icon tile used in the Home category rail. */
export function CategoryTile({ category, onPress }: TileProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={category.label}
      style={({ pressed }) => [styles.tile, pressed && { opacity: 0.7 }]}
    >
      <View style={[styles.tileIcon, { backgroundColor: category.tint.bg }]}>
        <Ionicons name={category.icon} size={24} color={category.tint.fg} />
      </View>
      <AppText variant="label" color="text" numberOfLines={1}>
        {category.label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs + 2,
    height: 40,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  chipIdle: { backgroundColor: colors.surface, borderColor: colors.border },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  tile: { alignItems: "center", gap: spacing.sm, width: 68 },
  tileIcon: {
    width: 60,
    height: 60,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
});
