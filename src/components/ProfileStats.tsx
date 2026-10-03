import { Pressable, View } from "react-native";

import { makeStyles, radius, spacing } from "@/theme";
import type { User } from "@/types/models";
import { formatCount } from "@/utils/format";

import { AppText } from "./AppText";

export function ProfileStats({ stats }: { stats: User["stats"] }) {
  const styles = useStyles();
  const items = [
    { label: "Posts", value: stats.posts },
    { label: "Followers", value: stats.followers },
    { label: "Following", value: stats.following },
  ];
  return (
    <View style={styles.row}>
      {items.map((s, i) => (
        <Pressable
          key={s.label}
          style={[styles.item, i > 0 && styles.divider]}
          accessibilityLabel={`${s.value} ${s.label}`}
        >
          <AppText variant="h2">{formatCount(s.value)}</AppText>
          <AppText variant="caption" color="textSecondary">
            {s.label}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  row: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingVertical: spacing.md + 2,
  },
  item: { flex: 1, alignItems: "center", gap: 2 },
  divider: { borderLeftWidth: 1, borderLeftColor: colors.borderSubtle },
}));
