import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Sparkles, ChevronDown, X, Info } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function CartPage({ onClose }: { onClose?: () => void }) {
  const { items: cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalAmount, totalItems } = useCart();
  const [selectedProductForSpec, setSelectedProductForSpec] = useState<any>(null);

  return (
    <div className="flex flex-col h-full bg-[#F5F7FA] font-sans relative">
      {cartItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative">
          {onClose && (
            <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 rounded-full">
              <X size={24} />
            </button>
          )}
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-300">
            <ShoppingBag size={48} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">购物车还是空的</h2>
          <p className="text-gray-500 mb-8">快去店铺挑选心仪的商品吧</p>
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-200 active:scale-95 transition-transform"
          >
            去逛逛
          </button>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-5 shrink-0 sticky top-0 z-10">
            <div className="flex items-center gap-2">
              {onClose && (
                <button onClick={onClose} className="p-1 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              )}
              <h1 className="font-bold text-lg">购物车 ({totalItems})</h1>
            </div>
            <button 
              onClick={clearCart}
              className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"
            >
              <Trash2 size={14} /> 清空
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-40">
            {cartItems.map(item => (
              <div key={item.productId} className="bg-white p-3 rounded-2xl shadow-sm flex gap-3 border border-gray-100 relative">
                {/* X Button */}
                <button 
                  onClick={() => removeFromCart(item.productId)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500 rounded-full transition-colors z-10"
                >
                  <X size={16} />
                </button>
                
                <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                  <img src={item.product.image} className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div className="pr-6">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">{item.product.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-gray-400 bg-gray-50 inline-block px-1.5 py-0.5 rounded">{item.product.unit}</div>
                      <button 
                        onClick={() => setSelectedProductForSpec(item.product)}
                        className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-blue-100 hover:bg-blue-100 transition-colors"
                      >
                        <Info size={10} /> 详情
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-end justify-between mt-2">
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
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
            <div className="flex items-center justify-end mb-4">
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
        </>
      )}

      {/* Multi-Spec Modal */}
      <AnimatePresence>
        {selectedProductForSpec && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProductForSpec(null)}
              className="absolute inset-0 bg-black/40 z-[110] backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[120] p-5 pb-8 shadow-2xl"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                    <img src={selectedProductForSpec.image} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <div>
                    <div className="text-blue-600 font-bold font-mono text-xl mb-1">
                      <span className="text-sm mr-0.5">¥</span>{selectedProductForSpec.price}
                    </div>
                    <div className="text-sm text-gray-500 mb-1">库存: 充足</div>
                    <div className="text-sm text-gray-900">已选: 默认规格</div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedProductForSpec(null)}
                  className="p-2 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <h4 className="font-medium text-sm text-gray-900 mb-2">口味/规格</h4>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-4 py-1.5 rounded-lg border-2 border-blue-600 bg-blue-50 text-blue-600 text-sm font-medium">默认规格</button>
                    <button className="px-4 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm hover:bg-gray-50">其他口味</button>
                    <button className="px-4 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm hover:bg-gray-50">大包装</button>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-900 mb-2">包装方式</h4>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-4 py-1.5 rounded-lg border-2 border-blue-600 bg-blue-50 text-blue-600 text-sm font-medium">整箱装</button>
                    <button className="px-4 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm hover:bg-gray-50">散装</button>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setSelectedProductForSpec(null)}
                className="w-full h-12 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 active:scale-[0.98] transition-transform"
              >
                确定
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
