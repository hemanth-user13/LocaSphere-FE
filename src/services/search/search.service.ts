import type { SearchRequest, SearchResponse } from "@/types/search";

import { config } from "../config";
import { mockDelay } from "../mock";
import { mockKeywordStrategy } from "./keyword.mock";
import { remoteKeywordStrategy, remoteSemanticStrategy } from "./remote";
import type { SearchStrategy } from "./strategy";

const keyword: SearchStrategy = config.useMocks ? mockKeywordStrategy : remoteKeywordStrategy;
const semantic: SearchStrategy | null =
  config.features.semanticSearch && !config.useMocks ? remoteSemanticStrategy : null;

/** Heuristic: longer, sentence-like queries benefit from semantic retrieval. */
export function looksNaturalLanguage(query: string) {
  return query.trim().split(/\s+/).length >= 4;
}

function pickStrategy(request: SearchRequest): SearchStrategy {
  const mode = request.mode ?? "auto";
  if (mode === "keyword" || !semantic) return keyword;
  if (mode === "semantic") return semantic;
  return looksNaturalLanguage(request.query) ? semantic : keyword;
}

export const searchService = {
  isSemanticAvailable: semantic !== null,

  search(request: SearchRequest, signal?: AbortSignal): Promise<SearchResponse> {
    return pickStrategy(request).search(request, signal);
  },

  getPopularQueries(): Promise<string[]> {
    return mockDelay(["Biryani", "Work-friendly cafes", "Sunset spots", "Live music", "Weekend events"]);
  },

  /** Natural-language prompts we surface to teach users the future AI search. */
  getExamplePrompts(): string[] {
    return [
      "Quiet cafe where I can work for a few hours",
      "Outdoor plans for a Sunday morning",
      "Rooftop dinner for a family",
    ];
  },
};
