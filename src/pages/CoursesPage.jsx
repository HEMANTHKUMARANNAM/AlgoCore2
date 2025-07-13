import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPython, FaJava, FaJs, FaCuttlefish } from "react-icons/fa";
import { SiCplusplus ,SiC } from "react-icons/si"; // for C++
import { ref, get, child } from 'firebase/database';
import { database } from '../firebase';

const iconMap = {
  python: <FaPython className="w-12 h-12 text-[#3776AB]" />,
  java: <FaJava className="w-12 h-12 text-[#007396]" />,
  javascript: <FaJs className="w-12 h-12 text-[#F7DF1E]" />,
  c: <SiC className="w-12 h-12 text-[#555555]" />, // closest match for C
  cpp: <SiCplusplus className="w-12 h-12 text-[#00599C]" />,
};


const CourseCard = ({ course }) => (
  <div
    className={`
      p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 
      border ${course.borderColor} ${course.bgColor}
      flex flex-col items-center text-center h-full
      dark:bg-gray-800 dark:border-gray-700 dark:hover:shadow-xl dark:hover:shadow-gray-900/20
      hover:-translate-y-1
    `}
  >
    <div className="mb-4">{iconMap[course.id]}</div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{course.title}</h3>
    <p className="text-gray-600 dark:text-gray-300 flex-grow">{course.description}</p>
    <Link
      to={`${course.id}`}
      className={`mt-6 px-6 py-2 rounded-lg font-semibold transition-colors 
        ${course.id === 'python'
          ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
          : 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600'
        } text-white`}
    >
      Start Learning
    </Link>
  </div>
);

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {

        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, `Courses`));

        if (snapshot.exists()) {
          const data = snapshot.val();
          setCourses(data);

        }
        else {
          throw new Error('Failed to fetch course data');

        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl mb-4">
            Programming Courses
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose a language and start your coding journey with us.
          </p>
        </div>

        {loading ? (
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">Loading courses...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-500 dark:text-red-400">Error: {error}</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">No courses available at the moment.</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {courses.map((course) => (
              <div key={course.id} className="w-full sm:w-[400px]">
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
