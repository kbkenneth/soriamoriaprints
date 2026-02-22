import { defineCollection, z } from "astro:content";

const prints = defineCollection({
  schema: z.object({
    title: z.string(),
    snipcartId: z.string(),
    price: z.string().optional(),
    excerpt: z.string().optional(),
    cover: z.string(),
    lang: z.string().optional(),
    sizes: z.array(
      z.object({
        label: z.string(),
        price: z.number(),
        sku: z.string(),
        file: z.string()   // ← DETTE MANGLER
      })
    )
  })
});

export const collections = {
  prints
};