module.exports = function (api) {
  api.cache(true);
  return {
    // NativeWind is intentionally not enabled: the app styles with StyleSheet + src/theme.
    // Its JSX wrapper replaces every View/Text/Pressable and drops function-style
    // props (e.g. `style={({ pressed }) => ...}`) on native, which made buttons invisible.
    presets: ["babel-preset-expo"],
  };
};
