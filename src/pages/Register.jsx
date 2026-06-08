import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckSquare, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]           = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors]       = useState({});
  const [showPw, setShowPw]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())               e.name    = 'Name is required';
    else if (form.name.trim().length < 2) e.name   = 'Name must be at least 2 characters';
    if (!form.email.trim())              e.email    = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password)                  e.password = 'Password is required';
    else if (form.password.length < 6)   e.password = 'At least 6 characters required';
    if (!form.confirmPassword)           e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
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
    const result = await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
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

        <h1 className="auth-heading">Create your account</h1>
        <p className="auth-sub">Start managing your tasks in seconds</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Full name</label>
            <div className="input-wrap">
              <span className="input-icon-left"><User size={15} /></span>
              <input
                id="reg-name"
                name="name"
                type="text"
                className={`form-input pl${errors.name ? ' has-error' : ''}`}
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email address</label>
            <div className="input-wrap">
              <span className="input-icon-left"><Mail size={15} /></span>
              <input
                id="reg-email"
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
            <label className="form-label" htmlFor="reg-password">Password</label>
            <div className="input-wrap">
              <span className="input-icon-left"><Lock size={15} /></span>
              <input
                id="reg-password"
                name="password"
                type={showPw ? 'text' : 'password'}
                className={`form-input pl pr${errors.password ? ' has-error' : ''}`}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button type="button" className="input-icon-right" onClick={() => setShowPw(v => !v)} tabIndex={-1}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirm">Confirm password</label>
            <div className="input-wrap">
              <span className="input-icon-left"><Lock size={15} /></span>
              <input
                id="reg-confirm"
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                className={`form-input pl pr${errors.confirmPassword ? ' has-error' : ''}`}
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button type="button" className="input-icon-right" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}>
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
          </div>

          <button
            id="register-submit-btn"
            type="submit"
            className="btn btn-primary btn-lg btn-full"
            disabled={loading}
            style={{ marginTop: '4px' }}
          >
            {loading ? <span className="spinner" /> : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
