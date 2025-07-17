const mongoose = require('mongoose');

const productImageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  isPrimary: {
    type: Boolean,
    default: false
  },
  alt: {
    type: String,
    default: ''
  }
});

const productSchema = new mongoose.Schema({
  // Basic product information
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  description: {
    type: String,
    required: true
  },
  
  price: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Category
  category: {
    type: String,
    required: true,
    enum: ['swimwear', 'ball-gowns', 'revamp'],
    lowercase: true
  },
  
  // Product variants
  sizes: [{
    type: String,
    required: true
  }],
  
  colors: [{
    type: String,
    required: true
  }],
  
  // Images - Multiple images support
  images: [productImageSchema],
  
  // Inventory
  inStock: {
    type: Boolean,
    default: true
  },
  
  stockQuantity: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // SEO and additional fields
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  
  tags: [{
    type: String,
    trim: true
  }],
  
  featured: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create slug from name before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  this.updatedAt = Date.now();
  next();
});

// Ensure at least one image is marked as primary
productSchema.pre('save', function(next) {
  if (this.images && this.images.length > 0) {
    const primaryExists = this.images.some(img => img.isPrimary);
    if (!primaryExists) {
      this.images[0].isPrimary = true;
    }
  }
  next();
});

// Virtual for primary image
productSchema.virtual('primaryImage').get(function() {
  if (this.images && this.images.length > 0) {
    const primary = this.images.find(img => img.isPrimary);
    return primary || this.images[0];
  }
  return null;
});

// Include virtuals when converting to JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema); 