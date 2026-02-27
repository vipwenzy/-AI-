export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  category: string;
  inventory: number;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: '可口可乐 330ml 罐装',
    price: 45.00,
    unit: '箱 (24)',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&q=80',
    category: '饮料',
    inventory: 1200
  },
  {
    id: '2',
    name: '百事可乐 330ml 罐装',
    price: 44.00,
    unit: '箱 (24)',
    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300&q=80',
    category: '饮料',
    inventory: 850
  },
  {
    id: '3',
    name: '乐事原味薯片',
    price: 65.00,
    unit: '盒 (12)',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&q=80',
    category: '零食',
    inventory: 500
  },
  {
    id: '4',
    name: '乐事香辣味薯片',
    price: 65.00,
    unit: '盒 (12)',
    image: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=300&q=80',
    category: '零食',
    inventory: 420
  },
  {
    id: '5',
    name: '农夫山泉矿泉水',
    price: 28.00,
    unit: '箱 (24)',
    image: 'https://images.unsplash.com/photo-1616118132534-381148898bb4?w=300&q=80',
    category: '饮料',
    inventory: 2000
  },
  {
    id: '6',
    name: '奥利奥原味饼干',
    price: 85.00,
    unit: '箱 (24)',
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=300&q=80',
    category: '零食',
    inventory: 300
  },
  {
    id: '7',
    name: '足金999转运珠手链',
    price: 1280.00,
    unit: '件',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&q=80',
    category: '足金',
    inventory: 50
  },
  {
    id: '8',
    name: '18K金莫桑钻戒指',
    price: 2599.00,
    unit: '枚',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&q=80',
    category: 'K金',
    inventory: 20
  },
  {
    id: '9',
    name: '纯铜复古香炉',
    price: 368.00,
    unit: '个',
    image: 'https://images.unsplash.com/photo-1602606394286-633e61184f4c?w=300&q=80',
    category: '铜饰品',
    inventory: 100
  },
  {
    id: '10',
    name: 'S925银镀金空托戒指',
    price: 158.00,
    unit: '枚',
    image: 'https://images.unsplash.com/photo-1603561596112-0a132b72231d?w=300&q=80',
    category: '空托',
    inventory: 200
  },
  {
    id: '11',
    name: '1克拉D色莫桑钻裸石',
    price: 899.00,
    unit: '颗',
    image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=300&q=80',
    category: '钻石',
    inventory: 50
  },
  {
    id: '12',
    name: '雪碧 330ml 罐装',
    price: 42.00,
    unit: '箱 (24)',
    image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=300&q=80',
    category: '饮料',
    inventory: 0 // Out of stock scenario
  },
  {
    id: '13',
    name: '红牛维生素功能饮料 250ml',
    price: 115.00,
    unit: '箱 (24)',
    image: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=300&q=80',
    category: '饮料',
    inventory: 5 // Low stock scenario
  },
  {
    id: '14',
    name: '怡宝纯净水 555ml',
    price: 26.00,
    unit: '箱 (24)',
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=300&q=80',
    category: '饮料',
    inventory: 800
  }
];

export interface OrderItem {
  productId: string;
  quantity: number;
  confirmed: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content?: string;
  type: 'text' | 'audio' | 'order-draft' | 'order-confirmed' | 'order-image';
  data?: any; // For order drafts etc
  timestamp: Date;
}
