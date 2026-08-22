export type PaymentStatus = 'Paid' | 'Pending' | 'Overdue';
export type FulfillmentStatus = 'Ready' | 'Processing' | 'Completed';
export type ProductStatus = 'In stock' | 'Low stock' | 'Out of stock';

export type Customer = {
  id: string;
  name: string;
  initials: string;
  phone: string;
  email: string;
  city: string;
  pets: number;
  totalSpent: number;
  lastVisit: string;
  status: 'Active' | 'Needs follow-up';
};

export type Pet = {
  id: string;
  name: string;
  species: 'Dog' | 'Cat' | 'Rabbit';
  breed: string;
  age: string;
  customerId: string;
  customerName: string;
  color: string;
  lastVisit: string;
  careNote: string;
};

export type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  customerId: string;
  customerName: string;
  petName: string;
  date: string;
  items: OrderItem[];
  total: number;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
};

export type Product = {
  id: string;
  name: string;
  category: 'Food' | 'Care' | 'Wellness' | 'Accessories';
  price: number;
  stock: number;
  reorderLevel: number;
  status: ProductStatus;
  sku: string;
};

export type RevenuePoint = {
  label: string;
  revenue: number;
  orders: number;
};

export const customers: Customer[] = [
  {
    id: 'cus-001',
    name: 'Linh Nguyen',
    initials: 'LN',
    phone: '090 442 8120',
    email: 'linh.nguyen@example.com',
    city: 'District 3, HCMC',
    pets: 2,
    totalSpent: 12840000,
    lastVisit: '2026-08-20',
    status: 'Active',
  },
  {
    id: 'cus-002',
    name: 'Minh Tran',
    initials: 'MT',
    phone: '091 218 4306',
    email: 'minh.tran@example.com',
    city: 'Thu Duc, HCMC',
    pets: 1,
    totalSpent: 7640000,
    lastVisit: '2026-08-18',
    status: 'Active',
  },
  {
    id: 'cus-003',
    name: 'An Pham',
    initials: 'AP',
    phone: '093 508 2271',
    email: 'an.pham@example.com',
    city: 'Ba Dinh, Hanoi',
    pets: 3,
    totalSpent: 22350000,
    lastVisit: '2026-08-14',
    status: 'Active',
  },
  {
    id: 'cus-004',
    name: 'Thao Le',
    initials: 'TL',
    phone: '098 621 7518',
    email: 'thao.le@example.com',
    city: 'Hai Chau, Da Nang',
    pets: 1,
    totalSpent: 4890000,
    lastVisit: '2026-08-08',
    status: 'Needs follow-up',
  },
  {
    id: 'cus-005',
    name: 'Khoa Vo',
    initials: 'KV',
    phone: '097 311 6402',
    email: 'khoa.vo@example.com',
    city: 'District 7, HCMC',
    pets: 1,
    totalSpent: 6420000,
    lastVisit: '2026-08-02',
    status: 'Active',
  },
  {
    id: 'cus-006',
    name: 'Mai Hoang',
    initials: 'MH',
    phone: '086 930 1144',
    email: 'mai.hoang@example.com',
    city: 'Cau Giay, Hanoi',
    pets: 1,
    totalSpent: 3170000,
    lastVisit: '2026-07-27',
    status: 'Needs follow-up',
  },
];

export const pets: Pet[] = [
  {
    id: 'pet-001',
    name: 'Milo',
    species: 'Dog',
    breed: 'Corgi',
    age: '3 years',
    customerId: 'cus-001',
    customerName: 'Linh Nguyen',
    color: '#f4b183',
    lastVisit: '2026-08-20',
    careNote: 'Sensitive stomach. Prefers salmon-based food.',
  },
  {
    id: 'pet-002',
    name: 'Mochi',
    species: 'Cat',
    breed: 'British Shorthair',
    age: '2 years',
    customerId: 'cus-001',
    customerName: 'Linh Nguyen',
    color: '#d8c7b8',
    lastVisit: '2026-08-16',
    careNote: 'Due for a coat care check next month.',
  },
  {
    id: 'pet-003',
    name: 'Bơ',
    species: 'Dog',
    breed: 'Poodle',
    age: '5 years',
    customerId: 'cus-002',
    customerName: 'Minh Tran',
    color: '#dba87c',
    lastVisit: '2026-08-18',
    careNote: 'Regular dental chew customer.',
  },
  {
    id: 'pet-004',
    name: 'Nori',
    species: 'Cat',
    breed: 'Domestic shorthair',
    age: '1 year',
    customerId: 'cus-003',
    customerName: 'An Pham',
    color: '#8bb7a4',
    lastVisit: '2026-08-14',
    careNote: 'Indoor cat. Keep flea care monthly.',
  },
  {
    id: 'pet-005',
    name: 'Taro',
    species: 'Rabbit',
    breed: 'Mini Lop',
    age: '4 years',
    customerId: 'cus-003',
    customerName: 'An Pham',
    color: '#b4a0d8',
    lastVisit: '2026-08-11',
    careNote: 'Hay-first diet. Nail trim every 6 weeks.',
  },
  {
    id: 'pet-006',
    name: 'Poppy',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: '7 years',
    customerId: 'cus-003',
    customerName: 'An Pham',
    color: '#e8c06f',
    lastVisit: '2026-08-09',
    careNote: 'Senior joint support recommended.',
  },
  {
    id: 'pet-007',
    name: 'Biscuit',
    species: 'Dog',
    breed: 'Shiba Inu',
    age: '4 years',
    customerId: 'cus-004',
    customerName: 'Thao Le',
    color: '#d78355',
    lastVisit: '2026-08-08',
    careNote: 'Grooming appointment completed.',
  },
  {
    id: 'pet-008',
    name: 'Luna',
    species: 'Cat',
    breed: 'Ragdoll',
    age: '3 years',
    customerId: 'cus-005',
    customerName: 'Khoa Vo',
    color: '#91abc9',
    lastVisit: '2026-08-02',
    careNote: 'Prefers quiet handling and wet food.',
  },
];

export const orders: Order[] = [
  {
    id: 'PW-2048',
    customerId: 'cus-001',
    customerName: 'Linh Nguyen',
    petName: 'Milo',
    date: '2026-08-22',
    items: [{ name: 'Salmon sensitive care food', quantity: 1, price: 485000 }],
    total: 485000,
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Ready',
  },
  {
    id: 'PW-2047',
    customerId: 'cus-003',
    customerName: 'An Pham',
    petName: 'Nori',
    date: '2026-08-22',
    items: [
      { name: 'Monthly flea care', quantity: 2, price: 285000 },
      { name: 'Cotton rope toy', quantity: 1, price: 120000 },
    ],
    total: 690000,
    paymentStatus: 'Pending',
    fulfillmentStatus: 'Processing',
  },
  {
    id: 'PW-2046',
    customerId: 'cus-002',
    customerName: 'Minh Tran',
    petName: 'Bơ',
    date: '2026-08-21',
    items: [{ name: 'Dental care chews', quantity: 2, price: 175000 }],
    total: 350000,
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Completed',
  },
  {
    id: 'PW-2045',
    customerId: 'cus-005',
    customerName: 'Khoa Vo',
    petName: 'Luna',
    date: '2026-08-20',
    items: [
      { name: 'Indoor cat food', quantity: 1, price: 390000 },
      { name: 'Soft grooming brush', quantity: 1, price: 198000 },
    ],
    total: 588000,
    paymentStatus: 'Overdue',
    fulfillmentStatus: 'Ready',
  },
  {
    id: 'PW-2044',
    customerId: 'cus-004',
    customerName: 'Thao Le',
    petName: 'Biscuit',
    date: '2026-08-19',
    items: [{ name: 'Full grooming care', quantity: 1, price: 520000 }],
    total: 520000,
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Completed',
  },
  {
    id: 'PW-2043',
    customerId: 'cus-006',
    customerName: 'Mai Hoang',
    petName: 'Kiki',
    date: '2026-08-18',
    items: [{ name: 'Puppy starter bundle', quantity: 1, price: 890000 }],
    total: 890000,
    paymentStatus: 'Pending',
    fulfillmentStatus: 'Processing',
  },
  {
    id: 'PW-2042',
    customerId: 'cus-001',
    customerName: 'Linh Nguyen',
    petName: 'Mochi',
    date: '2026-08-17',
    items: [{ name: 'Coat care set', quantity: 1, price: 310000 }],
    total: 310000,
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Completed',
  },
  {
    id: 'PW-2041',
    customerId: 'cus-003',
    customerName: 'An Pham',
    petName: 'Taro',
    date: '2026-08-16',
    items: [{ name: 'Timothy hay premium', quantity: 2, price: 225000 }],
    total: 450000,
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Completed',
  },
];

export const products: Product[] = [
  {
    id: 'prd-001',
    name: 'Salmon sensitive care food',
    category: 'Food',
    price: 485000,
    stock: 7,
    reorderLevel: 8,
    status: 'Low stock',
    sku: 'FOOD-SAL-01',
  },
  {
    id: 'prd-002',
    name: 'Indoor cat food',
    category: 'Food',
    price: 390000,
    stock: 24,
    reorderLevel: 8,
    status: 'In stock',
    sku: 'FOOD-CAT-02',
  },
  {
    id: 'prd-003',
    name: 'Dental care chews',
    category: 'Wellness',
    price: 175000,
    stock: 5,
    reorderLevel: 10,
    status: 'Low stock',
    sku: 'WELL-DEN-03',
  },
  {
    id: 'prd-004',
    name: 'Monthly flea care',
    category: 'Wellness',
    price: 285000,
    stock: 18,
    reorderLevel: 10,
    status: 'In stock',
    sku: 'WELL-FLE-04',
  },
  {
    id: 'prd-005',
    name: 'Soft grooming brush',
    category: 'Care',
    price: 198000,
    stock: 14,
    reorderLevel: 6,
    status: 'In stock',
    sku: 'CARE-BRU-05',
  },
  {
    id: 'prd-006',
    name: 'Cotton rope toy',
    category: 'Accessories',
    price: 120000,
    stock: 3,
    reorderLevel: 8,
    status: 'Low stock',
    sku: 'ACC-ROP-06',
  },
  {
    id: 'prd-007',
    name: 'Puppy starter bundle',
    category: 'Food',
    price: 890000,
    stock: 0,
    reorderLevel: 4,
    status: 'Out of stock',
    sku: 'FOOD-PUP-07',
  },
  {
    id: 'prd-008',
    name: 'Timothy hay premium',
    category: 'Food',
    price: 225000,
    stock: 16,
    reorderLevel: 8,
    status: 'In stock',
    sku: 'FOOD-HAY-08',
  },
  {
    id: 'prd-009',
    name: 'Coat care set',
    category: 'Care',
    price: 310000,
    stock: 9,
    reorderLevel: 6,
    status: 'In stock',
    sku: 'CARE-COA-09',
  },
  {
    id: 'prd-010',
    name: 'Joint support bites',
    category: 'Wellness',
    price: 420000,
    stock: 4,
    reorderLevel: 6,
    status: 'Low stock',
    sku: 'WELL-JOI-10',
  },
];

export const revenueByPeriod: Record<string, RevenuePoint[]> = {
  '7d': [
    { label: 'Mon', revenue: 3200000, orders: 12 },
    { label: 'Tue', revenue: 4100000, orders: 15 },
    { label: 'Wed', revenue: 3650000, orders: 13 },
    { label: 'Thu', revenue: 5200000, orders: 18 },
    { label: 'Fri', revenue: 4480000, orders: 16 },
    { label: 'Sat', revenue: 6100000, orders: 23 },
    { label: 'Sun', revenue: 5740000, orders: 19 },
  ],
  '30d': [
    { label: 'W1', revenue: 19400000, orders: 68 },
    { label: 'W2', revenue: 23100000, orders: 79 },
    { label: 'W3', revenue: 26700000, orders: 88 },
    { label: 'W4', revenue: 32470000, orders: 104 },
  ],
  quarter: [
    { label: 'Jun', revenue: 58900000, orders: 218 },
    { label: 'Jul', revenue: 72600000, orders: 264 },
    { label: 'Aug', revenue: 96870000, orders: 311 },
  ],
};
