import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:5173/~q210126/unwind"
  },
  includeShadowDom: true,
  component: {
    devServer: {
      framework: "svelte",
      bundler: "vite",
    },
  },
});
