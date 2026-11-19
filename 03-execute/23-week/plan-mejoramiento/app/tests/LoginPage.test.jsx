import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../src/pages/LoginPage.jsx';
import { AuthProvider } from '../src/auth/AuthContext.jsx';

function renderLogin() {
  return render(<MemoryRouter><AuthProvider><LoginPage /></AuthProvider></MemoryRouter>);
}

describe('LoginPage', () => {
  it('asks for both fields before calling the API', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    renderLogin();
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Escribe tu usuario y tu contraseña.');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('shows the API message when credentials are invalid', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(
      JSON.stringify({ code: 'INVALID_CREDENTIALS', message: 'Usuario o contraseña incorrectos.', details: [] }),
      { status: 401 },
    ));
    renderLogin();
    fireEvent.change(screen.getByLabelText('Usuario'), { target: { value: 'laura' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'mala' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Usuario o contraseña incorrectos.');
  });
});
