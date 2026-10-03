import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeOut, LinearTransition } from "react-native-reanimated";

import {
  AppText,
  CategoryChip,
  EmptyState,
  ErrorState,
  LoadingState,
  PlaceCard,
  Screen,
} from "@/components";
import { useLibrary } from "@/context/LibraryContext";
import { useResource } from "@/hooks/useResource";
import { libraryService } from "@/services";
import { colors, layout, spacing } from "@/theme";
import type { ContentKind, IconName } from "@/types/models";

type Filter = "all" | ContentKind;

const FILTERS: { value: Filter; label: string; icon: IconName; empty: string }[] = [
  { value: "all", label: "All", icon: "albums-outline", empty: "Tap the bookmark on anything you love to keep it here." },
  { value: "place", label: "Places", icon: "storefront-outline", empty: "Save cafes, restaurants and spots to visit later." },
  { value: "post", label: "Posts", icon: "newspaper-outline", empty: "Save community stories and tips you want to revisit." },
  { value: "event", label: "Events", icon: "calendar-outline", empty: "Save events to get reminded before they start." },
];

export default function SavedScreen() {
  const { savedIds } = useLibrary();
  const [filter, setFilter] = useState<Filter>("all");
  const { data, error, isLoading, isRefreshing, refresh, reload } = useResource(() => libraryService.getSaved());

  // Pick up items saved elsewhere whenever the tab regains focus (no skeleton flash).
  useFocusEffect(
    useCallback(() => {
      reload({ silent: true });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  // Filter by live saved state so un-saving removes the card instantly.
  const saved = useMemo(() => (data ?? []).filter((i) => savedIds.has(i.id)), [data, savedIds]);
  const visible = filter === "all" ? saved : saved.filter((i) => i.kind === filter);
  const counts = useMemo(
    () => ({
      all: saved.length,
      place: saved.filter((i) => i.kind === "place").length,
      post: saved.filter((i) => i.kind === "post").length,
      event: saved.filter((i) => i.kind === "event").length,
    }),
    [saved],
  );
  const activeFilter = FILTERS.find((f) => f.value === filter)!;

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1" accessibilityRole="header">
          Saved
        </AppText>
        <AppText variant="caption" color="textSecondary">
          {counts.all} item{counts.all === 1 ? "" : "s"} in your collection
        </AppText>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll} contentContainerStyle={styles.chips}>
        {FILTERS.map((f) => (
          <CategoryChip
            key={f.value}
            label={data ? `${f.label} · ${counts[f.value]}` : f.label}
            icon={f.icon}
            selected={filter === f.value}
            onPress={() => setFilter(f.value)}
          />
        ))}
      </ScrollView>

      {isLoading ? (
        <LoadingState variant="row" count={4} />
      ) : error ? (
        <ErrorState message={error.message} onRetry={() => reload()} />
      ) : (
        <Animated.FlatList
          data={visible}
          keyExtractor={(i) => i.id}
          contentContainerStyle={[styles.list, visible.length === 0 && styles.flexGrow]}
          showsVerticalScrollIndicator={false}
          itemLayoutAnimation={LinearTransition.duration(220)}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={colors.primary} />}
          renderItem={({ item }) => (
            <Animated.View exiting={FadeOut.duration(180)}>
              <PlaceCard item={item} variant="row" />
            </Animated.View>
          )}
          ListEmptyComponent={
            <EmptyState
              icon="bookmark-outline"
              title={filter === "all" ? "Nothing saved yet" : `No saved ${activeFilter.label.toLowerCase()}`}
              message={activeFilter.empty}
              actionLabel="Explore nearby"
              onAction={() => router.navigate("/explore")}
            />
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: layout.screenPadding, paddingTop: spacing.md, gap: 2 },
  chipsScroll: { flexGrow: 0 },
  chips: { paddingHorizontal: layout.screenPadding, paddingVertical: spacing.lg, gap: spacing.sm },
  list: { paddingHorizontal: layout.screenPadding, paddingBottom: spacing.xxl, gap: spacing.md },
  flexGrow: { flexGrow: 1, justifyContent: "center" },
});
