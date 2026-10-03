import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { libraryService } from "@/services";
import type { ID } from "@/types/models";
import { haptics } from "@/utils/haptics";

type LibraryState = {
  isSaved: (id: ID) => boolean;
  isLiked: (id: ID) => boolean;
  isFollowing: (userId: ID) => boolean;
  toggleSave: (id: ID) => void;
  toggleLike: (id: ID) => void;
  toggleFollow: (userId: ID) => void;
  savedIds: Set<ID>;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
};

const LibraryContext = createContext<LibraryState | null>(null);

/** Optimistically flips an id in a set, then syncs with the API (rolling back on failure). */
function useOptimisticSet(persist: (id: ID, on: boolean) => Promise<void>) {
  const [ids, setIds] = useState<Set<ID>>(new Set());

  const toggle = useCallback(
    (id: ID) => {
      const next = !ids.has(id);
      const apply = (on: boolean) =>
        setIds((prev) => {
          const copy = new Set(prev);
          if (on) copy.add(id);
          else copy.delete(id);
          return copy;
        });
      apply(next);
      haptics.light();
      persist(id, next).catch(() => apply(!next));
    },
    [ids, persist],
  );

  return [ids, setIds, toggle] as const;
}

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds, toggleSave] = useOptimisticSet(libraryService.setSaved);
  const [likedIds, setLikedIds, toggleLike] = useOptimisticSet(libraryService.setLiked);
  const [followingIds, setFollowingIds, toggleFollow] = useOptimisticSet(libraryService.setFollowing);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Quiet cafe",
    "Biryani",
    "Weekend events",
  ]);

  useEffect(() => {
    libraryService
      .getSnapshot()
      .then((s) => {
        setSavedIds(new Set(s.savedIds));
        setLikedIds(new Set(s.likedIds));
        setFollowingIds(new Set(s.followingIds));
      })
      .catch(() => {});
  }, [setSavedIds, setLikedIds, setFollowingIds]);

  const value = useMemo<LibraryState>(
    () => ({
      savedIds,
      isSaved: (id) => savedIds.has(id),
      isLiked: (id) => likedIds.has(id),
      isFollowing: (id) => followingIds.has(id),
      toggleSave,
      toggleLike,
      toggleFollow,
      recentSearches,
      addRecentSearch: (q) => {
        const query = q.trim();
        if (!query) return;
        setRecentSearches((prev) =>
          [query, ...prev.filter((p) => p.toLowerCase() !== query.toLowerCase())].slice(0, 8),
        );
      },
      removeRecentSearch: (q) => setRecentSearches((prev) => prev.filter((p) => p !== q)),
      clearRecentSearches: () => setRecentSearches([]),
    }),
    [savedIds, likedIds, followingIds, toggleSave, toggleLike, toggleFollow, recentSearches],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used inside LibraryProvider");
  return ctx;
}
