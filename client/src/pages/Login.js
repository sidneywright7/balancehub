// Login page for BalanceHub
// Allows existing users to log in with their username and password
// On success, saves the JWT token and redirects to the dashboard

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {
  // State for form fields and error message
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request to the API
      const res = await axios.post('https://balancehub-server.onrender.com/api/auth/login', {
        username,
        password
      });
      // Save token and username to context and localStorage
      login(res.data.token, res.data.username);
      // Redirect to dashboard on success
      navigate('/dashboard');
    } catch (err) {
      // Show error message if login fails
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="app-title">BalanceHub</h1>
        <h2>Welcome Back</h2>
        {/* Show error message if login fails */}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(''); }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;