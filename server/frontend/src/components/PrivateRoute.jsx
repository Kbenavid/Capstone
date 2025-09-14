import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  "";

export default function PrivateRoute({ children }) {
  const [ok, setOk] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
        setOk(r.ok);
      } catch {
        setOk(false);
      }
    })();
  }, []);
  if (ok === null) return null; // or spinner
  return ok ? children : <Navigate to="/login" replace />;
}