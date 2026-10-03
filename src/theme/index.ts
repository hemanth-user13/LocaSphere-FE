import { colors, palette } from "./colors";
import { radius } from "./radius";
import { shadows } from "./shadows";
import { layout, spacing } from "./spacing";
import { typography } from "./typography";

export { colors, layout, palette, radius, shadows, spacing, typography };
export type { ColorToken } from "./colors";
export type { RadiusToken } from "./radius";
export type { SpacingToken } from "./spacing";
export type { TypographyVariant } from "./typography";

export const theme = { colors, palette, spacing, layout, radius, shadows, typography } as const;
export type Theme = typeof theme;
