import { darkColors, lightColors, palette } from "./colors";
import { radius } from "./radius";
import { shadows } from "./shadows";
import { layout, spacing } from "./spacing";
import { typography } from "./typography";

export { darkColors, layout, lightColors, palette, radius, shadows, spacing, typography };
export { makeStyles, ThemeProvider, useTheme } from "./ThemeProvider";
export type { ColorScheme, ThemePreference } from "./ThemeProvider";
export type { Colors, ColorToken } from "./colors";
export type { RadiusToken } from "./radius";
export type { SpacingToken } from "./spacing";
export type { TypographyVariant } from "./typography";

/** Scheme-independent tokens. Colours come from `useTheme()`. */
export const theme = { palette, spacing, layout, radius, shadows, typography } as const;
