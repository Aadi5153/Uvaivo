import React, { useState } from 'react';
import Logo from '../components/Logo.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { validateMobile } from '../utils/helpers.js';

export default function CustomerLogin({ onBack, onOtpSent }) {
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');

  const handleSendOtp = () => {
    const clean = mobile.trim();
    if (!clean) {
      setError('Please enter your mobile number');
      return;
    }
    if (!validateMobile(clean)) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    onOtpSent(clean);
  };

  const handleGoogle = () => {
    // Mock Google login — structure ready for real OAuth
    onOtpSent('9876543210');
  };

  return (
    <div className="auth-page">
      <div className="auth-header-row">
        <button className="back-btn" onClick={onBack} aria-label="Back">←</button>
      </div>

      <div className="auth-logo-center">
        <Logo size={64} />
        <h1 className="auth-title">Welcome to Uvaivo</h1>
        <p className="auth-subtitle">Login to shop from local stores</p>
      </div>

      <div className="auth-form">
        <Button variant="outline" size="md" full onClick={handleGoogle} icon="🇬">
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

        <Button variant="primary" size="lg" full onClick={handleSendOtp}>
          Send OTP
        </Button>

        <div className="terms">
          By continuing, you agree to Uvaivo's{' '}
          <a href="#terms">Terms</a> & <a href="#privacy">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
}
