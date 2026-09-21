import React from 'react';

export default function Logo({ size = 48, showText = false, textSize = 22 }) {
  return (
    <div className="logo-wrap" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div
        className="logo-icon"
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.28,
          background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 18px rgba(37, 99, 235, 0.28)',
          flexShrink: 0,
        }}
      >
        <svg
          width={size * 0.58}
          height={size * 0.58}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 7h12l-1 12H7L6 7z"
            stroke="#fff"
            strokeWidth="2"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M9 7a3 3 0 0 1 6 0"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
      {showText && (
        <div style={{ fontSize: textSize, fontWeight: 800, color: '#172033', letterSpacing: -0.5 }}>
          Uvaivo
        </div>
      )}
    </div>
  );
}
