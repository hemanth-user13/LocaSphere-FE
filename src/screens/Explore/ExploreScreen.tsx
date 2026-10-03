import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import {
  AppText,
  CategoryChip,
  DiscoveryMap,
  EmptyState,
  ErrorState,
  LoadingState,
  PlaceCard,
  Screen,
  SearchBar,
  SegmentedControl,
} from "@/components";
import { CATEGORIES } from "@/data/categories";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useResource } from "@/hooks/useResource";
import { config, searchService } from "@/services";
import { layout, spacing } from "@/theme";
import type { CategoryId, ID } from "@/types/models";

import { countActiveFilters, FilterSheet, type ExploreFilters } from "./FilterSheet";

type ViewMode = "list" | "map";

export default function ExploreScreen() {
  const params = useLocalSearchParams<{ category?: CategoryId }>();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId | null>(params.category ?? null);
  const [filters, setFilters] = useState<ExploreFilters>({});
  const [mode, setMode] = useState<ViewMode>("list");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<ID | null>(null);
  const debouncedQuery = useDebouncedValue(query, 300);

  // Deep links / Home category taps update the active category
  // (adjusting state during render, per React's "you might not need an effect").
  const [lastParam, setLastParam] = useState(params.category);
  if (params.category !== lastParam) {
    setLastParam(params.category);
    if (params.category) setCategory(params.category);
  }

  const request = useMemo(
    () => ({
      query: debouncedQuery,
      mode: "auto" as const,
      filters: { ...filters, categoryIds: category ? [category] : undefined },
    }),
    [debouncedQuery, filters, category],
  );
  const { data, error, isLoading, isRefreshing, refresh, reload } = useResource(
    () => searchService.search(request),
    [request],
  );

  const items = useMemo(() => data?.hits.map((h) => h.item) ?? [], [data]);
  const selected = items.find((i) => i.id === selectedId) ?? items[0];
  const activeFilters = countActiveFilters(filters);

  const clearAll = () => {
    setQuery("");
    setCategory(null);
    setFilters({});
  };

  const renderBody = () => {
    if (isLoading && !data) return <LoadingState variant={mode === "map" ? "row" : "full"} count={3} />;
    if (error) return <ErrorState message={error.message} onRetry={() => reload()} />;
    if (items.length === 0)
      return (
        <EmptyState
          icon="search-outline"
          title="Nothing matches yet"
          message="Try a different category, widen the distance, or clear your filters."
          actionLabel="Clear all filters"
          onAction={clearAll}
        />
      );

    if (mode === "map") {
      return (
        <View style={styles.mapWrap}>
          <DiscoveryMap items={items} selectedId={selected?.id} onSelect={setSelectedId} />
          {selected && (
            <Animated.View key={selected.id} entering={FadeInUp.duration(250)} style={styles.mapCard}>
              <PlaceCard item={selected} variant="row" />
            </Animated.View>
          )}
        </View>
      );
    }

    return (
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(Math.min(index, 5) * 50).duration(300)}>
            <PlaceCard item={item} variant="full" />
          </Animated.View>
        )}
      />
    );
  };

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.flex}>
          <AppText variant="h1" accessibilityRole="header">
            Explore
          </AppText>
          <AppText variant="caption" color="textSecondary">
            {config.defaultCity} · {data ? `${data.total} result${data.total === 1 ? "" : "s"}` : "Searching…"}
          </AppText>
        </View>
        <SegmentedControl<ViewMode>
          value={mode}
          onChange={setMode}
          options={[
            { value: "list", label: "List", icon: "list" },
            { value: "map", label: "Map", icon: "map-outline" },
          ]}
        />
      </View>

      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Search in Explore…"
        onFilterPress={() => setFiltersOpen(true)}
        activeFilterCount={activeFilters}
        style={styles.search}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} style={styles.chipsScroll}>
        <CategoryChip label="All" selected={category === null} onPress={() => setCategory(null)} />
        {CATEGORIES.map((c) => (
          <CategoryChip
            key={c.id}
            label={c.label}
            icon={c.icon}
            selected={category === c.id}
            onPress={() => setCategory(category === c.id ? null : c.id)}
          />
        ))}
      </ScrollView>

      <View style={styles.flex}>{renderBody()}</View>

      <FilterSheet
        key={filtersOpen ? "open" : "closed"}
        visible={filtersOpen} value={filters} onClose={() => setFiltersOpen(false)} onApply={setFilters} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.md,
  },
  search: { marginHorizontal: layout.screenPadding, marginTop: spacing.lg },
  chipsScroll: { flexGrow: 0 },
  chips: { paddingHorizontal: layout.screenPadding, paddingVertical: spacing.md, gap: spacing.sm },
  list: { paddingHorizontal: layout.screenPadding, paddingBottom: spacing.xxl, gap: spacing.lg },
  mapWrap: { flex: 1 },
  mapCard: { position: "absolute", left: layout.screenPadding, right: layout.screenPadding, bottom: spacing.lg },
});
