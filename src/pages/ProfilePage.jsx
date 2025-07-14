import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { ref, get, child } from "firebase/database";
import { database } from "../firebase";
import { generateSubmissionPDF } from "../utils/generatePdf";

// SVG Icons
const Icons = {
  Edit: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
    </svg>
  ),
  Trophy: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  ),
  Star: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  ),
  Calendar: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  Mail: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  ),
  Eye: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  ),
};

// Helper functions for timestamp conversion
const parseFirebaseTimestamp = (timestampKey) => {
  if (!timestampKey) return new Date(NaN);

  // Replace the last underscore before milliseconds with a dot
  const fixed = timestampKey.replace(
    /T(\d{2})_(\d{2})_(\d{2})_(\d{3})Z/,
    'T$1:$2:$3.$4Z'
  );

  const date = new Date(fixed);

  return isNaN(date.getTime()) ? new Date(NaN) : date;
};

const formatFirebaseTimestamp = (timestampKey) => {
  const date = parseFirebaseTimestamp(timestampKey);

  if (isNaN(date.getTime())) {
    console.warn('Invalid date for timestamp:', timestampKey);
    return 'N/A';
  }

  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

function ProfilePage() {
  const { theme } = useTheme();
  const { user, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [profileData, setProfileData] = useState(null);

  // Format join date from timestamp
  const formatJoinDate = (timestamp) => {
    if (!timestamp) return "Unknown";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30";
      case "Wrong Answer":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
      case "Runtime Error":
        return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30";
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30";
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return;

      const dbRef = ref(database);
      const progressPath = `userprogress/${user.uid}`;
      const submissionsPath = `Submissions/${user.uid}`;

      try {
        const [progressSnapshot, submissionsSnapshot] = await Promise.all([
          get(child(dbRef, progressPath)),
          get(child(dbRef, submissionsPath)),
        ]);

        let acceptedCount = 0;
        let totalSubmissions = 0;
        let submissionsList = [];

        // Process progress data (for accepted submissions)
        if (progressSnapshot.exists()) {
          const progressData = progressSnapshot.val();

          for (const courseKey in progressData) {
            for (const subKey in progressData[courseKey]) {
              for (const questionId in progressData[courseKey][subKey]) {
                const progress = progressData[courseKey][subKey][questionId];
                const accepted =
                  typeof progress === "object" ? progress.accepted : progress;

                if (accepted === true) {
                  acceptedCount++;
                }
              }
            }
          }
        }

        // Process submissions data
        if (submissionsSnapshot.exists()) {
          const submissionsData = submissionsSnapshot.val();
          totalSubmissions = 0;

          // Flatten the submissions data into an array
          for (const courseKey in submissionsData) {
            for (const subKey in submissionsData[courseKey]) {
              for (const questionId in submissionsData[courseKey][subKey]) {
                for (const timestampKey in submissionsData[courseKey][subKey][
                  questionId
                ]) {
                  const submission =
                    submissionsData[courseKey][subKey][questionId][
                    timestampKey
                    ];
                  totalSubmissions++;

                  submissionsList.push({
                    problem: questionId,
                    course: courseKey,
                    subcourse: subKey,
                    language: submission.language || "N/A",
                    status:
                      submission.status === "correct"
                        ? "Accepted"
                        : "Wrong Answer",
                    runtime: "-", // Placeholder
                    date: formatFirebaseTimestamp(timestampKey),
                    timestamp: parseFirebaseTimestamp(timestampKey).getTime(),
                    code: submission.code,
                  });
                }
              }
            }
          }

          // Sort submissions by timestamp in descending order
          submissionsList.sort((a, b) => b.timestamp - a.timestamp);
        }

        setProfileData((prev) => ({
          ...prev,
          stats: {
            ...prev.stats,
            acceptedSubmissions: acceptedCount,
            totalSubmissions: totalSubmissions,
          },
          allSubmissions: submissionsList,
          recentSubmissions: submissionsList.slice(0, 10), // Show only recent 10 by default
        }));
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    if (user) {
      setProfileData({
        username: user.name || "Anonymous",
        email: user.email || "No email provided",
        joinDate: formatJoinDate(Date.now()),
        photoURL: user.photoURL || "https://via.placeholder.com/150",
        allSubmissions: [],
        recentSubmissions: [],
        stats: {
          totalSubmissions: 0,
          acceptedSubmissions: 0,
          streak: 0,
          rank: "Beginner",
        },
      });

      fetchUserData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Please sign in to view your profile
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You need to be authenticated to access this page.
          </p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1">
                  <img
                    src={profileData.photoURL}
                    alt="Profile"
                    className="w-full h-full rounded-full border-4 border-white dark:border-gray-800"
                  />
                </div>
                <button className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg">
                  <Icons.Edit />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {profileData.username}
                  </h1>
                  <button className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <Icons.Edit />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <Icons.Calendar />
                    <span>Joined {profileData.joinDate}</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <Icons.Mail />
                    <span>{profileData.email}</span>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {profileData.bio}
                </p>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl">
                    <div className="text-2xl font-bold">
                      {profileData.stats.totalSubmissions}
                    </div>
                    <div className="text-sm opacity-90">Total Submissions</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl">
                    <div className="text-2xl font-bold">
                      {profileData.stats.acceptedSubmissions}
                    </div>
                    <div className="text-sm opacity-90">Accepted</div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl">
                    <div className="text-2xl font-bold">
                      {profileData.stats.rank}
                    </div>
                    <div className="text-sm opacity-90">Rank</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Tabs */}
          <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 mb-8">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                className={`px-6 py-4 text-sm font-medium transition-all duration-200 ${activeTab === "overview"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/20"
                  : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                className={`px-6 py-4 text-sm font-medium transition-all duration-200 ${activeTab === "submissions"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/20"
                  : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                onClick={() => setActiveTab("submissions")}
              >
                Submissions
              </button>
            </div>

            <div className="p-8">
              {activeTab === "overview" && (
                <div className="space-y-8">
                  {/* Activity Graph */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                      Activity
                    </h3>
                    <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-8 h-48">
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-4 bg-white/50 dark:bg-gray-800/50 rounded-full flex items-center justify-center">
                            <Icons.Trophy />
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-lg">
                            Activity Graph Coming Soon
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "submissions" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      All Submissions ({profileData.allSubmissions?.length || 0}
                      )
                    </h3>
                    <div className="flex gap-3">
                      <select
                        className="bg-white/70 dark:bg-gray-700/70 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm backdrop-blur-sm"
                        onChange={(e) => {
                          const filtered = profileData.allSubmissions.filter(
                            (sub) =>
                              e.target.value === "All Languages" ||
                              sub.language === e.target.value
                          );
                          setProfileData((prev) => ({
                            ...prev,
                            recentSubmissions: filtered.slice(0, 10),
                          }));
                        }}
                      >
                        <option>All Languages</option>
                        <option>python</option>
                        <option>javascript</option>
                        <option>java</option>
                        <option>cpp</option>
                      </select>
                      <select
                        className="bg-white/70 dark:bg-gray-700/70 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm backdrop-blur-sm"
                        onChange={(e) => {
                          const filtered = profileData.allSubmissions.filter(
                            (sub) =>
                              e.target.value === "All Status" ||
                              sub.status === e.target.value
                          );
                          setProfileData((prev) => ({
                            ...prev,
                            recentSubmissions: filtered.slice(0, 10),
                          }));
                        }}
                      >
                        <option>All Status</option>
                        <option>Accepted</option>
                        <option>Wrong Answer</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto mb-6">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50/50 dark:bg-gray-700/50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Problem
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Course
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Language
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            PDF
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white/30 dark:bg-gray-800/30 divide-y divide-gray-200 dark:divide-gray-700">
                        {profileData.recentSubmissions.map(
                          (submission, index) => (
                            <tr
                              key={index}
                              className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {submission.problem}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {submission.course} / {submission.subcourse}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {submission.language}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                    submission.status
                                  )}`}
                                >
                                  {submission.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {submission.date || "N/A"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {submission.status === "Accepted" && (
                                  <button
                                    onClick={() => generateSubmissionPDF(submission)}
                                    className="text-blue-600 hover:underline text-sm"
                                  >
                                    View PDF
                                  </button>
                                )}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="flex justify-between items-center">
                    <button
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50"
                      disabled={profileData.recentSubmissions.length <= 10}
                      onClick={() => {
                        const currentIndex =
                          profileData.allSubmissions.findIndex(
                            (sub) =>
                              sub.timestamp ===
                              profileData.recentSubmissions[0].timestamp
                          );
                        const newIndex = Math.max(0, currentIndex - 10);
                        setProfileData((prev) => ({
                          ...prev,
                          recentSubmissions: prev.allSubmissions.slice(
                            newIndex,
                            newIndex + 10
                          ),
                        }));
                      }}
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Showing {profileData.recentSubmissions.length} of{" "}
                      {profileData.allSubmissions?.length || 0} submissions
                    </span>
                    <button
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50"
                      disabled={
                        profileData.recentSubmissions.length === 0 ||
                        profileData.allSubmissions.length <=
                        profileData.recentSubmissions.length ||
                        profileData.recentSubmissions[
                          profileData.recentSubmissions.length - 1
                        ].timestamp ===
                        profileData.allSubmissions[
                          profileData.allSubmissions.length - 1
                        ].timestamp
                      }
                      onClick={() => {
                        const currentIndex =
                          profileData.allSubmissions.findIndex(
                            (sub) =>
                              sub.timestamp ===
                              profileData.recentSubmissions[
                                profileData.recentSubmissions.length - 1
                              ].timestamp
                          );
                        const newIndex = currentIndex + 1;
                        setProfileData((prev) => ({
                          ...prev,
                          recentSubmissions: prev.allSubmissions.slice(
                            newIndex,
                            newIndex + 10
                          ),
                        }));
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;