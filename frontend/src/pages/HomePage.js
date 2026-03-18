import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight, Search, ArrowUp, Play } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import Navbar from "../components/Navbar";

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [videoProducts, setVideoProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const url = selectedCategory
        ? `${API_URL}/api/products?category=${selectedCategory}`
        : `${API_URL}/api/products`;
      const response = await axios.get(url);
      setAllProducts(response.data);
      setProducts(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [selectedCategory]);

  const fetchVideoProducts = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products/filter?type=video`);
      setVideoProducts(response.data.slice(0, 3)); // Only get first 3 videos
    } catch (error) {
      console.error("Error fetching video products:", error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchVideoProducts();
  }, [fetchCategories, fetchProducts, fetchVideoProducts]);

  // Filter products based on search query and generate suggestions
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setProducts(allProducts);
      setSearchSuggestions([]);
      setShowSuggestions(false);
    } else {
      const filtered = allProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setProducts(filtered);

      // Generate suggestions from matching products
      const suggestions = filtered
        .map((p) => p.title)
        .filter((title, index, self) => self.indexOf(title) === index)
        .slice(0, 5);
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    }
    setCurrentPage(1);
  }, [searchQuery, allProducts]);

  // Handle scroll for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        className="relative h-[25vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1732197537587-2973f6801969?crop=entropy&cs=srgb&fm=jpg&q=85')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-white/70"></div>
        <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-none mb-3">
            Design Templates
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            High-Quality PSD, AI & CDR Templates for all your design needs
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
              {/* Desktop: Vertical scroll, Mobile: Horizontal scroll */}
              <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto space-x-2 lg:space-x-0 lg:space-y-1 max-h-none lg:max-h-[calc(100vh-200px)] pr-2 pb-2 lg:pb-0 scrollbar-thin">
                <button
                  onClick={() => setSelectedCategory(null)}
                  data-testid="category-all"
                  className={`flex-shrink-0 lg:w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between whitespace-nowrap ${
                    !selectedCategory
                      ? "bg-primary text-white"
                      : "hover:bg-muted"
                  }`}
                >
                  <span className="font-medium">All Designs</span>
                  {!selectedCategory && <ArrowRight className="h-4 w-4 ml-2" />}
                </button>
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => setSelectedCategory(category._id)}
                    data-testid={`category-${category.slug}`}
                    className={`flex-shrink-0 lg:w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between whitespace-nowrap ${
                      selectedCategory === category._id
                        ? "bg-primary text-white"
                        : "hover:bg-muted"
                    }`}
                  >
                    <span className="font-medium">{category.name}</span>
                    {selectedCategory === category._id && (
                      <ArrowRight className="h-4 w-4 ml-2" />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Right Side - Products */}
          <main className="flex-1">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search designs... (e.g., 'Wedding', 'Banner')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery && setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  }
                  className="pl-10"
                />
                {/* Search Suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery(suggestion);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-muted transition-colors text-sm"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {selectedCategory
                    ? categories.find((c) => c._id === selectedCategory)?.name
                    : "All Designs"}
                </h2>
                {user?.role === "admin" && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {products.length}{" "}
                    {products.length === 1 ? "product" : "products"} available
                  </p>
                )}
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
              <>
                <div className="columns-1 sm:columns-2 lg:columns-2 xl:columns-3 gap-6 space-y-6">
                  {currentProducts.map((product) => (
                    <div
                      key={product._id}
                      className="break-inside-avoid mb-6 group"
                      data-testid={`product-card-${product._id}`}
                    >
                      <Link to={`/product/${product._id}`}>
                        <div className="hover-lift bg-white border rounded-lg overflow-hidden">
                          <div className="bg-gray-100 overflow-hidden">
                            {product.previewVideoUrl ? (
                              <video
                                src={product.previewVideoUrl}
                                poster={
                                  product.previewImagesUrls &&
                                  product.previewImagesUrls[0]
                                    ? product.previewImagesUrls[0]
                                    : undefined
                                }
                                alt={product.title}
                                className="w-full h-auto object-contain product-card-image"
                                autoPlay
                                loop
                                muted
                                playsInline
                                onError={(e) => {
                                  // If video fails to load, show thumbnail instead
                                  if (
                                    product.previewImagesUrls &&
                                    product.previewImagesUrls[0]
                                  ) {
                                    e.target.style.display = "none";
                                    const img = document.createElement("img");
                                    img.src = product.previewImagesUrls[0];
                                    img.alt = product.title;
                                    img.className =
                                      "w-full h-auto object-contain product-card-image";
                                    e.target.parentNode.appendChild(img);
                                  }
                                }}
                              />
                            ) : product.previewImagesUrls &&
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (number) => (
                          <Button
                            key={number}
                            variant={
                              currentPage === number ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => paginate(number)}
                            className="min-w-[40px]"
                          >
                            {number}
                          </Button>
                        ),
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </p>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Video Section */}
      {videoProducts.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight mb-2">
                Watch Our <span className="text-purple-600">Fun Videos!</span> 🎬
              </h2>
              <p className="text-muted-foreground">
                See our amazing designs in action
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {videoProducts.map((video, index) => (
                <Link
                  key={video._id}
                  to={`/product/${video._id}`}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    {/* Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span
                        className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${
                          index === 0
                            ? "bg-red-500 text-white"
                            : index === 1
                              ? "bg-orange-500 text-white"
                              : "bg-pink-500 text-white"
                        }`}
                      >
                        {index === 0 ? "LIVE" : index === 1 ? "TRENDING" : "NEW"}
                      </span>
                    </div>

                    {/* Video Preview */}
                    <div className="relative aspect-video bg-gradient-to-br from-purple-100 to-blue-100">
                      {video.previewVideoUrl ? (
                        <>
                          <video
                            src={video.previewVideoUrl}
                            className="w-full h-full object-cover"
                            muted
                            loop
                            playsInline
                            onMouseEnter={(e) => e.target.play()}
                            onMouseLeave={(e) => e.target.pause()}
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Play className="h-8 w-8 text-purple-600 fill-purple-600 ml-1" />
                            </div>
                          </div>
                        </>
                      ) : video.previewImagesUrls && video.previewImagesUrls[0] ? (
                        <>
                          <img
                            src={video.previewImagesUrls[0]}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                              <Play className="h-8 w-8 text-purple-600 fill-purple-600 ml-1" />
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>

                    {/* Video Info */}
                    <div className="p-4 bg-white">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                        {video.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {video.description || "Watch this amazing video"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link to="/videos">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  Watch More Videos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

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

      {/* Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition-all z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
