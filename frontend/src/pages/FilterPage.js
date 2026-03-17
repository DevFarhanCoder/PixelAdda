import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { ShoppingCart, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import Navbar from "../components/Navbar";

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Filter categories based on product types and file formats
const FILTER_CATEGORIES = {
  productType: {
    label: "Product Type",
    options: [
      { value: "vector", label: "Vectors", icon: "🎨" },
      { value: "raster", label: "Photos & Images", icon: "📷" },
      { value: "video", label: "Videos", icon: "🎬" },
      { value: "template", label: "Templates", icon: "📋" },
      { value: "other", label: "Other", icon: "📦" },
    ],
  },
  fileFormat: {
    label: "File Format",
    options: [
      { value: "eps", label: "EPS" },
      { value: "ai", label: "AI (Adobe Illustrator)" },
      { value: "cdr", label: "CDR (CorelDRAW)" },
      { value: "psd", label: "PSD (Photoshop)" },
      { value: "jpeg", label: "JPEG" },
      { value: "png", label: "PNG" },
      { value: "mp4", label: "MP4" },
    ],
  },
  price: {
    label: "Price",
    options: [
      { value: "free", label: "Free" },
      { value: "paid", label: "Paid" },
      { value: "under100", label: "Under ₹100" },
      { value: "under500", label: "Under ₹500" },
      { value: "under1000", label: "Under ₹1000" },
    ],
  },
};

export default function FilterPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    productType: [],
    fileFormat: [],
    price: [],
    category: [],
  });

  // Get initial filters from URL params
  useEffect(() => {
    const initialFilters = {
      productType: searchParams.getAll("type"),
      fileFormat: searchParams.getAll("format"),
      price: searchParams.getAll("price"),
      category: searchParams.getAll("category"),
    };
    setFilters(initialFilters);
  }, []);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      // Add filters to query params
      filters.productType.forEach((type) => params.append("type", type));
      filters.fileFormat.forEach((format) => params.append("format", format));
      filters.price.forEach((price) => params.append("price", price));
      filters.category.forEach((cat) => params.append("category", cat));

      const response = await axios.get(
        `${API_URL}/api/products/filter?${params.toString()}`,
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (category, value) => {
    setFilters((prev) => {
      const updated = { ...prev };
      if (updated[category].includes(value)) {
        // Remove filter
        updated[category] = updated[category].filter((item) => item !== value);
      } else {
        // Add filter
        updated[category] = [...updated[category], value];
      }

      // Update URL params
      const newParams = new URLSearchParams();
      Object.entries(updated).forEach(([key, values]) => {
        values.forEach((val) => newParams.append(key, val));
      });
      setSearchParams(newParams);

      return updated;
    });
  };

  const clearAllFilters = () => {
    setFilters({
      productType: [],
      fileFormat: [],
      price: [],
      category: [],
    });
    setSearchParams(new URLSearchParams());
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).flat().length;
  };

  const FilterSection = ({
    title,
    options,
    category,
    includeIcons = false,
  }) => (
    <div className="space-y-3">
      <h3 className="font-medium text-sm">{title}</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={`${category}-${option.value}`}
              checked={filters[category].includes(option.value)}
              onCheckedChange={() => handleFilterChange(category, option.value)}
            />
            <Label
              htmlFor={`${category}-${option.value}`}
              className="text-sm font-normal cursor-pointer flex items-center gap-2"
            >
              {includeIcons && option.icon && <span>{option.icon}</span>}
              {option.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Product Type */}
      <FilterSection
        title={FILTER_CATEGORIES.productType.label}
        options={FILTER_CATEGORIES.productType.options}
        category="productType"
        includeIcons={true}
      />

      <Separator />

      {/* Categories */}
      {categories.length > 0 && (
        <>
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Categories</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat-${cat._id}`}
                    checked={filters.category.includes(cat._id)}
                    onCheckedChange={() =>
                      handleFilterChange("category", cat._id)
                    }
                  />
                  <Label
                    htmlFor={`cat-${cat._id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {cat.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* File Format */}
      <FilterSection
        title={FILTER_CATEGORIES.fileFormat.label}
        options={FILTER_CATEGORIES.fileFormat.options}
        category="fileFormat"
      />

      <Separator />

      {/* Price */}
      <FilterSection
        title={FILTER_CATEGORIES.price.label}
        options={FILTER_CATEGORIES.price.options}
        category="price"
      />

      <Separator />

      {/* Clear Filters */}
      {getActiveFilterCount() > 0 && (
        <Button variant="outline" className="w-full" onClick={clearAllFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight mb-2">
              Browse Products
            </h1>
            <p className="text-muted-foreground">
              {loading ? "Loading..." : `${products.length} products found`}
              {getActiveFilterCount() > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {getActiveFilterCount()} filters applied
                </Badge>
              )}
            </p>
          </div>

          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine your search with filters
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-8 space-y-6 border rounded-lg p-6">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Filters</h2>
              </div>
              <Separator />
              <FilterContent />
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or browse all products
                </p>
                <Button onClick={clearAllFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className="columns-1 sm:columns-2 xl:columns-3 gap-4 space-y-4">
                {products.map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    className="block break-inside-avoid mb-4"
                  >
                    <div className="group relative overflow-hidden rounded-md border hover:shadow-lg transition-all">
                      {/* Preview Image/Video */}
                      <div className="relative bg-gray-100">
                        {product.previewVideoUrl ? (
                          <video
                            src={product.previewVideoUrl}
                            className="w-full object-cover"
                            muted
                            loop
                            onMouseEnter={(e) => e.target.play()}
                            onMouseLeave={(e) => {
                              e.target.pause();
                              e.target.currentTime = 0;
                            }}
                          />
                        ) : product.previewImagesUrls &&
                          product.previewImagesUrls[0] ? (
                          <img
                            src={product.previewImagesUrls[0]}
                            alt={product.title}
                            className="w-full object-cover"
                          />
                        ) : (
                          <div className="aspect-square flex items-center justify-center">
                            <ShoppingCart className="h-16 w-16 text-gray-300" />
                          </div>
                        )}

                        {/* Free Badge */}
                        {product.isFree && (
                          <Badge className="absolute top-2 right-2 bg-green-600">
                            Free
                          </Badge>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="font-medium text-sm mb-2 line-clamp-2">
                          {product.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <p className="font-mono text-sm">
                            {product.isFree ? "Free" : `₹${product.price}`}
                          </p>
                          {product.category && (
                            <Badge variant="outline" className="text-xs">
                              {product.category.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
