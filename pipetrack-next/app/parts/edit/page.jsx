"use client";
import PrivateRoute from "@/components/PrivateRoute";
import PartEditForm from "@/components/PartEditForm";

export default function Page() {
  return (
    <PrivateRoute>
      <PartEditForm />
    </PrivateRoute>
  );
}