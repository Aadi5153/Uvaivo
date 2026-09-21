import React, { useState } from 'react';
import Button from '../components/Button.jsx';
import { useApp } from '../context/AppContext.jsx';
import { formatCurrency, generateOrderId } from '../utils/helpers.js';

const METHODS = [
  { id: 'upi', icon: '📱', label: 'UPI' },
  { id: 'qr', icon: '🔳', label: 'QR Code' },
  { id: 'online', icon: '💳', label: 'Online Payment' },
];

export default function Payment({ orderData, onBack, onSuccess }) {
  const { customer, placeOrder, addPayment, clearCart, showToast } = useApp();
  const [method, setMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    // Mock verification flow
    setTimeout(() => {
      const orderId = generateOrderId();

      const order = {
        id: orderId,
        customerId: customer?.id,
        customerName: customer?.name,
        items: orderData.items.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.image,
          storeId: i.store?.id,
          storeName: i.store?.name,
        })),
        storeGroups: orderData.storeGroups.map((g) => ({
          storeId: g.store.id,
          storeName: g.store.name,
          subtotal: g.subtotal,
        })),
        subtotal: orderData.subtotal,
        platformFee: orderData.platformFee,
        deliveryCharge: orderData.totalDelivery,
        total: orderData.grandTotal,
        address: customer?.address || '',
        location: customer?.location || '',
        mobile: customer?.mobile,
        status: 'Order Placed',
        date: new Date().toISOString(),
        paymentMethod: method,
      };

      placeOrder(order);

      addPayment({
        id: 'pay_' + Date.now(),
        orderId,
        userId: customer?.id,
        userName: customer?.name,
        amount: order.total,
        type: 'Order Payment',
        status: 'Success (Prototype)',
        date: new Date().toISOString(),
      });

      clearCart();
      setProcessing(false);
      showToast('Order placed successfully', 'success');
      onSuccess(order);
    }, 1400);
  };

  return (
    <>
      <div className="page-header">
        <button className="back-btn" onClick={onBack} aria-label="Back" disabled={processing}>
          ←
        </button>
        <div className="page-title">Payment</div>
      </div>

      <div className="section" style={{ marginTop: 16 }}>
        <div className="bill-box">
          <div className="bill-row total" style={{ borderTop: 'none', paddingTop: 0 }}>
            <span>Amount to Pay</span>
            <span>{formatCurrency(orderData.grandTotal)}</span>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <div className="section-title">Choose Payment Method</div>
        </div>
        {METHODS.map((m) => (
          <div
            key={m.id}
            className={`pay-option ${method === m.id ? 'active' : ''}`}
            onClick={() => !processing && setMethod(m.id)}
          >
            <div className="pay-radio" />
            <div className="pay-icon">{m.icon}</div>
            <div className="pay-label">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="section" style={{ marginBottom: 30 }}>
        <div className="terms" style={{ marginBottom: 12 }}>
          Prototype payment · No real transaction will occur.
        </div>
        <Button
          variant="primary"
          size="lg"
          full
          onClick={handlePay}
          disabled={processing}
        >
          {processing ? 'Verifying…' : `Pay ${formatCurrency(orderData.grandTotal)} & Place Order`}
        </Button>
      </div>
    </>
  );
}
