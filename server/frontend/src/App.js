import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import NavBar from './components/NavBar';
import PartsList from './components/PartsList';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import JobForm from './components/JobForm';
import JobsList from './components/JobsList';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); // avoid flicker
  const API = process.env.REACT_APP_API_BASE_URL;

  // ✅ Persist login across refresh
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // FIXED: removed double /api
        const res = await fetch(`${API}/auth/me`, { credentials: 'include' });
        if (!cancelled) setIsLoggedIn(res.ok);
      } catch (_) {
        if (!cancelled) setIsLoggedIn(false);
      } finally {
        if (!cancelled) setAuthChecked(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [API]);

  // ✅ Logout handler
  async function handleLogout() {
    try {
      // FIXED: removed double /api
      await fetch(`${API}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (_) {
      // ignore network hiccups
    } finally {
      setIsLoggedIn(false);
      window.location.href = '/login';
    }
  }

  if (!authChecked) return null; // or a tiny loading spinner

  return (
    <BrowserRouter>
      {isLoggedIn && <NavBar onLogout={handleLogout} />}

      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/login"
          element={
            <LoginForm
              onLogin={() => {
                setIsLoggedIn(true);
                window.location.href = '/';
              }}
            />
          }
        />

        {/* Inventory (Protected) */}
        <Route
          path="/"
          element={isLoggedIn ? <PartsList /> : <Navigate to="/login" replace />}
        />

        {/* Jobs (Protected) */}
        <Route
          path="/jobs"
          element={
            isLoggedIn ? (
              <div className="container">
                <JobForm onCreated={() => window.location.reload()} />
                <JobsList />
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? '/' : '/login'} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;