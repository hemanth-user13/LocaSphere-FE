import type { ReactNode } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import Animated, { SlideInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, layout, radius, spacing } from "@/theme";

import { AppText } from "./AppText";
import { IconButton } from "./IconButton";

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

/**
 * Lightweight modal sheet (no native deps). Can be swapped for
 * @gorhom/bottom-sheet or a formSheet route if gestures are needed later.
 */
export function BottomSheet({ visible, onClose, title, subtitle, children, footer }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.root}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
        <Animated.View
          entering={SlideInDown.duration(280)}
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}
        >
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={styles.flex}>
              <AppText variant="h2">{title}</AppText>
              {subtitle && (
                <AppText variant="caption" color="textSecondary">
                  {subtitle}
                </AppText>
              )}
            </View>
            <IconButton icon="close" variant="soft" iconColor={colors.text} size={36} onPress={onClose} accessibilityLabel="Close" />
          </View>
          <View style={styles.content}>{children}</View>
          {footer && <View style={styles.footer}>{footer}</View>}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end", backgroundColor: colors.overlay },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingTop: spacing.sm,
    maxHeight: "88%",
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: layout.screenPadding + 4,
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  flex: { flex: 1 },
  content: { paddingHorizontal: layout.screenPadding + 4, paddingTop: spacing.sm },
  footer: { paddingHorizontal: layout.screenPadding + 4, paddingTop: spacing.lg, flexDirection: "row", gap: spacing.md },
});
