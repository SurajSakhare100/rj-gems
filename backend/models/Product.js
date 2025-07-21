const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['rings', 'necklaces', 'earrings', 'bracelets']
  },
  productCollection: {
    type: String,
    enum: ['wedding', 'engagement', 'anniversary', 'birthday', 'everyday']
  },
  metalType: {
    type: String,
    required: true,
    enum: ['14k Gold', 'Sterling Silver', 'Rose Gold', 'White Gold', 'Platinum']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  images: [{
    type: String,
    required: true
  }],
  specifications: {
    weight: String,
    dimensions: String,
    stoneType: String,
    stoneWeight: String,
    setting: String
  },
  variants: [{
    size: String,
    metalType: String,
    price: Number,
    stock: {
      type: Number,
      default: 0
    }
  }],
  stock: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  sku: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Index for search functionality
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema); 