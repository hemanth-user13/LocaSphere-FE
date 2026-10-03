/**
 * LocaSphere colour tokens.
 *
 * Two schemes share the same semantic keys. Components never reference raw
 * hex values — they read the active scheme via `useTheme()` / `makeStyles()`,
 * so the whole UI switches between light and dark from one place.
 */
export const palette = {
  indigo50: "#EEF2FF",
  indigo100: "#E0E7FF",
  indigo200: "#C7D2FE",
  indigo300: "#A5B4FC",
  indigo400: "#818CF8",
  indigo500: "#6366F1",
  indigo600: "#4F46E5",
  indigo800: "#3730A3",
  violet50: "#F5F3FF",
  violet400: "#A78BFA",
  violet600: "#7C3AED",
  slate50: "#F8FAFC",
  slate100: "#F1F5F9",
  slate200: "#E2E8F0",
  slate300: "#CBD5E1",
  slate400: "#94A3B8",
  slate500: "#64748B",
  slate700: "#334155",
  slate800: "#1E293B",
  slate900: "#0F172A",
  emerald50: "#ECFDF5",
  emerald400: "#34D399",
  emerald500: "#10B981",
  emerald700: "#047857",
  amber50: "#FFFBEB",
  amber400: "#FBBF24",
  amber500: "#F59E0B",
  amber700: "#B45309",
  red50: "#FEF2F2",
  red100: "#FEE2E2",
  red400: "#F87171",
  red500: "#EF4444",
  white: "#FFFFFF",
  black: "#000000",
} as const;

export const lightColors = {
  primary: palette.indigo600,
  primaryDark: palette.indigo800,
  primarySoft: palette.indigo50,
  primaryMuted: palette.indigo100,
  accent: palette.violet600,
  accentSoft: palette.violet50,
  accentMuted: "#E9E3FF",

  background: palette.slate50,
  surface: palette.white,
  surfaceMuted: palette.slate100,
  /** Raised surfaces on top of `surface` (sheets, popovers). */
  surfaceElevated: palette.white,

  text: palette.slate900,
  textSecondary: palette.slate500,
  textMuted: palette.slate400,
  textOnPrimary: palette.white,

  border: palette.slate200,
  borderSubtle: palette.slate100,

  success: palette.emerald500,
  successSoft: palette.emerald50,
  successText: palette.emerald700,
  warning: palette.amber500,
  warningSoft: palette.amber50,
  warningText: palette.amber700,
  error: palette.red500,
  errorSoft: palette.red50,
  errorMuted: palette.red100,

  star: palette.amber500,
  overlay: "rgba(15, 23, 42, 0.45)",
  scrim: "rgba(15, 23, 42, 0.35)",
  heroShade: "rgba(15, 23, 42, 0.18)",
  glass: "rgba(255, 255, 255, 0.92)",
  skeleton: palette.slate200,
  /** Toasts and other inverted chips. */
  inverseSurface: palette.slate900,
  inverseText: palette.white,
  /** Decorative brand tints (profile cover orbs, map "you are here"). */
  brandTint: "rgba(79, 70, 229, 0.10)",
  accentTint: "rgba(124, 58, 237, 0.14)",
  locationHalo: "rgba(79, 70, 229, 0.20)",

  mapBackground: "#EEF1F6",
  mapWater: "#D6E4F5",
  mapPark: "#DDEFE3",
  mapRoad: palette.white,

  white: palette.white,
};

export type Colors = { [K in keyof typeof lightColors]: string };
export type ColorToken = keyof Colors;

/**
 * Dark scheme: deep navy surfaces (not pure black) with layered elevation,
 * softened text and slightly brighter brand hues so contrast stays AA.
 */
export const darkColors: Colors = {
  primary: palette.indigo500,
  primaryDark: palette.indigo600,
  primarySoft: "#1C1F45",
  primaryMuted: "#2A2E66",
  accent: palette.violet400,
  accentSoft: "#221A3D",
  accentMuted: "#33275A",

  background: "#0B1120",
  surface: "#131B2E",
  surfaceMuted: "#1B2538",
  surfaceElevated: "#18213A",

  text: palette.slate100,
  textSecondary: palette.slate400,
  textMuted: palette.slate500,
  textOnPrimary: palette.white,

  border: "#253049",
  borderSubtle: "#1C263A",

  success: palette.emerald400,
  successSoft: "#0F2A22",
  successText: "#6EE7B7",
  warning: palette.amber400,
  warningSoft: "#2E230C",
  warningText: "#FCD34D",
  error: palette.red400,
  errorSoft: "#2E1518",
  errorMuted: "#45191E",

  star: palette.amber400,
  overlay: "rgba(2, 6, 23, 0.72)",
  scrim: "rgba(2, 6, 23, 0.55)",
  heroShade: "rgba(2, 6, 23, 0.35)",
  glass: "rgba(19, 27, 46, 0.88)",
  skeleton: "#1E293B",
  inverseSurface: palette.slate100,
  inverseText: palette.slate900,
  brandTint: "rgba(129, 140, 248, 0.12)",
  accentTint: "rgba(167, 139, 250, 0.14)",
  locationHalo: "rgba(129, 140, 248, 0.25)",

  mapBackground: "#111A2C",
  mapWater: "#16294A",
  mapPark: "#13291F",
  mapRoad: "#1F2A40",

  white: palette.white,
};
