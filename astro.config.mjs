// @ts-check
import { defineConfig } from "astro/config";
import { satteri } from "@astrojs/markdown-satteri";
import { customCodeBlocks } from "./src/satteri-plugins.ts";

// https://astro.build/config
export default defineConfig({
  site: "https://snippets.cdevoogd.com",
  markdown: {
    shikiConfig: {
      theme: "vitesse-dark",
    },
    processor: satteri({
      hastPlugins: [customCodeBlocks],
    }),
  },
});
