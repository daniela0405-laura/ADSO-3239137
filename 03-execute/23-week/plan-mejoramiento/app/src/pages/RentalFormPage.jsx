import { useState } from 'react';
import { apiRequest } from '../api/client.js';
import { useAuth } from '../auth/AuthContext.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export const MAX_ITEMS_PER_RENTAL = 4;

// HU-06
export default function RentalFormPage() {
  const { session } = useAuth();
  const [customerId, setCustomerId] = useState('');
  const [itemIds, setItemIds] = useState(['']);
  const [error, setError] = useState(null);
  const [created, setCreated] = useState(null);

  function updateItem(index, value) {
    setItemIds((current) => current.map((id, i) => (i === index ? value : id)));
  }

  function addItem() {
    if (itemIds.length < MAX_ITEMS_PER_RENTAL) setItemIds((current) => [...current, '']);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const items = itemIds.map((id) => id.trim()).filter(Boolean);
    if (!customerId.trim() || items.length === 0) {
      setError(new Error('Indica el cliente y al menos un artículo.'));
      return;
    }
    if (new Set(items).size !== items.length) {
      setError(new Error('No repitas el mismo artículo en un alquiler.'));
      return;
    }
    try {
      const rental = await apiRequest('/rentals', {
        method: 'POST',
        token: session.token,
        body: { customer_id: customerId.trim(), items: items.map((item_id) => ({ item_id })) },
      });
      setCreated(rental);
      setError(null);
    } catch (err) {
      setError(err);
    }
  }

  return (
    <section>
      <h1>Registrar alquiler</h1>
      <form onSubmit={handleSubmit} noValidate>
        <label>
          Id del cliente
          <input value={customerId} onChange={(e) => setCustomerId(e.target.value)} />
        </label>
        {itemIds.map((id, index) => (
          <label key={index}>
            Id del artículo {index + 1}
            <input value={id} onChange={(e) => updateItem(index, e.target.value)} />
          </label>
        ))}
        <button type="button" onClick={addItem} disabled={itemIds.length >= MAX_ITEMS_PER_RENTAL}>
          Agregar otro artículo
        </button>
        <ErrorMessage error={error} />
        <button type="submit">Registrar alquiler</button>
      </form>
      {created && (
        <p className="success">Alquiler registrado. Devolver antes de {new Date(created.items[0].due_at).toLocaleDateString('es-CO')}.</p>
      )}
    </section>
  );
}
