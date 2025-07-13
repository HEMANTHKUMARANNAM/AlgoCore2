import React, { useState, useEffect, useRef } from "react";
import Exam2 from "./Exam2";
import { database } from "../../firebase";
import { ref, get, set, child } from "firebase/database";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const DynamicExam = () => {
  const [stage, setStage] = useState("loading"); // 'loading', 'instructions', 'exam', 'warning', 'completed', 'resume'
  const [Questions, setQuestions] = useState([]);
  const [examStatus, setExamStatus] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const containerRef = useRef(null);

  const { testid } = useParams();

  const { user } = useAuth();

  // Function to check exam status
  const checkExamStatus = async () => {
    try {
      const statusRef = ref(database, `Exam/${testid}/Properties/Progress/${user.uid}`);
      const statusSnapshot = await get(statusRef);

      if (statusSnapshot.exists()) {
        const statusData = statusSnapshot.val();

        // If exam is completed
        if (statusData.status === "completed" || statusData.completed === true) {
          setStage("completed");
          return true;
        }

        console.log( statusData );

        // If exam was started but not completed
        if (statusData.startTime ) {
          setStage("resume");
          setStartTime(statusData.startTime);
          return false;
        }
      }
      return false;
    } catch (error) {
      console.error("Error checking exam status:", error);
      return false;
    }
  };

  // Function to check exam duration
  const checkExamDuration = async () => {
    try {
      const examRef = ref(database, `Exam/${testid}/Properties`);
      const snapshot = await get(examRef);

      if (snapshot.exists()) {
        const examData = snapshot.val();
        const startTime = new Date(examData.startTime);
        const durationMinutes = examData.duration || 60; // Default 60 minutes if not set
        const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

        // Compare with current time
        if (new Date() > endTime) {
          await markExamCompleted();
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error checking exam duration:", error);
      return false;
    }
  };

  // Fetch question data and exam status from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check exam status first
        const isCompleted = await checkExamStatus();
        if (isCompleted) return;

        // Load questions
        const questionRef = ref(database, `Exam/${testid}/questions`);
        const questionSnapshot = await get(questionRef);

        if (questionSnapshot.exists()) {
          setQuestions(questionSnapshot.val());
        }

        // Only move to next stage after all data is loaded
        setStage(prev => prev === "loading" ? "instructions" : prev);
      } catch (error) {
        console.error("Error fetching data:", error);
        setStage("instructions"); // Fallback
      }
    };

    if (testid) fetchData();
  }, [testid]);

  useEffect(() => {
    const handleFullScreenChange = async () => {
      const isFullScreen = document.fullscreenElement !== null;

      if (!isFullScreen && stage === "exam") {
        // Exit from full screen during exam - check exam status first
        console.log("Exited full screen, checking exam status...");

        const isCompleted = await checkExamStatus();
        if (!isCompleted) {
          // Only show warning if exam is not completed
          setStage("warning");
        }
        // If exam is completed, checkExamStatus will have already set stage to "completed"
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, [stage, testid]);

  useEffect(() => {
    const checkDuration = async () => {
      const isExpired = await checkExamDuration();
      if (isExpired) {
        setStage("completed");
      }
    };

    if (stage === "exam") {
      checkDuration();
    }
  }, [stage]);

  const startExam = async () => {
    try {
      // Check exam status first
      const statusRef = ref(database, `Exam/${testid}/Properties/Progress/${user.uid}`);
      const statusSnapshot = await get(statusRef);

      // If exam was already started but not completed, show resume screen
      if (statusSnapshot.exists() && statusSnapshot.val().startTime && !statusSnapshot.val().completed) {
        setStage("resume");
        return;
      }

      // Check if exam is already completed
      if (statusSnapshot.exists() && (statusSnapshot.val().status === "completed" || statusSnapshot.val().completed === true)) {
        return;
      }

      // Store exam start time in Firebase and local state
      const currentTime = new Date().toISOString();
      await set(ref(database, `Exam/${testid}/Properties/Progress/${user.uid}`), {
        startTime: currentTime,
        status: "started"
      });
      setStartTime(currentTime);

      if (containerRef.current.requestFullscreen) {
        await containerRef.current.requestFullscreen();
      }
      setStage("exam");
    } catch (error) {
      console.error("Failed to enter fullscreen:", error);
    }
  };

  const returnToFullScreen = async () => {
    try {
      // Check exam status before returning to full screen
      const isCompleted = await checkExamStatus();
      if (isCompleted) {
        return; // Don't return to exam if it's already completed
      }

      if (containerRef.current.requestFullscreen) {
        await containerRef.current.requestFullscreen();
      }
      setStage("exam");
    } catch (error) {
      console.error("Failed to re-enter fullscreen:", error);
    }
  };

  // Function to mark exam as completed (call this from Exam2 component when exam is finished)
  const markExamCompleted = async () => {
    try {
      const statusRef = ref(database, `ExamSubmissions/${testid}/status`);
      await set(statusRef, "completed");
      setExamStatus("completed");
      setStage("completed");
    } catch (error) {
      console.error("Error marking exam as completed:", error);
    }
  };

  return (
    <div ref={containerRef} className="w-full h-screen bg-gray-100">
      {stage === "loading" && (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg">Loading exam...</p>
        </div>
      )}

      {stage === "instructions" && (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <h1 className="text-3xl font-bold mb-6">Exam Instructions</h1>
          <ul className="mb-6 text-left list-disc list-inside max-w-xl">
            <li>This exam must be taken in full-screen mode.</li>
            <li>Exiting full screen will show a warning.</li>
            <li>Do not refresh or switch tabs.</li>
          </ul>
          <button
            onClick={startExam}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            I Agree, Start Exam
          </button>
        </div>
      )}

      {stage === "exam" && (
        <Exam2
          Questions={Questions}
          onExamComplete={markExamCompleted} // Pass the completion handler
          startTime={startTime}
        />
      )}

      {stage === "warning" && (
        <div className="flex flex-col items-center justify-center h-full bg-red-100 text-center p-6">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Warning!</h2>
          <p className="text-red-600 mb-4">
            You have exited full screen. Please return to full screen to continue.
          </p>
          <button
            onClick={returnToFullScreen}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Return to Full Screen
          </button>
        </div>
      )}

      {stage === "resume" && (
        <div className="flex flex-col items-center justify-center h-full bg-yellow-100 text-center p-6">
          <h2 className="text-2xl font-bold text-yellow-700 mb-4">Resume Exam</h2>
          <p className="text-yellow-600 mb-4">
            You have a pending exam. Please resume where you left off.
          </p>
          <button
            onClick={returnToFullScreen}
            className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Resume Exam
          </button>
        </div>
      )}

      {stage === "completed" && (
        <div className="flex flex-col items-center justify-center h-full bg-green-100 text-center p-6">
          <div className="mb-6">
            <svg
              className="w-16 h-16 text-green-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-green-800 mb-4">Exam Completed!</h2>
          <p className="text-green-700 mb-6 text-lg">
            Thank you for completing the exam. Your responses have been submitted successfully.
          </p>
          <div className="text-sm text-green-600">
            <p>You can now safely close this window.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicExam;