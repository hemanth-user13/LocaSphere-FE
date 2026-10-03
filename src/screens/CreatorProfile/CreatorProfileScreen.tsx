import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { RefreshControl, ScrollView, Share, View } from "react-native";

import {
  AppText,
  Button,
  ContentGrid,
  EmptyState,
  ErrorState,
  IconButton,
  LoadingState,
  PlaceCard,
  ProfileHeader,
  Screen,
  ScreenHeader,
  SegmentedControl,
  useToast,
} from "@/components";
import { useLibrary } from "@/context/LibraryContext";
import { useResource } from "@/hooks/useResource";
import { contentService, usersService } from "@/services";
import { layout, makeStyles, spacing, useTheme } from "@/theme";

type Layout = "grid" | "list";

async function loadCreator(id: string) {
  const [user, posts] = await Promise.all([usersService.getById(id), contentService.getByCreator(id)]);
  return { user, posts };
}

export default function CreatorProfileScreen() {
  const { colors } = useTheme();
  const styles = useStyles();
  const { id } = useLocalSearchParams<{ id: string }>();
  const toast = useToast();
  const { isFollowing, toggleFollow } = useLibrary();
  const [layoutMode, setLayoutMode] = useState<Layout>("grid");
  const { data, error, isLoading, isRefreshing, refresh, reload } = useResource(() => loadCreator(id), [id]);

  const following = isFollowing(id);
  // Server stats already include the follow state at open time; only show the delta since then.
  const [followingAtOpen] = useState(following);
  const followerDelta = (following ? 1 : 0) - (followingAtOpen ? 1 : 0);

  return (
    <Screen>
      <ScreenHeader
        showBack
        title={data?.user.name}
        subtitle={data ? `${data.posts.length} posts` : undefined}
        right={
          <IconButton
            icon="ellipsis-horizontal"
            accessibilityLabel="More"
            onPress={() => data && Share.share({ message: `Discover @${data.user.handle} on LocaSphere` })}
          />
        }
      />
      {isLoading ? (
        <LoadingState variant="full" count={2} />
      ) : error || !data ? (
        <ErrorState message={error?.message} onRetry={() => reload()} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]} progressBackgroundColor={colors.surface} />}
        >
          <ProfileHeader
            user={{
              ...data.user,
              stats: { ...data.user.stats, followers: data.user.stats.followers + followerDelta },
            }}
            actions={
              <>
                <View style={styles.flex}>
                  <Button
                    title={following ? "Following" : "Follow"}
                    icon={following ? "checkmark" : "person-add-outline"}
                    variant={following ? "outline" : "primary"}
                    size="md"
                    onPress={() => toggleFollow(id)}
                  />
                </View>
                <View style={styles.flex}>
                  <Button
                    title="Message"
                    icon="chatbubble-outline"
                    variant="secondary"
                    size="md"
                    onPress={() => toast({ message: "Messaging is coming soon", icon: "chatbubble-outline" })}
                  />
                </View>
              </>
            }
          />

          <View style={styles.sectionHeader}>
            <AppText variant="h2">Recent posts</AppText>
            <SegmentedControl<Layout>
              value={layoutMode}
              onChange={setLayoutMode}
              options={[
                { value: "grid", label: "", icon: "grid-outline" },
                { value: "list", label: "", icon: "list" },
              ]}
            />
          </View>

          {data.posts.length === 0 ? (
            <EmptyState compact icon="images-outline" title="No posts yet" message={`${data.user.name} hasn't shared anything yet.`} />
          ) : layoutMode === "grid" ? (
            <ContentGrid items={data.posts} />
          ) : (
            <View style={styles.list}>
              {data.posts.map((p) => (
                <PlaceCard key={p.id} item={p} variant="full" />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  flex: { flex: 1 },
  scroll: { paddingBottom: spacing.xxxl },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: layout.screenPadding,
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
  },
  list: { paddingHorizontal: layout.screenPadding, gap: spacing.lg },
}));
