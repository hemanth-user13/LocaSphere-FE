import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, View } from "react-native";

import { AppText, BottomSheet, Button } from "@/components";
import { colors, radius, spacing } from "@/theme";
import type { ContentKind } from "@/types/models";
import type { SearchFilters, SortOption } from "@/types/search";

const SORTS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Best match" },
  { value: "distance", label: "Nearest" },
  { value: "rating", label: "Top rated" },
  { value: "popular", label: "Most popular" },
];
const DISTANCES: (number | undefined)[] = [undefined, 2, 5, 10];
const RATINGS: (number | undefined)[] = [undefined, 4, 4.5];
const KINDS: { value: ContentKind; label: string }[] = [
  { value: "place", label: "Places" },
  { value: "event", label: "Events" },
  { value: "post", label: "Posts" },
];

export type ExploreFilters = Omit<SearchFilters, "categoryIds">;

export function countActiveFilters(f: ExploreFilters) {
  return (
    (f.sort && f.sort !== "relevance" ? 1 : 0) +
    (f.maxDistanceKm ? 1 : 0) +
    (f.minRating ? 1 : 0) +
    (f.kinds?.length ? 1 : 0) +
    (f.openNow ? 1 : 0)
  );
}

function Option({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.option, selected && styles.optionSelected]}
    >
      <AppText variant="calloutStrong" color={selected ? "primary" : "text"}>
        {label}
      </AppText>
    </Pressable>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <AppText variant="overline" color="textSecondary">
        {title}
      </AppText>
      <View style={styles.options}>{children}</View>
    </View>
  );
}

type Props = {
  visible: boolean;
  value: ExploreFilters;
  onClose: () => void;
  onApply: (filters: ExploreFilters) => void;
};

export function FilterSheet({ visible, value, onClose, onApply }: Props) {
  // Parent remounts the sheet (via `key`) each time it opens, so the draft starts from `value`.
  const [draft, setDraft] = useState<ExploreFilters>(value);

  const set = (patch: Partial<ExploreFilters>) => setDraft((d) => ({ ...d, ...patch }));
  const toggleKind = (k: ContentKind) => {
    const kinds = draft.kinds ?? [];
    set({ kinds: kinds.includes(k) ? kinds.filter((x) => x !== k) : [...kinds, k] });
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Filters"
      footer={
        <>
          <View style={styles.flex}>
            <Button title="Reset" variant="outline" onPress={() => setDraft({})} />
          </View>
          <View style={styles.flex2}>
            <Button
              title="Show results"
              onPress={() => {
                onApply(draft);
                onClose();
              }}
            />
          </View>
        </>
      }
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Group title="Sort by">
          {SORTS.map((s) => (
            <Option
              key={s.value}
              label={s.label}
              selected={(draft.sort ?? "relevance") === s.value}
              onPress={() => set({ sort: s.value })}
            />
          ))}
        </Group>
        <Group title="Distance">
          {DISTANCES.map((d) => (
            <Option
              key={String(d)}
              label={d ? `Within ${d} km` : "Any"}
              selected={draft.maxDistanceKm === d}
              onPress={() => set({ maxDistanceKm: d })}
            />
          ))}
        </Group>
        <Group title="Rating">
          {RATINGS.map((r) => (
            <Option
              key={String(r)}
              label={r ? `${r.toFixed(1)}+ ★` : "Any"}
              selected={draft.minRating === r}
              onPress={() => set({ minRating: r })}
            />
          ))}
        </Group>
        <Group title="Type">
          {KINDS.map((k) => (
            <Option
              key={k.value}
              label={k.label}
              selected={!!draft.kinds?.includes(k.value)}
              onPress={() => toggleKind(k.value)}
            />
          ))}
        </Group>
        <View style={styles.switchRow}>
          <View style={styles.flex}>
            <AppText variant="bodyMedium">Open now</AppText>
            <AppText variant="caption" color="textSecondary">
              Only show places open at this moment
            </AppText>
          </View>
          <Switch
            value={!!draft.openNow}
            onValueChange={(openNow) => set({ openNow })}
            trackColor={{ true: colors.primary, false: colors.border }}
            thumbColor={colors.white}
          />
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  flex2: { flex: 2 },
  content: { gap: spacing.xl, paddingBottom: spacing.sm },
  group: { gap: spacing.md },
  options: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  option: {
    paddingHorizontal: spacing.lg,
    height: 40,
    justifyContent: "center",
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  switchRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
});
