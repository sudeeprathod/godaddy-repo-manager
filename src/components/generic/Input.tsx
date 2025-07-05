import React, { forwardRef } from 'react';
import './Input.css';

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'outlined' | 'filled';
  error?: string;
  success?: boolean;
  label?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  dataTestId?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      placeholder,
      value,
      onChange,
      onBlur,
      onFocus,
      name,
      id,
      disabled = false,
      required = false,
      readOnly = false,
      autoComplete,
      autoFocus = false,
      maxLength,
      minLength,
      pattern,
      size = 'medium',
      variant = 'default',
      error,
      success = false,
      label,
      helperText,
      icon,
      iconPosition = 'left',
      className = '',
      dataTestId,
    },
    ref
  ) => {
    const baseClass = 'input';
    const sizeClass = `input--${size}`;
    const variantClass = `input--${variant}`;
    const errorClass = error ? 'input--error' : '';
    const successClass = success && !error ? 'input--success' : '';
    const disabledClass = disabled ? 'input--disabled' : '';
    const hasIconClass = icon
      ? `input--has-icon input--icon-${iconPosition}`
      : '';

    const combinedClassName =
      `${baseClass} ${sizeClass} ${variantClass} ${errorClass} ${successClass} ${disabledClass} ${hasIconClass} ${className}`.trim();

    return (
      <div className="input-wrapper">
        {label && (
          <label htmlFor={id} className="input-label">
            {label}
            {required && <span className="input-required">*</span>}
          </label>
        )}
        <div className="input-container">
          {icon && iconPosition === 'left' && (
            <span className="input-icon input-icon--left">{icon}</span>
          )}
          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            name={name}
            id={id}
            disabled={disabled}
            required={required}
            readOnly={readOnly}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            maxLength={maxLength}
            minLength={minLength}
            pattern={pattern}
            className={combinedClassName}
            data-testid={dataTestId}
          />
          {icon && iconPosition === 'right' && (
            <span className="input-icon input-icon--right">{icon}</span>
          )}
        </div>
        {(error || helperText) && (
          <div
            className={`input-message ${
              error ? 'input-message--error' : 'input-message--helper'
            }`}
          >
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
