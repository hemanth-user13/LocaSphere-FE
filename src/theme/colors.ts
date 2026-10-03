/**
 * LocaSphere colour tokens.
 * Components should reference semantic names (e.g. `colors.textSecondary`)
 * rather than raw hex values so the palette can be changed in one place.
 */
export const palette = {
  indigo50: "#EEF2FF",
  indigo100: "#E0E7FF",
  indigo200: "#C7D2FE",
  indigo500: "#6366F1",
  indigo600: "#4F46E5",
  indigo800: "#3730A3",
  violet50: "#F5F3FF",
  violet100: "#EDE9FE",
  violet600: "#7C3AED",
  slate50: "#F8FAFC",
  slate100: "#F1F5F9",
  slate200: "#E2E8F0",
  slate300: "#CBD5E1",
  slate400: "#94A3B8",
  slate500: "#64748B",
  slate700: "#334155",
  slate900: "#0F172A",
  emerald50: "#ECFDF5",
  emerald500: "#10B981",
  amber50: "#FFFBEB",
  amber500: "#F59E0B",
  red50: "#FEF2F2",
  red500: "#EF4444",
  white: "#FFFFFF",
  black: "#000000",
} as const;

export const colors = {
  primary: palette.indigo600,
  primaryDark: palette.indigo800,
  primarySoft: palette.indigo50,
  primaryMuted: palette.indigo100,
  accent: palette.violet600,
  accentSoft: palette.violet50,

  background: palette.slate50,
  surface: palette.white,
  surfaceMuted: palette.slate100,

  text: palette.slate900,
  textSecondary: palette.slate500,
  textMuted: palette.slate400,
  textOnPrimary: palette.white,

  border: palette.slate200,
  borderSubtle: palette.slate100,

  success: palette.emerald500,
  successSoft: palette.emerald50,
  warning: palette.amber500,
  warningSoft: palette.amber50,
  error: palette.red500,
  errorSoft: palette.red50,

  star: palette.amber500,
  overlay: "rgba(15, 23, 42, 0.45)",
  scrim: "rgba(15, 23, 42, 0.35)",
  glass: "rgba(255, 255, 255, 0.92)",
  skeleton: palette.slate200,
  white: palette.white,
} as const;

export type ColorToken = keyof typeof colors;
