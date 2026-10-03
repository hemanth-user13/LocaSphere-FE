import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, View, type LayoutChangeEvent } from "react-native";

import { getCategory } from "@/data/categories";
import { makeStyles, radius, shadows, spacing, useTheme } from "@/theme";
import type { ContentItem, ID } from "@/types/models";

import { AppText } from "./AppText";

type Props = {
  items: ContentItem[];
  selectedId?: ID | null;
  onSelect: (id: ID) => void;
  onLocateMe?: () => void;
};

/**
 * Map placeholder with real marker projection.
 *
 * Integration point: replace the stylised canvas with `react-native-maps`
 * (Google Maps) or `@rnmapbox/maps` — the props (items, selectedId, onSelect)
 * stay the same, so the Explore screen won't change.
 */
export function DiscoveryMap({ items, selectedId, onSelect, onLocateMe }: Props) {
  const { colors } = useTheme();
  const styles = useStyles();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const onLayout = (e: LayoutChangeEvent) => setSize(e.nativeEvent.layout);

  // Fit all markers into the viewport with padding.
  const lats = items.map((i) => i.coordinates.latitude);
  const lngs = items.map((i) => i.coordinates.longitude);
  const pad = 0.012;
  const minLat = Math.min(...lats, 17.38) - pad;
  const maxLat = Math.max(...lats, 17.47) + pad;
  const minLng = Math.min(...lngs, 78.34) - pad;
  const maxLng = Math.max(...lngs, 78.48) + pad;
  const project = (lat: number, lng: number) => ({
    x: ((lng - minLng) / (maxLng - minLng)) * size.width,
    y: (1 - (lat - minLat) / (maxLat - minLat)) * size.height,
  });

  return (
    <View style={styles.canvas} onLayout={onLayout} accessibilityLabel={`Map with ${items.length} places`}>
      {/* Stylised terrain: water, parks and a road grid */}
      <View style={[styles.water, { top: "38%", left: "8%", width: 120, height: 70 }]} />
      <View style={[styles.water, { top: "70%", left: "60%", width: 90, height: 56 }]} />
      <View style={[styles.park, { top: "18%", left: "55%", width: 110, height: 80 }]} />
      <View style={[styles.park, { top: "58%", left: "18%", width: 80, height: 64 }]} />
      {[18, 42, 66, 86].map((p) => (
        <View key={`h${p}`} style={[styles.road, { top: `${p}%`, left: 0, right: 0, height: p === 42 ? 8 : 4 }]} />
      ))}
      {[22, 48, 74].map((p) => (
        <View key={`v${p}`} style={[styles.road, { left: `${p}%`, top: 0, bottom: 0, width: p === 48 ? 8 : 4 }]} />
      ))}
      <View style={[styles.road, styles.diagonal]} />

      {size.width > 0 &&
        items.map((item) => {
          const { x, y } = project(item.coordinates.latitude, item.coordinates.longitude);
          const selected = item.id === selectedId;
          const category = getCategory(item.categoryId);
          return (
            <Pressable
              key={item.id}
              onPress={() => onSelect(item.id)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={item.title}
              style={[styles.markerWrap, { left: x - 20, top: y - 46, zIndex: selected ? 10 : 1 }]}
            >
              <View style={[styles.marker, selected && styles.markerSelected, shadows.md]}>
                <Ionicons name={category.icon} size={selected ? 18 : 16} color={selected ? colors.white : colors.primary} />
              </View>
              <View style={[styles.pointer, selected && { borderTopColor: colors.primary }]} />
              {selected && (
                <View style={styles.label}>
                  <AppText variant="label" numberOfLines={1}>
                    {item.title}
                  </AppText>
                </View>
              )}
            </Pressable>
          );
        })}

      {/* Current location */}
      {size.width > 0 && (
        <View style={[styles.me, { left: size.width * 0.5 - 11, top: size.height * 0.5 - 11 }]}>
          <View style={styles.meDot} />
        </View>
      )}

      <View style={styles.controls}>
        <Pressable style={[styles.control, shadows.sm]} onPress={onLocateMe} accessibilityLabel="Center on my location">
          <Ionicons name="locate" size={20} color={colors.primary} />
        </Pressable>
      </View>
      <View style={styles.attribution}>
        <AppText variant="label" color="textMuted">
          Map preview
        </AppText>
      </View>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  canvas: {
    flex: 1,
    backgroundColor: colors.mapBackground,
    overflow: "hidden",
  },
  water: { position: "absolute", backgroundColor: colors.mapWater, borderRadius: 40 },
  park: { position: "absolute", backgroundColor: colors.mapPark, borderRadius: radius.xl },
  road: { position: "absolute", backgroundColor: colors.mapRoad },
  diagonal: {
    width: 6,
    height: "160%",
    left: "30%",
    top: "-30%",
    transform: [{ rotate: "35deg" }],
  },
  markerWrap: { position: "absolute", width: 40, alignItems: "center" },
  marker: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  markerSelected: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    borderColor: colors.surface,
  },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: colors.primary,
    marginTop: -1,
  },
  label: {
    position: "absolute",
    top: -30,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    width: 150,
    alignItems: "center",
    ...shadows.sm,
  },
  me: {
    position: "absolute",
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.locationHalo,
    alignItems: "center",
    justifyContent: "center",
  },
  meDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  controls: { position: "absolute", right: spacing.lg, top: spacing.lg, gap: spacing.sm },
  control: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  attribution: { position: "absolute", left: spacing.md, top: spacing.md },
}));
