"use client";
import React, { useEffect, useState } from "react";
import styles from "./JobForm.module.css";

export default function JobForm({ onCreated }) {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [form, setForm] = useState({
    customerName: "",
    vanId: "",
    partsUsed: [],
  });
  const [parts, setParts] = useState([]);
  const [error, setError] = useState("");
  const [openParts, setOpenParts] = useState(false);

  useEffect(() => {
    async function fetchParts() {
      try {
        const res = await fetch(`${API}/parts`, { credentials: "include" });
        const data = await res.json();
        if (Array.isArray(data)) setParts(data);
      } catch (err) {
        console.error("Failed to fetch parts:", err);
      }
    }
    fetchParts();
  }, [API]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function togglePart(partId) {
    setForm((f) => {
      const exists = f.partsUsed.find((p) => p.partId === partId);
      if (exists) {
        return {
          ...f,
          partsUsed: f.partsUsed.filter((p) => p.partId !== partId),
        };
      } else {
        return {
          ...f,
          partsUsed: [...f.partsUsed, { partId, quantity: 1 }],
        };
      }
    });
  }

  function updateQuantity(partId, newQty) {
    setForm((f) => ({
      ...f,
      partsUsed: f.partsUsed.map((p) =>
        p.partId === partId ? { ...p, quantity: Number(newQty) || 0 } : p
      ),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.customerName || !form.vanId || form.partsUsed.length === 0) {
      setError("All fields + at least one part with quantity required");
      return;
    }

    try {
      const payload = {
        customerName: form.customerName,
        vanId: form.vanId,
        partsUsed: form.partsUsed.map((p) => ({
          part: p.partId,
          quantity: p.quantity,
        })),
      };

      const res = await fetch(`${API}/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save job");

      onCreated?.(data);
      setForm({ customerName: "", vanId: "", partsUsed: [] });
      setOpenParts(false);
    } catch (err) {
      console.error("Job create error:", err);
      setError(err.message);
    }
  }

  return (
    <section className={styles.jobFormCard}>
      <h2 className={styles.jobFormTitle}>Create New Job</h2>
      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.jobForm}>
        <div className={styles.formGroup}>
          <label>Customer Name</label>
          <input
            name="customerName"
            value={form.customerName}
            onChange={handleChange}
            placeholder="e.g. John Smith"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Van ID</label>
          <input
            name="vanId"
            value={form.vanId}
            onChange={handleChange}
            placeholder="e.g. Van-01"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Parts Used</label>
          <div
            className={styles.dropdownHeader}
            onClick={() => setOpenParts((prev) => !prev)}
          >
            <span>
              {form.partsUsed.length > 0
                ? `${form.partsUsed.length} part(s) selected`
                : "Select Parts"}
            </span>
            <span className={styles.chevron}>{openParts ? "▲" : "▼"}</span>
          </div>

          {openParts && (
            <div className={styles.dropdownPanel}>
              <div className={styles.partHeaderRow}>
                <span>Select</span>
                <span>Part Name</span>
                <span>Available</span>
                <span>Use Qty</span>
              </div>

              {parts.map((part) => {
                const selected = form.partsUsed.find(
                  (p) => p.partId === part._id
                );
                return (
                  <div key={part._id} className={styles.partRow}>
                    <input
                      type="checkbox"
                      checked={!!selected}
                      onChange={() => togglePart(part._id)}
                    />
                    <span>{part.name}</span>
                    <span>{part.quantity}</span>
                    <input
                      type="number"
                      min="1"
                      value={selected ? selected.quantity : ""}
                      onChange={(e) =>
                        updateQuantity(part._id, e.target.value)
                      }
                      disabled={!selected}
                      className={styles.qtyInput}
                    />
                  </div>
                );
              })}

              {parts.length === 0 && (
                <p className={styles.empty}>No parts in inventory.</p>
              )}
            </div>
          )}
        </div>

        <button type="submit" className={styles.addJobBtn}>
          Save Job
        </button>
      </form>
    </section>
  );
}