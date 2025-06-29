import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton({ onLogout }) {
  const navigate = useNavigate();

  async function handleClick() {
    // 1) tell the backend to clear the cookie
    await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/auth/logout`,
      { method: 'POST', credentials: 'include' }
    );
    // 2) clear React login state
    onLogout();
    // 3) send user back to login page
    navigate('/login');
  }

  return (
    <button
      onClick={handleClick}
      className="ml-auto px-3 py-1 bg-red-500 text-white rounded"
    >
      Logout
    </button>
  );
}
