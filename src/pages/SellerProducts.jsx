import React from 'react';
import Button from '../components/Button.jsx';
import { useApp } from '../context/AppContext.jsx';
import { formatCurrency } from '../utils/helpers.js';

export default function SellerProducts({ seller, onBack, onAdd, onEdit }) {
  const { products, deleteProduct, showToast } = useApp();

  const myProducts = products.filter((p) => p.sellerId === seller.id);

  const handleDelete = (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    deleteProduct(p.id);
    showToast('Product deleted', 'info');
  };

  return (
    <>
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div className="page-title">My Products</div>
        <button
          className="btn btn-primary btn-sm"
          style={{ marginLeft: 'auto' }}
          onClick={onAdd}
        >
          + Add
        </button>
      </div>

      <div className="section" style={{ marginTop: 16 }}>
        {myProducts.length === 0 ? (
          <div className="empty-state" style={{ paddingTop: 60 }}>
            <div className="empty-icon">📦</div>
            <div className="empty-title">No products yet</div>
            <div className="empty-sub">List your first product to start selling.</div>
            <Button variant="primary" size="md" onClick={onAdd}>
              + Add Product
            </Button>
          </div>
        ) : (
          myProducts.map((p) => (
            <div key={p.id} className="cart-item" style={{ padding: 12 }}>
              <div className="cart-item-img">{p.image}</div>
              <div className="cart-item-body">
                <div className="cart-item-name">{p.name}</div>
                <div className="cart-item-store">
                  {p.category} · Stock {p.stock}
                </div>
                <div className="cart-item-price">{formatCurrency(p.price)}</div>
                <div style={{ marginTop: 6 }}>
                  <span className={`status-pill ${!p.available ? 'closed' : ''}`}>
                    {p.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => onEdit(p)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(p)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
