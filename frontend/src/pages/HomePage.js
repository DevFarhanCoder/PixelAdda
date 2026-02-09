import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, LogIn } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const url = selectedCategory 
        ? `${API_URL}/api/products?category=${selectedCategory}`
        : `${API_URL}/api/products`;
      const response = await axios.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 glass-header bg-white/80 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6" strokeWidth={1.5} />
              <span className="text-xl font-semibold tracking-tight">DesignMarket</span>
            </Link>
            
            <nav className="flex items-center space-x-6">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" data-testid="dashboard-link">
                    <Button variant="ghost" size="sm">
                      <User className="h-4 w-4 mr-2" strokeWidth={1.5} />
                      Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" data-testid="login-link">
                    <Button variant="ghost" size="sm">
                      <LogIn className="h-4 w-4 mr-2" strokeWidth={1.5} />
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" data-testid="register-link">
                    <Button size="sm" data-testid="register-button">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden" style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1732197537587-2973f6801969?crop=entropy&cs=srgb&fm=jpg&q=85')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="absolute inset-0 bg-white/60"></div>
        <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-none mb-6">
            Premium Design
            <br />
            Files for Creatives
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
            High-quality PSD, AI, and CDR files crafted by professional designers.
          </p>
        </div>
      </section>

      <section className="py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              data-testid="category-all"
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-[#0055FF] text-white'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              All Designs
            </button>
            {categories.map(category => (
              <button
                key={category._id}
                onClick={() => setSelectedCategory(category._id)}
                data-testid={`category-${category.slug}`}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === category._id
                    ? 'bg-[#0055FF] text-white'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length === 0 ? (
            <div className="text-center py-16" data-testid="no-products">
              <p className="text-muted-foreground">No products available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(product => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="group"
                  data-testid={`product-card-${product._id}`}
                >
                  <div className="hover-lift">
                    <div className="aspect-square bg-gray-100 rounded-md overflow-hidden mb-4">
                      {product.previewImages && product.previewImages[0] ? (
                        <img
                          src={product.previewImages[0]}
                          alt={product.title}
                          className="w-full h-full object-cover product-card-image"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-16 w-16 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium mb-1 tracking-tight">{product.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                      {product.description}
                    </p>
                    <p className="font-mono text-sm font-medium">₹{product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="border-t py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>© 2026 DesignMarket. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
