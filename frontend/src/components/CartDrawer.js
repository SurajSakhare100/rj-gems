import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../hooks/useCart';

const CartDrawer = ({ isOpen, onClose }) => {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity);
    } else {
      removeFromCart(itemId);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-luxury-silver">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="h-6 w-6 text-text-primary" />
            <h2 className="text-xl font-bold text-luxury-charcoal">Shopping Cart</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-luxury-charcoal hover:text-accent-gold transition-colors duration-200"
          >
            <X className="h-5 w-5 hover:text-text-primary" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 p-6">
              <ShoppingBag className="h-16 w-16 text-luxury-silver mb-4" />
              <h3 className="text-lg font-medium text-luxury-charcoal mb-2">Your cart is empty</h3>
              <p className="text-sm text-luxury-charcoal/60 text-center">
                Add some beautiful jewelry to get started
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {items.map((item) => {
                // Skip items without product data
                if (!item.productId) {
                  return null;
                }

                return (
                  <div key={item._id} className="flex space-x-4 p-4 border border-luxury-silver">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.productId.images?.[0] || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200'}
                        alt={item.productId.name || 'Product'}
                        className="w-16 h-16 object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200';
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-luxury-charcoal truncate">
                        {item.productId.name || 'Product'}
                      </h4>
                      <p className="text-xs text-luxury-charcoal/60 mb-2">
                        {item.productId.metalType || 'N/A'}
                      </p>
                      <p className="text-sm font-medium text-luxury-charcoal">
                        {formatPrice(item.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 mt-3">
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          className="p-1 text-luxury-charcoal hover:text-accent-gold transition-colors duration-200"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm text-luxury-charcoal min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          className="p-1 text-luxury-charcoal hover:text-accent-gold transition-colors duration-200"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="flex-shrink-0 p-1 text-luxury-charcoal/60 hover:text-red-500 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-luxury-silver p-6">
            {/* Total */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-luxury-charcoal">Total:</span>
              <span className="text-xl font-bold text-luxury-charcoal">
                {formatPrice(total)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full btn-gold py-3">
                Checkout
              </button>
              <button
                onClick={clearCart}
                className="w-full btn-secondary py-3"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer; 