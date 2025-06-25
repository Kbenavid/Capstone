import React, { useState }            from 'react';
import { useNavigate }                from 'react-router-dom';

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');   // controlled username
  const [password, setPassword] = useState('');   // controlled password
  const [error,    setError]    = useState('');   // any error message
  const navigate = useNavigate();                 // for redirecting

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',                  // include your httpOnly cookie
        body: JSON.stringify({ username, password }),
      }
    );
    const data = await res.json();

    if (res.ok) {
      onLogin();        // ← inform App.js we’re now logged in
      navigate('/');    // ← send them on to the protected home
    } else {
      setError(data.message || 'Login failed');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2 className="text-2xl mb-4">Login</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <label className="block mb-2">
        Username
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </label>

      <label className="block mb-4">
        Password
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </label>

      <button
        type="submit"
        className="w-full p-2 bg-green-600 text-white rounded"
      >
        Login
      </button>
    </form>
  );
}
