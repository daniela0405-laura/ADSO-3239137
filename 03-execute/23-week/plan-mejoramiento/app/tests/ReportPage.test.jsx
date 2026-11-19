import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import ReportPage from '../src/pages/ReportPage.jsx';
import * as auth from '../src/auth/AuthContext.jsx';

describe('ReportPage', () => {
  beforeEach(() => {
    vi.spyOn(auth, 'useAuth').mockReturnValue({ session: { token: 't', role: 'admin' } });
  });

  it('rejects an end date before the start date (CA-10.2)', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    render(<ReportPage />);
    fireEvent.change(screen.getByLabelText('Desde'), { target: { value: '2026-11-30' } });
    fireEvent.change(screen.getByLabelText('Hasta'), { target: { value: '2026-11-01' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ver reporte' }));
    expect(screen.getByRole('alert')).toHaveTextContent('La fecha final no puede ser anterior a la inicial.');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('shows one row per frozen item and category', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({
      from: '2026-11-01', to: '2026-11-30',
      rows: [{ item_id: 'i1', item_name: 'Carpa iglú 4 personas', category_name: 'Carpas', times_rented: 12 }],
    }), { status: 200 }));
    render(<ReportPage />);
    fireEvent.change(screen.getByLabelText('Desde'), { target: { value: '2026-11-01' } });
    fireEvent.change(screen.getByLabelText('Hasta'), { target: { value: '2026-11-30' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ver reporte' }));
    expect(await screen.findByText('Carpa iglú 4 personas')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('shows an empty message when the range has no rentals', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ from: '2026-01-01', to: '2026-01-31', rows: [] }), { status: 200 }));
    render(<ReportPage />);
    fireEvent.change(screen.getByLabelText('Desde'), { target: { value: '2026-01-01' } });
    fireEvent.change(screen.getByLabelText('Hasta'), { target: { value: '2026-01-31' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ver reporte' }));
    expect(await screen.findByText('No hubo alquileres en ese rango.')).toBeInTheDocument();
  });
});
