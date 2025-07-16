const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Order identification
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Customer information
  customerInfo: {
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  
  // Items purchased
  items: [{
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true }
  }],
  
  // Payment information
  payment: {
    stripePaymentIntentId: { type: String, required: true },
    amount: { type: Number, required: true }, // in cents
    currency: { type: String, default: 'usd' },
    status: { type: String, required: true } // 'succeeded', 'pending', 'failed'
  },
  
  // Order totals
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  total: { type: Number, required: true },
  
  // Order status
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'confirmed'
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema); 