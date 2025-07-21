import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, Sparkles } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import CartDrawer from './CartDrawer';

const Header = ({ onCartOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getItemCount } = useCart();

  const categories = [
    { name: 'Rings', path: '/?category=rings' },
    { name: 'Necklaces', path: '/?category=necklaces' },
    { name: 'Earrings', path: '/?category=earrings' },
    { name: 'Bracelets', path: '/?category=bracelets' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="bg-white border-b border-luxury-silver sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-text-primary" />
            <div>
              <span className="text-2xl font-bold text-text-primary font-ibm-plex font-semibold">
                RJ GEMS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/shop"
              className="text-luxury-charcoal hover:text-text-primary font-ibm-plex font-semibold transition-all duration-300 relative group"
            >
              Shop
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-text-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className="text-luxury-charcoal hover:text-text-primary font-ibm-plex font-semibold transition-all duration-300 relative group"
              >
                {category.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-text-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for jewelry..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 premium-input focus:ring-2 focus:ring-text-primary/20"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-luxury-charcoal/40" />
              </div>
            </form>
          </div>

          {/* Cart Icon */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onCartOpen}
              className="relative p-2 text-luxury-charcoal hover:text-text-primary transition-all duration-300 group"
            >
              <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-text-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {getItemCount()}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-luxury-charcoal hover:text-text-primary transition-colors duration-300"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for jewelry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 premium-input"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-luxury-charcoal/40" />
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-luxury-silver py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/shop"
                className="text-luxury-charcoal hover:text-text-primary font-ibm-plex font-semibold transition-colors duration-300 text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={category.path}
                  className="text-luxury-charcoal hover:text-text-primary font-ibm-plex font-semibold transition-colors duration-300 text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 