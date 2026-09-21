import React, { useState } from 'react';
import Logo from '../components/Logo.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { useApp } from '../context/AppContext.jsx';
import { generateId } from '../utils/helpers.js';

export default function SellerRegistration({ mobile, onDone }) {
  const { registerSeller, allStores, setAllStores, showToast } = useApp();
  const [form, setForm] = useState({
    firstName: '', surname: '', storeName: '',
    storeAddress: '', storeLocation: '', storeLogo: '🏪',
  });
  const [errors, setErrors] = useState({});
  const [locating, setLocating] = useState(false);

  const update = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors({ ...errors, [k]: '' });
  };

  const useLocation = () => {
    setLocating(true);
    setTimeout(() => {
      update('storeLocation', 'Balaghat, Madhya Pradesh');
      setLocating(false);
      showToast('Location set', 'success');
    }, 700);
  };

  const chooseLogo = () => {
    const options = ['🏪', '🛒', '🥬', '🍎', '👕', '🌾', '🍞', '💊'];
    const next = options[(options.indexOf(form.storeLogo) + 1) % options.length];
    update('storeLogo', next);
  };

  const handleContinue = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.surname.trim()) e.surname = 'Required';
    if (!form.storeName.trim()) e.storeName = 'Required';
    if (!form.storeAddress.trim()) e.storeAddress = 'Required';
    if (!form.storeLocation.trim()) e.storeLocation = 'Required';
    setErrors(e);
    if (Object.keys(e).length) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    const seller = registerSeller({
      firstName: form.firstName.trim(),
      surname: form.surname.trim(),
      mobile,
      storeName: form.storeName.trim(),
      storeAddress: form.storeAddress.trim(),
      storeLocation: form.storeLocation.trim(),
      storeLogo: form.storeLogo,
    });

    // Register store too
    const newStore = {
      id: 'store_' + Date.now(),
      sellerId: seller.id,
      name: form.storeName.trim(),
      category: 'grocery',
      location: form.storeLocation.trim(),
      address: form.storeAddress.trim(),
      logo: form.storeLogo,
      color: '#2563EB',
      open: true,
      rating: 5.0,
      distance: 1.0,
    };
    setAllStores((s) => [...s, newStore]);

    onDone(seller);
  };

  return (
    <div className="auth-page">
      <div className="auth-logo-center" style={{ marginBottom: 16 }}>
        <Logo size={56} />
        <h1 className="auth-title">Register your store</h1>
        <p className="auth-subtitle">Tell us about your business</p>
      </div>

      <div className="auth-form">
        <div className="row">
          <div style={{ flex: 1 }}>
            <Input
              label="First Name"
              value={form.firstName}
              onChange={(v) => update('firstName', v)}
              placeholder="First name"
              error={errors.firstName}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Input
              label="Surname"
              value={form.surname}
              onChange={(v) => update('surname', v)}
              placeholder="Surname"
              error={errors.surname}
            />
          </div>
        </div>

        <Input
          label="Store Name"
          value={form.storeName}
          onChange={(v) => update('storeName', v)}
          placeholder="e.g. Sharma General Store"
          icon="🏪"
          error={errors.storeName}
        />

        <Input
          label="Store Address"
          value={form.storeAddress}
          onChange={(v) => update('storeAddress', v)}
          placeholder="Shop / Street / Area"
          icon="🏠"
          error={errors.storeAddress}
          multiline
          rows={2}
        />

        <Input
          label="Store Location"
          value={form.storeLocation}
          onChange={(v) => update('storeLocation', v)}
          placeholder="City / Town"
          icon="📍"
          error={errors.storeLocation}
        />

        <Button
          variant="secondary"
          size="md"
          full
          onClick={useLocation}
          disabled={locating}
          icon="📡"
        >
          {locating ? 'Detecting…' : 'Choose Store Location'}
        </Button>

        <div className="card mt-16">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              className="store-logo"
              style={{ background: '#EFF6FF', width: 56, height: 56, fontSize: 28, cursor: 'pointer' }}
              onClick={chooseLogo}
            >
              {form.storeLogo}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Store Logo</div>
              <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                Tap to change icon
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <Button variant="primary" size="lg" full onClick={handleContinue}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
