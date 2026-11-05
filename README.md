<p align="center">
  <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=1200" alt="Coffee Shop Banner" width="100%" style="border-radius: 8px;">
</p>

# ☕ Coffee Shop Web Application

A modern and responsive Coffee Shop web application featuring an interactive menu, dynamic cart management, and seamless payment processing powered by **Stripe Checkout**.

---

## 📸 Preview & Menu Gallery

<p align="center">
  <img src="img/expres.jpg" alt="Espresso" width="22%" style="border-radius: 6px; margin: 4px;">
  <img src="img/lat.jpg" alt="Latte" width="22%" style="border-radius: 6px; margin: 4px;">
  <img src="img/capu.jpg" alt="Cappuccino" width="22%" style="border-radius: 6px; margin: 4px;">
  <img src="img/coffee.jpeg" alt="Coffee Shop" width="22%" style="border-radius: 6px; margin: 4px;">
</p>

---

## ✨ Features

- **Interactive Menu**: Browse a wide selection of hot and iced coffee items with descriptions and pricing.
- **Alternative Theme**: Includes a chalkboard-style menu ([`chalkboard.html`](chalkboard.html)).
- **Dynamic Shopping Cart**: Real-time order calculation with quantity incrementing and instant totals.
- **Stripe Checkout Integration**: Secure checkout and payment processing via Stripe's hosted checkout sessions.
- **Serverless Stripe Checkout**: Use the Netlify or Vercel deployment, with the Stripe secret stored in the hosting provider's environment variables.

---

## 📁 Project Structure

```text
├── img/                  # Coffee images and assets
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore configuration (protects secrets)
├── chalkboard.html       # Chalkboard-themed menu page
├── index.html            # Main storefront & cart interface
├── package.json          # Node.js dependencies and scripts
├── README.md             # Project documentation
└── server.js             # Express backend & Stripe Checkout handler
```

---

## 🚀 Deploy and use in a browser

Stripe Checkout sessions must be created by a server because they require a private Stripe secret key. Do not open `index.html` directly or publish only the static files; those browser-only setups cannot securely start Stripe Checkout.

### Netlify

1. Import this repository into Netlify and deploy it. The included `netlify.toml` publishes the site and routes `/create-checkout-session` to the Netlify Function.
2. In **Site configuration → Environment variables**, add `STRIPE_SECRET_KEY` with your Stripe test secret key (`sk_test_...`).
3. Redeploy, then open the deployed site in a browser and place a test order.

### Vercel

1. Import this repository into Vercel and deploy it. The `api/create-checkout-session.js` function creates checkout sessions, and `vercel.json` routes the storefront's checkout request to it.
2. In **Project Settings → Environment Variables**, add `STRIPE_SECRET_KEY` with your Stripe test secret key (`sk_test_...`).
3. Redeploy, then open the deployed site in a browser and place a test order.

Use Stripe's test card `4242 4242 4242 4242` with any future expiry date and any CVC to verify a test payment. Switch to a live secret key only when ready to accept real payments.

## 🖥️ Optional local Express server

The Express server remains available for local development. It requires Node.js and does use `npm start`; this is not needed to use the deployed browser site.

### 1. Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) (version 16.x or higher)
- A [Stripe Account](https://stripe.com/) to get test API keys

### 2. Installation

Clone this repository and install the dependencies:

```bash
git clone https://github.com/your-username/coffee-shop.git
cd coffee-shop
npm install
```

### 3. Configure Environment Variables

1. Duplicate `.env.example` to create your `.env` file:

   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your **Stripe Test Secret Key**:

   ```env
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   PORT=4242
   ALLOWED_ORIGIN=http://127.0.0.1:5500
   ```

> ⚠️ **Important**: Never commit your `.env` file to GitHub. It is already included in `.gitignore` to keep your API keys private.

### Run locally

Start the Express server:

```bash
npm start
```

Open your browser and visit:
👉 **[http://localhost:4242](http://localhost:4242)**

The local Express server serves both the storefront and checkout API. Opening `index.html` directly or with a static-only preview server does not provide the secure Stripe API.

---

## ⚙️ Environment Variables

| Variable | Required | Description | Default |
| :--- | :---: | :--- | :--- |
| `STRIPE_SECRET_KEY` | **Yes** | Your Stripe secret key (`sk_test_...` or `sk_live_...`); set it in your hosting provider for deployments. | — |
| `PORT` | No | Port number on which the Node/Express server runs. | `4242` |
| `ALLOWED_ORIGIN` | No | Origin allowed for cross-origin checkout requests. | `http://127.0.0.1:5500` |

---

## 🛠️ Built With

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Bootstrap 4, Tailwind CSS (chalkboard view)
- **Backend**: Node.js, Express.js
- **Payments**: Stripe API SDK (`stripe`)
- **Config**: `dotenv`

---

## 📄 License

This project is licensed under the MIT License.
