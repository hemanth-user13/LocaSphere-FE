import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { colors } from "@/theme";
import { initials } from "@/utils/format";

import { AppText } from "./AppText";

type Props = {
  uri?: string;
  name: string;
  size?: number;
  ring?: boolean;
};

export function Avatar({ uri, name, size = 40, ring }: Props) {
  const [failed, setFailed] = useState(false);
  const showImage = uri && !failed;

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={`${name}'s avatar`}
      style={[
        styles.base,
        { width: size, height: size, borderRadius: size / 2 },
        ring && { borderWidth: Math.max(2, size / 24), borderColor: colors.surface },
      ]}
    >
      {showImage ? (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={150}
          onError={() => setFailed(true)}
        />
      ) : (
        <AppText style={{ fontSize: size * 0.38, fontWeight: "700", color: colors.primary }}>
          {initials(name)}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: "hidden",
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
});
