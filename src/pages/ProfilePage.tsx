import React, { useState } from 'react';
import { Settings, ChevronRight, CreditCard, MapPin, HelpCircle, LogOut, User, Shield, Bell, Wallet, FileText, Gift, MessageCircle, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import OrdersPage from './OrdersPage';

export default function ProfilePage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showOrders, setShowOrders] = useState(false);

  if (showOrders) {
    return <OrdersPage onBack={() => setShowOrders(false)} />;
  }

  return (
    <div className="flex flex-col h-full bg-[#F5F7FA] text-gray-900 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 relative shrink-0 text-white overflow-hidden pb-6">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        
        {/* Decorative Circles */}
        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-green-400/20 rounded-full blur-2xl"></div>

        <div className="flex justify-end p-5 relative z-10">
          <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors border border-white/10 active:scale-95">
            <Settings size={20} />
          </button>
        </div>

        <div className="px-6 flex items-center gap-4 relative z-10">
          <div className="w-20 h-20 rounded-full p-1 bg-white/20 backdrop-blur-sm shrink-0">
            <div className="w-full h-full rounded-full bg-white overflow-hidden border-2 border-white shadow-lg relative group cursor-pointer">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-full h-full bg-gray-50 object-cover" />
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2 mb-1">
              <span className="truncate">李老板</span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold border border-white/20 flex items-center gap-1 shrink-0 backdrop-blur-md">
                <MessageCircle size={10} fill="currentColor" /> 微信登录
              </span>
            </h1>
            <p className="text-sm text-green-50 opacity-90 truncate">幸福便利店 (天河店)</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 -mt-4">
        
        {/* Wallet / Stats Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
             <Wallet size={80} className="text-green-600" />
           </div>
           
           <div className="flex justify-between items-center mb-4">
             <h3 className="text-sm font-medium text-gray-500">预存款余额</h3>
             <button className="text-xs text-green-600 font-medium flex items-center gap-1 hover:underline">
               充值 <ChevronRight size={12} />
             </button>
           </div>
           
           <div className="text-3xl font-bold font-mono text-gray-900 mb-6 tracking-tight">
             ¥ 3,450.00
           </div>

           <div className="flex justify-between border-t border-gray-50 pt-4">
              <div className="text-center flex-1 border-r border-gray-50">
                <div className="text-lg font-bold font-mono text-gray-900">12</div>
                <div className="text-xs text-gray-500 mt-1">本月订单</div>
              </div>
              <div className="text-center flex-1 border-r border-gray-50">
                <div className="text-lg font-bold font-mono text-gray-900">8</div>
                <div className="text-xs text-gray-500 mt-1">常购商品</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-lg font-bold font-mono text-gray-900">2</div>
                <div className="text-xs text-gray-500 mt-1">优惠券</div>
              </div>
           </div>
        </div>

        {/* Menu Groups */}
        <div className="space-y-3">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">我的店铺</h3>
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <MenuItem 
              icon={<ShoppingBag size={20} />} 
              label="我的订单" 
              value="3个待收货" 
              onClick={() => setShowOrders(true)}
            />
            <MenuItem icon={<MapPin size={20} />} label="收货地址" value="2个" />
            <MenuItem icon={<FileText size={20} />} label="采购记录" />
            <MenuItem icon={<Gift size={20} />} label="我的优惠券" value="2张可用" />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">服务与设置</h3>
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <MenuItem icon={<User size={20} />} label="联系供应商" />
            <div className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group cursor-pointer" onClick={() => setNotificationsEnabled(!notificationsEnabled)}>
              <div className="flex items-center gap-4">
                <div className="text-gray-400 group-hover:text-green-600 transition-colors"><Bell size={20} /></div>
                <span className="text-sm text-gray-700 group-hover:text-gray-900">订单通知</span>
              </div>
              <div className={cn("w-10 h-6 rounded-full p-1 transition-colors duration-300", notificationsEnabled ? "bg-green-600" : "bg-gray-200")}>
                <div className={cn("w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300", notificationsEnabled ? "translate-x-4" : "translate-x-0")}></div>
              </div>
            </div>
            <MenuItem icon={<HelpCircle size={20} />} label="使用帮助" />
          </div>
        </div>

        <button className="w-full py-4 rounded-2xl bg-gray-100 text-gray-500 font-medium border border-gray-200 flex items-center justify-center gap-2 mt-4 hover:bg-gray-200 transition-colors active:scale-[0.98]">
          <LogOut size={18} /> 切换账号
        </button>
        
        <div className="text-center text-xs text-gray-400 py-4">
          Kuaipi AI ERP v2.4.0 (Build 20240225)
        </div>
      </div>
    </div>
  );
}

function MenuItem({ icon, label, value, onClick }: { icon: React.ReactNode, label: string, value?: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group active:bg-gray-100">
      <div className="flex items-center gap-4">
        <div className="text-gray-400 group-hover:text-green-600 transition-colors">{icon}</div>
        <span className="text-sm text-gray-700 group-hover:text-gray-900">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-xs text-gray-400">{value}</span>}
        <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500" />
      </div>
    </button>
  );
}
