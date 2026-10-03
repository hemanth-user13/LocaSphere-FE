import type { SearchRequest, SearchResponse } from "@/types/search";

import { apiClient } from "../api/client";
import { endpoints } from "../api/endpoints";
import type { SearchStrategy } from "./strategy";

/** Postgres full-text search on the Django backend. */
export const remoteKeywordStrategy: SearchStrategy = {
  mode: "keyword",
  search: (request, signal) =>
    apiClient.post<SearchResponse>(endpoints.search.keyword, request, { signal }),
};

/**
 * Semantic search: the backend embeds `query`, runs a vector similarity search
 * (e.g. pgvector), optionally re-ranks with personal signals and returns hits
 * with a `reason`. Enabled by `config.features.semanticSearch`.
 */
export const remoteSemanticStrategy: SearchStrategy = {
  mode: "semantic",
  search: (request: SearchRequest, signal) =>
    apiClient.post<SearchResponse>(endpoints.search.semantic, request, { signal }),
};
