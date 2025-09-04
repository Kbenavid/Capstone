import React, { useEffect, useState } from 'react';
import './PartsList.css';
import PartForm from './PartForm';
import PartEditForm from './PartEditForm';

export default function PartsList() {
  const API = process.env.REACT_APP_API_BASE_URL;
  const [parts, setParts] = useState([]);
  const [editingPartId, setEditingPartId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    var cancelled = false;
    (async function load() {
      try {
        const res = await fetch(API + '/api/parts', { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error((data && data.message) || ('Fetch failed (' + res.status + ')'));
        if (!Array.isArray(data)) throw new Error('Invalid response');
        if (!cancelled) {
          setParts(data);
          setEditingPartId(null);
          setError('');
        }
      } catch (e) {
        if (!cancelled) setError(e && e.message ? e.message : 'Failed to load parts');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return function () { cancelled = true; };
  }, [API]);

  async function handleDelete(id) {
    if (!window.confirm('Really delete this part?')) return;
    try {
      const res = await fetch(API + '/api/parts/' + id, { method: 'DELETE', credentials: 'include' });
      if (res.status !== 204) {
        const txt = await res.text();
        throw new Error('Delete failed (' + res.status + '): ' + txt);
      }
      setParts(function (list) { return list.filter(function (p) { return p._id !== id; }); });
    } catch (e) {
      alert(e && e.message ? e.message : 'Could not delete part');
    }
  }

  function Price({ value }) {
    var num = Number(value);
    if (!isFinite(num)) num = 0;
    return <>{'$' + num.toFixed(2)}</>;
  }

  if (loading) return <div className="container">Loading…</div>;
  if (error) return <div className="container error-box">{error}</div>;

  return (
    <div className="container">
      <PartForm onCreated={function () { setLoading(true); setTimeout(fetchParts, 0); }} />

      <h2 className="h2">Parts Inventory</h2>

      <table className="parts-table" aria-label="Parts inventory">
        <tbody>
          {parts.map(function (part) {
            var qty = Number(part && part.quantity ? part.quantity : 0);
            var rest = Number(part && part.restockThreshold ? part.restockThreshold : 0);
            var lowStock = qty < rest;
            var cardClass = 'part-card' + (lowStock ? ' low' : '');

            return (
              <tr key={part._id}>
                <td>
                  <div className={cardClass}>
                    {editingPartId === part._id ? (
                      <PartEditForm
                        part={part}
                        onCancel={function () { setEditingPartId(null); }}
                        onUpdated={fetchParts}
                      />
                    ) : (
                      <div className="card-grid">
                        <div className="meta">
                          <div className="thumb">
                            <img
                              src={API + '/api/barcodes/' + encodeURIComponent(part.sku)}
                              alt={'Barcode for ' + part.sku}
                            />
                          </div>
                          <div className="text">
                            <h4 className="name">{part.name}</h4>
                            <div className="sku">SKU: {part.sku}</div>
                            <div className="qty">Qty: {qty}</div>
                            {part.barcode ? <div className="barcode">Barcode: {part.barcode}</div> : null}
                          </div>
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
                          <button className="btn" onClick={function () { setEditingPartId(part._id); }}>Edit</button>
                          <button className="btn btn-danger" onClick={function () { handleDelete(part._id); }}>Delete</button>
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