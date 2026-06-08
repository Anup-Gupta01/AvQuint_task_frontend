import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckSquare, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';

    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address';

    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';

    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const result = await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
    if (result.success) navigate('/dashboard');
  };

  const inputWithIcon = (icon, name, type, placeholder, showToggle, toggleState, onToggle, autoComplete) => (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
        {icon}
      </span>
      <input
        id={`register-${name}`}
        name={name}
        type={showToggle ? (toggleState ? 'text' : 'password') : type}
        className={`form-input ${errors[name] ? 'error' : ''}`}
        placeholder={placeholder}
        value={form[name]}
        onChange={handleChange}
        style={{ paddingLeft: '36px', paddingRight: showToggle ? '40px' : '14px' }}
        autoComplete={autoComplete}
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          tabIndex={-1}
          aria-label={toggleState ? 'Hide password' : 'Show password'}
        >
          {toggleState ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      )}
    </div>
  );

  return (
    <main className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <CheckSquare size={20} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '18px', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            TaskFlow
          </span>
        </div>

        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Start managing your tasks for free</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-name">Full Name</label>
            {inputWithIcon(<User size={15} />, 'name', 'text', 'John Doe', false, false, null, 'name')}
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-email">Email address</label>
            {inputWithIcon(<Mail size={15} />, 'email', 'email', 'you@example.com', false, false, null, 'email')}
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-password">Password</label>
            {inputWithIcon(<Lock size={15} />, 'password', 'password', 'Min. 6 characters', true, showPassword, () => setShowPassword((v) => !v), 'new-password')}
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-confirmPassword">Confirm Password</label>
            {inputWithIcon(<Lock size={15} />, 'confirmPassword', 'password', 'Repeat your password', true, showConfirm, () => setShowConfirm((v) => !v), 'new-password')}
            {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
          </div>

          <button
            id="register-submit-btn"
            type="submit"
            className="btn btn-primary btn-lg btn-full"
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : 'Create Account'}
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
