const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Get all products with filtering
router.get('/', async (req, res) => {
  try {
    const { category, collection, metalType, minPrice, maxPrice, search, featured, sort } = req.query;
    
    let query = {};
    
    // Category filter
    if (category) {
      query.category = category;
    }
    
    // Collection filter
    if (collection) {
      query.productCollection = collection;
    }
    
    // Metal type filter
    if (metalType) {
      query.metalType = metalType;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    // Featured filter
    if (featured === 'true') {
      query.featured = true;
    }
    
    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    // Build sort object
    let sortObject = {};
    switch (sort) {
      case 'price-low':
        sortObject = { price: 1 };
        break;
      case 'price-high':
        sortObject = { price: -1 };
        break;
      case 'name':
        sortObject = { name: 1 };
        break;
      case 'popular':
        sortObject = { reviewCount: -1, rating: -1 };
        break;
      case 'newest':
      default:
        sortObject = { createdAt: -1, featured: -1 };
        break;
    }
    
    const products = await Product.find(query).sort(sortObject);
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

// AI Recommendation Engine
router.get('/:id/recommendations', async (req, res) => {
  try {
    const currentProduct = await Product.findById(req.params.id);
    
    if (!currentProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Smart recommendation algorithm
    const recommendations = await getRecommendations(currentProduct);
    
    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating recommendations',
      error: error.message
    });
  }
});

// AI Recommendation Logic
async function getRecommendations(currentProduct) {
  try {
    // Get all products except current one
    const allProducts = await Product.find({ _id: { $ne: currentProduct._id } });
    
    // Score each product based on multiple factors
    const scoredProducts = allProducts.map(product => {
      let score = 0;
      
      // Same metal type (high priority)
      if (product.metalType === currentProduct.metalType) {
        score += 50;
      }
      
      // Different category (complementary pieces)
      if (product.category !== currentProduct.category) {
        score += 30;
      }
      
      // Similar price range (±$300)
      const priceDiff = Math.abs(product.price - currentProduct.price);
      if (priceDiff <= 300) {
        score += 20;
      } else if (priceDiff <= 600) {
        score += 10;
      }
      
      // Featured products get bonus
      if (product.featured) {
        score += 15;
      }
      
      // Higher ratings get bonus
      score += product.rating * 2;
      
      // Popular products (more reviews) get bonus
      score += Math.min(product.reviewCount / 10, 10);
      
      return { product, score };
    });
    
    // Sort by score and return top 6
    const topRecommendations = scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(item => item.product);
    
    return topRecommendations;
  } catch (error) {
    console.error('Error in recommendation algorithm:', error);
    return [];
  }
}

// Get categories
router.get('/categories/all', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    const metalTypes = await Product.distinct('metalType');
    const collections = await Product.distinct('productCollection');
    
    res.json({
      success: true,
      data: {
        categories,
        metalTypes,
        collections
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

module.exports = router; 