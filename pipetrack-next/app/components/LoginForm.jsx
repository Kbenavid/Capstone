"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./LoginForm.module.css";

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const { message } = await res.json().catch(() => ({}));
        throw new Error(message || `Login failed (${res.status})`);
      }

      if (onLogin) onLogin();
      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    }
  }

  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginCard}>
        <h2 className={styles.loginTitle}>Login to PipeTrack</h2>

        {error && (
          <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            />
          </label>

          <label style={{ display: "block", marginTop: "12px" }}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            />
          </label>

          <button
            type="submit"
            style={{
              width: "100%",
              background: "var(--accent, #2563eb)",
              color: "white",
              padding: "10px",
              marginTop: "16px",
              borderRadius: "var(--radius, 6px)",
              border: "none",
              cursor: "pointer",
            }}
          >
            Log In
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "16px" }}>
          Don’t have an account?{" "}
          <Link href="/register" style={{ color: "#2563eb" }}>
            Register here
          </Link>
          .
        </p>
      </div>
    </div>
  );
}