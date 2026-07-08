import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

export const collections = {
  snippets: defineCollection({
    loader: glob({ base: "./src/content", pattern: "**/*.{md,mdx}" }),
    schema: z.object({
      title: z.string(),
      draft: z.boolean().default(false),
    }),
  }),
};
