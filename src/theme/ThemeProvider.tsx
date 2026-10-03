import * as SystemUI from "expo-system-ui";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { StyleSheet, useColorScheme } from "react-native";

import { darkColors, lightColors, type Colors } from "./colors";

export type ThemePreference = "system" | "light" | "dark";
export type ColorScheme = "light" | "dark";

type ThemeState = {
  colors: Colors;
  scheme: ColorScheme;
  isDark: boolean;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeState>({
  colors: lightColors,
  scheme: "light",
  isDark: false,
  preference: "system",
  setPreference: () => {},
});

/**
 * Resolves the active colour scheme from the user's preference (System /
 * Light / Dark) and the OS setting. The preference is kept in memory for the
 * prototype — persist it with AsyncStorage alongside the session later.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>("system");
  const scheme: ColorScheme = preference === "system" ? (system === "dark" ? "dark" : "light") : preference;
  const colors = scheme === "dark" ? darkColors : lightColors;

  // Keeps the native root view (visible during transitions / keyboard) in sync.
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background).catch(() => {});
  }, [colors.background]);

  const value = useMemo<ThemeState>(
    () => ({ colors, scheme, isDark: scheme === "dark", preference, setPreference }),
    [colors, scheme, preference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);

/**
 * Theme-aware replacement for `StyleSheet.create`. The factory runs at most
 * once per colour scheme and the result is cached, so switching themes is cheap.
 *
 *   const useStyles = makeStyles((colors) => ({ card: { backgroundColor: colors.surface } }));
 *   function Card() { const styles = useStyles(); ... }
 */
export function makeStyles<T extends StyleSheet.NamedStyles<T>>(factory: (colors: Colors) => T) {
  const cache = new Map<Colors, T>();
  return function useStyles(): T {
    const { colors } = useTheme();
    let styles = cache.get(colors);
    if (!styles) {
      styles = StyleSheet.create(factory(colors));
      cache.set(colors, styles);
    }
    return styles;
  };
}
