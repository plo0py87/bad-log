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

import { enableLocalMode, checkFirebaseConnection } from './services/blogService';


// 使用 HashRouter 而非 BrowserRouter，以解決靜態部署中的路由問題
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
  // 在應用載入時檢查 Firebase 連接，如果失敗則啟用本地模式
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
