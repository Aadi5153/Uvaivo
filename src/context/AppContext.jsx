import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase.js';
import {
  sellerFromDB, sellerToDB,
  storeFromDB, storeToDB,
  productFromDB, productToDB,
  customerFromDB, customerToDB,
  orderFromDB, orderToDB,
  paymentFromDB, paymentToDB,
} from '../utils/schema.js';
import { STORES, PRODUCTS } from '../data/seedData.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [customer, setCustomerState] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [seller, setSellerState] = useState(null);
  const [allSellers, setAllSellers] = useState([]);
  const [allStores, setAllStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [carts, setCarts] = useState({});
  const [orders, setOrders] = useState([]);
  const [subscription, setSubscriptionState] = useState(null);
  const [adminSettings, setAdminSettingsState] = useState({ platformFeePercent: 5 });
  const [deliverySettings, setDeliverySettingsState] = useState({ slabs: [] });
  const [payments, setPayments] = useState([]);
  const [adminAuth, setAdminAuth] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==================== TOAST ====================
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  // ==================== INITIAL LOAD ====================
  useEffect(() => {
    async function loadAll() {
      try {
        // Load customers
        const { data: custData } = await supabase.from('customers').select('*');
        setAllUsers((custData || []).map(customerFromDB));

        // Load sellers
        const { data: sellData } = await supabase.from('sellers').select('*');
        setAllSellers((sellData || []).map(sellerFromDB));

        // Load stores
        const { data: storeData } = await supabase.from('stores').select('*');
        let storeList = (storeData || []).map(storeFromDB);
        
        // Seed stores if empty
        if (storeList.length === 0) {
          const seedStores = STORES.map(storeToDB);
          await supabase.from('stores').insert(seedStores);
          storeList = STORES;
        }
        setAllStores(storeList);

        // Load products
        const { data: prodData } = await supabase.from('products').select('*');
        let prodList = (prodData || []).map(productFromDB);
        
        // Seed products if empty
        if (prodList.length === 0) {
          const seedProducts = PRODUCTS.map(productToDB);
          await supabase.from('products').insert(seedProducts);
          prodList = PRODUCTS;
        }
        setProducts(prodList);

        // Load orders
        const { data: ordData } = await supabase.from('orders').select('*').order('date', { ascending: false });
        setOrders((ordData || []).map(orderFromDB));

        // Load payments
        const { data: payData } = await supabase.from('payments').select('*').order('date', { ascending: false });
        setPayments((payData || []).map(paymentFromDB));

        // Load settings
        const { data: setData } = await supabase.from('settings').select('*').eq('id', 1).single();
        if (setData) {
          setAdminSettingsState({ platformFeePercent: Number(setData.platform_fee_percent) });
          setDeliverySettingsState({ slabs: setData.delivery_slabs || [] });
        }

        // Load carts from localStorage (per device)
        try {
          const savedCart = localStorage.getItem('uvaivo_carts');
          if (savedCart) setCarts(JSON.parse(savedCart));
        } catch {}

        // Load admin auth
        const authSaved = localStorage.getItem('uvaivo_admin_auth');
        if (authSaved === 'true') setAdminAuth(true);

      } catch (err) {
        console.error('Load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  // Save cart locally
  useEffect(() => {
    try { localStorage.setItem('uvaivo_carts', JSON.stringify(carts)); } catch {}
  }, [carts]);

  // Save admin auth
  useEffect(() => {
    try { localStorage.setItem('uvaivo_admin_auth', String(adminAuth)); } catch {}
  }, [adminAuth]);

  // ==================== CUSTOMER ====================
  const loginCustomer = useCallback(async (mobile) => {
    try {
      const { data: existing } = await supabase
        .from('customers').select('*').eq('mobile', mobile).maybeSingle();

      if (existing) {
        const c = customerFromDB(existing);
        setCustomerState(c);
        return c;
      }

      const newCustomer = {
        id: 'cust_' + Date.now(),
        mobile,
        name: '',
        address: '',
        location: '',
      };
      const { data: created } = await supabase
        .from('customers').insert(customerToDB(newCustomer)).select().single();

      const c = customerFromDB(created);
      setCustomerState(c);
      setAllUsers((u) => [...u, c]);
      return c;
    } catch (err) {
      console.error(err);
      showToast('Login failed', 'error');
      return null;
    }
  }, [showToast]);

  const updateCustomer = useCallback(async (updates) => {
    if (!customer) return;
    try {
      const merged = { ...customer, ...updates };
      await supabase.from('customers').update(customerToDB(merged)).eq('id', customer.id);
      setCustomerState(merged);
      setAllUsers((all) => all.map((u) => (u.id === merged.id ? merged : u)));
    } catch (err) { console.error(err); }
  }, [customer]);

  const logoutCustomer = useCallback(() => setCustomerState(null), []);

  // ==================== SELLER ====================
  const loginSeller = useCallback(async (mobile) => {
    try {
      const { data: existing } = await supabase
        .from('sellers').select('*').eq('mobile', mobile).maybeSingle();
      if (existing) {
        const s = sellerFromDB(existing);
        setSellerState(s);
        if (s.subscriptionActive && s.subscriptionExpiry) {
          setSubscriptionState({
            sellerId: s.id,
            expiryDate: s.subscriptionExpiry,
            status: 'active',
          });
        }
        return s;
      }
      return null;
    } catch (err) { console.error(err); return null; }
  }, []);

  const registerSeller = useCallback(async (data) => {
    try {
      const newSeller = {
        id: 'seller_' + Date.now(),
        mobile: data.mobile,
        firstName: data.firstName,
        surname: data.surname,
        storeName: data.storeName,
        storeAddress: data.storeAddress,
        storeLocation: data.storeLocation,
        storeLogo: data.storeLogo || '🏪',
        subscriptionActive: false,
        subscriptionExpiry: null,
      };
      const { data: created } = await supabase
        .from('sellers').insert(sellerToDB(newSeller)).select().single();
      const s = sellerFromDB(created);
      setSellerState(s);
      setAllSellers((list) => [...list, s]);
      return s;
    } catch (err) { console.error(err); return null; }
  }, []);

  const updateSeller = useCallback(async (updates) => {
    if (!seller) return;
    try {
      const merged = { ...seller, ...updates };
      await supabase.from('sellers').update(sellerToDB(merged)).eq('id', seller.id);
      setSellerState(merged);
      setAllSellers((all) => all.map((s) => (s.id === merged.id ? merged : s)));
    } catch (err) { console.error(err); }
  }, [seller]);

  const logoutSeller = useCallback(() => {
    setSellerState(null);
    setSubscriptionState(null);
  }, []);

  // ==================== SUBSCRIPTION ====================
  const activateSubscription = useCallback(async (sellerId) => {
    const expiry = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
    const sub = {
      sellerId,
      plan: '₹100 / 3 Months',
      price: 100,
      startDate: new Date().toISOString(),
      expiryDate: expiry,
      status: 'active',
    };
    try {
      await supabase.from('sellers').update({
        subscription_active: true,
        subscription_expiry: expiry,
      }).eq('id', sellerId);
      setSellerState((s) => s ? { ...s, subscriptionActive: true, subscriptionExpiry: expiry } : s);
      setSubscriptionState(sub);
    } catch (err) { console.error(err); }
    return sub;
  }, []);

  // ==================== PRODUCTS ====================
  const addProduct = useCallback(async (product) => {
    try {
      const { data: created } = await supabase
        .from('products').insert(productToDB(product)).select().single();
      const p = productFromDB(created);
      setProducts((prev) => [...prev, p]);
    } catch (err) { console.error(err); showToast('Failed to add product', 'error'); }
  }, [showToast]);

  const updateProduct = useCallback(async (id, updates) => {
    try {
      const existing = products.find((p) => p.id === id);
      if (!existing) return;
      const merged = { ...existing, ...updates };
      await supabase.from('products').update(productToDB(merged)).eq('id', id);
      setProducts((prev) => prev.map((p) => (p.id === id ? merged : p)));
    } catch (err) { console.error(err); }
  }, [products]);

  const deleteProduct = useCallback(async (id) => {
    try {
      await supabase.from('products').delete().eq('id', id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) { console.error(err); }
  }, []);

  // ==================== CART ====================
  const customerKey = customer?.id || 'guest';

  const getCart = useCallback(() => carts[customerKey] || [], [carts, customerKey]);

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
      const updated = quantity <= 0
        ? cart.filter((i) => i.productId !== productId)
        : cart.map((i) => (i.productId === productId ? { ...i, quantity } : i));
      return { ...c, [customerKey]: updated };
    });
  }, [customerKey]);

  const removeFromCart = useCallback((productId) => {
    setCarts((c) => ({
      ...c,
      [customerKey]: (c[customerKey] || []).filter((i) => i.productId !== productId),
    }));
  }, [customerKey]);

  const clearCart = useCallback(() => {
    setCarts((c) => ({ ...c, [customerKey]: [] }));
  }, [customerKey]);

  // ==================== ORDERS ====================
  const placeOrder = useCallback(async (order) => {
    try {
      const { data: created } = await supabase
        .from('orders').insert(orderToDB(order)).select().single();
      const o = orderFromDB(created);
      setOrders((prev) => [o, ...prev]);
    } catch (err) { console.error(err); showToast('Order failed', 'error'); }
  }, [showToast]);

  const updateOrderStatus = useCallback(async (orderId, status) => {
    try {
      await supabase.from('orders').update({ status }).eq('id', orderId);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    } catch (err) { console.error(err); }
  }, []);

  // ==================== PAYMENTS ====================
  const addPayment = useCallback(async (payment) => {
    try {
      const { data: created } = await supabase
        .from('payments').insert(paymentToDB(payment)).select().single();
      const p = paymentFromDB(created);
      setPayments((prev) => [p, ...prev]);
    } catch (err) { console.error(err); }
  }, []);

  // ==================== ADMIN SETTINGS ====================
  const updateAdminSettings = useCallback(async (updates) => {
    try {
      const merged = { ...adminSettings, ...updates };
      await supabase.from('settings').update({
        platform_fee_percent: merged.platformFeePercent,
        updated_at: new Date().toISOString(),
      }).eq('id', 1);
      setAdminSettingsState(merged);
    } catch (err) { console.error(err); }
  }, [adminSettings]);

  const updateDeliverySettings = useCallback(async (updates) => {
    try {
      const merged = { ...deliverySettings, ...updates };
      await supabase.from('settings').update({
        delivery_slabs: merged.slabs,
        updated_at: new Date().toISOString(),
      }).eq('id', 1);
      setDeliverySettingsState(merged);
    } catch (err) { console.error(err); }
  }, [deliverySettings]);

  const loginAdmin = useCallback((username, password) => {
    if (username === 'admin' && password === 'admin123') {
      setAdminAuth(true);
      return true;
    }
    return false;
  }, []);

  const logoutAdmin = useCallback(() => setAdminAuth(false), []);

  const cartCount = (carts[customerKey] || []).reduce((s, i) => s + i.quantity, 0);

  const value = {
    customer, allUsers, loginCustomer, updateCustomer, logoutCustomer,
    seller, allSellers, loginSeller, registerSeller, updateSeller, logoutSeller,
    allStores, setAllStores,
    products, addProduct, updateProduct, deleteProduct,
    cart: getCart(), cartCount, addToCart, updateCartQty, removeFromCart, clearCart,
    orders, placeOrder, updateOrderStatus,
    subscription, activateSubscription,
    payments, addPayment,
    adminSettings, updateAdminSettings,
    deliverySettings, updateDeliverySettings,
    adminAuth, loginAdmin, logoutAdmin,
    toasts, showToast, loading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
