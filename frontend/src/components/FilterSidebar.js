import React, { useState } from 'react';
import { ChevronDown, Grid } from 'lucide-react';

const FilterSidebar = ({ filters, onFilterChange, onClearFilters }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const categories = [
    { value: 'rings', label: 'Rings' },
    { value: 'necklaces', label: 'Necklaces' },
    { value: 'earrings', label: 'Earrings' },
    { value: 'bracelets', label: 'Bracelets' }
  ];

  const collections = [
    { value: 'wedding', label: 'Wedding Collection' },
    { value: 'engagement', label: 'Engagement Rings' },
    { value: 'anniversary', label: 'Anniversary' },
    { value: 'birthday', label: 'Birthday' },
    { value: 'everyday', label: 'Everyday Wear' }
  ];

  const priceRanges = [
    { value: '0-100', label: 'Under $100' },
    { value: '100-500', label: '$100 - $500' },
    { value: '500-1000', label: '$500 - $1,000' },
    { value: '1000-5000', label: '$1,000 - $5,000' },
    { value: '5000+', label: 'Over $5,000' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'popular', label: 'Most Popular' }
  ];

  const handleFilterChange = (filterType, value) => {
    onFilterChange({
      ...filters,
      [filterType]: value
    });
    setOpenDropdown(null);
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const getFilterLabel = (type) => {
    switch (type) {
      case 'category':
        return categories.find(cat => cat.value === filters.category)?.label || 'Product';
      case 'collection':
        return collections.find(col => col.value === filters.collection)?.label || 'Collection';
      case 'priceRange':
        return priceRanges.find(price => price.value === filters.priceRange)?.label || 'Price';
      case 'sort':
        return sortOptions.find(sort => sort.value === filters.sort)?.label || 'Sort';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white border-b border-luxury-silver py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <nav className="text-sm">
            <ol className="flex items-center space-x-2">
              <li>
                <a href="/" className="text-text-primary hover:text-red-800 transition-colors duration-200">
                  Home
                </a>
              </li>
              <li className="text-luxury-charcoal/60">|</li>
              <li>
                <span className="text-text-primary">Shop Jewellery</span>
              </li>
            </ol>
          </nav>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left side - Filter dropdowns */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Product Filter */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('category')}
                className="flex items-center space-x-2 px-4 py-2 border border-luxury-silver bg-white hover:bg-luxury-pearl transition-colors duration-200 min-w-[120px]"
              >
                <span className="text-sm text-luxury-charcoal">
                  {getFilterLabel('category')}
                </span>
                <ChevronDown className="h-4 w-4 text-luxury-charcoal" />
              </button>
              
              {openDropdown === 'category' && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-luxury-silver shadow-lg z-10">
                  <div className="py-2">
                    <button
                      onClick={() => handleFilterChange('category', '')}
                      className="w-full text-left px-4 py-2 text-sm text-luxury-charcoal hover:bg-luxury-pearl transition-colors duration-200"
                    >
                      All Products
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.value}
                        onClick={() => handleFilterChange('category', category.value)}
                        className="w-full text-left px-4 py-2 text-sm text-luxury-charcoal hover:bg-luxury-pearl transition-colors duration-200"
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Collection Filter */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('collection')}
                className="flex items-center space-x-2 px-4 py-2 border border-luxury-silver bg-white hover:bg-luxury-pearl transition-colors duration-200 min-w-[120px]"
              >
                <span className="text-sm text-luxury-charcoal">
                  {getFilterLabel('collection')}
                </span>
                <ChevronDown className="h-4 w-4 text-luxury-charcoal" />
              </button>
              
              {openDropdown === 'collection' && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-luxury-silver shadow-lg z-10">
                  <div className="py-2">
                    <button
                      onClick={() => handleFilterChange('collection', '')}
                      className="w-full text-left px-4 py-2 text-sm text-luxury-charcoal hover:bg-luxury-pearl transition-colors duration-200"
                    >
                      All Collections
                    </button>
                    {collections.map((collection) => (
                      <button
                        key={collection.value}
                        onClick={() => handleFilterChange('collection', collection.value)}
                        className="w-full text-left px-4 py-2 text-sm text-luxury-charcoal hover:bg-luxury-pearl transition-colors duration-200"
                      >
                        {collection.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Price Filter */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('priceRange')}
                className="flex items-center space-x-2 px-4 py-2 border border-luxury-silver bg-white hover:bg-luxury-pearl transition-colors duration-200 min-w-[120px]"
              >
                <span className="text-sm text-luxury-charcoal">
                  {getFilterLabel('priceRange')}
                </span>
                <ChevronDown className="h-4 w-4 text-luxury-charcoal" />
              </button>
              
              {openDropdown === 'priceRange' && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-luxury-silver shadow-lg z-10">
                  <div className="py-2">
                    <button
                      onClick={() => handleFilterChange('priceRange', '')}
                      className="w-full text-left px-4 py-2 text-sm text-luxury-charcoal hover:bg-luxury-pearl transition-colors duration-200"
                    >
                      All Prices
                    </button>
                    {priceRanges.map((price) => (
                      <button
                        key={price.value}
                        onClick={() => handleFilterChange('priceRange', price.value)}
                        className="w-full text-left px-4 py-2 text-sm text-luxury-charcoal hover:bg-luxury-pearl transition-colors duration-200"
                      >
                        {price.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Sort control */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('sort')}
              className="flex items-center space-x-2 px-4 py-2 border border-luxury-silver bg-white hover:bg-luxury-pearl transition-colors duration-200"
            >
              <Grid className="h-4 w-4 text-text-primary" />
              <span className="text-sm text-text-primary">
                {getFilterLabel('sort')}
              </span>
              <ChevronDown className="h-4 w-4 text-text-primary" />
            </button>
            
            {openDropdown === 'sort' && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-luxury-silver shadow-lg z-10">
                <div className="py-2">
                  {sortOptions.map((sort) => (
                    <button
                      key={sort.value}
                      onClick={() => handleFilterChange('sort', sort.value)}
                      className="w-full text-left px-4 py-2 text-sm text-luxury-charcoal hover:bg-luxury-pearl transition-colors duration-200"
                    >
                      {sort.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Active filters display */}
        {(filters.category || filters.collection || filters.priceRange) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-luxury-charcoal/60">Active filters:</span>
            {filters.category && (
              <span className="inline-flex items-center px-2 py-1 bg-luxury-pearl border border-luxury-silver text-xs text-luxury-charcoal">
                {categories.find(cat => cat.value === filters.category)?.label}
                <button
                  onClick={() => handleFilterChange('category', '')}
                  className="ml-1 text-luxury-charcoal/60 hover:text-luxury-charcoal"
                >
                  ×
                </button>
              </span>
            )}
            {filters.collection && (
              <span className="inline-flex items-center px-2 py-1 bg-luxury-pearl border border-luxury-silver text-xs text-luxury-charcoal">
                {collections.find(col => col.value === filters.collection)?.label}
                <button
                  onClick={() => handleFilterChange('collection', '')}
                  className="ml-1 text-luxury-charcoal/60 hover:text-luxury-charcoal"
                >
                  ×
                </button>
              </span>
            )}
            {filters.priceRange && (
              <span className="inline-flex items-center px-2 py-1 bg-luxury-pearl border border-luxury-silver text-xs text-luxury-charcoal">
                {priceRanges.find(price => price.value === filters.priceRange)?.label}
                <button
                  onClick={() => handleFilterChange('priceRange', '')}
                  className="ml-1 text-luxury-charcoal/60 hover:text-luxury-charcoal"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={onClearFilters}
              className="text-xs text-text-primary hover:text-red-800 underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Backdrop for closing dropdowns */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </div>
  );
};

export default FilterSidebar; 