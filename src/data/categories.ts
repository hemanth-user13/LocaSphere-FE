import type { Category, CategoryId } from "@/types/models";

export const CATEGORIES: Category[] = [
  { id: "food", label: "Food", icon: "restaurant-outline", tint: { bg: "#FFF4ED", fg: "#C2410C" } },
  { id: "cafes", label: "Cafes", icon: "cafe-outline", tint: { bg: "#FDF6EC", fg: "#92400E" } },
  { id: "events", label: "Events", icon: "calendar-outline", tint: { bg: "#F5F3FF", fg: "#6D28D9" } },
  { id: "activities", label: "Activities", icon: "bicycle-outline", tint: { bg: "#ECFEFF", fg: "#0E7490" } },
  { id: "shopping", label: "Shopping", icon: "bag-handle-outline", tint: { bg: "#FDF2F8", fg: "#BE185D" } },
  { id: "parks", label: "Parks", icon: "leaf-outline", tint: { bg: "#ECFDF5", fg: "#047857" } },
];

const byId = new Map(CATEGORIES.map((c) => [c.id, c]));

export function getCategory(id: CategoryId): Category {
  return byId.get(id) ?? CATEGORIES[0];
}
