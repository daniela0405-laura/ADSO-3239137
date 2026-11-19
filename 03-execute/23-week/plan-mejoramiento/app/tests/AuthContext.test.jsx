import { describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from '../src/auth/AuthContext.jsx';

let api;
function Probe() {
  api = useAuth();
  return <p>{api.session ? `${api.session.username}:${api.session.role}` : 'sin sesión'}</p>;
}

describe('AuthContext', () => {
  it('stores a normalized session after login and clears it on logout', async () => {
    sessionStorage.clear();
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(
      JSON.stringify({ access_token: 'jwt', token_type: 'Bearer', expires_in: 28800, role: 'advisor' }),
      { status: 200 },
    ));
    render(<AuthProvider><Probe /></AuthProvider>);
    expect(screen.getByText('sin sesión')).toBeInTheDocument();

    await act(() => api.login('  Laura ', 'secreta'));
    expect(screen.getByText('laura:advisor')).toBeInTheDocument();
    expect(JSON.parse(sessionStorage.getItem('camping-session')).token).toBe('jwt');

    act(() => api.logout());
    expect(screen.getByText('sin sesión')).toBeInTheDocument();
    expect(sessionStorage.getItem('camping-session')).toBeNull();
  });
});
