import reportWebVitals from '../reportWebVitals';

describe('reportWebVitals', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be a function', () => {
    expect(typeof reportWebVitals).toBe('function');
  });

  it('should not call onPerfEntry when not provided', async () => {
    // Mock web-vitals with no-op functions
    const mockGetCLS = jest.fn();
    const mockGetFID = jest.fn();
    const mockGetFCP = jest.fn();
    const mockGetLCP = jest.fn();
    const mockGetTTFB = jest.fn();

    // Mock the web-vitals module
    jest.doMock('web-vitals', () => ({
      getCLS: mockGetCLS,
      getFID: mockGetFID,
      getFCP: mockGetFCP,
      getLCP: mockGetLCP,
      getTTFB: mockGetTTFB,
    }));

    // Import the function again to get the mocked version
    const { default: reportWebVitalsMocked } = require('../reportWebVitals');
    reportWebVitalsMocked();

    // Wait for the dynamic import to resolve
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockGetCLS).not.toHaveBeenCalled();
    expect(mockGetFID).not.toHaveBeenCalled();
    expect(mockGetFCP).not.toHaveBeenCalled();
    expect(mockGetLCP).not.toHaveBeenCalled();
    expect(mockGetTTFB).not.toHaveBeenCalled();
  });

  it('has correct function signature', () => {
    expect(reportWebVitals.length).toBe(1);
  });

  it('accepts an optional onPerfEntry parameter', () => {
    const mockOnPerfEntry = jest.fn();

    // Should not throw when called with a function
    expect(() => {
      reportWebVitals(mockOnPerfEntry);
    }).not.toThrow();
  });

  it('accepts undefined parameter', () => {
    // Should not throw when called with undefined
    expect(() => {
      reportWebVitals(undefined);
    }).not.toThrow();
  });

  it('accepts null parameter', () => {
    // Should not throw when called with null
    expect(() => {
      reportWebVitals(null as unknown as (metric: unknown) => void);
    }).not.toThrow();
  });

  it('accepts no parameters', () => {
    // Should not throw when called with no parameters
    expect(() => {
      reportWebVitals();
    }).not.toThrow();
  });

  it('handles non-function parameters gracefully', () => {
    // Should not throw when called with non-function
    expect(() => {
      reportWebVitals('not a function' as unknown as (metric: unknown) => void);
    }).not.toThrow();
  });

  it('can be called multiple times', () => {
    const mockOnPerfEntry1 = jest.fn();
    const mockOnPerfEntry2 = jest.fn();

    // Should not throw when called multiple times
    expect(() => {
      reportWebVitals(mockOnPerfEntry1);
      reportWebVitals(mockOnPerfEntry2);
    }).not.toThrow();
  });

  it('should call without error', () => {
    expect(() => reportWebVitals()).not.toThrow();
  });
});

export {};
