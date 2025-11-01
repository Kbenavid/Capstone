"use client";
import PrivateRoute from "@/components/PrivateRoute";
import VanCard from "@/components/VanCard";

export default function Page() {
  return (
    <PrivateRoute>
      <VanCard />
    </PrivateRoute>
  );
}