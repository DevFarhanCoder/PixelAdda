import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Download,
  LogOut,
  ShoppingBag,
  Crown,
  TrendingUp,
  Calendar,
  FileDown,
  Eye,
  Package,
  CreditCard,
  X,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import { DownloadOptionsDialog } from "../components/DownloadOptionsDialog";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const PLAN_COLORS = {
  free: "bg-gray-100 text-gray-800",
  basic: "bg-blue-100 text-blue-800",
  premium: "bg-purple-100 text-purple-800",
  enterprise: "bg-orange-100 text-orange-800",
};

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, token, logout, isAuthenticated } = useAuth();

  const [orders, setOrders] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [subscriptionHistory, setSubscriptionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, subscriptionRes, historyRes] = await Promise.all([
        axios.get(`${API_URL}/api/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/api/subscriptions/my-subscription`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/api/subscriptions/history`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setOrders(ordersRes.data);
      setSubscription(subscriptionRes.data);
      setSubscriptionHistory(historyRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm("Are you sure you want to cancel your subscription?")) {
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/subscriptions/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Subscription cancelled successfully");
      fetchDashboardData();
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to cancel subscription",
      );
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logged out successfully");
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0055FF] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">
                My Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.name}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <Package className="h-5 w-5 text-[#0055FF]" />
              <span className="text-2xl font-bold">{orders.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Purchases</p>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <FileDown className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">
                {subscription?.monthlyDownloads || 0}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Downloads This Month
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <span className="text-2xl font-bold">
                {subscription?.downloadsRemaining === "Unlimited"
                  ? "∞"
                  : subscription?.downloadsRemaining || 0}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Downloads Remaining</p>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              <Badge className={PLAN_COLORS[subscription?.plan || "free"]}>
                {subscription?.plan?.toUpperCase() || "FREE"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Current Plan</p>
          </div>
        </div>

        {/* Subscription Alert */}
        {subscription?.plan === "free" && (
          <div className="bg-gradient-to-r from-[#0055FF] to-purple-600 text-white p-6 rounded-lg mb-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">
                  Upgrade to Premium
                </h3>
                <p className="text-white/90 mb-4">
                  Get unlimited downloads and access to premium assets
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate("/pricing")}
                >
                  View Plans
                </Button>
              </div>
              <Crown className="h-12 w-12 opacity-20" />
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-white border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Subscription Status */}
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">
                Subscription Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Plan</p>
                  <p className="font-medium capitalize">
                    {subscription?.plan || "Free"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <Badge
                    variant={subscription?.isActive ? "default" : "secondary"}
                  >
                    {subscription?.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {subscription?.endDate && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Next Billing Date
                    </p>
                    <p className="font-medium">
                      {new Date(subscription.endDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Downloads Used
                  </p>
                  <p className="font-medium">
                    {subscription?.monthlyDownloads || 0} /{" "}
                    {subscription?.downloadsRemaining === "Unlimited"
                      ? "∞"
                      : (subscription?.monthlyDownloads || 0) +
                        (subscription?.downloadsRemaining || 0)}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Purchases */}
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recent Purchases</h3>
                {orders.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab("purchases")}
                  >
                    View All
                  </Button>
                )}
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No purchases yet</p>
                  <Link to="/">
                    <Button>Browse Assets</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div
                      key={order._id}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      {order.product.previewImagesUrls?.[0] && (
                        <img
                          src={order.product.previewImagesUrls[0]}
                          alt={order.product.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium">{order.product.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <DownloadOptionsDialog
                        productId={order.product._id}
                        productTitle={order.product.title}
                        token={token}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Purchases Tab */}
          <TabsContent value="purchases">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-6">All Purchases</h3>

              {orders.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    You haven't purchased any products yet.
                  </p>
                  <Link to="/">
                    <Button>Browse Products</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      {order.product.previewImagesUrls?.[0] && (
                        <div className="aspect-square bg-gray-100 rounded-md overflow-hidden mb-4">
                          <img
                            src={order.product.previewImagesUrls[0]}
                            alt={order.product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <h3 className="font-medium mb-2">
                        {order.product.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Purchased on{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <DownloadOptionsDialog
                        productId={order.product._id}
                        productTitle={order.product.title}
                        token={token}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-6">
            {/* Current Subscription */}
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-6">
                Current Subscription
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold capitalize text-lg">
                      {subscription?.plan || "Free"} Plan
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {subscription?.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <Badge
                    className={PLAN_COLORS[subscription?.plan || "free"]}
                    size="lg"
                  >
                    {subscription?.plan?.toUpperCase() || "FREE"}
                  </Badge>
                </div>

                {subscription?.plan !== "free" && subscription?.isActive && (
                  <>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Start Date
                        </p>
                        <p className="font-medium">
                          {subscription?.startDate
                            ? new Date(
                                subscription.startDate,
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          End Date
                        </p>
                        <p className="font-medium">
                          {subscription?.endDate
                            ? new Date(
                                subscription.endDate,
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleCancelSubscription}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel Subscription
                      </Button>
                    </div>
                  </>
                )}

                {subscription?.plan === "free" && (
                  <div className="pt-4">
                    <Button
                      className="bg-[#0055FF] hover:bg-[#0044CC]"
                      onClick={() => navigate("/pricing")}
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to Premium
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Subscription History */}
            {subscriptionHistory.length > 0 && (
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-6">
                  Subscription History
                </h3>

                <div className="space-y-4">
                  {subscriptionHistory.map((sub) => (
                    <div
                      key={sub._id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium capitalize">
                          {sub.plan} Plan
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(sub.startDate).toLocaleDateString()} -{" "}
                          {new Date(sub.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{sub.amount}</p>
                        <Badge
                          variant={
                            sub.status === "active" ? "default" : "secondary"
                          }
                        >
                          {sub.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
