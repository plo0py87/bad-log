import * as React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaLeaf, FaGoogle } from 'react-icons/fa';

export default function LoginPage() {
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const { loginWithGoogle, currentUser, isAdmin, logout } = useAuth();

  // If already logged in as admin, redirect to admin page
  if (currentUser && isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  
  // If logged in but not an admin
  if (currentUser && !isAdmin) {
    return (
      <div className="bg-black text-white min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 kuchiki-overlay">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <FaLeaf className="mx-auto h-12 w-auto text-white opacity-80" />
          <h2 className="mt-6 text-center text-3xl font-light tracking-wider">
            訪問被拒絕
          </h2>
          <p className="mt-4 text-center text-white">
            您的帳戶不是管理員。請使用有權限的帳戶登入。
          </p>
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => logout()}
              className="kuchiki-btn"
            >
              登出
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      // Navigation will happen automatically in the effect hook if user is admin
    } catch (err) {
      console.error('Login error:', err);
      setError('登入失敗，請稍後再試。');
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 kuchiki-overlay">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <FaLeaf className="mx-auto h-12 w-auto text-white opacity-80" />
        <h2 className="mt-6 text-center text-3xl font-light tracking-wider">
          管理員登入
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-900 bg-opacity-50 py-8 px-4 shadow sm:rounded-none sm:px-10 border border-gray-800">
          {error && (
            <div className="bg-red-900 bg-opacity-50 border border-red-800 text-white px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <div className="flex flex-col space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="kuchiki-btn flex items-center justify-center py-3"
            >
              <FaGoogle className="mr-2" />
              {loading ? '登入中...' : '使用 Google 帳戶登入'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}