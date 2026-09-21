export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function generateOrderId() {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `BM-${num}`;
}

export function formatCurrency(amount) {
  return `₹${Number(amount).toFixed(0)}`;
}

export function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(date) {
  const d = new Date(date);
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function calculatePlatformFee(itemTotal, percent) {
  return Math.round((itemTotal * percent) / 100);
}

export function calculateDeliveryCharge(distanceKm, slabs) {
  if (!slabs || slabs.length === 0) return 0;
  const slab = slabs.find((s) => distanceKm >= s.minKm && distanceKm < s.maxKm);
  return slab ? slab.charge : slabs[slabs.length - 1].charge;
}

export function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d.toISOString();
}

export function isExpired(date) {
  return new Date(date) < new Date();
}

export function groupCartByStore(cartItems, products) {
  const groups = {};
  cartItems.forEach((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return;
    if (!groups[product.storeId]) {
      groups[product.storeId] = [];
    }
    groups[product.storeId].push({ ...item, product });
  });
  return groups;
}

export function validateMobile(mobile) {
  return /^[6-9]\d{9}$/.test(mobile);
}

export function validateOtp(otp) {
  return otp === '123456';
}
