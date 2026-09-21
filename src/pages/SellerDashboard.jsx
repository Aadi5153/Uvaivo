import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { formatCurrency, isExpired } from '../utils/helpers.js';

const MENU = [
  { id: 'add', icon: '➕', label: 'Add Product' },
  { id: 'products', icon: '📦', label: 'My Products' },
  { id: 'orders', icon: '🛍️', label: 'Orders' },
  { id: 'store', icon: '🏪', label: 'Store Profile' },
  { id: 'subscription', icon: '💳', label: 'Subscription' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
];

export default function SellerDashboard({ seller, subscription, onNavigate, onLogout }) {
  const { products, orders, allStores } = useApp();

  const myProducts = products.filter((p) => p.sellerId === seller.id);
  const myStoreIds = allStores.filter((s) => s.sellerId === seller.id).map((s) => s.id);
  const myOrders = orders.filter((o) =>
    o.items.some((i) => myStoreIds.includes(i.storeId))
  );

  const totalSales = myOrders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const subActive = subscription && !isExpired(subscription.expiryDate);

  return (
    <>
      <div className="seller-header">
        <div className="seller-header-top">
          <div className="seller-logo">{seller.storeLogo || '🏪'}</div>
          <div style={{ flex: 1 }}>
            <div className="seller-name">{seller.storeName}</div>
            <div className="seller-store">
              {seller.firstName} {seller.surname}
            </div>
          </div>
          <button
            className="back-btn"
            onClick={onLogout}
            style={{ background: 'rgba(255,255,255,0.22)', color: '#fff' }}
            aria-label="Logout"
          >
            🚪
          </button>
        </div>
        <div className="sub-badge">
          {subActive ? '✓ Subscription Active' : '⚠ Subscription Inactive'}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-value">{myProducts.length}</div>
          <div className="stat-label">Products</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🛍️</div>
          <div className="stat-value">{myOrders.length}</div>
          <div className="stat-label">Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value">{formatCurrency(totalSales)}</div>
          <div className="stat-label">Total Sales</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-value" style={{ fontSize: 16 }}>
            {subActive ? 'Active' : 'Inactive'}
          </div>
          <div className="stat-label">Subscription</div>
        </div>
      </div>

      <div className="dash-grid">
        {MENU.map((m) => (
          <div key={m.id} className="dash-tile" onClick={() => onNavigate(m.id)}>
            <div className="dash-tile-icon">{m.icon}</div>
            <div className="dash-tile-label">{m.label}</div>
          </div>
        ))}
      </div>
    </>
  );
}
