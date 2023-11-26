import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
  includeShadowDom: true,
  component: {
    devServer: {
      framework: "svelte",
      bundler: "vite",
    },
  },
});
