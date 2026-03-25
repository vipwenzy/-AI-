import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Send, Trash2, Plus, Minus, Sparkles, ChevronUp, X, ShoppingCart, Keyboard, Check, Search, ChevronLeft, Circle, CheckCircle2, ChevronRight, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { MOCK_PRODUCTS, Product } from '../data/mockDb';
import { cn } from '../lib/utils';

interface SimpleModePageProps {
  onSwitchMode: () => void;
}

const SUGGESTIONS = [
  "来10箱可口可乐",
  "来两箱可乐",
  "把农夫山泉改成5箱",
  "去掉百事可乐",
  "奥利奥和雪碧各来5箱"
];

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  type: 'text' | 'voice';
  timestamp: Date;
}

export default function SimpleModePage({ onSwitchMode }: SimpleModePageProps) {
  const { items: cartItems, updateQuantity, removeFromCart, addToCart, totalAmount } = useCart();
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputType, setInputType] = useState<'text' | 'voice'>('voice');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [hasMicPermission, setHasMicPermission] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'express' | 'pickup'>('express');
  const [message, setMessage] = useState('');
  const [sortBy, setSortBy] = useState<'time' | 'price' | 'name'>('time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [ambiguousMatches, setAmbiguousMatches] = useState<Product[] | null>(null);
  const [pendingAction, setPendingAction] = useState<{qty: number, isRemove: boolean, isModify: boolean} | null>(null);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sortedCartItems = [...cartItems];
  
  if (sortBy === 'time') {
    if (sortOrder === 'desc') {
      sortedCartItems.reverse();
    }
  } else {
    sortedCartItems.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'price') {
        comparison = a.product.price - b.product.price;
      } else if (sortBy === 'name') {
        comparison = a.product.name.localeCompare(b.product.name, 'zh-CN');
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'zh-CN';

      recognitionRef.current.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('请允许使用麦克风以进行语音输入');
        } else {
          setSpeechError('语音识别出错，请重试');
        }
        setIsRecording(false);
      };
    } else {
      setSpeechError('您的浏览器不支持语音识别');
    }
  }, []);

  useEffect(() => {
    if (speechError) {
      const timer = setTimeout(() => {
        setSpeechError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [speechError]);

  const toggleRecording = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (transcript) {
        processInput(transcript, true);
        setTranscript('');
      }
      return;
    }

    // Start recording
    setSpeechError(null);
    setIsRecording(true);
    setTranscript('');
    
    if (!hasMicPermission) {
      try {
        // Explicitly request microphone permission first to trigger the browser prompt
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop the tracks immediately since we only need the permission for SpeechRecognition
        stream.getTracks().forEach(track => track.stop());
        setHasMicPermission(true);
      } catch (err) {
        console.error('Microphone permission denied', err);
        setSpeechError('请允许使用麦克风以进行语音输入');
        setIsRecording(false);
        return;
      }
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {}
    }
  };

  // Simple intent parser
  const processInput = (text: string, isVoice: boolean = false) => {
    const isRemove = /去掉|不要|删除|取消|减/.test(text);
    const isModify = /改成|修改为|变成/.test(text);
    
    let actions: string[] = [];
    let ambiguousGroup: Product[] = [];
    
    // Extract quantity
    let qty = 1;
    const match = text.match(/(\d+)/);
    if (match && match[1]) qty = parseInt(match[1], 10);
    else if (text.includes('各来5') || text.includes('各加5')) qty = 5;
    else if (text.includes('各来10') || text.includes('各加10')) qty = 10;
    else if (text.includes('两') || text.includes('二')) qty = 2;

    // Check for ambiguous keywords first
    const ambiguousKeywords = ['可乐', '乐事', '矿泉水', '薯片', '戒指', '莫桑钻', '水'];
    let foundAmbiguous = false;
    
    for (const kw of ambiguousKeywords) {
      if (text.includes(kw)) {
        // Check if it contains a more specific name
        const specificMatch = MOCK_PRODUCTS.find(p => p.name.includes(kw) && text.includes(p.name.split(' ')[0]));
        if (!specificMatch) {
          ambiguousGroup = MOCK_PRODUCTS.filter(p => p.name.includes(kw));
          if (ambiguousGroup.length > 1) {
            foundAmbiguous = true;
            break;
          }
        }
      }
    }

    if (foundAmbiguous) {
      setAmbiguousMatches(ambiguousGroup);
      setPendingAction({ qty, isRemove, isModify });
      
      const newUserMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: text,
        type: isVoice ? 'voice' : 'text',
        timestamp: new Date()
      };

      const newAiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: `找到多个包含该名称的商品，请选择您需要哪一个？`,
        type: 'text',
        timestamp: new Date()
      };

      setChatHistory(prev => [...prev, newUserMsg, newAiMsg]);
      return;
    }

    // Normal processing
    MOCK_PRODUCTS.forEach(product => {
      // Very basic keyword matching
      const keyword = product.name.replace(/ /g, '').slice(0, 4); // basic matching
      const shortName = product.name.split(' ')[0];
      if (text.includes(keyword) || text.includes(shortName)) {
        if (isRemove) {
          removeFromCart(product.id);
          actions.push(`已为您移除 ${product.name}`);
        } else {
          if (isModify) {
            const item = cartItems.find(i => i.productId === product.id);
            if (item) {
              updateQuantity(product.id, qty - item.quantity);
              actions.push(`已将 ${product.name} 数量修改为 ${qty}`);
            } else {
              addToCart(product, qty);
              actions.push(`已为您添加 ${qty}件 ${product.name}`);
            }
          } else {
            addToCart(product, qty);
            actions.push(`已为您添加 ${qty}件 ${product.name}`);
          }
        }
      }
    });

    let aiResponse = actions.length > 0 ? actions.join('，') + '。' : '抱歉，我没有听清您需要的商品，请再说一遍。';

    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      type: isVoice ? 'voice' : 'text',
      timestamp: new Date()
    };

    const newAiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      content: aiResponse,
      type: 'text',
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, newUserMsg, newAiMsg]);
  };

  const handleAmbiguousSelection = (product: Product) => {
    if (!pendingAction) return;
    
    const { qty, isRemove, isModify } = pendingAction;
    let actionText = '';

    if (isRemove) {
      removeFromCart(product.id);
      actionText = `已为您移除 ${product.name}`;
    } else if (isModify) {
      const item = cartItems.find(i => i.productId === product.id);
      if (item) {
        updateQuantity(product.id, qty - item.quantity);
        actionText = `已将 ${product.name} 数量修改为 ${qty}`;
      } else {
        addToCart(product, qty);
        actionText = `已为您添加 ${qty}件 ${product.name}`;
      }
    } else {
      addToCart(product, qty);
      actionText = `已为您添加 ${qty}件 ${product.name}`;
    }

    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: `选择了: ${product.name}`,
      type: 'text',
      timestamp: new Date()
    };

    const newAiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      content: actionText,
      type: 'text',
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, newUserMsg, newAiMsg]);
    setAmbiguousMatches(null);
    setPendingAction(null);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    processInput(inputValue);
    setInputValue('');
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    processInput(suggestion);
    setInputValue('');
    setShowSuggestions(false);
  };

  if (showCheckout) {
    return (
      <div className="flex flex-col h-full bg-[#f5f5f9] relative">
        {/* Header */}
        <div className="h-14 bg-white border-b border-gray-100 flex items-center px-4 shrink-0 z-10">
          <button onClick={() => setShowCheckout(false)} className="p-2 -ml-2 text-gray-800">
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1 text-center font-bold text-gray-800 text-lg pr-6">
            提交订单
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-32">
          {/* User Info */}
          <div className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
            <span className="text-gray-800 text-sm">立即完善个人信息</span>
            <ChevronRight size={16} className="text-gray-400" />
          </div>

          {/* Delivery Method */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-800 mb-4">选择送货方式</div>
            <div className="flex items-center gap-12">
              <button 
                onClick={() => setDeliveryMethod('express')}
                className="flex items-center gap-2"
              >
                {deliveryMethod === 'express' ? (
                  <CheckCircle2 size={20} className="text-[#ff5000] fill-[#ff5000] text-white" />
                ) : (
                  <Circle size={20} className="text-gray-300" />
                )}
                <span className="text-sm text-gray-800">快递/物流</span>
              </button>
              <button 
                onClick={() => setDeliveryMethod('pickup')}
                className="flex items-center gap-2"
              >
                {deliveryMethod === 'pickup' ? (
                  <CheckCircle2 size={20} className="text-[#ff5000] fill-[#ff5000] text-white" />
                ) : (
                  <Circle size={20} className="text-gray-300" />
                )}
                <span className="text-sm text-gray-800">自提</span>
              </button>
            </div>
          </div>

          {/* Amount Summary */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-800">订单金额</span>
              <span className="text-[#ff5000] font-medium text-lg">¥{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-800">合计金额</span>
              <span className="text-[#ff5000] font-medium text-lg">¥{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Message */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-800 mb-3">留言</div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="请输入留言"
              className="w-full bg-gray-50 rounded-lg p-3 text-sm resize-none h-24 focus:outline-none focus:ring-1 focus:ring-gray-200"
            />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#f5f5f9] p-4 pb-8">
          <button 
            onClick={() => {
              alert('订单提交成功！');
              cartItems.forEach(item => removeFromCart(item.productId));
              setShowCheckout(false);
            }}
            className="w-full bg-[#ff5000] text-white py-3 rounded-full font-medium text-lg hover:bg-[#e64800] active:bg-[#cc4000] shadow-md"
          >
            提交
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#f5f5f9] relative">
      {/* Header */}
      <div className="h-14 bg-[#f5f5f9] border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-10">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-800 text-lg">购物车</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm text-gray-600 flex items-center gap-1">
            <Search size={16} /> 搜索
          </button>
          <button 
            onClick={() => cartItems.forEach(item => removeFromCart(item.productId))}
            className="text-sm text-blue-600"
          >
            清空
          </button>
          <button 
            onClick={onSwitchMode}
            className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-colors ml-2"
          >
            高级模式
          </button>
        </div>
      </div>

      {/* Cart Area (Always visible) */}
      <div className="flex-1 overflow-y-auto p-4 pb-40">
        {cartItems.length > 0 && (
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-sm text-gray-500">共 {cartItems.length} 件商品</span>
            <div className="flex items-center gap-3 text-sm">
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
        )}

        {cartItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center px-6 text-center">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Mic size={48} className="text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">欢迎使用语音订货</h3>
            <p className="text-gray-500 mb-8 text-sm">点击下方麦克风，直接说出您需要的商品</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-3 shadow-sm">
            {sortedCartItems.map((item, index) => (
              <motion.div 
                key={item.productId}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn(
                  "flex items-center gap-3 py-4 border-b border-gray-100 relative",
                  index === cartItems.length - 1 ? "border-0 pb-2" : ""
                )}
              >
                {/* Delete Button */}
                <button 
                  onClick={() => removeFromCart(item.productId)}
                  className="absolute top-2 right-0 w-5 h-5 rounded-full flex items-center justify-center bg-[#ff5000] text-white active:scale-90 transition-transform z-10 shadow-sm"
                >
                  <X size={10} strokeWidth={4} />
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
                        onClick={() => updateQuantity(item.productId, 1)}
                        className="w-7 h-6 flex items-center justify-center bg-[#ff5000] text-white hover:bg-[#e64800] active:bg-[#cc4000]"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            <div className="text-center text-xs text-gray-400 mt-4 mb-2 flex items-center justify-center gap-2">
              <div className="h-px bg-gray-200 w-12"></div>
              已经到底啦
              <div className="h-px bg-gray-200 w-12"></div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-0 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
        
        {/* Order Summary Bar */}
        {cartItems.length > 0 && (
          <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 font-medium">共 {cartItems.length} 件商品</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <div className="text-sm">
                  总额: <span className="font-bold text-lg text-[#ff5000]">{totalAmount.toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowCheckout(true);
                }}
                className="bg-[#ff5000] text-white px-8 py-2 rounded-full font-bold text-base hover:bg-[#e64800] active:bg-[#cc4000] shadow-md"
              >
                下单
              </button>
            </div>
          </div>
        )}

        {/* Input Field Area */}
        <div className="px-4 py-3 bg-white relative">
          {/* Suggestions Popup */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <div className="p-2 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-blue-700 flex items-center gap-1">
                    <Sparkles size={12} /> 试试这样说
                  </span>
                  <button onClick={() => setShowSuggestions(false)} className="text-blue-400 hover:text-blue-600">
                    <X size={14} />
                  </button>
                </div>
                <div className="p-2 flex flex-col gap-1">
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(s)}
                      className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      "{s}"
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Field */}
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <button
                onClick={toggleRecording}
                onContextMenu={(e) => e.preventDefault()}
                className={cn(
                  "w-full h-10 rounded-full font-bold text-sm transition-all select-none",
                  isRecording ? "bg-gray-300 text-gray-800 shadow-inner" : "bg-gray-100 text-gray-800"
                )}
              >
                {isRecording ? "点击 结束" : "点击 说话"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recording Overlay */}
      <AnimatePresence>
        {isRecording && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm cursor-pointer"
            onClick={toggleRecording}
          >
            <div className="bg-gray-800/90 rounded-3xl p-6 flex flex-col items-center max-w-[80%]">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 relative hover:bg-blue-600 transition-colors">
                <motion.div 
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 bg-blue-500 rounded-full opacity-30"
                />
                <Mic size={32} className="text-white relative z-10" />
              </div>
              <p className="text-white font-medium text-center min-h-[24px] mb-2">
                {transcript || "正在聆听..."}
              </p>
              <p className="text-gray-400 text-xs mb-6">点击任意处结束</p>
              
              <div className="bg-gray-700/50 rounded-xl p-3 text-center border border-gray-600/50 w-full max-w-xs">
                <p className="text-gray-300 text-xs mb-3 flex items-center justify-center gap-1">
                  <Sparkles size={12} className="text-blue-400" />
                  试试这样说 (点击测试)
                </p>
                <div className="space-y-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsRecording(false);
                      if (recognitionRef.current) recognitionRef.current.stop();
                      processInput("来两箱可乐", true);
                    }}
                    className="w-full bg-gray-600/50 hover:bg-gray-500/50 transition-colors rounded-lg p-2.5 text-white text-sm font-medium"
                  >
                    "来两箱可乐"
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsRecording(false);
                      if (recognitionRef.current) recognitionRef.current.stop();
                      processInput("来10箱可口可乐", true);
                    }}
                    className="w-full bg-gray-600/50 hover:bg-gray-500/50 transition-colors rounded-lg p-2.5 text-white text-sm font-medium"
                  >
                    "来10箱可口可乐"
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsRecording(false);
                      if (recognitionRef.current) recognitionRef.current.stop();
                      processInput("把农夫山泉改成5箱", true);
                    }}
                    className="w-full bg-gray-600/50 hover:bg-gray-500/50 transition-colors rounded-lg p-2.5 text-white text-sm font-medium"
                  >
                    "把农夫山泉改成5箱"
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Toast */}
      <AnimatePresence>
        {speechError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium z-50 flex items-center gap-2"
          >
            <span>{speechError}</span>
            <button onClick={() => setSpeechError(null)} className="opacity-80 hover:opacity-100">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambiguous Match Modal */}
      <AnimatePresence>
        {ambiguousMatches && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setAmbiguousMatches(null);
                setPendingAction(null);
              }}
              className="absolute inset-0 bg-black/40 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="absolute top-1/2 left-4 right-4 -translate-y-1/2 bg-white rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[70vh]"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <h3 className="font-bold text-gray-800">请选择具体商品</h3>
                <button 
                  onClick={() => {
                    setAmbiguousMatches(null);
                    setPendingAction(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="overflow-y-auto p-2">
                {ambiguousMatches.map(product => (
                  <button
                    key={product.id}
                    onClick={() => handleAmbiguousSelection(product)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-colors text-left border-b border-gray-50 last:border-0"
                  >
                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-800 truncate">{product.name}</div>
                      <div className="text-sm text-[#ff5000] font-bold mt-0.5">¥{product.price.toFixed(2)}</div>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 shrink-0" />
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Chat History Drawer */}
      <AnimatePresence>
        {showChatHistory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowChatHistory(false)}
              className="absolute inset-0 bg-black/40 z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 h-[70%] bg-gray-50 rounded-t-3xl z-50 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 bg-white rounded-t-3xl border-b border-gray-100 shrink-0">
                <h3 className="font-bold text-gray-800 text-lg">聊天历史</h3>
                <button 
                  onClick={() => setShowChatHistory(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div 
                className="flex-1 overflow-y-auto p-4 space-y-4"
                ref={(el) => {
                  if (el) {
                    el.scrollTop = el.scrollHeight;
                  }
                }}
              >
                {chatHistory.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <MessageSquare size={48} className="mb-4 opacity-20" />
                    <p>暂无聊天记录</p>
                  </div>
                ) : (
                  chatHistory.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={cn(
                        "flex w-full",
                        msg.role === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      <div 
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                          msg.role === 'user' 
                            ? "bg-blue-500 text-white rounded-tr-sm" 
                            : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-sm"
                        )}
                      >
                        {msg.role === 'user' && msg.type === 'voice' && (
                          <div className="flex items-center gap-1 mb-1 opacity-80 text-xs">
                            <Mic size={12} /> 语音输入
                          </div>
                        )}
                        <p className="leading-relaxed">{msg.content}</p>
                        <div 
                          className={cn(
                            "text-[10px] mt-1 text-right",
                            msg.role === 'user' ? "text-blue-100" : "text-gray-400"
                          )}
                        >
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
