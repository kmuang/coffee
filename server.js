const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const Stripe = require('stripe');

const app = express();
const port = process.env.PORT || 4242;
const allowedOrigin = process.env.ALLOWED_ORIGIN;

const products = {
  Espresso: { amount: 300 },
  Latte: { amount: 400 },
  Cappuccino: { amount: 450 },
  Americano: { amount: 350 },
  Mocha: { amount: 475 },
  Macchiato: { amount: 425 },
  'Flat White': { amount: 450 },
  'Irish Coffee': { amount: 550 },
  'Caramel Latte': { amount: 475 },
  'Vanilla Latte': { amount: 475 },
  'Hazelnut Coffee': { amount: 480 },
  'Iced Latte': { amount: 425 },
  Affogato: { amount: 500 },
  Ristretto: { amount: 350 }
};

app.use(express.json());
// Enable CORS for local development (Live Server, localhost, 127.0.0.1, etc.)
app.use((request, response, next) => {
  const origin = request.get('origin');
  const allowedOrigin = process.env.ALLOWED_ORIGIN;

  if (origin && (origin === allowedOrigin || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin))) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.setHeader('Vary', 'Origin');
  }

  if (request.method === 'OPTIONS') {
    return response.sendStatus(204);
  }

  return next();
});
app.use(express.static(__dirname));

app.post('/create-checkout-session', async (request, response) => {
  const stripeSecretKey = (process.env.STRIPE_SECRET_KEY || '').trim();

  if (!stripeSecretKey || stripeSecretKey.startsWith('sk_test_replace')) {
    return response.status(500).json({ error: 'Stripe is not configured. Set a valid STRIPE_SECRET_KEY in .env.' });
  }

  const items = Array.isArray(request.body.items) ? request.body.items : [];
  const lineItems = items.map(({ name, quantity }) => {
    const product = products[name];
    const validQuantity = Number.isInteger(quantity) && quantity > 0 && quantity <= 20;

    if (!product || !validQuantity) {
      return null;
    }

    return {
      price_data: {
        currency: 'usd',
        product_data: { name },
        unit_amount: product.amount
      },
      quantity
    };
  });

  if (!lineItems.length || lineItems.includes(null)) {
    return response.status(400).json({ error: 'Your cart contains an invalid item.' });
  }

  try {
    const stripe = new Stripe(stripeSecretKey);
    const clientOrigin = request.get('origin') || `${request.protocol}://${request.get('host')}`;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${clientOrigin}/index.html?checkout=success`,
      cancel_url: `${clientOrigin}/index.html?checkout=cancelled`
    });

    return response.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout error:', error.type, error.code, error.message);
    const message = error.type === 'StripeAuthenticationError'
      ? 'Stripe rejected the secret key. Check STRIPE_SECRET_KEY in .env, then restart the server.'
      : (error.message || 'Unable to start Stripe Checkout.');
    return response.status(500).json({ error: message });
  }
});

app.listen(port, () => {
  console.log(`Coffee Shop is running at http://localhost:${port}`);
});