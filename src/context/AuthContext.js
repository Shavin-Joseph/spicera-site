import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Secure login with client-side brute-force defense
  const login = async (email, password) => {
    setAuthError('');

    // Check if locked out
    if (lockoutTime && Date.now() < lockoutTime) {
      const remainingSeconds = Math.ceil((lockoutTime - Date.now()) / 1000);
      throw new Error(`Security Lockout: Too many failed attempts. Please wait ${remainingSeconds} seconds.`);
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setFailedAttempts(0);
      setLockoutTime(null);
      return userCredential.user;
    } catch (error) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= 5) {
        // 60-second cooldown after 5 failed attempts
        setLockoutTime(Date.now() + 60000);
        throw new Error('Security Notice: 5 consecutive failed attempts. Admin panel is locked for 60 seconds.');
      }

      let friendlyMessage = 'Authentication failed. Please verify your admin credentials.';
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        friendlyMessage = 'Invalid admin email or password.';
      } else if (error.code === 'auth/too-many-requests') {
        friendlyMessage = 'Access temporarily restricted due to many failed attempts. Try again later.';
      } else if (error.code === 'auth/network-request-failed') {
        friendlyMessage = 'Network error. Please check your internet connection.';
      }

      setAuthError(friendlyMessage);
      throw new Error(friendlyMessage);
    }
  };

  // Secure sign out
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // First-time admin creation (useful when initializing a new project)
  const registerInitialAdmin = async (email, password) => {
    setAuthError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      let message = error.message;
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already registered. Please sign in instead.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
      }
      setAuthError(message);
      throw new Error(message);
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    setAuthError('');
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      let message = 'Failed to send password reset email.';
      if (error.code === 'auth/user-not-found') {
        message = 'No administrator account found with this email.';
      }
      setAuthError(message);
      throw new Error(message);
    }
  };

  const value = {
    currentUser,
    loading,
    authError,
    failedAttempts,
    lockoutRemaining: lockoutTime ? Math.max(0, Math.ceil((lockoutTime - Date.now()) / 1000)) : 0,
    login,
    logout,
    registerInitialAdmin,
    resetPassword,
    isAuthenticated: Boolean(currentUser)
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
