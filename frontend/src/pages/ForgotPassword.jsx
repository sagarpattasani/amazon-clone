import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import './Auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { forgotPassword, loading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await forgotPassword(email);
    if (result.success) {
      setSent(true);
      toast.success('Password reset email sent!');
    } else {
      toast.error(result.message);
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
          <h1 className="auth-title">Password Assistance</h1>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p style={{ fontSize: 48, marginBottom: 16 }}>📧</p>
              <p>We've sent a password reset link to <strong>{email}</strong></p>
              <p style={{ color: '#555', fontSize: 13, marginTop: 8 }}>Please check your inbox and spam folder.</p>
              <Link to="/login" className="btn btn-primary btn-full" style={{ marginTop: 20 }}>Back to Sign In</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p className="auth-subtitle">Enter the email address associated with your account.</p>
              <div className="input-group">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" required autoFocus />
              </div>
              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                {loading ? 'Sending...' : 'Continue'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
