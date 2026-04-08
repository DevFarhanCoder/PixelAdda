import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  TrendingUp,
  Star,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Download,
  Eye,
  Zap,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import Navbar from "../components/Navbar";

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Lazy loading image component
const LazyImage = ({ src, alt, className }) => {
  const [imageSrc, setImageSrc] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setImageLoaded(true);
    };
  }, [src]);

  return (
    <div
      className={`${className} ${!imageLoaded ? "bg-gray-100 animate-pulse" : ""}`}
    >
      {imageLoaded && (
        <img src={imageSrc} alt={alt} className={className} loading="lazy" />
      )}
    </div>
  );
};

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [categories, setCategories] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [categoriesRes, trendingRes, featuredRes, popularRes, latestRes] =
        await Promise.all([
          axios.get(`${API_URL}/api/categories`),
          axios.get(`${API_URL}/api/products/special/trending?limit=8`),
          axios.get(`${API_URL}/api/products/special/featured?limit=6`),
          axios.get(`${API_URL}/api/products/special/popular?limit=8`),
          axios.get(`${API_URL}/api/products/special/latest?limit=12`),
        ]);

      setCategories(categoriesRes.data);
      setTrendingProducts(trendingRes.data);
      setFeaturedProducts(featuredRes.data);
      setPopularProducts(popularRes.data);
      setLatestProducts(latestRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load content");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const ProductCard = ({ product, showBadge = false }) => (
    <Link to={`/product/${product._id}`} className="group block">
      <div className="relative aspect-square rounded-md overflow-hidden bg-gray-100 mb-3">
        {product.previewImagesUrls?.[0] && (
          <LazyImage
            src={product.previewImagesUrls[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}

        {showBadge && product.isPremium && (
          <Badge className="absolute top-2 left-2 bg-[#0055FF] text-white">
            <Sparkles className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        )}

        {product.isFeatured && (
          <Badge className="absolute top-2 right-2 bg-yellow-500 text-white">
            <Star className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        )}

        {/* Overlay with stats on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <Download className="h-3 w-3" />
                {product.downloads || 0}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {product.views || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      <h3 className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-[#0055FF] transition-colors">
        {product.title}
      </h3>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {product.category?.name}
        </span>
        {product.isFree ? (
          <Badge variant="outline" className="text-xs">
            Free
          </Badge>
        ) : (
          <span className="text-xs font-mono font-medium">
            ₹{product.price}
          </span>
        )}
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0055FF] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading amazing assets...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0055FF]/5 via-white to-purple-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-none mb-6">
              Download Premium{" "}
              <span className="text-[#0055FF]">Design Assets</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
              Millions of high-quality images, vectors, templates, and more for
              all your creative projects
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for assets, templates, vectors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 pl-12 pr-4 text-base rounded-full shadow-lg border-2 focus:border-[#0055FF]"
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-[#0055FF] hover:bg-[#0044CC] px-6"
                >
                  Search
                </Button>
              </div>
            </form>

            {/* Quick stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-sm">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#0055FF]" />
                <span className="font-medium">
                  {latestProducts.length}+ Assets
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Premium Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-green-500" />
                <span className="font-medium">Instant Download</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">
              Browse by Category
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(0, 12).map((category) => (
              <Link
                key={category._id}
                to={`/filter?category=${category._id}`}
                className="group p-6 border rounded-lg hover:shadow-md transition-all hover:border-[#0055FF]"
              >
                <div className="text-center">
                  <h3 className="font-medium text-sm group-hover:text-[#0055FF] transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      {trendingProducts.length > 0 && (
        <section className="py-16 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-[#0055FF]" />
                <h2 className="text-3xl font-bold tracking-tight">
                  Trending Now
                </h2>
              </div>
              <Link to="/filter?sort=trending">
                <Button variant="ghost" className="group">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {trendingProducts.map((product) => (
                <ProductCard key={product._id} product={product} showBadge />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Section */}
      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Star className="h-6 w-6 text-yellow-500" />
                <h2 className="text-3xl font-bold tracking-tight">
                  Featured Assets
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} showBadge />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Subscription CTA */}
      <section className="py-16 bg-gradient-to-br from-[#0055FF] to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Sparkles className="h-12 w-12 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Get Unlimited Access
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Download unlimited premium assets with our subscription plans.
              Starting from just ₹499/month.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-white text-[#0055FF] hover:bg-gray-100 px-8"
                onClick={() => navigate("/dashboard")}
              >
                View Plans
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              {!user && (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-8"
                  onClick={() => navigate("/register")}
                >
                  Sign Up Free
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Section */}
      {popularProducts.length > 0 && (
        <section className="py-16 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Star className="h-6 w-6 text-[#0055FF]" />
                <h2 className="text-3xl font-bold tracking-tight">
                  Most Popular
                </h2>
              </div>
              <Link to="/filter?sort=popular">
                <Button variant="ghost" className="group">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {popularProducts.map((product) => (
                <ProductCard key={product._id} product={product} showBadge />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Section */}
      {latestProducts.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-[#0055FF]" />
                <h2 className="text-3xl font-bold tracking-tight">
                  Latest Uploads
                </h2>
              </div>
              <Link to="/filter?sort=latest">
                <Button variant="ghost" className="group">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {latestProducts.map((product) => (
                <ProductCard key={product._id} product={product} showBadge />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <section className="py-16 border-t">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to create amazing designs?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of designers and creatives using PixelAdda
          </p>
          <Button
            size="lg"
            className="bg-[#0055FF] hover:bg-[#0044CC]"
            onClick={() => navigate("/register")}
          >
            Get Started Free
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}
