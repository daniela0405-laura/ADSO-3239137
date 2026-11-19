// Single entry point to the API (docs/api-contract.md).
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1';

export class ApiError extends Error {
  constructor(status, body) {
    super(body?.message ?? 'Ocurrió un error inesperado. Intenta de nuevo.');
    this.status = status;
    this.code = body?.code ?? 'UNKNOWN';
    this.details = body?.details ?? [];
  }
}

export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = { Accept: 'application/json' };
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, { message: 'No hay conexión con el servidor.' });
  }

  if (response.status === 204) return null;
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(response.status, data);
  return data;
}
