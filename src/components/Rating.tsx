import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { colors, spacing } from "@/theme";
import { formatCount, formatRating } from "@/utils/format";

import { AppText } from "./AppText";

type Props = {
  value: number;
  count?: number;
  size?: "sm" | "md";
  /** Light text for use on top of images. */
  inverse?: boolean;
};

export function Rating({ value, count, size = "sm", inverse }: Props) {
  const isNew = value <= 0;
  return (
    <View
      style={styles.row}
      accessibilityLabel={isNew ? "No ratings yet" : `Rated ${value.toFixed(1)} out of 5`}
    >
      <Ionicons name={isNew ? "sparkles" : "star"} size={size === "sm" ? 13 : 16} color={colors.star} />
      <AppText
        variant={size === "sm" ? "captionStrong" : "calloutStrong"}
        style={{ color: inverse ? colors.white : colors.text }}
      >
        {formatRating(value)}
      </AppText>
      {count !== undefined && count > 0 && (
        <AppText variant="caption" style={{ color: inverse ? "rgba(255,255,255,0.8)" : colors.textSecondary }}>
          ({formatCount(count)})
        </AppText>
      )}
    </View>
  );
}

/** Row of five stars for review inputs / summaries. */
export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={value >= i ? "star" : value >= i - 0.5 ? "star-half" : "star-outline"}
          size={size}
          color={colors.star}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.xxs + 1 },
});
