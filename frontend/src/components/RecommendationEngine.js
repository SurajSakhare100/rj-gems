import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles} from 'lucide-react';
import { renderStars } from '../utils/common';

const RecommendationEngine = ({ recommendations, loading, currentProduct }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

 

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-text-primary mx-auto mb-4"></div>
        <p className="text-luxury-charcoal/60 font-ibm-plex">Finding perfect matches...</p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className=" p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-text-primary/5 px-4 py-2 mb-4">
          <Sparkles className="h-5 w-5 text-text-primary" />
          <span className="text-sm font-ibm-plex font-semibold text-text-primary">AI Powered</span>
        </div>
        <h2 className="text-3xl font-fraunces font-normal text-text-primary mb-2">
          Complete Your Look
        </h2>
        <p className="text-luxury-charcoal/60 max-w-2xl mx-auto font-ibm-plex">
          Our intelligent recommendation engine suggests the perfect pieces to complement your selection, 
          considering style, metal type, and price range.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.slice(0, 6).map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="group block"
          >
            <div className="bg-white border border-luxury-silver hover:border-luxury-charcoal/30 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400';
                  }}
                />
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
        ))}
      </div>

      <div className="mt-8 text-center">
        <div className="inline-flex items-center space-x-2 text-sm text-luxury-charcoal/60 font-ibm-plex">
          <Sparkles className="h-4 w-4 text-text-primary" />
          <span>Recommendations based on your selection</span>
        </div>
      </div>
    </section>
  );
};

export default RecommendationEngine; 