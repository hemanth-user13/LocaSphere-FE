import type { TextStyle } from "react-native";

/**
 * Type scale. Uses the platform system font (SF Pro / Roboto) for crisp
 * rendering; swap `fontFamily` here if a brand font is added via expo-font.
 */
export const typography = {
  display: { fontSize: 30, lineHeight: 36, fontWeight: "800", letterSpacing: -0.6 },
  h1: { fontSize: 24, lineHeight: 30, fontWeight: "700", letterSpacing: -0.4 },
  h2: { fontSize: 20, lineHeight: 26, fontWeight: "700", letterSpacing: -0.3 },
  h3: { fontSize: 17, lineHeight: 22, fontWeight: "600", letterSpacing: -0.2 },
  body: { fontSize: 15, lineHeight: 22, fontWeight: "400" },
  bodyMedium: { fontSize: 15, lineHeight: 22, fontWeight: "500" },
  bodyStrong: { fontSize: 15, lineHeight: 22, fontWeight: "600" },
  callout: { fontSize: 14, lineHeight: 20, fontWeight: "400" },
  calloutStrong: { fontSize: 14, lineHeight: 20, fontWeight: "600" },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: "400" },
  captionStrong: { fontSize: 13, lineHeight: 18, fontWeight: "600" },
  label: { fontSize: 12, lineHeight: 16, fontWeight: "600", letterSpacing: 0.2 },
  overline: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
