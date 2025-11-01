"use client";
import PrivateRoute from "@/components/PrivateRoute";
import PartsList from "@/components/PartsList";

export default function Page() {
  return (
    <PrivateRoute>
      <PartsList />
    </PrivateRoute>
  );
}