import React from 'react';

export default function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error = '',
  icon = null,
  maxLength,
  inputMode,
  disabled = false,
  multiline = false,
  rows = 3,
}) {
  const common = {
    value: value || '',
    onChange: (e) => onChange(e.target.value),
    placeholder,
    maxLength,
    inputMode,
    disabled,
    className: `input-field ${error ? 'input-error' : ''}`,
  };
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className={`input-wrap ${icon ? 'has-icon' : ''}`}>
        {icon && <span className="input-icon">{icon}</span>}
        {multiline ? (
          <textarea {...common} rows={rows} />
        ) : (
          <input type={type} {...common} />
        )}
      </div>
      {error && <div className="input-error-msg">{error}</div>}
    </div>
  );
}
