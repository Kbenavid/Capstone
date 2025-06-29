// src/components/RegisterForm.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate                = useNavigate();
  const API_BASE                = process.env.REACT_APP_API_BASE_URL;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(
        `${API_BASE}/api/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',           // allow cookie if you ever set one on register
          body: JSON.stringify({ username, password }),
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(()=>({}));
        throw new Error(body.message || `Register failed (${res.status})`);
      }

      // On success, go to login
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Register error:', err);
      setError(err.message);
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 mt-8">
      <h2 className="text-2xl mb-4 text-center">Register for PipeTrack</h2>
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium">Username</span>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded p-2"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Password</span>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded p-2"
            required
          />
        </label>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Register
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Log in here
        </Link>.
      </p>
    </div>
  );
}
