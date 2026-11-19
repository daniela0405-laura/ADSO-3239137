import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import RentalFormPage, { MAX_ITEMS_PER_RENTAL } from '../src/pages/RentalFormPage.jsx';
import * as auth from '../src/auth/AuthContext.jsx';

describe('RentalFormPage', () => {
  beforeEach(() => {
    vi.spyOn(auth, 'useAuth').mockReturnValue({ session: { token: 't', role: 'advisor' } });
  });

  it('allows at most four items per rental', () => {
    render(<RentalFormPage />);
    const addButton = screen.getByRole('button', { name: 'Agregar otro artículo' });
    for (let i = 0; i < 5; i++) fireEvent.click(addButton);
    expect(screen.getAllByLabelText(/Id del artículo/)).toHaveLength(MAX_ITEMS_PER_RENTAL);
    expect(addButton).toBeDisabled();
  });

  it('rejects the same item twice', () => {
    render(<RentalFormPage />);
    fireEvent.change(screen.getByLabelText('Id del cliente'), { target: { value: 'c1' } });
    fireEvent.change(screen.getByLabelText('Id del artículo 1'), { target: { value: 'i1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Agregar otro artículo' }));
    fireEvent.change(screen.getByLabelText('Id del artículo 2'), { target: { value: 'i1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Registrar alquiler' }));
    expect(screen.getByRole('alert')).toHaveTextContent('No repitas el mismo artículo en un alquiler.');
  });
});
