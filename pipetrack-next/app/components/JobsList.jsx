"use client";
import React, { useEffect, useState } from "react";
import styles from "./JobsList.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const r = await fetch(`${API_BASE}/jobs`, { credentials: "include" });
        if (!r.ok) throw new Error(`Failed to load jobs (${r.status})`);
        const data = await r.json();
        setJobs(Array.isArray(data) ? data : data.jobs || []);
      } catch (e) {
        setErr(e.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className={styles.jobsList}>
      <h1 className={styles.jobsListTitle}>Past Jobs</h1>

      {loading ? (
        <p>Loading…</p>
      ) : err ? (
        <p style={{ color: "#b91c1c" }}>Error: {err}</p>
      ) : jobs.length === 0 ? (
        <p>No jobs recorded.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {jobs.map((job) => {
            const customer = job.customerName || "Unknown customer";
            const van = job.vanId ?? "-";
            const when = job.jobDate ? new Date(job.jobDate) : null;
            const total =
              typeof job.totalCost === "number"
                ? job.totalCost.toFixed(2)
                : "0.00";
            const lines = Array.isArray(job.partsUsed) ? job.partsUsed : [];

            return (
              <div
                key={job._id}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: 16,
                  background: "var(--panel)",
                  boxShadow: "var(--shadow-1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <h2 style={{ fontSize: 16, margin: 0 }}>{customer}</h2>
                  <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <div style={{ fontWeight: 600 }}>Total: ${total}</div>
                    <div style={{ fontSize: 12, color: "gray" }}>Van: {van}</div>
                  </div>
                </div>

                <div style={{ fontSize: 13, color: "gray", marginBottom: 8 }}>
                  {when ? when.toLocaleString() : "-"}
                </div>

                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {lines.map((line, i) => {
                    const qty = line?.quantity ?? 0;
                    const name = line?.part?.name ?? "—";
                    const unit =
                      typeof line?.unitPrice === "number"
                        ? line.unitPrice.toFixed(2)
                        : "0.00";
                    const lineTotal =
                      typeof line?.lineTotal === "number"
                        ? line.lineTotal.toFixed(2)
                        : (qty * (line?.unitPrice || 0)).toFixed(2);

                    return (
                      <li key={i} style={{ fontSize: 13, marginBottom: 4 }}>
                        {qty} × {name} @ ${unit} = ${lineTotal}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}