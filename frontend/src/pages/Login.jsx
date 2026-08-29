import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, clearError, setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const result = await login(email, password);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  // Google Sign-In
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-btn'),
          { theme: 'outline', size: 'large', width: '100%', text: 'signin_with' }
        );
      }
    };
    return () => { document.body.removeChild(script); };
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const res = await api.post('/api/auth/google', { idToken: response.credential });
      if (res.data.success) {
        const { accessToken, refreshToken, user } = res.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setAuth(user, accessToken);
        toast.success(`Welcome, ${user.name}!`);
        navigate('/');
      }
    } catch (err) {
      toast.error('Google sign-in failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Link to="/" className="auth-logo">
          <span className="logo-text">amazon</span>
          <span className="logo-suffix">.clone</span>
        </Link>

        <div className="auth-card">
          <h1 className="auth-title">Sign In</h1>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email or mobile phone number</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                autoFocus
              />
            </div>

            <div className="input-group">
              <label>
                Password
                <Link to="/forgot-password" className="auth-forgot">Forgot password?</Link>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                minLength={8}
              />
            </div>

            {error && <p className="error-text" style={{ marginBottom: 12 }}>{error}</p>}

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-divider"><span>Or sign in with</span></div>

          <div id="google-signin-btn" style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}></div>

          <p className="auth-legal">
            By continuing, you agree to Amazon Clone's <a href="#">Conditions of Use</a> and <a href="#">Privacy Notice</a>.
          </p>

          <div className="auth-divider">
            <span>New to Amazon Clone?</span>
          </div>

          <Link to="/register" className="btn btn-secondary btn-full">
            Create your Amazon Clone account
          </Link>
        </div>
      </div>
    </div>
  );
}

