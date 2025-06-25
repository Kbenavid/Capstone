import React, { useState } from 'react';              // React core and state hook
import { useNavigate }        from 'react-router-dom'; // Hook to programmatically navigate

export default function RegisterForm() {
  // ─────────── State Hooks ───────────────────────────────────
  const [username, setUsername] = useState('');       // Controlled input value for username
  const [password, setPassword] = useState('');       // Controlled input value for password
  const [error,    setError]    = useState('');       // Any error message to display

  const navigate = useNavigate();                     // For redirecting after success

  // ─────────── Form Submit Handler ───────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();                               // Prevent page reload on form submit
    setError('');                                     // Clear previous errors

    // Send POST to your backend register endpoint
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/auth/register`, // Base URL from .env
      {
        method: 'POST',                               // HTTP POST
        headers: { 'Content-Type': 'application/json' }, // Tell server it's JSON
        body: JSON.stringify({ username, password }), // Send username & password
      }
    );

    const data = await res.json();                    // Parse JSON response

    if (res.ok) {                                     // If status code is 2xx
      navigate('/login');                             // Redirect user to the login page
    } else {
      // Otherwise show returned error message or generic text
      setError(data.message || 'Registration failed');
    }
  }

  // ─────────── JSX Markup ───────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2 className="text-2xl mb-4">Register</h2>

      {error && (                                    // Conditionally render error
        <p className="text-red-500 mb-2">{error}</p>
      )}

      <label className="block mb-2">
        Username
        <input
          type="text"
          value={username}                          // Controlled input value
          onChange={e => setUsername(e.target.value)} // Update state on change
          className="w-full border p-2 rounded"
          required                                    // HTML5 required field
        />
      </label>

      <label className="block mb-4">
        Password
        <input
          type="password"
          value={password}                          // Controlled input value
          onChange={e => setPassword(e.target.value)} // Update state on change
          className="w-full border p-2 rounded"
          required                                    // HTML5 required field
        />
      </label>

      <button
        type="submit"                               // Triggers onSubmit
        className="w-full p-2 bg-blue-600 text-white rounded"
      >
        Register
      </button>
    </form>
  );
}
