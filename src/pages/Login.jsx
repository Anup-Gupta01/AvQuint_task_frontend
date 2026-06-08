import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckSquare, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]         = useState({ email: '', password: '' });
  const [errors, setErrors]     = useState({});
  const [showPw, setShowPw]     = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim())                        e.email    = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email))  e.email    = 'Enter a valid email';
    if (!form.password)                            e.password = 'Password is required';
    return e;
  };

  const handleChange = ({ target: { name, value } }) => {
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const result = await login(form);
    if (result.success) navigate('/dashboard');
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo-row">
          <div className="auth-logo-box">
            <CheckSquare size={19} strokeWidth={2.5} />
          </div>
          <span className="auth-logo-name">Task<span>Flow</span></span>
        </div>

        <h1 className="auth-heading">Welcome back</h1>
        <p className="auth-sub">Sign in to your account to continue</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email address</label>
            <div className="input-wrap">
              <span className="input-icon-left"><Mail size={15} /></span>
              <input
                id="login-email"
                name="email"
                type="email"
                className={`form-input pl${errors.email ? ' has-error' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div className="input-wrap">
              <span className="input-icon-left"><Lock size={15} /></span>
              <input
                id="login-password"
                name="password"
                type={showPw ? 'text' : 'password'}
                className={`form-input pl pr${errors.password ? ' has-error' : ''}`}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-icon-right"
                onClick={() => setShowPw((v) => !v)}
                tabIndex={-1}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="btn btn-primary btn-lg btn-full"
            disabled={loading}
            style={{ marginTop: '4px' }}
          >
            {loading ? <span className="spinner" /> : 'Sign in'}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="auth-link">Create one free</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
