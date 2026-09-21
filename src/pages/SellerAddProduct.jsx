import React, { useState } from 'react';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { useApp } from '../context/AppContext.jsx';
import { CATEGORIES } from '../data/seedData.js';
import { generateId, isExpired } from '../utils/helpers.js';

const PRODUCT_CATS = CATEGORIES.filter((c) => c.id !== 'all');
const EMOJIS = ['🍚', '🍅', '👕', '🍎', '🌾', '🍌', '🥔', '👖', '🥬', '🧅', '🥕', '🍞'];

export default function SellerAddProduct({ seller, subscription, onBack, onSaved }) {
  const { allStores, addProduct, showToast } = useApp();
  const [form, setForm] = useState({
    name: '', price: '', category: 'grocery',
    description: '', stock: '', available: true,
    image: '🍚',
  });
  const [errors, setErrors] = useState({});

  const myStore = allStores.find((s) => s.sellerId === seller.id);
  const subActive = subscription && !isExpired(subscription.expiryDate);

  if (!subActive) {
    return (
      <>
        <div className="page-header">
          <button className="back-btn" onClick={onBack}>←</button>
          <div className="page-title">Add Product</div>
        </div>
        <div className="empty-state" style={{ paddingTop: 60 }}>
          <div className="empty-icon">🔒</div>
          <div className="empty-title">Subscription Required</div>
          <div className="empty-sub">
            Activate your seller plan to list products.
          </div>
        </div>
      </>
    );
  }

  const update = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors({ ...errors, [k]: '' });
  };

  const cycleImage = () => {
    const idx = EMOJIS.indexOf(form.image);
    update('image', EMOJIS[(idx + 1) % EMOJIS.length]);
  };

  const handleSave = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Product name required';
    if (!form.price || Number(form.price) <= 0) e.price = 'Enter valid price';
    if (!form.stock || Number(form.stock) < 0) e.stock = 'Enter stock';
    setErrors(e);
    if (Object.keys(e).length) {
      showToast('Please fix the errors', 'error');
      return;
    }

    const product = {
      id: generateId('prod'),
      sellerId: seller.id,
      storeId: myStore?.id,
      name: form.name.trim(),
      price: Number(form.price),
      category: form.category,
      image: form.image,
      description: form.description.trim() || 'No description',
      stock: Number(form.stock),
      available: form.available,
    };

    addProduct(product);
    showToast('Product listed successfully', 'success');
    onSaved();
  };

  return (
    <>
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div className="page-title">Add Product</div>
      </div>

      <div className="section" style={{ marginTop: 16 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div
            className="product-img"
            style={{
              borderRadius: 16, cursor: 'pointer', height: 120, fontSize: 60,
              background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
            }}
            onClick={cycleImage}
          >
            {form.image}
          </div>
          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 8 }}>
            Tap to change product icon
          </div>
        </div>

        <Input
          label="Product Name"
          value={form.name}
          onChange={(v) => update('name', v)}
          placeholder="e.g. Basmati Rice 1kg"
          error={errors.name}
        />

        <Input
          label="Price (₹)"
          value={form.price}
          onChange={(v) => update('price', v.replace(/[^\d.]/g, ''))}
          placeholder="0"
          inputMode="numeric"
          error={errors.price}
        />

        <div className="input-group">
          <label className="input-label">Category</label>
          <div className="cat-scroll" style={{ margin: 0, padding: 0 }}>
            {PRODUCT_CATS.map((c) => (
              <div
                key={c.id}
                className={`cat-card ${form.category === c.id ? 'active' : ''}`}
                onClick={() => update('category', c.id)}
                style={{ minWidth: 72 }}
              >
                <div className="cat-icon">{c.icon}</div>
                <div className="cat-name">{c.name}</div>
              </div>
            ))}
          </div>
        </div>

        <Input
          label="Description"
          value={form.description}
          onChange={(v) => update('description', v)}
          placeholder="Short description"
          multiline
          rows={3}
        />

        <Input
          label="Stock"
          value={form.stock}
          onChange={(v) => update('stock', v.replace(/\D/g, ''))}
          placeholder="e.g. 50"
          inputMode="numeric"
          error={errors.stock}
        />

        <div className="card" style={{ padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Available</div>
            <div
              onClick={() => update('available', !form.available)}
              style={{
                width: 50, height: 28, borderRadius: 20,
                background: form.available ? '#16A34A' : '#E5E7EB',
                position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
              }}
            >
              <div
                style={{
                  width: 22, height: 22, borderRadius: '50%', background: '#fff',
                  position: 'absolute', top: 3,
                  left: form.available ? 25 : 3, transition: 'left 0.2s',
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-16" style={{ marginBottom: 30 }}>
          <Button variant="primary" size="lg" full onClick={handleSave}>
            List Product
          </Button>
        </div>
      </div>
    </>
  );
}
