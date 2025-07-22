import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './hooks/useCart';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import JewelryChatbot from './components/JewelryChatbot';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import './index.css';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCartOpen = () => {
    setIsCartOpen(true);
  };

  const handleCartClose = () => {
    setIsCartOpen(false);
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <CartProvider>
          <div className="min-h-screen bg-white">
            <Header onCartOpen={handleCartOpen} />
            <main className="flex-1">
              <Outlet />
            </main>
            <Footer />
            <CartDrawer isOpen={isCartOpen} onClose={handleCartClose} />
            <JewelryChatbot />
            <Toaster 
              position="bottom-left"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#ffffff',
                  color: '#2c3e50',
                  border: '1px solid #e9ecef',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#d4af37',
                    secondary: '#ffffff',
                  },
                },
              }}
            />
          </div>
        </CartProvider>
      ),
      children: [
        {
          index: true,
          element: <Navigate to="/shop" replace />
        },
        {
          path: "shop",
          element: <ShopPage />
        },
        {
          path: "product/:id",
          element: <ProductDetailPage />
        }
      ]
    }
  ], {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  });

  return <RouterProvider router={router} />;
}

export default App; 