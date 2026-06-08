import { Link, useNavigate } from 'react-router-dom';
import { CheckSquare, LogOut, User } from 'lucide-react';
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
          <div className="navbar-brand-icon">
            <CheckSquare size={18} color="#fff" />
          </div>
          <span className="navbar-brand-text">TaskFlow</span>
        </Link>

        {/* User info + Logout */}
        <div className="navbar-user">
          <div className="navbar-avatar">{initials}</div>
          <span style={{ display: 'none' }} className="user-name-desktop">
            {user?.name}
          </span>
          <button
            id="logout-btn"
            className="btn btn-ghost btn-sm"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
