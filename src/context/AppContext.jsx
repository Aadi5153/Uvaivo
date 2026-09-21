import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storage, KEYS } from '../utils/storage.js';
import {
  STORES,
  PRODUCTS,
  DEFAULT_ADMIN_SETTINGS,
  DEFAULT_DELIVERY_SETTINGS,
} from '../data/seedData.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Customer
  const [customer, setCustomerState] = useState(() => storage.get(KEYS.CUSTOMER, null));
  const [allUsers, setAllUsers] = useState(() => storage.get(KEYS.ALL_USERS, []));

  // Seller
  const [seller, setSellerState] = useState(() => storage.get(KEYS.SELLER, null));
  const [allSellers, setAllSellers] = useState(() => storage.get(KEYS.ALL_SELLERS, []));
  const [allStores, setAllStores] = useState(() => storage.get(KEYS.ALL_STORES, STORES));

  // Products
  const [products, setProductsState] = useState(() => storage.get(KEYS.PRODUCTS, PRODUCTS));

  // Cart (per customer)
  const [carts, setCarts] = useState(() => storage.get(KEYS.CARTS, {}));

  // Orders
  const [orders, setOrders] = useState(() => storage.get(KEYS.ORDERS, []));

  // Subscription
  const [subscription, setSubscriptionState] = useState(() =>
    storage.get(KEYS.SUBSCRIPTION, null)
  );

  // Admin
  const [adminSettings, setAdminSettingsState] = useState(() =>
    storage.get(KEYS.ADMIN_SETTINGS, DEFAULT_ADMIN_SETTINGS)
  );
  const [deliverySettings, setDeliverySettingsState] = useState(() =>
    storage.get(KEYS.DELIVERY_SETTINGS, DEFAULT_DELIVERY_SETTINGS)
  );
  const [payments, setPayments] = useState(() => storage.get(KEYS.PAYMENTS, []));
  const [adminAuth, setAdminAuth] = useState(() => storage.get(KEYS.ADMIN_AUTH, false));

  // Toasts
  const [toasts, setToasts] = useState([]);

  // --- Persistence effects ---
  useEffect(() => { storage.set(KEYS.CUSTOMER, customer); }, [customer]);
  useEffect(() => { storage.set(KEYS.ALL_USERS, allUsers); }, [allUsers]);
  useEffect(() => { storage.set(KEYS.SELLER, seller); }, [seller]);
  useEffect(() => { storage.set(KEYS.ALL_SELLERS, allSellers); }, [allSellers]);
  useEffect(() => { storage.set(KEYS.ALL_STORES, allStores); }, [allStores]);
  useEffect(() => { storage.set(KEYS.PRODUCTS, products); }, [products]);
  useEffect(() => { storage.set(KEYS.CARTS, carts); }, [carts]);
  useEffect(() => { storage.set(KEYS.ORDERS, orders); }, [orders]);
  useEffect(() => { storage.set(KEYS.SUBSCRIPTION, subscription); }, [subscription]);
  useEffect(() => { storage.set(KEYS.ADMIN_SETTINGS, adminSettings); }, [adminSettings]);
  useEffect(() => { storage.set(KEYS.DELIVERY_SETTINGS, deliverySettings); }, [deliverySettings]);
  useEffect(() => { storage.set(KEYS.PAYMENTS, payments); }, [payments]);
  useEffect(() => { storage.set(KEYS.ADMIN_AUTH, adminAuth); }, [adminAuth]);

  // --- Toast system ---
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 2800);
  }, []);

  // --- Customer auth ---
  const loginCustomer = useCallback((mobile) => {
    const existing = allUsers.find((u) => u.mobile === mobile);
    if (existing) {
      setCustomerState(existing);
      return existing;
    }
    const newUser = { id: 'cust_' + Date.now(), mobile, name: '', address: '', location: '' };
    setAllUsers((u) => [...u, newUser]);
    setCustomerState(newUser);
    return newUser;
  }, [allUsers]);

  const updateCustomer = useCallback((updates) => {
    setCustomerState((prev) => {
      const updated = { ...prev, ...updates };
      setAllUsers((all) => all.map((u) => (u.id === updated.id ? updated : u)));
      return updated;
    });
  }, []);

  const logoutCustomer = useCallback(() => {
    setCustomerState(null);
  }, []);

  // --- Seller auth ---
  const loginSeller = useCallback((mobile) => {
    const existing = allSellers.find((s) => s.mobile === mobile);
    if (existing) {
      setSellerState(existing);
      return existing;
    }
    return null;
  }, [allSellers]);

  const registerSeller = useCallback((data) => {
    const newSeller = { id: 'seller_' + Date.now(), ...data };
    setAllSellers((s) => [...s, newSeller]);
    setSellerState(newSeller);
    return newSeller;
  }, []);

  const updateSeller = useCallback((updates) => {
    setSellerState((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      setAllSellers((all) => all.map((s) => (s.id === updated.id ? updated : s)));
      return updated;
    });
  }, []);

  const logoutSeller = useCallback(() => {
    setSellerState(null);
    setSubscriptionState(null);
  }, []);

  // --- Subscription ---
  const activateSubscription = useCallback((sellerId) => {
    const start = new Date().toISOString();
    const sub = {
      id: 'sub_' + Date.now(),
      sellerId,
      plan: '₹100 / 3 Months',
      price: 100,
      durationMonths: 3,
      startDate: start,
      expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
    };
    setSubscriptionState(sub);
    return sub;
  }, []);

  // --- Products ---
  const addProduct = useCallback((product) => {
    setProductsState((p) => [...p, product]);
  }, []);

  const updateProduct = useCallback((id, updates) => {
    setProductsState((p) => p.map((x) => (x.id === id ? { ...x, ...updates } : x)));
  }, []);

  const deleteProduct = useCallback((id) => {
    setProductsState((p) => p.filter((x) => x.id !== id));
  }, []);

  // --- Cart ---
  const customerKey = customer?.id || 'guest';

  const getCart = useCallback(() => {
    return carts[customerKey] || [];
  }, [carts, customerKey]);

  const addToCart = useCallback((productId, quantity = 1) => {
    setCarts((c) => {
      const cart = c[customerKey] || [];
      const existing = cart.find((i) => i.productId === productId);
      let updated;
      if (existing) {
        updated = cart.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        updated = [...cart, { productId, quantity }];
      }
      return { ...c, [customerKey]: updated };
    });
  }, [customerKey]);

  const updateCartQty = useCallback((productId, quantity) => {
    setCarts((c) => {
      const cart = c[customerKey] || [];
      let updated;
      if (quantity <= 0) {
        updated = cart.filter((i) => i.productId !== productId);
      } else {
        updated = cart.map((i) => (i.productId === productId ? { ...i, quantity } : i));
      }
      return { ...c, [customerKey]: updated };
    });
  }, [customerKey]);

  const removeFromCart = useCallback((productId) => {
    setCarts((c) => {
      const cart = c[customerKey] || [];
      return { ...c, [customerKey]: cart.filter((i) => i.productId !== productId) };
    });
  }, [customerKey]);

  const clearCart = useCallback(() => {
    setCarts((c) => ({ ...c, [customerKey]: [] }));
  }, [customerKey]);

  // --- Orders ---
  const placeOrder = useCallback((order) => {
    setOrders((o) => [order, ...o]);
  }, []);

  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders((o) => o.map((x) => (x.id === orderId ? { ...x, status } : x)));
  }, []);

  // --- Payments (mock) ---
  const addPayment = useCallback((payment) => {
    setPayments((p) => [payment, ...p]);
  }, []);

  // --- Admin settings ---
  const updateAdminSettings = useCallback((updates) => {
    setAdminSettingsState((s) => ({ ...s, ...updates }));
  }, []);

  const updateDeliverySettings = useCallback((updates) => {
    setDeliverySettingsState((s) => ({ ...s, ...updates }));
  }, []);

  const loginAdmin = useCallback((username, password) => {
    if (username === 'admin' && password === 'admin123') {
      setAdminAuth(true);
      return true;
    }
    return false;
  }, []);

  const logoutAdmin = useCallback(() => {
    setAdminAuth(false);
  }, []);

  // --- Cart count helper ---
  const cartCount = (carts[customerKey] || []).reduce((sum, i) => sum + i.quantity, 0);

  const value = {
    // customer
    customer, allUsers, loginCustomer, updateCustomer, logoutCustomer,
    // seller
    seller, allSellers, loginSeller, registerSeller, updateSeller, logoutSeller,
    // stores
    allStores, setAllStores,
    // products
    products, addProduct, updateProduct, deleteProduct,
    // cart
    cart: getCart(), cartCount, addToCart, updateCartQty, removeFromCart, clearCart,
    // orders
    orders, placeOrder, updateOrderStatus,
    // subscription
    subscription, activateSubscription,
    // payments
    payments, addPayment,
    // admin
    adminSettings, updateAdminSettings,
    deliverySettings, updateDeliverySettings,
    adminAuth, loginAdmin, logoutAdmin,
    // toast
    toasts, showToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
