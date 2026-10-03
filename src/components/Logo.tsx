import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { colors } from "@/theme";

import { AppText } from "./AppText";

type Props = {
  size?: number;
  /** "light" = white mark for indigo backgrounds. */
  tone?: "brand" | "light";
  withWordmark?: boolean;
};

/** LocaSphere mark: a location pin inside an orbit ring. */
export function Logo({ size = 56, tone = "brand", withWordmark }: Props) {
  const isLight = tone === "light";
  const bg = isLight ? colors.white : colors.primary;
  const fg = isLight ? colors.primary : colors.white;

  return (
    <View style={styles.row}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.3,
          backgroundColor: bg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            position: "absolute",
            width: size * 0.66,
            height: size * 0.66,
            borderRadius: size,
            borderWidth: Math.max(1.5, size * 0.04),
            borderColor: isLight ? colors.primaryMuted : "rgba(255,255,255,0.35)",
          }}
        />
        <Ionicons name="location" size={size * 0.46} color={fg} />
        <View
          style={{
            position: "absolute",
            top: size * 0.2,
            right: size * 0.2,
            width: size * 0.12,
            height: size * 0.12,
            borderRadius: size,
            backgroundColor: colors.accent,
          }}
        />
      </View>
      {withWordmark && (
        <AppText
          style={{
            fontSize: size * 0.5,
            lineHeight: size * 0.62,
            fontWeight: "800",
            letterSpacing: -0.5,
            color: isLight ? colors.white : colors.text,
          }}
        >
          LocaSphere
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
});
