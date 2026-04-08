import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Download,
  ShoppingCart,
  Eye,
  TrendingUp,
  Tag,
  Sparkles,
  Check,
  Heart,
  Share2,
  ZoomIn,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import { DownloadOptionsDialog } from "../components/DownloadOptionsDialog";

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const fetchProduct = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products/${id}`);
      setProduct(response.data);

      // Track view
      axios.post(`${API_URL}/api/products/${id}/view`);

      // Fetch similar products
      if (response.data.category?._id) {
        const similarRes = await axios.get(
          `${API_URL}/api/products?category=${response.data.category._id}`,
        );
        setSimilarProducts(
          similarRes.data.filter((p) => p._id !== id).slice(0, 4),
        );
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = () => {
    if (addToCart(product)) {
      toast.success("Added to cart!");
    } else {
      toast.info("Already in cart");
    }
  };

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to purchase");
      navigate("/login");
      return;
    }

    setPurchasing(true);

    try {
      const orderResponse = await axios.post(
        `${API_URL}/api/payment/create-order`,
        { productId: id },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const options = {
        key: orderResponse.data.keyId,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        order_id: orderResponse.data.orderId,
        name: "PixelAdda",
        description: product.title,
        handler: async (response) => {
          try {
            await axios.post(
              `${API_URL}/api/payment/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } },
            );
            toast.success("Purchase successful!");
            navigate("/dashboard");
          } catch (error) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#0055FF",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to initiate payment");
      }
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0055FF] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Product not found</h2>
            <p className="text-muted-foreground mb-6">
              The product you're looking for doesn't exist
            </p>
            <Button onClick={() => navigate("/")}>Back to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  const hasPurchased = user?.purchasedProducts?.includes(id);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Breadcrumb */}
      <div className="border-b bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-[#0055FF]">
              Home
            </Link>
            <span>/</span>
            <Link
              to={`/filter?category=${product.category?._id}`}
              className="hover:text-[#0055FF]"
            >
              {product.category?.name}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {product.previewVideoUrl ? (
                <video
                  src={product.previewVideoUrl}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  loop
                  muted
                />
              ) : product.previewImagesUrls?.[selectedImage] ? (
                <>
                  <img
                    src={product.previewImagesUrls[selectedImage]}
                    alt={product.title}
                    className={`w-full h-full object-contain transition-transform ${
                      isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
                    }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                  />
                  <button
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="absolute top-4 right-4 p-2 bg-white/90 rounded-lg hover:bg-white"
                  >
                    <ZoomIn className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ShoppingCart className="h-24 w-24 text-gray-300" />
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {product.isPremium && (
                  <Badge className="bg-[#0055FF] text-white">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
                {product.isFeatured && (
                  <Badge className="bg-yellow-500 text-white">Featured</Badge>
                )}
                {product.isTrending && (
                  <Badge className="bg-purple-500 text-white">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Trending
                  </Badge>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {product.previewImagesUrls &&
              product.previewImagesUrls.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {product.previewImagesUrls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 ${
                        selectedImage === index
                          ? "border-[#0055FF]"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

            {/* Stats */}
            <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>{product.views || 0} views</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Download className="h-4 w-4" />
                <span>{product.downloads || 0} downloads</span>
              </div>
              {product.likes > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Heart className="h-4 w-4" />
                  <span>{product.likes} likes</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Details */}
          <div>
            <div className="mb-6">
              <Link
                to={`/filter?category=${product.category?._id}`}
                className="text-sm text-[#0055FF] hover:underline uppercase tracking-wide mb-2 inline-block"
              >
                {product.category?.name}
              </Link>
              <h1 className="text-4xl font-bold tracking-tight mb-4">
                {product.title}
              </h1>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-baseline gap-3 mb-8">
                {product.isFree ? (
                  <span className="text-3xl font-bold text-green-600">
                    Free
                  </span>
                ) : (
                  <span className="text-4xl font-bold">₹{product.price}</span>
                )}
                {product.isPremium && (
                  <Badge variant="outline" className="text-xs">
                    Requires Premium Plan
                  </Badge>
                )}
              </div>

              <p className="text-base leading-relaxed text-muted-foreground mb-8">
                {product.description}
              </p>

              {/* Download Options */}
              <div className="space-y-4 mb-8">
                {hasPurchased ? (
                  <DownloadOptionsDialog
                    productId={product._id}
                    productTitle={product.title}
                    token={token}
                  />
                ) : (
                  <>
                    {product.isFree ? (
                      <DownloadOptionsDialog
                        productId={product._id}
                        productTitle={product.title}
                        token={token}
                      />
                    ) : (
                      <>
                        <Button
                          size="lg"
                          className="w-full bg-[#0055FF] hover:bg-[#0044CC]"
                          onClick={handlePurchase}
                          disabled={purchasing}
                        >
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          {purchasing ? "Processing..." : "Buy Now"}
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          className="w-full"
                          onClick={handleAddToCart}
                        >
                          Add to Cart
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Share */}
              <div className="flex gap-2 mb-8">
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Specifications */}
            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold mb-4">Specifications</h3>
              <div className="space-y-3">
                {product.productType && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium capitalize">
                      {product.productType}
                    </span>
                  </div>
                )}
                {product.files && product.files.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Formats</span>
                    <span className="font-medium">
                      {product.files.map((f) => f.format).join(", ")}
                    </span>
                  </div>
                )}
                {product.fileSize && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">File Size</span>
                    <span className="font-medium">
                      {(product.fileSize / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">License</span>
                  <span className="font-medium">Commercial Use</span>
                </div>
              </div>
            </div>

            {/* What's Included */}
            {product.files && product.files.length > 0 && (
              <div className="border-t mt-8 pt-8">
                <h3 className="text-lg font-semibold mb-4">What's Included</h3>
                <div className="space-y-2">
                  {product.files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-sm"
                    >
                      <Check className="h-4 w-4 text-green-500" />
                      <span>
                        {file.format} file ({file.fileName})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-16 border-t pt-16">
            <h2 className="text-2xl font-bold mb-8">Similar Assets</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarProducts.map((similarProduct) => (
                <Link
                  key={similarProduct._id}
                  to={`/product/${similarProduct._id}`}
                  className="group"
                >
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                    {similarProduct.previewImagesUrls?.[0] && (
                      <img
                        src={similarProduct.previewImagesUrls[0]}
                        alt={similarProduct.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    )}
                  </div>
                  <h3 className="font-medium text-sm line-clamp-2 mb-1">
                    {similarProduct.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {similarProduct.isFree
                      ? "Free"
                      : `₹${similarProduct.price}`}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
