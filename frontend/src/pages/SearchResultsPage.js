import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { ShoppingBag, SlidersHorizontal } from "lucide-react";
import { Button } from "../components/ui/button";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchCategories();
    searchProducts();
  }, [query, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const searchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory) params.category = selectedCategory;

      const response = await axios.get(`${API_URL}/api/products`, { params });

      // Filter products by search query
      const filtered = response.data.filter(
        (product) =>
          product.title.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()),
      );

      setProducts(filtered);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (addToCart(product)) {
      toast.success("Added to cart!");
    } else {
      toast.info("Already in cart");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="text-sm text-primary hover:underline">
            ← Back to Home
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1
            className="text-2xl font-semibold mb-2"
            data-testid="search-results-heading"
          >
            {query}
          </h1>
          <p className="text-muted-foreground">
            {products.length} {products.length === 1 ? "result" : "results"}{" "}
            found
          </p>
        </div>

        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
          <SlidersHorizontal className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              !selectedCategory
                ? "bg-primary text-white"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => setSelectedCategory(category._id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                selectedCategory === category._id
                  ? "bg-primary text-white"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Searching...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20" data-testid="no-results">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No results found</h2>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {products.map((product) => (
              <div key={product._id} className="break-inside-avoid mb-6 group">
                <Link to={`/product/${product._id}`}>
                  <div className="bg-gray-100 rounded-lg overflow-hidden mb-3">
                    {product.previewImagesUrls &&
                    product.previewImagesUrls[0] ? (
                      <img
                        src={product.previewImagesUrls[0]}
                        alt={product.title}
                        className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="h-16 w-16 text-gray-300" />
                      </div>
                    )}
                  </div>
                </Link>
                <div className="space-y-1">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-medium line-clamp-2 hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {product.category?.name}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <p className="font-semibold text-primary">
                      ₹{product.price}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddToCart(product)}
                      data-testid="add-to-cart-button"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
