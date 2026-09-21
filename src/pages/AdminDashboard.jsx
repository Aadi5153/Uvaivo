import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { formatCurrency, formatDate } from '../utils/helpers.js';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'customers', label: 'Customers' },
  { id: 'sellers', label: 'Sellers' },
  { id: 'products', label: 'Products' },
  { id: 'orders', label: 'Orders' },
  { id: 'payments', label: 'Payments' },
  { id: 'subscriptions', label: 'Subscriptions' },
  { id: 'settings', label: 'Settings' },
];

export default function AdminDashboard({ onLogout }) {
  const {
    allUsers, allSellers, allStores, products, orders, payments,
    adminSettings, updateAdminSettings,
    deliverySettings, updateDeliverySettings,
    showToast,
  } = useApp();

  const [tab, setTab] = useState('overview');
  const [feeInput, setFeeInput] = useState(String(adminSettings.platformFeePercent));
  const [slabs, setSlabs] = useState(deliverySettings.slabs);

  // Stats
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((s, o) => s + o.total, 0);
  const platformRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((s, o) => s + o.platformFee, 0);

  const saveFee = () => {
    const val = Number(feeInput);
    if (isNaN(val) || val < 0 || val > 50) {
      showToast('Fee must be between 0 and 50', 'error');
      return;
    }
    updateAdminSettings({ platformFeePercent: val });
    showToast('Platform fee updated', 'success');
  };

  const saveSlabs = () => {
    updateDeliverySettings({ slabs });
    showToast('Delivery charges saved', 'success');
  };

  const updateSlab = (id, field, value) => {
    setSlabs((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: Number(value) || 0 } : s))
    );
  };

  const addSlab = () => {
    const last = slabs[slabs.length - 1];
    const newSlab = {
      id: 'slab_' + Date.now(),
      minKm: last ? last.maxKm : 0,
      maxKm: last ? last.maxKm + 5 : 5,
      charge: 0,
    };
    setSlabs([...slabs, newSlab]);
  };

  const removeSlab = (id) => {
    setSlabs(slabs.filter((s) => s.id !== id));
  };

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <div className="admin-title">Uvaivo Admin</div>
        <button className="btn btn-outline btn-sm" onClick={onLogout}>
          🚪 Logout
        </button>
      </div>

      <div className="admin-content">
        {/* Stats */}
        <div className="admin-stats">
          <div className="admin-stat">
            <div className="admin-stat-value">{allUsers.length}</div>
            <div className="admin-stat-label">Customers</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat-value">{allSellers.length}</div>
            <div className="admin-stat-label">Sellers</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat-value">{allStores.length}</div>
            <div className="admin-stat-label">Stores</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat-value">{products.length}</div>
            <div className="admin-stat-label">Products</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat-value">{orders.length}</div>
            <div className="admin-stat-label">Orders</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat-value">{formatCurrency(totalRevenue)}</div>
            <div className="admin-stat-label">Total Revenue</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat-value">{formatCurrency(platformRevenue)}</div>
            <div className="admin-stat-label">Platform Revenue</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {TABS.map((t) => (
            <div
              key={t.id}
              className={`admin-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </div>
          ))}
        </div>

        {/* Content */}
        {tab === 'overview' && (
          <div className="admin-table-wrap" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800 }}>Platform Snapshot</h3>
            <p style={{ color: '#6B7280', marginTop: 8, fontSize: 14 }}>
              Total {orders.length} orders · {products.length} products · {allStores.length} stores
            </p>
            <p style={{ color: '#6B7280', marginTop: 6, fontSize: 14 }}>
              Platform fee: {adminSettings.platformFeePercent}% · Delivery slabs: {deliverySettings.slabs.length}
            </p>
          </div>
        )}

        {tab === 'customers' && (
          <div className="admin-table-wrap">
            {allUsers.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#6B7280' }}>
                No customers yet
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th><th>Mobile</th><th>Address</th><th>Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((u) => {
                    const cOrders = orders.filter((o) => o.customerId === u.id);
                    return (
                      <tr key={u.id}>
                        <td>{u.name || '—'}</td>
                        <td>+91 {u.mobile}</td>
                        <td style={{ maxWidth: 200, fontSize: 12 }}>{u.address || '—'}</td>
                        <td>{cOrders.length}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === 'sellers' && (
          <div className="admin-table-wrap">
            {allSellers.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#6B7280' }}>
                No sellers yet
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th><th>Store</th><th>Mobile</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allSellers.map((s) => (
                    <tr key={s.id}>
                      <td>{s.firstName} {s.surname}</td>
                      <td>{s.storeName}</td>
                      <td>+91 {s.mobile}</td>
                      <td>
                        <span className="status-pill">Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === 'products' && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th><th>Store</th><th>Category</th><th>Price</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const store = allStores.find((s) => s.id === p.storeId);
                  return (
                    <tr key={p.id}>
                      <td>{p.image} {p.name}</td>
                      <td>{store?.name || '—'}</td>
                      <td>{p.category}</td>
                      <td>{formatCurrency(p.price)}</td>
                      <td>
                        <span className={`status-pill ${!p.available ? 'closed' : ''}`}>
                          {p.available ? 'Active' : 'Unavailable'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'orders' && (
          <div className="admin-table-wrap">
            {orders.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#6B7280' }}>
                No orders yet
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th><th>Customer</th><th>Total</th>
                    <th>Platform Fee</th><th>Delivery</th><th>Status</th><th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td><b style={{ color: '#2563EB' }}>{o.id}</b></td>
                      <td>{o.customerName || '—'}</td>
                      <td>{formatCurrency(o.total)}</td>
                      <td>{formatCurrency(o.platformFee)}</td>
                      <td>{formatCurrency(o.deliveryCharge)}</td>
                      <td>
                        <span className={`order-status-badge ${o.status === 'Delivered' ? 'delivered' : o.status === 'Cancelled' ? 'cancelled' : o.status === 'Order Placed' ? 'pending' : ''}`}>
                          {o.status}
                        </span>
                      </td>
                      <td style={{ fontSize: 12 }}>{formatDate(o.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === 'payments' && (
          <div className="admin-table-wrap">
            {payments.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#6B7280' }}>
                No payments yet
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Payment ID</th><th>User</th><th>Amount</th><th>Type</th><th>Status</th><th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontSize: 11 }}>{p.id}</td>
                      <td>{p.userName || '—'}</td>
                      <td>{formatCurrency(p.amount)}</td>
                      <td>{p.type}</td>
                      <td><span className="status-pill">{p.status}</span></td>
                      <td style={{ fontSize: 12 }}>{formatDate(p.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === 'subscriptions' && (
          <div className="admin-table-wrap">
            <div style={{ padding: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800 }}>Seller Subscriptions</h3>
              <p style={{ color: '#6B7280', marginTop: 8, fontSize: 13 }}>
                Plan: ₹100 / 3 Months
              </p>
            </div>
            {payments.filter((p) => p.type === 'Seller Subscription').length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#6B7280' }}>
                No subscriptions yet
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Seller</th><th>Plan</th><th>Amount</th><th>Status</th><th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments
                    .filter((p) => p.type === 'Seller Subscription')
                    .map((p) => (
                      <tr key={p.id}>
                        <td>{p.userName}</td>
                        <td>₹100 / 3 Months</td>
                        <td>{formatCurrency(p.amount)}</td>
                        <td><span className="status-pill">{p.status}</span></td>
                        <td style={{ fontSize: 12 }}>{formatDate(p.date)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === 'settings' && (
          <>
            <div className="admin-table-wrap" style={{ padding: 20, marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800 }}>Platform Fee</h3>
              <p style={{ color: '#6B7280', marginTop: 6, fontSize: 13 }}>
                Applied to all future orders.
              </p>
              <div style={{ display: 'flex', gap: 10, marginTop: 14, alignItems: 'flex-end', maxWidth: 340 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280' }}>
                    Platform Fee %
                  </label>
                  <input
                    className="input-field"
                    type="number"
                    min="0"
                    max="50"
                    value={feeInput}
                    onChange={(e) => setFeeInput(e.target.value)}
                  />
                </div>
                <button className="btn btn-primary btn-md" onClick={saveFee}>
                  Save Changes
                </button>
              </div>
            </div>

            <div className="admin-table-wrap" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800 }}>Delivery Charges</h3>
              <p style={{ color: '#6B7280', marginTop: 6, fontSize: 13 }}>
                Distance-based pricing (in km). Used at checkout.
              </p>

              <div style={{ marginTop: 14 }}>
                {slabs.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      display: 'flex',
                      gap: 8,
                      marginBottom: 8,
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <input
                      className="input-field"
                      style={{ maxWidth: 80 }}
                      type="number"
                      value={s.minKm}
                      onChange={(e) => updateSlab(s.id, 'minKm', e.target.value)}
                      placeholder="Min"
                    />
                    <span>to</span>
                    <input
                      className="input-field"
                      style={{ maxWidth: 80 }}
                      type="number"
                      value={s.maxKm}
                      onChange={(e) => updateSlab(s.id, 'maxKm', e.target.value)}
                      placeholder="Max"
                    />
                    <span>km → ₹</span>
                    <input
                      className="input-field"
                      style={{ maxWidth: 90 }}
                      type="number"
                      value={s.charge}
                      onChange={(e) => updateSlab(s.id, 'charge', e.target.value)}
                      placeholder="Charge"
                    />
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeSlab(s.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                <button className="btn btn-outline btn-md" onClick={addSlab}>
                  + Add Slab
                </button>
                <button className="btn btn-primary btn-md" onClick={saveSlabs}>
                  Save Delivery Charges
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
