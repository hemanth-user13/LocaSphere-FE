import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText, Button, ScreenHeader, useToast } from "@/components";
import { useAuth } from "@/context/AuthContext";
import { useCountdown } from "@/hooks/useCountdown";
import { authService } from "@/services";
import { colors, layout, radius, spacing } from "@/theme";
import { haptics } from "@/utils/haptics";

const CODE_LENGTH = 6;

export default function VerifyOtpScreen() {
  const { phone = "", resendAfter = "30" } = useLocalSearchParams<{ phone: string; resendAfter?: string }>();
  const { signIn } = useAuth();
  const toast = useToast();
  const inputRef = useRef<TextInput>(null);
  const [code, setCode] = useState("");
  const [focused, setFocused] = useState(true);
  const [error, setError] = useState<string>();
  const [verifying, setVerifying] = useState(false);
  const countdown = useCountdown(Number(resendAfter));
  const shake = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.get() }] }));

  const verify = async (value = code) => {
    if (value.length !== CODE_LENGTH || verifying) return;
    setVerifying(true);
    setError(undefined);
    try {
      const session = await authService.verifyOtp(phone, value);
      haptics.success();
      signIn(session);
      router.replace("/(tabs)");
    } catch (e) {
      haptics.error();
      setError(e instanceof Error ? e.message : "Verification failed");
      shake.set(
        withSequence(
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-6, { duration: 50 }),
          withTiming(0, { duration: 50 }),
        ),
      );
      setCode("");
    } finally {
      setVerifying(false);
    }
  };

  const onChange = (text: string) => {
    const next = text.replace(/\D/g, "").slice(0, CODE_LENGTH);
    setCode(next);
    if (error) setError(undefined);
    if (next.length === CODE_LENGTH) verify(next);
  };

  const resend = async () => {
    try {
      const { resendAfterSeconds } = await authService.requestOtp(phone);
      countdown.restart(resendAfterSeconds);
      toast({ message: `New code sent to ${phone}`, icon: "chatbubble-ellipses" });
    } catch {
      toast({ message: "Couldn't resend the code", tone: "error" });
    }
  };

  const mm = Math.floor(countdown.remaining / 60);
  const ss = String(countdown.remaining % 60).padStart(2, "0");

  return (
    <SafeAreaView style={styles.root}>
      <ScreenHeader showBack />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.duration(450)} style={styles.header}>
            <View style={styles.badge}>
              <Ionicons name="chatbubble-ellipses" size={26} color={colors.primary} />
            </View>
            <AppText variant="h1">Verify your number</AppText>
            <AppText variant="body" color="textSecondary">
              Enter the 6-digit code sent to <AppText variant="bodyStrong">{phone}</AppText>
            </AppText>
          </Animated.View>

          {/* One hidden input drives six visual cells — supports paste & SMS autofill. */}
          <Pressable onPress={() => inputRef.current?.focus()} accessibilityLabel="One-time code">
            <Animated.View style={[styles.cells, shakeStyle]}>
              {Array.from({ length: CODE_LENGTH }, (_, i) => {
                const char = code[i];
                const isActive = focused && i === Math.min(code.length, CODE_LENGTH - 1);
                return (
                  <View
                    key={i}
                    style={[
                      styles.cell,
                      !!char && styles.cellFilled,
                      isActive && styles.cellActive,
                      !!error && styles.cellError,
                    ]}
                  >
                    <AppText variant="h1">{char ?? ""}</AppText>
                  </View>
                );
              })}
            </Animated.View>
          </Pressable>
          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={onChange}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
            maxLength={CODE_LENGTH}
            autoFocus
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={styles.hiddenInput}
            caretHidden
          />

          {error ? (
            <View style={styles.row}>
              <Ionicons name="alert-circle" size={14} color={colors.error} />
              <AppText variant="caption" style={{ color: colors.error }}>
                {error}
              </AppText>
            </View>
          ) : (
            <AppText variant="caption" color="textMuted">
              Demo: any 6 digits work · 000000 shows an error
            </AppText>
          )}

          <View style={styles.resendRow}>
            <AppText variant="callout" color="textSecondary">
              Didn&apos;t get it?
            </AppText>
            {countdown.isDone ? (
              <Pressable onPress={resend} hitSlop={10} accessibilityRole="button">
                <AppText variant="calloutStrong" color="primary">
                  Resend code
                </AppText>
              </Pressable>
            ) : (
              <AppText variant="calloutStrong" color="textMuted">
                Resend in {mm}:{ss}
              </AppText>
            )}
          </View>

          <View style={styles.flex} />
          <Button title="Verify" onPress={() => verify()} loading={verifying} disabled={code.length !== CODE_LENGTH} />
          <Pressable onPress={() => router.back()} hitSlop={8} style={styles.change} accessibilityRole="button">
            <AppText variant="calloutStrong" color="textSecondary" align="center">
              Change mobile number
            </AppText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  content: { flex: 1, paddingHorizontal: layout.screenPadding + 4, paddingBottom: spacing.lg, gap: spacing.lg },
  header: { gap: spacing.sm, marginTop: spacing.sm, marginBottom: spacing.sm },
  badge: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  cells: { flexDirection: "row", gap: spacing.sm },
  cell: {
    flex: 1,
    aspectRatio: 0.86,
    maxHeight: 64,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  cellFilled: { backgroundColor: colors.surface, borderColor: colors.primaryMuted },
  cellActive: { borderColor: colors.primary, backgroundColor: colors.surface },
  cellError: { borderColor: colors.error },
  hiddenInput: { position: "absolute", opacity: 0, width: 1, height: 1 },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  resendRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  change: { paddingVertical: spacing.sm },
});
