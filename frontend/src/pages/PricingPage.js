import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Check, Sparkles, Zap, Crown, Building2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import Navbar from "../components/Navbar";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const PLAN_ICONS = {
  free: Sparkles,
  basic: Zap,
  premium: Crown,
  enterprise: Building2,
};

const PLAN_COLORS = {
  free: "text-gray-600",
  basic: "text-blue-600",
  premium: "text-purple-600",
  enterprise: "text-orange-600",
};

export default function PricingPage() {
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();

  const [plans, setPlans] = useState([]);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/subscriptions/plans`);
      setPlans(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("Failed to load plans");
      setLoading(false);
    }
  };

  const handleSubscribe = async (planName) => {
    if (!isAuthenticated) {
      toast.error("Please login to subscribe");
      navigate("/login");
      return;
    }

    if (planName === "free") {
      toast.info("You're already on the free plan");
      return;
    }

    setSubscribing(planName);

    try {
      const response = await axios.post(
        `${API_URL}/api/subscriptions/subscribe`,
        { planName, billingCycle },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Subscription initiated! Proceed to payment.");
      // In production: integrate with Razorpay or payment gateway
      // For now, show success message
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to subscribe");
    } finally {
      setSubscribing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0055FF] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading plans...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-[#0055FF]/5 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-none mb-4">
              Choose Your Perfect Plan
            </h1>
            <p className="text-lg text-muted-foreground">
              Get unlimited access to premium design assets and grow your
              creative projects
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                billingCycle === "monthly"
                  ? "bg-[#0055FF] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-full font-medium transition-colors relative ${
                billingCycle === "yearly"
                  ? "bg-[#0055FF] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Yearly
              <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs">
                Save 17%
              </Badge>
            </button>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {plans.map((plan) => {
              const Icon = PLAN_ICONS[plan.name] || Sparkles;
              const isCurrentPlan = user?.subscriptionPlan === plan.name;
              const isPremiumPlan = plan.name === "premium";

              return (
                <div
                  key={plan._id}
                  className={`relative rounded-lg border-2 p-8 ${
                    isPremiumPlan
                      ? "border-[#0055FF] shadow-xl scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {isPremiumPlan && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#0055FF] text-white">
                      Most Popular
                    </Badge>
                  )}

                  <div className="text-center mb-6">
                    <Icon
                      className={`h-10 w-10 mx-auto mb-4 ${PLAN_COLORS[plan.name]}`}
                    />
                    <h3 className="text-2xl font-bold mb-2">
                      {plan.displayName}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {plan.description}
                    </p>

                    <div className="mb-4">
                      {plan.price[billingCycle] === 0 ? (
                        <div className="text-4xl font-bold">Free</div>
                      ) : (
                        <>
                          <div className="text-4xl font-bold">
                            ₹{plan.price[billingCycle]}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            per {billingCycle === "monthly" ? "month" : "year"}
                          </div>
                        </>
                      )}
                    </div>

                    <Button
                      className={`w-full ${
                        isPremiumPlan
                          ? "bg-[#0055FF] hover:bg-[#0044CC]"
                          : "bg-gray-900 hover:bg-gray-800"
                      }`}
                      onClick={() => handleSubscribe(plan.name)}
                      disabled={isCurrentPlan || subscribing === plan.name}
                    >
                      {subscribing === plan.name
                        ? "Processing..."
                        : isCurrentPlan
                          ? "Current Plan"
                          : plan.name === "free"
                            ? "Get Started"
                            : "Subscribe Now"}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold mb-2">
                Can I change my plan later?
              </h3>
              <p className="text-muted-foreground text-sm">
                Yes! You can upgrade or downgrade your plan at any time from
                your dashboard.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-muted-foreground text-sm">
                We accept all major credit cards, debit cards, UPI, and net
                banking through Razorpay.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold mb-2">
                Can I cancel my subscription?
              </h3>
              <p className="text-muted-foreground text-sm">
                Yes, you can cancel anytime. You'll retain access until the end
                of your billing period.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-muted-foreground text-sm">
                We offer a 7-day money-back guarantee if you're not satisfied
                with your subscription.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
          <p className="text-muted-foreground mb-8">
            Our team is here to help you choose the right plan for your needs.
          </p>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/contact")}
          >
            Contact Support
          </Button>
        </div>
      </section>
    </div>
  );
}
