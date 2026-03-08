import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  LogIn,
  Phone,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  MessageCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-primary/10 via-purple-50 to-pink-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 text-base">
            <div className="flex items-center space-x-6">
              <a
                href="tel:+919820329571"
                className="flex items-center text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4 mr-2" />
                +91 98203 29571
              </a>
              <a
                href="https://wa.me/919820329571"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-green-600 hover:text-green-700 transition-colors"
                title="WhatsApp"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                +91 98203 29571
              </a>
            </div>
            <div className="flex items-center space-x-6">
              {/* Social Media Icons */}
              <div className="hidden md:flex items-center space-x-4 mr-4">
                <a
                  href="https://facebook.com/pixeladda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-blue-600 transition-colors"
                  title="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="https://instagram.com/pixeladda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-pink-600 transition-colors"
                  title="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://youtube.com/@pixeladda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-red-600 transition-colors"
                  title="YouTube"
                >
                  <Youtube className="h-4 w-4" />
                </a>
                <a
                  href="https://twitter.com/pixeladda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-blue-400 transition-colors"
                  title="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              </div>
              <Link
                to="/contact"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Contact
              </Link>
              <Link
                to="/join-community"
                className="text-muted-foreground hover:text-primary transition-colors hidden sm:inline"
              >
                Join Community
              </Link>
              <Link
                to="/faq"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 glass-header bg-gradient-to-r from-white via-primary/5 to-purple-50 backdrop-blur-sm shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center mr-12">
              <img
                src="/Logo.jpg.jpeg"
                alt="Pixeladda"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </Link>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-2xl mr-8"
            >
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search designs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 h-12 text-base"
                  data-testid="search-input"
                />
              </div>
            </form>

            {/* Right Side */}
            <nav className="flex items-center space-x-6">
              <Link to="/cart" className="relative" data-testid="cart-link">
                <Button
                  variant="ghost"
                  size="default"
                  className="relative h-12"
                >
                  <ShoppingCart className="h-6 w-6" strokeWidth={1.5} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-sm rounded-full h-6 w-6 flex items-center justify-center font-medium">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>

              {isAuthenticated ? (
                <Link to="/dashboard" data-testid="dashboard-link">
                  <Button
                    variant="ghost"
                    size="default"
                    className="h-12 text-base"
                  >
                    <User className="h-5 w-5 mr-2" strokeWidth={1.5} />
                    {user?.name || "Dashboard"}
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" data-testid="login-link">
                    <Button
                      variant="ghost"
                      size="default"
                      className="h-12 text-base"
                    >
                      <LogIn className="h-5 w-5 mr-2" strokeWidth={1.5} />
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" data-testid="register-link">
                    <Button
                      size="default"
                      className="h-12 text-base"
                      data-testid="register-button"
                    >
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
