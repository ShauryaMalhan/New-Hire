import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader, ArrowRight, ShieldCheck, Hexagon } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import styles from '../stylesheets/Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.endsWith('@cisco.com')) {
      setError('Access restricted to official @cisco.com accounts only.');
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
      // Context handles redirection
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.logoBadge}>
            <Hexagon size={28} strokeWidth={2.5} />
          </div>
          <h1 className={styles.title}>NexBoard</h1>
          <p className={styles.subtitle}>Onboarding Platform</p>
        </div>

        {/* Separator */}
        <div className={styles.separator}>
            <span>Sign in to your account</span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className={styles.errorAlert}>
            <ShieldCheck size={18} className={styles.errorIcon} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          
          {/* Email Field */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">Email Address</label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} size={20} />
              <input
                id="email"
                type="email"
                required
                className={styles.input}
                placeholder="username@cisco.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">Password</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} size={20} />
              <input
                id="password"
                type="password"
                required
                className={styles.input}
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={styles.button}
          >
            {loading ? (
              <Loader className={styles.spinner} size={20} />
            ) : (
              <>Sign In <ArrowRight size={20} /></>
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <p>© 2025 Cisco Systems, Inc. All rights reserved.</p>
          <p>Internal System • Authorized Access Only</p>
        </div>
      </div>
    </div>
  );
};

export default Login;