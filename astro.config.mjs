// @ts-check
import { defineConfig, fontProviders } from "astro/config";
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
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Inter",
      cssVariable: "--font-inter",
      fallbacks: ["ui-sans-serif"],
      weights: [400, 600],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Geist Mono",
      cssVariable: "--font-geist-mono",
      fallbacks: ["ui-monospace"],
    },
  ],
});
