import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";

import { AppText, Avatar, Button, ErrorState, LoadingState, Screen, ScreenHeader, TextField, useToast } from "@/components";
import { useAuth } from "@/context/AuthContext";
import { useResource } from "@/hooks/useResource";
import { usersService, type ProfileUpdate } from "@/services";
import { colors, layout, spacing } from "@/theme";
import type { User } from "@/types/models";

function EditForm({ user }: { user: User }) {
  const toast = useToast();
  const { updateUser } = useAuth();
  const [form, setForm] = useState<Required<ProfileUpdate>>({
    name: user.name,
    bio: user.bio,
    location: user.location,
    avatar: user.avatar,
  });
  const [saving, setSaving] = useState(false);
  const set = (patch: ProfileUpdate) => setForm((f) => ({ ...f, ...patch }));
  const nameError = form.name.trim().length < 2 ? "Name is required" : undefined;

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!result.canceled) set({ avatar: result.assets[0].uri });
  };

  const save = async () => {
    if (nameError) return;
    setSaving(true);
    try {
      updateUser(await usersService.updateMe({ ...form, name: form.name.trim(), bio: form.bio.trim() }));
      toast({ message: "Profile updated", tone: "success" });
      router.back();
    } catch {
      toast({ message: "Couldn't save changes", tone: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Pressable onPress={pickAvatar} style={styles.avatar} accessibilityRole="button" accessibilityLabel="Change profile photo">
          <Avatar uri={form.avatar} name={form.name || user.name} size={104} />
          <View style={styles.camera}>
            <Ionicons name="camera" size={16} color={colors.white} />
          </View>
          <AppText variant="calloutStrong" color="primary">
            Change photo
          </AppText>
        </Pressable>
        <TextField label="Name" value={form.name} onChangeText={(name) => set({ name })} maxLength={50} error={nameError} />
        <TextField
          label="Bio"
          value={form.bio}
          onChangeText={(bio) => set({ bio })}
          multiline
          maxLength={160}
          showCount
          placeholder="What do you love discovering?"
        />
        <TextField label="Location" value={form.location} onChangeText={(location) => set({ location })} />
      </ScrollView>
      <View style={styles.footer}>
        <Button title="Save changes" onPress={save} loading={saving} disabled={!!nameError} />
      </View>
    </KeyboardAvoidingView>
  );
}

export default function EditProfileScreen() {
  const { data, error, isLoading, reload } = useResource(() => usersService.getMe());
  return (
    <Screen edges={Platform.OS === "ios" ? [] : ["top"]} background={colors.surface}>
      <ScreenHeader title="Edit profile" showBack />
      {isLoading ? (
        <LoadingState variant="row" count={2} />
      ) : error || !data ? (
        <ErrorState message={error?.message} onRetry={() => reload()} />
      ) : (
        <EditForm user={data} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: layout.screenPadding, gap: spacing.xl, paddingBottom: spacing.xxl },
  avatar: { alignItems: "center", gap: spacing.sm, alignSelf: "center" },
  camera: {
    position: "absolute",
    top: 72,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: { padding: layout.screenPadding, borderTopWidth: 1, borderTopColor: colors.borderSubtle },
});
