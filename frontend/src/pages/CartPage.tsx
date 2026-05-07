import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import OrderService from '../services/order.service';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Store, Loader2, ShieldCheck } from 'lucide-react';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create order on backend to get Razorpay Order ID
      const orderData = {
        vendorId: user.id,
        shopName: user.shopName,
        totalAmount: totalAmount,
        items: cartItems.map(item => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          priceAtOrder: item.wholesalePrice
        }))
      };

      const serverOrder = await OrderService.createOrder(orderData);

      // 2. Initialize Razorpay Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SlacAla8Ko1qOj", 
        amount: serverOrder.totalAmount * 100,
        currency: "INR",
        name: "KiranaConnect",
        description: "Wholesale Order Payment",
        order_id: serverOrder.razorpayOrderId,
        handler: async (response: any) => {
          try {
            await OrderService.verifyPayment(response);
            clearCart();
            alert("Payment Successful! Your order has been placed.");
            navigate('/orders');
          } catch (err) {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Checkout error", err);
      alert("Failed to initiate checkout. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-white p-10 rounded-3xl border border-dashed border-gray-300 max-w-md mx-auto">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added any wholesale products yet.</p>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-gray-900 flex items-center space-x-3">
          <ShoppingBag className="w-8 h-8 text-indigo-600" />
          <span>My Shopping Cart</span>
        </h1>
        <button
          onClick={clearCart}
          className="text-sm font-bold text-red-500 hover:text-red-700 uppercase tracking-widest flex items-center space-x-1"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.productId} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition hover:shadow-md">
              <div className="w-24 h-24 bg-gray-50 rounded-xl flex-shrink-0 overflow-hidden border border-gray-50">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-2" />
              </div>
              
              <div className="flex-grow min-w-0">
                <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                <p className="text-indigo-600 font-bold">₹{item.wholesalePrice}</p>
                <p className="text-gray-400 text-[10px] font-bold uppercase mt-1">Min: {item.minOrderQty} units</p>
              </div>

              <div className="flex items-center space-x-3 bg-gray-50 p-2 rounded-xl border border-gray-100">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="p-1 hover:bg-white hover:shadow-sm rounded-lg transition text-gray-500 hover:text-indigo-600"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-gray-900 min-w-[20px] text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="p-1 hover:bg-white hover:shadow-sm rounded-lg transition text-gray-500 hover:text-indigo-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="text-right min-w-[80px]">
                <p className="font-black text-gray-900">₹{(item.wholesalePrice * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-gray-300 hover:text-red-500 transition mt-1"
                >
                  <Trash2 className="w-4 h-4 ml-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-xl sticky top-24">
            <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
              <Store className="w-6 h-6 text-indigo-400" />
              <span>Order Summary</span>
            </h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Estimated Delivery</span>
                <span className="text-green-400">FREE</span>
              </div>
              <div className="pt-4 border-t border-gray-800 flex justify-between items-end">
                <span className="text-lg font-bold">Total Amount</span>
                <span className="text-3xl font-black text-indigo-400">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black text-lg transition shadow-lg shadow-indigo-900 active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
            </button>
            
            <div className="flex items-center justify-center space-x-2 mt-6 text-gray-500">
              <ShieldCheck className="w-4 h-4" />
              <p className="text-[10px] font-medium uppercase tracking-widest">
                Secured Razorpay Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
