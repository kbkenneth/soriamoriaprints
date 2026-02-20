import { defineCollection, z } from "astro:content";

const prints = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    price: z.string(),
    excerpt: z.string(),
    cover: z.string(),
    lang: z.enum(["no", "en"]),
    basePrice: z.number(),
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
