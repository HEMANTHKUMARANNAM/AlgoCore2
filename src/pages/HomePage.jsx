import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

function HomePage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Show loading spinner while auth state is loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
      title: 'System Design',
      description: 'Learn to design scalable and efficient systems with real-world case studies.',
      path: '/system-design'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      title: 'Database Systems',
      description: 'Understand database design, query optimization, and transaction management.',
      path: '/databases'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Concurrency',
      description: 'Master multi-threading, parallel computing, and synchronization techniques.',
      path: '/concurrency'
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
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-[40vh] bg-gradient-to-br from-blue-600/10 to-purple-600/10 dark:from-blue-900/30 dark:to-purple-900/30 rounded-b-[60%] z-0" />
        <div className="absolute top-[20vh] right-0 w-64 h-64 bg-gradient-to-r from-yellow-400/20 to-red-500/20 dark:from-yellow-600/20 dark:to-red-600/20 rounded-full blur-3xl z-0" />

        {/* Hero Section */}
        <section className="relative z-10 flex items-center justify-center min-h-[60vh] py-16 px-4 sm:px-6 lg:px-8">
          <div className="w-full flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome{user ? `, ${user.name}` : ''} to AlgoCore
            </h1>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#4285F4] mb-4">
              Bored of Theory? Let's Code for Real
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Kickstart Your Coding Journey — No Boring Lectures, Just Real Practice!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/algorithms')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-full hover:from-blue-700 hover:to-purple-700 transition duration-300 shadow-lg"
              >
                Start Learning
              </button>
              <button
                onClick={() => navigate(user ? '/profile' : '/login')}
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold py-3 px-8 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300 shadow-lg"
              >
                {user ? 'View Profile' : 'Sign In'}
              </button>
            </div>
          </div>
        </section>

        {/* Subjects Section */}
        {/* <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Explore Our Learning Paths
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {subjects.map((subject, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-white/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="text-blue-600 dark:text-blue-400 mb-4">
                    {subject.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{subject.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{subject.description}</p>
                  <Link
                    to={subject.path}
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  >
                    Explore Path
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Languages Section */}
        <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Learn in Your Favorite Language
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              {languages.map((language, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 w-32 h-32 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <span className="text-3xl mb-2">{language.icon}</span>
                  <span className="text-lg font-medium text-gray-900 dark:text-white">{language.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Master Algorithms?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Join thousands of developers who've transformed their coding skills with AlgoCore.
            </p>
            <button
              onClick={() => navigate(user ? '/courses' : '/signup')}
              className="bg-white text-blue-600 font-bold py-4 px-12 rounded-full hover:bg-blue-50 transition duration-300 shadow-lg text-lg"
            >
              {user ? 'Continue Learning' : 'Get Started for Free'}
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;