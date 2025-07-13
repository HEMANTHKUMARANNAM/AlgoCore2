import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  
  // Create ref for the auth dropdown
  const authDropdownRef = useRef(null);
  const authButtonRef = useRef(null);

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Courses', href: '/courses' },
    { label: 'Tests', href: '/test' },
    { label: 'Admin', href: '/admin' },
    { label: 'Compiler', href: '/compiler' },

  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isAuthOpen && 
          authDropdownRef.current && 
          !authDropdownRef.current.contains(event.target) &&
          authButtonRef.current &&
          !authButtonRef.current.contains(event.target)) {
        setIsAuthOpen(false);
      }
      
      if (isMenuOpen && !event.target.closest('.mobile-menu-button')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAuthOpen, isMenuOpen]);

  // Close both dropdowns when location changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsAuthOpen(false);
  }, [location]);

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-dark-secondary border-b border-gray-200 dark:border-dark-tertiary z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-bold text-[#202124] dark:text-white">AlgoCore</h1>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === item.href 
                    ? 'text-[#4285F4]' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-[#4285F4] dark:hover:text-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-tertiary rounded-full transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          <div className="relative">
            <button 
              ref={authButtonRef}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-tertiary rounded-full"
              onClick={() => {
                setIsAuthOpen(!isAuthOpen);
                setIsMenuOpen(false);
              }}
              aria-label="Toggle authentication menu"
            >
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>

            {isAuthOpen && (
              <div 
                ref={authDropdownRef}
                className="absolute top-12 right-0 w-60 bg-white dark:bg-dark-secondary rounded-lg shadow-lg border border-gray-200 dark:border-dark-tertiary py-2 animate-fadeIn"
              >
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-dark-tertiary">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-tertiary"
                      onClick={() => setIsAuthOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => { logout(); setIsAuthOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-tertiary"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-tertiary"
                      onClick={() => setIsAuthOpen(false)}
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          
          <button 
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-dark-tertiary rounded-full relative mobile-menu-button"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setIsAuthOpen(false);
            }}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {isMenuOpen && (
            <div className="absolute top-16 right-4 w-64 bg-white dark:bg-dark-secondary rounded-lg shadow-lg border border-gray-200 dark:border-dark-tertiary py-2 animate-fadeIn">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-[#4285F4]/10 hover:text-[#4285F4] transition-colors ${
                    location.pathname === item.href 
                      ? 'bg-[#4285F4]/10 text-[#4285F4]' 
                      : 'text-gray-700 dark:text-gray-200'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
