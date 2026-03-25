export interface ProductSpec {
  id: string;
  name: string;
  price: number;
  inventory: number;
  sku?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  unit: string;
  units?: string[]; // Multiple units support
  unitPrices?: Record<string, number>; // Price per unit
  image: string;
  category: string;
  inventory: number;
  sku?: string;
  specs?: {
    title: string;
    options: ProductSpec[];
  }[];
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: '珍珠项链',
    price: 1880.00,
    unit: '条',
    units: ['条', '件'],
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80',
    category: '项链',
    inventory: 120
  },
  {
    id: '2',
    name: '翡翠A货平安扣吊坠',
    price: 3990.00,
    originalPrice: 4500.00,
    unit: '件',
    units: ['件', '个'],
    image: 'https://images.unsplash.com/photo-1615655096345-64a0ae97d1ba?w=400&q=80',
    category: '吊坠',
    inventory: 85
  },
  {
    id: '3',
    name: '蓝宝石18K白金耳钉',
    price: 2650.00,
    unit: '对',
    units: ['对', '件'],
    image: 'https://images.unsplash.com/photo-1635767790417-22e83b163b31?w=400&q=80',
    category: '耳饰',
    inventory: 50
  },
  {
    id: '4',
    name: '铂金PT950简约对戒',
    price: 5900.00,
    originalPrice: 6500.00,
    unit: '对',
    units: ['对', '件'],
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=400&q=80',
    category: '戒指',
    inventory: 42
  },
  {
    id: '5',
    name: '18K金红宝石手链',
    price: 3250.00,
    originalPrice: 3800.00,
    unit: '条',
    units: ['条', '件'],
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80',
    category: '手链',
    inventory: 200
  },
  {
    id: '6',
    name: '纯银S925锁骨链',
    price: 175.00,
    originalPrice: 285.00,
    unit: '条',
    units: ['条', '件'],
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80',
    category: '项链',
    inventory: 300
  },
  {
    id: '7',
    name: '足金999转运珠手链',
    price: 1280.00,
    unit: '件',
    units: ['件', '条'],
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&q=80',
    category: '足金',
    inventory: 50
  },
  {
    id: '8',
    name: '18K金莫桑钻戒指',
    price: 2599.00,
    unit: '枚',
    units: ['枚', '件'],
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80',
    category: 'K金',
    inventory: 20
  },
  {
    id: '9',
    name: '复古花丝耳坠',
    price: 868.00,
    unit: '对',
    units: ['对', '件'],
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&q=80',
    category: '耳饰',
    inventory: 100
  },
  {
    id: '10',
    name: 'S925银镀金空托戒指',
    price: 158.00,
    unit: '枚',
    units: ['枚', '件'],
    image: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=400&q=80',
    category: '空托',
    inventory: 200
  },
  {
    id: '11',
    name: '1克拉D色莫桑钻裸石',
    price: 899.00,
    unit: '颗',
    units: ['颗', '件'],
    image: 'https://images.unsplash.com/photo-1588444839799-eb60f00f66ba?w=400&q=80',
    category: '钻石',
    inventory: 50
  },
  {
    id: '12',
    name: '18K金蝴蝶结胸针',
    price: 1420.00,
    unit: '枚',
    units: ['枚', '件'],
    image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&q=80',
    category: '胸针',
    inventory: 0
  },
  {
    id: '13',
    name: '莫桑钻网球手链',
    price: 1115.00,
    unit: '条',
    units: ['条', '件'],
    image: 'https://images.unsplash.com/photo-1611085583191-a3b13b24424a?w=400&q=80',
    category: '手链',
    inventory: 5
  },
  {
    id: '14',
    name: '18K金心形吊坠',
    price: 926.00,
    unit: '件',
    units: ['件', '个'],
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=400&q=80',
    category: '吊坠',
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
  type: 'text' | 'audio' | 'order-draft' | 'order-confirmed' | 'order-image' | 'product-list' | 'order-history';
  data?: any; // For order drafts etc
  timestamp: Date;
}
