import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Input from '../Input';

describe('Input', () => {
  it('renders basic input with placeholder', () => {
    render(<Input placeholder="Enter text" />);

    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders input with value', () => {
    const mockOnChange = jest.fn();
    render(<Input value="test value" onChange={mockOnChange} />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('test value');
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(mockOnChange).toHaveBeenCalled();
    const eventArg = mockOnChange.mock.calls[0][0];
    expect(eventArg).toBeInstanceOf(Object);
    expect(eventArg.type).toBe('change');
    expect(input).toHaveValue('test value');
  });

  it('handles onChange events', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('applies different types correctly', () => {
    const { rerender } = render(<Input type="email" dataTestId="input" />);

    expect(screen.getByTestId('input')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" dataTestId="input" />);
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'password');
  });

  it('applies different sizes correctly', () => {
    const { rerender } = render(<Input size="small" dataTestId="input" />);

    expect(screen.getByTestId('input')).toHaveClass('input--small');

    rerender(<Input size="large" dataTestId="input" />);
    expect(screen.getByTestId('input')).toHaveClass('input--large');
  });

  it('applies different variants correctly', () => {
    const { rerender } = render(
      <Input variant="outlined" dataTestId="input" />
    );

    expect(screen.getByTestId('input')).toHaveClass('input--outlined');

    rerender(<Input variant="filled" dataTestId="input" />);
    expect(screen.getByTestId('input')).toHaveClass('input--filled');
  });

  it('shows error state', () => {
    render(<Input error dataTestId="input" />);

    expect(screen.getByTestId('input')).toHaveClass('input--error');
  });

  it('shows disabled state', () => {
    render(<Input disabled dataTestId="input" />);

    expect(screen.getByTestId('input')).toBeDisabled();
  });

  it('shows loading state', () => {
    render(<Input loading dataTestId="input" />);

    expect(screen.getByTestId('input')).toHaveClass('input--loading');
  });

  it('renders with label', () => {
    render(<Input label="Test Label" />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders with helper text', () => {
    render(<Input helperText="Helper text" />);

    expect(screen.getByText('Helper text')).toBeInTheDocument();
  });

  it('renders with error message', () => {
    render(<Input errorMessage="Error message" />);

    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    render(<Input icon="🔍" />);

    expect(screen.getByText('🔍')).toBeInTheDocument();
  });

  it('renders with right icon', () => {
    render(<Input rightIcon="✓" />);

    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('forwards data-testid and other props', () => {
    render(
      <Input dataTestId="custom-input" className="custom-class" id="input-id" />
    );

    const input = screen.getByTestId('custom-input');
    expect(input).toHaveClass('custom-class');
    expect(input).toHaveAttribute('id', 'input-id');
  });

  it('handles focus and blur events', () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();

    render(<Input onFocus={handleFocus} onBlur={handleBlur} />);

    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    fireEvent.blur(input);

    expect(handleFocus).toHaveBeenCalled();
    expect(handleBlur).toHaveBeenCalled();
  });

  it('handles key events', () => {
    const handleKeyDown = jest.fn();
    const handleKeyUp = jest.fn();

    render(<Input onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />);

    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter' });
    fireEvent.keyUp(input, { key: 'Enter' });

    expect(handleKeyDown).toHaveBeenCalled();
    expect(handleKeyUp).toHaveBeenCalled();
  });

  it('combines multiple props correctly', () => {
    render(
      <Input
        variant="outlined"
        size="large"
        error
        loading
        className="extra-class"
        dataTestId="input"
      />
    );

    const input = screen.getByTestId('input');
    expect(input).toHaveClass('input--outlined');
    expect(input).toHaveClass('input--large');
    expect(input).toHaveClass('input--error');
    expect(input).toHaveClass('input--loading');
    expect(input).toHaveClass('extra-class');
  });

  it('renders with all text-related props', () => {
    render(
      <Input
        label="Input Label"
        helperText="Helper text"
        placeholder="Enter value"
      />
    );

    expect(screen.getByText('Input Label')).toBeInTheDocument();
    expect(screen.getByText('Helper text')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter value')).toBeInTheDocument();
  });

  it('handles controlled input correctly', () => {
    const handleChange = jest.fn();
    render(<Input value="controlled value" onChange={handleChange} />);

    const input = screen.getByDisplayValue('controlled value');
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('handles uncontrolled input correctly', () => {
    render(<Input defaultValue="default value" />);

    expect(screen.getByDisplayValue('default value')).toBeInTheDocument();
  });

  it('applies full width correctly', () => {
    render(<Input fullWidth dataTestId="input" />);

    expect(screen.getByTestId('input')).toHaveClass('input--full-width');
  });

  it('renders with required attribute', () => {
    render(<Input required />);

    expect(screen.getByRole('textbox')).toHaveAttribute('required');
  });

  it('renders with readOnly attribute', () => {
    render(<Input readOnly />);

    expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
  });

  it('renders with maxLength attribute', () => {
    render(<Input maxLength={10} />);

    expect(screen.getByRole('textbox')).toHaveAttribute('maxlength', '10');
  });

  it('renders with minLength attribute', () => {
    render(<Input minLength={5} />);

    expect(screen.getByRole('textbox')).toHaveAttribute('minlength', '5');
  });

  it('renders with pattern attribute', () => {
    render(<Input pattern="[A-Za-z]{3}" />);

    expect(screen.getByRole('textbox')).toHaveAttribute(
      'pattern',
      '[A-Za-z]{3}'
    );
  });

  it('renders with autoComplete attribute', () => {
    render(<Input autoComplete="email" />);

    expect(screen.getByRole('textbox')).toHaveAttribute(
      'autocomplete',
      'email'
    );
  });

  it('focuses the input when autoFocus is true', () => {
    render(<Input autoFocus={true} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveFocus();
  });

  it('renders with spellCheck attribute', () => {
    render(<Input spellCheck={false} />);

    expect(screen.getByRole('textbox')).toHaveAttribute('spellcheck', 'false');
  });

  it('renders with tabIndex attribute', () => {
    render(<Input tabIndex={0} />);

    expect(screen.getByRole('textbox')).toHaveAttribute('tabindex', '0');
  });
});
