import React, { useEffect, useState } from 'react';

export default function JobForm({ onCreated }) {
  const [customerName, setCustomerName] = useState('');
  const [vanId, setVanId]               = useState('');
  const [parts, setParts]               = useState([]);
  const [selection, setSelection]       = useState([]);
  const [error, setError]               = useState('');

  // load parts for dropdown
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/parts`, { credentials: 'include' })
      .then(r => r.json())
      .then(setParts)
      .catch(console.error);
  }, []);

  function addLine() {
    setSelection([
      ...selection,
      { part: parts[0]?._id || '', quantity: 1 }
    ]);
  }

  function updateLine(i, field, value) {
    const copy = [...selection];
    copy[i][field] = field === 'quantity' ? +value : value;
    setSelection(copy);
  }

  function removeLine(i) {
    setSelection(selection.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!customerName || !vanId || selection.length === 0) {
      setError('All fields + at least one part required');
      return;
    }
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/jobs`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName,
            vanId,
            partsUsed: selection.map(s => ({ part: s.part, quantity: s.quantity }))
          }),
        }
      );
      if (!res.ok) throw new Error(`Failed (${res.status})`);
      await res.json();
      onCreated();               // refresh parent list
      // reset form
      setCustomerName('');
      setVanId('');
      setSelection([]);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-gray-50">
      <h3 className="text-xl mb-2">New Job</h3>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <label className="block mb-2">
        Customer Name
        <input
          value={customerName}
          onChange={e => setCustomerName(e.target.value)}
          className="w-full border p-1 rounded"
          required
        />
      </label>

      <label className="block mb-2">
        Van ID
        <input
          value={vanId}
          onChange={e => setVanId(e.target.value)}
          className="w-full border p-1 rounded"
          required
        />
      </label>

      <div className="mb-2">
        <h4 className="font-semibold">Parts Used</h4>
        {selection.map((line, i) => (
          <div key={i} className="flex space-x-2 items-center mb-1">
            <select
              value={line.part}
              onChange={e => updateLine(i, 'part', e.target.value)}
              className="border p-1 rounded flex-1"
            >
              {parts.map(p => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.sku})
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={line.quantity}
              onChange={e => updateLine(i, 'quantity', e.target.value)}
              className="w-16 border p-1 rounded"
            />
            <button
              type="button"
              onClick={() => removeLine(i)}
              className="px-2 py-1 bg-gray-400 text-white rounded"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addLine}
          className="mt-1 px-2 py-1 bg-blue-600 text-white rounded"
        >
          Add Part
        </button>
      </div>

      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
      >
        Save Job
      </button>
    </form>
  );
}
