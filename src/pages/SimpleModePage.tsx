import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Send, Trash2, Plus, Minus, Sparkles, ChevronUp, ChevronDown, X, ShoppingCart, Keyboard, Check, Search, ChevronLeft, Circle, CheckCircle2, ChevronRight, History, Pin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { MOCK_PRODUCTS, Product } from '../data/mockDb';
import { cn } from '../lib/utils';

interface SimpleModePageProps {
  onSwitchMode: () => void;
}

const SUGGESTIONS = [
  "来两枚戒指 (演示模糊匹配)",
  "戒指2枚，项链3条，手链5条 (演示复杂场景)",
  "莫桑钻和珍珠项链各来5件 (演示多商品匹配)",
  "把珍珠项链改成10条 (演示修改数量)",
  "去掉红宝石手链 (演示删除商品)",
  "来10枚18K金莫桑钻戒指 (演示精确匹配)"
];

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  type: 'text' | 'voice';
  timestamp: Date;
  suggestions?: string[];
}

const CrayfishAIIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
  <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
    <span style={{ fontSize: size * 0.9 }}>🦞</span>
    <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-[8px] font-bold px-0.5 rounded leading-none flex items-center justify-center border border-white shadow-sm" style={{ transform: 'scale(0.8)' }}>
      AI
    </div>
  </div>
);

export default function SimpleModePage({ onSwitchMode }: SimpleModePageProps) {
  const { items: cartItems, updateQuantity, removeFromCart, addToCart, updateUnit, swapProduct, totalAmount } = useCart();
  const [swappingItemId, setSwappingItemId] = useState<string | null>(null);
  const swappingItem = swappingItemId ? cartItems.find(i => i.productId === swappingItemId) : null;
  const [selectedItemForMatches, setSelectedItemForMatches] = useState<any>(null);
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

  // Initialize chat history with welcome message
  useEffect(() => {
    if (chatHistory.length === 0) {
      setChatHistory([
        {
          id: 'welcome',
          role: 'ai',
          content: '快对小P说您想买的商品吧。',
          type: 'text',
          timestamp: new Date(),
          suggestions: [
            "来两枚戒指 (演示模糊匹配)",
            "戒指2枚，项链3条，手链5条 (演示复杂场景)",
            "莫桑钻和珍珠项链各来5件 (演示多商品匹配)",
            "把珍珠项链改成10条 (演示修改数量)",
            "去掉红宝石手链 (演示删除商品)",
            "来10枚18K金莫桑钻戒指 (演示精确匹配)"
          ]
        }
      ]);
    }
  }, [chatHistory.length]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isCancelZone, setIsCancelZone] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const autoCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto open AI chat when cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      setShowChatPopup(true);
    }
  }, [cartItems.length]);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isProcessing, isThinking]);
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
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    
    if (SpeechRecognition) {
      try {
        recognitionRef.current = new (SpeechRecognition as any)();
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
      } catch (err) {
        console.error('Failed to initialize speech recognition:', err);
        setSpeechError('您的浏览器不支持语音识别');
      }
    } else {
      setSpeechError('您的浏览器不支持语音识别');
    }
  }, []);

  useEffect(() => {
    if (inputType === 'text' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputType]);

  useEffect(() => {
    if (speechError) {
      const timer = setTimeout(() => {
        setSpeechError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [speechError]);

  useEffect(() => {
    if (isRecording) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (touchStartY === null) return;
        if (touchStartY - e.clientY > 100) {
          setIsCancelZone(true);
        } else {
          setIsCancelZone(false);
        }
      };

      const handleGlobalMouseUp = (e: MouseEvent) => {
        stopRecording(e as any);
      };

      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isRecording, touchStartY, isCancelZone]);

  const startRecording = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (isRecording) return;

    // Start recording
    setSpeechError(null);
    setIsRecording(true);
    setTranscript('');
    setIsCancelZone(false);
    
    // Track touch start position
    if ('touches' in e.nativeEvent) {
      setTouchStartY((e.nativeEvent as TouchEvent).touches[0].clientY);
    } else {
      setTouchStartY((e.nativeEvent as MouseEvent).clientY);
    }
    
    if (!hasMicPermission) {
      try {
        // Explicitly request microphone permission first to trigger the browser prompt
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop the tracks immediately since we only need the permission for SpeechRecognition
        stream.getTracks().forEach(track => track.stop());
        setHasMicPermission(true);
      } catch (err) {
        console.error('Microphone permission denied', err);
        setSpeechError('请在浏览器设置中允许使用麦克风，并确保已授予权限');
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

  const stopRecording = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!isRecording) return;

    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (isCancelZone) {
      // Cancelled
      setTranscript('');
      setIsCancelZone(false);
      return;
    }

    if (transcript) {
      processInput(transcript, true);
      setTranscript('');
    }
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isRecording || touchStartY === null) return;
    
    const currentY = 'touches' in e.nativeEvent 
      ? (e.nativeEvent as TouchEvent).touches[0].clientY 
      : (e.nativeEvent as MouseEvent).clientY;
    
    // If slid up more than 100px, enter cancel zone
    if (touchStartY - currentY > 100) {
      setIsCancelZone(true);
    } else {
      setIsCancelZone(false);
    }
  };

  const finishProcessing = () => {
    setIsThinking(false);
    setIsProcessing(false);
    
    // Clear any existing timeout
    if (autoCloseTimeoutRef.current) {
      clearTimeout(autoCloseTimeoutRef.current);
    }

    // Auto collapse after a delay if not pinned
    autoCloseTimeoutRef.current = setTimeout(() => {
      if (!isPinned) {
        setShowChatPopup(false);
      }
    }, 2000);
  };

  // Simple intent parser
  const processInput = (text: string, isVoice: boolean = false) => {
    setIsProcessing(true);
    setIsThinking(true);
    setShowChatPopup(true);

    // Simulate AI processing delay
    setTimeout(() => {
      setIsThinking(false);
      const isComplex = text.includes('，') || text.includes(',') || text.includes(' ');
      
      // If it's a complex multi-item input, we handle it differently
      if (isComplex && (text.includes('枚') || text.includes('条') || text.includes('对') || text.includes('件') || text.includes('颗'))) {
        const parts = text.split(/[，, ]+/);
        let actions: string[] = [];
        
        parts.forEach(part => {
          if (!part.trim()) return;
          
          let qty = 1;
          const qtyMatch = part.match(/(\d+)/);
          if (qtyMatch) qty = parseInt(qtyMatch[1], 10);
          
          // Find matches
          const cleanPart = part.replace(/\d+|枚|条|对|件|颗|来|个/g, '').trim();
          if (!cleanPart) return;
          
          const matches = MOCK_PRODUCTS.filter(p => p.name.includes(cleanPart));
          
          if (matches.length > 0) {
            const bestMatch = matches[0];
            const alternatives = matches.length > 1 ? matches.slice(1) : undefined;
            
            addToCart(bestMatch, qty, alternatives);
            actions.push(`${qty}${bestMatch.unit}${bestMatch.name}${alternatives ? '(含备选)' : ''}`);
          }
        });
        
        if (actions.length > 0) {
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
            content: `已为您添加：${actions.join('、')}。部分商品有多个匹配项，您可以在购物车中点击“更多选项”进行更换。`,
            type: 'text',
            timestamp: new Date()
          };

          setChatHistory(prev => [...prev, newUserMsg, newAiMsg]);
          finishProcessing();
          return;
        }
      }

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
      const ambiguousKeywords = ['戒指', '项链', '手链', '耳饰', '吊坠', '莫桑钻', '珍珠', '珍珠项链'];
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
        finishProcessing();
        return;
      }

      // Normal processing
      MOCK_PRODUCTS.forEach(product => {
        // Improved keyword matching
        const name = product.name.toLowerCase();
        const input = text.toLowerCase();
        
        // Match if input contains product name or product name contains input (for short keywords)
        // Or if input contains a significant part of the name
        const isMatch = input.includes(name) || 
                        (input.length >= 2 && name.includes(input)) ||
                        (name.includes('珍珠项链') && input.includes('珍珠项链')) ||
                        (name.includes('戒指') && input.includes('戒指')) ||
                        (name.includes('莫桑钻') && input.includes('莫桑钻'));

        if (isMatch) {
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
      finishProcessing();
    }, 1000);
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
    const cleanSuggestion = suggestion.split(' (')[0];
    setInputValue(cleanSuggestion);
    processInput(cleanSuggestion);
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
          <div className="h-full flex flex-col items-center justify-center px-6 text-center bg-gray-50/50">
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-gray-100">
              <ShoppingCart size={48} className="text-gray-200" />
            </div>
            <h3 className="text-lg font-bold text-gray-400 mb-2">购物车还是空的</h3>
            <p className="text-gray-300 text-xs">快对小悦说出您想买的商品吧 ✨</p>
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
                {/* Delete Button - Subtle white circle with cross */}
                <button 
                  onClick={() => removeFromCart(item.productId)}
                  className="absolute top-2 right-0 w-6 h-6 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 shadow-sm z-10 transition-all active:scale-90"
                  title="删除商品"
                >
                  <X size={14} />
                </button>

                {/* Image & More Matches */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <img src={item.product.image} alt={item.product.name} className="w-20 h-20 rounded-lg object-cover bg-gray-50 border border-gray-100" />
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
                        onClick={() => setSwappingItemId(item.productId)}
                        className="text-[10px] text-[#ff5000] border border-[#ff5000] px-2 py-0.5 rounded flex items-center gap-0.5 bg-orange-50/50 relative"
                      >
                        <span>选规格</span>
                        {/* Multiple matches badge */}
                        {(item.alternatives?.length || 0) > 0 && (
                          <div className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white">
                            {item.alternatives?.length}
                          </div>
                        )}
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
                      onClick={() => updateQuantity(item.productId, 1)}
                      className="w-8 h-full flex items-center justify-center bg-gray-300/50 text-gray-700 hover:bg-gray-300 active:bg-gray-400 transition-colors"
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
          {/* AI对话 Popup (Conversation History & Processing) - Docked version */}
          <AnimatePresence>
            {showChatPopup && (
              <>
                {/* Click-outside-to-close backdrop */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowChatPopup(false)}
                  className="fixed inset-0 z-20"
                />
                
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: 10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: 10 }}
                  className="absolute bottom-full left-0 right-0 bg-white rounded-t-2xl shadow-[0_-15px_40px_rgba(0,0,0,0.12)] border-t border-blue-50 overflow-hidden z-30 flex flex-col"
                >
                  {/* Header */}
                  <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <CrayfishAIIcon size={22} />
                    </div>
                    <span className="text-sm font-bold text-gray-800">小P 订货助手</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setChatHistory([])}
                      className="text-[10px] text-blue-600 font-medium px-2 py-1 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      新建对话
                    </button>
                    <button 
                      onClick={() => setIsPinned(!isPinned)}
                      className={cn(
                        "p-1.5 rounded-full transition-colors",
                        isPinned ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:bg-gray-100"
                      )}
                      title={isPinned ? "取消置顶" : "置顶对话"}
                    >
                      <Pin size={14} className={cn(isPinned && "fill-current")} />
                    </button>
                    <button 
                      onClick={() => setShowChatPopup(false)}
                      className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-gray-50/30 max-h-[50vh]">
                  {chatHistory.map((msg, idx) => (
                    <div key={msg.id} className={cn(
                      "flex flex-col",
                      msg.role === 'user' ? "items-end" : "items-start"
                    )}>
                      <div className={cn(
                        "px-3 py-2 rounded-2xl text-sm max-w-[85%] shadow-sm",
                        msg.role === 'user' 
                          ? "bg-blue-500 text-white rounded-tr-none" 
                          : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                      )}>
                        {msg.content}
                        
                        {msg.suggestions && (
                          <div className="mt-3 flex flex-col gap-2">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">试试这样说</p>
                            {msg.suggestions.map((s, i) => (
                              <button
                                key={i}
                                onClick={() => handleSuggestionClick(s)}
                                className="text-left px-3 py-2 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-100 transition-all flex items-center justify-between group"
                              >
                                <span>{s}</span>
                                <ChevronRight size={12} className="text-blue-300 group-hover:text-blue-500" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1 px-1">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
                  
                  {isThinking && (
                    <div className="flex flex-col items-start">
                      <div className="bg-white text-gray-800 px-3 py-2 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2">
                        <div className="flex gap-1">
                          <motion.div 
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                            className="w-1.5 h-1.5 bg-blue-400 rounded-full" 
                          />
                          <motion.div 
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                            className="w-1.5 h-1.5 bg-blue-400 rounded-full" 
                          />
                          <motion.div 
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                            className="w-1.5 h-1.5 bg-blue-400 rounded-full" 
                          />
                        </div>
                        <span className="text-xs text-gray-500 font-medium">小P 正在思考中...</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

          {/* Suggestions Popup removed as it's now integrated into AI chat */}

          {/* Input Field */}
          <div className="flex items-center gap-2">
            {/* Toggle Input Mode */}
            <button 
              onClick={() => setInputType(inputType === 'voice' ? 'text' : 'voice')}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors shrink-0"
            >
              {inputType === 'voice' ? <Keyboard size={20} /> : <Mic size={20} />}
            </button>

            <div className="flex-1 relative">
              {inputType === 'voice' ? (
                <button
                  onMouseDown={startRecording}
                  onMouseUp={stopRecording}
                  onMouseMove={handleTouchMove}
                  onTouchStart={startRecording}
                  onTouchEnd={stopRecording}
                  onTouchMove={handleTouchMove}
                  onContextMenu={(e) => e.preventDefault()}
                  className={cn(
                    "w-full h-10 rounded-full font-bold text-sm transition-all select-none touch-none",
                    isRecording ? "bg-blue-500 text-white shadow-lg scale-[1.02]" : "bg-gray-100 text-gray-800"
                  )}
                >
                  {isRecording ? "松开 结束" : "按住 说话"}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    onFocus={() => {}}
                    placeholder="输入商品名称或数量..."
                    className="flex-1 h-10 bg-gray-100 rounded-full px-4 text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                  {inputValue.trim() && (
                    <button
                      onClick={handleSend}
                      className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 active:scale-95 transition-all shrink-0"
                    >
                      <Send size={18} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* AI对话 Button */}
            <button 
              onClick={() => setShowChatPopup(!showChatPopup)}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 relative",
                showChatPopup ? "bg-blue-500 text-white shadow-lg scale-110" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              <motion.div
                animate={showChatPopup ? { rotate: [0, -10, 10, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <CrayfishAIIcon size={24} />
              </motion.div>
              {chatHistory.length > 0 && !showChatPopup && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full border border-white"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Recording Overlay */}
      <AnimatePresence>
        {isRecording && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-end bg-black/60 backdrop-blur-sm cursor-default pb-32"
          >
            <div className="flex flex-col items-center gap-6 w-full px-6">
              {/* Transcript / Listening State */}
              <div className="bg-gray-800/90 rounded-3xl p-6 flex flex-col items-center w-full max-w-sm shadow-2xl border border-white/10">
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center mb-4 relative transition-all duration-300",
                  isCancelZone ? "bg-gray-600" : "bg-blue-500"
                )}>
                  {!isCancelZone && (
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute inset-0 bg-blue-500 rounded-full opacity-30"
                    />
                  )}
                  <Mic size={32} className="text-white relative z-10" />
                </div>
                
                <p className={cn(
                  "font-medium text-center min-h-[24px] mb-2 transition-colors",
                  isCancelZone ? "text-red-400" : "text-white"
                )}>
                  {isCancelZone ? "松开取消发送" : (transcript || "正在聆听...")}
                </p>
                
                <p className="text-gray-400 text-xs mb-4">
                  {isCancelZone ? "已进入取消区域" : "上滑取消发送"}
                </p>
                
                <div className="bg-gray-700/50 rounded-xl p-3 text-center border border-gray-600/50 w-full">
                  <p className="text-gray-300 text-[10px] mb-2 flex items-center justify-center gap-1 opacity-60">
                    <Sparkles size={10} className="text-blue-400" />
                    语音指令示例
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {["来两枚戒指", "珍珠项链5条", "删掉手链"].map((s, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-600/30 rounded text-[10px] text-gray-300">
                        "{s}"
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cancel Zone - Flat Pill Shape, closer to bottom */}
              <motion.div 
                animate={{ 
                  scale: isCancelZone ? 1.05 : 1,
                  backgroundColor: isCancelZone ? "rgba(239, 68, 68, 0.9)" : "rgba(31, 41, 55, 0.8)",
                  y: isCancelZone ? -5 : 0
                }}
                className="w-full max-w-[200px] h-12 rounded-full flex items-center justify-center text-white shadow-lg border border-white/20 gap-2"
              >
                <X size={18} className={cn(isCancelZone ? "scale-110" : "")} />
                <span className="text-sm font-medium">松开 取消</span>
              </motion.div>
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
                      <img src={alt.image} className="w-12 h-12 rounded-lg object-cover bg-gray-50" />
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

      {/* Product Swap Modal */}
        <AnimatePresence>
          {swappingItem && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSwappingItemId(null)}
                className="absolute inset-0 bg-black/40 z-[60] backdrop-blur-sm"
              />
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[61] p-5 pb-6 shadow-2xl max-h-[90vh] flex flex-col"
              >
                <div className="flex justify-between items-start mb-6 shrink-0">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                      <img src={swappingItem.product.image} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{swappingItem.product.name}</h3>
                      <div className="text-xs text-gray-400 mb-2">{swappingItem.product.sku || '10001 | 1件x24盒'}</div>
                      <div className="text-[#ff5000] font-bold text-xl">
                        ¥{swappingItem.product.price}<span className="text-xs font-normal text-gray-500 ml-1">/{swappingItem.product.unit}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSwappingItemId(null)}
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
                      {(swappingItem.product.units || ['枚', '条', '对', '件', '颗']).map((u: string) => (
                        <button 
                          key={u}
                          onClick={() => updateUnit(swappingItem.productId, u)}
                          className={cn(
                            "px-6 py-2 rounded-lg text-sm font-medium transition-all border",
                            swappingItem.product.unit === u
                              ? "border-[#ff5000] text-[#ff5000] bg-white shadow-sm ring-1 ring-[#ff5000]"
                              : "border-gray-100 bg-gray-50 text-gray-600"
                          )}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Variant Selection with Quantity */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-900">默认规格</div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden h-8">
                          <button 
                            onClick={() => updateQuantity(swappingItem.productId, -1)}
                            className="w-9 h-full flex items-center justify-center text-gray-400 hover:bg-gray-200"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center text-sm font-bold text-gray-800">{swappingItem.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(swappingItem.productId, 1)}
                            className="w-9 h-full flex items-center justify-center bg-[#ff5000] text-white"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="text-[10px] text-gray-400">库存: {swappingItem.product.inventory}{swappingItem.product.unit}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 shrink-0">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-sm">总数<span className="font-bold ml-1 text-base">{swappingItem.quantity}</span></div>
                    <div className="text-sm">总金额<span className="font-bold ml-1 text-base text-[#ff5000]">¥{(swappingItem.product.price * swappingItem.quantity).toFixed(2)}</span></div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        removeFromCart(swappingItem.productId);
                        setSwappingItemId(null);
                      }}
                      className="flex-1 h-12 border border-gray-200 text-gray-600 rounded-xl font-medium text-base active:bg-gray-50 transition-colors"
                    >
                      移出购物车
                    </button>
                    <button 
                      onClick={() => setSwappingItemId(null)}
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
