import "./PartForm.css";
import React, { useState } from 'react';

export default function PartForm({ onCreated }) {
  const [name, setName]               = useState('');
  const [sku, setSku]                 = useState('');
  const [quantity, setQuantity]       = useState(0);
  const [price, setPrice]             = useState(0);
  const [restockThreshold, setRestock] = useState(0);
  const [error, setError]             = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/parts`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',           // include auth cookie
        body: JSON.stringify({ name, sku, quantity, price, restockThreshold }),
      }
    );

    const data = await res.json();
    if (res.ok) {
      onCreated(data);                   // tell parent a new part was created
      // reset form
      setName(''); setSku(''); setQuantity(0);
      setPrice(0); setRestock(0);
    } else {
      setError(data.message || 'Failed to create part');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
      <h3 className="text-xl mb-2">Add New Part</h3>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <label className="block mb-2">
        Name
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border p-1 rounded"
          required
        />
      </label>

      <label className="block mb-2">
        SKU
        <input
          value={sku}
          onChange={e => setSku(e.target.value)}
          className="w-full border p-1 rounded"
          required
        />
      </label>

      <label className="block mb-2">
        Quantity
        <input
          type="number"
          value={quantity}
          onChange={e => setQuantity(+e.target.value)}
          className="w-full border p-1 rounded"
        />
      </label>

      <label className="block mb-2">
        Price
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={e => setPrice(+e.target.value)}
          className="w-full border p-1 rounded"
        />
      </label>

      <label className="block mb-4">
        Restock Threshold
        <input
          type="number"
          value={restockThreshold}
          onChange={e => setRestock(+e.target.value)}
          className="w-full border p-1 rounded"
        />
      </label>

      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Add Part
      </button>
    </form>
  );
}
