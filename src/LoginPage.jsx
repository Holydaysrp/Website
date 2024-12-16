import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [action, setAction] = useState('login');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if the user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/Dashboard'); // Redirect to Dashboard if logged in
    }
  }, [navigate]);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (action === 'register') {
        await handleRegister();
      } else {
        await handleLogin();
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Register User
  const handleRegister = async () => {
    const response = await fetch('https://email-service.viaslavdem.workers.dev/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Registration failed');

    alert(`Registration successful! Your password: ${data.password}`);
    alert('Please confirm your email. Check your spam folder if needed.');
  };

  // Login User
  const handleLogin = async () => {
    const response = await fetch('https://email-service.viaslavdem.workers.dev/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login failed');

    localStorage.setItem('authToken', data.token); // Save token to localStorage
    alert('Login successful! Redirecting to your dashboard.');
    navigate('/Dashboard');
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="content-container">
          <h1>Customer AS</h1>
          <div className="button-container">
            <button onClick={() => setAction('login')} style={{ fontWeight: action === 'login' ? 'bold' : 'normal' }}>
              Login
            </button>
            <button onClick={() => setAction('register')} style={{ fontWeight: action === 'register' ? 'bold' : 'normal' }}>
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            {action === 'login' && (
              <div>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            )}

            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : action === 'login' ? 'Login' : 'Register'}
            </button>
          </form>
        </div>
      </header>
    </div>
  );
}

export default LoginPage;
