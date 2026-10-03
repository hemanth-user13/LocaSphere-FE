import { HYDERABAD_AREAS } from "@/data/mockData";
import type { Coordinates } from "@/types/models";

import { mockDelay } from "./mock";

export type LocationOption = { area: string; address: string; coordinates: Coordinates };

/**
 * Location lookups. Mocked for now; later backed by expo-location for the
 * device position and Google Places / Mapbox geocoding for search.
 */
export const locationService = {
  getCurrentLocation(): Promise<LocationOption> {
    const here = HYDERABAD_AREAS[0];
    return mockDelay({ area: here.area, address: `${here.area}, Hyderabad`, coordinates: here.coordinates });
  },

  searchAreas(query: string): Promise<LocationOption[]> {
    const q = query.trim().toLowerCase();
    return mockDelay(
      HYDERABAD_AREAS.filter((a) => !q || a.area.toLowerCase().includes(q)).map((a) => ({
        area: a.area,
        address: `${a.area}, Hyderabad`,
        coordinates: a.coordinates,
      })),
    );
  },
};
