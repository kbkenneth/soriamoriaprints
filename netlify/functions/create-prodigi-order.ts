import type { Handler } from "@netlify/functions";

// Midlertidig dry-run-versjon (ingen ordre sendes til Prodigi)
export const handler: Handler = async (event) => {
  try {
    // Parse Snipcart webhook body
    const body = JSON.parse(event.body ?? "{}");

    // Bare prosesser order.completed
    if (body.eventName !== "order.completed") {
      return {
        statusCode: 200,
        body: "Ignored event"
      };
    }

    const order = body.content;

    // Hent produktdata fra JSON-endepunktet vi genererte
    const productDataResponse = await fetch(
      "https://soriamoriaprints.netlify.app/product-data.json"
    );

    const productData = await productDataResponse.json();

    const items = order.items.map((item: any) => {
      const sizeField = item.customFields.find(
        (f: any) => f.name === "Størrelse"
      );

      const size = sizeField?.value;
      const product = productData[item.id];
      const sku = product?.sizes?.[size]?.sku;
      const fileUrl = product?.sizes?.[size]?.file;

      if (!sku || !fileUrl) {
        throw new Error(
          `Missing SKU or file for ${item.id} / size ${size}`
        );
      }

      return {
        sku,
        copies: item.quantity,
        sizing: "fit",
        assets: [
          {
            printArea: "default",
            url: fileUrl
          }
        ]
      };
    });

    const prodigiOrder = {
      shippingMethod: "Standard",
      recipient: {
        name: order.shippingAddress.fullName,
        address: {
          line1: order.shippingAddress.address1,
          city: order.shippingAddress.city,
          postalOrZipCode: order.shippingAddress.postalCode,
          countryCode: order.shippingAddress.country
        }
      },
      items
    };

    // Log payload – dry-run (ikke send til Prodigi ennå)
    console.log(
      "Prodigi order payload:",
      JSON.stringify(prodigiOrder, null, 2)
    );

    return {
      statusCode: 200,
      body: "OK"
    };

  } catch (error: any) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};