import React, { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
} from 'react-router-dom';

import PartsList    from './components/PartsList';
import RegisterForm from './components/RegisterForm';
import LoginForm    from './components/LoginForm';
import JobForm      from './components/JobForm';
import JobsList     from './components/JobsList';
import LogoutButton from './components/LogoutButton';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      {/* Mobile-first nav: column on xs, row on sm+ */}
      {isLoggedIn && (
        <nav className="p-4 bg-gray-100 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          <Link
            to="/"
            className="text-blue-600 hover:underline"
          >
            Inventory
          </Link>
          <Link
            to="/jobs"
            className="text-blue-600 hover:underline"
          >
            Jobs
          </Link>
          <LogoutButton onLogout={() => setIsLoggedIn(false)} />
        </nav>
      )}

      <Routes>
        {/* Public */}
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/login"
          element={<LoginForm onLogin={() => setIsLoggedIn(true)} />}
        />

        {/* Inventory */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <PartsList />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Jobs */}
        <Route
          path="/jobs"
          element={
            isLoggedIn ? (
              <div className="max-w-4xl mx-auto p-4">
                <JobForm onCreated={() => window.location.reload()} />
                <JobsList />
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
