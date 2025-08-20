import "./PartEditForm.css";
import React, { useState } from 'react';

export default function PartEditForm({ part, onCancel, onUpdated }) {
  // Local state for each field, initialized from the `part` prop
  const [name, setName]               = useState(part.name);
  const [sku, setSku]                 = useState(part.sku);
  const [quantity, setQuantity]       = useState(part.quantity);
  const [price, setPrice]             = useState(part.price);
  const [restockThreshold, setRestock]= useState(part.restockThreshold);
  const [error, setError]             = useState('');

  // Submit updated part
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/parts/${part._id}`,
        {
          method: 'PUT',                   // HTTP PUT for update
          credentials: 'include',          // include auth cookie
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            sku,
            quantity,
            price,
            restockThreshold
          }),
        }
      );
      if (!res.ok) throw new Error(`Update failed (${res.status})`);
      onUpdated();                       // tell parent to reload list & exit edit mode
    } catch (err) {
      console.error('Failed to update part:', err);
      setError('Could not save changes');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-2 p-2 border rounded bg-gray-50">
      <h3 className="font-semibold mb-2">Edit Part</h3>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <label className="block mb-1">
        Name
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border p-1 rounded"
          required
        />
      </label>

      <label className="block mb-1">
        SKU
        <input
          value={sku}
          onChange={e => setSku(e.target.value)}
          className="w-full border p-1 rounded"
          required
        />
      </label>

      <label className="block mb-1">
        Quantity
        <input
          type="number"
          value={quantity}
          onChange={e => setQuantity(+e.target.value)}
          className="w-full border p-1 rounded"
        />
      </label>

      <label className="block mb-1">
        Price
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={e => setPrice(+e.target.value)}
          className="w-full border p-1 rounded"
        />
      </label>

      <label className="block mb-2">
        Restock Threshold
        <input
          type="number"
          value={restockThreshold}
          onChange={e => setRestock(+e.target.value)}
          className="w-full border p-1 rounded"
        />
      </label>

      <div className="flex space-x-2">
        <button
          type="submit"
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}                // cancel edit mode
          className="px-3 py-1 bg-gray-400 text-white rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
