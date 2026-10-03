import type { Category, CategoryId } from "@/types/models";

export const CATEGORIES: Category[] = [
  {
    id: "food",
    label: "Food",
    icon: "restaurant-outline",
    tint: { bg: "#FFF4ED", fg: "#C2410C" },
    darkTint: { bg: "#2B1A12", fg: "#FDBA74" },
  },
  {
    id: "cafes",
    label: "Cafes",
    icon: "cafe-outline",
    tint: { bg: "#FDF6EC", fg: "#92400E" },
    darkTint: { bg: "#2A2112", fg: "#FCD34D" },
  },
  {
    id: "events",
    label: "Events",
    icon: "calendar-outline",
    tint: { bg: "#F5F3FF", fg: "#6D28D9" },
    darkTint: { bg: "#231B40", fg: "#C4B5FD" },
  },
  {
    id: "activities",
    label: "Activities",
    icon: "bicycle-outline",
    tint: { bg: "#ECFEFF", fg: "#0E7490" },
    darkTint: { bg: "#0E2A31", fg: "#67E8F9" },
  },
  {
    id: "shopping",
    label: "Shopping",
    icon: "bag-handle-outline",
    tint: { bg: "#FDF2F8", fg: "#BE185D" },
    darkTint: { bg: "#2D1525", fg: "#F9A8D4" },
  },
  {
    id: "parks",
    label: "Parks",
    icon: "leaf-outline",
    tint: { bg: "#ECFDF5", fg: "#047857" },
    darkTint: { bg: "#0F2A21", fg: "#6EE7B7" },
  },
];

const byId = new Map(CATEGORIES.map((c) => [c.id, c]));

export function getCategory(id: CategoryId): Category {
  return byId.get(id) ?? CATEGORIES[0];
}

/** Tile colours for the active colour scheme. */
export function categoryTint(category: Pick<Category, "tint" | "darkTint">, isDark: boolean) {
  return isDark ? category.darkTint : category.tint;
}
