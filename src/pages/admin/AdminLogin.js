import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaShieldAlt,
  FaLock,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaKey,
  FaUserPlus,
  FaCheckCircle
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, registerInitialAdmin, resetPassword, lockoutRemaining, authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSetupMode) {
        await registerInitialAdmin(email, password);
      } else {
        await login(email, password);
      }
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!resetEmail) return;

    try {
      await resetPassword(resetEmail);
      setResetStatus('Password reset email sent! Check your inbox.');
    } catch (err) {
      setResetStatus(err.message || 'Failed to send reset email.');
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="login-bg-pattern"></div>

      <motion.div
        className="admin-login-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-header">
          <Link to="/" className="back-to-store-link">
            <FaArrowLeft /> Back to Store
          </Link>

          <div className="shield-icon-badge">
            <FaShieldAlt />
          </div>

          <h2>{isSetupMode ? 'Admin Account Setup' : 'Administrator Portal'}</h2>
          <p className="login-subtitle">
            {isSetupMode
              ? 'Initialize the master administrator account for Spicera'
              : 'Secure authentication for catalog management & orders'}
          </p>
        </div>

        {lockoutRemaining > 0 && (
          <div className="security-alert-box lockout">
            <FaLock />
            <span>
              Security Lockout Active. Please wait <strong>{lockoutRemaining}s</strong> before
              retrying.
            </span>
          </div>
        )}

        {(errorMsg || authError) && (
          <div className="security-alert-box error">
            <span>{errorMsg || authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-field-group">
            <label htmlFor="admin-email">Admin Email</label>
            <div className="input-with-icon">
              <FaEnvelope className="field-icon" />
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                placeholder="admin@spicera.store"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={lockoutRemaining > 0 || isSubmitting}
              />
            </div>
          </div>

          <div className="form-field-group">
            <div className="password-label-row">
              <label htmlFor="admin-password">Password</label>
              {!isSetupMode && (
                <button
                  type="button"
                  className="forgot-password-link"
                  onClick={() => setIsResetModalOpen(true)}
                >
                  Forgot?
                </button>
              )}
            </div>
            <div className="input-with-icon">
              <FaKey className="field-icon" />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={isSetupMode ? 'new-password' : 'current-password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={lockoutRemaining > 0 || isSubmitting}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-submit-btn"
            disabled={lockoutRemaining > 0 || isSubmitting}
          >
            {isSubmitting ? (
              <span className="spinner-inline"></span>
            ) : isSetupMode ? (
              <>
                <FaUserPlus /> Create Master Admin
              </>
            ) : (
              <>
                <FaLock /> Authenticate & Access
              </>
            )}
          </button>
        </form>

        <div className="login-footer-meta">
          <div className="encryption-notice">
            <FaCheckCircle className="safe-icon" />
            <span>Firebase Auth SSL 256 bit Encrypted</span>
          </div>

          <div className="setup-toggle-row">
            {isSetupMode ? (
              <button
                type="button"
                className="setup-toggle-btn"
                onClick={() => {
                  setIsSetupMode(false);
                  setErrorMsg('');
                }}
              >
                Already initialized? Sign In instead
              </button>
            ) : (
              <button
                type="button"
                className="setup-toggle-btn"
                onClick={() => {
                  setIsSetupMode(true);
                  setErrorMsg('');
                }}
              >
                Need first-time admin setup? Click here
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      {isResetModalOpen && (
        <div className="reset-modal-backdrop" onClick={() => setIsResetModalOpen(false)}>
          <div className="reset-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Reset Admin Password</h3>
            <p>Enter your administrator email to receive a password reset link from Firebase.</p>

            {resetStatus && (
              <div className="reset-status-box">{resetStatus}</div>
            )}

            <form onSubmit={handleResetSubmit}>
              <div className="input-with-icon">
                <FaEnvelope className="field-icon" />
                <input
                  type="email"
                  placeholder="admin@spicera.store"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>

              <div className="reset-modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsResetModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="confirm-btn">
                  Send Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;
