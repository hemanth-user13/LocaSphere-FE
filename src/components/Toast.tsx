import { Ionicons } from "@expo/vector-icons";
import { createContext, ReactNode, useCallback, useContext, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, radius, shadows, spacing } from "@/theme";
import type { IconName } from "@/types/models";

import { AppText } from "./AppText";

type ToastOptions = { message: string; icon?: IconName; tone?: "default" | "success" | "error" };

const ToastContext = createContext<(options: ToastOptions) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<(ToastOptions & { key: number }) | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = useCallback((options: ToastOptions) => {
    clearTimeout(timer.current);
    setToast({ ...options, key: Date.now() });
    timer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  const iconColor =
    toast?.tone === "error" ? colors.error : toast?.tone === "success" ? colors.success : colors.primaryMuted;

  return (
    <ToastContext.Provider value={show}>
      {children}
      <View pointerEvents="none" style={[styles.host, { top: insets.top + spacing.sm }]}>
        {toast && (
          <Animated.View
            key={toast.key}
            entering={FadeInUp.duration(220)}
            exiting={FadeOutUp.duration(180)}
            style={[styles.toast, shadows.md]}
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
          >
            <Ionicons
              name={toast.icon ?? (toast.tone === "error" ? "alert-circle" : "checkmark-circle")}
              size={18}
              color={iconColor}
            />
            <AppText variant="calloutStrong" style={{ color: colors.white, flexShrink: 1 }}>
              {toast.message}
            </AppText>
          </Animated.View>
        )}
      </View>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
  host: { position: "absolute", left: 0, right: 0, alignItems: "center", zIndex: 100 },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    maxWidth: "90%",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.text,
  },
});
