import React, { useState } from 'react';
import Logo from '../components/Logo.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function AdminLogin({ onBack, onSuccess }) {
  const { loginAdmin, showToast } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      setError('Enter username and password');
      return;
    }
    const ok = loginAdmin(username.trim(), password.trim());
    if (ok) {
      showToast('Welcome, Admin', 'success');
      onSuccess();
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-header-row">
        <button className="back-btn" onClick={onBack}>←</button>
      </div>

      <div className="auth-logo-center">
        <Logo size={64} />
        <h1 className="auth-title">Uvaivo Admin</h1>
        <p className="auth-subtitle">Secure admin access</p>
      </div>

      <div className="auth-form">
        <Input
          label="Username"
          value={username}
          onChange={(v) => { setUsername(v); if (error) setError(''); }}
          placeholder="Enter username"
          icon="👤"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(v) => { setPassword(v); if (error) setError(''); }}
          placeholder="Enter password"
          icon="🔒"
          error={error}
        />

        <Button variant="primary" size="lg" full onClick={handleLogin}>
          Login
        </Button>

        <div className="terms" style={{ marginTop: 20 }}>
          <b style={{ color: '#2563EB' }}>Demo credentials</b>
          <br />
          Username: <b>admin</b> · Password: <b>admin123</b>
        </div>
      </div>
    </div>
  );
}
