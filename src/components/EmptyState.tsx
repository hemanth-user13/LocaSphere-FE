import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import { makeStyles, radius, spacing, useTheme } from "@/theme";
import type { IconName } from "@/types/models";

import { AppText } from "./AppText";
import { Button } from "./Button";

type Props = {
  icon?: IconName;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: "primary" | "error";
  compact?: boolean;
};

export function EmptyState({
  icon = "compass-outline",
  title,
  message,
  actionLabel,
  onAction,
  tone = "primary",
  compact,
}: Props) {
  const { colors } = useTheme();
  const styles = useStyles();
  const isError = tone === "error";
  return (
    <View style={[styles.container, compact && { paddingVertical: spacing.xl }]}>
      <View style={[styles.iconWrap, { backgroundColor: isError ? colors.errorSoft : colors.primarySoft }]}>
        <View style={[styles.iconInner, { backgroundColor: isError ? colors.errorMuted : colors.primaryMuted }]}>
          <Ionicons name={icon} size={28} color={isError ? colors.error : colors.primary} />
        </View>
      </View>
      <AppText variant="h3" align="center">
        {title}
      </AppText>
      {message && (
        <AppText variant="callout" color="textSecondary" align="center" style={styles.message}>
          {message}
        </AppText>
      )}
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant={isError ? "outline" : "secondary"}
          size="md"
          fullWidth={false}
          icon={isError ? "refresh" : undefined}
          style={{ marginTop: spacing.lg, alignSelf: "center" }}
        />
      )}
    </View>
  );
}

/** Error variant with retry, used whenever a resource fails to load. */
export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <EmptyState
      tone="error"
      icon="cloud-offline-outline"
      title="Couldn't load this"
      message={message ?? "Something went wrong on our side. Please try again."}
      actionLabel={onRetry ? "Try again" : undefined}
      onAction={onRetry}
    />
  );
}

const useStyles = makeStyles((colors) => ({
  container: {
    alignItems: "center",
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  iconInner: {
    width: 60,
    height: 60,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  message: { maxWidth: 300 },
}));
