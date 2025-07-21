import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Star, ShoppingBag, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import RecommendationEngine from '../components/RecommendationEngine';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/products/${id}`);
        if (response.data.success) {
          setProduct(response.data.data);
          if (response.data.data.variants?.length > 0) {
            setSelectedVariant(response.data.data.variants[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecommendations = async () => {
      try {
        setRecommendationsLoading(true);
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/products/${id}/recommendations`);
        if (response.data.success) {
          setRecommendations(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setRecommendationsLoading(false);
      }
    };

    fetchProduct();
    fetchRecommendations();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    await addToCart(product, quantity, selectedVariant);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-5 w-5 ${
            i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-text-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-fraunces font-normal text-text-primary mb-2">Product not found</h2>
          <p className="text-luxury-charcoal/60">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600';
                }}
              />
            </div>
            
            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index
                        ? 'border-text-primary'
                        : 'border-luxury-silver hover:border-luxury-charcoal/30'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=150';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category & Name */}
            <div>
              <p className="text-sm text-luxury-charcoal/60 uppercase tracking-wide mb-2 font-ibm-plex font-semibold">
                {product.category}
              </p>
              <h1 className="text-3xl font-fraunces font-normal text-text-primary mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-2 mb-4">
                {renderStars(product.rating)}
                <span className="text-luxury-charcoal/60 font-ibm-plex">
                  ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-fraunces font-normal text-text-primary">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-luxury-charcoal/60 line-through font-fraunces font-normal">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="bg-text-primary text-white text-sm px-2 py-1 font-ibm-plex font-semibold">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-ibm-plex font-semibold text-luxury-charcoal mb-2">Description</h3>
              <p className="text-luxury-charcoal/60 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <h3 className="font-ibm-plex font-semibold text-luxury-charcoal mb-3">Select Options</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-3 border-2 text-left transition-all  duration-200 ${
                        selectedVariant === variant
                            ? 'border-text-primary text-text-primary font-ibm-plex font-semibold bg-text-primary/5'
                          : 'border-luxury-silver hover:border-luxury-charcoal/30'
                      }`}
                    >
                      <div className="font-ibm-plex font-semibold text-luxury-charcoal">
                        {variant.size} - {variant.metalType}
                      </div>
                      <div className="text-sm text-luxury-charcoal/60 font-ibm-plex font-normal">
                        {formatPrice(variant.price)}
                      </div>
                      <div className="text-xs text-luxury-charcoal/40 font-ibm-plex">
                        {variant.stock > 0 ? `${variant.stock} in stock` : 'Out of stock'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="font-ibm-plex font-semibold text-luxury-charcoal">Quantity:</label>
                <div className="flex items-center border border-luxury-silver">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-luxury-pearl transition-colors duration-200"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-luxury-silver font-ibm-plex font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-luxury-pearl transition-colors duration-200"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span className="font-ibm-plex font-semibold">
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </span>
                </button>
                <button className="p-3 border-2 border-luxury-silver hover:bg-luxury-pearl transition-colors duration-200">
                  <Heart className="h-5 w-5 text-luxury-charcoal/60" />
                </button>
                <button className="p-3 border-2 border-luxury-silver hover:bg-luxury-pearl transition-colors duration-200">
                  <Share2 className="h-5 w-5 text-luxury-charcoal/60" />
                </button>
              </div>
            </div>

            {/* Specifications */}
            {product.specifications && (
              <div className="border-t border-luxury-silver pt-6">
                <h3 className="font-ibm-plex font-semibold text-luxury-charcoal mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-ibm-plex font-semibold text-luxury-charcoal capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-luxury-charcoal/60 ml-2 font-ibm-plex">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            <div className="border-t border-luxury-silver pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-text-primary" />
                  <span className="text-luxury-charcoal font-ibm-plex font-semibold">Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-text-primary" />
                  <span className="text-luxury-charcoal font-ibm-plex font-semibold">Secure Payment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RotateCcw className="h-5 w-5 text-text-primary" />
                  <span className="text-luxury-charcoal font-ibm-plex font-semibold">30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="mt-16">
          <RecommendationEngine 
            recommendations={recommendations}
            loading={recommendationsLoading}
            currentProduct={product}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 