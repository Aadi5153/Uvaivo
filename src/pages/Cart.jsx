import React, { useMemo } from 'react';
import Button from '../components/Button.jsx';
import { useApp } from '../context/AppContext.jsx';
import { formatCurrency, calculatePlatformFee } from '../utils/helpers.js';

export default function Cart({ onContinueShopping, onCheckout }) {
  const {
    cart, products, allStores,
    updateCartQty, removeFromCart, showToast, adminSettings,
  } = useApp();

  const items = useMemo(() => {
    return cart.map((i) => {
      const product = products.find((p) => p.id === i.productId);
      const store = product ? allStores.find((s) => s.id === product.storeId) : null;
      return { ...i, product, store };
    }).filter((i) => i.product);
  }, [cart, products, allStores]);

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const platformFee = calculatePlatformFee(subtotal, adminSettings.platformFeePercent);

  const handleRemove = (productId, name) => {
    removeFromCart(productId);
    showToast(`${name} removed from cart`, 'info');
  };

  if (items.length === 0) {
    return (
      <>
        <div className="page-header">
          <div className="page-title">My Cart</div>
        </div>
        <div className="empty-state" style={{ paddingTop: 80 }}>
          <div className="empty-icon">🛒</div>
          <div className="empty-title">Your cart is empty</div>
          <div className="empty-sub">Browse products and add items to your cart.</div>
          <Button variant="primary" size="md" onClick={onContinueShopping}>
            Continue Shopping
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <div className="page-title">My Cart</div>
        <span className="section-link" style={{ marginLeft: 'auto' }}>
          {items.length} item{items.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="section" style={{ marginTop: 16 }}>
        {items.map((item) => (
          <div key={item.productId} className="cart-item">
            <div className="cart-item-img">{item.product.image}</div>
            <div className="cart-item-body">
              <div className="cart-item-name">{item.product.name}</div>
              <div className="cart-item-store">{item.store?.name || 'Store'}</div>
              <div className="cart-item-price">
                {formatCurrency(item.product.price * item.quantity)}
              </div>
              <div className="qty-ctrl">
                <button
                  className="qty-btn"
                  onClick={() => updateCartQty(item.productId, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  −
                </button>
                <span className="qty-val">{item.quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => updateCartQty(item.productId, item.quantity + 1)}
                  disabled={item.quantity >= item.product.stock}
                >
                  +
                </button>
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(item.productId, item.product.name)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="section">
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
          <div className="bill-row">
            <span className="bill-label">Delivery</span>
            <span className="bill-val" style={{ color: '#6B7280', fontSize: 12 }}>
              Calculated at checkout
            </span>
          </div>
        </div>

        <Button variant="primary" size="lg" full onClick={onCheckout}>
          Proceed to Checkout →
        </Button>
      </div>
    </>
  );
}
