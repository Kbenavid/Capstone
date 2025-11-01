"use client";
import React, { useState } from "react";
import styles from "./PartEditForm.module.css";

export default function PartEditForm({ part, onCancel, onUpdated }) {
  const [name, setName] = useState(part.name);
  const [sku, setSku] = useState(part.sku);
  const [quantity, setQuantity] = useState(part.quantity);
  const [price, setPrice] = useState(part.price);
  const [restockThreshold, setRestock] = useState(part.restockThreshold);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/parts/${part._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            sku,
            quantity,
            price,
            restockThreshold,
          }),
        }
      );

      if (!res.ok) throw new Error(`Update failed (${res.status})`);
      onUpdated?.(); // Refresh parent list and exit edit mode
    } catch (err) {
      console.error("Failed to update part:", err);
      setError("Could not save changes");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.partEditForm}>
      <h3 className={styles.partEditTitle}>Edit Part</h3>

      {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

      <label>
        Name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginTop: "4px" }}
        />
      </label>

      <label style={{ display: "block", marginTop: "12px" }}>
        SKU
        <input
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginTop: "4px" }}
        />
      </label>

      <label style={{ display: "block", marginTop: "12px" }}>
        Quantity
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(+e.target.value)}
          style={{ width: "100%", padding: "8px", marginTop: "4px" }}
        />
      </label>

      <label style={{ display: "block", marginTop: "12px" }}>
        Price
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(+e.target.value)}
          style={{ width: "100%", padding: "8px", marginTop: "4px" }}
        />
      </label>

      <label style={{ display: "block", marginTop: "12px" }}>
        Restock Threshold
        <input
          type="number"
          value={restockThreshold}
          onChange={(e) => setRestock(+e.target.value)}
          style={{ width: "100%", padding: "8px", marginTop: "4px" }}
        />
      </label>

      <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
        <button
          type="submit"
          style={{
            padding: "8px 14px",
            background: "var(--primary, #2563eb)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-sm, 6px)",
            cursor: "pointer",
          }}
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: "8px 14px",
            background: "gray",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-sm, 6px)",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}