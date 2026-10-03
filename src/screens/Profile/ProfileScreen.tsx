import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { RefreshControl, ScrollView, Share, StyleSheet, View } from "react-native";

import {
  AppText,
  Button,
  ContentGrid,
  EmptyState,
  ErrorState,
  IconButton,
  ProfileHeader,
  ReviewItem,
  Screen,
  ScreenHeader,
  SegmentedControl,
  Skeleton,
} from "@/components";
import { useAuth } from "@/context/AuthContext";
import { useLibrary } from "@/context/LibraryContext";
import { useResource } from "@/hooks/useResource";
import { contentService, libraryService, usersService } from "@/services";
import { colors, layout, radius, spacing } from "@/theme";
import type { IconName } from "@/types/models";
import { formatCount } from "@/utils/format";

type Tab = "posts" | "reviews" | "saved";

async function loadProfile(userId: string) {
  const [user, posts, reviews, saved] = await Promise.all([
    usersService.getById(userId),
    contentService.getByCreator(userId),
    usersService.getReviewsBy(userId),
    libraryService.getSaved(),
  ]);
  return { user, posts, reviews, saved };
}

function Insight({ icon, value, label, tint }: { icon: IconName; value: string; label: string; tint: string }) {
  return (
    <View style={styles.insight}>
      <Ionicons name={icon} size={18} color={tint} />
      <AppText variant="h3">{value}</AppText>
      <AppText variant="label" color="textSecondary" style={{ fontWeight: "500" }}>
        {label}
      </AppText>
    </View>
  );
}

function ProfileSkeleton() {
  return (
    <View style={{ paddingHorizontal: layout.screenPadding, gap: spacing.md }}>
      <Skeleton height={110} radius={radius.xl} />
      <Skeleton width={92} height={92} radius={46} style={{ marginTop: -52, marginLeft: spacing.lg }} />
      <Skeleton width="50%" height={24} />
      <Skeleton width="30%" height={14} />
      <Skeleton height={14} />
      <Skeleton height={72} radius={radius.lg} />
    </View>
  );
}

export default function ProfileScreen() {
  const { session } = useAuth();
  const { savedIds } = useLibrary();
  const [tab, setTab] = useState<Tab>("posts");
  const userId = session?.user.id ?? "";
  const { data, error, isLoading, isRefreshing, refresh, reload } = useResource(() => loadProfile(userId), [userId]);

  useFocusEffect(
    useCallback(() => {
      reload({ silent: true });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const totalLikes = data?.posts.reduce((sum, p) => sum + p.likeCount, 0) ?? 0;
  const totalSaves = data?.posts.reduce((sum, p) => sum + p.saveCount, 0) ?? 0;
  const saved = data?.saved.filter((i) => savedIds.has(i.id)) ?? [];

  const renderTab = () => {
    if (!data) return null;
    if (tab === "posts") {
      return data.posts.length ? (
        <ContentGrid items={data.posts} />
      ) : (
        <EmptyState
          compact
          icon="camera-outline"
          title="Share your first discovery"
          message="Posts you publish will appear here."
          actionLabel="Create a post"
          onAction={() => router.navigate("/create")}
        />
      );
    }
    if (tab === "reviews") {
      return data.reviews.length ? (
        <View style={styles.reviews}>
          {data.reviews.map((r) => (
            <ReviewItem key={r.id} review={r} heading={r.content?.title ?? "A place you visited"} />
          ))}
        </View>
      ) : (
        <EmptyState compact icon="star-outline" title="No reviews yet" message="Reviews you write will show up here." />
      );
    }
    return saved.length ? (
      <ContentGrid items={saved} />
    ) : (
      <EmptyState compact icon="bookmark-outline" title="Nothing saved yet" message="Saved places appear here." />
    );
  };

  return (
    <Screen>
      <ScreenHeader
        title="Profile"
        large
        right={
          <IconButton icon="settings-outline" accessibilityLabel="Settings" onPress={() => router.push("/settings")} />
        }
      />
      {isLoading ? (
        <ProfileSkeleton />
      ) : error || !data ? (
        <ErrorState message={error?.message} onRetry={() => reload()} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={colors.primary} />}
        >
          <ProfileHeader
            user={data.user}
            actions={
              <>
                <View style={styles.flex}>
                  <Button title="Edit profile" variant="outline" size="md" icon="create-outline" onPress={() => router.push("/edit-profile")} />
                </View>
                <IconButton
                  icon="share-social-outline"
                  accessibilityLabel="Share profile"
                  size={46}
                  onPress={() => Share.share({ message: `Follow @${data.user.handle} on LocaSphere` })}
                />
              </>
            }
          />

          {data.user.isCreator && (
            <View style={styles.dashboard}>
              <View style={styles.dashboardHeader}>
                <AppText variant="h3">Creator insights</AppText>
                <AppText variant="caption" color="textSecondary">
                  Last 30 days
                </AppText>
              </View>
              <View style={styles.insights}>
                <Insight icon="heart" tint={colors.error} value={formatCount(totalLikes)} label="Likes" />
                <Insight icon="bookmark" tint={colors.primary} value={formatCount(totalSaves)} label="Saves" />
                <Insight icon="eye" tint={colors.accent} value="4.8k" label="Profile views" />
              </View>
            </View>
          )}

          <View style={styles.tabs}>
            <SegmentedControl<Tab>
              variant="tabs"
              value={tab}
              onChange={setTab}
              options={[
                { value: "posts", label: `Posts · ${data.posts.length}` },
                { value: "reviews", label: `Reviews · ${data.reviews.length}` },
                { value: "saved", label: `Saved · ${saved.length}` },
              ]}
            />
          </View>
          <View style={styles.tabBody}>{renderTab()}</View>
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingBottom: spacing.xxxl },
  dashboard: {
    marginHorizontal: layout.screenPadding,
    marginTop: spacing.xl,
    padding: spacing.lg,
    gap: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  dashboardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  insights: { flexDirection: "row", gap: spacing.sm },
  insight: {
    flex: 1,
    gap: 2,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.background,
  },
  tabs: { marginTop: spacing.xl, paddingHorizontal: layout.screenPadding },
  tabBody: { paddingTop: spacing.lg },
  reviews: { paddingHorizontal: layout.screenPadding, gap: spacing.md },
});
