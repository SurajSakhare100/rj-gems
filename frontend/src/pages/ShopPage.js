import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductGrid from '../components/ProductGrid';
import FilterSidebar from '../components/FilterSidebar';
import { Sparkles } from 'lucide-react';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    collection: searchParams.get('collection') || '',
    priceRange: searchParams.get('priceRange') || '',
    sort: searchParams.get('sort') || 'newest'
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.collection) params.append('collection', filters.collection);
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-');
        if (min) params.append('minPrice', min);
        if (max && max !== '+') params.append('maxPrice', max);
      }
      if (filters.sort) params.append('sort', filters.sort);

      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${apiUrl}/api/products?${params}`);
      setProducts(response.data.data);
    } catch (error) {
      // Error handling without console.log
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) newSearchParams.set(key, value);
    });
    setSearchParams(newSearchParams);
  }, [filters, setSearchParams]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({ category: '', collection: '', priceRange: '', sort: 'newest' });
  };

  return (
    <div className="min-h-screen bg-white">
      <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onClearFilters={clearFilters} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-luxury-charcoal mb-2">
            {filters.category ? `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)}` : 'All Products'}
          </h1>
          <p className="text-luxury-charcoal/60">{products.length} {products.length === 1 ? 'item' : 'items'} found</p>
        </div>
        <div className="w-full">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-text-primary"></div>
            </div>
          ) : products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-12">
              <Sparkles className="h-12 w-12 text-luxury-silver mx-auto mb-4" />
              <h3 className="text-lg font-medium text-luxury-charcoal mb-2">No products found</h3>
              <p className="text-luxury-charcoal/60">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage; 