/**
 * Navbar.jsx — Main navigation bar with auth state awareness
 */
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield, LogOut, User, LayoutDashboard, Upload, BookOpen, Stethoscope, Home } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    ...(isAuthenticated ? [
      { to: '/upload', label: 'Scan', icon: Upload },
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ] : []),
    { to: '/education', label: 'Learn', icon: BookOpen },
    { to: '/doctors', label: 'Doctors', icon: Stethoscope },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin', icon: Shield }] : []),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-900/95 backdrop-blur-xl border-b border-white/10">
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">
              Onco<span className="text-primary-400">Cutis</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(to)
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'text-surface-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* Auth buttons (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
                  <User className="w-4 h-4 text-primary-400" />
                  <span className="text-sm text-surface-200 font-medium">{user?.name}</span>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-2 text-white hover:text-red-400 transition-colors text-sm">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-surface-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-400 hover:to-primary-500 transition-all shadow-lg shadow-primary-500/25">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-surface-300 hover:text-white transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface-900/98 backdrop-blur-xl border-t border-white/5"
          >
            <div className="section-container py-4 space-y-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(to)
                      ? 'bg-primary-500/20 text-primary-400'
                      : 'text-surface-300 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              ))}
              <div className="border-t border-white/10 pt-3 mt-3">
                {isAuthenticated ? (
                  <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 text-sm font-medium w-full">
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-center text-sm font-medium text-surface-300 hover:text-white">Login</Link>
                    <Link to="/signup" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-center text-sm font-semibold bg-primary-600 text-white rounded-lg">Sign Up</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
