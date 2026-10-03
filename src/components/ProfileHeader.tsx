import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { getCategory } from "@/data/categories";
import { colors, layout, radius, spacing } from "@/theme";
import type { User } from "@/types/models";

import { AppText } from "./AppText";
import { Avatar } from "./Avatar";
import { ProfileStats } from "./ProfileStats";
import { Tag } from "./Tag";

type Props = {
  user: User;
  actions?: ReactNode;
};

/** Shared header for the personal profile and public creator profiles. */
export function ProfileHeader({ user, actions }: Props) {
  return (
    <View>
      <View style={styles.cover}>
        <View style={[styles.orb, { width: 220, height: 220, top: -90, right: -40 }]} />
        <View style={[styles.orb, { width: 140, height: 140, top: 20, left: -50, borderColor: "rgba(124,58,237,0.14)" }]} />
      </View>

      <View style={styles.body}>
        <View style={styles.avatarRow}>
          <Avatar uri={user.avatar} name={user.name} size={92} ring />
          {user.isCreator && (
            <View style={styles.creatorBadge}>
              <Ionicons name="sparkles" size={12} color={colors.white} />
              <AppText variant="label" style={{ color: colors.white }}>
                Creator
              </AppText>
            </View>
          )}
        </View>

        <View style={styles.nameRow}>
          <AppText variant="h1">{user.name}</AppText>
          {user.isVerified && <Ionicons name="checkmark-circle" size={20} color={colors.accent} accessibilityLabel="Verified" />}
        </View>
        <AppText variant="callout" color="textSecondary">
          @{user.handle}
        </AppText>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
          <AppText variant="caption" color="textSecondary">
            {user.location}
          </AppText>
        </View>
        {!!user.bio && (
          <AppText variant="body" style={styles.bio}>
            {user.bio}
          </AppText>
        )}
        {!!user.topCategories?.length && (
          <View style={styles.tags}>
            {user.topCategories.map((id) => {
              const c = getCategory(id);
              return <Tag key={id} label={c.label} icon={c.icon} tone="primary" />;
            })}
          </View>
        )}

        <View style={styles.stats}>
          <ProfileStats stats={user.stats} />
        </View>
        {actions && <View style={styles.actions}>{actions}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    height: 110,
    backgroundColor: colors.primarySoft,
    overflow: "hidden",
    marginHorizontal: layout.screenPadding,
    borderRadius: radius.xl,
  },
  orb: { position: "absolute", borderRadius: 999, borderWidth: 24, borderColor: "rgba(79,70,229,0.10)" },
  body: { paddingHorizontal: layout.screenPadding, marginTop: -52, gap: 2 },
  avatarRow: { flexDirection: "row", alignItems: "flex-end", gap: spacing.md, marginLeft: spacing.lg, marginBottom: spacing.md },
  creatorBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    marginBottom: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },
  nameRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs + 2 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: spacing.xs },
  bio: { marginTop: spacing.md },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.md },
  stats: { marginTop: spacing.lg },
  actions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
});
