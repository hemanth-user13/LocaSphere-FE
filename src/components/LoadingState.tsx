import { useEffect } from "react";
import { StyleSheet, View, type DimensionValue, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { colors, layout, radius, spacing } from "@/theme";

type SkeletonProps = {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

/** Pulsing placeholder block. */
export function Skeleton({ width = "100%", height = 14, radius: r = radius.sm, style }: SkeletonProps) {
  const opacity = useSharedValue(0.55);
  useEffect(() => {
    opacity.set(withRepeat(withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }), -1, true));
  }, [opacity]);
  const animated = useAnimatedStyle(() => ({ opacity: opacity.get() }));

  return (
    <Animated.View
      style={[{ width, height, borderRadius: r, backgroundColor: colors.skeleton }, animated, style]}
    />
  );
}

export function PlaceCardSkeleton({ variant = "feature" }: { variant?: "feature" | "row" | "full" }) {
  if (variant === "row") {
    return (
      <View style={[styles.card, styles.rowCard]}>
        <Skeleton width={96} height={96} radius={radius.md} />
        <View style={styles.rowBody}>
          <Skeleton width="40%" height={10} />
          <Skeleton width="85%" height={16} />
          <Skeleton width="60%" height={12} />
        </View>
      </View>
    );
  }
  const imageHeight = variant === "full" ? 200 : 160;
  return (
    <View style={[styles.card, variant === "feature" && { width: 280 }]}>
      <Skeleton height={imageHeight} radius={0} />
      <View style={styles.body}>
        <Skeleton width="35%" height={10} />
        <Skeleton width="80%" height={16} />
        <Skeleton width="95%" height={12} />
      </View>
    </View>
  );
}

/** Generic list skeleton used while a screen's first page loads. */
export function LoadingState({ variant = "full", count = 3 }: { variant?: "feature" | "row" | "full"; count?: number }) {
  return (
    <View
      accessibilityLabel="Loading"
      style={[
        variant === "feature" ? styles.horizontal : styles.vertical,
        { paddingHorizontal: layout.screenPadding },
      ]}
    >
      {Array.from({ length: count }, (_, i) => (
        <PlaceCardSkeleton key={i} variant={variant} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    overflow: "hidden",
  },
  body: { padding: spacing.md, gap: spacing.sm },
  rowCard: { flexDirection: "row", padding: spacing.sm + 2, gap: spacing.md },
  rowBody: { flex: 1, justifyContent: "center", gap: spacing.sm },
  horizontal: { flexDirection: "row", gap: spacing.md, overflow: "hidden" },
  vertical: { gap: spacing.md },
});
