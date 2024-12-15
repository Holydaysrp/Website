import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Dashboard from './Dashboard';
import HistoricalData from './HistoricalData';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [action, setAction] = useState('login');
  const [loading, setLoading] = useState(false); // Add a loading state
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Indicate loading state

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
      setLoading(false); // End loading state
    }
  };

  // Handle Registration
  const handleRegister = async () => {
    try {
      const response = await registerUser(email);
      alert(`Registration successful! Your password: ${response.password}`);
      alert(
        'A confirmation email has been sent to your inbox. Please check your email and confirm your account to log in. ' +
        'If you do not see the email, please check your spam folder.'
      );
    } catch (error) {
      throw new Error('Registration failed. Please try again.');
    }
  };

  // Handle Login
  const handleLogin = async () => {
    try {
      const response = await loginUser(email, password);
      if (response.message === 'Login successful') {
        alert('Login successful! Redirecting to your dashboard.');
        navigate('/Dashboard');
      } else {
        throw new Error('Invalid email or password.');
      }
    } catch (error) {
      throw new Error('Login failed. Please check your credentials and try again.');
    }
  };

  // Register user via Worker endpoint
  async function registerUser(email) {
    const response = await fetch('https://viaches-user-auth.viaslavdem.workers.dev/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    return data;
  }

  // Login user via Worker endpoint
  async function loginUser(email, password) {
    const response = await fetch('https://viaches-user-auth.viaslavdem.workers.dev/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    return data;
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="content-container">
          <h1>Customer AS</h1>
          <div className="button-container">
            <button
              onClick={() => setAction('login')}
              style={{ fontWeight: action === 'login' ? 'bold' : 'normal' }}
            >
              Login
            </button>
            <button
              onClick={() => setAction('register')}
              style={{ fontWeight: action === 'register' ? 'bold' : 'normal' }}
            >
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
              {loading
                ? 'Processing...'
                : action === 'login'
                ? 'Login'
                : 'Register'}
            </button>
          </form>
        </div>
      </header>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/HistoricalData" element={<HistoricalData />} />
      </Routes>
    </Router>
  );
}

export default App;
