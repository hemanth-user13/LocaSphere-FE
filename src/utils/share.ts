import { Linking, Platform, Share } from "react-native";

import type { ContentItem } from "@/types/models";

export async function shareContent(item: ContentItem) {
  try {
    await Share.share({
      title: item.title,
      message: `${item.title} — ${item.area}\nDiscovered on LocaSphere: https://locasphere.app/p/${item.id}`,
    });
  } catch {
    // User dismissed the share sheet or sharing is unavailable; nothing to do.
  }
}

export function openDirections(item: ContentItem) {
  const { latitude, longitude } = item.coordinates;
  const label = encodeURIComponent(item.title);
  const url = Platform.select({
    ios: `maps://?daddr=${latitude},${longitude}&q=${label}`,
    android: `geo:0,0?q=${latitude},${longitude}(${label})`,
    default: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
  });
  Linking.openURL(url).catch(() =>
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`),
  );
}
