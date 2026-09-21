import React, { useState, useRef, useEffect } from 'react';
import Logo from '../components/Logo.jsx';
import Button from '../components/Button.jsx';
import { validateOtp } from '../utils/helpers.js';

export default function OTPVerification({ mobile, onBack, onVerified }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const inputsRef = useRef([]);

  useEffect(() => {
    if (inputsRef.current[0]) inputsRef.current[0].focus();
  }, []);

  const handleChange = (idx, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    if (error) setError('');
    if (digit && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    if (!validateOtp(code)) {
      setError('Invalid OTP. Try 123456');
      return;
    }
    setError('');
    onVerified();
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    inputsRef.current[0]?.focus();
  };

  return (
    <div className="auth-page">
      <div className="auth-header-row">
        <button className="back-btn" onClick={onBack} aria-label="Back">←</button>
      </div>

      <div className="auth-logo-center">
        <Logo size={56} />
        <h1 className="auth-title">Verify your mobile</h1>
        <p className="auth-subtitle">
          Enter the 6-digit OTP sent to<br />
          <b style={{ color: '#172033' }}>+91 {mobile}</b>
        </p>
      </div>

      <div className="otp-boxes">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputsRef.current[idx] = el)}
            className={`otp-box ${digit ? 'filled' : ''}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            aria-label={`OTP digit ${idx + 1}`}
          />
        ))}
      </div>

      {error && (
        <div className="input-error-msg" style={{ textAlign: 'center', marginBottom: 12 }}>
          {error}
        </div>
      )}

      <Button variant="primary" size="lg" full onClick={handleVerify}>
        Verify &amp; Continue
      </Button>

      <div className="resend-row">
        Didn't receive?{' '}
        <button className="resend-btn" onClick={handleResend}>Resend OTP</button>
      </div>

      <div className="terms" style={{ marginTop: 24 }}>
        Demo OTP: <b style={{ color: '#2563EB' }}>123456</b>
      </div>
    </div>
  );
}
