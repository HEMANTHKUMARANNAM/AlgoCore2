import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import DynamicComponent from './pages/DynamicComponent';

import DynamicExam from './pages/Exam/DynamicExam';
import TestsPage from './pages/Exam/TestsPage';
import TestsList from './pages/Admin/TestsList';
import TestManage from './pages/Admin/TestManage';
import ExamMonitor from './pages/Admin/ExamMonitor';
import ProtectedRoute from './ProtectedRoute';
import CompilerPage from './pages/CompilerPage';

const HomePage = lazy(() => import('./pages/HomePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const CoursePage = lazy(() => import('./pages/CoursePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

function App() {
  return (
    <BrowserRouter basename='/AlgoCore2' >
      {/* Layout Wrapper */}
      <div className="min-h-screen flex flex-col bg-[#F8F9FA] dark:bg-dark-primary transition-colors duration-200">
        
        {/* Navbar (static height, not fixed) */}
        <header className="h-16 w-full">
          <Navbar />
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <Suspense fallback={<div className="p-4">Loading...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/admin" element={  <ProtectedRoute requireAdmin={true}><TestsList /></ProtectedRoute>} />
              <Route path="/testedit/:testId" element={  <ProtectedRoute requireAdmin={true}><TestManage /></ProtectedRoute>} />


              <Route path="/problem/:course/:subcourse/:questionId" element={ <ProtectedRoute requireUser={true}> <DynamicComponent /></ProtectedRoute>} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/compiler" element={<CompilerPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/course/:course" element={<CoursePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<NotFoundPage />} />

              <Route path="/test" element={ <ProtectedRoute requireUser={true}><TestsPage/></ProtectedRoute>} />

              <Route path="/examwindow/:testid" element={ <ProtectedRoute requireUser={true}><DynamicExam/></ProtectedRoute>} />

              <Route path="/exammonitor/:testid" element={  <ProtectedRoute requireAdmin={true}><ExamMonitor/></ProtectedRoute>} />



            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
