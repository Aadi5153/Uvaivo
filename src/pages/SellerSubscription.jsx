import React, { useState } from 'react';
import Logo from '../components/Logo.jsx';
import Button from '../components/Button.jsx';
import { useApp } from '../context/AppContext.jsx';
import { SUBSCRIPTION_PLAN } from '../data/seedData.js';
import { formatCurrency } from '../utils/helpers.js';

const BENEFITS = [
  'List products',
  'Receive customer orders',
  'Manage your store',
  'Seller dashboard',
];

export default function SellerSubscription({ seller, onActivated, onLogout }) {
  const { activateSubscription, addPayment, showToast } = useApp();
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      const sub = activateSubscription(seller.id);
      addPayment({
        id: 'pay_sub_' + Date.now(),
        orderId: null,
        userId: seller.id,
        userName: `${seller.firstName} ${seller.surname}`,
        amount: SUBSCRIPTION_PLAN.price,
        type: 'Seller Subscription',
        status: 'Success (Prototype)',
        date: new Date().toISOString(),
      });
      showToast('Subscription activated', 'success');
      setProcessing(false);
      onActivated(sub);
    }, 1200);
  };

  return (
    <div className="auth-page">
      <div className="auth-header-row">
        <button className="back-btn" onClick={onLogout}>←</button>
      </div>

      <div className="auth-logo-center" style={{ marginBottom: 20 }}>
        <Logo size={64} />
        <h1 className="auth-title">Activate Your Seller Plan</h1>
        <p className="auth-subtitle">{seller.storeName}</p>
      </div>

      <div className="card mt-16" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 44, fontWeight: 800, color: '#2563EB' }}>
          {formatCurrency(SUBSCRIPTION_PLAN.price)}
        </div>
        <div style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>
          for {SUBSCRIPTION_PLAN.durationMonths} months
        </div>

        <div style={{ marginTop: 20, textAlign: 'left' }}>
          {BENEFITS.map((b) => (
            <div
              key={b}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 0',
                fontSize: 14,
                color: '#172033',
              }}
            >
              <span style={{ color: '#16A34A', fontWeight: 800 }}>✓</span>
              <span>{b}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <Button
          variant="primary"
          size="lg"
          full
          onClick={handlePay}
          disabled={processing}
        >
          {processing ? 'Processing…' : `Pay ${formatCurrency(SUBSCRIPTION_PLAN.price)}`}
        </Button>
      </div>

      <div className="terms" style={{ marginTop: 16 }}>
        <b style={{ color: '#F59E0B' }}>⚠ Prototype Payment</b>
        <br />
        No real transaction will occur.
      </div>
    </div>
  );
}
