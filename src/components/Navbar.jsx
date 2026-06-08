import { Link, useNavigate } from 'react-router-dom';
import { CheckSquare, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <Link to="/dashboard" className="navbar-brand">
          <div className="navbar-logo-box">
            <CheckSquare size={17} strokeWidth={2.5} />
          </div>
          <span className="navbar-brand-name">
            Task<span>Flow</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="navbar-right">
          <div className="navbar-avatar" aria-hidden="true">{initials}</div>
          <span className="navbar-username">{user?.name}</span>
          <button
            id="logout-btn"
            className="btn btn-secondary btn-sm"
            onClick={handleLogout}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
