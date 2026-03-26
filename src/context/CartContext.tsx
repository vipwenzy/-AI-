import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../data/mockDb';

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
  alternatives?: Product[];
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, alternatives?: Product[]) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  updateUnit: (productId: string, newUnit: string) => void;
  swapProduct: (oldProductId: string, newProduct: Product) => void;
  clearCart: () => void;
  totalAmount: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity = 1, alternatives?: Product[]) => {
    setItems(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + quantity, alternatives: alternatives || item.alternatives }
            : item
        );
      }
      return [...prev, { productId: product.id, quantity, product, alternatives }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const updateUnit = (productId: string, newUnit: string) => {
    setItems(prev => prev.map(item => {
      if (item.productId === productId) {
        const newPrice = item.product.unitPrices?.[newUnit] ?? item.product.price;
        return { 
          ...item, 
          product: { ...item.product, unit: newUnit, price: newPrice } 
        };
      }
      return item;
    }));
  };

  const swapProduct = (oldProductId: string, newProduct: Product) => {
    setItems(prev => prev.map(item => {
      if (item.productId === oldProductId) {
        const oldProduct = item.product;
        // Move old product to alternatives and remove new product from alternatives
        const currentAlternatives = item.alternatives || [];
        const newAlternatives = [
          ...currentAlternatives.filter(p => p.id !== newProduct.id),
          oldProduct
        ];
        
        return { 
          ...item, 
          productId: newProduct.id, 
          product: newProduct,
          alternatives: newAlternatives
        };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, updateUnit, swapProduct, clearCart, totalAmount, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
