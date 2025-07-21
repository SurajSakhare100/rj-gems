const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Get all products with filtering
router.get('/', async (req, res) => {
  try {
    const { category, collection, metalType, minPrice, maxPrice, search, featured, sort } = req.query;
    
    let query = {};
    
    if (category) query.category = category;
    if (collection) query.productCollection = collection;
    if (metalType) query.metalType = metalType;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (featured === 'true') query.featured = true;
    if (search) query.$text = { $search: search };

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
      error: 'Failed to fetch products'
    });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product'
    });
  }
});

// Get product recommendations
router.get('/:id/recommendations', async (req, res) => {
  try {
    const currentProduct = await Product.findById(req.params.id);
    
    if (!currentProduct) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    const recommendations = await getRecommendations(currentProduct);
    
    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    // Error handling without console.log
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recommendations'
    });
  }
});

// Get all categories, metal types, and collections
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
      error: 'Failed to fetch categories'
    });
  }
});

// AI Recommendation Algorithm
async function getRecommendations(currentProduct) {
  try {
    const { category, metalType, price, productCollection } = currentProduct;
    
    // Base query - exclude current product
    let query = { _id: { $ne: currentProduct._id } };
    
    // Find products in the same category but different collections
    const sameCategoryDifferentCollection = await Product.find({
      ...query,
      category,
      productCollection: { $ne: productCollection }
    }).limit(3);
    
    // Find products in the same collection but different categories
    const sameCollectionDifferentCategory = await Product.find({
      ...query,
      productCollection,
      category: { $ne: category }
    }).limit(2);
    
    // Find products with similar price range (±20%)
    const priceRange = price * 0.2;
    const similarPrice = await Product.find({
      ...query,
      price: { $gte: price - priceRange, $lte: price + priceRange }
    }).limit(2);
    
    // Find products with same metal type
    const sameMetalType = await Product.find({
      ...query,
      metalType
    }).limit(2);
    
    // Combine and deduplicate recommendations
    const allRecommendations = [
      ...sameCategoryDifferentCollection,
      ...sameCollectionDifferentCategory,
      ...similarPrice,
      ...sameMetalType
    ];
    
    // Remove duplicates based on _id
    const uniqueRecommendations = allRecommendations.filter((product, index, self) =>
      index === self.findIndex(p => p._id.toString() === product._id.toString())
    );
    
    // Return top 6 recommendations
    return uniqueRecommendations.slice(0, 6);
  } catch (error) {
    // Error handling without console.log
    return [];
  }
}

module.exports = router; 