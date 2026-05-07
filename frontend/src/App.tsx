import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProductListPage from './pages/ProductListPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import AdminDashboard from './pages/AdminDashboard';

// Placeholder Pages
const Home = () => {
  const { user } = useAuth();
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Welcome to <span className="text-indigo-600">KiranaConnect</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Empowering Kirana shops with wholesale prices, hyperlocal delivery, and seamless inventory management.
        </p>
        
        <div className="mt-10 flex justify-center space-x-4">
          {user?.role === 'ADMIN' ? (
            <Link to="/admin" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 active:scale-95 text-center flex items-center space-x-2">
              <span>Go to Admin Console</span>
            </Link>
          ) : (
            <>
              <Link to="/products" className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 active:scale-95 text-center">
                Browse Products
              </Link>
              <Link to="/orders" className="bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-3 rounded-2xl font-black hover:bg-indigo-50 transition active:scale-95 text-center">
                View Orders
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Protected Admin Route Component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return null;
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductListPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route 
                path="/admin/*" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
