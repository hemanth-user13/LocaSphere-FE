import { router } from "expo-router";
import { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import Animated, { FadeIn, useAnimatedStyle, withTiming } from "react-native-reanimated";

import { AppText, Button, Screen, useToast } from "@/components";
import { contentService } from "@/services";
import { layout, makeStyles, radius, spacing, useTheme } from "@/theme";
import type { DraftPost } from "@/types/models";
import { haptics } from "@/utils/haptics";

import { DetailsStep, PhotosStep, PlaceStep, ReviewStep } from "./CreateSteps";

const STEPS = ["Photos", "Details", "Place", "Publish"] as const;

const EMPTY_DRAFT: DraftPost = {
  photos: [],
  title: "",
  description: "",
  categoryId: null,
  kind: "place",
  location: null,
  tags: [],
};

/** Returns an error message if the step isn't complete yet. */
function validate(step: number, d: DraftPost): string | null {
  if (step === 0 && d.photos.length === 0) return "Add at least one photo";
  if (step === 1 && d.title.trim().length < 4) return "Give your post a title";
  if (step === 1 && d.description.trim().length < 20) return "Add a few more details to the description";
  if (step === 2 && !d.categoryId) return "Choose a category";
  if (step === 2 && !d.location) return "Add a location";
  return null;
}

export default function CreatePostScreen() {
  const { colors } = useTheme();
  const styles = useStyles();
  const toast = useToast();
  const scrollRef = useRef<ScrollView>(null);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<DraftPost>(EMPTY_DRAFT);
  const [busy, setBusy] = useState<"draft" | "publish" | null>(null);

  const update = (patch: Partial<DraftPost>) => setDraft((d) => ({ ...d, ...patch }));
  const isDirty = JSON.stringify(draft) !== JSON.stringify(EMPTY_DRAFT);
  const error = validate(step, draft);
  const isLast = step === STEPS.length - 1;

  const progressStyle = useAnimatedStyle(() => ({
    width: withTiming(`${((step + 1) / STEPS.length) * 100}%`, { duration: 250 }),
  }));

  const goTo = (next: number) => {
    setStep(next);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const reset = () => {
    setDraft(EMPTY_DRAFT);
    goTo(0);
  };

  const saveDraft = async () => {
    setBusy("draft");
    try {
      await contentService.saveDraft(draft);
      toast({ message: "Draft saved", icon: "document-text" });
    } catch {
      toast({ message: "Couldn't save draft", tone: "error" });
    } finally {
      setBusy(null);
    }
  };

  const publish = async () => {
    setBusy("publish");
    try {
      const created = await contentService.publish(draft);
      haptics.success();
      toast({ message: "Published! Your discovery is live.", tone: "success" });
      reset();
      router.push({ pathname: "/place/[id]", params: { id: created.id } });
    } catch {
      haptics.error();
      toast({ message: "Publishing failed. Please try again.", tone: "error" });
    } finally {
      setBusy(null);
    }
  };

  const next = () => {
    if (error) {
      haptics.error();
      toast({ message: error, tone: "error" });
      return;
    }
    if (isLast) publish();
    else goTo(step + 1);
  };

  return (
    <Screen background={colors.surface}>
      <View style={styles.header}>
        <View style={styles.flex}>
          <AppText variant="overline" color="primary">
            Step {step + 1} of {STEPS.length} · {STEPS[step]}
          </AppText>
          <AppText variant="h2">New discovery</AppText>
        </View>
        <Button
          title="Save draft"
          variant="ghost"
          size="sm"
          fullWidth={false}
          icon="document-text-outline"
          onPress={saveDraft}
          loading={busy === "draft"}
          disabled={!isDirty || busy === "publish"}
        />
      </View>

      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, progressStyle]} />
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View key={step} entering={FadeIn.duration(220)}>
            {step === 0 && <PhotosStep draft={draft} update={update} />}
            {step === 1 && <DetailsStep draft={draft} update={update} />}
            {step === 2 && <PlaceStep draft={draft} update={update} />}
            {step === 3 && <ReviewStep draft={draft} />}
          </Animated.View>
        </ScrollView>

        <View style={styles.footer}>
          {step > 0 && (
            <View style={styles.flex}>
              <Button title="Back" variant="outline" onPress={() => goTo(step - 1)} disabled={!!busy} />
            </View>
          )}
          <View style={styles.flex2}>
            <Button
              title={isLast ? "Publish" : "Continue"}
              iconRight={isLast ? "paper-plane" : "arrow-forward"}
              onPress={next}
              loading={busy === "publish"}
              disabled={busy === "draft"}
              style={!!error && { opacity: 0.6 }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  flex: { flex: 1 },
  flex2: { flex: 2 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  progressTrack: {
    height: 4,
    marginHorizontal: layout.screenPadding,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: radius.pill, backgroundColor: colors.primary },
  content: { padding: layout.screenPadding, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  footer: {
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    backgroundColor: colors.surface,
  },
}));
