import React, { useState, useMemo } from 'react';
import Logo from '../components/Logo.jsx';
import { useApp } from '../context/AppContext.jsx';
import { CATEGORIES } from '../data/seedData.js';
import { formatCurrency } from '../utils/helpers.js';

export default function CustomerHome({ onOpenStore, onOpenProduct, onOpenProfile }) {
  const { customer, allStores, products, addToCart, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => p.available);
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          allStores.find((s) => s.id === p.storeId)?.name.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, selectedCategory, search, allStores]);

  const visibleStores = useMemo(() => {
    if (selectedCategory === 'all') return allStores;
    return allStores.filter((s) => s.category === selectedCategory);
  }, [allStores, selectedCategory]);

  const getStore = (id) => allStores.find((s) => s.id === id);

  const handleAdd = (e, product) => {
    e.stopPropagation();
    addToCart(product.id, 1);
    showToast(`${product.name} added to cart`, 'success');
  };

  return (
    <>
      <div className="home-header">
        <div className="home-header-top">
          <Logo size={38} showText textSize={20} />
          <button
            className="profile-icon-btn"
            onClick={onOpenProfile}
            aria-label="Profile"
          >
            👤
          </button>
        </div>
        <div className="deliver-info">
          <span>📍</span>
          <span className="deliver-label">Deliver to</span>
          <span className="deliver-loc">{customer?.location || 'Balaghat, Madhya Pradesh'}</span>
        </div>
      </div>

      <div className="hero-banner">
        <div className="hero-title">Shop Local.<br />Get It Delivered.</div>
        <div className="hero-sub">Discover products from stores near you.</div>
        <div className="search-bar-wrap">
          <span className="search-icon-fixed">🔍</span>
          <input
            className="search-bar"
            placeholder="Search products, categories or stores..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <div className="section-title">Shop by Category</div>
        </div>
        <div className="cat-scroll">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className={`cat-card ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <div className="cat-icon">{cat.icon}</div>
              <div className="cat-name">{cat.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <div className="section-title">Nearby Stores</div>
        </div>
        {visibleStores.length === 0 ? (
          <div className="empty-state" style={{ padding: 30 }}>
            <div className="empty-icon">🏪</div>
            <div className="empty-title">No stores in this category</div>
          </div>
        ) : (
          visibleStores.map((store) => (
            <div
              key={store.id}
              className="store-card"
              onClick={() => onOpenStore(store)}
            >
              <div className="store-head">
                <div className="store-logo" style={{ background: store.color + '22' }}>
                  {store.logo}
                </div>
                <div className="store-info">
                  <div className="store-name">{store.name}</div>
                  <div className="store-meta">📍 {store.location}</div>
                  <div className="store-meta">⭐ {store.rating} · {store.distance} km</div>
                </div>
              </div>
              <div className="store-foot">
                <span className={`status-pill ${!store.open ? 'closed' : ''}`}>
                  {store.open ? 'Open Now' : 'Closed'}
                </span>
                <span className="section-link">View Store →</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="section" style={{ marginBottom: 20 }}>
        <div className="section-header">
          <div className="section-title">
            {search ? 'Search Results' : 'Popular Products'}
          </div>
          {search && (
            <span className="section-link" onClick={() => setSearch('')}>Clear</span>
          )}
        </div>
        {filteredProducts.length === 0 ? (
          <div className="empty-state" style={{ padding: 40 }}>
            <div className="empty-icon">🔍</div>
            <div className="empty-title">No products found</div>
            <div className="empty-sub">Try a different search or category.</div>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((p) => {
              const store = getStore(p.storeId);
              return (
                <div
                  key={p.id}
                  className="product-card"
                  onClick={() => onOpenProduct(p)}
                >
                  <div className="product-img">{p.image && p.image.startsWith("http") ? <img src={p.image} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}} /> : (p.image || "📦")}</div>
                  <div className="product-body">
                    <div className="product-name">{p.name}</div>
                    <div className="product-store">{store?.name || 'Store'}</div>
                    <div className="product-bottom">
                      <div className="product-price">{formatCurrency(p.price)}</div>
                      <button
                        className="add-btn"
                        onClick={(e) => handleAdd(e, p)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
