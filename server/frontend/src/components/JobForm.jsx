// server/frontend/src/JobForm.jsx
import "./JobForm.css";
import React, { useEffect, useState } from "react";

const API = process.env.REACT_APP_API_BASE_URL || "";

export default function JobForm({ onCreated }) {
  const [customerName, setCustomerName] = useState("");
  const [vanId, setVanId] = useState("");
  const [parts, setParts] = useState([]);
  const [selection, setSelection] = useState([]);
  const [error, setError] = useState("");

  // load parts for dropdown
  useEffect(() => {
    // BASE already ends with /api → don't add another /api here
    fetch(`${API}/parts`, { credentials: "include" })
      .then((r) => r.json())
      .then(setParts)
      .catch(console.error);
  }, []);

  function addLine() {
    setSelection((prev) => [
      ...prev,
      { part: parts[0]?._id || "", quantity: 1 },
    ]);
  }

  function updateLine(i, field, value) {
    setSelection((prev) => {
      const copy = [...prev];
      copy[i][field] = field === "quantity" ? +value : value;
      return copy;
    });
  }

  function removeLine(i) {
    setSelection((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!customerName || !vanId || selection.length === 0) {
      setError("All fields + at least one part required");
      return;
    }

    try {
      const res = await fetch(`${API}/jobs`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          vanId,
          partsUsed: selection.map((s) => ({
            part: s.part,
            quantity: s.quantity,
          })),
        }),
      });
      if (!res.ok) throw new Error(`Failed (${res.status})`);
      await res.json();

      onCreated?.(); // refresh parent list

      // reset form
      setCustomerName("");
      setVanId("");
      setSelection([]);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  return (
    <div className="page">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">New Job</h1>
        </div>

        <div className="card-body">
          {error && <div className="error-box" style={{ marginBottom: 12 }}>{error}</div>}

          <form onSubmit={handleSubmit} className="form">
            <div className="form-row">
              <label className="label">Customer Name</label>
              <input
                className="input"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                required
              />
            </div>

            <div className="form-row">
              <label className="label">Van ID</label>
              <input
                className="input"
                value={vanId}
                onChange={(e) => setVanId(e.target.value)}
                placeholder="e.g., VAN-01"
                required
              />
            </div>

            <div className="form-row" style={{ alignItems: "start" }}>
              <label className="label" style={{ marginTop: 10 }}>Parts Used</label>
              <div style={{ width: "100%" }}>
                {selection.map((line, i) => (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 90px 36px",
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <select
                      className="input"
                      value={line.part}
                      onChange={(e) => updateLine(i, "part", e.target.value)}
                    >
                      {parts.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name} ({p.sku})
                        </option>
                      ))}
                    </select>
                    <input
                      className="input"
                      type="number"
                      min="1"
                      value={line.quantity}
                      onChange={(e) => updateLine(i, "quantity", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeLine(i)}
                      className="btn"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addLine}
                  className="btn"
                  style={{ marginTop: 4 }}
                >
                  Add Part
                </button>
              </div>
            </div>

            <div className="card-actions">
              <button type="submit" className="btn btn-primary">
                Save Job
              </button>
            </div>
          </form>

          <p className="help">All fields are required. Add at least one part.</p>
        </div>
      </div>
    </div>
  );
}