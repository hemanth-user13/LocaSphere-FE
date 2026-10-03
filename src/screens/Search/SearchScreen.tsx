import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import {
  AppText,
  CategoryChip,
  EmptyState,
  ErrorState,
  IconButton,
  LoadingState,
  PlaceCard,
  Screen,
  SearchBar,
  Tag,
} from "@/components";
import { useLibrary } from "@/context/LibraryContext";
import { CATEGORIES } from "@/data/categories";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useResource } from "@/hooks/useResource";
import { searchService } from "@/services";
import { colors, layout, radius, spacing } from "@/theme";
import { containerButtonRole } from "@/utils/a11y";
import type { SearchResponse } from "@/types/search";

const EMPTY: SearchResponse = { hits: [], total: 0, mode: "keyword" };

function SuggestionsPanel({ onPick }: { onPick: (q: string) => void }) {
  const { recentSearches, removeRecentSearch, clearRecentSearches } = useLibrary();
  const popular = useResource(() => searchService.getPopularQueries());

  return (
    <ScrollView contentContainerStyle={styles.panel} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
      {recentSearches.length > 0 && (
        <View style={styles.block}>
          <View style={styles.blockHeader}>
            <AppText variant="h3">Recent searches</AppText>
            <Pressable onPress={clearRecentSearches} hitSlop={10} accessibilityRole="button">
              <AppText variant="calloutStrong" color="primary">
                Clear all
              </AppText>
            </Pressable>
          </View>
          {recentSearches.map((q) => (
            <Pressable key={q} onPress={() => onPick(q)} style={styles.recentRow} accessibilityRole={containerButtonRole}>
              <Ionicons name="time-outline" size={18} color={colors.textMuted} />
              <AppText variant="body" style={styles.flex} numberOfLines={1}>
                {q}
              </AppText>
              <Pressable onPress={() => removeRecentSearch(q)} hitSlop={12} accessibilityLabel={`Remove ${q}`}>
                <Ionicons name="close" size={18} color={colors.textMuted} />
              </Pressable>
            </Pressable>
          ))}
        </View>
      )}

      <View style={styles.block}>
        <View style={styles.blockHeader}>
          <AppText variant="h3">Try asking</AppText>
          <Tag
            label={searchService.isSemanticAvailable ? "Smart search" : "Smart search soon"}
            icon="sparkles"
            tone="accent"
          />
        </View>
        {searchService.getExamplePrompts().map((p) => (
          <Pressable key={p} onPress={() => onPick(p)} style={styles.prompt} accessibilityRole="button">
            <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.accent} />
            <AppText variant="callout" style={styles.flex}>
              “{p}”
            </AppText>
            <Ionicons name="arrow-forward" size={16} color={colors.textMuted} />
          </Pressable>
        ))}
      </View>

      {!!popular.data?.length && (
        <View style={styles.block}>
          <AppText variant="h3">Popular near you</AppText>
          <View style={styles.wrap}>
            {popular.data.map((q) => (
              <CategoryChip key={q} label={q} icon="trending-up" onPress={() => onPick(q)} />
            ))}
          </View>
        </View>
      )}

      <View style={styles.block}>
        <AppText variant="h3">Browse categories</AppText>
        <View style={styles.grid}>
          {CATEGORIES.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => router.navigate({ pathname: "/explore", params: { category: c.id } })}
              style={({ pressed }) => [styles.categoryCard, { backgroundColor: c.tint.bg }, pressed && { opacity: 0.8 }]}
              accessibilityRole="button"
            >
              <Ionicons name={c.icon} size={22} color={c.tint.fg} />
              <AppText variant="calloutStrong" style={{ color: c.tint.fg }}>
                {c.label}
              </AppText>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

export default function SearchScreen() {
  const { addRecentSearch } = useLibrary();
  const [query, setQuery] = useState("");
  const debounced = useDebouncedValue(query.trim(), 300);
  const hasQuery = debounced.length > 0;

  const { data, error, isLoading, reload } = useResource(
    () => (hasQuery ? searchService.search({ query: debounced, mode: "auto" }) : Promise.resolve(EMPTY)),
    [debounced],
  );

  const pick = (q: string) => {
    setQuery(q);
    addRecentSearch(q);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <IconButton icon="chevron-back" accessibilityLabel="Go back" onPress={() => router.back()} size={44} />
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onSubmit={addRecentSearch}
          autoFocus
          style={styles.flex}
        />
      </View>

      {!query.trim() ? (
        <SuggestionsPanel onPick={pick} />
      ) : isLoading || debounced !== query.trim() ? (
        <View style={{ paddingTop: spacing.lg }}>
          <LoadingState variant="row" count={4} />
        </View>
      ) : error ? (
        <ErrorState message={error.message} onRetry={() => reload()} />
      ) : (
        <FlatList
          data={data?.hits ?? []}
          keyExtractor={(h) => h.item.id}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.results}
          ListHeaderComponent={
            data?.total ? (
              <Animated.View entering={FadeIn} style={styles.resultsHeader}>
                <AppText variant="calloutStrong">
                  {data.total} result{data.total === 1 ? "" : "s"}
                </AppText>
                <AppText variant="caption" color="textSecondary" numberOfLines={1}>
                  for “{debounced}”{data.mode === "semantic" ? " · smart match" : ""}
                </AppText>
              </Animated.View>
            ) : null
          }
          ListEmptyComponent={
            <EmptyState
              icon="search-outline"
              title={`No results for “${debounced}”`}
              message="Check the spelling or try a broader term like “cafe” or “park”."
            />
          }
          renderItem={({ item: hit }) => (
            <View>
              <PlaceCard item={hit.item} variant="row" />
              {hit.reason && (
                <AppText variant="caption" color="accent" style={styles.reason}>
                  ✦ {hit.reason}
                </AppText>
              )}
            </View>
          )}
          onScrollBeginDrag={() => addRecentSearch(debounced)}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  panel: { padding: layout.screenPadding, gap: spacing.xxl, paddingBottom: spacing.xxxl },
  block: { gap: spacing.md },
  blockHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  recentRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, minHeight: 44 },
  prompt: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md + 2,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  categoryCard: {
    width: "47.5%",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  results: { paddingHorizontal: layout.screenPadding, paddingBottom: spacing.xxl, gap: spacing.md },
  resultsHeader: { paddingTop: spacing.sm, paddingBottom: spacing.xs, gap: 2 },
  reason: { marginTop: spacing.xs, marginLeft: spacing.sm },
});
