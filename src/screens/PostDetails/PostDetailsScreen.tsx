import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  AppText,
  Avatar,
  Button,
  ErrorState,
  IconButton,
  Rating,
  ReportSheet,
  ReviewItem,
  SaveButton,
  ScreenHeader,
  Skeleton,
  Stars,
  Tag,
  useToast,
} from "@/components";
import { useAuth } from "@/context/AuthContext";
import { useLibrary } from "@/context/LibraryContext";
import { getCategory } from "@/data/categories";
import { useResource } from "@/hooks/useResource";
import { contentService, usersService } from "@/services";
import { layout, makeStyles, radius, shadows, spacing, useTheme } from "@/theme";
import type { IconName, User } from "@/types/models";
import { containerButtonRole } from "@/utils/a11y";
import { formatCount, formatDistance, formatEventDate, formatPriceLevel } from "@/utils/format";
import { openDirections, shareContent } from "@/utils/share";

const HERO_HEIGHT = 360;

async function loadDetails(id: string) {
  const item = await contentService.getById(id);
  const [reviews, creator] = await Promise.all([contentService.getReviews(id), usersService.getById(item.creatorId)]);
  const authors = await usersService.getMany([...new Set(reviews.map((r) => r.authorId))]);
  return { item, reviews, creator, authors: new Map<string, User>(authors.map((a) => [a.id, a])) };
}

function InfoRow({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  const { colors } = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.flex}>
        <AppText variant="caption" color="textSecondary">
          {label}
        </AppText>
        <AppText variant="bodyMedium">{value}</AppText>
      </View>
    </View>
  );
}

function QuickAction({ icon, label, onPress, active }: { icon: IconName; label: string; onPress: () => void; active?: boolean }) {
  const { colors } = useTheme();
  const styles = useStyles();
  return (
    <Pressable onPress={onPress} style={styles.quick} accessibilityRole="button" accessibilityLabel={label}>
      <View style={[styles.quickIcon, active && { backgroundColor: colors.primary }]}>
        <Ionicons name={icon} size={20} color={active ? colors.white : colors.primary} />
      </View>
      <AppText variant="label" color="textSecondary">
        {label}
      </AppText>
    </Pressable>
  );
}

function DetailsSkeleton() {
  return (
    <View>
      <Skeleton height={HERO_HEIGHT} radius={0} />
      <View style={{ padding: layout.screenPadding, gap: spacing.md }}>
        <Skeleton width="30%" height={20} radius={radius.pill} />
        <Skeleton width="80%" height={28} />
        <Skeleton width="50%" height={14} />
        <Skeleton height={72} radius={radius.lg} style={{ marginTop: spacing.md }} />
        <Skeleton height={14} />
        <Skeleton height={14} width="90%" />
      </View>
    </View>
  );
}

export default function PostDetailsScreen() {
  const { colors } = useTheme();
  const styles = useStyles();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const { session } = useAuth();
  const { isLiked, toggleLike, isSaved, toggleSave, isFollowing, toggleFollow } = useLibrary();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);
  const { data, error, isLoading, reload } = useResource(() => loadDetails(id), [id]);

  if (isLoading) return <DetailsSkeleton />;
  if (error || !data) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <ScreenHeader showBack />
        <ErrorState message={error?.message} onRetry={() => reload()} />
      </View>
    );
  }

  const { item, reviews, creator, authors } = data;
  const category = getCategory(item.categoryId);
  const photos = [item.coverImage, ...item.photos];
  const liked = isLiked(item.id);
  const following = isFollowing(creator.id);
  const price = formatPriceLevel(item.priceLevel);
  const isOwn = item.creatorId === session?.user.id;

  const deletePost = async () => {
    try {
      await contentService.remove(item.id);
      toast({ message: "Post deleted", icon: "trash-outline" });
      router.back();
    } catch {
      toast({ message: "Couldn't delete this post", tone: "error" });
    }
  };

  // Creators manage their own posts; everyone else can report.
  const openMore = () => {
    if (!isOwn) return setReportOpen(true);
    Alert.alert(item.title, undefined, [
      { text: "Edit post", onPress: () => toast({ message: "Editing is coming soon", icon: "create-outline" }) },
      {
        text: "Delete post",
        style: "destructive",
        onPress: () =>
          Alert.alert("Delete this post?", "This can't be undone.", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: deletePost },
          ]),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const onPhotoScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setPhotoIndex(Math.round(e.nativeEvent.contentOffset.x / width));

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 + insets.bottom }}>
        {/* Hero carousel */}
        <View>
          <FlatList
            data={photos}
            keyExtractor={(uri, i) => `${uri}-${i}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onPhotoScroll}
            renderItem={({ item: uri }) => (
              <Image source={{ uri }} style={{ width, height: HERO_HEIGHT, backgroundColor: colors.surfaceMuted }} contentFit="cover" transition={200} />
            )}
          />
          <View style={styles.heroShade} />
          {photos.length > 1 && (
            <View style={styles.counter}>
              <AppText variant="label" style={{ color: colors.white }}>
                {photoIndex + 1}/{photos.length}
              </AppText>
            </View>
          )}
        </View>

        <Animated.View entering={FadeInDown.duration(350)} style={styles.sheet}>
          <View style={styles.tags}>
            <Tag label={category.label} icon={category.icon} tone="primary" />
            {item.kind === "event" && <Tag label="Event" icon="calendar" tone="accent" />}
            {item.kind === "post" && <Tag label="Community post" icon="people" tone="accent" />}
            {item.isOpenNow !== undefined && (
              <Tag label={item.isOpenNow ? "Open now" : "Closed"} tone={item.isOpenNow ? "success" : "neutral"} />
            )}
          </View>

          <AppText variant="h1" style={{ marginTop: spacing.md }}>
            {item.title}
          </AppText>
          <View style={styles.metaRow}>
            <Rating value={item.rating} count={item.reviewCount} size="md" />
            <View style={styles.dot} />
            <AppText variant="callout" color="textSecondary">
              {formatDistance(item.distanceKm)} away
            </AppText>
            {price && (
              <>
                <View style={styles.dot} />
                <AppText variant="callout" color="textSecondary">
                  {price}
                </AppText>
              </>
            )}
          </View>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
            <AppText variant="callout" color="textSecondary">
              {item.area}, Hyderabad
            </AppText>
          </View>

          {item.kind === "event" && item.startsAt && (
            <View style={styles.eventBanner}>
              <Ionicons name="calendar" size={20} color={colors.accent} />
              <View style={styles.flex}>
                <AppText variant="calloutStrong">{formatEventDate(item.startsAt)}</AppText>
                <AppText variant="caption" color="textSecondary">
                  {formatCount(item.saveCount)} people are interested
                </AppText>
              </View>
            </View>
          )}

          <View style={styles.quickRow}>
            <QuickAction icon={liked ? "heart" : "heart-outline"} label={liked ? "Liked" : "Like"} active={liked} onPress={() => toggleLike(item.id)} />
            <QuickAction
              icon={isSaved(item.id) ? "bookmark" : "bookmark-outline"}
              label={isSaved(item.id) ? "Saved" : "Save"}
              active={isSaved(item.id)}
              onPress={() => {
                toggleSave(item.id);
                toast({ message: isSaved(item.id) ? "Removed from Saved" : "Saved to your collection", icon: "bookmark" });
              }}
            />
            <QuickAction icon="share-social-outline" label="Share" onPress={() => shareContent(item)} />
            <QuickAction icon="navigate-outline" label="Directions" onPress={() => openDirections(item)} />
          </View>

          {/* About */}
          <View style={styles.section}>
            <AppText variant="h2">About</AppText>
            <AppText variant="body" color="textSecondary">
              {item.description}
            </AppText>
            <View style={styles.tagWrap}>
              {item.tags.map((t) => (
                <Tag key={t} label={`#${t}`} />
              ))}
            </View>
          </View>

          <View style={styles.infoCard}>
            <InfoRow icon="map-outline" label="Address" value={item.address} />
            {item.openingHours && <InfoRow icon="time-outline" label="Hours" value={item.openingHours} />}
            {price && <InfoRow icon="wallet-outline" label="Price" value={`${price} · per person`} />}
          </View>

          {/* Creator */}
          <View style={styles.section}>
            <AppText variant="h2">Shared by</AppText>
            <Pressable
              style={styles.creator}
              onPress={() => router.push({ pathname: "/creator/[id]", params: { id: creator.id } })}
              accessibilityRole={containerButtonRole}
            >
              <Avatar uri={creator.avatar} name={creator.name} size={48} />
              <View style={styles.flex}>
                <View style={styles.nameRow}>
                  <AppText variant="bodyStrong">{creator.name}</AppText>
                  {creator.isVerified && <Ionicons name="checkmark-circle" size={16} color={colors.accent} />}
                </View>
                <AppText variant="caption" color="textSecondary">
                  @{creator.handle} · {formatCount(creator.stats.followers)} followers
                </AppText>
              </View>
              <Button
                title={following ? "Following" : "Follow"}
                variant={following ? "outline" : "secondary"}
                size="sm"
                fullWidth={false}
                onPress={() => toggleFollow(creator.id)}
              />
            </Pressable>
          </View>

          {/* Photos */}
          {photos.length > 1 && (
            <View style={styles.section}>
              <AppText variant="h2">Photos</AppText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
                {photos.map((uri, i) => (
                  <Image key={`${uri}-${i}`} source={{ uri }} style={styles.thumb} contentFit="cover" transition={200} />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Reviews */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AppText variant="h2">Reviews</AppText>
              <Pressable onPress={() => toast({ message: "Reviews composer is coming soon", icon: "create-outline" })} hitSlop={10}>
                <AppText variant="calloutStrong" color="primary">
                  Write a review
                </AppText>
              </Pressable>
            </View>
            {item.rating > 0 && (
              <View style={styles.ratingSummary}>
                <AppText variant="display">{item.rating.toFixed(1)}</AppText>
                <View style={{ gap: 4 }}>
                  <Stars value={item.rating} size={16} />
                  <AppText variant="caption" color="textSecondary">
                    Based on {formatCount(item.reviewCount)} reviews
                  </AppText>
                </View>
              </View>
            )}
            {reviews.length === 0 ? (
              <AppText variant="callout" color="textSecondary">
                No written reviews yet — be the first to share your experience.
              </AppText>
            ) : (
              reviews.map((r) => <ReviewItem key={r.id} review={r} author={authors.get(r.authorId)} />)
            )}
          </View>

          {!isOwn && (
            <Pressable onPress={() => setReportOpen(true)} style={styles.report} accessibilityRole="button">
              <Ionicons name="flag-outline" size={16} color={colors.textSecondary} />
              <AppText variant="calloutStrong" color="textSecondary">
                Report this {item.kind}
              </AppText>
            </Pressable>
          )}
        </Animated.View>
      </ScrollView>

      {/* Floating top controls */}
      <View style={[styles.topBar, { top: insets.top + spacing.sm }]}>
        <IconButton icon="chevron-back" variant="glass" accessibilityLabel="Go back" onPress={() => router.back()} />
        <View style={styles.flex} />
        <IconButton icon="share-outline" variant="glass" accessibilityLabel="Share" onPress={() => shareContent(item)} />
        <SaveButton id={item.id} size={44} />
        <IconButton icon="ellipsis-horizontal" variant="glass" accessibilityLabel="More options" onPress={openMore} />
      </View>

      {/* Sticky CTA */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
        <Pressable
          onPress={() => toggleLike(item.id)}
          style={[styles.likeButton, liked && styles.likeButtonActive]}
          accessibilityRole="button"
          accessibilityLabel={liked ? "Unlike" : "Like"}
        >
          <Ionicons name={liked ? "heart" : "heart-outline"} size={22} color={liked ? colors.error : colors.text} />
        </Pressable>
        <View style={styles.flex}>
          <Button title="Get directions" icon="navigate" onPress={() => openDirections(item)} />
        </View>
      </View>

      <ReportSheet contentId={item.id} visible={reportOpen} onClose={() => setReportOpen(false)} />
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  heroShade: {
    pointerEvents: "none",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: colors.heroShade,
  },
  counter: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.xxl + spacing.sm,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.scrim,
  },
  sheet: {
    marginTop: -spacing.xl,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    backgroundColor: colors.background,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.xl,
  },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  metaRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.sm },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.textMuted },
  locationRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs, marginTop: spacing.xs },
  eventBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.md + 2,
    borderRadius: radius.lg,
    backgroundColor: colors.accentSoft,
  },
  quickRow: {
    flexDirection: "row",
    marginTop: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  quick: { flex: 1, alignItems: "center", gap: spacing.sm },
  quickIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  section: { marginTop: spacing.xxl, gap: spacing.md },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  tagWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  infoCard: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    gap: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  infoRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  creator: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md + 2,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  nameRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  thumb: { width: 128, height: 128, borderRadius: radius.md, backgroundColor: colors.surfaceMuted },
  ratingSummary: { flexDirection: "row", alignItems: "center", gap: spacing.lg },
  report: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: spacing.xxl,
    minHeight: 48,
  },
  topBar: {
    position: "absolute",
    left: layout.screenPadding,
    right: layout.screenPadding,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.md,
  },
  likeButton: {
    width: 54,
    height: 54,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  likeButtonActive: { borderColor: colors.errorMuted, backgroundColor: colors.errorSoft },
}));
