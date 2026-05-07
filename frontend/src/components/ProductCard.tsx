import React, { useState } from 'react';
import { ShoppingCart, Package, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const handleImgError = () => {
    setImgError(true);
  };

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
      <div className="h-48 bg-gray-50 relative overflow-hidden flex items-center justify-center border-b">
        {!imgError && product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            onError={handleImgError}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <Package className="w-12 h-12 mb-2 opacity-20" />
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-50">{product.category}</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-indigo-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
          {product.category}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{product.name}</h3>
        <p className="text-gray-500 text-xs mb-4 line-clamp-2 h-8 leading-relaxed">{product.description}</p>
        
        <div className="flex items-end justify-between">
          <div>
            <span className="text-2xl font-black text-indigo-600">₹{product.wholesalePrice}</span>
            <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-tighter">Min: {product.minOrderQty} units</p>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className={`${
              added ? 'bg-green-600 scale-105' : 'bg-gray-900 hover:bg-indigo-600'
            } text-white p-2.5 rounded-xl transition duration-300 shadow-lg active:scale-95 flex items-center justify-center min-w-[44px]`}
          >
            {added ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
