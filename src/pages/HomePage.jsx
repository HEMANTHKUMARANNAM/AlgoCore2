import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

function HomePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const subjects = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'Algorithms & Data Structures',
      description: 'Master fundamental algorithms and data structures through interactive coding challenges.',
      path: '/algorithms'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
      title: 'Database & SQL',
      description: 'Learn database design, optimization, and SQL through practical exercises.',
      path: '/database'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      title: 'Web Development',
      description: 'Build and deploy web applications with modern frameworks and best practices.',
      path: '/web-dev'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Security & Cryptography',
      description: 'Explore security concepts and cryptographic algorithms through hands-on coding.',
      path: '/security'
    }
  ];

  const languages = [
    { name: 'JavaScript', icon: '⚡' },
    { name: 'Python', icon: '🐍' },
    { name: 'Java', icon: '☕' },
    { name: 'C++', icon: '⚙️' },
    { name: 'SQL', icon: '🗄️' },
    { name: 'TypeScript', icon: '📘' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 relative overflow-x-hidden flex flex-col">
      <main className="flex-grow">
        {/* Grid background */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <div className="w-full h-full bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
        </div>
        {/* Hero Section */}
        <section className="relative z-10 flex items-center justify-center min-h-[60vh] py-16 px-4 sm:px-6 lg:px-8">
          <div className="w-full flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">Master Programming with AlgoCore</h1>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#4285F4] mb-4">Bored of Theory? Let's Code for Real</h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Kickstart Your Coding Journey — No Boring Lectures, Just Real Practice!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate('/profile')}
                    className="w-full sm:w-auto bg-[#4285F4] text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#357ae8] transition-colors shadow-sm hover:shadow-md text-lg"
                  >
                    View Profile
                  </button>
                  <Link
                    to="/courses"
                    className="w-full sm:w-auto bg-white dark:bg-gray-800 text-[#4285F4] border border-[#4285F4] px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#4285F4]/10 transition-colors shadow-sm hover:shadow-md text-lg"
                  >
                    Explore Courses
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full sm:w-auto bg-[#4285F4] text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#357ae8] transition-colors shadow-sm hover:shadow-md text-lg"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in
                  </button>
                  <Link
                    to="/courses"
                    className="w-full sm:w-auto bg-white dark:bg-gray-800 text-[#4285F4] border border-[#4285F4] px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#4285F4]/10 transition-colors shadow-sm hover:shadow-md text-lg"
                  >
                    Explore Courses
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50" />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;