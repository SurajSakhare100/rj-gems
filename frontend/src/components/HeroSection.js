import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 hero-pattern opacity-20"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <Star className="h-6 w-6 text-accent-gold opacity-30" />
      </div>
      <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '2s' }}>
        <Sparkles className="h-5 w-5 text-accent-gold opacity-20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-luxury-pearl border border-luxury-silver px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-accent-gold" />
              <span className="text-sm font-medium text-luxury-charcoal">Premium Quality</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-luxury-charcoal mb-6 leading-tight">
              Timeless
              <span className="text-gradient block">Elegance</span>
              Awaits
            </h1>
            
            <p className="text-lg text-luxury-charcoal/70 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Discover our collection of fine jewelry pieces, where every item tells a story of craftsmanship and beauty.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/?featured=true"
                className="btn-gold text-base px-8 py-3 flex items-center justify-center space-x-2 group"
              >
                <span>Shop Featured</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/?category=rings"
                className="btn-secondary text-base px-8 py-3 border-luxury-charcoal text-luxury-charcoal hover:bg-luxury-charcoal hover:text-white"
              >
                View Rings
              </Link>
            </div>

            {/* Stats */}
            <div className="flex justify-center lg:justify-start space-x-8 mt-12">
              <div className="text-center">
                <div className="text-2xl font-bold text-luxury-charcoal">500+</div>
                <div className="text-sm text-luxury-charcoal/60">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-luxury-charcoal">4.9★</div>
                <div className="text-sm text-luxury-charcoal/60">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-luxury-charcoal">50+</div>
                <div className="text-sm text-luxury-charcoal/60">Unique Designs</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative z-10">
              <div className="relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800"
                  alt="Luxury Jewelry Collection"
                  className="w-full h-[500px] object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>
              
              {/* Decorative border */}
              <div className="absolute inset-0 border border-luxury-silver transform translate-x-2 translate-y-2 -z-10"></div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent-gold/10 border border-accent-gold/20"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent-gold/10 border border-accent-gold/20" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-auto"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".05"
            className="fill-luxury-charcoal"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".1"
            className="fill-luxury-charcoal"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="fill-luxury-pearl"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection; 