require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (existing) {
      existing.isAdmin = true;
      await existing.save();
      console.log('✅ Existing user promoted to Admin!');
    } else {
      await User.create({
        name: 'VedicSevas Admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        isAdmin: true
      });
      console.log('✅ Admin user created successfully!');
      console.log(`   Email: ${process.env.ADMIN_EMAIL}`);
      console.log(`   Password: ${process.env.ADMIN_PASSWORD}`);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();