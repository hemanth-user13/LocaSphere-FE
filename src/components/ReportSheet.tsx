import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { contentService } from "@/services";
import { colors, radius, spacing } from "@/theme";
import type { ID, ReportReason } from "@/types/models";
import { haptics } from "@/utils/haptics";

import { AppText } from "./AppText";
import { BottomSheet } from "./BottomSheet";
import { Button } from "./Button";
import { useToast } from "./Toast";

const REASONS: { value: ReportReason; label: string; hint: string }[] = [
  { value: "spam", label: "Spam or advertising", hint: "Promotional or repetitive content" },
  { value: "inappropriate", label: "Inappropriate content", hint: "Offensive, unsafe or explicit" },
  { value: "misleading", label: "Misleading information", hint: "Wrong location, fake reviews" },
  { value: "closed", label: "Permanently closed", hint: "This place no longer exists" },
  { value: "other", label: "Something else", hint: "Tell our moderation team" },
];

type Props = { contentId: ID; visible: boolean; onClose: () => void };

export function ReportSheet({ contentId, visible, onClose }: Props) {
  const toast = useToast();
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!reason) return;
    setSubmitting(true);
    try {
      await contentService.report(contentId, reason);
      haptics.success();
      onClose();
      setReason(null);
      toast({ message: "Thanks — our team will review this.", tone: "success" });
    } catch {
      toast({ message: "Couldn't send report. Try again.", tone: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Report content"
      subtitle="Reports are anonymous. Help keep LocaSphere trustworthy."
      footer={<Button title="Submit report" onPress={submit} disabled={!reason} loading={submitting} />}
    >
      <View style={styles.list} accessibilityRole="radiogroup">
        {REASONS.map((r) => {
          const selected = reason === r.value;
          return (
            <Pressable
              key={r.value}
              onPress={() => setReason(r.value)}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              style={[styles.option, selected && styles.optionSelected]}
            >
              <View style={styles.flex}>
                <AppText variant="bodyMedium">{r.label}</AppText>
                <AppText variant="caption" color="textSecondary">
                  {r.hint}
                </AppText>
              </View>
              <Ionicons
                name={selected ? "radio-button-on" : "radio-button-off"}
                size={22}
                color={selected ? colors.primary : colors.textMuted}
              />
            </Pressable>
          );
        })}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md + 2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  flex: { flex: 1, gap: 2 },
});
