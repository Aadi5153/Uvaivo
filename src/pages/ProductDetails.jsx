import React, { useState } from 'react';
import Button from '../components/Button.jsx';
import { useApp } from '../context/AppContext.jsx';
import { formatCurrency } from '../utils/helpers.js';

export default function ProductDetails({ product, onBack, onOpenStore, onBuyNow }) {
  const { allStores, addToCart, showToast } = useApp();
  const [qty, setQty] = useState(1);

  const store = allStores.find((s) => s.id === product.storeId);

  const handleAddToCart = () => {
    addToCart(product.id, qty);
    showToast(`${product.name} × ${qty} added to cart`, 'success');
  };

  const handleBuyNow = () => {
    addToCart(product.id, qty);
    onBuyNow();
  };

  return (
    <>
      <div className="page-header">
        <button className="back-btn" onClick={onBack} aria-label="Back">←</button>
        <div className="page-title">Product Details</div>
      </div>

      <div className="pd-img">{product.image}</div>

      <div className="pd-body">
        <div className="pd-name">{product.name}</div>
        {store && (
          <div className="pd-store" onClick={() => onOpenStore(store)}>
            {store.logo} {store.name} →
          </div>
        )}
        <div className="pd-price">{formatCurrency(product.price)}</div>

        <div className="pd-meta">
          <span className="pd-chip">{product.category}</span>
          <span className="pd-chip">Stock: {product.stock}</span>
          <span className="pd-chip available">
            {product.available ? 'Available' : 'Out of Stock'}
          </span>
        </div>

        <div className="pd-desc">{product.description}</div>

        <div className="pd-qty-row">
          <div className="pd-qty-label">Quantity</div>
          <div className="qty-ctrl">
            <button
              className="qty-btn"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
            >
              −
            </button>
            <span className="qty-val">{qty}</span>
            <button
              className="qty-btn"
              onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
              disabled={qty >= product.stock}
            >
              +
            </button>
          </div>
        </div>

        {store && (
          <div className="card mt-16">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                className="store-logo"
                style={{ background: store.color + '22', width: 44, height: 44, fontSize: 22 }}
              >
                {store.logo}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{store.name}</div>
                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                  📍 {store.location}
                </div>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onOpenStore(store)}
              >
                View Store
              </button>
            </div>
          </div>
        )}

        <div className="row mt-16">
          <Button
            variant="outline"
            size="lg"
            full
            onClick={handleAddToCart}
            disabled={!product.available}
          >
            Add to Cart
          </Button>
          <Button
            variant="primary"
            size="lg"
            full
            onClick={handleBuyNow}
            disabled={!product.available}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </>
  );
}
