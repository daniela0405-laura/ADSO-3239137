import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ItemsPage from '../src/pages/ItemsPage.jsx';
import * as auth from '../src/auth/AuthContext.jsx';

describe('ItemsPage', () => {
  beforeEach(() => {
    vi.spyOn(auth, 'useAuth').mockReturnValue({ session: { token: 't', role: 'advisor' } });
  });

  it('lists items with their available units and the total count', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({
      items: [{ id: 'i1', name: 'Carpa iglú 4 personas', reference: 'CAR-0012', category: { id: 'c1', name: 'Carpas' }, total_units: 3, available_units: 2 }],
      page: 1, size: 20, total: 1,
    }), { status: 200 }));
    render(<ItemsPage />);
    expect(await screen.findByText('Carpa iglú 4 personas')).toBeInTheDocument();
    expect(screen.getByText('2 de 3')).toBeInTheDocument();
    expect(screen.getByText('1 artículo(s) encontrado(s)')).toBeInTheDocument();
  });

  it('shows the API error message', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(
      JSON.stringify({ code: 'UNAUTHENTICATED', message: 'Tu sesión venció. Inicia sesión de nuevo.', details: [] }),
      { status: 401 },
    ));
    render(<ItemsPage />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Tu sesión venció. Inicia sesión de nuevo.');
  });
});
