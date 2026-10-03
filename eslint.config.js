// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    // legacy/ holds the previous "Trio" prototype, kept for reference only.
    ignores: ['dist/*', 'legacy/*'],
  },
]);
