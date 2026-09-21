// Helper to convert Supabase snake_case to app camelCase
export function sellerFromDB(row) {
  if (!row) return null;
  return {
    id: row.id,
    mobile: row.mobile,
    firstName: row.first_name,
    surname: row.surname,
    storeName: row.store_name,
    storeAddress: row.store_address,
    storeLocation: row.store_location,
    storeLogo: row.store_logo,
    subscriptionActive: row.subscription_active,
    subscriptionExpiry: row.subscription_expiry,
  };
}

export function sellerToDB(s) {
  return {
    id: s.id,
    mobile: s.mobile,
    first_name: s.firstName,
    surname: s.surname,
    store_name: s.storeName,
    store_address: s.storeAddress,
    store_location: s.storeLocation,
    store_logo: s.storeLogo,
    subscription_active: s.subscriptionActive || false,
    subscription_expiry: s.subscriptionExpiry || null,
  };
}

export function storeFromDB(row) {
  if (!row) return null;
  return {
    id: row.id,
    sellerId: row.seller_id,
    name: row.name,
    category: row.category,
    location: row.location,
    address: row.address,
    logo: row.logo,
    color: row.color,
    open: row.open,
    rating: Number(row.rating),
    distance: Number(row.distance),
  };
}

export function storeToDB(s) {
  return {
    id: s.id,
    seller_id: s.sellerId,
    name: s.name,
    category: s.category,
    location: s.location,
    address: s.address,
    logo: s.logo,
    color: s.color,
    open: s.open,
    rating: s.rating,
    distance: s.distance,
  };
}

export function productFromDB(row) {
  if (!row) return null;
  return {
    id: row.id,
    sellerId: row.seller_id,
    storeId: row.store_id,
    name: row.name,
    price: Number(row.price),
    category: row.category,
    image: row.image,
    description: row.description,
    stock: row.stock,
    available: row.available,
  };
}

export function productToDB(p) {
  return {
    id: p.id,
    seller_id: p.sellerId,
    store_id: p.storeId,
    name: p.name,
    price: p.price,
    category: p.category,
    image: p.image,
    description: p.description,
    stock: p.stock,
    available: p.available,
  };
}

export function customerFromDB(row) {
  if (!row) return null;
  return {
    id: row.id,
    mobile: row.mobile,
    name: row.name,
    address: row.address,
    location: row.location,
  };
}

export function customerToDB(c) {
  return {
    id: c.id,
    mobile: c.mobile,
    name: c.name,
    address: c.address,
    location: c.location,
  };
}

export function orderFromDB(row) {
  if (!row) return null;
  return {
    id: row.id,
    customerId: row.customer_id,
    customerName: row.customer_name,
    items: row.items,
    subtotal: Number(row.subtotal),
    platformFee: Number(row.platform_fee),
    deliveryCharge: Number(row.delivery_charge),
    total: Number(row.total),
    address: row.address,
    location: row.location,
    mobile: row.mobile,
    status: row.status,
    paymentMethod: row.payment_method,
    date: row.date,
  };
}

export function orderToDB(o) {
  return {
    id: o.id,
    customer_id: o.customerId,
    customer_name: o.customerName,
    items: o.items,
    subtotal: o.subtotal,
    platform_fee: o.platformFee,
    delivery_charge: o.deliveryCharge,
    total: o.total,
    address: o.address,
    location: o.location,
    mobile: o.mobile,
    status: o.status,
    payment_method: o.paymentMethod,
    date: o.date,
  };
}

export function paymentFromDB(row) {
  if (!row) return null;
  return {
    id: row.id,
    orderId: row.order_id,
    userId: row.user_id,
    userName: row.user_name,
    amount: Number(row.amount),
    type: row.type,
    status: row.status,
    date: row.date,
  };
}

export function paymentToDB(p) {
  return {
    id: p.id,
    order_id: p.orderId,
    user_id: p.userId,
    user_name: p.userName,
    amount: p.amount,
    type: p.type,
    status: p.status,
    date: p.date,
  };
}
