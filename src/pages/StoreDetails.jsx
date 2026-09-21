import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { formatCurrency } from '../utils/helpers.js';

export default function StoreDetails({ store, onBack, onOpenProduct }) {
  const { products, addToCart, showToast } = useApp();
  const [search, setSearch] = useState('');

  const storeProducts = useMemo(() => {
    let list = products.filter((p) => p.storeId === store.id);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    return list;
  }, [products, store.id, search]);

  const handleAdd = (e, p) => {
    e.stopPropagation();
    addToCart(p.id, 1);
    showToast(`${p.name} added to cart`, 'success');
  };

  return (
    <>
      <div className="page-header" style={{ background: 'transparent', borderBottom: 'none', position: 'absolute', width: '100%' }}>
        <button
          className="back-btn"
          onClick={onBack}
          aria-label="Back"
          style={{ background: 'rgba(255,255,255,0.9)' }}
        >
          ←
        </button>
      </div>

      <div
        className="store-banner"
        style={{ background: `linear-gradient(135deg, ${store.color} 0%, ${store.color}CC 100%)` }}
      >
        <div className="store-banner-logo">{store.logo}</div>
      </div>

      <div className="store-detail-info">
        <div className="store-detail-name">{store.name}</div>
        <div className="store-detail-meta">
          📍 {store.location} · ⭐ {store.rating} · {store.distance} km
        </div>
        <div className="mt-8">
          <span className={`status-pill ${!store.open ? 'closed' : ''}`}>
            {store.open ? 'Open Now' : 'Closed'}
          </span>
        </div>

        <div className="search-bar-wrap mt-16">
          <span className="search-icon-fixed">🔍</span>
          <input
            className="search-bar"
            style={{ background: '#F1F5F9', boxShadow: 'none' }}
            placeholder="Search in this store..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="section" style={{ marginBottom: 30 }}>
        <div className="section-header">
          <div className="section-title">Products ({storeProducts.length})</div>
        </div>
        {storeProducts.length === 0 ? (
          <div className="empty-state" style={{ padding: 40 }}>
            <div className="empty-icon">📦</div>
            <div className="empty-title">No products found</div>
            <div className="empty-sub">This store hasn't listed any products yet.</div>
          </div>
        ) : (
          <div className="product-grid">
            {storeProducts.map((p) => (
              <div
                key={p.id}
                className="product-card"
                onClick={() => onOpenProduct(p)}
              >
                <div className="product-img">{p.image}</div>
                <div className="product-body">
                  <div className="product-name">{p.name}</div>
                  <div className="product-bottom">
                    <div className="product-price">{formatCurrency(p.price)}</div>
                    <button className="add-btn" onClick={(e) => handleAdd(e, p)}>
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
