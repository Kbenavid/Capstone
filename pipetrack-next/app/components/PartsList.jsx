"use client";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./PartsList.module.css";
import PartForm from "./PartForm";
import PartEditForm from "./PartEditForm";

export default function PartsList() {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [parts, setParts] = useState([]);
  const [editingPartId, setEditingPartId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const reloadParts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/parts`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.message || `Fetch failed (${res.status})`);
      if (!Array.isArray(data)) throw new Error("Invalid response");
      setParts(data);
      setEditingPartId(null);
      setError("");
    } catch (e) {
      setError(e?.message || "Failed to load parts");
    } finally {
      setLoading(false);
    }
  }, [API]);

  useEffect(() => {
    reloadParts();
  }, [reloadParts]);

  async function handleDelete(id) {
    if (!window.confirm("Really delete this part?")) return;
    try {
      const res = await fetch(`${API}/parts/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.status !== 204) {
        const txt = await res.text();
        throw new Error(`Delete failed (${res.status}): ${txt}`);
      }
      setParts((list) => list.filter((p) => p._id !== id));
    } catch (e) {
      alert(e?.message || "Could not delete part");
    }
  }

  function Price({ value }) {
    const n = Number(value);
    const safe = Number.isFinite(n) ? n : 0;
    return <>{`$${safe.toFixed(2)}`}</>;
  }

  if (loading) return <div className={styles.container}>Loading…</div>;
  if (error) return <div className={`${styles.container} ${styles.errorBox}`}>{error}</div>;

  return (
    <div className={styles.container}>
      <PartForm onCreated={reloadParts} />

      <h2>Parts Inventory</h2>

      <table className={styles.partsTable} aria-label="Parts inventory">
        <tbody>
          {parts.map((part) => {
            const qty = Number(part?.quantity ?? 0);
            const rest = Number(part?.restockThreshold ?? 0);
            const lowStock = qty < rest;
            const cardClass = `${styles.partCard} ${lowStock ? styles.low : ""}`;

            return (
              <tr key={part._id}>
                <td>
                  <div className={cardClass}>
                    {editingPartId === part._id ? (
                      <PartEditForm
                        part={part}
                        onCancel={() => setEditingPartId(null)}
                        onUpdated={reloadParts}
                      />
                    ) : (
                      <div className={`${styles.cardGrid} ${styles.noThumb}`}>
                        <div className={styles.metaOnly}>
                          <h4 className={styles.name}>{part.name}</h4>
                          <div className={styles.sku}>SKU: {part.sku}</div>
                          <div className={styles.qty}>Qty: {qty}</div>
                          {part.barcode && (
                            <div className={styles.barcode}>
                              Barcode: {part.barcode}
                            </div>
                          )}
                        </div>

                        <div className={styles.stat}>
                          <div className={styles.label}>Price</div>
                          <div className={styles.value}>
                            <Price value={part.price} />
                          </div>
                        </div>

                        <div className={styles.stat}>
                          <div className={styles.label}>Restock at</div>
                          <div className={styles.value}>{rest}</div>
                        </div>

                        <div className={styles.actions}>
                          {lowStock && (
                            <span className={styles.badgeDanger}>Restock</span>
                          )}
                          <button
                            className={styles.btn}
                            onClick={() => setEditingPartId(part._id)}
                          >
                            Edit
                          </button>
                          <button
                            className={`${styles.btn} ${styles.btnDanger}`}
                            onClick={() => handleDelete(part._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}

          {parts.length === 0 && (
            <tr>
              <td>
                <div className={styles.empty}>No parts yet.</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}