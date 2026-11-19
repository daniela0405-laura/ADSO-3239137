import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorMessage from '../src/components/ErrorMessage.jsx';

describe('ErrorMessage', () => {
  it('renders nothing when there is no error', () => {
    const { container } = render(<ErrorMessage error={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the error message as an alert', () => {
    render(<ErrorMessage error={new Error('Algo salió mal.')} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Algo salió mal.');
  });
});
