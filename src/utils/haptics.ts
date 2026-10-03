import * as Haptics from "expo-haptics";

const enabled = process.env.EXPO_OS !== "web";

export const haptics = {
  light: () => enabled && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}),
  selection: () => enabled && Haptics.selectionAsync().catch(() => {}),
  success: () =>
    enabled && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}),
  error: () => enabled && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {}),
};
