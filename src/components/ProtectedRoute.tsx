import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { currentUser, loading, isAdmin } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <p>Loading...</p>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but not an admin, redirect to login
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected content for admins only
  return <Outlet />;
}