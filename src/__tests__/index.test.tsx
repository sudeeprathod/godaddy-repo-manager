import React from 'react';
import '@testing-library/jest-dom';

describe('index.tsx', () => {
  let mockRender: jest.Mock;
  let mockCreateRoot: jest.Mock;
  let mockReportWebVitals: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    mockRender = jest.fn();
    mockCreateRoot = jest.fn(() => ({ render: mockRender }));
    mockReportWebVitals = jest.fn();

    jest.doMock('react-dom/client', () => ({
      createRoot: mockCreateRoot,
    }));

    jest.doMock('../App', () => {
      return function MockApp() {
        return <div data-testid="mock-app">Mock App Component</div>;
      };
    });

    jest.doMock('../reportWebVitals', () => ({
      __esModule: true,
      default: mockReportWebVitals,
    }));
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('should render the app and call reportWebVitals', () => {
    // Mock document.getElementById
    const mockElement = document.createElement('div');
    mockElement.id = 'root';
    jest.spyOn(document, 'getElementById').mockReturnValue(mockElement);

    require('../index');

    expect(mockCreateRoot).toHaveBeenCalledWith(mockElement);
    expect(mockRender).toHaveBeenCalled();
    expect(require('../reportWebVitals').default).toHaveBeenCalled();
  });

  it('should create root with the correct element', () => {
    const mockElement = document.createElement('div');
    mockElement.id = 'root';
    jest.spyOn(document, 'getElementById').mockReturnValue(mockElement);

    require('../index');

    expect(mockCreateRoot).toHaveBeenCalledWith(mockElement);
  });

  it('should handle missing root element gracefully', () => {
    jest.spyOn(document, 'getElementById').mockReturnValue(null);
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    require('../index');

    expect(mockCreateRoot).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
