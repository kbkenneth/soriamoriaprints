import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");

    // Vi ignorerer alt som ikke er ferdig betalt ordre
    if (body.eventName !== "order.completed") {
      return { statusCode: 200 };
    }

    const order = body.content;

    // SKU mapping basert på Snipcart custom field value
    const skuMap: Record<string, string> = {
      "30 x 45 cm": "GLOBAL-HPR-12X18",
      "40 x 60 cm": "GLOBAL-HPR-16X24",
      "60 x 90 cm": "GLOBAL-HPR-24X36"
    };

    const items = order.items.map((item: any) => {
      const sizeField = item.customFields.find(
        (f: any) => f.name === "Størrelse"
      );

    const size = sizeField?.value;
    const productId = item.id;

    return {
    sku: skuMap[size],
    copies: item.quantity,
    sizing: "fit",
    assets: [
        {
        printArea: "default",
        url: getPrintFileUrl(productId, size)
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
/*
    const response = await fetch("https://api.prodigi.com/v4.0/Orders", {
      method: "POST",
      headers: {
        "X-API-Key": process.env.PRODIGI_API_KEY!,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(prodigiOrder)
    });
*/    
    console.log("Prodigi order payload:", JSON.stringify(prodigiOrder, null, 2));
/*
    const result = await response.text();
    console.log("Prodigi response:", result);

    if (!response.ok) {
      throw new Error(`Prodigi error: ${result}`);
    }

    return { statusCode: 200 };
*/
  } catch (error: any) {
    console.error("Function error:", error);
    return { statusCode: 500, body: error.toString() };
  }
};


function getPrintFileUrl(productId: string, size: string): string {
  const printFileMap: Record<string, Record<string, string>> = {
    "RPG": {
      "30 x 45 cm": "https://soriamoriaprints.netlify.app/print-files/skogstroll/45x30.jpg",
      "40 x 60 cm": "https://soriamoriaprints.netlify.app/print-files/skogstroll/60x40.jpg",
      "60 x 90 cm": "https://soriamoriaprints.netlify.app/print-files/skogstroll/90x60.jpg"
    }
  };

  const fileUrl = printFileMap[productId]?.[size];

  if (!fileUrl) {
    throw new Error(`Ingen printfil for produkt ${productId}, størrelse ${size}`);
  }

  return fileUrl;
}

