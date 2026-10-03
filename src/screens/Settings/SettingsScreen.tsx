import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Switch, View } from "react-native";

import { AppText, Avatar, Screen, ScreenHeader, useToast } from "@/components";
import { useAuth } from "@/context/AuthContext";
import { config } from "@/services";
import { colors, layout, radius, spacing } from "@/theme";
import type { IconName } from "@/types/models";

type RowProps = {
  icon: IconName;
  label: string;
  value?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  destructive?: boolean;
};

function Row({ icon, label, value, onPress, right, destructive }: RowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.background }]}
      accessibilityRole={onPress ? "button" : undefined}
    >
      <View style={[styles.rowIcon, destructive && { backgroundColor: colors.errorSoft }]}>
        <Ionicons name={icon} size={18} color={destructive ? colors.error : colors.primary} />
      </View>
      <AppText variant="bodyMedium" style={[styles.flex, destructive && { color: colors.error }]}>
        {label}
      </AppText>
      {value && (
        <AppText variant="callout" color="textSecondary">
          {value}
        </AppText>
      )}
      {right ?? (onPress && !destructive && <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />)}
    </Pressable>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText variant="overline" color="textSecondary" style={styles.sectionTitle}>
        {title}
      </AppText>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

export default function SettingsScreen() {
  const { session, signOut } = useAuth();
  const toast = useToast();
  const [notifications, setNotifications] = useState(true);
  const [nearbyAlerts, setNearbyAlerts] = useState(false);
  const soon = (what: string) => () => toast({ message: `${what} is coming soon`, icon: "construct-outline" });
  const user = session?.user;

  const confirmSignOut = () =>
    Alert.alert("Log out?", "You can sign back in any time with your mobile number.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/login");
        },
      },
    ]);

  return (
    <Screen>
      <ScreenHeader showBack title="Settings" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {user && (
          <Pressable style={[styles.card, styles.account]} onPress={() => router.push("/edit-profile")}>
            <Avatar uri={user.avatar} name={user.name} size={52} />
            <View style={styles.flex}>
              <AppText variant="h3">{user.name}</AppText>
              <AppText variant="caption" color="textSecondary">
                @{user.handle}
              </AppText>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        )}

        <Section title="Account">
          <Row icon="person-outline" label="Edit profile" onPress={() => router.push("/edit-profile")} />
          <Row icon="call-outline" label="Mobile number" value="+91 ••••• 43210" />
          <Row icon="lock-closed-outline" label="Privacy" onPress={soon("Privacy settings")} />
        </Section>

        <Section title="Preferences">
          <Row icon="location-outline" label="Home city" value={config.defaultCity} onPress={soon("City selection")} />
          <Row
            icon="notifications-outline"
            label="Push notifications"
            right={<Switch value={notifications} onValueChange={setNotifications} trackColor={{ true: colors.primary, false: colors.border }} thumbColor={colors.white} />}
          />
          <Row
            icon="navigate-circle-outline"
            label="Nearby event alerts"
            right={<Switch value={nearbyAlerts} onValueChange={setNearbyAlerts} trackColor={{ true: colors.primary, false: colors.border }} thumbColor={colors.white} />}
          />
        </Section>

        <Section title="Support">
          <Row icon="help-circle-outline" label="Help center" onPress={soon("Help center")} />
          <Row icon="shield-checkmark-outline" label="Community guidelines" onPress={soon("Guidelines")} />
          <Row icon="document-text-outline" label="Terms & privacy" onPress={soon("Terms")} />
        </Section>

        <View style={styles.section}>
          <View style={styles.card}>
            <Row icon="log-out-outline" label="Log out" destructive onPress={confirmSignOut} />
          </View>
        </View>

        <AppText variant="caption" color="textMuted" align="center">
          LocaSphere v{Constants.expoConfig?.version ?? "1.0.0"} · {config.useMocks ? "Demo data" : "Live"}
        </AppText>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: layout.screenPadding, paddingBottom: spacing.xxxl, gap: spacing.xl },
  account: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.lg },
  section: { gap: spacing.sm },
  sectionTitle: { marginLeft: spacing.xs },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    minHeight: 56,
    paddingHorizontal: spacing.lg,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.sm + 2,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
});
