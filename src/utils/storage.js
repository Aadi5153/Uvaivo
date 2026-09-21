const PREFIX = 'uvaivo_';

export const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch {}
  },
  clearAll() {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(PREFIX))
        .forEach((k) => localStorage.removeItem(k));
    } catch {}
  },
};

export const KEYS = {
  CUSTOMER: 'customer',
  SELLER: 'seller',
  PRODUCTS: 'products',
  CARTS: 'carts',
  ORDERS: 'orders',
  SUBSCRIPTION: 'subscription',
  ADMIN_SETTINGS: 'admin_settings',
  DELIVERY_SETTINGS: 'delivery_settings',
  ALL_USERS: 'all_users',
  ALL_SELLERS: 'all_sellers',
  ALL_STORES: 'all_stores',
  PAYMENTS: 'payments',
  ADMIN_AUTH: 'admin_auth',
};
