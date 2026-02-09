import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AdminSidebar } from '../../components/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchStats();
  }, [isAuthenticated, isAdmin]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar active="dashboard" />
      
      <div className="flex-1 ml-64">
        <header className="border-b p-6">
          <h1 className="text-3xl font-semibold tracking-tight" data-testid="dashboard-heading">
            Dashboard Overview
          </h1>
        </header>

        <div className="p-8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 border rounded-md bg-white" data-testid="stat-products">
                <div className="flex items-center justify-between mb-4">
                  <Package className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <p className="text-3xl font-bold mb-1">{stats?.totalProducts || 0}</p>
                <p className="text-sm text-muted-foreground">Total Products</p>
              </div>

              <div className="p-6 border rounded-md bg-white" data-testid="stat-orders">
                <div className="flex items-center justify-between mb-4">
                  <ShoppingCart className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <p className="text-3xl font-bold mb-1">{stats?.totalOrders || 0}</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>

              <div className="p-6 border rounded-md bg-white" data-testid="stat-revenue">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <p className="text-3xl font-bold mb-1">₹{stats?.totalRevenue || 0}</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>

              <div className="p-6 border rounded-md bg-white" data-testid="stat-customers">
                <div className="flex items-center justify-between mb-4">
                  <Users className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <p className="text-3xl font-bold mb-1">{stats?.totalCustomers || 0}</p>
                <p className="text-sm text-muted-foreground">Total Customers</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
