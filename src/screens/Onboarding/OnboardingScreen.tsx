import { router } from "expo-router";
import { useRef, useState, type ComponentType } from "react";
import {
  FlatList,
  Pressable,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText, Button, Logo } from "@/components";
import { useAuth } from "@/context/AuthContext";
import { layout, makeStyles, radius, spacing } from "@/theme";

import { CommunityIllustration, DiscoverIllustration, ShareIllustration } from "./Illustrations";

/** Illustrations render inside a 300×300 stage. */
const ART_SIZE = 300;

type Slide = { key: string; title: string; body: string; Illustration: ComponentType };

const SLIDES: Slide[] = [
  {
    key: "discover",
    title: "Discover places\naround you",
    body: "Cafes, food, parks and hidden gems — ranked by distance and what locals actually love.",
    Illustration: DiscoverIllustration,
  },
  {
    key: "community",
    title: "Explore through\nthe community",
    body: "Real experiences, photos and honest reviews from people who live in your city.",
    Illustration: CommunityIllustration,
  },
  {
    key: "share",
    title: "Share your own\ndiscoveries",
    body: "Post the places you love, build your creator profile and help others explore better.",
    Illustration: ShareIllustration,
  },
];

export default function OnboardingScreen() {
  const styles = useStyles();
  const { width, height } = useWindowDimensions();
  // Shrink the artwork on short screens so the footer controls always fit.
  const artScale = height < 700 ? 0.72 : height < 800 ? 0.86 : 1;
  const { completeOnboarding } = useAuth();
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;

  const finish = () => {
    completeOnboarding();
    router.replace("/login");
  };

  const next = () => {
    if (isLast) return finish();
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    setIndex(index + 1);
  };

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.top}>
        <Logo size={32} withWordmark />
        {!isLast && (
          <Pressable onPress={finish} hitSlop={12} accessibilityRole="button" style={styles.skip}>
            <AppText variant="calloutStrong" color="textSecondary">
              Skip
            </AppText>
          </Pressable>
        )}
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(s) => s.key}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        style={styles.list}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View
              style={[
                styles.illustration,
                // A transform doesn't change layout size, so reclaim the space the scale-down frees up.
                { transform: [{ scale: artScale }], marginVertical: -(ART_SIZE / 2) * (1 - artScale) },
              ]}
            >
              <View style={styles.halo} />
              <item.Illustration />
            </View>
            <Animated.View entering={FadeIn.duration(400)} style={[styles.copy, { marginTop: spacing.xl }]}>
              <AppText variant="display" align="center">
                {item.title}
              </AppText>
              <AppText variant="body" color="textSecondary" align="center" style={styles.body}>
                {item.body}
              </AppText>
            </Animated.View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots} accessibilityLabel={`Step ${index + 1} of ${SLIDES.length}`}>
          {SLIDES.map((s, i) => (
            <View key={s.key} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
        <Button title={isLast ? "Get started" : "Next"} iconRight="arrow-forward" onPress={next} />
        <View style={styles.loginRow}>
          <AppText variant="callout" color="textSecondary">
            Already have an account?
          </AppText>
          <Pressable onPress={finish} hitSlop={12} accessibilityRole="button" accessibilityLabel="Log in">
            <AppText variant="calloutStrong" color="primary">
              Log in
            </AppText>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const useStyles = makeStyles((colors) => ({
  root: { flex: 1, backgroundColor: colors.surface },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: layout.screenPadding + 4,
    height: 56,
  },
  skip: { paddingVertical: spacing.sm, paddingHorizontal: spacing.xs },
  slide: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.xl },
  illustration: { alignItems: "center", justifyContent: "center" },
  halo: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.primarySoft,
  },
  copy: { alignItems: "center", gap: spacing.md },
  body: { maxWidth: 320 },
  list: { flex: 1 },
  footer: { paddingHorizontal: layout.screenPadding + 4, paddingBottom: spacing.md, gap: spacing.lg },
  loginRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: spacing.xs, minHeight: 32 },
  dots: { flexDirection: "row", justifyContent: "center", gap: spacing.sm },
  dot: { width: 8, height: 8, borderRadius: radius.pill, backgroundColor: colors.border },
  dotActive: { width: 24, backgroundColor: colors.primary },
}));
