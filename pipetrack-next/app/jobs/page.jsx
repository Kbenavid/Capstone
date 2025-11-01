"use client";

import PrivateRoute from "../components/PrivateRoute";
import JobForm from "../components/JobForm";
import JobsList from "../components/JobsList";

export default function JobsPage() {
  return (
    <PrivateRoute>
      <div style={{ padding: "2rem" }}>
        <h1>Jobs Dashboard</h1>
        <p>Create, track, and review plumbing jobs for your service vans.</p>

        {/* New job creation form */}
        <JobForm onCreated={() => window.location.reload()} />

        <hr style={{ margin: "2rem 0" }} />

        {/* Past jobs list */}
        <JobsList />
      </div>
    </PrivateRoute>
  );
}