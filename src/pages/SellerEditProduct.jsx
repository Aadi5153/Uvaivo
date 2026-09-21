import React, { useState } from 'react';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { useApp } from '../context/AppContext.jsx';
import { CATEGORIES } from '../data/seedData.js';

const PRODUCT_CATS = CATEGORIES.filter((c) => c.id !== 'all');

export default function SellerEditProduct({ product, onBack, onSaved }) {
  const { updateProduct, showToast } = useApp();
  const [form, setForm] = useState({
    name: product.name,
    price: String(product.price),
    category: product.category,
    description: product.description,
    stock: String(product.stock),
    available: product.available,
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim() || !form.price) {
      showToast('Name and price required', 'error');
      return;
    }
    updateProduct(product.id, {
      name: form.name.trim(),
      price: Number(form.price),
      category: form.category,
      description: form.description.trim(),
      stock: Number(form.stock),
      available: form.available,
    });
    showToast('Product updated', 'success');
    onSaved();
  };

  return (
    <>
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div className="page-title">Edit Product</div>
      </div>

      <div className="section" style={{ marginTop: 16 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="product-img" style={{ borderRadius: 16, height: 110, fontSize: 56, background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)' }}>
            {product.image}
          </div>
        </div>

        <Input label="Product Name" value={form.name} onChange={(v) => update('name', v)} />
        <Input label="Price (₹)" value={form.price} onChange={(v) => update('price', v.replace(/[^\d.]/g, ''))} inputMode="numeric" />

        <div className="input-group">
          <label className="input-label">Category</label>
          <div className="cat-scroll" style={{ margin: 0, padding: 0 }}>
            {PRODUCT_CATS.map((c) => (
              <div key={c.id} className={`cat-card ${form.category === c.id ? 'active' : ''}`} onClick={() => update('category', c.id)} style={{ minWidth: 72 }}>
                <div className="cat-icon">{c.icon}</div>
                <div className="cat-name">{c.name}</div>
              </div>
            ))}
          </div>
        </div>

        <Input label="Description" value={form.description} onChange={(v) => update('description', v)} multiline rows={3} />
        <Input label="Stock" value={form.stock} onChange={(v) => update('stock', v.replace(/\D/g, ''))} inputMode="numeric" />

        <div className="card" style={{ padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Available</div>
            <div onClick={() => update('available', !form.available)} style={{ width: 50, height: 28, borderRadius: 20, background: form.available ? '#16A34A' : '#E5E7EB', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: form.available ? 25 : 3, transition: 'left 0.2s' }} />
            </div>
          </div>
        </div>

        <div className="mt-16" style={{ marginBottom: 30 }}>
          <Button variant="primary" size="lg" full onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </>
  );
}
