import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { MessageCircle, Store, ShoppingCart, User, Sparkles } from 'lucide-react';
import ShopPage from '../pages/ShopPage';
import ChatPage from '../pages/ChatPage';
import ProfilePage from '../pages/ProfilePage';
import SimpleModePage from '../pages/SimpleModePage';
import { CartProvider, useCart } from '../context/CartContext';

interface LayoutProps {
  children?: React.ReactNode;
}

const CartBadge = () => {
  const { totalItems } = useCart();
  if (totalItems === 0) return null;
  return (
    <div className="absolute -top-1 -left-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
      {totalItems > 99 ? '99+' : totalItems}
    </div>
  );
};

export function MobileLayout({ children }: LayoutProps) {
  const [activeTab, setActiveTab] = useState<string>('chat'); // Default to chat tab
  const [isSimpleMode, setIsSimpleMode] = useState<boolean>(true); // Default to simple mode

  const currentTab = activeTab.split(':')[0];

  return (
    <CartProvider>
      <div className="min-h-screen bg-[#F2F4F7] flex items-center justify-center p-0 sm:p-8 font-sans selection:bg-blue-100">
        <div className="w-full h-full sm:h-[844px] sm:w-[390px] bg-white sm:rounded-[44px] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col relative border-[8px] border-white ring-1 ring-gray-200">
          {/* Status Bar Simulation - Light Mode */}
          <div className="h-12 bg-white flex justify-between items-end px-7 pb-2 text-[15px] font-semibold z-50 select-none text-black shrink-0">
            <span>9:41</span>
            <div className="flex gap-1.5 items-center">
              <div className="h-3 w-4 bg-black rounded-[1px] relative overflow-hidden">
                 <div className="absolute inset-0 bg-white ml-[1px] mt-[1px] mb-[1px] mr-[4px]"></div>
                 <div className="absolute inset-0 bg-black ml-[2px] mt-[2px] mb-[2px] mr-[5px]"></div>
              </div>
              <div className="w-4 h-4 bg-transparent rounded-full opacity-0"></div> {/* Spacer */}
              <div className="flex gap-[2px] items-end h-3">
                  <div className="w-[3px] h-[40%] bg-black rounded-sm"></div>
                  <div className="w-[3px] h-[60%] bg-black rounded-sm"></div>
                  <div className="w-[3px] h-[80%] bg-black rounded-sm"></div>
                  <div className="w-[3px] h-[100%] bg-black rounded-sm"></div>
              </div>
               <div className="w-6 h-3 border border-black/30 rounded-[4px] relative ml-1">
                  <div className="absolute inset-0.5 bg-black rounded-[1px] w-[80%]"></div>
               </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden relative bg-white flex flex-col">
            {currentTab === 'shop' && <ShopPage />}
            {currentTab === 'chat' && (
              isSimpleMode ? (
                <SimpleModePage onSwitchMode={() => setIsSimpleMode(false)} />
              ) : (
                <ChatPage onNavigate={setActiveTab} onSwitchMode={() => setIsSimpleMode(true)} />
              )
            )}
            {currentTab === 'profile' && <ProfilePage initialRoute={activeTab.split(':').slice(1).join(':')} />}
          </div>

          {/* Bottom Navigation - Glassmorphism Light */}
          <div className="h-[88px] bg-white/90 backdrop-blur-xl border-t border-gray-100 flex justify-around items-start pt-4 px-2 z-50 pb-8 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
            <NavItem 
              icon={<Store size={24} strokeWidth={2.5} />} 
              label="店铺" 
              active={currentTab === 'shop'} 
              onClick={() => setActiveTab('shop')}
            />
            <NavItem 
              icon={
                <div className="relative">
                  <ShoppingCart size={24} strokeWidth={2.5} />
                  <div className="absolute -top-2 -right-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[9px] font-bold px-1 py-0.5 rounded-full border border-white shadow-sm flex items-center">
                    <Sparkles size={8} className="mr-0.5" /> AI
                  </div>
                </div>
              } 
              label="购物车" 
              active={currentTab === 'chat'} 
              onClick={() => setActiveTab('chat')}
              badge={<CartBadge />}
            />
            <NavItem 
              icon={<User size={24} strokeWidth={2.5} />} 
              label="我的" 
              active={currentTab === 'profile'} 
              onClick={() => setActiveTab('profile')}
            />
          </div>
          
          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-36 h-1.5 bg-black/20 rounded-full z-50 pointer-events-none backdrop-blur-md"></div>
        </div>
      </div>
    </CartProvider>
  );
}

function NavItem({ icon, label, active, onClick, badge }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void, badge?: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 w-16 active:scale-90 transition-transform group relative"
    >
      <div className={cn(
        "transition-all duration-300 relative p-1", 
        active ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
      )}>
        {icon}
        {active && (
          <div className="absolute inset-0 bg-blue-100 blur-lg rounded-full opacity-50"></div>
        )}
        {badge}
      </div>
      <span className={cn(
        "text-[10px] font-medium transition-colors",
        active ? "text-blue-600" : "text-gray-400"
      )}>
        {label}
      </span>
    </button>
  );
}
