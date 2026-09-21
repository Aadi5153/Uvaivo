import React, { useState } from 'react';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function CustomerProfilePage({ onLogout, onOpenOrders }) {
  const { customer, updateCustomer, showToast } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: customer?.name || '',
    address: customer?.address || '',
    location: customer?.location || '',
  });

  const handleSave = () => {
    if (!form.name.trim() || !form.address.trim()) {
      showToast('Name and address required', 'error');
      return;
    }
    updateCustomer(form);
    showToast('Profile updated', 'success');
    setEditing(false);
  };

  const useLocation = () => {
    setForm((f) => ({ ...f, location: 'Balaghat, Madhya Pradesh' }));
    showToast('Location updated', 'success');
  };

  return (
    <>
      <div className="profile-hero">
        <div className="profile-avatar">👤</div>
        <div className="profile-name">{customer?.name || 'Customer'}</div>
        <div className="profile-mobile">+91 {customer?.mobile}</div>
      </div>

      <div style={{ marginTop: -40 }}>
        {editing ? (
          <div className="section" style={{ marginTop: 0 }}>
            <div className="card">
              <Input
                label="Full Name"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                placeholder="Name"
              />
              <Input
                label="Address"
                value={form.address}
                onChange={(v) => setForm({ ...form, address: v })}
                placeholder="Address"
                multiline
                rows={2}
              />
              <Input
                label="Location"
                value={form.location}
                onChange={(v) => setForm({ ...form, location: v })}
                placeholder="City"
              />
              <Button variant="secondary" size="md" full onClick={useLocation}>
                📡 Use Current Location
              </Button>
              <div className="row mt-12">
                <Button variant="outline" size="md" full onClick={() => setEditing(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="md" full onClick={handleSave}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="menu-card">
            <div className="menu-item">
              <span className="menu-icon">📍</span>
              <span className="menu-label">{customer?.location || 'Balaghat, Madhya Pradesh'}</span>
            </div>
            <div className="menu-item">
              <span className="menu-icon">🏠</span>
              <span className="menu-label">{customer?.address || 'Address not set'}</span>
            </div>
          </div>
        )}

        <div className="menu-card">
          <div className="menu-item" onClick={() => setEditing(true)}>
            <span className="menu-icon">✏️</span>
            <span className="menu-label">Edit Profile</span>
            <span className="menu-arrow">›</span>
          </div>
          <div className="menu-item" onClick={onOpenOrders}>
            <span className="menu-icon">📦</span>
            <span className="menu-label">My Orders</span>
            <span className="menu-arrow">›</span>
          </div>
          <div className="menu-item" onClick={() => setEditing(true)}>
            <span className="menu-icon">🏠</span>
            <span className="menu-label">Saved Address</span>
            <span className="menu-arrow">›</span>
          </div>
          <div className="menu-item" onClick={() => setEditing(true)}>
            <span className="menu-icon">📍</span>
            <span className="menu-label">Change Location</span>
            <span className="menu-arrow">›</span>
          </div>
          <div className="menu-item">
            <span className="menu-icon">💬</span>
            <span className="menu-label">Help &amp; Support</span>
            <span className="menu-arrow">›</span>
          </div>
        </div>

        <div className="section" style={{ marginBottom: 30 }}>
          <Button variant="danger" size="lg" full onClick={onLogout}>
            🚪 Logout
          </Button>
        </div>
      </div>
    </>
  );
}
