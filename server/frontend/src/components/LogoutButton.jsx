// src/components/LogoutButton.jsx
import "./LogoutButton.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutButton({ onLogout }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    if (busy) return;
    setBusy(true);
    try {
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (_) {
      // ignore network errors for logout
    } finally {
      // clear any client auth state (safe-optional call)
      onLogout?.();
      setBusy(false);
      navigate("/login", { replace: true });
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      className="ml-auto px-3 py-1 bg-red-500 text-white rounded disabled:opacity-60"
    >
      {busy ? "Logging out..." : "Logout"}
    </button>
  );
}