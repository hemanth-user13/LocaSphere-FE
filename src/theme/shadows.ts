import type { ViewStyle } from "react-native";

import { palette } from "./colors";

/** Deliberately subtle: LocaSphere relies on borders first, shadows second. */
export const shadows = {
  none: {},
  sm: {
    shadowColor: palette.slate900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: palette.slate900,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
  },
  primary: {
    shadowColor: palette.indigo600,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 6,
  },
} satisfies Record<string, ViewStyle>;
