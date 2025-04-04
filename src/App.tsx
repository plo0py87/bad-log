import { RouterProvider, createHashRouter } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import GalleryPage from './pages/GalleryPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage'; // Make sure you have this
import { usePageViews } from './hooks/usePageViews';
import { enableLocalMode, checkFirebaseConnection } from './services/blogService';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Router configuration with nested routes for protected paths
const router = createHashRouter([
  {
    path: '/',
    element: <Layout><HomePage /></Layout>,
  },
  {
    path: '/blog',
    element: <Layout><BlogPage /></Layout>,
  },
  {
    path: '/blog/:id',
    element: <Layout><BlogDetailPage /></Layout>,
  },
  {
    path: '/about',
    element: <Layout><AboutPage /></Layout>,
  },
  {
    path: '/gallery',
    element: <Layout><GalleryPage /></Layout>,
  },
  {
    path: '/login',
    element: <Layout><LoginPage /></Layout>,
  },
  // Protected admin routes
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        path: '', // This means /admin itself
        element: <AdminPage />
      },
      // You can add more admin routes here if needed
      // {
      //   path: 'users',
      //   element: <AdminUsersPage />
      // }
    ]
  },
  {
    path: '*',
    element: <Layout><NotFoundPage /></Layout>,
  },
]);

function App() {
  // Call usePageViews here to count views for any page
  const { viewCount, loading, error } = usePageViews();
  
  // Check Firebase connection
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = await checkFirebaseConnection();
        if (!connected) {
          console.log('自動啟用本地模式，使用靜態數據');
          enableLocalMode();
        }
      } catch (error) {
        console.error('檢查 Firebase 連接時出錯:', error);
        enableLocalMode();
      }
    };

    checkConnection();
  }, []);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
