import { CURRENT_USER_ID } from "@/data/mockData";
import type {
  CategoryId,
  ContentItem,
  ContentKind,
  DraftPost,
  HomeFeed,
  ID,
  Paginated,
  ReportReason,
  Review,
} from "@/types/models";

import { apiClient } from "./api/client";
import { endpoints } from "./api/endpoints";
import { config } from "./config";
import { mockDelay, newId } from "./mock";
import { mockDb } from "./mockDb";

export type ContentListParams = {
  categoryId?: CategoryId;
  kind?: ContentKind;
  page?: number;
};

export interface ContentService {
  getHomeFeed(): Promise<HomeFeed>;
  list(params?: ContentListParams): Promise<Paginated<ContentItem>>;
  getById(id: ID): Promise<ContentItem>;
  getReviews(id: ID): Promise<Review[]>;
  getByCreator(userId: ID): Promise<ContentItem[]>;
  publish(draft: DraftPost): Promise<ContentItem>;
  saveDraft(draft: DraftPost): Promise<void>;
  remove(id: ID): Promise<void>;
  report(id: ID, reason: ReportReason, note?: string): Promise<void>;
}

// ---------------------------------------------------------------------------
// Mock implementation
// ---------------------------------------------------------------------------

const byNewest = (a: ContentItem, b: ContentItem) => b.createdAt.localeCompare(a.createdAt);

const mockContentService: ContentService = {
  getHomeFeed() {
    const all = mockDb.content.filter((c) => c.creatorId !== CURRENT_USER_ID);
    const places = all.filter((c) => c.kind !== "post");
    return mockDelay<HomeFeed>({
      nearYou: [...places].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 6),
      trending: [...all].sort((a, b) => b.likeCount - a.likeCount).slice(0, 5),
      recommended: places.filter((c) => c.rating >= 4.5).slice(0, 5),
      community: all.filter((c) => c.kind === "post").sort(byNewest).slice(0, 4),
    });
  },

  list({ categoryId, kind } = {}) {
    const results = mockDb.content.filter(
      (c) => (!categoryId || c.categoryId === categoryId) && (!kind || c.kind === kind),
    );
    return mockDelay({ count: results.length, next: null, previous: null, results });
  },

  getById(id) {
    const item = mockDb.content.find((c) => c.id === id);
    if (!item) return Promise.reject(new Error("This place is no longer available."));
    return mockDelay(item);
  },

  getReviews(id) {
    return mockDelay(
      mockDb.reviews.filter((r) => r.contentId === id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    );
  },

  getByCreator(userId) {
    return mockDelay(mockDb.content.filter((c) => c.creatorId === userId).sort(byNewest));
  },

  publish(draft) {
    const location = draft.location ?? { area: config.defaultCity, address: config.defaultCity };
    const item: ContentItem = {
      id: newId("c"),
      kind: draft.kind,
      title: draft.title.trim(),
      categoryId: draft.categoryId ?? "activities",
      description: draft.description.trim(),
      coverImage: draft.photos[0],
      photos: draft.photos.slice(1),
      rating: 0,
      reviewCount: 0,
      distanceKm: 0.1,
      area: location.area,
      address: location.address,
      coordinates: location.coordinates ?? { latitude: 17.4326, longitude: 78.4071 },
      creatorId: CURRENT_USER_ID,
      likeCount: 0,
      saveCount: 0,
      tags: draft.tags,
      createdAt: new Date().toISOString(),
    };
    mockDb.content.unshift(item);
    return mockDelay(item);
  },

  saveDraft(draft) {
    mockDb.drafts.push(draft);
    return mockDelay(undefined);
  },

  remove(id) {
    mockDb.content = mockDb.content.filter((c) => c.id !== id);
    return mockDelay(undefined);
  },

  report() {
    return mockDelay(undefined);
  },
};

// ---------------------------------------------------------------------------
// HTTP implementation (Django REST Framework)
// ---------------------------------------------------------------------------

const httpContentService: ContentService = {
  getHomeFeed: () => apiClient.get<HomeFeed>(endpoints.feed.home),
  list: (params) => apiClient.get<Paginated<ContentItem>>(endpoints.content.list, { query: params }),
  getById: (id) => apiClient.get<ContentItem>(endpoints.content.detail(id)),
  getReviews: async (id) =>
    (await apiClient.get<Paginated<Review>>(endpoints.content.reviews(id))).results,
  getByCreator: async (userId) =>
    (await apiClient.get<Paginated<ContentItem>>(endpoints.users.content(userId))).results,
  // Photos are expected to be uploaded first via `uploads.presign`; the draft then carries URLs.
  publish: (draft) => apiClient.post<ContentItem>(endpoints.content.list, { ...draft, status: "published" }),
  saveDraft: async (draft) => {
    await apiClient.post(endpoints.content.list, { ...draft, status: "draft" });
  },
  remove: (id) => apiClient.delete(endpoints.content.detail(id)),
  report: async (id, reason, note) => {
    await apiClient.post(endpoints.content.report(id), { reason, note });
  },
};

export const contentService: ContentService = config.useMocks ? mockContentService : httpContentService;
