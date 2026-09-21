import React from 'react';
import Button from '../components/Button.jsx';
import { useApp } from '../context/AppContext.jsx';
import { formatCurrency, formatDate } from '../utils/helpers.js';
import { ORDER_STATUSES } from '../data/seedData.js';

function statusClass(status) {
  if (status === 'Delivered') return 'delivered';
  if (status === 'Cancelled') return 'cancelled';
  if (status === 'Order Placed') return 'pending';
  return '';
}

export default function Orders({ onContinueShopping, onOpenOrder }) {
  const { orders, customer } = useApp();

  const myOrders = orders.filter((o) => o.customerId === customer?.id);

  if (myOrders.length === 0) {
    return (
      <>
        <div className="page-header">
          <div className="page-title">My Orders</div>
        </div>
        <div className="empty-state" style={{ paddingTop: 80 }}>
          <div className="empty-icon">📦</div>
          <div className="empty-title">No orders yet</div>
          <div className="empty-sub">Your placed orders will appear here.</div>
          <Button variant="primary" size="md" onClick={onContinueShopping}>
            Start Shopping
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <div className="page-title">My Orders</div>
      </div>

      <div className="section" style={{ marginTop: 16 }}>
        {myOrders.map((order) => {
          const storeNames = [...new Set(order.items.map((i) => i.storeName))].join(', ');
          const statusIdx = ORDER_STATUSES.indexOf(order.status);
          return (
            <div key={order.id} className="order-card" onClick={() => onOpenOrder(order)}>
              <div className="order-head">
                <div>
                  <div className="order-id">{order.id}</div>
                  <div className="order-date">{formatDate(order.date)}</div>
                </div>
                <span className={`order-status-badge ${statusClass(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div style={{ fontSize: 13, color: '#6B7280' }}>
                {storeNames}
              </div>
              <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
                {order.items.length} item{order.items.length > 1 ? 's' : ''} · Total{' '}
                <b style={{ color: '#172033' }}>{formatCurrency(order.total)}</b>
              </div>

              {order.status !== 'Cancelled' && (
                <div className="timeline">
                  {ORDER_STATUSES.map((s, idx) => {
                    let cls = '';
                    if (idx < statusIdx) cls = 'done';
                    else if (idx === statusIdx) cls = 'active';
                    return (
                      <div key={s} className={`tl-item ${cls}`}>
                        <div className="tl-dot">{idx < statusIdx ? '✓' : ''}</div>
                        <div className="tl-label">{s}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
