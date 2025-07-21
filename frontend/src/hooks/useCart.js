import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ITEMS':
      return { ...state, items: action.payload, loading: false };
    case 'ADD_ITEM':
      return { 
        ...state, 
        items: action.payload.items, 
        total: action.payload.total,
        loading: false 
      };
    case 'UPDATE_ITEM':
      return { 
        ...state, 
        items: action.payload.items, 
        total: action.payload.total,
        loading: false 
      };
    case 'REMOVE_ITEM':
      return { 
        ...state, 
        items: action.payload.items, 
        total: action.payload.total,
        loading: false 
      };
    case 'CLEAR_CART':
      return { ...state, items: [], total: 0, loading: false };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    loading: false
  });

  const getSessionId = () => {
    let sessionId = localStorage.getItem('cartSessionId');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('cartSessionId', sessionId);
    }
    return sessionId;
  };

  // Get API URL with fallback
  const getApiUrl = () => {
    return process.env.REACT_APP_API_URL;
  };

  const loadCart = useCallback(async () => {
    try {
      const sessionId = getSessionId();
      const apiUrl = getApiUrl();
      const response = await axios.get(`${apiUrl}/api/cart/${sessionId}`);
      
      if (response.data.success) {
        dispatch({ 
          type: 'SET_ITEMS', 
          payload: response.data.data.items || [] 
        });
      }
    } catch (error) {
      // Error handling without console.log
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = async (product, quantity = 1, selectedVariant = null) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const sessionId = getSessionId();
      const apiUrl = getApiUrl();
      
      const response = await axios.post(`${apiUrl}/api/cart/${sessionId}/add`, {
        productId: product._id,
        quantity,
        selectedVariant
      });

      if (response.data.success) {
        dispatch({ 
          type: 'ADD_ITEM', 
          payload: {
            items: response.data.data.items,
            total: response.data.data.total
          }
        });
        toast.success('Added to cart successfully!');
      }
    } catch (error) {
      // Error handling without console.log
      toast.error('Failed to add item to cart');
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const sessionId = getSessionId();
      const apiUrl = getApiUrl();
      
      const response = await axios.put(`${apiUrl}/api/cart/${sessionId}/update/${itemId}`, {
        quantity
      });

      if (response.data.success) {
        dispatch({ 
          type: 'UPDATE_ITEM', 
          payload: {
            items: response.data.data.items,
            total: response.data.data.total
          }
        });
        toast.success('Cart updated successfully!');
      }
    } catch (error) {
      // Error handling without console.log
      toast.error('Failed to update cart');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const sessionId = getSessionId();
      const apiUrl = getApiUrl();
      
      const response = await axios.delete(`${apiUrl}/api/cart/${sessionId}/remove/${itemId}`);

      if (response.data.success) {
        dispatch({ 
          type: 'REMOVE_ITEM', 
          payload: {
            items: response.data.data.items,
            total: response.data.data.total
          }
        });
        toast.success('Item removed from cart');
      }
    } catch (error) {
      // Error handling without console.log
      toast.error('Failed to remove item from cart');
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const sessionId = getSessionId();
      const apiUrl = getApiUrl();
      
      const response = await axios.delete(`${apiUrl}/api/cart/${sessionId}/clear`);

      if (response.data.success) {
        dispatch({ type: 'CLEAR_CART' });
        toast.success('Cart cleared successfully!');
      }
    } catch (error) {
      // Error handling without console.log
      toast.error('Failed to clear cart');
    }
  };

  const getItemCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      ...state,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 