"use client";

import React, { useEffect, useState } from "react";
import PrivateRoute from "./components/PrivateRoute";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch logged-in user info
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.ok) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  return (
    <PrivateRoute>
      <div className={styles.dashboard}>
        <h1>
          Welcome{ user ? `, ${user.username}` : ""} 
        </h1>
        <p className={styles.subtitle}>
          Manage your plumbing vans, inventory, and jobs efficiently.
        </p>

        <div className={styles.cards}>
          <div
            className={styles.card}
            onClick={() => (window.location.href = "/inventory")}
          >
            <h3>🧰 Inventory</h3>
            <p>View and restock parts</p>
          </div>

          <div
            className={styles.card}
            onClick={() => (window.location.href = "/jobs")}
          >
            <h3>📋 Jobs</h3>
            <p>Track and schedule service jobs</p>
          </div>

          <div
            className={styles.card}
            onClick={() => (window.location.href = "/vans")}
          >
            <h3>🚐 Vans</h3>
            <p>Monitor van assignments</p>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.btn}
            onClick={() => (window.location.href = "/jobs/new")}
          >
            ➕ Create New Job
          </button>

          <button
            className={styles.btnSecondary}
            onClick={() => (window.location.href = "/inventory")}
          >
            Manage Inventory
          </button>
        </div>
      </div>
    </PrivateRoute>
  );
}