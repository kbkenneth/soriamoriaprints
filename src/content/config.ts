import { defineCollection, z } from "astro:content";

const prints = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    snipcartId: z.string(),
    excerpt: z.string(),
    cover: z.string(),
    price: z.string(),
    lang: z.enum(["no", "en"]),
    sizes: z.array(
      z.object({
        label: z.string(),
        price: z.number(),
        sku: z.string(),
      })
    ),
  }),
});

export const collections = {
  prints,
};
