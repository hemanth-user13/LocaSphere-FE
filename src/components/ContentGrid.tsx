import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, View, useWindowDimensions } from "react-native";

import { colors, layout, radius, spacing } from "@/theme";
import type { ContentItem } from "@/types/models";
import { formatCount } from "@/utils/format";

import { AppText } from "./AppText";
import { openContent } from "./PlaceCard";

/** Two-column photo grid for profile posts. */
export function ContentGrid({ items }: { items: ContentItem[] }) {
  const { width } = useWindowDimensions();
  const tile = (Math.min(width, layout.maxContentWidth) - layout.screenPadding * 2 - spacing.md) / 2;

  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <Pressable
          key={item.id}
          onPress={() => openContent(item.id)}
          accessibilityRole="button"
          accessibilityLabel={item.title}
          style={({ pressed }) => [{ width: tile }, pressed && { opacity: 0.85 }]}
        >
          <Image
            source={{ uri: item.coverImage }}
            style={[styles.image, { height: tile * 1.15 }]}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.stat}>
            <Ionicons name="heart" size={11} color={colors.white} />
            <AppText variant="label" style={{ color: colors.white }}>
              {formatCount(item.likeCount)}
            </AppText>
          </View>
          <AppText variant="captionStrong" numberOfLines={1} style={styles.title}>
            {item.title}
          </AppText>
          <AppText variant="caption" color="textSecondary" numberOfLines={1}>
            {item.area}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    paddingHorizontal: layout.screenPadding,
  },
  image: { borderRadius: radius.md, backgroundColor: colors.surfaceMuted },
  stat: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.scrim,
  },
  title: { marginTop: spacing.sm },
});
