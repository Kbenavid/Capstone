"use client";
import PrivateRoute from "@/components/PrivateRoute";
import JobForm from "@/components/JobForm";

export default function Page() {
  return (
    <PrivateRoute>
      <JobForm />
    </PrivateRoute>
  );
}