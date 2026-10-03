import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { memo } from "react";
import { Pressable, View } from "react-native";

import { getCategory } from "@/data/categories";
import { makeStyles, radius, spacing, useTheme } from "@/theme";
import type { ContentItem } from "@/types/models";
import { containerButtonRole } from "@/utils/a11y";
import { formatDistance, formatEventDate } from "@/utils/format";

import { AppText } from "./AppText";
import { Rating } from "./Rating";
import { SaveButton } from "./SaveButton";
import { Tag } from "./Tag";

export type PlaceCardVariant = "feature" | "full" | "row";

type Props = {
  item: ContentItem;
  variant?: PlaceCardVariant;
  onPress?: (item: ContentItem) => void;
  /** Optional rank badge, e.g. for "Trending nearby". */
  rank?: number;
  /** Hide the save button (e.g. for unpublished previews). */
  showSave?: boolean;
};

export const openContent = (id: string) => router.push({ pathname: "/place/[id]", params: { id } });

function KindBadge({ item }: { item: ContentItem }) {
  if (item.kind === "event" && item.startsAt) {
    return <Tag label={formatEventDate(item.startsAt)} icon="calendar" tone="glass" />;
  }
  if (item.kind === "post") return <Tag label="Community pick" icon="people" tone="glass" />;
  return null;
}

function Meta({ item }: { item: ContentItem }) {
  const { colors } = useTheme();
  const styles = useStyles();
  const category = getCategory(item.categoryId);
  return (
    <View style={styles.metaRow}>
      <Ionicons name={category.icon} size={13} color={colors.textSecondary} />
      <AppText variant="caption" color="textSecondary" numberOfLines={1} style={styles.shrink}>
        {category.label} · {item.area}
      </AppText>
    </View>
  );
}

function Stats({ item, compact }: { item: ContentItem; compact?: boolean }) {
  const { colors } = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.metaRow}>
      <Rating value={item.rating} count={compact ? undefined : item.reviewCount} />
      <View style={styles.dot} />
      <Ionicons name="navigate" size={12} color={colors.textSecondary} />
      <AppText variant="caption" color="textSecondary" numberOfLines={1}>
        {formatDistance(item.distanceKm)}
      </AppText>
      {item.isOpenNow !== undefined && (
        <>
          <View style={styles.dot} />
          <AppText variant="captionStrong" style={{ color: item.isOpenNow ? colors.success : colors.textMuted }}>
            {item.isOpenNow ? "Open" : "Closed"}
          </AppText>
        </>
      )}
    </View>
  );
}

function PlaceCardBase({ item, variant = "feature", onPress, rank, showSave = true }: Props) {
  const { colors } = useTheme();
  const styles = useStyles();
  const handlePress = () => (onPress ? onPress(item) : openContent(item.id));
  const a11yLabel = `${item.title}, ${getCategory(item.categoryId).label} in ${item.area}, ${formatDistance(item.distanceKm)} away`;

  if (variant === "row") {
    return (
      <Pressable
        onPress={handlePress}
        accessibilityRole={containerButtonRole}
        accessibilityLabel={a11yLabel}
        style={({ pressed }) => [styles.card, styles.rowCard, pressed && styles.pressed]}
      >
        <View>
          <Image source={{ uri: item.coverImage }} style={styles.rowImage} contentFit="cover" transition={200} />
          {rank !== undefined && (
            <View style={styles.rank}>
              <AppText variant="label" style={{ color: colors.white }}>
                #{rank}
              </AppText>
            </View>
          )}
        </View>
        <View style={styles.rowBody}>
          <Meta item={item} />
          <AppText variant="h3" numberOfLines={2}>
            {item.title}
          </AppText>
          <Stats item={item} compact />
        </View>
        {showSave && <SaveButton id={item.id} variant="inline" size={36} />}
      </Pressable>
    );
  }

  const isFeature = variant === "feature";
  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole={containerButtonRole}
      accessibilityLabel={a11yLabel}
      style={({ pressed }) => [styles.card, isFeature && styles.featureCard, pressed && styles.pressed]}
    >
      <View>
        <Image
          source={{ uri: item.coverImage }}
          style={{ height: isFeature ? 168 : 196, backgroundColor: colors.surfaceMuted }}
          contentFit="cover"
          transition={200}
          recyclingKey={item.id}
        />
        <View style={styles.overlayTop}>
          <KindBadge item={item} />
          <View style={styles.flex} />
          {showSave && <SaveButton id={item.id} />}
        </View>
      </View>
      <View style={styles.body}>
        <Meta item={item} />
        <AppText variant="h3" numberOfLines={1}>
          {item.title}
        </AppText>
        <AppText variant="callout" color="textSecondary" numberOfLines={2}>
          {item.description}
        </AppText>
        <View style={{ marginTop: spacing.xs }}>
          <Stats item={item} />
        </View>
      </View>
    </Pressable>
  );
}

export const PlaceCard = memo(PlaceCardBase);

const useStyles = makeStyles((colors) => ({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    overflow: "hidden",
  },
  featureCard: { width: 280 },
  pressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  overlayTop: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    flexDirection: "row",
    alignItems: "center",
  },
  flex: { flex: 1 },
  shrink: { flexShrink: 1 },
  body: { padding: spacing.md + 2, gap: spacing.xs },
  metaRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.textMuted, marginHorizontal: 2 },
  rowCard: { flexDirection: "row", alignItems: "center", padding: spacing.sm + 2, gap: spacing.md },
  rowImage: { width: 92, height: 92, borderRadius: radius.md, backgroundColor: colors.surfaceMuted },
  rowBody: { flex: 1, gap: spacing.xs },
  rank: {
    position: "absolute",
    top: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
    backgroundColor: colors.overlay,
  },
}));
