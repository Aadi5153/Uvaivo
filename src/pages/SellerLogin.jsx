import React, { useState } from 'react';
import Logo from '../components/Logo.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { validateMobile } from '../utils/helpers.js';

export default function SellerLogin({ onBack, onOtpSent }) {
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');

  const handleSend = () => {
    const clean = mobile.trim();
    if (!validateMobile(clean)) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    onOtpSent(clean);
  };

  return (
    <div className="auth-page">
      <div className="auth-header-row">
        <button className="back-btn" onClick={onBack}>←</button>
      </div>

      <div className="auth-logo-center">
        <Logo size={64} />
        <h1 className="auth-title">Sell on Uvaivo</h1>
        <p className="auth-subtitle">Reach customers in your local area.</p>
      </div>

      <div className="auth-form">
        <Button
          variant="outline"
          size="md"
          full
          onClick={() => onOtpSent('9876543211')}
          icon="🇬"
        >
          Continue with Google
        </Button>

        <div className="divider">OR</div>

        <Input
          label="Mobile Number"
          value={mobile}
          onChange={(v) => {
            setMobile(v.replace(/\D/g, '').slice(0, 10));
            if (error) setError('');
          }}
          placeholder="Enter 10-digit mobile number"
          inputMode="numeric"
          maxLength={10}
          icon="📱"
          error={error}
        />

        <Button variant="primary" size="lg" full onClick={handleSend}>
          Send OTP
        </Button>
      </div>
    </div>
  );
}
