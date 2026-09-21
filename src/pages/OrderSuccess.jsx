import React from 'react';
import Button from '../components/Button.jsx';
import { formatCurrency } from '../utils/helpers.js';

export default function OrderSuccess({ order, onTrackOrder, onContinueShopping }) {
  const storeNames = [...new Set(order.items.map((i) => i.storeName))].join(', ');

  return (
    <div className="success-page">
      <div className="success-icon">✅</div>
      <div className="success-title">Order Placed Successfully</div>
      <div className="success-orderid">
        Order ID: <b>{order.id}</b>
      </div>

      <div className="bill-box" style={{ marginTop: 24, textAlign: 'left' }}>
        <div className="bill-row">
          <span className="bill-label">Store</span>
          <span className="bill-val">{storeNames}</span>
        </div>
        <div className="bill-row">
          <span className="bill-label">Items</span>
          <span className="bill-val">{order.items.length}</span>
        </div>
        <div className="bill-row">
          <span className="bill-label">Total</span>
          <span className="bill-val">{formatCurrency(order.total)}</span>
        </div>
        <div className="bill-row">
          <span className="bill-label">Delivery Address</span>
          <span className="bill-val" style={{ textAlign: 'right', maxWidth: 180 }}>
            {order.address}
          </span>
        </div>
      </div>

      <div className="row mt-16" style={{ gap: 10 }}>
        <Button variant="outline" size="lg" full onClick={onTrackOrder}>
          Track Order
        </Button>
        <Button variant="primary" size="lg" full onClick={onContinueShopping}>
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
