export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));
}

export function formatCompactCurrency(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)} tr ₫`;
  if (value >= 1_000) return `${Math.round(value / 1_000)} nghìn ₫`;
  return formatCurrency(value);
}

export function translatePaymentStatus(status: 'Paid' | 'Pending' | 'Overdue'): string {
  return { Paid: 'Đã thanh toán', Pending: 'Chờ thanh toán', Overdue: 'Quá hạn' }[status];
}

export function translateFulfillmentStatus(status: 'Ready' | 'Processing' | 'Completed'): string {
  return { Ready: 'Sẵn sàng', Processing: 'Đang xử lý', Completed: 'Hoàn tất' }[status];
}

export function translateProductStatus(status: 'In stock' | 'Low stock' | 'Out of stock'): string {
  return { 'In stock': 'Còn hàng', 'Low stock': 'Sắp hết', 'Out of stock': 'Hết hàng' }[status];
}

export function translateCustomerStatus(status: 'Active' | 'Needs follow-up'): string {
  return { Active: 'Đang hoạt động', 'Needs follow-up': 'Cần chăm sóc' }[status];
}

export function translateCategory(category: 'Food' | 'Care' | 'Wellness' | 'Accessories'): string {
  return { Food: 'Thức ăn', Care: 'Chăm sóc', Wellness: 'Sức khỏe', Accessories: 'Phụ kiện' }[
    category
  ];
}

export function translateSpecies(species: 'Dog' | 'Cat' | 'Rabbit'): string {
  return { Dog: 'Chó', Cat: 'Mèo', Rabbit: 'Thỏ' }[species];
}
