import { useState } from 'react';
import { apiRequest } from '../api/client.js';
import { useAuth } from '../auth/AuthContext.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

// HU-10
export default function ReportPage() {
  const { session } = useAuth();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!from || !to) {
      setError(new Error('Elige la fecha inicial y la final.'));
      return;
    }
    if (to < from) {
      setError(new Error('La fecha final no puede ser anterior a la inicial.'));
      return;
    }
    try {
      const data = await apiRequest(`/reports/most-requested?from=${from}&to=${to}`, { token: session.token });
      setRows(data.rows);
      setError(null);
    } catch (err) {
      setError(err);
    }
  }

  return (
    <section>
      <h1>Artículos más solicitados</h1>
      <form onSubmit={handleSubmit} noValidate>
        <label>Desde<input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
        <label>Hasta<input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></label>
        <ErrorMessage error={error} />
        <button type="submit">Ver reporte</button>
      </form>
      {rows && rows.length === 0 && <p>No hubo alquileres en ese rango.</p>}
      {rows && rows.length > 0 && (
        <table>
          <thead><tr><th>Artículo</th><th>Categoría</th><th>Veces alquilado</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.item_id}-${row.item_name}-${row.category_name}`}>
                <td>{row.item_name}</td><td>{row.category_name}</td><td>{row.times_rented}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
