import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Bot, Mail, Lock, User, ArrowRight, LogIn } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = await register(name, email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '48px', height: '48px', 
            background: 'var(--ink)', 
            borderRadius: '14px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Bot size={24} color="var(--parchment)" />
          </div>
          <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: '28px', color: 'var(--ink)', margin: '0 0 8px' }}>
            Get Started
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--ink-4)', fontFamily: 'var(--ff-body)' }}>
            Create an account to access PulseAI
          </p>
        </div>

        {error && (
          <div style={{ 
            padding: '12px', background: 'var(--rust-dim)', 
            color: 'var(--rust)', borderRadius: 'var(--r-md)', 
            fontSize: '13px', marginBottom: '20px', textAlign: 'center',
            border: '1px solid rgba(176,92,58,0.2)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label>Full Name</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="form-input"
                placeholder="Alex Rivera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                className="form-input"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="primary-btn" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create Account'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '13px', color: 'var(--ink-4)' }}>
          Already have an account? {' '}
          <Link to="/login" style={{ color: 'var(--sage)', fontWeight: '600', textDecoration: 'none' }}>
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
