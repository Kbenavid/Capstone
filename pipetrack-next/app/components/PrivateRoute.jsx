"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * PrivateRoute
 * Protects client-side pages by verifying user authentication
 */
export default function PrivateRoute({ children }) {
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // ✅ Use the actual backend route
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`,
          { credentials: "include" }
        );

        const data = await res.json();
        if (data.ok) {
          setAuthorized(true);
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/login");
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  if (checking) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Checking authentication...</p>
      </div>
    );
  }

  return authorized ? children : null;
}