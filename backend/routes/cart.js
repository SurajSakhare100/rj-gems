const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const router = express.Router();

// Get cart by session ID
router.get('/:sessionId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ sessionId: req.params.sessionId })
      .populate('items.productId');
    
    if (!cart) {
      return res.json({
        success: true,
        data: {
          sessionId: req.params.sessionId,
          items: [],
          total: 0
        }
      });
    }
    
    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
});

// Add item to cart
router.post('/:sessionId/add', async (req, res) => {
  try {
    const { productId, quantity = 1, selectedVariant } = req.body;
    const { sessionId } = req.params;
    
    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }
    
    // Find or create cart
    let cart = await Cart.findOne({ sessionId });
    
    if (!cart) {
      cart = new Cart({
        sessionId,
        items: [],
        total: 0
      });
    }
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId,
        quantity,
        selectedVariant,
        price: product.price
      });
    }
    
    await cart.save();
    
    // Populate product details
    await cart.populate('items.productId');
    
    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message
    });
  }
});

// Update cart item quantity
router.put('/:sessionId/update/:itemId', async (req, res) => {
  try {
    const { sessionId, itemId } = req.params;
    const { quantity } = req.body;
    
    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }
    
    const cart = await Cart.findOne({ sessionId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    const item = cart.items.id(itemId);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }
    
    // Check stock
    const product = await Product.findById(item.productId);
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }
    
    item.quantity = quantity;
    await cart.save();
    
    await cart.populate('items.productId');
    
    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating cart item',
      error: error.message
    });
  }
});

// Remove item from cart
router.delete('/:sessionId/remove/:itemId', async (req, res) => {
  try {
    const { sessionId, itemId } = req.params;
    
    const cart = await Cart.findOne({ sessionId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();
    
    await cart.populate('items.productId');
    
    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    });
  }
});

// Clear cart
router.delete('/:sessionId/clear', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const cart = await Cart.findOne({ sessionId });
    
    if (!cart) {
      return res.json({
        success: true,
        message: 'Cart already empty'
      });
    }
    
    cart.items = [];
    await cart.save();
    
    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
});

module.exports = router; 