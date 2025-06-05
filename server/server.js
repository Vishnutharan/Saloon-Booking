const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  console.error('STRIPE_SECRET_KEY environment variable not set');
  process.exit(1);
}

const stripe = new Stripe(stripeSecret);

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const port = process.env.PORT || 4242;
app.listen(port, () => {
  console.log(`Stripe server listening on port ${port}`);
});
