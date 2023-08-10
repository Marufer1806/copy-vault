import express from "express";
import * as paypal from "./paypal.js";
import { PAYPAL_API_CLIENT } from "./config.js";

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const clientId = PAYPAL_API_CLIENT;
  const clientToken = await paypal.generateClientToken();
  res.render("index", { clientId, clientToken });
});

app.post("/api/orders", async (req, res) => {
  const order = await paypal.createOrder();
  res.json(order);
});

app.post("/api/orders/:orderID/capture", async (req, res) => {
  console.log("parametros", req.params);
  const { orderID } = req.params;
  const captureData = await paypal.capturePayment(orderID);
  res.json(captureData);
});

app.get("/api/orders/:orderID", async (req, res) => {
  const { orderID } = req.params;
  const data = await paypal.threeDSecure(orderID);
  res.json(data);
});

app.post("/webhooks-vault", (req, res) => {
  console.log("Webhooks: ", JSON.stringify(req.body))
  const response = req.body
  console.log("response: ", response);
  res.json(response)
})

app.listen(5500, () => {
  console.log("listening in port 5500");
});
