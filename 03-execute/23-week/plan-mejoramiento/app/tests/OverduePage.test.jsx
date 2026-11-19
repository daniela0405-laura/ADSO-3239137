import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import OverduePage from '../src/pages/OverduePage.jsx';
import * as auth from '../src/auth/AuthContext.jsx';

describe('OverduePage', () => {
  beforeEach(() => {
    vi.spyOn(auth, 'useAuth').mockReturnValue({ session: { token: 't', role: 'advisor' } });
  });

  it('lists overdue lines with days late', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({
      items: [{ rental_id: 'r1', line_id: 'l1', item_name: 'Linterna frontal', customer_name: 'Ana María Gómez', due_at: '2026-11-10T14:00:00Z', days_late: 9 }],
    }), { status: 200 }));
    render(<OverduePage />);
    expect(await screen.findByText('Linterna frontal')).toBeInTheDocument();
    expect(screen.getByText('Ana María Gómez')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
  });

  it('says when there are no overdue items', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ items: [] }), { status: 200 }));
    render(<OverduePage />);
    expect(await screen.findByText('No hay artículos vencidos.')).toBeInTheDocument();
  });
});
