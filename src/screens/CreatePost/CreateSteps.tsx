import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

import { AppText, CategoryChip, PlaceCard, Tag, TextField, useToast } from "@/components";
import { CATEGORIES } from "@/data/categories";
import { useResource } from "@/hooks/useResource";
import { locationService } from "@/services";
import { makeStyles, radius, spacing, typography, useTheme } from "@/theme";
import type { ContentItem, ContentKind, DraftPost, IconName } from "@/types/models";
import { AppTextInput } from "@/components/AppTextInput";

export const MAX_PHOTOS = 6;
const SAMPLE_PHOTOS = [
  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80&auto=format&fit=crop",
];
const SUGGESTED_TAGS = ["work-friendly", "family", "budget", "date night", "outdoor", "pet friendly", "late night"];

type StepProps = { draft: DraftPost; update: (patch: Partial<DraftPost>) => void };

function StepIntro({ title, body }: { title: string; body: string }) {
  const styles = useStyles();
  return (
    <View style={styles.intro}>
      <AppText variant="h1">{title}</AppText>
      <AppText variant="callout" color="textSecondary">
        {body}
      </AppText>
    </View>
  );
}

// ---------------------------------------------------------------------------

export function PhotosStep({ draft, update }: StepProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const toast = useToast();

  const pick = async () => {
    const remaining = MAX_PHOTOS - draft.photos.length;
    if (remaining <= 0) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      toast({ message: "Allow photo access in Settings to add photos", tone: "error" });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.8,
    });
    if (!result.canceled) update({ photos: [...draft.photos, ...result.assets.map((a) => a.uri)].slice(0, MAX_PHOTOS) });
  };

  const remove = (uri: string) => update({ photos: draft.photos.filter((p) => p !== uri) });
  const makeCover = (uri: string) => update({ photos: [uri, ...draft.photos.filter((p) => p !== uri)] });

  return (
    <View style={styles.step}>
      <StepIntro title="Add photos" body="Great photos get 3× more saves. The first photo becomes your cover." />

      {draft.photos.length === 0 ? (
        <Pressable onPress={pick} style={styles.dropzone} accessibilityRole="button" accessibilityLabel="Add photos">
          <View style={styles.dropIcon}>
            <Ionicons name="images" size={28} color={colors.primary} />
          </View>
          <AppText variant="h3">Choose from gallery</AppText>
          <AppText variant="caption" color="textSecondary">
            Up to {MAX_PHOTOS} photos · JPG or PNG
          </AppText>
        </Pressable>
      ) : (
        <View style={styles.photoGrid}>
          {draft.photos.map((uri, i) => (
            <Pressable key={uri} onLongPress={() => makeCover(uri)} style={styles.photoTile} accessibilityLabel={`Photo ${i + 1}`}>
              <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" />
              {i === 0 && (
                <View style={styles.coverBadge}>
                  <AppText variant="label" style={{ color: colors.white }}>
                    Cover
                  </AppText>
                </View>
              )}
              <Pressable onPress={() => remove(uri)} hitSlop={10} style={styles.removePhoto} accessibilityLabel="Remove photo">
                <Ionicons name="close" size={14} color={colors.white} />
              </Pressable>
            </Pressable>
          ))}
          {draft.photos.length < MAX_PHOTOS && (
            <Pressable onPress={pick} style={[styles.photoTile, styles.addTile]} accessibilityLabel="Add more photos">
              <Ionicons name="add" size={28} color={colors.primary} />
              <AppText variant="label" color="primary">
                Add
              </AppText>
            </Pressable>
          )}
        </View>
      )}

      {draft.photos.length > 1 && (
        <AppText variant="caption" color="textMuted">
          Tip: long-press a photo to make it the cover.
        </AppText>
      )}
      {draft.photos.length === 0 && (
        <Pressable onPress={() => update({ photos: SAMPLE_PHOTOS })} hitSlop={8} style={styles.sample}>
          <AppText variant="calloutStrong" color="primary" align="center">
            No photos handy? Use sample photos
          </AppText>
        </Pressable>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------

const KINDS: { value: ContentKind; label: string; icon: IconName; hint: string }[] = [
  { value: "place", label: "Place", icon: "storefront-outline", hint: "A spot people can visit" },
  { value: "post", label: "Experience", icon: "sparkles-outline", hint: "A story or tip" },
  { value: "event", label: "Event", icon: "calendar-outline", hint: "Happens on a date" },
];

export function DetailsStep({ draft, update }: StepProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.step}>
      <StepIntro title="Tell the story" body="What makes it worth discovering? Be specific — locals love details." />

      <View style={styles.kindRow}>
        {KINDS.map((k) => {
          const selected = draft.kind === k.value;
          return (
            <Pressable
              key={k.value}
              onPress={() => update({ kind: k.value })}
              style={[styles.kind, selected && styles.kindSelected]}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
            >
              <Ionicons name={k.icon} size={22} color={selected ? colors.primary : colors.textSecondary} />
              <AppText variant="calloutStrong" color={selected ? "primary" : "text"}>
                {k.label}
              </AppText>
              <AppText variant="label" color="textMuted" align="center" style={{ fontWeight: "400" }}>
                {k.hint}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <TextField
        label="Title"
        placeholder="e.g. The quietest rooftop cafe in Banjara Hills"
        value={draft.title}
        onChangeText={(title) => update({ title })}
        maxLength={80}
        showCount
        returnKeyType="next"
      />
      <TextField
        label="Description"
        placeholder="What should people try? When is the best time to go? Anything to know before visiting?"
        value={draft.description}
        onChangeText={(description) => update({ description })}
        maxLength={1000}
        showCount
        multiline
        hint="At least 20 characters"
      />
    </View>
  );
}

// ---------------------------------------------------------------------------

export function PlaceStep({ draft, update }: StepProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const [tagInput, setTagInput] = useState("");
  const [locating, setLocating] = useState(false);
  const areas = useResource(() => locationService.searchAreas(""));

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase().replace(/^#/, "");
    if (!tag || draft.tags.includes(tag) || draft.tags.length >= 8) return;
    update({ tags: [...draft.tags, tag] });
    setTagInput("");
  };

  const useCurrent = async () => {
    setLocating(true);
    try {
      update({ location: await locationService.getCurrentLocation() });
    } finally {
      setLocating(false);
    }
  };

  return (
    <View style={styles.step}>
      <StepIntro title="Category & location" body="Help explorers find your post in the right place." />

      <View style={styles.field}>
        <AppText variant="calloutStrong">Category</AppText>
        <View style={styles.wrap}>
          {CATEGORIES.map((c) => (
            <CategoryChip
              key={c.id}
              label={c.label}
              icon={c.icon}
              selected={draft.categoryId === c.id}
              onPress={() => update({ categoryId: c.id })}
            />
          ))}
        </View>
      </View>

      <View style={styles.field}>
        <AppText variant="calloutStrong">Location</AppText>
        <Pressable onPress={useCurrent} style={styles.locate} accessibilityRole="button">
          {locating ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Ionicons name="locate" size={20} color={colors.primary} />
          )}
          <View style={styles.flex}>
            <AppText variant="bodyStrong" color="primary">
              Use my current location
            </AppText>
            {draft.location && (
              <AppText variant="caption" color="textSecondary">
                Selected: {draft.location.address}
              </AppText>
            )}
          </View>
          {draft.location && <Ionicons name="checkmark-circle" size={20} color={colors.success} />}
        </Pressable>
        <View style={styles.wrap}>
          {areas.data?.map((a) => (
            <CategoryChip
              key={a.area}
              label={a.area}
              icon="location-outline"
              selected={draft.location?.area === a.area}
              onPress={() => update({ location: a })}
            />
          ))}
        </View>
      </View>

      <View style={styles.field}>
        <View style={styles.labelRow}>
          <AppText variant="calloutStrong">Tags</AppText>
          <AppText variant="caption" color="textMuted">
            {draft.tags.length}/8
          </AppText>
        </View>
        <View style={styles.tagInput}>
          <AppText variant="bodyStrong" color="textMuted">
            #
          </AppText>
          <AppTextInput
            value={tagInput}
            onChangeText={setTagInput}
            onSubmitEditing={() => addTag(tagInput)}
            placeholder="Add a tag and press enter"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            returnKeyType="done"
            blurOnSubmit={false}
            style={styles.tagTextInput}
            accessibilityLabel="Add tag"
          />
          {!!tagInput && (
            <Pressable onPress={() => addTag(tagInput)} hitSlop={8}>
              <AppText variant="calloutStrong" color="primary">
                Add
              </AppText>
            </Pressable>
          )}
        </View>
        {draft.tags.length > 0 && (
          <View style={styles.wrap}>
            {draft.tags.map((t) => (
              <Pressable
                key={t}
                onPress={() => update({ tags: draft.tags.filter((x) => x !== t) })}
                style={styles.tagChip}
                accessibilityLabel={`Remove tag ${t}`}
              >
                <AppText variant="captionStrong" color="primary">
                  #{t}
                </AppText>
                <Ionicons name="close" size={14} color={colors.primary} />
              </Pressable>
            ))}
          </View>
        )}
        <View style={styles.wrap}>
          {SUGGESTED_TAGS.filter((t) => !draft.tags.includes(t)).map((t) => (
            <Pressable key={t} onPress={() => addTag(t)} style={styles.suggestion} accessibilityLabel={`Add tag ${t}`}>
              <Ionicons name="add" size={14} color={colors.textSecondary} />
              <AppText variant="caption" color="textSecondary">
                {t}
              </AppText>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------

export function ReviewStep({ draft }: { draft: DraftPost }) {
  const { colors } = useTheme();
  const styles = useStyles();
  const preview: ContentItem = {
    id: "preview",
    kind: draft.kind,
    title: draft.title || "Untitled",
    categoryId: draft.categoryId ?? "activities",
    description: draft.description,
    coverImage: draft.photos[0],
    photos: [],
    rating: 0,
    reviewCount: 0,
    distanceKm: 0.1,
    area: draft.location?.area ?? "Hyderabad",
    address: draft.location?.address ?? "",
    coordinates: draft.location?.coordinates ?? { latitude: 0, longitude: 0 },
    creatorId: "me",
    likeCount: 0,
    saveCount: 0,
    tags: draft.tags,
    createdAt: new Date().toISOString(),
  };

  const checks = [
    { ok: draft.photos.length >= 3, label: "3+ photos", hint: `${draft.photos.length} added` },
    { ok: draft.description.length >= 120, label: "Detailed description", hint: "120+ characters" },
    { ok: draft.tags.length >= 2, label: "At least 2 tags", hint: `${draft.tags.length} added` },
  ];

  return (
    <View style={styles.step}>
      <StepIntro title="Preview & publish" body="This is how explorers will see your post in their feed." />
      <PlaceCard item={preview} variant="full" onPress={() => {}} showSave={false} />

      <View style={styles.checklist}>
        <AppText variant="h3">Quality boosters</AppText>
        {checks.map((c) => (
          <View key={c.label} style={styles.checkRow}>
            <Ionicons
              name={c.ok ? "checkmark-circle" : "ellipse-outline"}
              size={20}
              color={c.ok ? colors.success : colors.textMuted}
            />
            <AppText variant="callout" style={styles.flex}>
              {c.label}
            </AppText>
            <Tag label={c.hint} tone={c.ok ? "success" : "neutral"} />
          </View>
        ))}
        <AppText variant="caption" color="textMuted">
          Posts are reviewed against our community guidelines before appearing in Explore.
        </AppText>
      </View>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  flex: { flex: 1 },
  step: { gap: spacing.xl },
  intro: { gap: spacing.xs },
  field: { gap: spacing.md },
  labelRow: { flexDirection: "row", justifyContent: "space-between" },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  dropzone: {
    height: 240,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.primaryMuted,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  dropIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  photoGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  photoTile: {
    width: "31.8%",
    aspectRatio: 1,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.surfaceMuted,
  },
  addTile: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.primaryMuted,
    backgroundColor: colors.primarySoft,
  },
  coverBadge: {
    position: "absolute",
    left: 6,
    bottom: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
    backgroundColor: colors.primary,
  },
  removePhoto: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.scrim,
    alignItems: "center",
    justifyContent: "center",
  },
  sample: { paddingVertical: spacing.sm },
  kindRow: { flexDirection: "row", gap: spacing.sm },
  kind: {
    flex: 1,
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  kindSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  locate: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
  },
  tagInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    height: 52,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  tagTextInput: { ...typography.body, flex: 1, color: colors.text, height: "100%", paddingVertical: 0 },
  tagChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: spacing.md,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  suggestion: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: spacing.sm + 2,
    height: 30,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checklist: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  checkRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
}));
