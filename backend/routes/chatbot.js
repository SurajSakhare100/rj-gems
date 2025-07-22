const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Product = require('../models/Product');
const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System prompt for the chatbot
const SYSTEM_PROMPT = `You are a luxury jewelry AI assistant for RJ GEMS, a premium jewelry e-commerce store specializing in fine jewelry and luxury accessories.

About RJ GEMS:
- We are a premium jewelry retailer offering high-quality engagement rings, wedding bands, necklaces, earrings, and bracelets
- Our collection features pieces in 14k Gold, Sterling Silver, Rose Gold, White Gold, and Platinum
- We offer jewelry for special occasions: engagement, wedding, anniversary, birthday, and everyday wear
- Our products range from affordable luxury to high-end pieces
- We focus on quality craftsmanship and customer satisfaction
- We provide expert jewelry care advice and sizing guidance

Keep your responses concise, friendly, and helpful. When users ask for products, search the database and show them relevant items. For general questions, provide brief, informative answers.

Be warm and welcoming, like a helpful jewelry consultant. Keep responses short and to the point unless showing products. Always represent RJ GEMS as a trusted luxury jewelry destination.`;

// Function to search products in database
async function searchProducts(query) {
  try {
    const searchRegex = new RegExp(query, 'i');
    
    const products = await Product.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { tags: searchRegex },
        { metalType: searchRegex },
        { productCollection: searchRegex }
      ]
    }).limit(10);

    return products.map(product => ({
      id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      metalType: product.metalType,
      price: product.price,
      originalPrice: product.originalPrice,
      rating: product.rating,
      images: product.images,
      specifications: product.specifications,
      stock: product.stock
    }));
  } catch (error) {
    console.error('❌ Product search error:', error.message);
    return [];
  }
}

// Function to get product recommendations
async function getRecommendations(criteria) {
  try {
    let query = {};
    
    if (criteria.category) {
      query.category = criteria.category;
    }
    
    if (criteria.metalType) {
      query.metalType = criteria.metalType;
    }
    
    if (criteria.maxPrice) {
      query.price = { $lte: criteria.maxPrice };
    }
    
    if (criteria.minPrice) {
      query.price = { ...query.price, $gte: criteria.minPrice };
    }
    
    const products = await Product.find(query)
      .sort({ rating: -1, featured: -1 })
      .limit(5);
    
    return products.map(product => ({
      id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      metalType: product.metalType,
      price: product.price,
      rating: product.rating,
      images: product.images
    }));
  } catch (error) {
    console.error('❌ Recommendations error:', error.message);
    return [];
  }
}

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Initialize Gemini model (using free tier)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare conversation context
    let conversationContext = SYSTEM_PROMPT + "\n\n";
    
    // Add conversation history
    if (conversationHistory.length > 0) {
      conversationContext += "Previous conversation:\n";
      conversationHistory.forEach((msg, index) => {
        conversationContext += `${msg.role}: ${msg.content}\n`;
      });
      conversationContext += "\n";
    }

    // Check if user is asking about products
    const productKeywords = ['product', 'jewelry', 'ring', 'necklace', 'earring', 'bracelet', 'gold', 'silver', 'diamond', 'price', 'buy', 'purchase'];
    const isProductQuery = productKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    let databaseInfo = "";
    
    if (isProductQuery) {
      // Search for relevant products
      const products = await searchProducts(message);
      
      if (products.length > 0) {
        databaseInfo = "\n\nHere are some beautiful pieces from our collection:\n";
        products.forEach((product, index) => {
          databaseInfo += `${index + 1}. ${product.name} - ${product.category} in ${product.metalType}\n`;
          databaseInfo += `   Price: $${product.price.toLocaleString()}${product.originalPrice ? ` (was $${product.originalPrice.toLocaleString()})` : ''}\n`;
          if (product.specifications) {
            if (product.specifications.stoneType) databaseInfo += `   Stone: ${product.specifications.stoneType}\n`;
            if (product.specifications.weight) databaseInfo += `   Weight: ${product.specifications.weight}\n`;
            if (product.specifications.setting) databaseInfo += `   Setting: ${product.specifications.setting}\n`;
          }
          databaseInfo += `   Rating: ${product.rating}/5 stars\n`;
          databaseInfo += `   Stock: ${product.stock > 0 ? `${product.stock} available` : 'Out of stock'}\n`;
          databaseInfo += `   Description: ${product.description.substring(0, 120)}...\n\n`;
        });
        databaseInfo += "I've found these stunning pieces for you! Click 'View Details' on any product to see more information and add it to your cart.";
      } else {
        databaseInfo = "\n\nI couldn't find specific products matching your query in our current inventory, but I'd be happy to help you with general jewelry advice or suggest similar alternatives!";
      }
    }

    // Create the full prompt
    const fullPrompt = conversationContext + databaseInfo + `\nUser: ${message}\n\nAssistant:`;

    // Generate response
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      response: text,
      products: isProductQuery ? await searchProducts(message) : null
    });

  } catch (error) {
    console.error('❌ Chatbot error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to process chat message',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Product search endpoint
router.get('/search', async (req, res) => {
  try {
    const { q, category, metalType, minPrice, maxPrice } = req.query;
    
    let query = {};
    
    if (q) {
      const searchRegex = new RegExp(q, 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { tags: searchRegex }
      ];
    }
    
    if (category) query.category = category;
    if (metalType) query.metalType = metalType;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    const products = await Product.find(query)
      .sort({ rating: -1, featured: -1 })
      .limit(20);
    
    res.json({
      success: true,
      products: products
    });
    
  } catch (error) {
    console.error('❌ Product search error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to search products'
    });
  }
});

// Recommendations endpoint
router.post('/recommendations', async (req, res) => {
  try {
    const { occasion, budget, preferences, category } = req.body;
    
    const recommendations = await getRecommendations({
      category,
      maxPrice: budget,
      ...preferences
    });
    
    res.json({
      success: true,
      recommendations
    });
    
  } catch (error) {
    console.error('❌ Recommendations error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get recommendations'
    });
  }
});

module.exports = router; 