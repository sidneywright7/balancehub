import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!username || username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    if (password.length < 8 || !/\d/.test(password)) newErrors.password = 'Password must be at least 8 characters and contain a number';
    if (password !== repeatPassword) newErrors.repeatPassword = 'The two passwords do not match';
    if (!agreed) newErrors.agreed = 'You must agree to the Terms and Conditions';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        password
      });
      login(res.data.token, res.data.username);
      navigate('/dashboard');
    } catch (err) {
      setErrors({ username: err.response?.data?.message || 'Registration failed' });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="app-title">⚖️ BalanceHub</h1>
        <h2>Register User</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && <p className="error-message">{errors.username}</p>}
          </div>
          <div className="form-row">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>
          <div className="form-row">
            <input
              type="password"
              placeholder="Repeat Password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
            />
            {errors.repeatPassword && <p className="error-message">{errors.repeatPassword}</p>}
          </div>
          <div className="form-row checkbox-row">
            <label style={{ color: errors.agreed ? 'red' : 'inherit' }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              I agree to the Terms and Conditions and Privacy Policy
            </label>
          </div>
          <button type="submit">Register</button>
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;