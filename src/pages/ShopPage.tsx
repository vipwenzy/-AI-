import React, { useState } from 'react';
import { Search, ShoppingCart, Plus, Minus, MapPin, Phone, Share2, MoreHorizontal, Grid, ListFilter, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { MOCK_PRODUCTS, Product } from '../data/mockDb';
import { motion, AnimatePresence } from 'motion/react';

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addToCart, updateQuantity, items: cartItems } = useCart();

  const categories = ['全部', '买过', '推荐', '铜饰品', '空托', '足金', 'K金', '钻石'];

  const getQuantity = (productId: string) => {
    return cartItems.find(item => item.productId === productId)?.quantity || 0;
  };

  const filteredProducts = activeCategory === '全部' 
    ? MOCK_PRODUCTS 
    : activeCategory === '买过' || activeCategory === '推荐'
      ? MOCK_PRODUCTS.slice(0, 4) // Mock data for special tabs
      : MOCK_PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="flex flex-col h-full bg-[#F5F7FA] font-sans relative">
      {/* Header Background */}
      <div className="h-48 bg-gradient-to-r from-orange-500 to-red-500 absolute top-0 left-0 right-0 z-0"></div>

      {/* Top Bar */}
      <div className="relative z-10 px-4 pt-2 flex items-center gap-3">
        <div className="flex-1 h-9 bg-white rounded-full flex items-center px-3 gap-2 shadow-sm">
          <Search size={16} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="货名/属性/条码" 
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
          <ScanIcon />
        </div>
        <button className="text-white/90 hover:text-white"><Share2 size={24} /></button>
        <button className="text-white/90 hover:text-white"><MoreHorizontal size={24} /></button>
      </div>

      {/* Shop Info Card */}
      <div className="relative z-10 mx-3 mt-4 bg-white rounded-xl p-4 shadow-sm mb-2">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">广州兴盛批发部</h1>
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
              <Phone size={12} />
              <span>13928728301 (周总)</span>
            </div>
            <div className="flex items-start gap-1 text-xs text-gray-500 leading-tight">
              <MapPin size={12} className="shrink-0 mt-0.5" />
              <span className="line-clamp-2">中国 广东省 广州市 番禺区 沙头街银平三街8号金年华B5栋一楼中检</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 ml-2">
             <StoreIcon />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
           <span className="px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded">公告</span>
           <span>欢迎选购，新货已上架！</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative z-10 bg-white border-b border-gray-100 flex items-center px-4 h-10 shrink-0">
        <button className="relative h-full px-2 font-bold text-gray-900 border-b-2 border-orange-500 text-sm">商品</button>
        <button className="relative h-full px-2 font-medium text-gray-500 text-sm ml-4 flex items-center gap-1">
          上新 <span className="bg-orange-500 text-white text-[9px] px-1 rounded-sm">new</span>
        </button>
        <div className="ml-auto flex items-center gap-3 text-gray-500 text-xs">
           <span className="flex items-center">排序 <ChevronDownIcon /></span>
           <span className="flex items-center">筛选 <FilterIcon /></span>
           <GridIcon />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden bg-white">
        {/* Sidebar */}
        <div className="w-20 bg-[#F7F8FA] overflow-y-auto shrink-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "w-full h-12 flex items-center justify-center text-xs transition-colors relative",
                activeCategory === cat ? "bg-white font-bold text-gray-900" : "text-gray-500 hover:bg-white/50"
              )}
            >
              {activeCategory === cat && <div className="absolute left-0 top-3 bottom-3 w-1 bg-orange-500 rounded-r-full" />}
              {cat}
            </button>
          ))}
        </div>

        {/* Product List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <div className="flex items-center gap-2 mb-2">
             <ListFilter size={14} className="text-orange-500" />
             <span className="text-sm font-bold text-gray-900">{activeCategory}</span>
          </div>

          {filteredProducts.map(product => {
            const qty = getQuantity(product.id);
            return (
              <div key={product.id} className="flex gap-3" onClick={() => setSelectedProduct(product)}>
                <div className="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden shrink-0 relative border border-gray-100">
                  <img src={product.image} className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2 mb-1">{product.name}</h3>
                    <div className="text-xs text-gray-400 mb-1">编码: {product.id}</div>
                    <div className="text-xs text-gray-400">库存{product.inventory}个</div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="text-orange-600 font-bold text-lg font-mono">
                      <span className="text-xs mr-0.5">¥</span>{product.price}
                      <span className="text-xs text-gray-400 font-normal ml-1">/{product.unit}</span>
                    </div>
                    
                    {qty === 0 ? (
                      <button 
                        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                        className="w-6 h-6 bg-orange-500 rounded text-white flex items-center justify-center active:scale-90 transition-transform"
                      >
                        <Plus size={16} />
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, -1); }}
                          className="w-6 h-6 border border-gray-200 rounded flex items-center justify-center text-gray-400 active:scale-90 transition-transform"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{qty}</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                          className="w-6 h-6 bg-orange-500 rounded text-white flex items-center justify-center active:scale-90 transition-transform"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Spacer for bottom nav */}
          <div className="h-12"></div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/40 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 flex flex-col max-h-[85vh] overflow-hidden shadow-2xl"
            >
              <div className="relative w-full aspect-square bg-gray-50 shrink-0">
                <img src={selectedProduct.image} className="w-full h-full object-cover mix-blend-multiply" />
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 text-white flex items-center justify-center backdrop-blur-md"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-5 flex-1 overflow-y-auto pb-24">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-2xl font-bold text-orange-600 font-mono">
                    <span className="text-sm mr-0.5">¥</span>{selectedProduct.price}
                    <span className="text-sm text-gray-400 font-normal ml-1">/{selectedProduct.unit}</span>
                  </div>
                  <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    库存 {selectedProduct.inventory}
                  </div>
                </div>
                
                <h2 className="text-lg font-bold text-gray-900 mb-2 leading-snug">{selectedProduct.name}</h2>
                <div className="text-sm text-gray-500 mb-6">商品编码: {selectedProduct.id}</div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-t border-gray-100">
                    <span className="text-gray-500 text-sm">发货地</span>
                    <span className="text-gray-900 text-sm font-medium">广东广州</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-t border-gray-100">
                    <span className="text-gray-500 text-sm">服务</span>
                    <span className="text-gray-900 text-sm font-medium">48小时发货 · 破损包赔</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex items-center gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <button className="w-12 h-12 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50">
                  <ShoppingCart size={20} />
                  <span className="text-[10px] mt-0.5">购物车</span>
                </button>
                
                {getQuantity(selectedProduct.id) === 0 ? (
                  <button 
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null); // Optional: close modal after adding
                    }}
                    className="flex-1 h-12 bg-orange-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-200 active:scale-[0.98] transition-transform"
                  >
                    加入购物车
                  </button>
                ) : (
                  <div className="flex-1 h-12 flex items-center justify-between px-4 bg-gray-50 rounded-xl border border-gray-200">
                    <button 
                      onClick={() => updateQuantity(selectedProduct.id, -1)}
                      className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center text-gray-600 active:scale-90 transition-transform"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="font-bold text-lg font-mono">{getQuantity(selectedProduct.id)}</span>
                    <button 
                      onClick={() => addToCart(selectedProduct)}
                      className="w-8 h-8 rounded bg-orange-500 text-white flex items-center justify-center active:scale-90 transition-transform"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple Icons
const ScanIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
  </svg>
);

const StoreIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <path d="M3 21h18v-8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8Z" />
    <path d="M3 7h18a2 2 0 0 1 2 2v2H1v-2a2 2 0 0 1 2-2Z" />
    <path d="M8 21V11" />
    <path d="M16 21V11" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const FilterIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 text-gray-400">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="7" x="3" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="14" rx="1" />
    <rect width="7" height="7" x="3" y="14" rx="1" />
  </svg>
);
