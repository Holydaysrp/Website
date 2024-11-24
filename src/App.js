import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Dashboard from './Dashboard';
import HistoricalData from './HistoricalData';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [action, setAction] = useState('login');
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (action === 'register') {
      try {
        const response = await registerUser(email);
        alert(`Registration successful! Your password: ${response.password}`);
      } catch (error) {
        alert('Registration failed. Please try again.');
        console.error(error);
      }
    } else if (action === 'login') {
      try {
        const response = await loginUser(email, password);
        if (response.message === 'Login successful') {
          alert('Login successful!');
          navigate('/Dashboard'); // Navigate to Dashboard on successful login
        } else {
          alert('Invalid email or password.');
        }
      } catch (error) {
        alert('Login failed. Please try again.');
        console.error(error);
      }
    }
  };

  // Function to register a user
  async function registerUser(email) {
    const response = await fetch(
      'https://viaches-user-auth.viaslavdem.workers.dev/register',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || 'Registration failed');
    }
  }

  // Function to login a user
  async function loginUser(email, password) {
    const response = await fetch(
      'https://viaches-user-auth.viaslavdem.workers.dev/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || 'Login failed');
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="content-container">
          <h1>Customer AS</h1>
          <div className="button-container">
            <button onClick={() => setAction('login')}>Login</button>
            <button onClick={() => setAction('register')}>Register</button>
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
  
            <button type="submit">{action === 'login' ? 'Login' : 'Register'}</button>
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
