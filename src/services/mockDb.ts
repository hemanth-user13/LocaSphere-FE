import { CONTENT, INITIAL_LIBRARY, REVIEWS, USERS } from "@/data/mockData";

/** Mutable in-memory store backing the mock services for this session. */
export const mockDb = {
  content: [...CONTENT],
  reviews: [...REVIEWS],
  users: [...USERS],
  savedIds: new Set(INITIAL_LIBRARY.savedIds),
  likedIds: new Set(INITIAL_LIBRARY.likedIds),
  followingIds: new Set(INITIAL_LIBRARY.followingIds),
  drafts: [] as unknown[],
};
