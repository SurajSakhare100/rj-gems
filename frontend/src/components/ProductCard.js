import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { renderStars } from '../utils/common';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

 

  return (
    <div className="group block relative pb-2 ">
      <Link
        key={product._id}
        to={`/product/${product._id}`}
        className="block"
      >
        <div className="bg-white border border-luxury-silver hover:border-luxury-charcoal/30 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
          <div className="aspect-square overflow-hidden relative">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400';
              }}
            />
            
            {/* Cart Icon - Appears on Hover */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <button
                onClick={handleAddToCart}
                className="p-2 bg-white/90  rounded-full p-1 backdrop-blur-sm hover:bg-white transition-all duration-200 border border-luxury-silver"
                title="Add to Cart"
              >
                <ShoppingBag className="h-4 w-4  text-luxury-charcoal hover:text-text-primary transition-colors duration-200" />
              </button>
            </div>
          </div>
          
          <div className="p-4 text-center">
            <p className="text-sm text-luxury-charcoal/60 uppercase tracking-wide mb-1 font-ibm-plex font-semibold">
              {product.category}
            </p>
            <h3 className="font-fraunces font-normal text-luxury-charcoal mb-2 line-clamp-2 group-hover:text-text-primary transition-colors duration-200">
              {product.name}
            </h3>
            
            <div className="flex items-center justify-center space-x-1 mb-2">
              {renderStars(product.rating)}
              <span className="text-sm text-luxury-charcoal/60 ml-1 font-ibm-plex">
                ({product.reviewCount})
              </span>
            </div>
            
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg font-fraunces font-normal text-luxury-charcoal">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-luxury-charcoal/60 font-ibm-plex font-semibold">
                {product.metalType}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard; 