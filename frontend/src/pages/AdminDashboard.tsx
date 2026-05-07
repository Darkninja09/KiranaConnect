import React, { useState, useEffect } from 'react';
import AdminService from '../services/admin.service';
import ProductService from '../services/product.service';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Loader2,
  X,
  ImageIcon,
  ChevronRight,
  Search,
  Check
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const statsData = await AdminService.getStats();
        setStats(statsData);
      } else if (activeTab === 'orders') {
        const ordersData = await AdminService.getAllOrders();
        setOrders(ordersData);
      } else if (activeTab === 'products') {
        const productsData = await ProductService.getAllProducts();
        setProducts(productsData);
      }
    } catch (err) {
      console.error("Error fetching admin data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await AdminService.updateOrderStatus(orderId, newStatus);
      fetchData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleSaveProduct = async (productData: any) => {
    try {
      if (editingProduct) {
        await AdminService.updateProduct(editingProduct.id, productData);
      } else {
        await ProductService.createProduct(productData);
      }
      setShowAddModal(false);
      setEditingProduct(null);
      fetchData();
    } catch (err) {
      alert("Failed to save product");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await AdminService.deleteProduct(id);
        fetchData();
      } catch (err) {
        alert("Failed to delete product");
      }
    }
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setShowAddModal(true);
  };

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`₹${stats?.totalRevenue?.toFixed(2)}`} icon={<TrendingUp className="text-green-500" />} color="bg-green-50" />
        <StatCard title="Total Orders" value={stats?.totalOrders} icon={<ShoppingBag className="text-blue-500" />} color="bg-blue-50" />
        <StatCard title="Total Users" value={stats?.totalUsers} icon={<Users className="text-purple-500" />} color="bg-purple-50" />
        <StatCard title="Out of Stock" value={stats?.outOfStock} icon={<AlertTriangle className="text-red-500" />} color="bg-red-50" />
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Inventory Health</h2>
        {stats?.outOfStock > 0 ? (
          <div className="flex items-center space-x-3 text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100">
            <AlertTriangle className="w-6 h-6" />
            <p className="font-bold">Attention: {stats.outOfStock} products are currently out of stock!</p>
          </div>
        ) : (
          <p className="text-gray-500 italic">All products are currently in stock.</p>
        )}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
          <tr>
            <th className="px-6 py-4">Order ID</th>
            <th className="px-6 py-4">Shop Name</th>
            <th className="px-6 py-4">Amount</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50/50 transition group">
              <td className="px-6 py-4 font-mono text-xs font-bold text-gray-400 group-hover:text-indigo-600">#{order.id.substring(0,8).toUpperCase()}</td>
              <td className="px-6 py-4 font-bold text-gray-900">{order.shopName}</td>
              <td className="px-6 py-4 font-black text-indigo-600">₹{order.totalAmount.toFixed(2)}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                  order.status === 'PAID' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <select 
                  onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                  value={order.status}
                  className="bg-white border border-gray-200 rounded-xl text-xs font-bold px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer"
                >
                  <option value="PAID">PAID</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-end">
        <button 
          onClick={() => { setEditingProduct(null); setShowAddModal(true); }}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black flex items-center space-x-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Product</span>
        </button>
      </div>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden p-1 flex-shrink-0">
                      <img src={product.imageUrl} className="w-full h-full object-contain" />
                    </div>
                    <span className="font-bold text-gray-900 truncate max-w-[200px]">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-gray-500">{product.category}</td>
                <td className="px-6 py-4 font-black text-gray-900">₹{product.wholesalePrice}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${product.stockLevel < 20 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                    <span className={`font-bold ${product.stockLevel < 20 ? 'text-red-500' : 'text-gray-900'}`}>
                      {product.stockLevel} units
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => openEditModal(product)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center space-x-3">
              <LayoutDashboard className="w-10 h-10 text-indigo-600" />
              <span>Admin Console</span>
            </h1>
            <p className="text-gray-500 font-medium mt-1">Manage users, products, and orders for KiranaConnect</p>
          </div>
          
          <div className="flex bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Overview" />
            <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} label="Orders" />
            <TabButton active={activeTab === 'products'} onClick={() => setActiveTab('products')} label="Products" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'orders' && renderOrders()}
            {activeTab === 'products' && renderProducts()}
          </>
        )}
      </div>

      {showModal && (
        <ProductModal 
          onClose={() => { setShowAddModal(false); setEditingProduct(null); }} 
          onSave={handleSaveProduct} 
          product={editingProduct}
        />
      )}
    </div>
  );
};

const ProductModal = ({ onClose, onSave, product }: any) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || 'Grocery',
    wholesalePrice: product?.wholesalePrice || 0,
    minOrderQty: product?.minOrderQty || 1,
    stockLevel: product?.stockLevel || 0,
    imageUrl: product?.imageUrl || ''
  });

  const [suggestedImages, setSuggestImages] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleImageSearch = async () => {
    if (!formData.name) return;
    setIsSearching(true);
    try {
      const images = await AdminService.searchImages(formData.name);
      setSuggestImages(images);
    } catch (err) {
      console.error("Image search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
            {product ? 'Edit Product' : 'Add New Wholesale Product'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition"><X className="w-6 h-6 text-gray-400" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 gap-8">
            {/* Top Row: Name & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Product Name</label>
                <div className="flex space-x-2">
                  <input 
                    required
                    className="flex-grow bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    placeholder="e.g. Cadbury Silk"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  <button 
                    type="button"
                    onClick={handleImageSearch}
                    disabled={isSearching || !formData.name}
                    className="bg-indigo-50 text-indigo-600 p-3 rounded-xl hover:bg-indigo-100 transition disabled:opacity-50"
                    title="Search for images"
                  >
                    {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Category</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Grocery">Grocery</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Personal Care">Personal Care</option>
                </select>
              </div>
            </div>

            {/* Image Slider Section */}
            {suggestedImages.length > 0 && (
              <div className="animate-in slide-in-from-top-4 duration-300">
                <div className="flex items-center justify-between mb-3 ml-1">
                  <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                    Top 10 search results:
                  </label>
                  <span className="text-[9px] text-gray-400 font-bold uppercase">Powered by Google</span>
                </div>
                <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent">
                  {suggestedImages.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({...formData, imageUrl: url})}
                      className={`relative flex-shrink-0 w-40 h-40 rounded-2xl border-4 transition-all duration-300 overflow-hidden group hover:scale-[1.02] ${
                        formData.imageUrl === url ? 'border-indigo-600 shadow-xl shadow-indigo-100' : 'border-gray-100 hover:border-indigo-200'
                      }`}
                    >
                      <img src={url} className="w-full h-full object-cover" loading="lazy" />
                      {formData.imageUrl === url && (
                        <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center backdrop-blur-[1px]">
                          <div className="bg-indigo-600 text-white p-1.5 rounded-full shadow-lg scale-110">
                            <Check className="w-5 h-5" />
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent h-8 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Price (₹)</label>
                  <input 
                    type="number" required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    value={formData.wholesalePrice}
                    onChange={(e) => setFormData({...formData, wholesalePrice: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Stock Level</label>
                  <input 
                    type="number" required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    value={formData.stockLevel}
                    onChange={(e) => setFormData({...formData, stockLevel: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Image URL (Manual Override)</label>
                <input 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  placeholder="https://..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Description</label>
              <textarea 
                rows={2}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
                placeholder="Product details..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>
          </div>

          <div className="mt-10 flex items-center space-x-4">
            <button 
              type="button" onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl font-black text-gray-400 hover:bg-gray-100 transition uppercase tracking-widest text-xs"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-2xl font-black transition shadow-xl shadow-indigo-100 active:scale-95 flex items-center justify-center space-x-2"
            >
              <span>{product ? 'Update Product' : 'Add to Catalog'}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start justify-between transition hover:shadow-md">
    <div>
      <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">{title}</p>
      <p className="text-2xl font-black text-gray-900">{value}</p>
    </div>
    <div className={`${color} p-3 rounded-2xl`}>{icon}</div>
  </div>
);

const TabButton = ({ active, onClick, label }: any) => (
  <button
    onClick={onClick}
    className={`px-6 py-2.5 rounded-xl text-sm font-black transition ${
      active ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
    }`}
  >
    {label}
  </button>
);

export default AdminDashboard;
