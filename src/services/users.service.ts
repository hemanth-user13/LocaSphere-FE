import { CURRENT_USER_ID } from "@/data/mockData";
import type { ContentItem, ID, Paginated, Review, User } from "@/types/models";

import { apiClient } from "./api/client";
import { endpoints } from "./api/endpoints";
import { config } from "./config";
import { mockDelay } from "./mock";
import { mockDb } from "./mockDb";

export type ProfileUpdate = Partial<Pick<User, "name" | "bio" | "location" | "avatar">>;

export interface UsersService {
  getMe(): Promise<User>;
  getById(id: ID): Promise<User>;
  getMany(ids: ID[]): Promise<User[]>;
  updateMe(update: ProfileUpdate): Promise<User>;
  getReviewsBy(id: ID): Promise<(Review & { content?: ContentItem })[]>;
}

const mockUsersService: UsersService = {
  getMe() {
    return mockUsersService.getById(CURRENT_USER_ID);
  },
  getById(id) {
    const user = mockDb.users.find((u) => u.id === id);
    return user ? mockDelay(user) : Promise.reject(new Error("User not found"));
  },
  getMany(ids) {
    return mockDelay(mockDb.users.filter((u) => ids.includes(u.id)));
  },
  updateMe(update) {
    mockDb.users = mockDb.users.map((u) => (u.id === CURRENT_USER_ID ? { ...u, ...update } : u));
    return mockUsersService.getMe();
  },
  getReviewsBy(id) {
    return mockDelay(
      mockDb.reviews
        .filter((r) => r.authorId === id)
        .map((r) => ({ ...r, content: mockDb.content.find((c) => c.id === r.contentId) })),
    );
  },
};

const httpUsersService: UsersService = {
  getMe: () => apiClient.get<User>(endpoints.users.me),
  getById: (id) => apiClient.get<User>(endpoints.users.detail(id)),
  getMany: async (ids) =>
    (await apiClient.get<Paginated<User>>("/users/", { query: { ids } })).results,
  updateMe: (update) => apiClient.patch<User>(endpoints.users.me, update),
  getReviewsBy: async (id) =>
    (await apiClient.get<Paginated<Review & { content?: ContentItem }>>(endpoints.users.reviews(id))).results,
};

export const usersService: UsersService = config.useMocks ? mockUsersService : httpUsersService;
