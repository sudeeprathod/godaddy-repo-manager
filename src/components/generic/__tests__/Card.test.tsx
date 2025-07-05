import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from '../Card';

describe('Card', () => {
  it('renders basic card with children', () => {
    render(
      <Card>
        <div>Card content</div>
      </Card>
    );

    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders card with title and subtitle', () => {
    render(
      <Card title="Test Title" subtitle="Test Subtitle">
        <div>Card content</div>
      </Card>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('renders card with custom header', () => {
    render(
      <Card header={<div>Custom Header</div>}>
        <div>Card content</div>
      </Card>
    );

    expect(screen.getByText('Custom Header')).toBeInTheDocument();
  });

  it('renders card with custom footer', () => {
    render(
      <Card footer={<div>Custom Footer</div>}>
        <div>Card content</div>
      </Card>
    );

    expect(screen.getByText('Custom Footer')).toBeInTheDocument();
  });

  it('applies different variants correctly', () => {
    const { rerender } = render(
      <Card variant="elevated" data-testid="card">
        <div>Content</div>
      </Card>
    );

    expect(screen.getByTestId('card')).toHaveClass('card--elevated');

    rerender(
      <Card variant="outlined" data-testid="card">
        <div>Content</div>
      </Card>
    );

    expect(screen.getByTestId('card')).toHaveClass('card--outlined');
  });

  it('applies different sizes correctly', () => {
    const { rerender } = render(
      <Card size="small" data-testid="card">
        <div>Content</div>
      </Card>
    );

    expect(screen.getByTestId('card')).toHaveClass('card--small');

    rerender(
      <Card size="large" data-testid="card">
        <div>Content</div>
      </Card>
    );

    expect(screen.getByTestId('card')).toHaveClass('card--large');
  });

  it('handles click events when interactive', () => {
    const handleClick = jest.fn();

    render(
      <Card interactive onClick={handleClick} data-testid="card">
        <div>Clickable content</div>
      </Card>
    );

    fireEvent.click(screen.getByTestId('card'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('applies interactive styles when interactive prop is true', () => {
    render(
      <Card interactive data-testid="card">
        <div>Content</div>
      </Card>
    );

    expect(screen.getByTestId('card')).toHaveClass('card--interactive');
  });

  it('shows loading state', () => {
    render(
      <Card loading data-testid="card">
        <div>Content</div>
      </Card>
    );

    expect(screen.getByTestId('card')).toHaveClass('card--loading');
  });

  it('renders card with image', () => {
    render(
      <Card
        image={{
          src: 'test-image.jpg',
          alt: 'Test image',
          height: '200px',
        }}
        data-testid="card"
      >
        <div>Content</div>
      </Card>
    );

    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-image.jpg');
  });

  it('forwards data-testid and other props', () => {
    render(
      <Card data-testid="custom-card" className="custom-class" id="card-id">
        <div>Content</div>
      </Card>
    );

    const card = screen.getByTestId('custom-card');
    expect(card).toHaveClass('custom-class');
    expect(card).toHaveAttribute('id', 'card-id');
  });

  it('handles empty children gracefully', () => {
    render(<Card data-testid="card">Content</Card>);

    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('combines multiple props correctly', () => {
    render(
      <Card
        variant="glass"
        size="large"
        interactive
        loading
        className="extra-class"
        data-testid="card"
      >
        <div>Content</div>
      </Card>
    );

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('card--glass');
    expect(card).toHaveClass('card--large');
    expect(card).toHaveClass('card--interactive');
    expect(card).toHaveClass('card--loading');
    expect(card).toHaveClass('extra-class');
  });

  it('renders title and subtitle with proper hierarchy', () => {
    render(
      <Card title="Main Title" subtitle="Sub Title">
        <div>Content</div>
      </Card>
    );

    const title = screen.getByText('Main Title');
    const subtitle = screen.getByText('Sub Title');

    expect(title.tagName).toBe('H3');
    expect(subtitle.tagName).toBe('P');
  });

  it('handles click events without interactive prop', () => {
    const handleClick = jest.fn();

    render(
      <Card onClick={handleClick} data-testid="card">
        <div>Content</div>
      </Card>
    );

    fireEvent.click(screen.getByTestId('card'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('applies glass morphism variant correctly', () => {
    render(
      <Card variant="glass" data-testid="card">
        <div>Content</div>
      </Card>
    );

    expect(screen.getByTestId('card')).toHaveClass('card--glass');
  });

  it('applies gradient variant correctly', () => {
    render(
      <Card variant="gradient" data-testid="card">
        <div>Content</div>
      </Card>
    );

    expect(screen.getByTestId('card')).toHaveClass('card--gradient');
  });

  it('applies flat variant correctly', () => {
    render(
      <Card variant="flat" data-testid="card">
        <div>Content</div>
      </Card>
    );

    expect(screen.getByTestId('card')).toHaveClass('card--flat');
  });
});
