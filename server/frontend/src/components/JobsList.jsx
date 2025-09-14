// server/frontend/src/JobsList.jsx
import React, { useEffect, useState } from "react";
import "./JobsList.css"; // keep any of your existing styles

// CRA env: set REACT_APP_API_BASE_URL=https://<backend>/api
const API_BASE = process.env.REACT_APP_API_BASE_URL || "";

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");
        // NOTE: base already ends with /api → don’t add another /api here
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
    <div className="page">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Past Jobs</h1>
        </div>

        <div className="card-body">
          {loading ? (
            <p style={{ margin: 0, color: "#6b7280" }}>Loading…</p>
          ) : err ? (
            <p style={{ margin: 0, color: "#b91c1c" }}>Error: {err}</p>
          ) : jobs.length === 0 ? (
            <p style={{ margin: 0, color: "#6b7280" }}>No jobs recorded.</p>
          ) : (
            <div
              className="grid"
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
                  <div key={job._id} className="card">
                    <div
                      className="card-header"
                      style={{ marginBottom: 8, alignItems: "flex-start" }}
                    >
                      <h2 className="card-title" style={{ fontSize: 16 }}>
                        {customer}
                      </h2>
                      <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <div style={{ fontWeight: 600 }}>Total: ${total}</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>
                          Van: {van}
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: 13, color: "#374151", marginBottom: 8 }}>
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
      </div>
    </div>
  );
}