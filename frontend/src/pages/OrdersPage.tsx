import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import OrderService from '../services/order.service';
import { Package, CheckCircle2, ShoppingBag } from 'lucide-react';

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const data = await OrderService.getUserOrders(user.id);
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'text-green-600 bg-green-50 border-green-100';
      case 'PENDING': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'DELIVERED': return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center space-x-4 mb-10">
        <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-200">
          <Package className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Order History</h1>
          <p className="text-gray-500 font-medium">Track and manage your wholesale resupplies</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-300 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900">No orders yet</h2>
          <p className="text-gray-500 mt-2">When you place orders, they will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition hover:shadow-md">
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm">
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Order ID</p>
                      <p className="font-mono font-bold text-gray-900">#{order.id.substring(0, 8).toUpperCase()}</p>
                    </div>
                    <div className="h-8 w-px bg-gray-100"></div>
                    <div className="text-sm">
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Date</p>
                      <p className="font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className={`px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                    {order.status}
                  </div>
                </div>

                <div className="space-y-4">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between py-3 border-t border-gray-50 first:border-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center font-bold text-indigo-600 text-xs border border-gray-100">
                          {item.quantity}x
                        </div>
                        <span className="font-bold text-gray-800">{item.name}</span>
                      </div>
                      <span className="font-black text-gray-900">₹{(item.priceAtOrder * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t-2 border-gray-50 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-wide">Paid via Razorpay</span>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Grand Total</p>
                    <p className="text-3xl font-black text-indigo-600">₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
