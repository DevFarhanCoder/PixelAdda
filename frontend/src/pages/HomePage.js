import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import Navbar from "../components/Navbar";

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
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
      console.error("Error fetching products:", error);
    }
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    if (addToCart(product)) {
      toast.success("Added to cart!");
    } else {
      toast.info("Already in cart");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative h-[50vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1732197537587-2973f6801969?crop=entropy&cs=srgb&fm=jpg&q=85')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-white/70"></div>
        <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-none mb-6">
            Premium Design Files
            <br />
            for Creative Professionals
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
            High-quality PSD, AI, and CDR templates for all your design needs.
          </p>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Categories */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold mb-4 px-4 lg:px-0">
                Categories
              </h2>
              <nav className="space-y-1">
                <button
                  onClick={() => setSelectedCategory(null)}
                  data-testid="category-all"
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
                    !selectedCategory
                      ? "bg-primary text-white"
                      : "hover:bg-muted"
                  }`}
                >
                  <span className="font-medium">All Designs</span>
                  {!selectedCategory && <ArrowRight className="h-4 w-4" />}
                </button>
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => setSelectedCategory(category._id)}
                    data-testid={`category-${category.slug}`}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
                      selectedCategory === category._id
                        ? "bg-primary text-white"
                        : "hover:bg-muted"
                    }`}
                  >
                    <span className="font-medium">{category.name}</span>
                    {selectedCategory === category._id && (
                      <ArrowRight className="h-4 w-4" />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Right Side - Products */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {selectedCategory
                    ? categories.find((c) => c._id === selectedCategory)?.name
                    : "All Designs"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {products.length}{" "}
                  {products.length === 1 ? "product" : "products"} available
                </p>
              </div>
            </div>

            {products.length === 0 ? (
              <div
                className="text-center py-20 bg-muted/10 rounded-lg"
                data-testid="no-products"
              >
                <div className="max-w-md mx-auto">
                  <ShoppingBag
                    className="h-16 w-16 mx-auto text-muted-foreground mb-4"
                    strokeWidth={1.5}
                  />
                  <h3 className="text-xl font-semibold mb-2">
                    No Products Available
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Products will appear here once the admin uploads design
                    files.
                  </p>
                </div>
              </div>
            ) : (
              <div className="columns-1 sm:columns-2 lg:columns-2 xl:columns-3 gap-6 space-y-6">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="break-inside-avoid mb-6 group"
                    data-testid={`product-card-${product._id}`}
                  >
                    <Link to={`/product/${product._id}`}>
                      <div className="hover-lift bg-white border rounded-lg overflow-hidden">
                        <div className="bg-gray-100 overflow-hidden">
                          {product.previewImagesUrls &&
                          product.previewImagesUrls[0] ? (
                            <img
                              src={product.previewImagesUrls[0]}
                              alt={product.title}
                              className="w-full h-auto object-contain product-card-image"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="h-16 w-16 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium mb-1 tracking-tight line-clamp-2">
                            {product.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mb-3">
                            {product.category?.name || "Uncategorized"}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="font-mono text-lg font-semibold text-primary">
                              ₹{product.price}
                            </p>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => handleAddToCart(product, e)}
                              data-testid="add-to-cart-button"
                            >
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-12 mt-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Pixeladda</h3>
              <p className="text-sm text-muted-foreground">
                Premium design templates for creative professionals.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/contact"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="text-muted-foreground hover:text-primary"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Phone: +91 98203 29571</li>
                <li>Email: support@pixeladda.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 Pixeladda. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
