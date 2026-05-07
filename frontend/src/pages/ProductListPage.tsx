import React, { useState, useEffect } from 'react';
import ProductService from '../services/product.service';
import ProductCard from '../components/ProductCard';
import { Search, Filter, Loader2 } from 'lucide-react';

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const categories = ['All', 'Grocery', 'Snacks', 'Beverages', 'Personal Care'];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const cat = selectedCategory === 'All' ? '' : selectedCategory;
      const data = await ProductService.getAllProducts(cat, searchTerm);
      console.log("--- Products Received ---");
      console.table(data.slice(0, 5).map((p: any) => ({ name: p.name, url: p.imageUrl })));
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Wholesale Catalog</h1>
        
        <form onSubmit={handleSearch} className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>

      {/* Categories */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        <Filter className="w-5 h-5 text-gray-500 mr-2" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
              (selectedCategory === cat || (cat === 'All' && !selectedCategory))
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">No products found. Try adjusting your search.</p>
        </div>
      )}
    </div>
  );
};

export default ProductListPage;
