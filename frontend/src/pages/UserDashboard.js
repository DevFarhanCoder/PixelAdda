import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Download, LogOut, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, token, logout, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (productId, productTitle) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/products/${productId}/download`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      window.open(response.data.downloadUrl, '_blank');
      toast.success('Download started!');
    } catch (error) {
      toast.error('Download failed');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-end">
          <Button variant="ghost" size="sm" onClick={handleLogout} data-testid="logout-button">
            <LogOut className="h-4 w-4 mr-2" strokeWidth={1.5} />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold tracking-tight mb-2" data-testid="dashboard-heading">
            My Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>

        <div className="border-t pt-8">
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Purchased Products</h2>
          
          {loading ? (
            <p>Loading...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-16" data-testid="no-purchases">
              <p className="text-muted-foreground mb-4">You haven't purchased any products yet.</p>
              <Link to="/">
                <Button data-testid="browse-products-button">Browse Products</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map(order => (
                <div key={order._id} className="border rounded-md p-6" data-testid={`order-card-${order._id}`}>
                  {order.product.previewImagesUrls && order.product.previewImagesUrls[0] && (
                    <div className="aspect-square bg-gray-100 rounded-md overflow-hidden mb-4">
                      <img
                        src={order.product.previewImagesUrls[0]}
                        alt={order.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="font-medium mb-2" data-testid="product-title">{order.product.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Purchased on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => handleDownload(order.product._id, order.product.title)}
                    data-testid="download-button"
                  >
                    <Download className="h-4 w-4 mr-2" strokeWidth={1.5} />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
