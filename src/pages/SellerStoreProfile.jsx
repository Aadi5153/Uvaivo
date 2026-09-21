import React, { useState } from 'react';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { useApp } from '../context/AppContext.jsx';
import { isExpired, formatDate } from '../utils/helpers.js';

export default function SellerStoreProfile({ seller, subscription, onBack }) {
  const { allStores, setAllStores, updateSeller, showToast } = useApp();
  const [editing, setEditing] = useState(false);

  const myStore = allStores.find((s) => s.sellerId === seller.id);

  const [form, setForm] = useState({
    storeName: myStore?.name || seller.storeName,
    storeAddress: myStore?.address || seller.storeAddress,
    storeLocation: myStore?.location || seller.storeLocation,
    storeLogo: myStore?.logo || seller.storeLogo,
  });

  const subActive = subscription && !isExpired(subscription.expiryDate);

  const handleSave = () => {
    if (!form.storeName.trim() || !form.storeAddress.trim()) {
      showToast('Store name and address required', 'error');
      return;
    }
    // update store
    setAllStores((stores) =>
      stores.map((s) =>
        s.sellerId === seller.id
          ? {
              ...s,
              name: form.storeName.trim(),
              address: form.storeAddress.trim(),
              location: form.storeLocation.trim(),
              logo: form.storeLogo,
            }
          : s
      )
    );
    // update seller
    updateSeller({
      storeName: form.storeName.trim(),
      storeAddress: form.storeAddress.trim(),
      storeLocation: form.storeLocation.trim(),
      storeLogo: form.storeLogo,
    });
    showToast('Store profile updated', 'success');
    setEditing(false);
  };

  const useLocation = () => {
    setForm((f) => ({ ...f, storeLocation: 'Balaghat, Madhya Pradesh' }));
    showToast('Location updated', 'success');
  };

  const cycleLogo = () => {
    const options = ['🏪', '🛒', '🥬', '🍎', '👕', '🌾', '🍞', '💊'];
    const idx = options.indexOf(form.storeLogo);
    setForm((f) => ({ ...f, storeLogo: options[(idx + 1) % options.length] }));
  };

  return (
    <>
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div className="page-title">Store Profile</div>
      </div>

      {!editing ? (
        <>
          <div
            className="store-banner"
            style={{ background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)' }}
          >
            <div className="store-banner-logo">{form.storeLogo}</div>
          </div>
          <div className="store-detail-info">
            <div className="store-detail-name">{form.storeName}</div>
            <div className="store-detail-meta">
              Owner: {seller.firstName} {seller.surname}
            </div>
            <div className="store-detail-meta">📱 +91 {seller.mobile}</div>
            <div className="store-detail-meta">📍 {form.storeLocation}</div>
            <div className="store-detail-meta">🏠 {form.storeAddress}</div>

            <div className="mt-12">
              <span className={`status-pill ${!subActive ? 'closed' : ''}`}>
                {subActive
                  ? `Subscription Active · till ${formatDate(subscription.expiryDate)}`
                  : 'Subscription Inactive'}
              </span>
            </div>
          </div>

          <div className="section" style={{ marginTop: 16 }}>
            <Button variant="primary" size="lg" full onClick={() => setEditing(true)}>
              ✏️ Edit Store
            </Button>
          </div>
        </>
      ) : (
        <div className="section" style={{ marginTop: 16 }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div
              className="store-logo"
              style={{
                background: '#EFF6FF', width: 72, height: 72, fontSize: 36,
                margin: '0 auto', cursor: 'pointer',
              }}
              onClick={cycleLogo}
            >
              {form.storeLogo}
            </div>
            <div style={{ fontSize: 12, color: '#6B7280', marginTop: 8 }}>
              Tap to change logo
            </div>
          </div>

          <Input
            label="Store Name"
            value={form.storeName}
            onChange={(v) => setForm({ ...form, storeName: v })}
          />
          <Input
            label="Store Address"
            value={form.storeAddress}
            onChange={(v) => setForm({ ...form, storeAddress: v })}
            multiline
            rows={2}
          />
          <Input
            label="Store Location"
            value={form.storeLocation}
            onChange={(v) => setForm({ ...form, storeLocation: v })}
          />

          <Button variant="secondary" size="md" full onClick={useLocation}>
            📡 Update Location
          </Button>

          <div className="row mt-16">
            <Button variant="outline" size="lg" full onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="lg" full onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
