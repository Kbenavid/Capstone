import React, { useCallback, useEffect, useState } from 'react';
import './PartsList.css';
import PartForm from './PartForm';
import PartEditForm from './PartEditForm';

export default function PartsList() {
  const API = process.env.REACT_APP_API_BASE_URL;
  const [parts, setParts] = useState([]);
  const [editingPartId, setEditingPartId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const reloadParts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/parts`, { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error((data && data.message) || `Fetch failed (${res.status})`);
      if (!Array.isArray(data)) throw new Error('Invalid response');
      setParts(data);
      setEditingPartId(null);
      setError('');
    } catch (e) {
      setError((e && e.message) || 'Failed to load parts');
    } finally {
      setLoading(false);
    }
  }, [API]);

  useEffect(() => { reloadParts(); }, [reloadParts]);

  async function handleDelete(id) {
    if (!window.confirm('Really delete this part?')) return;
    try {
      const res = await fetch(`${API}/api/parts/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.status !== 204) {
        const txt = await res.text();
        throw new Error(`Delete failed (${res.status}): ${txt}`);
      }
      setParts(list => list.filter(p => p._id !== id));
    } catch (e) {
      alert((e && e.message) || 'Could not delete part');
    }
  }

  function Price({ value }) {
    const n = Number(value);
    const safe = Number.isFinite(n) ? n : 0;
    return <>{`$${safe.toFixed(2)}`}</>;
  }

  if (loading) return <div className="container">Loading…</div>;
  if (error) return <div className="container error-box">{error}</div>;

  return (
    <div className="container">
      <PartForm onCreated={reloadParts} />

      <h2 className="h2">Parts Inventory</h2>

      <table className="parts-table" aria-label="Parts inventory">
        <tbody>
          {parts.map(part => {
            const qty = Number(part && part.quantity ? part.quantity : 0);
            const rest = Number(part && part.restockThreshold ? part.restockThreshold : 0);
            const lowStock = qty < rest;
            const cardClass = `part-card${lowStock ? ' low' : ''}`;

            return (
              <tr key={part._id}>
                <td>
                  <div className={cardClass}>
                    {editingPartId === part._id ? (
                      <PartEditForm
                        part={part}
                        onCancel={() => setEditingPartId(null)}
                        onUpdated={reloadParts}
                      />
                    ) : (
                      <div className="card-grid no-thumb">
                        <div className="meta-only">
                          <h4 className="name">{part.name}</h4>
                          <div className="sku">SKU: {part.sku}</div>
                          <div className="qty">Qty: {qty}</div>
                          {part.barcode ? <div className="barcode">Barcode: {part.barcode}</div> : null}
                        </div>

                        <div className="stat">
                          <div className="label">Price</div>
                          <div className="value"><Price value={part.price} /></div>
                        </div>

                        <div className="stat">
                          <div className="label">Restock at</div>
                          <div className="value">{rest}</div>
                        </div>

                        <div className="actions">
                          {lowStock ? <span className="badge-danger">Restock</span> : null}
                          <button className="btn" onClick={() => setEditingPartId(part._id)}>Edit</button>
                          <button className="btn btn-danger" onClick={() => handleDelete(part._id)}>Delete</button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}

          {parts.length === 0 ? (
            <tr>
              <td>
                <div className="empty">No parts yet.</div>
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
