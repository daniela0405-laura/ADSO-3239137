import { describe, expect, it, vi } from 'vitest';
import { ApiError, apiRequest } from '../src/api/client.js';

describe('apiRequest', () => {
  it('sends the bearer token and returns the JSON body', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ status: 'ok' }), { status: 200 }));
    const data = await apiRequest('/health', { token: 'abc' });
    expect(data).toEqual({ status: 'ok' });
    expect(fetchSpy.mock.calls[0][1].headers.Authorization).toBe('Bearer abc');
  });

  it('turns the contract error body into an ApiError', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(
      JSON.stringify({ code: 'ITEM_NOT_AVAILABLE', message: 'No quedan unidades disponibles.', details: [] }),
      { status: 409 },
    ));
    await expect(apiRequest('/rentals', { method: 'POST', body: {} })).rejects.toMatchObject({
      status: 409,
      code: 'ITEM_NOT_AVAILABLE',
      message: 'No quedan unidades disponibles.',
    });
  });

  it('reports a Spanish message when there is no connection', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));
    const error = await apiRequest('/health').catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe('No hay conexión con el servidor.');
  });

  it('returns null on 204 No Content', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 204 }));
    expect(await apiRequest('/items/1', { method: 'DELETE' })).toBeNull();
  });
});
