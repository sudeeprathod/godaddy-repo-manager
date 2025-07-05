import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '../Button';

describe('Button Component', () => {
  it('should render with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
    expect(button.className).toContain('button--primary');
    expect(button.className).toContain('button--medium');
  });

  it('should render with different variants', () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button').className).toContain('button--secondary');

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole('button').className).toContain('button--danger');

    rerender(<Button variant="success">Success</Button>);
    expect(screen.getByRole('button').className).toContain('button--success');

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button').className).toContain('button--ghost');
  });

  it('should render with different sizes', () => {
    const { rerender } = render(<Button size="small">Small</Button>);
    expect(screen.getByRole('button').className).toContain('button--small');

    rerender(<Button size="large">Large</Button>);
    expect(screen.getByRole('button').className).toContain('button--large');
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('disabled');
  });

  it('should show loading state', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('button--loading');
    expect(button).toBeDisabled();
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('should render with custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('custom-class');
  });

  it('should render with data-testid', () => {
    render(<Button dataTestId="test-button">Test</Button>);
    expect(screen.getByTestId('test-button')).toBeInTheDocument();
  });

  it('should render with icon', () => {
    render(<Button icon="🚀">With Icon</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('🚀');
    expect(button).toHaveTextContent('With Icon');
  });

  it('should not show icon when loading', () => {
    render(
      <Button icon="🚀" loading>
        Loading
      </Button>
    );
    const button = screen.getByRole('button');
    expect(button).not.toHaveTextContent('🚀');
    expect(button).toHaveTextContent('Loading');
  });

  it('should render as submit button', () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should render as reset button', () => {
    render(<Button type="reset">Reset</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'reset');
  });
});
