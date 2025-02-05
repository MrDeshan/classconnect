import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if teacher is trying to access student dashboard or vice versa
  if (location.pathname === '/teacher-dashboard' && userRole !== 'teacher') {
    return <Navigate to="/dashboard" replace />;
  }

  if (location.pathname === '/dashboard' && userRole === 'teacher') {
    return <Navigate to="/teacher-dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;