import { getCategory } from "@/data/categories";
import type { ContentItem } from "@/types/models";
import type { SearchFilters, SearchHit, SearchRequest } from "@/types/search";

import { mockDelay } from "../mock";
import { mockDb } from "../mockDb";
import type { SearchStrategy } from "./strategy";

const STOP_WORDS = new Set([
  "a", "an", "the", "to", "for", "in", "on", "at", "of", "and", "or", "with", "me", "find",
  "show", "where", "i", "can", "some", "few", "hours", "near", "nearby", "good", "best", "place", "places",
]);

export function tokenize(query: string) {
  return query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t))
    // Light stemming so "cafes" matches "cafe", "parks" matches "park".
    .map((t) => (t.length > 3 && t.endsWith("s") ? t.slice(0, -1) : t));
}

function scoreItem(item: ContentItem, tokens: string[]) {
  if (tokens.length === 0) return 1;
  const fields: [string, number][] = [
    [item.title.toLowerCase(), 3],
    [item.tags.join(" ").toLowerCase(), 2.5],
    [getCategory(item.categoryId).label.toLowerCase(), 2],
    [item.area.toLowerCase(), 1.5],
    [item.description.toLowerCase(), 1],
  ];
  let score = 0;
  let matched = 0;
  for (const token of tokens) {
    let best = 0;
    for (const [text, weight] of fields) if (text.includes(token)) best = Math.max(best, weight);
    if (best > 0) matched += 1;
    score += best;
  }
  if (matched === 0) return 0;
  // Reward covering more of the query, normalise to 0–1.
  return Math.min(1, (score / (tokens.length * 3)) * (0.5 + 0.5 * (matched / tokens.length)));
}

export function applyFilters(items: ContentItem[], filters: SearchFilters = {}) {
  return items.filter(
    (c) =>
      (!filters.categoryIds?.length || filters.categoryIds.includes(c.categoryId)) &&
      (!filters.kinds?.length || filters.kinds.includes(c.kind)) &&
      (filters.maxDistanceKm === undefined || c.distanceKm <= filters.maxDistanceKm) &&
      (filters.minRating === undefined || c.rating >= filters.minRating) &&
      (!filters.openNow || c.isOpenNow === true),
  );
}

function sortHits(hits: SearchHit[], sort: SearchFilters["sort"] = "relevance") {
  const by: Record<NonNullable<SearchFilters["sort"]>, (a: SearchHit, b: SearchHit) => number> = {
    relevance: (a, b) => b.score - a.score || a.item.distanceKm - b.item.distanceKm,
    distance: (a, b) => a.item.distanceKm - b.item.distanceKm,
    rating: (a, b) => b.item.rating - a.item.rating,
    popular: (a, b) => b.item.likeCount - a.item.likeCount,
  };
  return hits.sort(by[sort]);
}

/** Client-side keyword search over mock data. Mirrors what `/search/` will return. */
export const mockKeywordStrategy: SearchStrategy = {
  mode: "keyword",
  search({ query, filters }: SearchRequest) {
    const tokens = tokenize(query);
    const hits = applyFilters(mockDb.content, filters)
      .map((item) => ({ item, score: scoreItem(item, tokens) }))
      .filter((h) => h.score > 0);
    const sorted = sortHits(hits, filters?.sort);
    return mockDelay({ hits: sorted, total: sorted.length, mode: "keyword" as const });
  },
};
