import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BrainCircuit, Sun, Moon, LogOut, User, Settings2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import useChatStore from '../store/chatStore';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isSettingsOpen, setSettingsOpen } = useChatStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border-color backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary/20 rounded-lg text-primary group-hover:scale-110 transition-transform">
              <BrainCircuit size={24} />
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              InsightAI
            </span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Home</Link>
            <Link to="/technology" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Technology</Link>
            <Link to="/docs" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Documentation</Link>
            <Link to="/contact" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Contact</Link>

            {user && (
              <Link to="/chat" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Chat Interface</Link>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-card/40 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 text-sm text-text-secondary">
                  <User size={16} />
                  <span>{user.name}</span>
                </div>
                {location.pathname === '/chat' && (
                  <button 
                    onClick={() => setSettingsOpen(!isSettingsOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-border-color"
                  >
                    <Settings2 size={16} />
                    <span className="hidden sm:inline">Parameters</span>
                  </button>
                )}
                <Link 
                  to="/settings"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-border-color"
                >
                  <Settings2 size={16} />
                  <span className="hidden sm:inline">Settings</span>
                </Link>

                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-text-primary hover:bg-card/40 rounded-lg transition-colors">
                  Log in
                </Link>
                <Link to="/signup" className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors shadow-lg shadow-primary/20">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
