import { forwardRef } from "react";
import { TextInput, type TextInputProps } from "react-native";

import { useTheme } from "@/theme";

/**
 * TextInput with theme-aware defaults: keyboard appearance (dark keyboard in
 * dark mode on iOS), placeholder colour and brand-coloured caret/selection.
 */
export const AppTextInput = forwardRef<TextInput, TextInputProps>(function AppTextInput(props, ref) {
  const { colors, isDark } = useTheme();
  return (
    <TextInput
      ref={ref}
      keyboardAppearance={isDark ? "dark" : "light"}
      placeholderTextColor={colors.textMuted}
      selectionColor={colors.primary}
      cursorColor={colors.primary}
      {...props}
    />
  );
});
