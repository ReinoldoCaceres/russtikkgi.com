const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const Order = require('./models/Order');
const Product = require('./models/Product');
const Admin = require('./models/Admin');
require('dotenv').config();

// Cloudinary setup
const { v2: cloudinary } = require('cloudinary');
cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://russtikkgireinoldo:oyG6EcKirTyFVpPk@russtikk.7sjvnrl.mongodb.net/russtikk?retryWrites=true&w=majority&appName=russtikk')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Serve static files from the React build (only in production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
}

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'public/uploads/products');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Stripe configuration
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'russtikk_admin_secret_2025_secure_key';

// ============================================
// PRODUCT API ENDPOINTS
// ============================================

// Get all products with pagination and filtering
app.get('/api/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const featured = req.query.featured;
    
    let query = {};
    if (category) query.category = category;
    if (featured) query.featured = featured === 'true';
    
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single product by ID or slug
app.get('/api/products/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Try to find by MongoDB _id first, then by slug
    let product;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      product = await Product.findById(identifier);
    }
    
    if (!product) {
      product = await Product.findOne({ slug: identifier });
    }
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new product
app.post('/api/products', async (req, res) => {
  try {
    const productData = req.body;
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'price', 'category', 'sizes', 'colors'];
    for (const field of requiredFields) {
      if (!productData[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }
    
    const product = new Product(productData);
    await product.save();
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const product = await Product.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Delete associated image files
    if (product.images && product.images.length > 0) {
      product.images.forEach(image => {
        const filePath = path.join(__dirname, 'public', image.path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    
    await Product.findByIdAndDelete(id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload product images
app.post('/api/products/:id/images', upload.array('images', 10), async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }
    
    const newImages = [];
    for (let index = 0; index < req.files.length; index++) {
      const file = req.files[index];
      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: 'products',
        resource_type: 'image'
      });

      // Remove local temp file
      try { fs.existsSync(file.path) && fs.unlinkSync(file.path); } catch {}

      newImages.push({
        filename: file.originalname || file.filename,
        path: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        isPrimary: product.images.length === 0 && index === 0,
        alt: req.body.alt || product.name
      });
    }

    product.images.push(...newImages);
    await product.save();
    
    res.json({
      message: 'Images uploaded successfully',
      images: newImages,
      product: product
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete specific product image
app.delete('/api/products/:id/images/:imageId', async (req, res) => {
  try {
    const { id, imageId } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const imageIndex = product.images.findIndex(img => img._id.toString() === imageId);
    if (imageIndex === -1) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    // Delete Cloudinary asset if present, else attempt local file cleanup
    const image = product.images[imageIndex];
    if (image.publicId) {
      try { await cloudinary.uploader.destroy(image.publicId); } catch (e) { console.error('Cloudinary destroy failed:', e); }
    } else if (image.path && image.path.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, 'public', image.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    // Remove from product
    product.images.splice(imageIndex, 1);
    
    // If deleted image was primary and other images exist, make first one primary
    if (image.isPrimary && product.images.length > 0) {
      product.images[0].isPrimary = true;
    }
    
    await product.save();
    res.json({ message: 'Image deleted successfully', product });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: error.message });
  }
});

// Set primary image
app.put('/api/products/:id/images/:imageId/primary', async (req, res) => {
  try {
    const { id, imageId } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Set all images to not primary
    product.images.forEach(img => img.isPrimary = false);
    
    // Set specified image as primary
    const targetImage = product.images.find(img => img._id.toString() === imageId);
    if (!targetImage) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    targetImage.isPrimary = true;
    await product.save();
    
    res.json({ message: 'Primary image updated', product });
  } catch (error) {
    console.error('Error setting primary image:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// EXISTING ENDPOINTS (Stripe, Orders, Admin)
// ============================================

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

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================

// Middleware to verify JWT token
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.adminId);
    
    if (!admin || !admin.isActive) {
      return res.status(401).json({ error: 'Invalid token or admin not active.' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid token.' });
  }
};

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

// Admin login endpoint
app.post('/api/auth/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    // Find admin user
    const admin = await Admin.findOne({ username: username.trim() });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({ error: 'Admin account is deactivated.' });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Update last login
    await admin.updateLastLogin();

    // Generate JWT token
    const token = jwt.sign(
      { adminId: admin._id, username: admin.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// Verify token endpoint
app.get('/api/auth/admin/verify', authenticateAdmin, (req, res) => {
  res.json({
    success: true,
    admin: {
      id: req.admin._id,
      username: req.admin.username,
      lastLogin: req.admin.lastLogin
    }
  });
});

// Admin logout endpoint (optional - mainly for clearing token on client)
app.post('/api/auth/admin/logout', authenticateAdmin, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});

// ============================================
// PROTECTED ADMIN ENDPOINTS
// ============================================

// Get admin orders (protected)
app.get('/api/admin/orders', authenticateAdmin, async (req, res) => {
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

// Handle React routing, return all requests to React app (only in production)
if (process.env.NODE_ENV === 'production') {
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Payment server running on port ${PORT}`);
}); 