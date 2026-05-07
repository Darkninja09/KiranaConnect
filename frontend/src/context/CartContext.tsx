import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  productId: string;
  name: string;
  wholesalePrice: number;
  quantity: number;
  minOrderQty: number;
  imageUrl: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from LocalStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: any) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prevItems,
        {
          productId: product.id,
          name: product.name,
          wholesalePrice: product.wholesalePrice,
          quantity: product.minOrderQty, // Default to minimum order quantity
          minOrderQty: product.minOrderQty,
          imageUrl: product.imageUrl,
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity: Math.max(item.minOrderQty, quantity) } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + item.wholesalePrice * item.quantity, 0);
  const itemCount = cartItems.length;

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      totalAmount, 
      itemCount 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
