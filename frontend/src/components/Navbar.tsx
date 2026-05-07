import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Store, LogOut, User, ShoppingBag, ShoppingCart } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-indigo-600 font-bold text-xl">
              <Store className="w-8 h-8" />
              <span className="hidden sm:block">KiranaConnect</span>
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="text-indigo-600 hover:text-indigo-800 font-black px-2 py-1 rounded-lg transition text-sm sm:text-base border-2 border-indigo-100">
                Dashboard
              </Link>
            )}
            <Link to="/products" className="text-gray-600 hover:text-indigo-600 font-medium px-2 py-1 rounded-lg transition text-sm sm:text-base">
              Products
            </Link>
            
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600 transition">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link to="/orders" className="text-gray-600 hover:text-indigo-600 flex items-center space-x-1 transition">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="hidden md:block">Orders</span>
                </Link>
                <div className="flex items-center space-x-2 text-gray-700 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                  <User className="w-4 h-4 text-indigo-500" />
                  <span className="font-medium text-xs sm:text-sm max-w-[100px] truncate">{user.shopName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium px-3 py-2 text-sm sm:text-base">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition font-bold text-sm sm:text-base shadow-md shadow-indigo-100"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
