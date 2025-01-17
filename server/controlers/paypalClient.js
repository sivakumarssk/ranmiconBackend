// paypalClient.js
const paypal = require("@paypal/checkout-server-sdk");

// Environment setup
function environment() {
  const clientId = "AWgsYN3w9HXVsqjXa2YqBtQe7iaSX4-V8G37B08dZmj37Fi-q7TzcNsKEKqDLgs2MF77xw5UGkgQOJPJ";
  const clientSecret = "EE91JM-RaN1K8PZ122wVoKpY3vneT3sPIHn87Fq4PYz64MUswj5BynWN6ChMYikLTqXVrlDFN6Nc5t40";

  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
  // Use `paypal.core.LiveEnvironment` for production
}

// PayPal client instance
function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

module.exports = { client };
