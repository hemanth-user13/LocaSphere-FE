import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, View } from "react-native";

import { makeStyles, radius, spacing, useTheme } from "@/theme";
import type { Review, User } from "@/types/models";
import { formatRelativeTime } from "@/utils/format";

import { AppText } from "./AppText";
import { Avatar } from "./Avatar";
import { Stars } from "./Rating";

type Props = {
  review: Review;
  author?: User;
  /** Shown instead of the author (e.g. on the reviewer's own profile). */
  heading?: string;
};

export function ReviewItem({ review, author, heading }: Props) {
  const { colors } = useTheme();
  const styles = useStyles();
  const [helpful, setHelpful] = useState(false);
  const name = heading ?? author?.name ?? "LocaSphere member";

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {!heading && <Avatar uri={author?.avatar} name={name} size={36} />}
        <View style={styles.flex}>
          <AppText variant="calloutStrong" numberOfLines={1}>
            {name}
          </AppText>
          <View style={styles.meta}>
            <Stars value={review.rating} size={12} />
            <AppText variant="caption" color="textMuted">
              · {formatRelativeTime(review.createdAt)}
            </AppText>
          </View>
        </View>
      </View>
      <AppText variant="callout" color="textSecondary">
        {review.text}
      </AppText>
      <Pressable
        onPress={() => setHelpful((h) => !h)}
        hitSlop={8}
        style={styles.helpful}
        accessibilityRole="button"
        accessibilityState={{ selected: helpful }}
      >
        <Ionicons
          name={helpful ? "thumbs-up" : "thumbs-up-outline"}
          size={14}
          color={helpful ? colors.primary : colors.textSecondary}
        />
        <AppText variant="captionStrong" color={helpful ? "primary" : "textSecondary"}>
          Helpful · {review.helpfulCount + (helpful ? 1 : 0)}
        </AppText>
      </Pressable>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  card: {
    gap: spacing.sm + 2,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  flex: { flex: 1, gap: 2 },
  meta: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  helpful: { flexDirection: "row", alignItems: "center", gap: spacing.xs + 2, alignSelf: "flex-start", minHeight: 28 },
}));
