import {
  formatDate,
  formatNumber,
  truncateText,
  debounce,
  throttle,
  generateId,
  isValidUrl,
  sanitizeHtml,
} from '../utils';

describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2023-01-01T00:00:00Z');
      const formatted = formatDate(date);

      expect(formatted).toMatch(/jan/i);
      expect(formatted).toContain('2023');
    });

    it('handles string date input', () => {
      const formatted = formatDate('2023-01-01T00:00:00Z');

      expect(formatted).toMatch(/jan/i);
      expect(formatted).toContain('2023');
    });

    it('handles invalid date input', () => {
      const formatted = formatDate('invalid-date');

      expect(formatted).toBe('Invalid Date');
    });

    it('handles null input', () => {
      const formatted = formatDate(null);

      expect(formatted).toBe('N/A');
    });

    it('handles undefined input', () => {
      const formatted = formatDate(undefined);

      expect(formatted).toBe('N/A');
    });

    it('formats relative time for recent dates', () => {
      const recentDate = new Date();
      recentDate.setHours(recentDate.getHours() - 2);

      const formatted = formatDate(recentDate, { relative: true });

      expect(formatted).toContain('2 hours ago');
    });

    it('formats relative time for old dates', () => {
      const oldDate = new Date('2020-01-01T00:00:00Z');

      const formatted = formatDate(oldDate, { relative: true });

      expect(formatted).toMatch(/jan/i);
      expect(formatted).toContain('2020');
    });

    it('returns N/A for null/undefined', () => {
      expect(formatDate(null)).toBe('N/A');
      expect(formatDate(undefined)).toBe('N/A');
    });

    it('returns Invalid Date for invalid string', () => {
      expect(formatDate('not-a-date')).toBe('Invalid Date');
    });

    it('returns relative time for <24h', () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      expect(formatDate(oneHourAgo, { relative: true })).toMatch(/hour/);
    });

    it('returns formatted date for valid date', () => {
      expect(formatDate('2020-01-01')).toMatch(/2020/);
    });
  });

  describe('formatNumber', () => {
    it('formats small numbers correctly', () => {
      expect(formatNumber(123)).toBe('123');
      expect(formatNumber(1234)).toBe('1.23K');
    });

    it('formats large numbers with abbreviations', () => {
      expect(formatNumber(1000)).toBe('1K');
      expect(formatNumber(1500)).toBe('1.5K');
      expect(formatNumber(1000000)).toBe('1M');
      expect(formatNumber(1500000)).toBe('1.5M');
    });

    it('handles zero', () => {
      expect(formatNumber(0)).toBe('0');
    });

    it('handles negative numbers', () => {
      expect(formatNumber(-123)).toBe('-123');
      expect(formatNumber(-1000)).toBe('-1K');
    });

    it('handles decimal numbers', () => {
      expect(formatNumber(123.456)).toBe('123.46');
      expect(formatNumber(1234.567)).toBe('1.23K');
    });

    it('handles null and undefined', () => {
      expect(formatNumber(null)).toBe('0');
      expect(formatNumber(undefined)).toBe('0');
    });

    it('formats with custom precision', () => {
      expect(formatNumber(123.456, { precision: 1 })).toBe('123.5');
      expect(formatNumber(123.456, { precision: 0 })).toBe('123');
    });

    it('formats without abbreviations', () => {
      expect(formatNumber(1000, { abbreviate: false })).toBe('1,000');
      expect(formatNumber(1000000, { abbreviate: false })).toBe('1,000,000');
    });

    it('returns 0 for null/undefined', () => {
      expect(formatNumber(null)).toBe('0');
      expect(formatNumber(undefined)).toBe('0');
    });

    it('abbreviates millions and thousands', () => {
      expect(formatNumber(1000000)).toMatch(/M/);
      expect(formatNumber(1000)).toMatch(/K/);
    });

    it('returns non-abbreviated if option set', () => {
      expect(formatNumber(1234, { abbreviate: false })).toBe('1,234');
    });
  });

  describe('truncateText', () => {
    it('truncates long text correctly', () => {
      const longText = 'This is a very long text that needs to be truncated';
      const truncated = truncateText(longText, 20);

      expect(truncated).toBe('This is a very long ...');
      expect(truncated.length).toBeLessThanOrEqual(24);
    });

    it('does not truncate short text', () => {
      const shortText = 'Short text';
      const truncated = truncateText(shortText, 20);

      expect(truncated).toBe('Short text');
    });

    it('handles empty string', () => {
      expect(truncateText('', 10)).toBe('');
    });

    it('handles null and undefined', () => {
      expect(truncateText(null, 10)).toBe('');
      expect(truncateText(undefined, 10)).toBe('');
    });

    it('uses custom ellipsis', () => {
      const longText = 'This is a very long text';
      const truncated = truncateText(longText, 10, '***');

      expect(truncated).toBe('This is a ***');
    });

    it('truncates at word boundary', () => {
      const longText = 'This is a very long text that needs truncation';
      const truncated = truncateText(longText, 15, '...', true);

      expect(truncated).toBe('This is a very...');
    });

    it('handles text shorter than max length with word boundary', () => {
      const shortText = 'Short text';
      const truncated = truncateText(shortText, 20, '...', true);

      expect(truncated).toBe('Short text');
    });

    it('returns empty for null/undefined', () => {
      expect(truncateText(null, 5)).toBe('');
      expect(truncateText(undefined, 5)).toBe('');
    });

    it('truncates with ellipsis', () => {
      expect(truncateText('abcdef', 3)).toBe('abc...');
    });

    it('truncates at word boundary with custom length', () => {
      expect(truncateText('hello world', 7, '...', true)).toBe('hello...');
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('handles debounce with multiple rapid calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      // Call multiple times rapidly
      debouncedFn();
      debouncedFn();
      debouncedFn();

      // Should not be called immediately
      expect(mockFn).not.toHaveBeenCalled();

      // Wait for debounce delay
      jest.advanceTimersByTime(100);

      // Should be called only once
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('handles debounce with different delays', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 200);

      debouncedFn();
      jest.advanceTimersByTime(100);
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('passes arguments correctly to debounced function', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('arg1', 'arg2');

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('resets timer on subsequent calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();

      jest.advanceTimersByTime(50);
      debouncedFn();

      jest.advanceTimersByTime(50);
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('throttles function calls with default options', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      throttledFn();
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('passes arguments correctly to throttled function', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn('arg1', 'arg2');

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('handles leading and trailing options', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100, {
        leading: false,
        trailing: true,
      });

      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('handles throttle with leading option', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100, {
        leading: true,
        trailing: false,
      });

      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('handles throttle with trailing option', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100, {
        leading: false,
        trailing: true,
      });

      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('generateId', () => {
    it('generates unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();

      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
    });

    it('generates IDs with custom prefix', () => {
      const id = generateId('test');

      expect(id).toMatch(/^test_/);
    });

    it('generates IDs with custom length', () => {
      const id = generateId('', 10);

      expect(id.length).toBe(10);
    });

    it('generates alphanumeric IDs', () => {
      const id = generateId();

      expect(id).toMatch(/^[a-zA-Z0-9_]+$/);
    });

    it('generates id with prefix and length', () => {
      const id = generateId('pre', 10);
      expect(id.startsWith('pre_')).toBe(true);
      expect(id.length).toBeGreaterThan(4);
    });
  });

  describe('isValidUrl', () => {
    it('validates correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('https://example.com/path')).toBe(true);
      expect(isValidUrl('https://example.com/path?param=value')).toBe(true);
    });

    it('rejects invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('ftp://example.com')).toBe(false);
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl(null)).toBe(false);
      expect(isValidUrl(undefined)).toBe(false);
    });

    it('handles edge cases', () => {
      expect(isValidUrl('https://')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false);
      expect(isValidUrl('http://')).toBe(false);
    });

    it('validates with custom protocols', () => {
      expect(isValidUrl('https://example.com', ['https'])).toBe(true);
      expect(isValidUrl('http://example.com', ['https'])).toBe(false);
      expect(isValidUrl('https://example.com', ['http', 'https'])).toBe(true);
    });

    it('returns false for null/undefined', () => {
      expect(isValidUrl(null)).toBe(false);
      expect(isValidUrl(undefined)).toBe(false);
    });

    it('returns true for valid http/https', () => {
      expect(isValidUrl('http://a.com')).toBe(true);
      expect(isValidUrl('https://a.com')).toBe(true);
    });

    it('returns false for other protocols', () => {
      expect(isValidUrl('ftp://a.com')).toBe(false);
    });
  });

  describe('sanitizeHtml', () => {
    it('removes script tags', () => {
      const html = '<p>Hello</p><script>alert("xss")</script>';
      const sanitized = sanitizeHtml(html);

      expect(sanitized).toBe('<p>Hello</p>');
    });

    it('removes dangerous attributes', () => {
      const html = '<p onclick="xss()">Hello</p>';
      const sanitized = sanitizeHtml(html);

      expect(sanitized).toBe('<p>Hello</p>');
    });

    it('allows safe HTML', () => {
      const html = '<p><strong>Hello</strong> <em>World</em></p>';
      const sanitized = sanitizeHtml(html);

      expect(sanitized).toBe(html);
    });

    it('handles empty input', () => {
      expect(sanitizeHtml('')).toBe('');
      expect(sanitizeHtml(null)).toBe('');
      expect(sanitizeHtml(undefined)).toBe('');
    });

    it('removes iframe tags', () => {
      const html = '<p>Hello</p><iframe src="malicious.com"></iframe>';
      const sanitized = sanitizeHtml(html);

      expect(sanitized).toBe('<p>Hello</p>');
    });

    it('removes object tags', () => {
      const html = '<p>Hello</p><object data="malicious.swf"></object>';
      const sanitized = sanitizeHtml(html);

      expect(sanitized).toBe('<p>Hello</p>');
    });

    it('allows safe attributes', () => {
      const html = '<a href="https://example.com" target="_blank">Link</a>';
      const sanitized = sanitizeHtml(html);

      expect(sanitized).toBe(html);
    });

    it('removes javascript: URLs', () => {
      const html = '<a href="javascript:alert(\'xss\')">Link</a>';
      const sanitized = sanitizeHtml(html);

      expect(sanitized).toBe('<a href="alert(\'xss\')">Link</a>');
    });

    it('handles nested dangerous content', () => {
      const html = '<div><p>Hello<script>alert("xss")</script>World</p></div>';
      const sanitized = sanitizeHtml(html);

      expect(sanitized).toBe('<div><p>HelloWorld</p></div>');
    });

    it('preserves text content', () => {
      const html = 'Hello <script>alert("xss")</script> World';
      const sanitized = sanitizeHtml(html);

      expect(sanitized).toBe('Hello  World');
    });

    it('removes script tags with alert', () => {
      expect(sanitizeHtml('<script>alert(1)</script>hi')).toBe('hi');
    });

    it('removes onclick attributes', () => {
      expect(sanitizeHtml('<div onclick="alert(1)">x</div>')).not.toMatch(
        /onclick/
      );
    });

    it('removes javascript URLs', () => {
      expect(sanitizeHtml('<a href="javascript:alert(1)">x</a>')).not.toMatch(
        /javascript/
      );
    });

    it('removes iframe tags with src attribute', () => {
      expect(sanitizeHtml('<iframe src="x"></iframe>')).not.toMatch(/iframe/);
    });

    it('returns empty string for null/undefined', () => {
      expect(sanitizeHtml(null)).toBe('');
      expect(sanitizeHtml(undefined)).toBe('');
    });
  });
});
