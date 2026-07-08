// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import { satteri } from "@astrojs/markdown-satteri";
import { customCodeBlocks } from "./src/satteri-plugins.ts";

// https://astro.build/config
export default defineConfig({
  site: "https://snippets.cdevoogd.com",
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains-mono",
      fallbacks: ["monospace"],
    },
  ],
  markdown: {
    shikiConfig: {
      theme: "vitesse-dark",
    },
    processor: satteri({
      hastPlugins: [customCodeBlocks],
    }),
  },
});
