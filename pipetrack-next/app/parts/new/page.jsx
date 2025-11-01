"use client";
import PrivateRoute from "@/components/PrivateRoute";
import PartForm from "@/components/PartForm";

export default function Page() {
  return (
    <PrivateRoute>
      <PartForm />
    </PrivateRoute>
  );
}