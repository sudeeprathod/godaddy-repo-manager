import React from 'react';
import './Button.css';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  variant?:
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'success'
    | 'warning'
    | 'info'
    | 'ghost';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  dataTestId?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  type = 'button',
  className = '',
  dataTestId,
  icon,
  loading = false,
  fullWidth = false,
}) => {
  const baseClass = 'button';
  const variantClass = `button--${variant}`;
  const sizeClass = `button--${size}`;
  const loadingClass = loading ? 'button--loading' : '';
  const fullWidthClass = fullWidth ? 'button--full-width' : '';

  const combinedClassName =
    `${baseClass} ${variantClass} ${sizeClass} ${loadingClass} ${fullWidthClass} ${className}`.trim();

  return (
    <button
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      data-testid={dataTestId}
    >
      {icon && !loading && <span className="button-icon">{icon}</span>}
      <span className="button-text">{children}</span>
    </button>
  );
};

export default Button;
