// paypalClient.js
const paypal = require("@paypal/checkout-server-sdk");

// Environment setup
function environment() {
  const clientId = "AU-tummDVhIf9NP0kDXhq7ocFMeC8t83rMVv-4Rfm2drpXITtxvHVgukqz27zgV-DRKFHd6mg1b8AacT";
  const clientSecret = "EG-Z693u_k_2EVJT5oJE_qYPtIH8kHn7n9Wzbnscp8rdNWpkid903s3pKqrahZXkLGQDT9Ns2TPoy6LJ";

  return new paypal.core.LiveEnvironment(clientId, clientSecret);
  // Use `paypal.core.LiveEnvironment` for production
}

// PayPal client instance
function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

module.exports = { client };
