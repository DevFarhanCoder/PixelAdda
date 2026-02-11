import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Download, ShoppingCart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase');
      navigate('/login');
      return;
    }

    setPurchasing(true);

    try {
      const orderResponse = await axios.post(
        `${API_URL}/api/payment/create-order`,
        { productId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: orderResponse.data.keyId,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        order_id: orderResponse.data.orderId,
        name: 'DesignMarket',
        description: product.title,
        handler: async (response) => {
          try {
            await axios.post(
              `${API_URL}/api/payment/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Purchase successful!');
            navigate('/dashboard');
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user.name,
          email: user.email
        },
        theme: {
          color: '#0055FF'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to initiate payment');
      }
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Product not found</p>
      </div>
    );
  }

  const hasPurchased = user?.purchasedProducts?.includes(id);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" data-testid="back-button">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" strokeWidth={1.5} />
              Back to Store
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            {product.previewImagesUrls && product.previewImagesUrls[0] ? (
              <img
                src={product.previewImagesUrls[0]}
                alt={product.title}
                className="w-full rounded-md"
                data-testid="product-image"
              />
            ) : (
              <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                <ShoppingCart className="h-24 w-24 text-gray-300" />
              </div>
            )}
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              {product.category?.name || 'Uncategorized'}
            </p>
            <h1 className="text-4xl font-semibold tracking-tight mb-4" data-testid="product-title">
              {product.title}
            </h1>
            <p className="text-3xl font-mono font-medium mb-8" data-testid="product-price">
              ₹{product.price}
            </p>
            <p className="text-base leading-relaxed mb-8" data-testid="product-description">
              {product.description}
            </p>

            <div className="border-t pt-8 mb-8">
              <h3 className="text-sm uppercase tracking-widest mb-4">File Details</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>File: {product.fileName}</li>
                {product.fileSize && (
                  <li>Size: {(product.fileSize / (1024 * 1024)).toFixed(2)} MB</li>
                )}
                <li>Downloads: {product.downloads}</li>
              </ul>
            </div>

            {hasPurchased ? (
              <Link to="/dashboard">
                <Button className="w-full" size="lg" data-testid="goto-dashboard-button">
                  <Download className="h-5 w-5 mr-2" strokeWidth={1.5} />
                  Download from Dashboard
                </Button>
              </Link>
            ) : (
              <Button
                className="w-full"
                size="lg"
                onClick={handlePurchase}
                disabled={purchasing}
                data-testid="buy-now-button"
              >
                <ShoppingCart className="h-5 w-5 mr-2" strokeWidth={1.5} />
                {purchasing ? 'Processing...' : 'Buy Now'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
