import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import {
  AppText,
  Avatar,
  CategoryTile,
  ErrorState,
  IconButton,
  LoadingState,
  PlaceCard,
  PostCard,
  Screen,
  SearchBar,
  SectionHeader,
  Skeleton,
} from "@/components";
import { useAuth } from "@/context/AuthContext";
import { CATEGORIES } from "@/data/categories";
import { useResource } from "@/hooks/useResource";
import { config, contentService, usersService } from "@/services";
import { colors, layout, radius, spacing } from "@/theme";
import type { CategoryId, ContentItem, User } from "@/types/models";
import { greetingForHour } from "@/utils/format";

const MORE_TILE = { label: "More", icon: "grid-outline" as const, tint: { bg: colors.surfaceMuted, fg: colors.textSecondary } };

async function loadHome() {
  const feed = await contentService.getHomeFeed();
  const creatorIds = [...new Set(feed.community.map((c) => c.creatorId))];
  const authors = await usersService.getMany(creatorIds);
  return { feed, authors: new Map<string, User>(authors.map((a) => [a.id, a])) };
}

const openExplore = (category?: CategoryId) =>
  router.navigate({ pathname: "/explore", params: category ? { category } : {} });

function HorizontalCards({ items }: { items: ContentItem[] }) {
  return (
    <FlatList
      data={items}
      keyExtractor={(i) => i.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.hList}
      renderItem={({ item }) => <PlaceCard item={item} variant="feature" />}
      snapToInterval={280 + spacing.md}
      decelerationRate="fast"
    />
  );
}

export default function HomeScreen() {
  const { session } = useAuth();
  const { data, error, isLoading, isRefreshing, refresh, reload } = useResource(loadHome);
  const user = session?.user;

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={colors.primary} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.flex}>
            <AppText variant="h1">{greetingForHour()} 👋</AppText>
            <Pressable style={styles.location} hitSlop={8} accessibilityRole="button" accessibilityLabel={`Location: ${config.defaultCity}. Change location`}>
              <Ionicons name="location" size={16} color={colors.primary} />
              <AppText variant="calloutStrong" color="textSecondary">
                {config.defaultCity}
              </AppText>
              <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
            </Pressable>
          </View>
          <IconButton icon="notifications-outline" accessibilityLabel="Notifications" badge />
          {user && (
            <Pressable onPress={() => router.navigate("/profile")} accessibilityLabel="Your profile" hitSlop={4}>
              <Avatar uri={user.avatar} name={user.name} size={44} />
            </Pressable>
          )}
        </View>

        <SearchBar onPress={() => router.push("/search")} style={styles.search} />

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
          {CATEGORIES.map((c) => (
            <CategoryTile key={c.id} category={c} onPress={() => openExplore(c.id)} />
          ))}
          <CategoryTile category={MORE_TILE} onPress={() => openExplore()} />
        </ScrollView>

        {isLoading ? (
          <View style={styles.sections}>
            <View style={styles.inset}>
              <Skeleton width={120} height={20} />
            </View>
            <LoadingState variant="feature" count={2} />
            <View style={styles.inset}>
              <Skeleton width={160} height={20} />
            </View>
            <LoadingState variant="row" count={3} />
          </View>
        ) : error || !data ? (
          <ErrorState message={error?.message} onRetry={() => reload()} />
        ) : (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.sections}>
            <View>
              <SectionHeader title="Near you" subtitle="Closest picks around Jubilee Hills" onAction={() => openExplore()} />
              <HorizontalCards items={data.feed.nearYou} />
            </View>

            <View>
              <SectionHeader title="Trending nearby" subtitle="What locals are saving this week" />
              <View style={styles.list}>
                {data.feed.trending.slice(0, 4).map((item, i) => (
                  <PlaceCard key={item.id} item={item} variant="row" rank={i + 1} />
                ))}
              </View>
            </View>

            <View>
              <SectionHeader title="Recommended for you" subtitle="Based on the cafes and outdoor spots you save" />
              <HorizontalCards items={data.feed.recommended} />
            </View>

            {data.feed.community.length > 0 && (
              <View>
                <SectionHeader title="From the community" subtitle="Fresh stories from creators near you" />
                <View style={styles.list}>
                  {data.feed.community.slice(0, 2).map((item) => (
                    <PostCard key={item.id} item={item} author={data.authors.get(item.creatorId)} />
                  ))}
                </View>
              </View>
            )}

            <Pressable onPress={() => router.navigate("/create")} style={styles.cta} accessibilityRole="button">
              <View style={styles.ctaIcon}>
                <Ionicons name="sparkles" size={20} color={colors.accent} />
              </View>
              <View style={styles.flex}>
                <AppText variant="bodyStrong">Found a hidden gem?</AppText>
                <AppText variant="caption" color="textSecondary">
                  Share it with explorers around you.
                </AppText>
              </View>
              <Ionicons name="arrow-forward" size={18} color={colors.primary} />
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingBottom: spacing.xxl },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.md,
  },
  location: { flexDirection: "row", alignItems: "center", gap: spacing.xs, marginTop: 2, alignSelf: "flex-start" },
  search: { marginHorizontal: layout.screenPadding, marginTop: spacing.lg },
  categories: { paddingHorizontal: layout.screenPadding, gap: spacing.sm, paddingVertical: spacing.xl },
  sections: { gap: spacing.xxl },
  inset: { paddingHorizontal: layout.screenPadding },
  hList: { paddingHorizontal: layout.screenPadding, gap: spacing.md },
  list: { paddingHorizontal: layout.screenPadding, gap: spacing.md },
  cta: {
    marginHorizontal: layout.screenPadding,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: "#E9E3FF",
  },
  ctaIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
});
