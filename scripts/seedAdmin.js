const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://russtikkgireinoldo:oyG6EcKirTyFVpPk@russtikk.7sjvnrl.mongodb.net/russtikk?retryWrites=true&w=majority&appName=russtikk');
    console.log('Connected to MongoDB successfully');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'Admin_Russtikk' });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Username:', existingAdmin.username);
      console.log('Created at:', existingAdmin.createdAt);
      
      // Ask if we should update the password
      console.log('\nIf you want to update the password, delete the existing admin first and run this script again.');
      process.exit(0);
    }

    // Create the admin user
    console.log('Creating admin user...');
    
    const adminData = {
      username: 'Admin_Russtikk',
      passwordHash: '16dd8f9f_Fashion_2025_cors', // This will be hashed automatically by the pre-save hook
      isActive: true
    };

    const admin = new Admin(adminData);
    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('Username:', admin.username);
    console.log('Password: 16dd8f9f_Fashion_2025_cors');
    console.log('Created at:', admin.createdAt);
    console.log('\n🔐 The password has been securely hashed in the database.');
    console.log('\n🎉 You can now sign in to the admin portal at /admin/signin');

  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
    process.exit(0);
  }
};

// Run the seed function
console.log('🌱 Starting admin user seeding process...');
console.log('----------------------------------------');
seedAdmin(); 