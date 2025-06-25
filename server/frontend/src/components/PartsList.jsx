import React, { useEffect, useState } from 'react';
import PartForm         from './PartForm';
import PartEditForm     from './PartEditForm';

export default function PartsList() {
  const [parts, setParts]           = useState([]);
  const [editingPartId, setEditingPartId] = useState(null);

  // Load parts on mount (and after any create/update/delete)
  useEffect(() => {
    fetchParts();
  }, []);

  // Fetch all parts from the backend
  async function fetchParts() {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/parts`,
        { credentials: 'include' }
      );
      if (!res.ok) {
        throw new Error(`Fetch failed (${res.status})`);
      }
      const data = await res.json();
      setParts(data);
      setEditingPartId(null);  // exit edit mode if active
    } catch (err) {
      console.error('Failed to load parts:', err);
    }
  }

  // Delete a part by ID
  async function handleDelete(id) {
    if (!window.confirm('Really delete this part?')) return;
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/parts/${id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );
      if (!res.ok) {
        throw new Error(`Delete failed (${res.status})`);
      }
      fetchParts();
    } catch (err) {
      console.error('Failed to delete part:', err);
      alert('Could not delete part—check console for details.');
    }
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* CREATE */}
      <PartForm onCreated={fetchParts} />

      <h2 className="text-2xl mb-4">Parts Inventory</h2>
      {parts.length === 0 && <p>No parts found.</p>}

      {parts.map(part => (
        <div
          key={part._id}
          className="mb-4 border p-2 rounded bg-white"
        >
          {editingPartId === part._id ? (
            // EDIT MODE
            <PartEditForm
              part={part}
              onCancel={() => setEditingPartId(null)}
              onUpdated={fetchParts}
            />
          ) : (
            // VIEW MODE
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                {/* Barcode image */}
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}/api/barcodes/${encodeURIComponent(part.sku)}`}
                  alt={`Barcode for ${part.sku}`}
                  className="w-24 h-auto"
                />
                {/* Part details */}
                <div>
                  <strong>{part.name}</strong> — SKU: {part.sku}<br />
                  Qty: {part.quantity}, Price: ${part.price.toFixed(2)}<br />
                  Restock at: {part.restockThreshold}
                </div>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => setEditingPartId(part._id)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(part._id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
