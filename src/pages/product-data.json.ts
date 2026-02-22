import { getCollection } from "astro:content";

export async function GET() {
  const products = await getCollection("prints");

  const data: Record<string, any> = {};

  for (const product of products) {
    const p = product.data;

    if (!p.snipcartId || !p.sizes) continue;

    data[p.snipcartId] = {
      sizes: Object.fromEntries(
        p.sizes.map((s: any) => [
          s.label,
          {
            sku: s.sku,
            file: `https://soriamoriaprints.netlify.app${s.file}`
          }
        ])
      )
    };
  }

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}