import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, LogIn, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-muted/30 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center space-x-4">
              <a href="tel:+919820329571" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                <Phone className="h-3.5 w-3.5 mr-1.5" />
                +91 98203 29571
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
              <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 glass-header bg-white/90 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img 
                src="https://customer-assets.emergentagent.com/job_digital-designs-3/artifacts/w4v0buzu_image.png"
                alt="Pixeladda"
                className="h-8 sm:h-10 w-auto object-contain"
              />
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search designs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                  data-testid="search-input"
                />
              </div>
            </form>

            {/* Right Side */}
            <nav className="flex items-center space-x-4">
              <Link to="/cart" className="relative" data-testid="cart-link">
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>

              {isAuthenticated ? (
                <Link to="/dashboard" data-testid="dashboard-link">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" strokeWidth={1.5} />
                    {user?.name || 'Dashboard'}
                  </Button>
                </Link>
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

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search designs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
          </form>
        </div>
      </header>
    </>
  );
}
