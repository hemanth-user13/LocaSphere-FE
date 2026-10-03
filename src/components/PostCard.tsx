import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { useLibrary } from "@/context/LibraryContext";
import { getCategory } from "@/data/categories";
import { colors, radius, spacing } from "@/theme";
import type { ContentItem, User } from "@/types/models";
import { formatCount, formatRelativeTime } from "@/utils/format";
import { shareContent } from "@/utils/share";

import { AppText } from "./AppText";
import { Avatar } from "./Avatar";
import { openContent } from "./PlaceCard";
import { SaveButton } from "./SaveButton";

type Props = {
  item: ContentItem;
  author?: User;
};

/** Community post: creator header, photo, caption and engagement row. */
function PostCardBase({ item, author }: Props) {
  const { isLiked, toggleLike } = useLibrary();
  const liked = isLiked(item.id);
  const likeCount = item.likeCount + (liked ? 1 : 0);
  const category = getCategory(item.categoryId);

  return (
    <View style={styles.card}>
      {author && (
        <Pressable
          style={styles.header}
          onPress={() => router.push({ pathname: "/creator/[id]", params: { id: author.id } })}
          accessibilityRole="button"
          accessibilityLabel={`View ${author.name}'s profile`}
        >
          <Avatar uri={author.avatar} name={author.name} size={38} />
          <View style={styles.flex}>
            <View style={styles.nameRow}>
              <AppText variant="calloutStrong" numberOfLines={1}>
                {author.name}
              </AppText>
              {author.isVerified && <Ionicons name="checkmark-circle" size={14} color={colors.accent} />}
            </View>
            <AppText variant="caption" color="textSecondary" numberOfLines={1}>
              {item.area} · {formatRelativeTime(item.createdAt)}
            </AppText>
          </View>
        </Pressable>
      )}

      <Pressable onPress={() => openContent(item.id)} accessibilityRole="button" accessibilityLabel={item.title}>
        <Image source={{ uri: item.coverImage }} style={styles.image} contentFit="cover" transition={200} />
        <View style={styles.body}>
          <View style={styles.categoryRow}>
            <Ionicons name={category.icon} size={13} color={colors.primary} />
            <AppText variant="label" color="primary">
              {category.label}
            </AppText>
          </View>
          <AppText variant="h3" numberOfLines={2}>
            {item.title}
          </AppText>
          <AppText variant="callout" color="textSecondary" numberOfLines={2}>
            {item.description}
          </AppText>
        </View>
      </Pressable>

      <View style={styles.actions}>
        <Pressable
          onPress={() => toggleLike(item.id)}
          style={styles.action}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={liked ? "Unlike" : "Like"}
          accessibilityState={{ selected: liked }}
        >
          <Ionicons name={liked ? "heart" : "heart-outline"} size={20} color={liked ? colors.error : colors.text} />
          <AppText variant="captionStrong">{formatCount(likeCount)}</AppText>
        </Pressable>
        <Pressable
          onPress={() => openContent(item.id)}
          style={styles.action}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Reviews"
        >
          <Ionicons name="chatbubble-outline" size={19} color={colors.text} />
          <AppText variant="captionStrong">{formatCount(item.reviewCount)}</AppText>
        </Pressable>
        <Pressable
          onPress={() => shareContent(item)}
          style={styles.action}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Share"
        >
          <Ionicons name="paper-plane-outline" size={19} color={colors.text} />
        </Pressable>
        <View style={styles.flex} />
        <SaveButton id={item.id} variant="inline" size={36} />
      </View>
    </View>
  );
}

export const PostCard = memo(PostCardBase);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    overflow: "hidden",
  },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md },
  nameRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  flex: { flex: 1 },
  image: { height: 220, backgroundColor: colors.surfaceMuted },
  body: { paddingHorizontal: spacing.md + 2, paddingTop: spacing.md, gap: spacing.xs },
  categoryRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.md,
  },
  action: { flexDirection: "row", alignItems: "center", gap: spacing.xs + 2, minHeight: 36 },
});
