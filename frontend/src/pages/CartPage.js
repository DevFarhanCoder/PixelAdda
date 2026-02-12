import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cartItems, removeFromCart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    // For now, redirect to first product's page for purchase
    // In a real scenario, you'd handle multi-item checkout
    navigate(`/product/${cartItems[0]._id}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="text-sm text-primary hover:underline">
            ← Continue Shopping
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-semibold tracking-tight mb-8" data-testid="cart-heading">
          Shopping Cart ({cartItems.length})
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20" data-testid="empty-cart">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some designs to get started!</p>
            <Link to="/">
              <Button>Browse Designs</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item._id} className="flex gap-4 p-4 border rounded-lg" data-testid={`cart-item-${item._id}`}>
                  <Link to={`/product/${item._id}`} className="flex-shrink-0">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                      {item.previewImagesUrls && item.previewImagesUrls[0] ? (
                        <img
                          src={item.previewImagesUrls[0]}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-gray-300" />
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="flex-1">
                    <Link to={`/product/${item._id}`}>
                      <h3 className="font-medium mb-1 hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-2">{item.category?.name}</p>
                    <p className="font-semibold text-primary">₹{item.price}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-destructive hover:text-destructive/80 transition-colors"
                    data-testid="remove-from-cart-button"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t pt-8">
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-medium">Total</span>
                <span className="text-2xl font-bold text-primary">₹{getCartTotal()}</span>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="flex-1"
                  data-testid="clear-cart-button"
                >
                  Clear Cart
                </Button>
                <Button
                  onClick={handleCheckout}
                  className="flex-1"
                  data-testid="checkout-button"
                >
                  Proceed to Checkout
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-4">
                Note: Each item must be purchased separately
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
