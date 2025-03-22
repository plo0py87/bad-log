import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminPage from './pages/AdminPage';
import { enableLocalMode, checkFirebaseConnection } from './services/blogService';

const router = createBrowserRouter([
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
    path: '/contact',
    element: <Layout><ContactPage /></Layout>,
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

    // 無論如何都啟用本地模式，確保應用可用
    enableLocalMode();
    console.log('強制啟用本地模式，確保應用可用');
  }, []);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
