import React, { useEffect, useState } from "react";
import { auth, database } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import { useAuth } from "./context/AuthContext";



const ProtectedRoute = ({ children, requireAdmin = false, requireUser = false }) => {
  const [authStatus, setAuthStatus] = useState("loading"); // 'loading', 'unauthenticated', 'authenticated', 'unauthorized'

  const { user } = useAuth();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAuthStatus("unauthenticated");
        return;
      }


      // Get user's role from Realtime Database
      try {
        const userRef = ref(database, `Admins/${user.uid}`);
        const snapshot = await get(userRef);


        let isAdmin = false;

        if (snapshot.exists()) {
          isAdmin = true;
        }

        if (requireAdmin && !isAdmin) {
          setAuthStatus("unauthorized");
          console.log("meow1");
        } else if (requireUser && isAdmin) {
          setAuthStatus("unauthorized");
          console.log("meow2");
        } else {
          setAuthStatus("authenticated");
        }

      } catch (error) {
        console.error("Error fetching user data:", error);
        setAuthStatus("unauthorized");
      }
    });

    return () => unsubscribe();
  }, [requireAdmin, requireUser, user]);

  if (authStatus === "loading") return <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>;
  if (authStatus === "unauthenticated") return <div>Sign-in required</div>;
  if (authStatus === "unauthorized") return <div>Page not available for you</div>;

  return children;
};

export default ProtectedRoute;
