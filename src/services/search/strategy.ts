import type { SearchRequest, SearchResponse } from "@/types/search";

/**
 * A retrieval strategy. Today we ship a keyword strategy; a semantic strategy
 * (query → embedding → vector search on the backend) plugs in behind the same
 * interface without any screen changes.
 */
export interface SearchStrategy {
  readonly mode: SearchResponse["mode"];
  search(request: SearchRequest, signal?: AbortSignal): Promise<SearchResponse>;
}
