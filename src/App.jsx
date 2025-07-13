import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import DynamicComponent from './pages/DynamicComponent';
import Exam2 from './pages/Exam/Exam2';
import FullscreenTracker from './pages/FullscreenTracker';
import DynamicExam from './pages/Exam/DynamicExam';
import TestsPage from './pages/Exam/TestsPage';
import TestsList from './pages/Admin/TestsList';
import TestManage from './pages/Admin/TestManage';

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
    <BrowserRouter>
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
              <Route path="/admin" element={<TestsList />} />
              <Route path="/testedit/:testId" element={<TestManage />} />


              <Route path="/problem/:course/:subcourse/:questionId" element={<DynamicComponent />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:course" element={<CoursePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<NotFoundPage />} />


               <Route path="/examhem" element={<Exam2 />} />
              <Route path="/full" element={<FullscreenTracker />} />
              <Route path="/dynamicexam" element={<DynamicExam/>} />
              <Route path="/test" element={<TestsPage/>} />

              <Route path="/examwindow/:testid" element={<DynamicExam/>} />



            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
