require("dotenv").config();
const express = require("express");
var cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

// Create Express server
const app = express();
const PORT = process.env.PORT || 4000;

// Use Middleware cors
const corsOptions = {
  origin: "*",
  credentials: true, // Access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions)); // Use after variable declaration

// Recommended by Stripe documentation
app.use(express.static("public"));
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
    cancel_url: "https://amazonian.onrender.com/store",
  });

  res.send(
    JSON.stringify({
      url: session.url,
    })
  );
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
