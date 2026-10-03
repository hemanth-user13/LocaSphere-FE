import { Text, type TextProps } from "react-native";

import { typography, useTheme, type ColorToken, type TypographyVariant } from "@/theme";

export type AppTextProps = TextProps & {
  variant?: TypographyVariant;
  color?: ColorToken;
  align?: "left" | "center" | "right";
};

/** Typography primitive — every piece of text in the app goes through the type scale. */
export function AppText({ variant = "body", color = "text", align, style, ...props }: AppTextProps) {
  const { colors } = useTheme();
  return (
    <Text
      {...props}
      style={[typography[variant], { color: colors[color] }, align && { textAlign: align }, style]}
    />
  );
}
