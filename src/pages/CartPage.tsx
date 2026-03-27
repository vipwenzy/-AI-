import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Sparkles, ChevronDown, X, Info, Check, Search, ChevronUp, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function CartPage({ onClose }: { onClose?: () => void }) {
  const { 
    items: cartItems, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    updateUnit, 
    swapProduct, 
    toggleSelection,
    selectAll,
    clearCart, 
    totalAmount, 
    totalItems,
    selectedItemsCount,
    selectedAmount
  } = useCart();
  const [selectedItemForSpec, setSelectedItemForSpec] = useState<any>(null);
  const [selectedItemForMatches, setSelectedItemForMatches] = useState<any>(null);
  const [sortBy, setSortBy] = useState<'time' | 'price' | 'name'>('time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const isAllSelected = cartItems.length > 0 && cartItems.every(i => i.selected);

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
          <p className="text-gray-500 text-2xl font-bold mb-10 leading-relaxed">快去店铺挑选心仪的商品吧 ✨</p>
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
                className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"
                title="清空购物车"
              >
                <Trash2 size={16} />
                <span>清空</span>
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
                    "flex items-center gap-3 py-4 border-b border-gray-100 relative",
                    index === cartItems.length - 1 ? "border-0 pb-2" : ""
                  )}
                >
                  {/* Delete Button - Simple cross */}
                  <button 
                    onClick={() => removeFromCart(item.productId)}
                    className="absolute top-2 right-0 p-1 text-gray-300 hover:text-gray-500 z-10 transition-all active:scale-90"
                    title="删除商品"
                  >
                    <X size={16} />
                  </button>

                  {/* Checkbox */}
                  <button 
                    onClick={() => toggleSelection(item.productId)}
                    className="shrink-0"
                  >
                    {item.selected ? (
                      <CheckCircle2 size={20} className="text-[#ff5000] fill-[#ff5000] text-white" />
                    ) : (
                      <Circle size={20} className="text-gray-300" />
                    )}
                  </button>

                  {/* Image & More Matches */}
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <img src={item.product.image} alt={item.product.name} referrerPolicy="no-referrer" className="w-20 h-20 rounded-lg object-cover bg-gray-50 border border-gray-100" />
                    {item.alternatives && item.alternatives.length > 0 && (
                      <button 
                        onClick={() => setSelectedItemForMatches(item)}
                        className="text-[10px] text-blue-600 font-medium flex items-center gap-0.5 bg-blue-50 px-1.5 py-0.5 rounded-full border border-blue-100 whitespace-nowrap"
                      >
                        更多匹配({item.alternatives.length})
                        <ChevronRight size={8} />
                      </button>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-20">
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2">
                          <span className="align-middle">{item.product.name}</span>
                        </h3>
                        
                        {/* Units Selection on Card */}
                        {item.product.units && (
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex gap-2">
                              {item.product.units.map(u => (
                                <button 
                                  key={u}
                                  onClick={() => updateUnit(item.productId, u)}
                                  className={cn(
                                    "px-2 py-0.5 rounded text-[10px] border transition-all",
                                    item.product.unit === u 
                                      ? "bg-[#ff5000] border-[#ff5000] text-white shadow-sm font-bold" 
                                      : "bg-white border-gray-200 text-gray-500"
                                  )}
                                >
                                  {u}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-1">
                          <div className="text-[#ff5000] font-bold text-base">
                            ¥{item.product.price}<span className="text-[10px] font-normal text-gray-400 ml-0.5">/{item.product.unit}</span>
                          </div>
                          
                          <button 
                            onClick={() => setSelectedItemForSpec(item)}
                            className="text-[10px] text-[#ff5000] border border-[#ff5000] px-2 py-0.5 rounded flex items-center gap-0.5 bg-orange-50/50 relative"
                          >
                            <span>选规格</span>
                            <div className="absolute -top-1.5 -right-1.5 bg-[#ff5000] text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white">
                              {item.quantity}
                            </div>
                          </button>
                        </div>
                      </div>
                    
                    <div className="flex justify-end items-end mt-2">
                      {/* Quantity Control */}
                      <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden h-7">
                        <button 
                          onClick={() => updateQuantity(item.productId, -1)}
                          className="w-8 h-full flex items-center justify-center text-gray-600 hover:bg-gray-200 active:bg-gray-300 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => addToCart(item.product)}
                          className="w-8 h-full flex items-center justify-center bg-gray-300/50 text-gray-700 hover:bg-gray-300 active:bg-gray-400 transition-colors"
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
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => selectAll(!isAllSelected)}
                  className="flex items-center gap-1.5"
                >
                  {isAllSelected ? (
                    <CheckCircle2 size={18} className="text-[#ff5000] fill-[#ff5000] text-white" />
                  ) : (
                    <Circle size={18} className="text-gray-300" />
                  )}
                  <span className="text-[10px] text-gray-500">全选</span>
                </button>
                
                <div className="flex flex-col justify-center h-9">
                  <div className="flex items-baseline gap-0.5 leading-none">
                    <span className="text-[10px] text-gray-400">合计</span>
                    <span className="text-[#ff5000] text-[10px] font-bold ml-0.5">¥</span>
                    <span className="text-[#ff5000] text-base font-black">{selectedAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-baseline gap-1 leading-none mt-0.5">
                    <span className="text-[10px] text-gray-400">已选</span>
                    <span className="text-xs font-bold text-gray-800">{selectedItemsCount}</span>
                    <span className="text-[10px] text-gray-400">件</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    if (selectedItemsCount === 0) {
                      alert('请先选择商品');
                      return;
                    }
                    alert('订单已提交！');
                    clearCart();
                  }}
                  className={cn(
                    "h-9 px-6 rounded-full font-bold text-sm shadow-md transition-all flex items-center justify-center gap-1",
                    selectedItemsCount > 0 
                      ? "bg-[#ff5000] text-white hover:bg-[#e64800] active:bg-[#cc4000]" 
                      : "bg-gray-300 text-white cursor-not-allowed"
                  )}
                >
                  <span>下单</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Matches Selection Modal */}
      <AnimatePresence>
        {selectedItemForMatches && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItemForMatches(null)}
              className="absolute inset-0 bg-black/40 z-[130] backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[140] p-5 pb-8 shadow-2xl flex flex-col max-h-[70vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-gray-900">选择匹配商品</h3>
                <button onClick={() => setSelectedItemForMatches(null)} className="text-gray-400"><X size={24} /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-4">
                <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 mb-4">
                  <div className="text-xs text-orange-600 mb-1 font-medium">当前商品:</div>
                  <div className="font-bold text-gray-900">{selectedItemForMatches.product.name}</div>
                </div>
                
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-400">为您找到以下匹配商品:</div>
                  {selectedItemForMatches.alternatives?.map(alt => (
                    <button 
                      key={alt.id}
                      onClick={() => {
                        swapProduct(selectedItemForMatches.productId, alt);
                        setSelectedItemForMatches(null);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-[#ff5000] hover:bg-orange-50/30 transition-all text-left"
                    >
                      <img src={alt.image} referrerPolicy="no-referrer" className="w-12 h-12 rounded-lg object-cover bg-gray-50" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 text-sm truncate">{alt.name}</div>
                        <div className="text-[#ff5000] font-bold text-sm mt-0.5">¥{alt.price}</div>
                      </div>
                      <div className="text-[10px] text-[#ff5000] border border-[#ff5000] px-2 py-1 rounded-full">选择</div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Multi-Spec Modal */}
      <AnimatePresence>
        {selectedItemForSpec && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItemForSpec(null)}
              className="absolute inset-0 bg-black/40 z-[110] backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[120] p-5 pb-6 shadow-2xl max-h-[90vh] flex flex-col"
            >
              <div className="flex justify-between items-start mb-6 shrink-0">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                    <img src={selectedItemForSpec.product.image} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{selectedItemForSpec.product.name}</h3>
                    <div className="text-xs text-gray-400 mb-2">{selectedItemForSpec.product.sku || '10001 | 1件x24盒'}</div>
                    <div className="text-[#ff5000] font-bold text-xl">
                      ¥{selectedItemForSpec.product.price}<span className="text-xs font-normal text-gray-500 ml-1">/{selectedItemForSpec.product.unit}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedItemForSpec(null)}
                  className="p-1 text-gray-300 hover:text-gray-500"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-2 space-y-8">
                {/* Unit Selection */}
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-4">单位</h4>
                  <div className="flex flex-wrap gap-3">
                    {(selectedItemForSpec.product.units || ['瓶', '箱']).map((u: string) => (
                      <button 
                        key={u}
                        onClick={() => updateUnit(selectedItemForSpec.productId, u)}
                        className={cn(
                          "px-6 py-2 rounded-lg text-sm font-medium transition-all border",
                          selectedItemForSpec.product.unit === u
                            ? "border-[#ff5000] text-[#ff5000] bg-white shadow-sm ring-1 ring-[#ff5000]"
                            : "border-gray-100 bg-gray-50 text-gray-600"
                        )}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spec Selection */}
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-4">国潮西施</h4>
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 rounded-lg border border-[#ff5000] text-[#ff5000] bg-white text-sm font-medium relative">
                      D-12薄荷米棕色
                      <div className="absolute -top-2 -right-2 bg-[#ff5000] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">2</div>
                    </button>
                    <button className="px-4 py-2 rounded-lg border border-gray-100 bg-gray-50 text-gray-600 text-sm">D-00淡化提浅膏</button>
                  </div>
                </div>

                {/* Variant Selection with Quantity */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">8寸</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden h-8">
                        <button className="w-9 h-full flex items-center justify-center text-gray-400"><Minus size={14} /></button>
                        <span className="w-10 text-center text-sm font-bold text-gray-800">1</span>
                        <button className="w-9 h-full flex items-center justify-center bg-[#ff5000] text-white"><Plus size={14} /></button>
                      </div>
                      <div className="text-[10px] text-gray-400">库存: 0{selectedItemForSpec.product.unit}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">6寸</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden h-8">
                        <button className="w-9 h-full flex items-center justify-center text-gray-400"><Minus size={14} /></button>
                        <span className="w-10 text-center text-sm font-bold text-gray-800">1</span>
                        <button className="w-9 h-full flex items-center justify-center bg-[#ff5000] text-white"><Plus size={14} /></button>
                      </div>
                      <div className="text-[10px] text-gray-400">库存: 0{selectedItemForSpec.product.unit}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 shrink-0">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm">总数<span className="font-bold ml-1 text-base">2</span></div>
                  <div className="text-sm">总金额<span className="font-bold ml-1 text-base text-[#ff5000]">¥9.6</span></div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      removeFromCart(selectedItemForSpec.productId);
                      setSelectedItemForSpec(null);
                    }}
                    className="flex-1 h-12 border border-gray-200 text-gray-600 rounded-xl font-medium text-base active:bg-gray-50 transition-colors"
                  >
                    移出购物车
                  </button>
                  <button 
                    onClick={() => setSelectedItemForSpec(null)}
                    className="flex-[1.5] h-12 bg-[#ff5000] text-white rounded-xl font-bold text-base shadow-lg shadow-orange-100 active:scale-[0.98] transition-transform"
                  >
                    确认
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
