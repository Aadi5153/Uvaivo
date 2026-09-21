import React, { useMemo } from 'react';
import Button from '../components/Button.jsx';
import { useApp } from '../context/AppContext.jsx';
import {
  formatCurrency, calculatePlatformFee, calculateDeliveryCharge,
} from '../utils/helpers.js';

export default function Checkout({ onBack, onProceedToPayment }) {
  const {
    cart, products, allStores, customer,
    adminSettings, deliverySettings,
  } = useApp();

  const items = useMemo(() => {
    return cart.map((i) => {
      const product = products.find((p) => p.id === i.productId);
      const store = product ? allStores.find((s) => s.id === product.storeId) : null;
      return { ...i, product, store };
    }).filter((i) => i.product);
  }, [cart, products, allStores]);

  // Group items by store to compute per-store delivery
  const storeGroups = useMemo(() => {
    const groups = {};
    items.forEach((i) => {
      if (!i.store) return;
      if (!groups[i.store.id]) {
        groups[i.store.id] = { store: i.store, items: [], subtotal: 0 };
      }
      groups[i.store.id].items.push(i);
      groups[i.store.id].subtotal += i.product.price * i.quantity;
    });
    return Object.values(groups);
  }, [items]);

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const platformFee = calculatePlatformFee(subtotal, adminSettings.platformFeePercent);

  const deliveryBreakdown = storeGroups.map((g) => ({
    storeName: g.store.name,
    distance: g.store.distance,
    charge: calculateDeliveryCharge(g.store.distance, deliverySettings.slabs),
  }));

  const totalDelivery = deliveryBreakdown.reduce((s, d) => s + d.charge, 0);
  const grandTotal = subtotal + platformFee + totalDelivery;

  const handleProceed = () => {
    onProceedToPayment({
      items,
      storeGroups,
      subtotal,
      platformFee,
      deliveryBreakdown,
      totalDelivery,
      grandTotal,
    });
  };

  return (
    <>
      <div className="page-header">
        <button className="back-btn" onClick={onBack} aria-label="Back">←</button>
        <div className="page-title">Checkout</div>
      </div>

      <div className="section" style={{ marginTop: 16 }}>
        <div className="section-header">
          <div className="section-title">Delivery Address</div>
          <span className="section-link">Edit</span>
        </div>
        <div className="card">
          <div style={{ fontSize: 14, fontWeight: 700 }}>{customer?.name || 'Customer'}</div>
          <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
            {customer?.address || 'Address not set'}
          </div>
          <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
            📍 {customer?.location || 'Balaghat, Madhya Pradesh'}
          </div>
          <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
            📱 +91 {customer?.mobile}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <div className="section-title">Order Items</div>
        </div>
        {items.map((i) => (
          <div key={i.productId} className="cart-item" style={{ padding: 12 }}>
            <div className="cart-item-img" style={{ width: 52, height: 52, fontSize: 24 }}>
              {i.product.image}
            </div>
            <div className="cart-item-body">
              <div className="cart-item-name">{i.product.name}</div>
              <div className="cart-item-store">
                {i.store?.name} · Qty {i.quantity}
              </div>
              <div className="cart-item-price">
                {formatCurrency(i.product.price * i.quantity)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="section">
        <div className="section-header">
          <div className="section-title">Bill Details</div>
        </div>
        <div className="bill-box">
          <div className="bill-row">
            <span className="bill-label">Item Total</span>
            <span className="bill-val">{formatCurrency(subtotal)}</span>
          </div>
          <div className="bill-row">
            <span className="bill-label">
              Platform Fee ({adminSettings.platformFeePercent}%)
            </span>
            <span className="bill-val">{formatCurrency(platformFee)}</span>
          </div>

          {deliveryBreakdown.map((d, idx) => (
            <div className="bill-row" key={idx}>
              <span className="bill-label">
                Delivery · {d.storeName} ({d.distance} km)
              </span>
              <span className="bill-val">{formatCurrency(d.charge)}</span>
            </div>
          ))}

          <div className="bill-row total">
            <span>Grand Total</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </div>

        <Button variant="primary" size="lg" full onClick={handleProceed}>
          Continue to Payment →
        </Button>
      </div>
    </>
  );
}
