/**
 * Utility functions for the application
 */

/**
 * Formats a date into a readable string
 */
export const formatDate = (
  date: Date | string | null | undefined,
  options: { relative?: boolean } = {}
): string => {
  if (!date) return 'N/A';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }

    if (options.relative) {
      const now = new Date();
      const diffInHours =
        (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 24) {
        const hours = Math.floor(diffInHours);
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
      }
    }

    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Invalid Date';
  }
};

/**
 * Formats a number with abbreviations (K, M, etc.)
 */
export const formatNumber = (
  num: number | null | undefined,
  options: { precision?: number; abbreviate?: boolean } = {}
): string => {
  if (num === null || num === undefined) return '0';

  const { precision = 2, abbreviate = true } = options;

  if (!abbreviate) {
    return num.toLocaleString();
  }

  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (absNum >= 1000000) {
    return `${
      sign + (absNum / 1000000).toFixed(precision).replace(/\.?0+$/, '')
    }M`;
  }

  if (absNum >= 1000) {
    return `${
      sign + (absNum / 1000).toFixed(precision).replace(/\.?0+$/, '')
    }K`;
  }

  return sign + absNum.toFixed(precision).replace(/\.?0+$/, '');
};

/**
 * Truncates text to a specified length
 */
export const truncateText = (
  text: string | null | undefined,
  maxLength: number,
  ellipsis: string = '...',
  wordBoundary: boolean = false
): string => {
  if (!text) return '';

  if (text.length <= maxLength) return text;

  if (wordBoundary) {
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    if (lastSpace > 0) {
      return truncated.substring(0, lastSpace) + ellipsis;
    }
  }

  return text.substring(0, maxLength) + ellipsis;
};

/**
 * Debounces a function call
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttles a function call
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): ((...args: Parameters<T>) => void) => {
  const { leading = true, trailing = true } = options;
  let lastCall = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (lastCall === 0 && leading) {
      lastCall = now;
      func(...args);
    } else if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    } else if (trailing) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        func(...args);
      }, delay - (now - lastCall));
    }
  };
};

/**
 * Generates a unique ID
 */
export const generateId = (prefix: string = '', length: number = 8): string => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return prefix ? `${prefix}_${result}` : result;
};

/**
 * Validates if a string is a valid URL
 */
export const isValidUrl = (
  url: string | null | undefined,
  allowedProtocols: string[] = ['http', 'https']
): boolean => {
  if (!url) return false;

  try {
    const urlObj = new URL(url);
    return allowedProtocols.includes(urlObj.protocol.replace(':', ''));
  } catch {
    return false;
  }
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export const sanitizeHtml = (html: string | null | undefined): string => {
  if (!html) return '';

  // Remove script tags and their content
  let sanitized = html.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ''
  );

  // Remove dangerous attributes
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*javascript\s*:/gi, '');

  // Remove dangerous tags
  sanitized = sanitized.replace(
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    ''
  );
  sanitized = sanitized.replace(
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    ''
  );
  sanitized = sanitized.replace(
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
    ''
  );

  return sanitized;
};
