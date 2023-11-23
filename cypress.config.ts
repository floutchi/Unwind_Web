import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  includeShadowDom: true,
  component: {
    devServer: {
      framework: 'svelte',
      bundler: 'vite',
    },
  },
});
