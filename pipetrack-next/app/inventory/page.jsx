"use client";

import PrivateRoute from "../components/PrivateRoute";
import PartsList from "../components/PartsList";

export default function InventoryPage() {
  return (
    <PrivateRoute>
      <div style={{ padding: "2rem" }}>
        <h1>Inventory Dashboard</h1>
        <p>Manage all your plumbing parts, track quantities, and restock efficiently.</p>
        <PartsList />
      </div>
    </PrivateRoute>
  );
}