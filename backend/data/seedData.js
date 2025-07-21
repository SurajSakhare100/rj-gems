const mongoose = require('mongoose');
const Product = require('../models/Product');
const sampleProducts = require('./sampleProducts');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rj-gems');

    // Clear existing products
    await Product.deleteMany({});

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);

    // Log some statistics
    const categories = await Product.distinct('category');
    const collections = await Product.distinct('productCollection');
    const metalTypes = await Product.distinct('metalType');
    
    const totalProducts = await Product.countDocuments();
    const featuredProducts = await Product.countDocuments({ featured: true });

    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

// Run the seed function
seedDatabase(); 