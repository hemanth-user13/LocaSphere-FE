import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { palette } from "@/constants/palette";
import { useAuth } from "@/context/auth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

type FormErrors = { email?: string; password?: string; general?: string };

export default function Login() {
  const { login } = useAuth();
  const passwordRef = useRef<TextInput>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const next: FormErrors = {};
    if (!email.trim()) next.email = "Email is required";
    if (!password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      // Dummy login: any email + password is accepted.
      // TODO: replace with the Django API call.
      await new Promise((r) => setTimeout(r, 800));

      login(email.trim());
      router.replace("/(tabs)");
    } catch {
      setErrors({ general: "Unable to connect. Check your internet and try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Decorative background shapes */}
      <View className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-100 opacity-60" />
      <View className="absolute -left-16 top-40 h-40 w-40 rounded-full bg-brand-50" />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Brand + heading */}
          <Animated.View entering={FadeInDown.duration(600)}>
            <View className="mb-10 mt-12">
              <View className="mb-8 flex-row items-center">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-brand-600">
                  <Ionicons name="layers" size={24} color={palette.white} />
                </View>
                <Text className="ml-3 text-2xl font-extrabold tracking-tight text-ink-900">
                  Trio
                </Text>
              </View>

              <Text className="text-3xl font-bold tracking-tight text-ink-900">
                Welcome back
              </Text>
              <Text className="mt-2 text-base leading-6 text-slate-500">
                Sign in to manage your organizations and documents.
              </Text>
            </View>
          </Animated.View>

          {/* Form */}
          <Animated.View entering={FadeInDown.delay(150).duration(600)}>
            {errors.general ? (
              <View className="mb-5 flex-row items-center rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                <Ionicons name="warning-outline" size={18} color={palette.danger} />
                <Text className="ml-2 flex-1 text-sm text-red-600">{errors.general}</Text>
              </View>
            ) : null}

            <FormInput
              label="Email address"
              icon="mail-outline"
              placeholder="name@company.com"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
              }}
              error={errors.email}
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />

            <FormInput
              ref={passwordRef}
              label="Password"
              icon="lock-closed-outline"
              placeholder="Enter your password"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
              }}
              error={errors.password}
              isPassword
              autoComplete="password"
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={handleLogin}
            />

            {/* Remember me + Forgot password */}
            <View className="mb-8 flex-row items-center justify-between">
              <Pressable
                className="flex-row items-center"
                onPress={() => setRememberMe((r) => !r)}
                hitSlop={8}
              >
                <View
                  className={`h-5 w-5 items-center justify-center rounded-md border-[1.5px] ${
                    rememberMe ? "border-brand-600 bg-brand-600" : "border-slate-300 bg-white"
                  }`}
                >
                  {rememberMe && <Ionicons name="checkmark" size={14} color={palette.white} />}
                </View>
                <Text className="ml-2 text-sm text-slate-600">Remember me</Text>
              </Pressable>

              <Pressable hitSlop={8} onPress={() => {}}>
                <Text className="text-sm font-semibold text-brand-600">Forgot password?</Text>
              </Pressable>
            </View>

            <Button title="Sign in" onPress={handleLogin} loading={isLoading} />
          </Animated.View>

          {/* Divider + social */}
          <Animated.View entering={FadeInUp.delay(300).duration(600)}>
            <View className="my-8 flex-row items-center">
              <View className="h-px flex-1 bg-slate-200" />
              <Text className="mx-4 text-xs font-medium uppercase tracking-wider text-slate-400">
                or continue with
              </Text>
              <View className="h-px flex-1 bg-slate-200" />
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Button variant="outline" title="Google" icon="logo-google" onPress={() => {}} />
              </View>
              <View className="flex-1">
                <Button variant="outline" title="Apple" icon="logo-apple" onPress={() => {}} />
              </View>
            </View>
          </Animated.View>

          {/* Footer */}
          <View className="mt-auto pt-10">
            <View className="flex-row justify-center">
              <Text className="text-sm text-slate-500">Don&apos;t have an account? </Text>
              <Pressable hitSlop={8} onPress={() => {}}>
                <Text className="text-sm font-semibold text-brand-600">Create account</Text>
              </Pressable>
            </View>
            <Text className="mt-4 text-center text-xs leading-5 text-slate-400">
              By signing in, you agree to our{" "}
              <Text className="font-medium text-slate-600">Terms of Service</Text> and{" "}
              <Text className="font-medium text-slate-600">Privacy Policy</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
