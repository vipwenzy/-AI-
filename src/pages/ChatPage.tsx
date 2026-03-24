import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Send, Check, X, Sparkles, RefreshCw, ArrowRight, Minus, Plus, ChevronDown, MoreHorizontal, Search, Bell, Zap, BarChart3, Box, Trash2, PlusCircle, History, MessageSquare, Camera, ScanLine, PenTool, ShoppingCart, Gift, AlertCircle, Share2, ShoppingBag } from 'lucide-react';
import { MOCK_PRODUCTS, Product, Message, OrderItem } from '../data/mockDb';
import { cn } from '../lib/utils';
import { useCart } from '../context/CartContext';

import CartPage from './CartPage';

// --- Types ---
interface ChatSession {
  id: string;
  title: string;
  date: Date;
  messages: Message[];
}

// --- Components ---

const CartBadge = () => {
  const { totalItems } = useCart();
  if (totalItems === 0) return null;
  return (
    <div className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
      {totalItems > 99 ? '99+' : totalItems}
    </div>
  );
};

const ProductSelector = ({ 
  currentProduct, 
  onSelect, 
  onClose 
}: { 
  currentProduct: Product, 
  onSelect: (p: Product) => void, 
  onClose: () => void 
}) => {
  return (
    <motion.div 
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute inset-x-0 bottom-0 h-[80%] bg-white rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 flex flex-col overflow-hidden border-t border-gray-100"
    >
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
        <div>
          <h3 className="font-bold text-xl text-gray-900">更换商品</h3>
          <p className="text-sm text-gray-500 mt-0.5">AI 智能推荐替代品</p>
        </div>
        <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
          <X size={20} className="text-gray-500" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {MOCK_PRODUCTS.map(product => (
          <div 
            key={product.id}
            onClick={() => onSelect(product)}
            className={cn(
              "flex items-center gap-4 p-4 rounded-2xl border transition-all active:scale-[0.98] cursor-pointer",
              currentProduct.id === product.id 
                ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500" 
                : "border-gray-100 hover:border-gray-200 bg-white"
            )}
          >
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">{product.name}</div>
              <div className="text-sm text-gray-500 mt-1">¥{product.price.toFixed(2)} / {product.unit}</div>
            </div>
            {currentProduct.id === product.id && (
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-md shadow-blue-200">
                <Check size={14} className="text-white" />
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const OrderDraftCard = ({ 
  items, 
  onUpdateItem, 
  onUpdateQuantity,
  onConfirm,
  isConfirmed
}: { 
  items: OrderItem[], 
  onUpdateItem: (index: number, product: Product) => void,
  onUpdateQuantity: (index: number, delta: number) => void,
  onConfirm: () => void,
  isConfirmed?: boolean
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const total = items.reduce((sum, item) => {
    const product = MOCK_PRODUCTS.find(p => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  return (
    <div className="w-[300px] bg-white rounded-[24px] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden mt-3 font-sans relative group">
      {/* Ambient Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
      
      <div className="relative bg-white h-full flex flex-col z-0">
        {/* Card Header */}
        <div className={cn(
          "px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50",
          isConfirmed ? "bg-green-50/50 border-green-100" : ""
        )}>
          <div className="flex items-center gap-2.5">
            <div className={cn(
              "w-7 h-7 rounded-lg flex items-center justify-center shadow-sm",
              isConfirmed ? "bg-green-100 text-green-600" : "bg-blue-600 text-white shadow-blue-200"
            )}>
              {isConfirmed ? <Check size={14} strokeWidth={3} /> : <Sparkles size={14} fill="currentColor" />}
            </div>
            <div>
              <div className={cn(
                "text-sm font-bold tracking-tight leading-none",
                isConfirmed ? "text-green-700" : "text-gray-900"
              )}>
                {isConfirmed ? '订单已确认' : 'AI 智能采购单'}
              </div>
              <div className="text-[10px] text-gray-400 mt-1 font-mono tracking-wide">
                ID: {isConfirmed ? 'SO-20240225-001' : 'DRAFT-GEN-001'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Items List */}
        <div className="divide-y divide-gray-50">
          {items.map((item, index) => {
            const product = MOCK_PRODUCTS.find(p => p.id === item.productId);
            if (!product) return null;
            
            return (
              <div key={index} className="p-4 flex gap-3 group/item hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                  <img src={product.image} className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-medium text-gray-900 truncate pr-2">{product.name}</h4>
                    <span className="text-xs font-mono text-gray-500">¥{product.price}</span>
                  </div>
                  
                  <div className="flex justify-between items-end mt-2">
                    {!isConfirmed ? (
                      <button 
                        onClick={() => setEditingIndex(index)}
                        className="text-[10px] text-blue-600 hover:text-blue-700 flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        <RefreshCw size={10} /> 更换
                      </button>
                    ) : (
                      <span className="text-[10px] text-gray-400">{product.unit}</span>
                    )}

                    {/* Quantity Control */}
                    <div className={cn(
                      "flex items-center h-6 rounded-lg border overflow-hidden",
                      isConfirmed ? "border-transparent" : "border-gray-200 bg-white"
                    )}>
                      {!isConfirmed && (
                        <button 
                          onClick={() => onUpdateQuantity(index, -1)}
                          className="w-7 h-full flex items-center justify-center hover:bg-gray-50 text-gray-400 disabled:opacity-30 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={12} />
                        </button>
                      )}
                      <span className="text-xs font-mono font-medium px-2 min-w-[2rem] text-center text-gray-900">{item.quantity}</span>
                      {!isConfirmed && (
                        <button 
                          onClick={() => onUpdateQuantity(index, 1)}
                          className="w-7 h-full flex items-center justify-center hover:bg-gray-50 text-gray-400 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50/50 border-t border-gray-100">
          <div className="flex justify-between items-end mb-4">
            <span className="text-xs text-gray-500">预估总额</span>
            <span className="text-xl font-bold text-gray-900 font-mono tracking-tight">
              <span className="text-sm text-gray-400 mr-1">¥</span>
              {total.toFixed(2)}
            </span>
          </div>
          
          {!isConfirmed && (
            <button 
              onClick={onConfirm}
              className="w-full h-11 bg-gray-900 text-white rounded-xl font-bold text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200 hover:shadow-xl hover:bg-black"
            >
              确认生成订单 <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {editingIndex !== null && (
          <ProductSelector 
            currentProduct={MOCK_PRODUCTS.find(p => p.id === items[editingIndex].productId)!}
            onSelect={(product) => {
              onUpdateItem(editingIndex, product);
              setEditingIndex(null);
            }}
            onClose={() => setEditingIndex(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const OrderImageCard = ({ items, orderNo }: { items: OrderItem[], orderNo: string }) => {
  const total = items.reduce((sum, item) => {
    const product = MOCK_PRODUCTS.find(p => p.id === item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-64">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">订货单</h3>
            <p className="text-xs opacity-80 mt-0.5">{orderNo}</p>
          </div>
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Check size={16} className="text-white" />
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-50/50">
        <div className="space-y-3 mb-4">
          {items.map((item, index) => {
            const product = MOCK_PRODUCTS.find(p => p.id === item.productId);
            if (!product) return null;
            return (
              <div key={index} className="flex justify-between items-start text-sm">
                <div className="flex-1 pr-2">
                  <div className="font-medium text-gray-900 truncate">{product.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">¥{product.price} × {item.quantity} {product.unit}</div>
                </div>
                <div className="font-mono font-medium text-gray-900">
                  ¥{(product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="border-t border-dashed border-gray-300 pt-3 flex justify-between items-end">
          <span className="text-xs text-gray-500">合计总额</span>
          <span className="text-lg font-bold text-orange-600 font-mono">
            <span className="text-xs mr-0.5">¥</span>{total.toFixed(2)}
          </span>
        </div>
      </div>
      
      <div className="p-3 bg-white border-t border-gray-100 flex justify-center">
        <button className="flex items-center gap-1.5 text-blue-600 text-xs font-medium hover:text-blue-700 transition-colors">
          <Share2 size={14} /> 转发给客户/老板
        </button>
      </div>
    </div>
  );
};

const ProductListCard = ({ products, onAddToCart }: { products: Product[], onAddToCart: (product: Product) => void }) => {
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const handleAdd = (product: Product) => {
    onAddToCart(product);
    setAddedItems(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.id]: false }));
    }, 1000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full max-w-[280px]">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 text-white flex items-center gap-2">
        <Zap size={18} className="text-yellow-200" />
        <span className="font-bold text-sm">本周爆款推荐</span>
      </div>
      <div className="divide-y divide-gray-50">
        {products.map((product, index) => (
          <div key={product.id} className="p-3 flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden shrink-0">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 text-sm truncate">{product.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">
                <span className="text-orange-600 font-bold font-mono">¥{product.price}</span> / {product.unit}
              </div>
            </div>
            <button 
              onClick={() => handleAdd(product)}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0",
                addedItems[product.id] 
                  ? "bg-green-500 text-white scale-110" 
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100 active:scale-90"
              )}
            >
              {addedItems[product.id] ? <Check size={16} /> : <Plus size={16} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const OrderHistoryCard = ({ order, onReorder, onViewDetails }: { order: any, onReorder: (items: any[]) => void, onViewDetails?: () => void }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full max-w-[280px]">
      <div 
        className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={onViewDetails}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
            <ShoppingBag size={12} className="text-blue-600" />
          </div>
          <span className="font-bold text-sm text-gray-900">{order.orderNo}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{order.status}</span>
          {onViewDetails && <ArrowRight size={14} className="text-gray-400" />}
        </div>
      </div>
      
      <div className="p-3 space-y-3" onClick={onViewDetails} style={{ cursor: onViewDetails ? 'pointer' : 'default' }}>
        <div className="text-xs text-gray-500 mb-2">{order.date}</div>
        {order.items.map((item: any, index: number) => {
          const product = MOCK_PRODUCTS.find(p => p.id === item.productId);
          if (!product) return null;
          return (
            <div key={index} className="flex justify-between items-start text-sm">
              <div className="flex-1 pr-2">
                <div className="font-medium text-gray-900 truncate">{product.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">¥{product.price} × {item.quantity} {product.unit}</div>
              </div>
              <div className="font-mono font-medium text-gray-900">
                ¥{(product.price * item.quantity).toFixed(2)}
              </div>
            </div>
          );
        })}
        
        <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-end mt-2">
          <span className="text-xs text-gray-500">合计总额</span>
          <span className="text-lg font-bold text-gray-900 font-mono">
            <span className="text-xs mr-0.5">¥</span>{order.total.toFixed(2)}
          </span>
        </div>
      </div>
      
      <div className="p-3 bg-gray-50 border-t border-gray-100 flex gap-2">
        {onViewDetails && (
          <button 
            onClick={onViewDetails}
            className="flex-1 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium text-sm shadow-sm active:scale-95 transition-transform flex justify-center items-center"
          >
            查看详情
          </button>
        )}
        <button 
          onClick={() => onReorder(order.items)}
          className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-medium text-sm shadow-md shadow-blue-200 active:scale-95 transition-transform flex justify-center items-center gap-1.5"
        >
          <ShoppingCart size={16} /> 再来一单
        </button>
      </div>
    </div>
  );
};

const INITIAL_MESSAGE = '李老板下午好，我是广州兴盛批发部的 AI 开单助手！\n\n您可以这样使用我：\n🎤 按住底部麦克风，直接说："来50箱可乐"\n📸 点击左下角相机，拍下您的手写缺货单\n⌨️ 在下方输入框打字："查一下昨天的订单"\n\n请问今天需要点什么？您可以直接点击下方建议，或对我说：';

export default function ChatPage({ isEmbedded, onCollapse, onNavigate }: { isEmbedded?: boolean, onCollapse?: () => void, onNavigate?: (tab: any) => void }) {
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: '当前对话',
      date: new Date(),
      messages: [
        {
          id: '1',
          role: 'agent',
          type: 'text',
          content: INITIAL_MESSAGE,
          timestamp: new Date(),
          data: {
            suggestions: ['最近有什么优惠活动', '查一下我近期的订单', '来50箱可乐和20盒薯片']
          }
        }
      ]
    }
  ]);
  const [activeSessionId, setActiveSessionId] = useState<string>('1');
  const [showHistory, setShowHistory] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { items: cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalItems } = useCart();

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const messages = activeSession.messages;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing, activeSessionId]);

  const updateMessages = (newMessages: Message[] | ((prev: Message[]) => Message[])) => {
    setSessions(prev => prev.map(session => {
      if (session.id === activeSessionId) {
        const updatedMessages = typeof newMessages === 'function' 
          ? newMessages(session.messages) 
          : newMessages;
        return { ...session, messages: updatedMessages };
      }
      return session;
    }));
  };

  const handleCameraAction = (type: 'handwritten' | 'scan') => {
    setIsCameraOpen(false);
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      
      const product = MOCK_PRODUCTS[4]; // Water
      addToCart(product, 10);
      
      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        type: 'text',
        content: type === 'handwritten' ? '[图片] 识别手写单据' : '[扫码] 识别商品条码',
        timestamp: new Date()
      };
      updateMessages(prev => [...prev, userMsg]);

      const replyMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        type: 'text',
        content: `已识别${type === 'handwritten' ? '手写单据' : '商品条码'}，已为您将 10 箱${product.name} 添加到购物车。`,
        timestamp: new Date()
      };
      updateMessages(prev => [...prev, replyMsg]);
      setIsCartModalOpen(true);
    }, 1500);
  };

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: '新对话',
      date: new Date(),
      messages: [{
        id: Date.now().toString(),
        role: 'agent',
        type: 'text',
        content: INITIAL_MESSAGE,
        timestamp: new Date(),
        data: {
          suggestions: ['最近有什么优惠活动', '查一下我近期的订单', '来50箱可乐和20盒薯片']
        }
      }]
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setShowHistory(false);
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      type: 'text',
      content: text,
      timestamp: new Date()
    };
    
    updateMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsProcessing(true);

    // Update session title if it's the first user message
    if (messages.length === 1) {
      setSessions(prev => prev.map(s => 
        s.id === activeSessionId ? { ...s, title: text.slice(0, 10) + (text.length > 10 ? '...' : '') } : s
      ));
    }

    // Intent detection for cart visibility
    const isRemoveIntent = /去掉|不要|删除|取消|减/.test(text);
    const isAddIntent = /要|加|买|来|补货|下单|结算|特惠|爆款|优惠|活动|单子/.test(text);
    const isCartRelated = isRemoveIntent || isAddIntent || text.includes('购物车');

    if (!isCartRelated && isCartModalOpen) {
      setIsCartModalOpen(false);
    }

    setTimeout(() => {
      setIsProcessing(false);
      
      let replyMsg: Message;

      if (isRemoveIntent) {
        // Try to find what to remove
        const itemToRemove = cartItems.find(item => 
          text.includes(item.product.name) || 
          (item.product.name.includes('薯片') && text.includes('薯片')) ||
          (item.product.name.includes('可乐') && text.includes('可乐')) ||
          (item.product.name.includes('水') && text.includes('水')) ||
          (item.product.name.includes('饼干') && text.includes('饼干'))
        );

        if (itemToRemove) {
          removeFromCart(itemToRemove.productId);
          replyMsg = {
            id: (Date.now() + 1).toString(),
            role: 'agent',
            type: 'text',
            content: `好的，已为您从购物车中移除【${itemToRemove.product.name}】。`,
            timestamp: new Date()
          };
        } else {
          replyMsg = {
            id: (Date.now() + 1).toString(),
            role: 'agent',
            type: 'text',
            content: `好的，已为您更新购物车。`,
            timestamp: new Date()
          };
        }
      } else if (text.includes('本周爆款') || text.includes('卖得好')) {
        const cola = MOCK_PRODUCTS.find(p => p.id === '1');
        const chips = MOCK_PRODUCTS.find(p => p.id === '3');
        const water = MOCK_PRODUCTS.find(p => p.id === '5');
        const products = [cola, chips, water].filter(Boolean) as Product[];

        replyMsg = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          type: 'product-list',
          content: '为您推荐本周销量最高的商品，您可以直接点击添加：',
          timestamp: new Date(),
          data: {
            products: products
          }
        };
      } else if (text.includes('限时特惠') || text.includes('优惠') || text.includes('活动')) {
        const pepsi = MOCK_PRODUCTS.find(p => p.id === '2');
        const oreo = MOCK_PRODUCTS.find(p => p.id === '6');
        const products = [pepsi, oreo].filter(Boolean) as Product[];

        replyMsg = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          type: 'product-list',
          content: '最近有以下商品正在做限时促销活动，进货价非常划算，您可以直接点击添加：',
          timestamp: new Date(),
          data: {
            products: products,
            suggestions: ['帮我把这两款各加10箱', '还有其他优惠吗？']
          }
        };
      } else if (text.includes('各加10箱') || text.includes('这两款各加')) {
        const pepsi = MOCK_PRODUCTS.find(p => p.id === '2');
        const oreo = MOCK_PRODUCTS.find(p => p.id === '6');
        if (pepsi) addToCart(pepsi, 10);
        if (oreo) addToCart(oreo, 10);

        replyMsg = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          type: 'text',
          content: '好的，已为您将百事可乐和奥利奥各加10箱到购物车！您可以点击右上角购物车查看。',
          timestamp: new Date()
        };
      } else if (text.includes('其他优惠') || text.includes('还有其他')) {
        const water = MOCK_PRODUCTS.find(p => p.id === '5');
        const chips = MOCK_PRODUCTS.find(p => p.id === '4');
        const products = [water, chips].filter(Boolean) as Product[];

        replyMsg = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          type: 'product-list',
          content: '当然，农夫山泉和乐事香辣味薯片目前也有满减活动，非常适合搭配进货：',
          timestamp: new Date(),
          data: {
            products: products,
            suggestions: ['帮我把这两款各加5箱']
          }
        };
      } else if (text.includes('各加5箱') || text.includes('这两款各加5')) {
        const water = MOCK_PRODUCTS.find(p => p.id === '5');
        const chips = MOCK_PRODUCTS.find(p => p.id === '4');
        if (water) addToCart(water, 5);
        if (chips) addToCart(chips, 5);

        replyMsg = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          type: 'text',
          content: '好的，已为您将农夫山泉和乐事香辣味薯片各加5箱到购物车！',
          timestamp: new Date()
        };
      } else if (text.includes('常购清单') || text.includes('以前的单子')) {
        const cola = MOCK_PRODUCTS.find(p => p.id === '1');
        const water = MOCK_PRODUCTS.find(p => p.id === '5');
        const chips = MOCK_PRODUCTS.find(p => p.id === '3');
        if (cola) addToCart(cola, 20);
        if (water) addToCart(water, 20);
        if (chips) addToCart(chips, 10);

        replyMsg = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          type: 'text',
          content: '好的，这是您经常采购的商品组合，已为您全部添加到购物车，请确认！',
          timestamp: new Date()
        };
      } else if (text.includes('近期') || text.includes('最近')) {
        const water = MOCK_PRODUCTS.find(p => p.id === '5');
        const cola = MOCK_PRODUCTS.find(p => p.id === '1');
        const oreo = MOCK_PRODUCTS.find(p => p.id === '6');
        
        replyMsg = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          type: 'order-history',
          content: '为您找到最近的一笔订单。该订单已接单。您可以点击下方按钮再次购买相同商品，或点击“查看详情”进入订单页：',
          timestamp: new Date(),
          data: {
            order: {
              orderNo: 'SO-20240225-001',
              status: '已接单',
              date: '2024-02-25 14:30',
              items: [
                { productId: '5', quantity: 100 },
                { productId: '1', quantity: 10 },
                { productId: '6', quantity: 5 }
              ],
              total: 3540.00
            }
          }
        };
      } else if (text.includes('昨天') || text.includes('订单')) {
        const cola = MOCK_PRODUCTS.find(p => p.id === '1');
        const chips = MOCK_PRODUCTS.find(p => p.id === '3');
        
        replyMsg = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          type: 'order-history',
          content: '为您找到昨天的订单。该订单待接单。您可以点击下方按钮再次购买相同商品，或点击“查看详情”进入订单页：',
          timestamp: new Date(),
          data: {
            order: {
              orderNo: 'SO-20240226-001',
              status: '待接单',
              date: '2024-02-26 10:00',
              items: [
                { productId: '1', quantity: 50 },
                { productId: '3', quantity: 20 }
              ],
              total: 3550.00
            }
          }
        };
      } else if (text.includes('雪碧')) {
        replyMsg = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          type: 'text',
          content: '抱歉，【雪碧 330ml 罐装】当前已售罄。是否为您替换为【可口可乐】或【七喜】？',
          timestamp: new Date(),
          data: {
            suggestions: ['替换为可口可乐', '替换为七喜', '到货提醒我']
          }
        };
      } else if (text.includes('红牛') && (text.includes('10') || text.includes('十'))) {
        const redbull = MOCK_PRODUCTS.find(p => p.id === '13');
        if (redbull) addToCart(redbull, 5);

        replyMsg = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          type: 'text',
          content: '【红牛维生素饮料】库存不足，已为您将最大可售数量（5箱）添加到购物车。',
          timestamp: new Date()
        };
      } else if (text === '来点水' || text === '水' || text.includes('买水')) {
        replyMsg = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          type: 'text',
          content: '店里有多种饮用水，请问您需要哪一款？',
          timestamp: new Date(),
          data: {
            suggestions: ['农夫山泉', '百岁山', '怡宝', '随便来5箱最畅销的']
          }
        };
      } else if (text.includes('可乐') || text.includes('薯片') || text.includes('补货')) {
        const cola = MOCK_PRODUCTS.find(p => p.id === '1');
        const chips = MOCK_PRODUCTS.find(p => p.id === '3');
        if (cola) addToCart(cola, 50);
        if (chips) addToCart(chips, 20);

        replyMsg = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          type: 'text',
          content: '已为您将 50箱可乐 和 20盒薯片 添加到购物车，请确认！',
          timestamp: new Date()
        };
      } else if (text.includes('替换为可口可乐')) {
        const cola = MOCK_PRODUCTS.find(p => p.id === '1');
        if (cola) addToCart(cola, 10);

        replyMsg = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          type: 'text',
          content: '好的，已为您将 10箱可口可乐 添加到购物车。',
          timestamp: new Date()
        };
      } else if (text.includes('随便来5箱最畅销的')) {
        const water = MOCK_PRODUCTS.find(p => p.id === '5');
        if (water) addToCart(water, 5);

        replyMsg = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          type: 'text',
          content: '为您挑选了销量最好的农夫山泉，已添加 5箱 到购物车，请确认！',
          timestamp: new Date()
        };
      } else if (text.includes('催单') || text.includes('发货') || text.includes('还没到')) {
        replyMsg = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          type: 'text',
          content: '帮您查了一下，您最近的订单 SO-20240225-001 已经在打包了，预计今天下午发货。需要帮您联系仓库加急吗？',
          timestamp: new Date(),
          data: {
            suggestions: ['帮我加急', '不用了，正常发就行', '查看物流']
          }
        };
      } else if (text.includes('确认订单') || text.includes('下单') || text.includes('结算')) {
        if (cartItems.length === 0) {
          replyMsg = {
            id: (Date.now() + 1).toString(),
            role: 'agent',
            type: 'text',
            content: '您的购物车还是空的哦，请先添加商品。',
            timestamp: new Date()
          };
        } else {
          const confirmMsg: Message = {
            id: Date.now().toString(),
            role: 'agent',
            type: 'text',
            content: "订单 SO-20240225-001 已确认。\n智能调度系统已安排优先发货。这是您的订货单，可以长按转发给客户或老板：",
            timestamp: new Date()
          };
          
          const imageMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'agent',
            type: 'order-image',
            timestamp: new Date(),
            data: {
              items: cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                confirmed: true
              })),
              orderNo: 'SO-20240225-001'
            }
          };
          
          updateMessages(prev => [...prev, confirmMsg, imageMsg]);
          clearCart();
          return; // Early return since we updated messages already
        }
      } else if (text.includes('退货') || text.includes('坏了') || text.includes('碎了')) {
        replyMsg = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          type: 'text',
          content: '非常抱歉给您带来不便！请您拍一张破损商品的照片发给我，我马上为您处理退款或补发。',
          timestamp: new Date(),
          data: {
            suggestions: ['拍照上传', '联系人工客服']
          }
        };
      } else if (text.includes('帮我加急')) {
        replyMsg = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          type: 'text',
          content: '好的，已经为您标记加急！仓库会优先处理您的订单，请留意后续的物流通知。',
          timestamp: new Date()
        };
      } else {
        replyMsg = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          type: 'text',
          content: "收到。AI 正在检索商品库...",
          timestamp: new Date()
        };
      }
      
      updateMessages(prev => [...prev, replyMsg]);
      
      if (replyMsg.content && replyMsg.content.includes('到购物车')) {
        setIsCartModalOpen(true);
      }
    }, 1000);
  };

  const handleVoiceInput = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      handleSend("我要50箱可乐和20盒薯片");
    }, 2000);
  };

  const updateDraftItem = (msgId: string, itemIndex: number, newProduct: Product) => {
    updateMessages(prev => prev.map(msg => {
      if (msg.id === msgId && msg.data) {
        const newItems = [...msg.data.items];
        newItems[itemIndex] = { ...newItems[itemIndex], productId: newProduct.id };
        return { ...msg, data: { ...msg.data, items: newItems } };
      }
      return msg;
    }));
  };

  const updateDraftQuantity = (msgId: string, itemIndex: number, delta: number) => {
    updateMessages(prev => prev.map(msg => {
      if (msg.id === msgId && msg.data) {
        const newItems = [...msg.data.items];
        const newQuantity = Math.max(1, newItems[itemIndex].quantity + delta);
        newItems[itemIndex] = { ...newItems[itemIndex], quantity: newQuantity };
        return { ...msg, data: { ...msg.data, items: newItems } };
      }
      return msg;
    }));
  };

  const confirmOrder = (msgId: string) => {
    let confirmedItems: OrderItem[] = [];
    updateMessages(prev => prev.map(msg => {
      if (msg.id === msgId) {
        confirmedItems = msg.data.items;
        return { ...msg, data: { ...msg.data, isConfirmed: true } };
      }
      return msg;
    }));

    setTimeout(() => {
      const confirmMsg: Message = {
        id: Date.now().toString(),
        role: 'agent',
        type: 'text',
        content: "订单 SO-20240225-001 已确认。\n智能调度系统已安排优先发货。这是您的订货单，可以长按转发给客户或老板：",
        timestamp: new Date()
      };
      
      const imageMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        type: 'order-image',
        timestamp: new Date(),
        data: {
          items: confirmedItems,
          orderNo: 'SO-20240225-001'
        }
      };
      
      updateMessages(prev => [...prev, confirmMsg, imageMsg]);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F7FA] relative font-sans text-gray-900 overflow-hidden">
      {/* Background Ambience - Light Mode */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50 to-transparent pointer-events-none"></div>
      <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-purple-100 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="flex-1 relative flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-16 border-b border-gray-100 flex items-center justify-between px-5 shrink-0 z-20 backdrop-blur-xl bg-white/80 sticky top-0">
        {isEmbedded ? (
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
                <Sparkles size={16} />
              </div>
              <span className="font-bold text-gray-900">AI 助手</span>
              <span className="text-[10px] text-gray-500 flex items-center gap-1 ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                在线
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={createNewChat} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                title="新建对话"
              >
                <PlusCircle size={16} />
              </button>
              <button onClick={onCollapse} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                <ChevronDown size={20} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
                <Box size={18} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-bold text-gray-900 text-[15px] leading-none tracking-tight">广州兴盛批发部</h1>
                  <div className="px-1.5 py-0.5 rounded bg-blue-50 text-[10px] font-medium text-blue-600 border border-blue-100">PRO</div>
                </div>
                <span className="text-[11px] text-gray-500 leading-tight mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  AI 引擎运行中
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={createNewChat} 
                className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1"
                title="新建对话"
              >
                <PlusCircle size={14} />
                新对话
              </button>
              <button 
                onClick={() => setShowHistory(!showHistory)} 
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
                  showHistory ? "bg-blue-100 text-blue-600" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                )}
                title="历史对话"
              >
                <History size={20} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* History Sidebar / Overlay */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="absolute inset-0 bg-black/20 z-20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 right-0 w-64 bg-white shadow-2xl z-30 border-l border-gray-100 pt-16"
            >
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-bold text-gray-900">历史对话</h3>
              </div>
              <div className="overflow-y-auto h-full pb-20">
                {sessions.map(session => (
                  <button
                    key={session.id}
                    onClick={() => {
                      setActiveSessionId(session.id);
                      setShowHistory(false);
                    }}
                    className={cn(
                      "w-full p-4 text-left border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-3",
                      activeSessionId === session.id ? "bg-blue-50/50" : ""
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      activeSessionId === session.id ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
                    )}>
                      <MessageSquare size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">{session.title}</div>
                      <div className="text-xs text-gray-400 mt-1">{session.date.toLocaleDateString()}</div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 relative flex flex-col overflow-hidden">
        {/* AI Suggestions */}
        <div className="px-5 py-4 flex gap-3 overflow-x-auto scrollbar-hide shrink-0 z-10">
          {[
            { icon: <Zap size={14} className="text-orange-600" />, label: '本周爆款', bg: 'bg-orange-50 border-orange-100 text-orange-700', action: '最近哪些货卖得好？' },
            { icon: <Gift size={14} className="text-red-600" />, label: '限时特惠', bg: 'bg-red-50 border-red-100 text-red-700', action: '最近有什么优惠活动？' },
            { icon: <RefreshCw size={14} className="text-blue-600" />, label: '常购清单', bg: 'bg-blue-50 border-blue-100 text-blue-700', action: '照以前的单子再来一车' },
          ].map((chip, i) => (
            <button 
              key={i} 
              onClick={() => handleSend(chip.action)}
              className={cn(
                "px-3 py-2 rounded-xl border flex items-center gap-2 text-xs font-medium whitespace-nowrap transition-all hover:scale-105 active:scale-95 shadow-sm",
                chip.bg
              )}
            >
              {chip.icon}
              {chip.label}
            </button>
          ))}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-8 pb-28 scroll-smooth">
          <div className="flex justify-center">
            <span className="text-[10px] font-medium text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
              AI 会话已加密 • {activeSession.date.toLocaleDateString()}
            </span>
          </div>
          
          {messages.map((msg) => (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              key={msg.id} 
              className={cn(
                "flex gap-4 max-w-[90%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              {msg.role === 'agent' && (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-200 mt-1">
                   <Sparkles size={18} className="text-white" />
                </div>
              )}
              
              <div className={cn("space-y-1.5", msg.role === 'user' ? "items-end flex flex-col" : "")}>
                {msg.type === 'text' && (
                  <div className={cn(
                    "px-5 py-3.5 text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap border",
                    msg.role === 'user' 
                      ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm border-blue-600 shadow-blue-200" 
                      : "bg-white text-gray-800 rounded-2xl rounded-tl-sm border-gray-100"
                  )}>
                    {msg.content}
                  </div>
                )}

                {msg.type === 'order-draft' && msg.data && (
                  <OrderDraftCard 
                    items={msg.data.items} 
                    onUpdateItem={(idx, prod) => updateDraftItem(msg.id, idx, prod)}
                    onUpdateQuantity={(idx, delta) => updateDraftQuantity(msg.id, idx, delta)}
                    onConfirm={() => confirmOrder(msg.id)}
                    isConfirmed={msg.data.isConfirmed}
                  />
                )}

                {msg.type === 'order-image' && msg.data && (
                  <OrderImageCard 
                    items={msg.data.items} 
                    orderNo={msg.data.orderNo} 
                  />
                )}

                {msg.type === 'product-list' && msg.data?.products && (
                  <div className="mt-2">
                    <ProductListCard 
                      products={msg.data.products} 
                      onAddToCart={(product) => addToCart(product, 1)} 
                    />
                  </div>
                )}

                {msg.type === 'order-history' && msg.data?.order && (
                  <div className="mt-2">
                    <OrderHistoryCard 
                      order={msg.data.order} 
                      onReorder={(items) => {
                        items.forEach((item: any) => {
                          const product = MOCK_PRODUCTS.find(p => p.id === item.productId);
                          if (product) {
                            addToCart(product, item.quantity);
                          }
                        });
                        setIsCartModalOpen(true);
                      }}
                      onViewDetails={onNavigate ? () => onNavigate(`profile:orders:${msg.data.order.orderNo}`) : undefined}
                    />
                  </div>
                )}

                {msg.data?.warning && (
                  <div className="flex items-start gap-1.5 mt-2 bg-orange-50 text-orange-600 p-2.5 rounded-xl text-xs border border-orange-100 shadow-sm max-w-xs">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{msg.data.warning}</span>
                  </div>
                )}

                {msg.data?.suggestions && (
                  <div className="flex flex-wrap gap-2 mt-2 max-w-xs">
                    {msg.data.suggestions.map((s: string) => (
                      <button 
                        key={s}
                        onClick={() => handleSend(s)} 
                        className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-colors active:scale-95 shadow-sm font-medium"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                
                <div className={cn(
                  "text-[10px] text-gray-400 px-1 font-medium tracking-wide",
                  msg.role === 'user' ? "text-right" : "text-left"
                )}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}

          {isProcessing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
               <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-200 mt-1">
                   <Sparkles size={18} className="text-white" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-3 border border-gray-100 shadow-sm">
                  <span className="text-xs text-gray-500 font-medium tracking-wide">AI 正在思考</span>
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Voice Recording Overlay - Light Mode */}
        <AnimatePresence>
          {isRecording && (
            <motion.div 
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              className="absolute inset-0 bg-white/60 z-60 flex flex-col items-center justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mb-8 relative shadow-2xl shadow-blue-500/30 border-4 border-white">
                   <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-50"></div>
                   <Mic size={32} className="text-white relative z-10" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">正在聆听...</h3>
              <p className="text-gray-500 text-sm font-medium">AI 语音引擎已激活</p>
              
              <div className="mt-12 flex gap-1.5 items-center h-12">
                {[...Array(12)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: [10, 40, 10], opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.08, ease: "easeInOut" }}
                    className="w-1.5 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-full shadow-sm"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cart Modal - Full Screen */}
        <AnimatePresence>
          {isCartModalOpen && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-0 z-[100] bg-white flex flex-col overflow-hidden"
            >
              <div className="flex-1 overflow-hidden relative">
                <CartPage onClose={() => setIsCartModalOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Cart Button - Persistent */}
      <AnimatePresence>
        {!isCartModalOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCartModalOpen(true)}
            className="absolute bottom-24 right-5 w-14 h-14 bg-gray-900 text-white rounded-full shadow-xl shadow-gray-400/30 z-40 flex items-center justify-center border-4 border-white"
          >
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center border-2 border-white font-bold">
                {totalItems}
              </div>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input Area - Light Mode */}
      <div className="px-5 py-4 bg-white/80 backdrop-blur-xl border-t border-gray-100 shrink-0 safe-area-bottom z-30 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsCameraOpen(true)}
            className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 flex items-center justify-center hover:bg-gray-100 hover:text-blue-600 hover:border-blue-200 active:scale-95 transition-all group"
          >
            <Camera size={20} className="group-hover:text-blue-600 transition-colors" />
          </button>
          <button 
            onClick={handleVoiceInput}
            className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 flex items-center justify-center hover:bg-gray-100 hover:text-blue-600 hover:border-blue-200 active:scale-95 transition-all group"
          >
            <Mic size={20} className="group-hover:text-blue-600 transition-colors" />
          </button>
          
          <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3 flex items-center border border-gray-200 focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(59,130,246,0.1)] transition-all">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
              placeholder="你说话或拍照，我开单"
              className="bg-transparent w-full outline-none text-[15px] placeholder:text-gray-400 text-gray-900"
            />
          </div>
          
          <AnimatePresence>
            {inputValue.trim() ? (
              <motion.button 
                initial={{ scale: 0, opacity: 0, rotate: -45 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0, rotate: 45 }}
                onClick={() => handleSend(inputValue)}
                className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200 hover:shadow-xl hover:bg-blue-700 active:scale-90 transition-all"
              >
                <Send size={20} />
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* Camera Overlay */}
      <AnimatePresence>
        {isCameraOpen && (
          <motion.div 
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            className="absolute inset-0 bg-black z-[100] flex flex-col"
          >
            <div className="flex-1 relative overflow-hidden">
               {/* Camera Viewfinder Simulation */}
               <img src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover opacity-50" />
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-64 h-64 border-2 border-white/50 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-xl"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-xl"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-xl"></div>
                    {/* Scanning Line */}
                    <motion.div 
                      animate={{ y: [0, 256, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                    />
                 </div>
               </div>
               <button 
                 onClick={() => setIsCameraOpen(false)}
                 className="absolute top-6 left-6 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md"
               >
                 <X size={24} />
               </button>
            </div>
            <div className="h-48 bg-black flex flex-col items-center justify-center gap-8 pb-8">
               <div className="flex gap-8 text-sm font-medium text-gray-400">
                 <button onClick={() => handleCameraAction('handwritten')} className="text-white">拍手写单</button>
                 <button onClick={() => handleCameraAction('scan')}>扫二维码</button>
               </div>
               <div className="flex items-center gap-12">
                 <div className="w-12 h-12 rounded-full bg-gray-800"></div>
                 <button 
                   onClick={() => handleCameraAction('handwritten')}
                   className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center active:scale-95 transition-transform"
                 >
                   <div className="w-16 h-16 bg-white rounded-full"></div>
                 </button>
                 <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white">
                   <RefreshCw size={20} />
                 </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
