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
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400',
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
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=400',
    category: '吊坠',
    inventory: 85
  },
  {
    id: '3',
    name: '蓝宝石18K白金耳钉',
    price: 2650.00,
    unit: '对',
    units: ['对', '件'],
    image: 'https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?auto=format&fit=crop&q=80&w=400',
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
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=400',
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
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400',
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
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400',
    category: '项链',
    inventory: 300
  },
  {
    id: '7',
    name: '足金999转运珠手链',
    price: 1280.00,
    unit: '件',
    units: ['件', '条'],
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=400',
    category: '足金',
    inventory: 50
  },
  {
    id: '8',
    name: '18K金莫桑钻戒指',
    price: 2599.00,
    unit: '枚',
    units: ['枚', '件'],
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=400',
    category: 'K金',
    inventory: 20
  },
  {
    id: '9',
    name: '复古花丝耳坠',
    price: 868.00,
    unit: '对',
    units: ['对', '件'],
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=400',
    category: '耳饰',
    inventory: 100
  },
  {
    id: '10',
    name: 'S925银镀金空托戒指',
    price: 158.00,
    unit: '枚',
    units: ['枚', '件'],
    image: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?auto=format&fit=crop&q=80&w=400',
    category: '空托',
    inventory: 200
  },
  {
    id: '11',
    name: '1克拉D色莫桑钻裸石',
    price: 899.00,
    unit: '颗',
    units: ['颗', '件'],
    image: 'https://images.unsplash.com/photo-1588444839799-eb60f00f66ba?auto=format&fit=crop&q=80&w=400',
    category: '钻石',
    inventory: 50
  },
  {
    id: '12',
    name: '18K金蝴蝶结胸针',
    price: 1420.00,
    unit: '枚',
    units: ['枚', '件'],
    image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=400',
    category: '胸针',
    inventory: 0
  },
  {
    id: '13',
    name: '莫桑钻网球手链',
    price: 1115.00,
    unit: '条',
    units: ['条', '件'],
    image: 'https://images.unsplash.com/photo-1611085583191-a3b13b24424a?auto=format&fit=crop&q=80&w=400',
    category: '手链',
    inventory: 5
  },
  {
    id: '14',
    name: '18K金心形吊坠',
    price: 926.00,
    unit: '件',
    units: ['件', '个'],
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=400',
    category: '吊坠',
    inventory: 800
  },
  {
    id: '15',
    name: '18K金莫桑钻项链',
    price: 2880.00,
    unit: '条',
    units: ['条', '件'],
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400',
    category: '项链',
    inventory: 45
  },
  {
    id: '16',
    name: '铂金PT950钻石耳钉',
    price: 4500.00,
    unit: '对',
    units: ['对', '件'],
    image: 'https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?auto=format&fit=crop&q=80&w=400',
    category: '耳饰',
    inventory: 30
  },
  {
    id: '17',
    name: '翡翠玉镯',
    price: 8800.00,
    unit: '只',
    units: ['只', '件'],
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=400',
    category: '手镯',
    inventory: 15
  },
  {
    id: '18',
    name: '黄金手镯',
    price: 12500.00,
    unit: '只',
    units: ['只', '克'],
    image: 'https://images.unsplash.com/photo-1596944229580-dd3ba7539e79?auto=format&fit=crop&q=80&w=400',
    category: '足金',
    inventory: 10
  },
  {
    id: '19',
    name: '莫桑钻皇冠戒指',
    price: 3599.00,
    unit: '枚',
    units: ['枚', '件'],
    image: 'https://images.unsplash.com/photo-1603961321632-6835d300c4e9?auto=format&fit=crop&q=80&w=400',
    category: '戒指',
    inventory: 25
  },
  {
    id: '20',
    name: '银制长命锁',
    price: 388.00,
    unit: '件',
    units: ['件', '个'],
    image: 'https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?auto=format&fit=crop&q=80&w=400',
    category: '吊坠',
    inventory: 150
  },
  {
    id: '21',
    name: '18K金莫桑钻手链',
    price: 1980.00,
    unit: '条',
    units: ['条', '件'],
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=400',
    category: '手链',
    inventory: 60
  },
  {
    id: '22',
    name: '珍珠耳钉',
    price: 580.00,
    unit: '对',
    units: ['对', '件'],
    image: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&q=80&w=400',
    category: '耳饰',
    inventory: 200
  },
  {
    id: '23',
    name: '18K金莫桑钻吊坠',
    price: 1280.00,
    unit: '件',
    units: ['件', '个'],
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83ba8e8?auto=format&fit=crop&q=80&w=400',
    category: '吊坠',
    inventory: 100
  },
  {
    id: '24',
    name: '铂金PT950项链',
    price: 3200.00,
    unit: '条',
    units: ['条', '件'],
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400',
    category: '项链',
    inventory: 40
  },
  {
    id: '25',
    name: '莫桑钻六爪戒指',
    price: 1899.00,
    unit: '枚',
    units: ['枚', '件'],
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=400',
    category: '戒指',
    inventory: 35
  },
  {
    id: '26',
    name: '莫桑钻排钻戒指',
    price: 1299.00,
    unit: '枚',
    units: ['枚', '件'],
    image: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?auto=format&fit=crop&q=80&w=400',
    category: '戒指',
    inventory: 50
  },
  {
    id: '27',
    name: '18K金祖母绿吊坠',
    price: 4880.00,
    unit: '件',
    units: ['件', '个'],
    image: 'https://images.unsplash.com/photo-1615655096345-64a0ae97d1ba?auto=format&fit=crop&q=80&w=400',
    category: '吊坠',
    inventory: 12
  },
  {
    id: '28',
    name: '铂金PT950男士项链',
    price: 8500.00,
    unit: '条',
    units: ['条', '克'],
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83ba8e8?auto=format&fit=crop&q=80&w=400',
    category: '项链',
    inventory: 8
  },
  {
    id: '29',
    name: '18K金莫桑钻脚链',
    price: 1580.00,
    unit: '条',
    units: ['条', '件'],
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400',
    category: '脚链',
    inventory: 40
  },
  {
    id: '30',
    name: '足金999小金豆',
    price: 588.00,
    unit: '颗',
    units: ['颗', '克'],
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=400',
    category: '足金',
    inventory: 1000
  },
  {
    id: '31',
    name: '18K金珍珠耳线',
    price: 450.00,
    unit: '对',
    units: ['对', '件'],
    image: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&q=80&w=400',
    category: '耳饰',
    inventory: 150
  },
  {
    id: '32',
    name: '莫桑钻雪花吊坠',
    price: 699.00,
    unit: '件',
    units: ['件', '个'],
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83ba8e8?auto=format&fit=crop&q=80&w=400',
    category: '吊坠',
    inventory: 80
  },
  {
    id: '33',
    name: '18K金莫桑钻男戒',
    price: 3880.00,
    unit: '枚',
    units: ['枚', '件'],
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=400',
    category: '戒指',
    inventory: 15
  },
  {
    id: '34',
    name: 'S925银镀金手镯',
    price: 299.00,
    unit: '只',
    units: ['只', '件'],
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400',
    category: '手镯',
    inventory: 120
  },
  {
    id: '35',
    name: '18K金莫桑钻手镯',
    price: 6800.00,
    unit: '只',
    units: ['只', '件'],
    image: 'https://images.unsplash.com/photo-1596944229580-dd3ba7539e79?auto=format&fit=crop&q=80&w=400',
    category: '手镯',
    inventory: 10
  },
  {
    id: '36',
    name: '18K金红宝石耳坠',
    price: 1850.00,
    unit: '对',
    units: ['对', '件'],
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=400',
    category: '耳饰',
    inventory: 25
  },
  {
    id: '37',
    name: '铂金PT950钻石项链',
    price: 9800.00,
    unit: '条',
    units: ['条', '件'],
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400',
    category: '项链',
    inventory: 5
  },
  {
    id: '38',
    name: '18K金莫桑钻胸针',
    price: 1280.00,
    unit: '枚',
    units: ['枚', '件'],
    image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=400',
    category: '胸针',
    inventory: 30
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
