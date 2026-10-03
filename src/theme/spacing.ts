/** 8pt spacing system (with 4pt half-steps for tight UI). */
export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const layout = {
  screenPadding: spacing.lg,
  /** Minimum touch target (Apple HIG 44pt, Material 48dp). */
  touchTarget: 48,
  tabBarHeight: 64,
  maxContentWidth: 640,
} as const;

export type SpacingToken = keyof typeof spacing;
