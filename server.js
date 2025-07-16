const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const Order = require('./models/Order');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://russtikkgireinoldo:oyG6EcKirTyFVpPk@russtikk.7sjvnrl.mongodb.net/russtikk?retryWrites=true&w=majority&appName=russtikk')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Serve static files from the React build
app.use(express.static(path.join(__dirname, 'build')));

// Stripe configuration
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create payment intent endpoint
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', metadata = {} } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency,
      metadata: metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send({
      error: error.message,
    });
  }
});

// Save order endpoint
app.post('/api/orders', async (req, res) => {
  try {
    const { orderData } = req.body;
    
    const order = new Order({
      orderId: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customerInfo: orderData.customerInfo,
      items: orderData.items,
      payment: orderData.payment,
      subtotal: orderData.subtotal,
      tax: orderData.tax || 0,
      shipping: orderData.shipping || 0,
      total: orderData.total
    });

    await order.save();
    res.status(201).json({ success: true, orderId: order.orderId });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admin endpoints
app.get('/api/admin/orders', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments();

    res.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get specific order
app.get('/api/admin/orders/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.send({ status: 'OK', message: 'Payment server is running' });
});

// Handle React routing, return all requests to React app
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Payment server running on port ${PORT}`);
}); 