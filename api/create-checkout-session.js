const Stripe = require('stripe');
const products = require('../products');

module.exports = async (request, response) => {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const stripeSecretKey = (process.env.STRIPE_SECRET_KEY || '').trim();
  if (!stripeSecretKey || stripeSecretKey.startsWith('sk_test_replace')) {
    return response.status(500).json({ error: 'Stripe is not configured. Set STRIPE_SECRET_KEY in your environment variables.' });
  }

  const items = Array.isArray(request.body?.items) ? request.body.items : [];
  const lineItems = items.map(({ name, quantity }) => {
    const product = products[name];
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
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
    const origin = `https://${request.headers.host}`;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${origin}/index.html?checkout=success`,
      cancel_url: `${origin}/index.html?checkout=cancelled`
    });

    return response.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout error:', error.type, error.code, error.message);
    return response.status(500).json({ error: error.message || 'Unable to start Stripe Checkout.' });
  }
};