import fetch from "node-fetch";
import { PAYPAL_API, PAYPAL_API_CLIENT, PAYPAL_API_SECRET } from "./config.js";

/* const customer_id = Math.random().toString(36).slice(2);
console.log(customer_id); */

export async function createOrder() {
  const accessToken = await generateAccessTokenFetch();
  const url = `${PAYPAL_API}/v2/checkout/orders`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      Prefer: "return=representation",
      //"PayPal-Request-Id": "123",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "GBP",
            value: "20.00",
          },
        },
      ],
    }),
  });

  const data = await response.json();
  console.log("This is the order: ", data);
  return data;
}

export async function capturePayment(orderId) {
  const accessToken = await generateAccessTokenFetch();
  const url = `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      Prefer: "return=representation",
    },
  });

  const data = await response.json();
  console.log("Capturing the order:", data);
  return data;
}

export async function generateClientToken() {
  const accessToken = await generateAccessTokenFetch();
  const response = await fetch(`${PAYPAL_API}/v1/identity/generate-token`, {
    method: "post",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Accept-Language": "en_US",
      "Content-Type": "application/json",
      
    },
    body:JSON.stringify({
        customer_id: "cst_00023"
    })
  });
  const data = await response.json();
  return data.client_token;
}

export async function generateAccessTokenFetch() {
  const response = await fetch(PAYPAL_API + "/v1/oauth2/token", {
    method: "post",
    body: "grant_type=client_credentials",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " +
        Buffer.from(PAYPAL_API_CLIENT + ":" + PAYPAL_API_SECRET).toString(
          "base64"
        ),
    },
  });
  const data = await response.json();
  return data.access_token;
}

export async function threeDSecure(orderID) {
  const accessToken = await generateAccessTokenFetch();
  const response = await fetch(
    `${PAYPAL_API}/v2/checkout/orders/${orderID}?fields=payment_source`,
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = await response.json();
  console.log("Data: ", data);
  return data;
}
