import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText, Button, Logo, useToast } from "@/components";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services";
import { colors, layout, radius, spacing, typography } from "@/theme";
import { formatPhone } from "@/utils/format";
import { haptics } from "@/utils/haptics";

const COUNTRY_CODE = "+91";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const toast = useToast();
  const [digits, setDigits] = useState("");
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<"otp" | "google" | null>(null);

  // Indian mobile numbers: 10 digits starting 6–9.
  const isValid = /^[6-9]\d{9}$/.test(digits);

  const onChange = (text: string) => {
    setDigits(text.replace(/\D/g, "").slice(0, 10));
    if (error) setError(undefined);
  };

  const continueWithPhone = async () => {
    if (!isValid) {
      setError("Enter a valid 10-digit mobile number");
      haptics.error();
      return;
    }
    setLoading("otp");
    try {
      const phone = `${COUNTRY_CODE}${digits}`;
      const { resendAfterSeconds } = await authService.requestOtp(phone);
      router.push({ pathname: "/verify", params: { phone, resendAfter: String(resendAfterSeconds) } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't send the code. Try again.");
    } finally {
      setLoading(null);
    }
  };

  const continueWithGoogle = async () => {
    setLoading("google");
    try {
      // TODO: obtain an ID token via expo-auth-session / Google Sign-In, then pass it here.
      signIn(await authService.signInWithGoogle());
      router.replace("/(tabs)");
    } catch {
      toast({ message: "Google sign-in failed. Try again.", tone: "error" });
    } finally {
      setLoading(null);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
            <Logo size={52} />
            <AppText variant="display" style={{ marginTop: spacing.xl }}>
              Welcome to LocaSphere
            </AppText>
            <AppText variant="body" color="textSecondary">
              Enter your mobile number. We&apos;ll send you a 6-digit code to sign in or create your account.
            </AppText>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(120).duration(500)} style={styles.form}>
            <AppText variant="calloutStrong">Mobile number</AppText>
            <View style={[styles.phoneField, focused && styles.phoneFocused, !!error && styles.phoneError]}>
              <View style={styles.country}>
                <AppText variant="bodyStrong">🇮🇳 {COUNTRY_CODE}</AppText>
                <Ionicons name="chevron-down" size={14} color={colors.textMuted} />
              </View>
              <View style={styles.divider} />
              <TextInput
                value={formatPhone(digits)}
                onChangeText={onChange}
                placeholder="98765 43210"
                placeholderTextColor={colors.textMuted}
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
                autoComplete="tel"
                maxLength={11}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={continueWithPhone}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                accessibilityLabel="Mobile number"
                style={styles.phoneInput}
              />
              {isValid && <Ionicons name="checkmark-circle" size={20} color={colors.success} />}
            </View>
            {error && (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle" size={14} color={colors.error} />
                <AppText variant="caption" style={{ color: colors.error }}>
                  {error}
                </AppText>
              </View>
            )}

            <Button
              title="Continue"
              onPress={continueWithPhone}
              loading={loading === "otp"}
              disabled={!isValid || loading === "google"}
              style={{ marginTop: spacing.lg }}
            />

            <View style={styles.orRow}>
              <View style={styles.line} />
              <AppText variant="overline" color="textMuted">
                or
              </AppText>
              <View style={styles.line} />
            </View>

            <Button
              title="Continue with Google"
              variant="outline"
              icon="logo-google"
              onPress={continueWithGoogle}
              loading={loading === "google"}
              disabled={loading === "otp"}
            />
          </Animated.View>

          <View style={styles.footer}>
            <Ionicons name="shield-checkmark-outline" size={16} color={colors.textMuted} />
            <AppText variant="caption" color="textMuted" align="center" style={styles.flex}>
              By continuing you agree to our <AppText variant="captionStrong" color="textSecondary">Terms</AppText> and{" "}
              <AppText variant="captionStrong" color="textSecondary">Privacy Policy</AppText>. We never share your number.
            </AppText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: layout.screenPadding + 4, paddingBottom: spacing.xl },
  header: { marginTop: spacing.xxl, gap: spacing.sm },
  form: { marginTop: spacing.xxl, gap: spacing.sm },
  phoneField: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  phoneFocused: { borderColor: colors.primary, backgroundColor: colors.surface },
  phoneError: { borderColor: colors.error },
  country: { flexDirection: "row", alignItems: "center", gap: 4 },
  divider: { width: 1, height: 24, backgroundColor: colors.border },
  phoneInput: { ...typography.h3, flex: 1, color: colors.text, letterSpacing: 1, height: "100%", paddingVertical: 0 },
  errorRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  orRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginVertical: spacing.lg },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  footer: {
    marginTop: "auto",
    paddingTop: spacing.xxl,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
});
