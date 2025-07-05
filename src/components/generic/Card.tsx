import React from 'react';
import './Card.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'flat' | 'gradient' | 'glass';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
  loading?: boolean;
  image?: {
    src: string;
    alt: string;
    height?: string;
  };
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  header,
  footer,
  variant = 'default',
  size = 'medium',
  className = '',
  onClick,
  interactive = false,
  loading = false,
  image,
  ...rest
}) => {
  const baseClass = 'card';
  const variantClass = `card--${variant}`;
  const sizeClass = `card--${size}`;
  const interactiveClass = interactive || onClick ? 'card--interactive' : '';
  const loadingClass = loading ? 'card--loading' : '';

  const combinedClassName =
    `${baseClass} ${variantClass} ${sizeClass} ${interactiveClass} ${loadingClass} ${className}`.trim();

  return (
    <div className={combinedClassName} onClick={onClick} {...rest}>
      {loading && (
        <div className="card-loading-overlay">
          <div className="card-spinner"></div>
        </div>
      )}

      {image && (
        <div className="card-media" style={{ height: image.height }}>
          <img src={image.src} alt={image.alt} />
        </div>
      )}

      {(title || subtitle || header) && (
        <div className="card-header">
          {header || (
            <>
              {title && <h3 className="card-title">{title}</h3>}
              {subtitle && <p className="card-subtitle">{subtitle}</p>}
            </>
          )}
        </div>
      )}

      <div className="card-body">{children}</div>

      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};

export default Card;
