import type { CategoryId, ContentItem, ContentKind, Coordinates } from "./models";

/**
 * Search contracts.
 *
 * `mode` lets the backend pick a retrieval strategy:
 *  - "keyword":  classic full-text / trigram search (Postgres)
 *  - "semantic": query → embedding → vector similarity (pgvector etc.)
 *  - "auto":     let the server decide (e.g. natural-language queries go semantic)
 *
 * The UI only ever talks to these types, so adding AI search later is a
 * backend + strategy change, not a screen rewrite.
 */
export type SearchMode = "keyword" | "semantic" | "auto";

export type SortOption = "relevance" | "distance" | "rating" | "popular";

export type SearchFilters = {
  categoryIds?: CategoryId[];
  kinds?: ContentKind[];
  maxDistanceKm?: number;
  minRating?: number;
  openNow?: boolean;
  sort?: SortOption;
};

export type SearchRequest = {
  query: string;
  filters?: SearchFilters;
  mode?: SearchMode;
  near?: Coordinates;
  page?: number;
  pageSize?: number;
};

export type SearchHit = {
  item: ContentItem;
  /** 0–1 relevance (BM25-ish for keyword, cosine similarity for semantic). */
  score: number;
  /** Optional server-side explanation, e.g. "Quiet, good wifi, open late". */
  reason?: string;
};

export type SearchResponse = {
  hits: SearchHit[];
  total: number;
  mode: Exclude<SearchMode, "auto">;
  /** Echo of how the server interpreted a natural-language query. */
  interpretedQuery?: string;
};
