import { useEffect, useState } from 'react';
import { apiRequest } from '../api/client.js';
import { useAuth } from '../auth/AuthContext.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

// HU-09
export default function OverduePage() {
  const { session } = useAuth();
  const [lines, setLines] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiRequest('/rentals/overdue', { token: session.token })
      .then((data) => setLines(data.items))
      .catch(setError);
  }, [session.token]);

  return (
    <section>
      <h1>Artículos vencidos</h1>
      <ErrorMessage error={error} />
      {lines.length === 0 && !error && <p>No hay artículos vencidos.</p>}
      <table>
        <thead>
          <tr><th>Artículo</th><th>Cliente</th><th>Vencía</th><th>Días de retraso</th></tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <tr key={line.line_id}>
              <td>{line.item_name}</td>
              <td>{line.customer_name}</td>
              <td>{new Date(line.due_at).toLocaleDateString('es-CO')}</td>
              <td>{line.days_late}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
