import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, ChevronDown, MoreHorizontal, ArrowUpRight, Clock, CheckCircle2, Truck, AlertCircle, ChevronRight, Package, ArrowLeft, Edit2, Ban } from 'lucide-react';
import { cn } from '../lib/utils';

type OrderStatus = 'pending' | 'accepted' | 'shipped' | 'completed' | 'cancelled';

const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const styles = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    accepted: "bg-blue-50 text-blue-700 border-blue-200",
    shipped: "bg-purple-50 text-purple-700 border-purple-200",
    completed: "bg-green-50 text-green-700 border-green-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  const labels = {
    pending: "待接单",
    accepted: "已接单",
    shipped: "已发货",
    completed: "已完成",
    cancelled: "已取消",
  };

  return (
    <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium border", styles[status])}>
      {labels[status]}
    </span>
  );
};

export default function OrdersPage({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState('全部');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editItems, setEditItems] = useState<{name: string, price: number, quantity: number, unit: string, image: string}[]>([
    { name: '可口可乐 330ml 罐装', price: 45.00, quantity: 50, unit: '箱', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=100&q=80' },
    { name: '乐事原味薯片', price: 65.00, quantity: 20, unit: '盒', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=100&q=80' }
  ]);

  const orders = [
    { 
      id: 'SO-20240226-001', 
      date: '2024-02-26 10:00', 
      total: 3550.00, 
      status: 'pending', 
      items: 2,
      orderItems: [
        { name: '可口可乐 330ml 罐装', price: 45.00, quantity: 50, unit: '箱', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=100&q=80' },
        { name: '乐事原味薯片', price: 65.00, quantity: 20, unit: '盒', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=100&q=80' }
      ]
    },
    { 
      id: 'SO-20240225-001', 
      date: '2024-02-25 14:30', 
      total: 3540.00, 
      status: 'accepted', 
      items: 3,
      orderItems: [
        { name: '农夫山泉矿泉水', price: 28.00, quantity: 100, unit: '箱', image: 'https://images.unsplash.com/photo-1616118132534-381148898bb4?w=100&q=80' },
        { name: '百事可乐 330ml 罐装', price: 44.00, quantity: 10, unit: '箱', image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=100&q=80' },
        { name: '奥利奥原味饼干', price: 85.00, quantity: 5, unit: '箱', image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=100&q=80' }
      ]
    },
    { id: 'SO-20240224-089', date: '2024-02-24 09:15', total: 12800.50, status: 'shipped', items: 12, orderItems: [] },
    { id: 'SO-20240222-112', date: '2024-02-22 16:45', total: 560.00, status: 'completed', items: 2, orderItems: [] },
    { id: 'SO-20240220-055', date: '2024-02-20 11:20', total: 2100.00, status: 'cancelled', items: 5, orderItems: [] },
    { id: 'SO-20240218-033', date: '2024-02-18 10:00', total: 4500.00, status: 'completed', items: 8, orderItems: [] },
  ];

  const filteredOrders = activeTab === '全部' 
    ? orders 
    : orders.filter(o => {
        if (activeTab === '待接单') return o.status === 'pending';
        if (activeTab === '已接单') return o.status === 'accepted';
        if (activeTab === '待收货') return o.status === 'shipped';
        return true;
      });

  const updateEditQuantity = (index: number, delta: number) => {
    setEditItems(prev => {
      const newItems = [...prev];
      newItems[index].quantity = Math.max(0, newItems[index].quantity + delta);
      return newItems;
    });
  };

  const currentOrder = orders.find(o => o.id === selectedOrder);

  // Initialize edit items when order is selected
  React.useEffect(() => {
    if (currentOrder && currentOrder.orderItems) {
      setEditItems(JSON.parse(JSON.stringify(currentOrder.orderItems)));
    }
  }, [currentOrder]);

  if (selectedOrder && currentOrder) {
    const itemsToShow = isEditing ? editItems : (currentOrder.orderItems.length > 0 ? currentOrder.orderItems : [
      { name: '模拟商品 A', price: 100.00, quantity: 1, unit: '件', image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=100&q=80' }
    ]);

    const totalAmount = itemsToShow.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
      <div className="flex flex-col h-full bg-[#F5F7FA] text-gray-900 font-sans z-50 absolute inset-0">
        {/* Detail Header */}
        <div className="h-16 border-b border-gray-100 flex items-center justify-between px-5 shrink-0 bg-white sticky top-0 z-20">
          <button onClick={() => { setSelectedOrder(null); setIsEditing(false); }} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="font-bold text-lg">订单详情</h1>
          <button className="p-2 -mr-2 hover:bg-gray-50 rounded-full transition-colors">
            <MoreHorizontal size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 pb-24">
          {/* Status Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  {currentOrder.status === 'pending' ? '等待接单' : 
                   currentOrder.status === 'accepted' ? '商家已接单' :
                   currentOrder.status === 'shipped' ? '运输中' :
                   currentOrder.status === 'completed' ? '已完成' : '已取消'}
                </div>
                <div className="text-sm text-gray-500">
                  {currentOrder.status === 'pending' ? '批发商确认后将开始备货' : 
                   currentOrder.status === 'accepted' ? '正在仓库拣货打包中' :
                   currentOrder.status === 'shipped' ? '预计明天送达' :
                   currentOrder.date}
                </div>
              </div>
              <OrderStatusBadge status={currentOrder.status as OrderStatus} />
            </div>

            {/* Action Buttons based on status */}
            <div className="flex gap-3 pt-4 border-t border-gray-50">
              {currentOrder.status === 'pending' ? (
                !isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex-1 h-10 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-95 transition-all"
                  >
                    <Edit2 size={16} /> 修改订单
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="flex-1 h-10 bg-blue-600 border border-blue-600 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-200"
                  >
                    <CheckCircle2 size={16} /> 保存修改
                  </button>
                )
              ) : (
                <button disabled className="flex-1 h-10 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-400 flex items-center justify-center gap-2 cursor-not-allowed">
                  <Ban size={16} /> 无法修改
                </button>
              )}
              <button className="flex-1 h-10 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-95 transition-all">
                联系批发商
              </button>
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">订单编号</span>
              <span className="font-mono text-gray-900">{currentOrder.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">下单时间</span>
              <span className="font-mono text-gray-900">{currentOrder.date}</span>
            </div>
          </div>

          {/* Items List */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">商品清单 ({itemsToShow.length})</h3>
            <div className="space-y-4">
              {itemsToShow.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                    <img src={item.image} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{item.name}</div>
                    <div className="flex justify-between items-end">
                      <div className="text-xs text-gray-500">
                        ¥{item.price}/{item.unit}
                      </div>
                      
                      {isEditing ? (
                         <div className="flex items-center h-7 rounded-lg border border-gray-200 bg-white overflow-hidden">
                            <button 
                              onClick={() => updateEditQuantity(idx, -1)}
                              className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500"
                            >
                              -
                            </button>
                            <span className="text-sm font-mono font-medium px-2 min-w-[2rem] text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateEditQuantity(idx, 1)}
                              className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500"
                            >
                              +
                            </button>
                         </div>
                      ) : (
                        <div className="text-sm text-gray-500">x {item.quantity}</div>
                      )}
                    </div>
                    {!isEditing && (
                      <div className="text-right text-sm font-mono font-bold text-gray-900 mt-1">
                        ¥{(item.price * item.quantity).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-50 space-y-2">
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>商品总额</span>
                <span>¥{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>配送费</span>
                <span>¥0.00</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-gray-900">实付金额</span>
                <span className="font-bold text-xl text-blue-600 font-mono">¥{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F5F7FA] text-gray-900 font-sans">
      {/* Header */}
      <div className="h-16 border-b border-gray-100 flex items-center justify-between px-5 shrink-0 bg-white/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
          )}
          <h1 className="font-bold text-lg">我的订单</h1>
        </div>
        <div className="flex gap-4">
          <button className="text-gray-400 hover:text-gray-900"><Search size={20} /></button>
          <button className="text-gray-400 hover:text-gray-900"><Filter size={20} /></button>
        </div>
      </div>

      {/* Stats */}
      <div className="p-5 grid grid-cols-2 gap-3 shrink-0">
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="text-gray-500 text-xs mb-1">本月采购</div>
          <div className="text-2xl font-bold font-mono text-gray-900">¥45,280</div>
          <div className="text-green-600 text-xs flex items-center gap-1 mt-1">
            <ArrowUpRight size={10} /> +12.5%
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="text-gray-500 text-xs mb-1">待收货</div>
          <div className="text-2xl font-bold font-mono text-gray-900">3 <span className="text-sm font-normal text-gray-400">单</span></div>
          <div className="text-blue-600 text-xs flex items-center gap-1 mt-1">
            <Truck size={10} /> 运输中
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 flex gap-6 border-b border-gray-100 text-sm font-medium text-gray-400 shrink-0 bg-white sticky top-16 z-10">
        {['全部', '待接单', '已接单', '待收货'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "pb-3 transition-colors relative",
              activeTab === tab ? "text-blue-600" : "hover:text-gray-600"
            )}
          >
            {tab}
            {activeTab === tab && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* Order List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-24">
        <AnimatePresence mode="popLayout">
          {filteredOrders.map((order) => (
            <motion.div 
              layout
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => setSelectedOrder(order.id)}
              className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="font-mono text-sm font-medium text-gray-900">{order.id}</div>
                    <ChevronRight size={14} className="text-gray-400" />
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                    <Clock size={10} /> {order.date}
                  </div>
                </div>
                <OrderStatusBadge status={order.status as OrderStatus} />
              </div>
              
              <div className="flex justify-between items-end">
                <div className="text-xs text-gray-500">共 {order.items} 种商品</div>
                <div className="text-lg font-bold font-mono text-gray-900">¥{order.total.toFixed(2)}</div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-50 flex justify-end gap-2">
                <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100 transition-colors">查看详情</button>
                {order.status === 'pending' && (
                  <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white shadow-md shadow-blue-100 hover:bg-blue-700 transition-colors">修改订单</button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
