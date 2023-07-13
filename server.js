require("dotenv").config();
const express = require("express");
const path = require("path");
var cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

// Create Express server
const app = express();
const port = process.env.PORT || 4000;

// Use Middleware cors
app.use(cors());

// Recommended by Stripe documentation
app.use(express.static(path.join(__dirname, "build")));
app.use(express.json());

app.post("/checkout", async (req, res) => {
  // Initiate session with Stripe
  const items = req.body.items;
  let lineItems = [];

  // Create new array in Stripe-format to process payments
  items.forEach((item) => {
    lineItems.push({
      price: item.id,
      quantity: item.quantity,
    });
  });

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: "https://amazonian.onrender.com/success",
    cancel_url: "https://amazonian.onrender.com/cancel",
  });

  res.send(JSON.stringify({ url: session.url }));
});
app.get("/test", (req, res) => {
  res.send("Api is working");
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/frontend/build/index.html"));
});

app.listen(port, () => console.log(`Listening on port ${port}`));
