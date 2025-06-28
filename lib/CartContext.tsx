// in lib/CartContext.tsx
"use client";
import { createContext, useState, useContext, ReactNode } from 'react';
import type { Product } from '@/types';

export type CartItem = { product: Product; };
type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
  isInCart: (productId: number) => boolean;
};
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      // Check if the item is already in the cart
      const existingItem = prevItems.find(item => item.product.id === product.id);
      if (existingItem) {
        // If it exists, do nothing (or show an alert)
        alert(`${product.name} is already in your cart.`);
        return prevItems;
      }
      // Otherwise, add the new item
      return [...prevItems, { product }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  const clearCart = () => { setCartItems([]); };

  const isInCart = (productId: number) => cartItems.some(item => item.product.id === productId);
  const itemCount = cartItems.length;
  const totalPrice = cartItems.reduce((total, item) => total + item.product.price, 0);
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, itemCount, totalPrice, isInCart }}>
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