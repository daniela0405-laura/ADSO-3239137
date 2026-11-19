import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../src/auth/ProtectedRoute.jsx';
import * as auth from '../src/auth/AuthContext.jsx';

function renderAt(session, roles) {
  vi.spyOn(auth, 'useAuth').mockReturnValue({ session });
  return render(
    <MemoryRouter initialEntries={['/report']}>
      <Routes>
        <Route path="/login" element={<p>Pantalla de login</p>} />
        <Route path="/report" element={<ProtectedRoute roles={roles}><p>Reporte</p></ProtectedRoute>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  it('redirects to login when there is no session', () => {
    renderAt(null, ['admin']);
    expect(screen.getByText('Pantalla de login')).toBeInTheDocument();
  });

  it('blocks a role that is not allowed', () => {
    renderAt({ token: 't', role: 'advisor' }, ['admin']);
    expect(screen.getByRole('alert')).toHaveTextContent('No tienes permiso para ver esta pantalla.');
  });

  it('shows the page to an allowed role', () => {
    renderAt({ token: 't', role: 'admin' }, ['admin']);
    expect(screen.getByText('Reporte')).toBeInTheDocument();
  });
});
