/**
 * Domain models. Field names mirror what the Django REST API will return
 * (converted to camelCase by the API client), so screens never depend on
 * where data comes from.
 */
import type { Ionicons } from "@expo/vector-icons";

export type IconName = keyof typeof Ionicons.glyphMap;

export type ID = string;

export type Coordinates = { latitude: number; longitude: number };

export type CategoryId =
  | "food"
  | "cafes"
  | "events"
  | "activities"
  | "shopping"
  | "parks"
  | "nightlife"
  | "culture";

export type Category = {
  id: CategoryId;
  label: string;
  icon: IconName;
  /** Soft background + foreground tint used for category tiles (light / dark scheme). */
  tint: { bg: string; fg: string };
  darkTint: { bg: string; fg: string };
};

/** A place is a fixed location, an event is time-bound, a post is a community story. */
export type ContentKind = "place" | "post" | "event";

export type ContentItem = {
  id: ID;
  kind: ContentKind;
  title: string;
  categoryId: CategoryId;
  description: string;
  coverImage: string;
  photos: string[];
  rating: number;
  reviewCount: number;
  distanceKm: number;
  area: string;
  address: string;
  coordinates: Coordinates;
  creatorId: ID;
  likeCount: number;
  saveCount: number;
  tags: string[];
  createdAt: string;
  priceLevel?: 1 | 2 | 3 | 4;
  openingHours?: string;
  isOpenNow?: boolean;
  /** ISO date for events. */
  startsAt?: string;
};

export type User = {
  id: ID;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  location: string;
  isCreator: boolean;
  isVerified?: boolean;
  stats: { posts: number; followers: number; following: number };
  topCategories?: CategoryId[];
  joinedAt: string;
};

export type Review = {
  id: ID;
  contentId: ID;
  authorId: ID;
  rating: number;
  text: string;
  createdAt: string;
  helpfulCount: number;
};

export type ReportReason = "spam" | "inappropriate" | "misleading" | "closed" | "other";

export type HomeFeed = {
  nearYou: ContentItem[];
  trending: ContentItem[];
  recommended: ContentItem[];
  community: ContentItem[];
};

export type DraftPost = {
  photos: string[];
  title: string;
  description: string;
  categoryId: CategoryId | null;
  kind: ContentKind;
  location: { area: string; address: string; coordinates?: Coordinates } | null;
  tags: string[];
};

/** DRF PageNumberPagination envelope. */
export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};
