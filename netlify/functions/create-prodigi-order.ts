import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  console.log("Webhook received");
  console.log(event.body);

  return {
    statusCode: 200,
    body: "Webhook OK"
  };
};
