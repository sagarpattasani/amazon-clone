import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import './Auth.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const { register, verifyEmail, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    clearError();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    const result = await register(name, email, phone || null, password);
    if (result.success) {
      toast.success('Registration successful! Check your email for OTP.');
      setShowOtp(true);
    } else {
      toast.error(result.message);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const result = await verifyEmail(email, otp);
    if (result.success) {
      toast.success('Email verified! Welcome to Amazon Clone!');
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  if (showOtp) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <Link to="/" className="auth-logo">
            <span className="logo-text">amazon</span>
            <span className="logo-suffix">.clone</span>
          </Link>
          <div className="auth-card">
            <h1 className="auth-title">Verify Email</h1>
            <p className="auth-subtitle">Enter the OTP sent to <strong>{email}</strong></p>
            <form onSubmit={handleVerify}>
              <div className="input-group">
                <label>Enter OTP</label>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit OTP" maxLength={6} required autoFocus
                  style={{ fontSize: 24, letterSpacing: 8, textAlign: 'center' }} />
              </div>
              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Link to="/" className="auth-logo">
          <span className="logo-text">amazon</span>
          <span className="logo-suffix">.clone</span>
        </Link>
        <div className="auth-card">
          <h1 className="auth-title">Create Account</h1>
          <form onSubmit={handleRegister}>
            <div className="input-group">
              <label>Your name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="First and last name" required />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email" required />
            </div>
            <div className="input-group">
              <label>Mobile number (optional)</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="+91XXXXXXXXXX" />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters" required minLength={8} />
              <span style={{ fontSize: 12, color: '#555' }}>Passwords must be at least 8 characters with 1 uppercase, 1 number, 1 special character</span>
            </div>
            <div className="input-group">
              <label>Re-enter password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password" required />
            </div>
            {error && <p className="error-text" style={{ marginBottom: 12 }}>{error}</p>}
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? 'Creating account...' : 'Create your Amazon Clone account'}
            </button>
          </form>
          <p className="auth-legal">
            By creating an account, you agree to Amazon Clone's <a href="#">Conditions of Use</a> and <a href="#">Privacy Notice</a>.
          </p>
          <div className="auth-divider"><span>Already have an account?</span></div>
          <Link to="/login" className="btn btn-secondary btn-full">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
