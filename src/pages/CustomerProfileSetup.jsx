import React, { useState } from 'react';
import Logo from '../components/Logo.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';

export default function CustomerProfileSetup({ mobile, onDone }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState({});
  const [locating, setLocating] = useState(false);

  const useCurrentLocation = () => {
    setLocating(true);
    // MVP: mock location — real GPS/Google Maps can be plugged here
    setTimeout(() => {
      setLocation('Balaghat, Madhya Pradesh');
      setLocating(false);
    }, 700);
  };

  const handleContinue = () => {
    const e = {};
    if (!name.trim()) e.name = 'Full name is required';
    if (!address.trim()) e.address = 'Address is required';
    setErrors(e);
    if (Object.keys(e).length) return;

    onDone({
      name: name.trim(),
      mobile,
      address: address.trim(),
      location: location.trim() || 'Balaghat, Madhya Pradesh',
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-logo-center" style={{ marginBottom: 20 }}>
        <Logo size={56} />
        <h1 className="auth-title">Complete your profile</h1>
        <p className="auth-subtitle">We use this for delivery</p>
      </div>

      <div className="auth-form">
        <Input
          label="Full Name"
          value={name}
          onChange={(v) => { setName(v); if (errors.name) setErrors({ ...errors, name: '' }); }}
          placeholder="Enter your full name"
          icon="👤"
          error={errors.name}
        />

        <Input
          label="Mobile Number"
          value={mobile}
          onChange={() => {}}
          placeholder="Mobile"
          icon="📱"
          disabled
        />

        <Input
          label="Address"
          value={address}
          onChange={(v) => { setAddress(v); if (errors.address) setErrors({ ...errors, address: '' }); }}
          placeholder="House / Street / Area"
          icon="🏠"
          error={errors.address}
          multiline
          rows={2}
        />

        <Input
          label="Location"
          value={location}
          onChange={setLocation}
          placeholder="City / Town"
          icon="📍"
        />

        <Button
          variant="secondary"
          size="md"
          full
          onClick={useCurrentLocation}
          disabled={locating}
          icon="📡"
        >
          {locating ? 'Detecting…' : 'Use Current Location'}
        </Button>

        <div className="mt-16">
          <Button variant="primary" size="lg" full onClick={handleContinue}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
