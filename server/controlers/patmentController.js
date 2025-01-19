const User = require("../models/paymentDetials");
const paypal = require("@paypal/checkout-server-sdk");
const { client } = require("./paypalClient");

const stripe = require("stripe")("sk_test_51NI3kpSJK88knjYmgPqeGGvdfE37E7Qb8yoW7XwWEWwDQfsIukzIwSfQIOmiI52mFsKhQF3xa4tqX9nFvBE6ETSB001a4muj5o"); // Replace with your secret key

const registerUserAndInitiatePayment = async (req, res) => {
  try {
    const { formData, selectedPlan, selectedAccommodations, lineItems } = req.body;

    console.log([selectedAccommodations]);
    

    // Save user data with payment status as 'pending'
    const newUser = new User({
      ...formData,
      selectedPlan: {
        planId: selectedPlan.planId,
        planName: selectedPlan.planName,
        participantType: selectedPlan.participantType,
        price: selectedPlan.price,
      },
      accommodations: selectedAccommodations || [],
      payment: {
        status: "pending",
      },
    });

    const savedUser = await newUser.save();

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems.map((item) => ({
        price_data: {
          currency: item.currency,
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents here
        },
        quantity: item.quantity,
      })),
      metadata: {
        userId: savedUser._id.toString(),
      },
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    // Save Stripe session details
    savedUser.payment.stripeSessionId = session.id;
    await savedUser.save();

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error initiating payment:", error.message);
    res.status(500).send("Failed to initiate payment.");
  }
};



const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = 'whsec_your_webhook_secret'; // Replace with your webhook secret from Stripe

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const { type, data } = event;

  if (type === "checkout.session.completed") {
    const session = data.object;

    const user = await User.findOne({ "payment.stripeSessionId": session.id });
    if (user) {
      user.payment.status = "succeeded";
      user.payment.amount = session.amount_total / 100; // Convert from cents
      user.payment.currency = session.currency;
      user.payment.stripePaymentIntentId = session.payment_intent; // Transaction ID
      await user.save();
    }
  } else if (type === "payment_intent.payment_failed") {
    const paymentIntent = data.object;

    const user = await User.findOne({ "payment.stripePaymentIntentId": paymentIntent.id });
    if (user) {
      user.payment.status = "failed";
      await user.save();
    }
  }

  res.json({ received: true });
};


const getRegistrations = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No registrations found." });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching registrations:", error.message);
    res.status(500).json({ message: "Failed to fetch registrations." });
  }
};


const createPayPalOrder = async (req, res) => {
  try {
    const { formData, selectedPlan, selectedAccommodations, totalPrice } = req.body;

    
    // Save user data with payment status as 'pending'
    const newUser = new User({
      ...formData,
      selectedPlan: {
        planId: selectedPlan.planId,
        planName: selectedPlan.planName,
        participantType: selectedPlan.participantType,
        price: selectedPlan.price,
      },
      accommodations: selectedAccommodations || [],
      payment: {
        status: "pending",
      },
    });

    const savedUser = await newUser.save();

    const request = new paypal.orders.OrdersCreateRequest();
      request.prefer("return=representation")
  request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "EUR",
            value: totalPrice, // Total amount
          },
          description: "Conference Plan and Accommodations",
        },
      ],
    });

    const order = await client().execute(request);
    res.json({ orderID: order.result.id });
  } catch (error) {
    console.error("Error creating PayPal order:", error.message);
    res.status(500).send("Failed to create PayPal order.");
  }
};

const capturePayPalOrder = async (req, res) => {
  try {
    const { orderID } = req.body;

    const captureRequest = new paypal.orders.OrdersCaptureRequest(orderID);
    captureRequest.requestBody({}); // Required by the SDK, even if empty

    const capture = await client().execute(captureRequest);

    if (capture.result.status === "COMPLETED") {
      // Handle successful capture
      res.json({ success: true });
    } else {
      // Handle unsuccessful capture
      res.status(400).json({ success: false });
    }
  } catch (error) {
    console.error("Error capturing PayPal order:", error.message);
    res.status(500).json({ error: "Failed to capture PayPal order." });
  }
};




module.exports ={
  handleWebhook,
  registerUserAndInitiatePayment,
  getRegistrations,
  createPayPalOrder,
  capturePayPalOrder
}