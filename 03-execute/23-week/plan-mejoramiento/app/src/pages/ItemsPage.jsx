import { useEffect, useState } from 'react';
import { apiRequest } from '../api/client.js';
import { useAuth } from '../auth/AuthContext.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

// HU-04
export default function ItemsPage() {
  const { session } = useAuth();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState({ items: [], total: 0 });
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams({ q: query, page: '1', size: '20' });
    apiRequest(`/items?${params}`, { token: session.token })
      .then((data) => { setResult(data); setError(null); })
      .catch(setError);
  }, [query, session.token]);

  return (
    <section>
      <h1>Catálogo de artículos</h1>
      <label>
        Buscar por nombre o referencia
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ej.: carpa o CAR-0012" />
      </label>
      <ErrorMessage error={error} />
      <p>{result.total} artículo(s) encontrado(s)</p>
      <table>
        <thead>
          <tr><th>Referencia</th><th>Nombre</th><th>Categoría</th><th>Disponibles</th></tr>
        </thead>
        <tbody>
          {result.items.map((item) => (
            <tr key={item.id}>
              <td>{item.reference}</td>
              <td>{item.name}</td>
              <td>{item.category?.name}</td>
              <td>{item.available_units} de {item.total_units}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
