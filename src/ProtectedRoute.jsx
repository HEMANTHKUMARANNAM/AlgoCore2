import React, { useEffect, useState } from "react";
import { auth, database } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";

const ProtectedRoute = ({ children, requireAdmin = false , requireUser = false }) => {
  const [authStatus, setAuthStatus] = useState("loading"); // 'loading', 'unauthenticated', 'authenticated', 'unauthorized'

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

        if (snapshot.exists()) {
          const isAdmin = true;

          if (requireAdmin && !isAdmin) {
            setAuthStatus("unauthorized");
          }
          else if (requireUser && isAdmin) {
            setAuthStatus("unauthorized");
          }
          else {
            setAuthStatus("authenticated");
          }
        } else {
          setAuthStatus("unauthorized");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setAuthStatus("unauthorized");
      }
    });

    return () => unsubscribe();
  }, [requireAdmin, requireUser]);

  if (authStatus === "loading") return <div>Loading...</div>;
  if (authStatus === "unauthenticated") return <div>Sign-in required</div>;
  if (authStatus === "unauthorized") return <div>Page not available for you</div>;

  return children;
};

export default ProtectedRoute;
