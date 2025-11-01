"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./LogoutButton.module.css";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  async function handleLogout() {
    console.log("🟢 Logout clicked");
    setLoading(true);

    try {
      console.log("🌐 Sending logout request to:", `${API_BASE}/api/auth/logout`);

      const res = await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      console.log("🔵 Logout response status:", res.status);

      if (res.ok) {
        console.log("✅ Logged out successfully");
      } else {
        const text = await res.text();
        console.error("❌ Logout failed:", res.status, text);
      }
    } catch (err) {
      console.error("🔥 Logout error:", err);
    } finally {
      console.log("➡️ Redirecting to /login");
      setLoading(false);
      router.push("/login");
    }
  }

  return (
    <button
      className={styles.logoutBtn}
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}