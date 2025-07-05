import React, { forwardRef } from 'react';
import './Input.css';

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'url';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
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
  error?: boolean | string;
  errorMessage?: string;
  success?: boolean;
  label?: string;
  helperText?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  dataTestId?: string;
  loading?: boolean;
  fullWidth?: boolean;
  spellCheck?: boolean;
  tabIndex?: number;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      placeholder,
      value,
      defaultValue,
      onChange,
      onBlur,
      onFocus,
      onKeyDown,
      onKeyUp,
      onKeyPress,
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
      errorMessage,
      success = false,
      label,
      helperText,
      icon,
      rightIcon,
      iconPosition = 'left',
      className = '',
      dataTestId,
      loading = false,
      fullWidth = false,
      spellCheck,
      tabIndex,
    },
    ref
  ) => {
    const baseClass = 'input';
    const sizeClass = `input--${size}`;
    const variantClass = `input--${variant}`;
    const errorClass = error ? 'input--error' : '';
    const successClass = success && !error ? 'input--success' : '';
    const disabledClass = disabled ? 'input--disabled' : '';
    const loadingClass = loading ? 'input--loading' : '';
    const fullWidthClass = fullWidth ? 'input--full-width' : '';
    const hasIconClass = icon
      ? `input--has-icon input--icon-${iconPosition}`
      : '';
    const hasRightIconClass = rightIcon ? 'input--has-right-icon' : '';

    const combinedClassName =
      `${baseClass} ${sizeClass} ${variantClass} ${errorClass} ${successClass} ${disabledClass} ${loadingClass} ${fullWidthClass} ${hasIconClass} ${hasRightIconClass} ${className}`.trim();

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
            defaultValue={defaultValue}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            onKeyPress={onKeyPress}
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
            spellCheck={spellCheck}
            tabIndex={tabIndex}
          />
          {icon && iconPosition === 'right' && (
            <span className="input-icon input-icon--right">{icon}</span>
          )}
          {rightIcon && (
            <span className="input-icon input-icon--right">{rightIcon}</span>
          )}
        </div>
        {(!!errorMessage || !!error || !!helperText) && (
          <div
            className={`input-message ${
              error || errorMessage
                ? 'input-message--error'
                : 'input-message--helper'
            }`}
          >
            {errorMessage ||
              (typeof error === 'string' ? error : undefined) ||
              helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
