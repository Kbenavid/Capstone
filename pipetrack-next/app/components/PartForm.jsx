"use client";
import React, { useState } from "react";
import styles from "./PartForm.module.css";

export default function PartForm({ onCreated }) {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    quantity: "",
    price: "",
    restockThreshold: "",
  });
  const [error, setError] = useState("");

  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

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
      try {
        data = await res.json();
      } catch {}

      if (!res.ok)
        throw new Error(data.message || `Create failed (${res.status})`);

      onCreated?.(data);
      setForm({
        name: "",
        sku: "",
        quantity: "",
        price: "",
        restockThreshold: "",
      });
    } catch (err) {
      setError(err.message || "Server error");
      console.error("Create part error:", err);
    }
  }

  return (
    <div className={styles.partFormWrap}>
      <h3 className={styles.partFormTitle}>Add New Part</h3>

      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
      )}

      <form
        className={styles.partForm}
        onSubmit={handleSubmit}
        noValidate
      >
        <div className={styles.formRow}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={onChange}
            required
            autoComplete="off"
          />
        </div>

        <div className={styles.formRow}>
          <label htmlFor="sku">SKU</label>
          <input
            id="sku"
            name="sku"
            value={form.sku}
            onChange={onChange}
            required
            autoComplete="off"
          />
        </div>

        <div className={styles.formRow}>
          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            step="1"
            value={form.quantity}
            onChange={onChange}
            autoComplete="off"
          />
        </div>

        <div className={styles.formRow}>
          <label htmlFor="price">Price</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={onChange}
            autoComplete="off"
          />
        </div>

        <div className={styles.formRow}>
          <label htmlFor="restockThreshold">Restock Threshold</label>
          <input
            id="restockThreshold"
            name="restockThreshold"
            type="number"
            min="0"
            step="1"
            value={form.restockThreshold}
            onChange={onChange}
            autoComplete="off"
          />
        </div>

        <div className={styles.actions}>
          <button type="submit">Add Part</button>
        </div>
      </form>
    </div>
  );
}