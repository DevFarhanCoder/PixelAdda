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

      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold tracking-tight mb-2">Browse by Category</h2>
            <p className="text-muted-foreground">Explore our wide range of professional design templates</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <button
              onClick={() => setSelectedCategory(null)}
              data-testid="category-all"
              className={`p-4 rounded-md text-sm font-medium transition-all hover-lift ${
                !selectedCategory
                  ? 'bg-[#0055FF] text-white shadow-lg'
                  : 'bg-white border hover:border-primary'
              }`}
            >
              All Designs
            </button>
            {categories.map(category => (
              <button
                key={category._id}
                onClick={() => setSelectedCategory(category._id)}
                data-testid={`category-${category.slug}`}
                className={`p-4 rounded-md text-sm font-medium transition-all hover-lift text-left ${
                  selectedCategory === category._id
                    ? 'bg-[#0055FF] text-white shadow-lg'
                    : 'bg-white border hover:border-primary'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                {selectedCategory 
                  ? categories.find(c => c._id === selectedCategory)?.name 
                  : 'All Designs'}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {products.length} {products.length === 1 ? 'product' : 'products'} available
              </p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 bg-muted/20 rounded-lg" data-testid="no-products">
              <div className="max-w-md mx-auto">
                <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" strokeWidth={1.5} />
                <h3 className="text-xl font-semibold mb-2">No Products Available</h3>
                <p className="text-muted-foreground mb-6">
                  Products will appear here once the admin uploads design files.
                  {user?.role === 'admin' && (
                    <span className="block mt-2 text-primary">
                      <Link to="/admin/products" className="underline">Go to Admin Panel to add products →</Link>
                    </span>
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="group"
                  data-testid={`product-card-${product._id}`}
                >
                  <div className="hover-lift bg-white border rounded-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      {product.previewImagesUrls && product.previewImagesUrls[0] ? (
                        <img
                          src={product.previewImagesUrls[0]}
                          alt={product.title}
                          className="w-full h-full object-cover product-card-image"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-16 w-16 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium mb-1 tracking-tight line-clamp-2">{product.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        {product.category?.name || 'Uncategorized'}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-lg font-semibold text-primary">₹{product.price}</p>
                        <span className="text-xs text-muted-foreground">{product.downloads} downloads</span>
                      </div>
                    </div>
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
