// src/components/PartForm.jsx
import React, { useState } from "react";
import "./PartForm.css";

export default function PartForm({ onCreated }) {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    quantity: "",
    price: "",
    restockThreshold: "",
  });
  const [error, setError] = useState("");

  const API = process.env.REACT_APP_API_BASE_URL;

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      quantity: Number(form.quantity) || 0,
      price: Number(form.price) || 0,
      restockThreshold: Number(form.restockThreshold) || 0,
    };

    try {
      const res = await fetch(`${API}/parts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      let data = {};
      try { data = await res.json(); } catch {}

      if (!res.ok) throw new Error(data.message || `Create failed (${res.status})`);

      onCreated?.(data);
      setForm({ name: "", sku: "", quantity: "", price: "", restockThreshold: "" });
    } catch (err) {
      setError(err.message || "Server error");
      console.error("Create part error:", err);
    }
  }

  return (
    <div className="part-form-wrap card">
      <h3 className="part-form-title">Add New Part</h3>
      {error && <div className="error-box">{error}</div>}

      <form className="form part-form" onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <label className="label" htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            className="input"
            value={form.name}
            onChange={onChange}
            required
            autoComplete="off"
          />
        </div>

        <div className="form-row">
          <label className="label" htmlFor="sku">SKU</label>
          <input
            id="sku"
            name="sku"
            className="input"
            value={form.sku}
            onChange={onChange}
            required
            autoComplete="off"
          />
        </div>

        <div className="form-row">
          <label className="label" htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            name="quantity"
            className="input"
            type="number"
            min="0"
            step="1"
            value={form.quantity}
            onChange={onChange}
            autoComplete="off"
          />
        </div>

        <div className="form-row">
          <label className="label" htmlFor="price">Price</label>
          <input
            id="price"
            name="price"
            className="input"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={onChange}
            autoComplete="off"
          />
        </div>

        <div className="form-row">
          <label className="label" htmlFor="restockThreshold">Restock Threshold</label>
          <input
            id="restockThreshold"
            name="restockThreshold"
            className="input"
            type="number"
            min="0"
            step="1"
            value={form.restockThreshold}
            onChange={onChange}
            autoComplete="off"
          />
        </div>

        <div className="actions">
          <button type="submit" className="btn btn-primary">Add Part</button>
        </div>
      </form>
    </div>
  );
}
