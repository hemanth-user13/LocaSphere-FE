import { forwardRef, useState } from "react";
import { StyleSheet, TextInput, View, type TextInputProps } from "react-native";

import { colors, radius, spacing, typography } from "@/theme";

import { AppText } from "./AppText";

type Props = TextInputProps & {
  label: string;
  hint?: string;
  error?: string;
  maxLength?: number;
  showCount?: boolean;
};

export const TextField = forwardRef<TextInput, Props>(function TextField(
  { label, hint, error, maxLength, showCount, multiline, value, onFocus, onBlur, style, ...props },
  ref,
) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <AppText variant="calloutStrong">{label}</AppText>
        {showCount && maxLength && (
          <AppText variant="caption" color="textMuted">
            {value?.length ?? 0}/{maxLength}
          </AppText>
        )}
      </View>
      <TextInput
        ref={ref}
        value={value}
        maxLength={maxLength}
        multiline={multiline}
        placeholderTextColor={colors.textMuted}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        accessibilityLabel={label}
        style={[
          styles.input,
          multiline && styles.multiline,
          focused && styles.focused,
          !!error && styles.errored,
          style,
        ]}
        {...props}
      />
      {(error || hint) && (
        <AppText variant="caption" style={{ color: error ? colors.error : colors.textSecondary }}>
          {error ?? hint}
        </AppText>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  labelRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  input: {
    ...typography.body,
    color: colors.text,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  multiline: { minHeight: 120, textAlignVertical: "top", paddingTop: spacing.md },
  focused: { borderColor: colors.primary },
  errored: { borderColor: colors.error },
});
