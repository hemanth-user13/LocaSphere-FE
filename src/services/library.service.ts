import type { ContentItem, ID, Paginated } from "@/types/models";

import { apiClient } from "./api/client";
import { endpoints } from "./api/endpoints";
import { config } from "./config";
import { mockDelay } from "./mock";
import { mockDb } from "./mockDb";

export type LibrarySnapshot = { savedIds: ID[]; likedIds: ID[]; followingIds: ID[] };

/** Saves, likes and follows — the user's personal relationship with content. */
export interface LibraryService {
  getSnapshot(): Promise<LibrarySnapshot>;
  getSaved(): Promise<ContentItem[]>;
  setSaved(id: ID, saved: boolean): Promise<void>;
  setLiked(id: ID, liked: boolean): Promise<void>;
  setFollowing(userId: ID, following: boolean): Promise<void>;
}

const toggle = (set: Set<ID>, id: ID, on: boolean) => (on ? set.add(id) : set.delete(id));

const mockLibraryService: LibraryService = {
  getSnapshot: () =>
    mockDelay({
      savedIds: [...mockDb.savedIds],
      likedIds: [...mockDb.likedIds],
      followingIds: [...mockDb.followingIds],
    }),
  getSaved: () => mockDelay(mockDb.content.filter((c) => mockDb.savedIds.has(c.id))),
  setSaved: async (id, saved) => void toggle(mockDb.savedIds, id, saved),
  setLiked: async (id, liked) => void toggle(mockDb.likedIds, id, liked),
  setFollowing: async (userId, following) => void toggle(mockDb.followingIds, userId, following),
};

const httpLibraryService: LibraryService = {
  getSnapshot: () => apiClient.get<LibrarySnapshot>("/me/library/"),
  getSaved: async () => (await apiClient.get<Paginated<ContentItem>>(endpoints.library.saved)).results,
  setSaved: async (id, saved) => {
    await (saved ? apiClient.post(endpoints.content.save(id)) : apiClient.delete(endpoints.content.save(id)));
  },
  setLiked: async (id, liked) => {
    await (liked ? apiClient.post(endpoints.content.like(id)) : apiClient.delete(endpoints.content.like(id)));
  },
  setFollowing: async (userId, following) => {
    await (following
      ? apiClient.post(endpoints.users.follow(userId))
      : apiClient.delete(endpoints.users.follow(userId)));
  },
};

export const libraryService: LibraryService = config.useMocks ? mockLibraryService : httpLibraryService;
