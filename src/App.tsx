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
import { usePageViews } from './hooks/usePageViews'; // Import the real hook

import { enableLocalMode, checkFirebaseConnection } from './services/blogService';

// Router configuration
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
    path: '/admin',
    element: <AdminPage />,
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
    <RouterProvider router={router} />
  );
}

export default App;
