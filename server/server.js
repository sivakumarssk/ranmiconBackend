const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoutes');
const bodyParser = require('body-parser');

const app = express();
dotenv.config();

app.use(fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 } // Max file size: 10 MB
}));

app.use(cors({
    origin: true,
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true,
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// backend/index.js
const stripe = require("stripe")("sk_test_51NI3kpSJK88knjYmgPqeGGvdfE37E7Qb8yoW7XwWEWwDQfsIukzIwSfQIOmiI52mFsKhQF3xa4tqX9nFvBE6ETSB001a4muj5o"); // Replace with your secret key


const endpointSecret = 'whsec_your_webhook_secret'; // Replace with your webhook secret from Stripe

// Stripe requires raw body for webhooks
// app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
//   let event;

//   try {
//     const sig = req.headers['stripe-signature'];

//     // Verify webhook signature
//     event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//   } catch (err) {
//     console.error('Webhook signature verification failed:', err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   // Handle the event
//   switch (event.type) {
//     case 'checkout.session.completed': {
//       const session = event.data.object;

//       // Save transaction details to your database
//       const transactionDetails = {
//         id: session.id,
//         email: session.customer_details.email,
//         amount: session.amount_total / 100, // Convert from cents
//         currency: session.currency,
//         payment_status: session.payment_status,
//         created_at: new Date(session.created * 1000), // Convert Unix timestamp
//       };

//       console.log('Transaction details:', transactionDetails);

//       // Example: Save to database
//       // await saveToDatabase(transactionDetails);

//       break;
//     }
//     case 'payment_intent.succeeded': {
//       const paymentIntent = event.data.object;
//       console.log('Payment succeeded:', paymentIntent);
//       break;
//     }
//     case 'payment_intent.payment_failed': {
//       const paymentIntent = event.data.object;
//       console.error('Payment failed:', paymentIntent);
//       break;
//     }
//     default:
//       console.warn(`Unhandled event type ${event.type}`);
//   }

//   // Acknowledge receipt of the event
//   res.json({ received: true });
// });


// app.post("/create-checkout-session", async (req, res) => {
//     try {
//       const { lineItems } = req.body;
  
//       // Ensure lineItems is properly formatted
//       if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
//         return res.status(400).json({ error: "Invalid line items provided" });
//       }
  
//       const session = await stripe.checkout.sessions.create({
//         payment_method_types: ["card"],
//         mode: "payment",
//         line_items: lineItems.map((item) => ({
//           price_data: {
//             currency: item.price_data.currency, // Ensure currency is provided
//             product_data: {
//               name: item.price_data.product_data.name,
//             },
//             unit_amount: item.price_data.unit_amount, // Convert price to cents
//           },
//           quantity: item.quantity, // Ensure quantity is provided
//         })),
//         success_url: "http://localhost:3000/success",
//         cancel_url: "http://localhost:3000/cancel",
//       });
  
//       res.json({ url: session.url });
//     } catch (error) {
//       console.error("Error creating checkout session:", error.message);
//       res.status(500).send("Internal Server Error");
//     }
//   });
  



const PORT = 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((error) => {
        console.log('Error:', error);
    });

app.use('/api', userRouter);

app.use(express.static(path.join(__dirname, '..', 'admin', 'build')));
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname, '..', 'admin', 'build', 'index.html'))
})
app.listen(PORT, () => {
    console.log('Server is started at', PORT);
});
