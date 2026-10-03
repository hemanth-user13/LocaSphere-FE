import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeOut, ZoomIn } from "react-native-reanimated";

import { AppText, Logo } from "@/components";
import { colors, spacing } from "@/theme";

const SPLASH_DURATION_MS = 1600;

/**
 * Branded launch screen. Rendered by the root layout as an overlay on top of
 * the navigator (which resolves auth/onboarding redirects underneath), then
 * fades out. The native splash (app.json) uses the same indigo background so
 * the hand-off is seamless.
 */
export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const t = setTimeout(onFinish, SPLASH_DURATION_MS);
    return () => clearTimeout(t);
  }, [onFinish]);

  return (
    <Animated.View exiting={FadeOut.duration(300)} style={styles.root}>
      <StatusBar style="light" />
      {/* Soft orbit rings echo the logo mark */}
      <Animated.View entering={FadeIn.duration(900)} style={[styles.ring, { width: 520, height: 520 }]} />
      <Animated.View entering={FadeIn.delay(150).duration(900)} style={[styles.ring, { width: 360, height: 360 }]} />

      <Animated.View entering={ZoomIn.duration(500)}>
        <Logo size={88} tone="light" />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(250).duration(500)} style={styles.text}>
        <AppText variant="display" style={{ color: colors.white }}>
          LocaSphere
        </AppText>
        <AppText variant="body" style={{ color: "rgba(255,255,255,0.78)" }}>
          Discover what&apos;s around you.
        </AppText>
      </Animated.View>
      <View style={styles.footer}>
        <AppText variant="caption" style={{ color: "rgba(255,255,255,0.6)" }}>
          Made for Hyderabad explorers
        </AppText>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1000,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  ring: {
    position: "absolute",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  text: { alignItems: "center", gap: spacing.xs, marginTop: spacing.xl },
  footer: { position: "absolute", bottom: 48 },
});
