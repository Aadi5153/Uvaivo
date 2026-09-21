import React from 'react';
import Button from '../components/Button.jsx';
import { useApp } from '../context/AppContext.jsx';
import { formatCurrency, formatDate } from '../utils/helpers.js';

const NEXT_STATUS = {
  'Order Placed': 'Accepted',
  'Accepted': 'Preparing',
  'Preparing': 'Ready',
  'Ready': 'Out for Delivery',
  'Out for Delivery': 'Delivered',
};

export default function SellerOrders({ seller, onBack }) {
  const { orders, allStores, updateOrderStatus, showToast } = useApp();

  const myStoreIds = allStores.filter((s) => s.sellerId === seller.id).map((s) => s.id);
  const myOrders = orders.filter((o) =>
    o.items.some((i) => myStoreIds.includes(i.storeId))
  );

  const handleAdvance = (order) => {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    updateOrderStatus(order.id, next);
    showToast(`Order ${order.id} → ${next}`, 'success');
  };

  const handleCancel = (order) => {
    if (!window.confirm('Cancel this order?')) return;
    updateOrderStatus(order.id, 'Cancelled');
    showToast('Order cancelled', 'info');
  };

  return (
    <>
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div className="page-title">Orders</div>
        <span className="section-link" style={{ marginLeft: 'auto' }}>
          {myOrders.length}
        </span>
      </div>

      <div className="section" style={{ marginTop: 16, marginBottom: 30 }}>
        {myOrders.length === 0 ? (
          <div className="empty-state" style={{ paddingTop: 60 }}>
            <div className="empty-icon">🛍️</div>
            <div className="empty-title">No orders yet</div>
            <div className="empty-sub">Incoming orders will appear here.</div>
          </div>
        ) : (
          myOrders.map((order) => {
            const next = NEXT_STATUS[order.status];
            const canCancel = order.status !== 'Delivered' && order.status !== 'Cancelled';
            return (
              <div key={order.id} className="order-card">
                <div className="order-head">
                  <div>
                    <div className="order-id">{order.id}</div>
                    <div className="order-date">{formatDate(order.date)}</div>
                  </div>
                  <span
                    className={`order-status-badge ${
                      order.status === 'Delivered'
                        ? 'delivered'
                        : order.status === 'Cancelled'
                        ? 'cancelled'
                        : order.status === 'Order Placed'
                        ? 'pending'
                        : ''
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
                  👤 {order.customerName}
                </div>
                <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
                  📍 {order.address}
                </div>

                <div style={{ marginTop: 10 }}>
                  {order.items.map((i, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 13,
                        padding: '4px 0',
                      }}
                    >
                      <span>
                        {i.image} {i.name} × {i.quantity}
                      </span>
                      <span>{formatCurrency(i.price * i.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '1px dashed #E5E7EB',
                    paddingTop: 8,
                    marginTop: 8,
                    fontWeight: 700,
                  }}
                >
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>

                {canCancel && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    {next && (
                      <Button
                        variant="primary"
                        size="sm"
                        full
                        onClick={() => handleAdvance(order)}
                      >
                        Mark as {next}
                      </Button>
                    )}
                    <Button
                      variant="danger"
                      size="sm"
                      full
                      onClick={() => handleCancel(order)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
