import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { View } from "react-native";

import { AppText } from "@/components";
import { makeStyles, radius, shadows, spacing, useTheme } from "@/theme";
import type { IconName } from "@/types/models";

const photo = (id: string) => `https://images.unsplash.com/photo-${id}?w=600&q=80&auto=format&fit=crop`;

function FloatingChip({ icon, label, tint: tintProp, style }: { icon: IconName; label: string; tint?: string; style?: object }) {
  const { colors } = useTheme();
  const styles = useStyles();
  const tint = tintProp ?? colors.primary;
  return (
    <View style={[styles.chip, shadows.md, style]}>
      <View style={[styles.chipIcon, { backgroundColor: `${tint}18` }]}>
        <Ionicons name={icon} size={14} color={tint} />
      </View>
      <AppText variant="captionStrong">{label}</AppText>
    </View>
  );
}

function Pin({ top, left, icon, active }: { top: string; left: string; icon: IconName; active?: boolean }) {
  const { colors } = useTheme();
  const styles = useStyles();
  return (
    <View style={[styles.pin, { top: top as `${number}%`, left: left as `${number}%` }, active && styles.pinActive]}>
      <Ionicons name={icon} size={active ? 18 : 14} color={active ? colors.white : colors.primary} />
    </View>
  );
}

export function DiscoverIllustration() {
  const { colors } = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.stage}>
      <View style={[styles.map, shadows.md]}>
        <View style={[styles.road, { top: "35%", left: 0, right: 0, height: 8 }]} />
        <View style={[styles.road, { left: "40%", top: 0, bottom: 0, width: 8 }]} />
        <View style={[styles.road, { top: "72%", left: 0, right: 0, height: 5 }]} />
        <View style={[styles.parkBlob, { top: "8%", left: "56%" }]} />
        <View style={[styles.waterBlob, { top: "50%", left: "6%" }]} />
        <Pin top="18%" left="18%" icon="restaurant" />
        <Pin top="44%" left="54%" icon="cafe" active />
        <Pin top="66%" left="74%" icon="leaf" />
        <Pin top="76%" left="26%" icon="calendar" />
      </View>
      <FloatingChip icon="cafe" label="Roastery Lane · 1.2 km" style={{ position: "absolute", top: 8, left: 0 }} />
      <FloatingChip icon="star" tint={colors.warning} label="4.7 · 214 reviews" style={{ position: "absolute", bottom: 14, right: 0 }} />
    </View>
  );
}

export function CommunityIllustration() {
  const { colors } = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.stage}>
      <Image source={{ uri: photo("1507525428034-b723cf961d3e") }} style={[styles.photo, styles.photoBack]} contentFit="cover" />
      <Image source={{ uri: photo("1554118811-1e0d58224f24") }} style={[styles.photo, styles.photoFront, shadows.md]} contentFit="cover" />
      <View style={[styles.chip, shadows.md, { position: "absolute", top: 6, right: 0 }]}>
        <Image source={{ uri: photo("1438761681033-6461ffad8d80") }} style={styles.avatar} />
        <AppText variant="captionStrong">Sana shared a new spot</AppText>
      </View>
      <FloatingChip icon="heart" tint={colors.error} label="1.2k explorers loved this" style={{ position: "absolute", bottom: 10, left: 0 }} />
    </View>
  );
}

export function ShareIllustration() {
  const { colors } = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.stage}>
      <View style={[styles.composer, shadows.md]}>
        <View style={styles.upload}>
          <View style={styles.uploadIcon}>
            <Ionicons name="camera" size={26} color={colors.primary} />
          </View>
          <AppText variant="captionStrong" color="primary">
            Add photos
          </AppText>
        </View>
        <View style={[styles.line, { width: "70%" }]} />
        <View style={[styles.line, { width: "92%", backgroundColor: colors.surfaceMuted }]} />
        <View style={styles.composerRow}>
          <View style={styles.pill}>
            <Ionicons name="location" size={12} color={colors.primary} />
            <AppText variant="label" color="primary">
              Jubilee Hills
            </AppText>
          </View>
          <View style={styles.publish}>
            <AppText variant="label" style={{ color: colors.white }}>
              Publish
            </AppText>
          </View>
        </View>
      </View>
      <FloatingChip icon="sparkles" tint={colors.accent} label="Creator badge unlocked" style={{ position: "absolute", top: 4, left: 0 }} />
      <FloatingChip icon="trending-up" tint={colors.success} label="+128 likes this week" style={{ position: "absolute", bottom: 8, right: 0 }} />
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  stage: { width: 300, height: 300, alignItems: "center", justifyContent: "center" },
  map: {
    width: 240,
    height: 240,
    borderRadius: radius.xxl,
    backgroundColor: colors.mapBackground,
    overflow: "hidden",
    borderWidth: 6,
    borderColor: colors.surface,
  },
  road: { position: "absolute", backgroundColor: colors.mapRoad },
  parkBlob: { position: "absolute", width: 80, height: 60, borderRadius: 24, backgroundColor: colors.mapPark },
  waterBlob: { position: "absolute", width: 70, height: 44, borderRadius: 22, backgroundColor: colors.mapWater },
  pin: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  pinActive: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, borderColor: colors.surface },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingLeft: 6,
    paddingRight: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  chipIcon: { width: 26, height: 26, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  avatar: { width: 26, height: 26, borderRadius: 13 },
  photo: { position: "absolute", width: 170, height: 220, borderRadius: radius.xl, borderWidth: 5, borderColor: colors.surface },
  photoBack: { transform: [{ rotate: "-8deg" }, { translateX: -50 }] },
  photoFront: { transform: [{ rotate: "6deg" }, { translateX: 46 }] },
  composer: {
    width: 230,
    padding: spacing.lg,
    gap: spacing.md,
    borderRadius: radius.xxl,
    backgroundColor: colors.surface,
  },
  upload: {
    height: 110,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.primaryMuted,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  uploadIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  line: { height: 10, borderRadius: 5, backgroundColor: colors.border },
  composerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  publish: { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: colors.primary },
}));
