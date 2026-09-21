import React from 'react';
import { useApp } from '../context/AppContext.jsx';

const ITEMS = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'cart', icon: '🛒', label: 'Cart' },
  { id: 'orders', icon: '📦', label: 'Orders' },
  { id: 'profile', icon: '👤', label: 'Profile' },
];

export default function CustomerBottomNav({ active, onChange }) {
  const { cartCount } = useApp();
  return (
    <nav className="bottom-nav">
      {ITEMS.map((item) => (
        <div
          key={item.id}
          className={`nav-item ${active === item.id ? 'active' : ''}`}
          onClick={() => onChange(item.id)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
          {item.id === 'cart' && cartCount > 0 && (
            <span className="nav-badge">{cartCount}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
