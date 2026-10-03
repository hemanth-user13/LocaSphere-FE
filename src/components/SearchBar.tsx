import { Ionicons } from "@expo/vector-icons";
import { forwardRef, useState } from "react";
import { Pressable, StyleSheet, TextInput, View, type StyleProp, type ViewStyle } from "react-native";

import { colors, radius, spacing, typography } from "@/theme";

import { AppText } from "./AppText";

type Props = {
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  /** When set, the bar renders as a button (e.g. Home → Search screen). */
  onPress?: () => void;
  onFilterPress?: () => void;
  activeFilterCount?: number;
  style?: StyleProp<ViewStyle>;
};

export const SearchBar = forwardRef<TextInput, Props>(function SearchBar(
  {
    value,
    onChangeText,
    onSubmit,
    placeholder = "Search places, activities...",
    autoFocus,
    onPress,
    onFilterPress,
    activeFilterCount = 0,
    style,
  },
  ref,
) {
  const [focused, setFocused] = useState(false);

  const field = onPress ? (
    <Pressable
      onPress={onPress}
      accessibilityRole="search"
      accessibilityLabel={placeholder}
      style={({ pressed }) => [styles.field, pressed && { backgroundColor: colors.surfaceMuted }]}
    >
      <Ionicons name="search" size={20} color={colors.textMuted} />
      <AppText variant="body" color="textMuted" style={styles.flex} numberOfLines={1}>
        {placeholder}
      </AppText>
    </Pressable>
  ) : (
    <View style={[styles.field, focused && styles.fieldFocused]}>
      <Ionicons name="search" size={20} color={focused ? colors.primary : colors.textMuted} />
      <TextInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={(e) => onSubmit?.(e.nativeEvent.text)}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        autoFocus={autoFocus}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="never"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[styles.input, styles.flex]}
        accessibilityLabel="Search"
      />
      {!!value && (
        <Pressable onPress={() => onChangeText?.("")} hitSlop={12} accessibilityLabel="Clear search">
          <Ionicons name="close-circle" size={18} color={colors.textMuted} />
        </Pressable>
      )}
    </View>
  );

  return (
    <View style={[styles.row, style]}>
      <View style={styles.flex}>{field}</View>
      {onFilterPress && (
        <Pressable
          onPress={onFilterPress}
          accessibilityRole="button"
          accessibilityLabel={`Filters${activeFilterCount ? `, ${activeFilterCount} active` : ""}`}
          style={({ pressed }) => [
            styles.filter,
            activeFilterCount > 0 && styles.filterActive,
            pressed && { opacity: 0.8 },
          ]}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={activeFilterCount > 0 ? colors.white : colors.text}
          />
          {activeFilterCount > 0 && (
            <View style={styles.count}>
              <AppText variant="label" style={{ color: colors.primary, fontSize: 10, lineHeight: 12 }}>
                {activeFilterCount}
              </AppText>
            </View>
          )}
        </Pressable>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  flex: { flex: 1 },
  field: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fieldFocused: { borderColor: colors.primary },
  input: { ...typography.body, color: colors.text, height: "100%", paddingVertical: 0 },
  filter: {
    width: 50,
    height: 50,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  count: {
    position: "absolute",
    top: 7,
    right: 7,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
});
