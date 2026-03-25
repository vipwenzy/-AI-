import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Sparkles, ChevronDown, X, Info, Check, Search, ChevronUp } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function CartPage({ onClose }: { onClose?: () => void }) {
  const { items: cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalAmount, totalItems } = useCart();
  const [selectedProductForSpec, setSelectedProductForSpec] = useState<any>(null);
  const [unselectedIds, setUnselectedIds] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'time' | 'price' | 'name'>('time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const toggleSelection = (productId: string) => {
    const newSet = new Set(unselectedIds);
    if (newSet.has(productId)) {
      newSet.delete(productId);
    } else {
      newSet.add(productId);
    }
    setUnselectedIds(newSet);
  };

  const toggleAll = () => {
    if (unselectedIds.size > 0) {
      setUnselectedIds(new Set());
    } else {
      setUnselectedIds(new Set(cartItems.map(i => i.productId)));
    }
  };

  const isAllSelected = cartItems.length > 0 && unselectedIds.size === 0;
  const selectedCartItems = cartItems.filter(i => !unselectedIds.has(i.productId));
  const selectedTotalAmount = selectedCartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const selectedTotalQuantity = selectedCartItems.reduce((sum, item) => sum + item.quantity, 0);

  const sortedCartItems = [...cartItems].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'price') comparison = a.product.price - b.product.price;
    else if (sortBy === 'name') comparison = a.product.name.localeCompare(b.product.name);
    else comparison = 0; // Default to insertion order (time)
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="flex flex-col h-full bg-[#f5f5f9] font-sans relative">
      {cartItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative">
          {onClose && (
            <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 rounded-full">
              <X size={24} />
            </button>
          )}
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 text-gray-300 shadow-sm">
            <ShoppingBag size={48} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">购物车还是空的</h2>
          <p className="text-gray-500 mb-8">快去店铺挑选心仪的商品吧</p>
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-[#ff5000] text-white rounded-xl font-medium shadow-lg shadow-orange-200 active:scale-95 transition-transform"
          >
            去逛逛
          </button>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="h-14 bg-[#f5f5f9] border-b border-gray-200 flex items-center justify-between px-4 shrink-0 sticky top-0 z-10">
            <div className="flex items-center gap-2">
              {onClose && (
                <button onClick={onClose} className="p-1 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              )}
              <h1 className="font-bold text-lg text-gray-800">购物车</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-sm text-gray-600 flex items-center gap-1">
                <Search size={16} /> 搜索
              </button>
              <button 
                onClick={clearCart}
                className="text-sm text-blue-600"
              >
                清空
              </button>
            </div>
          </div>

          {/* Sorting Bar */}
          <div className="bg-white border-b border-gray-100 px-4 py-2 flex items-center justify-between sticky top-14 z-10">
            <div className="flex items-center gap-4 text-xs">
              <button 
                onClick={() => {
                  if (sortBy === 'time') setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                  else { setSortBy('time'); setSortOrder('desc'); }
                }}
                className={cn("flex items-center gap-1", sortBy === 'time' ? "text-[#ff5000] font-medium" : "text-gray-500")}
              >
                选货时间
                <div className="flex flex-col -space-y-[6px]">
                  <ChevronUp size={12} className={cn(sortBy === 'time' && sortOrder === 'asc' ? "text-[#ff5000]" : "text-gray-300")} />
                  <ChevronUp size={12} className={cn("rotate-180", sortBy === 'time' && sortOrder === 'desc' ? "text-[#ff5000]" : "text-gray-300")} />
                </div>
              </button>
              <button 
                onClick={() => {
                  if (sortBy === 'price') setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                  else { setSortBy('price'); setSortOrder('desc'); }
                }}
                className={cn("flex items-center gap-1", sortBy === 'price' ? "text-[#ff5000] font-medium" : "text-gray-500")}
              >
                价格
                <div className="flex flex-col -space-y-[6px]">
                  <ChevronUp size={12} className={cn(sortBy === 'price' && sortOrder === 'asc' ? "text-[#ff5000]" : "text-gray-300")} />
                  <ChevronUp size={12} className={cn("rotate-180", sortBy === 'price' && sortOrder === 'desc' ? "text-[#ff5000]" : "text-gray-300")} />
                </div>
              </button>
              <button 
                onClick={() => {
                  if (sortBy === 'name') setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                  else { setSortBy('name'); setSortOrder('asc'); }
                }}
                className={cn("flex items-center gap-1", sortBy === 'name' ? "text-[#ff5000] font-medium" : "text-gray-500")}
              >
                货名
                <div className="flex flex-col -space-y-[6px]">
                  <ChevronUp size={12} className={cn(sortBy === 'name' && sortOrder === 'asc' ? "text-[#ff5000]" : "text-gray-300")} />
                  <ChevronUp size={12} className={cn("rotate-180", sortBy === 'name' && sortOrder === 'desc' ? "text-[#ff5000]" : "text-gray-300")} />
                </div>
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-40">
            <div className="bg-white rounded-xl p-3 shadow-sm">
              {sortedCartItems.map((item, index) => (
                <motion.div 
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex items-center gap-3 py-4 border-b border-gray-100",
                    index === cartItems.length - 1 ? "border-0 pb-2" : ""
                  )}
                >
                  {/* Checkbox */}
                  <button 
                    onClick={() => toggleSelection(item.productId)}
                    className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center shrink-0 border",
                      !unselectedIds.has(item.productId) 
                        ? "bg-[#ff5000] border-[#ff5000] text-white" 
                        : "border-gray-300 bg-white"
                    )}
                  >
                    {!unselectedIds.has(item.productId) && <Check size={14} strokeWidth={3} />}
                  </button>

                  {/* Image */}
                  <img src={item.product.image} alt={item.product.name} className="w-20 h-20 rounded-lg object-cover bg-gray-50 border border-gray-100 shrink-0" />

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-20">
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2">
                        <span className="bg-blue-400 text-white text-[10px] px-1 rounded mr-1 align-middle">新</span>
                        <span className="align-middle">{item.product.name}</span>
                      </h3>
                      <div className="text-xs text-gray-400 mt-1 truncate">
                        {item.product.sku || '默认规格'} | 库存{Math.floor(Math.random() * 100) + 20}个
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div className="text-[#ff5000] font-bold text-base">
                        ¥{item.product.price}<span className="text-xs font-normal text-gray-500">/个</span>
                      </div>
                      
                      {/* Quantity Control */}
                      <div className="flex items-center border border-gray-200 rounded overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.productId, -1)}
                          className="w-7 h-6 flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-gray-100 active:bg-gray-200"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs font-medium border-x border-gray-200 bg-white leading-6">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => addToCart(item.product)}
                          className="w-7 h-6 flex items-center justify-center bg-[#ff5000] text-white hover:bg-[#e64800] active:bg-[#cc4000]"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-0 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
            <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-100">
              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleAll}
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center shrink-0 border",
                    isAllSelected 
                      ? "bg-[#ff5000] border-[#ff5000] text-white" 
                      : "border-gray-300 bg-white"
                  )}
                >
                  {isAllSelected && <Check size={14} strokeWidth={3} />}
                </button>
                <span className="text-sm text-gray-700 font-medium">已选({selectedCartItems.length})</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <div className="text-sm">
                    总额: <span className="font-bold text-lg text-[#ff5000]">{selectedTotalAmount.toFixed(2)}</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (selectedCartItems.length === 0) {
                      alert('请先选择商品');
                      return;
                    }
                    alert('订单已提交！');
                    clearCart();
                  }}
                  className="bg-[#ff5000] text-white px-8 py-2 rounded-full font-bold text-base hover:bg-[#e64800] active:bg-[#cc4000] shadow-md"
                >
                  下单
                </button>
              </div>
            </div>
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
