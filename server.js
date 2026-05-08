'use strict';
require('dotenv').config();

const express = require('express');
const path    = require('path');
const stripe  = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app      = express();
const PORT     = 3001;//process.env.PORT     || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

const PRICE_CENTS = 250000; // $2,500.00

/* ── Helpers ────────────────────────────────────────────────── */
function sanitize(value, maxLength = 200) {
  return String(value ?? '').trim().slice(0, maxLength);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/* ── GET /verify-session ────────────────────────────────────── */
app.get('/verify-session', async (req, res) => {
  try {
    const sessionId = sanitize(req.query.session_id || '', 200);
    if (!sessionId.startsWith('cs_')) {
      return res.status(400).json({ verified: false, error: 'Invalid session ID.' });
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.json({ verified: session.payment_status === 'paid' });
  } catch {
    res.status(400).json({ verified: false, error: 'Could not verify session.' });
  }
});

/* ── POST /create-checkout-session ─────────────────────────── */
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const cleanName  = sanitize(name, 100);
    const cleanEmail = sanitize(email, 200);
    const cleanPhone = sanitize(phone, 30);
    const cleanMsg   = sanitize(message, 500);

    if (!cleanName)              return res.status(400).json({ error: 'Name is required.' });
    if (!cleanEmail)             return res.status(400).json({ error: 'Email address is required.' });
    if (!isValidEmail(cleanEmail)) return res.status(400).json({ error: 'Please enter a valid email address.' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Muk Yan Jong — Full Payment',
              description: 'Handcrafted Muk Yan Jong by Mike Kilcoyne · Denver Kung Fu.',
            },
            unit_amount: PRICE_CENTS,
          },
          quantity: 1,
        },
      ],
      mode:           'payment',
      customer_email: cleanEmail || undefined,
      metadata: {
        customer_name: cleanName,
        phone:         cleanPhone,
        message:       cleanMsg,
      },
      success_url: `${BASE_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${BASE_URL}/reserve.html`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: 'Payment processing failed. Please try again or contact admin@denverkungfu.com.' });
  }
});

/* ── Start ──────────────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`\n  ┌─────────────────────────────────────────┐`);
  console.log(`  │  Denver Kung Fu — Jong Store             │`);
  console.log(`  │  http://localhost:${PORT}                    │`);
  console.log(`  └─────────────────────────────────────────┘\n`);
});
