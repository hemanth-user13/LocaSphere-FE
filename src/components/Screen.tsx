import { router } from "expo-router";
import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

import { layout, makeStyles, spacing, useTheme } from "@/theme";

import { AppText } from "./AppText";
import { IconButton } from "./IconButton";

type ScreenProps = {
  children: ReactNode;
  edges?: Edge[];
  background?: string;
  style?: StyleProp<ViewStyle>;
};

/** Safe-area aware screen container with the app background. */
export function Screen({ children, edges = ["top"], background, style }: ScreenProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  return (
    <SafeAreaView edges={edges} style={[styles.flex, { backgroundColor: background ?? colors.background }, style]}>
      {children}
    </SafeAreaView>
  );
}

type HeaderProps = {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  right?: ReactNode;
  large?: boolean;
};

export function ScreenHeader({ title, subtitle, showBack, onBack, right, large }: HeaderProps) {
  const styles = useStyles();
  return (
    <View style={[styles.header, large && styles.headerLarge]}>
      {showBack && (
        <IconButton
          icon="chevron-back"
          accessibilityLabel="Go back"
          onPress={onBack ?? (() => (router.canGoBack() ? router.back() : router.replace("/")))}
          size={40}
        />
      )}
      <View style={styles.flex}>
        {title && (
          <AppText variant={large ? "h1" : "h3"} accessibilityRole="header" numberOfLines={1}>
            {title}
          </AppText>
        )}
        {subtitle && (
          <AppText variant="caption" color="textSecondary" numberOfLines={1}>
            {subtitle}
          </AppText>
        )}
      </View>
      {right && <View style={styles.right}>{right}</View>}
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.sm,
    minHeight: 56,
  },
  headerLarge: { paddingTop: spacing.md, paddingBottom: spacing.md },
  right: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
}));
