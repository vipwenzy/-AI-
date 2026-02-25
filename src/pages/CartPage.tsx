import React from 'react';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

export default function CartPage() {
  const { items: cartItems, addToCart, updateQuantity, clearCart, totalAmount, totalItems } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col h-full bg-[#F5F7FA] items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-300">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">购物车还是空的</h2>
        <p className="text-gray-500 mb-8">快去店铺挑选心仪的商品吧</p>
        <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-200 active:scale-95 transition-transform">
          去逛逛
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F5F7FA] font-sans">
      {/* Header */}
      <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-5 shrink-0 sticky top-0 z-10">
        <h1 className="font-bold text-lg">购物车 ({totalItems})</h1>
        <button 
          onClick={clearCart}
          className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"
        >
          <Trash2 size={14} /> 清空
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-32">
        {cartItems.map(item => (
          <div key={item.productId} className="bg-white p-3 rounded-2xl shadow-sm flex gap-3 border border-gray-100">
            {/* Checkbox Simulation */}
            <div className="self-center">
               <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center bg-blue-600">
                 <CheckIcon />
               </div>
            </div>
            
            <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
              <img src={item.image} className="w-full h-full object-cover mix-blend-multiply" />
            </div>
            
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <div>
                <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">{item.product.name}</h3>
                <div className="text-xs text-gray-400 bg-gray-50 inline-block px-1.5 py-0.5 rounded">{item.product.unit}</div>
              </div>
              
              <div className="flex items-end justify-between">
                <div className="text-blue-600 font-bold font-mono">
                  <span className="text-xs mr-0.5">¥</span>{item.product.price}
                </div>
                
                <div className="flex items-center bg-gray-50 rounded-lg border border-gray-100 h-7">
                  <button 
                    onClick={() => updateQuantity(item.productId, -1)}
                    className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 active:scale-90 transition-transform"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-medium w-6 text-center font-mono">{item.quantity}</span>
                  <button 
                    onClick={() => addToCart(item.product)}
                    className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 active:scale-90 transition-transform"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-8 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center bg-blue-600 text-white">
               <CheckIcon />
            </div>
            <span className="text-sm text-gray-600">全选</span>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">不含运费</div>
            <div className="text-xl font-bold text-gray-900 font-mono">
              <span className="text-sm mr-0.5">¥</span>{totalAmount.toFixed(2)}
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => {
            alert('订单已提交！');
            clearCart();
          }}
          className="w-full h-12 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          去结算 ({totalItems}) <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
