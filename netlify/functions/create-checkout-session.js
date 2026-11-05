const Stripe = require('stripe');
const products = require('../../products');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  const stripeSecretKey = (process.env.STRIPE_SECRET_KEY || '').trim();
  if (!stripeSecretKey || stripeSecretKey.startsWith('sk_test_replace')) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Stripe is not configured. Add STRIPE_SECRET_KEY in Netlify Site Configuration > Environment Variables.' })
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const items = Array.isArray(data.items) ? data.items : [];
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
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Your cart contains an invalid item.' })
      };
    }

    const stripe = new Stripe(stripeSecretKey);
    const host = event.headers.host || event.headers.Host;
    const proto = event.headers['x-forwarded-proto'] || 'https';
    const clientOrigin = `${proto}://${host}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${clientOrigin}/index.html?checkout=success`,
      cancel_url: `${clientOrigin}/index.html?checkout=cancelled`
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ url: session.url })
    };
  } catch (error) {
    console.error('Stripe Checkout error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: error.message || 'Unable to start Stripe Checkout.' })
    };
  }
};
