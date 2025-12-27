import { useState, useEffect, lazy, Suspense } from 'react';
import {
  getAllPosts,
  initializeFirebaseData,
  getFeaturedPost
} from '../services/blogService';
import { getAllGalleryItems } from '../services/galleryService';
import { getAllSubscribers, NewsletterSubscriber } from '../services/newsletterService';
import { useAuth } from '../context/AuthContext';
import { GalleryItem } from '../types/gallery';
import { BlogPost } from '../types/blog';

// 使用懶加載來導入管理組件
const BlogManagement = lazy(() => import('../features/admin/components/BlogManagement'));
const GalleryManagement = lazy(() => import('../features/admin/components/GalleryManagement'));
const SubscriberManagement = lazy(() => import('../features/admin/components/SubscriberManagement'));
const ExperienceManagement = lazy(() => import('../features/admin/components/ExperienceManagement'));
const SkillsManagement = lazy(() => import('../features/admin/components/SkillsManagement'));
const ContentManagement = lazy(() => import('../features/admin/components/ContentManagement'));

// 載入中的顯示組件
const LoadingComponent = () => (
  <div className="flex justify-center items-center h-64">
    <p className="text-white">載入中...</p>
  </div>
);

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPostId, setFeaturedPostId] = useState<string | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [activeSection, setActiveSection] = useState<'blog' | 'gallery' | 'subscribers' | 'experience' | 'skills' | 'content'>('blog');
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [isLoadingSubscribers, setIsLoadingSubscribers] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { logout, currentUser } = useAuth();

  // 初始加載數據
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 初始化 Firebase 數據（如果需要）
        await initializeFirebaseData();

        // 獲取所有文章
        const fetchedPosts = await getAllPosts();
        setPosts(fetchedPosts);

        // 獲取精選文章 ID
        const featured = await getFeaturedPost();
        setFeaturedPostId(featured?.postId || null);

        // Fetch gallery items
        const fetchedGalleryItems = await getAllGalleryItems();
        setGalleryItems(fetchedGalleryItems);

        setLoading(false);
      } catch (err) {
        setError('加載數據時發生錯誤');
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // 登出處理
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("登出失敗", error);
    }
  };

  // 載入訂閱者列表
  const loadSubscribers = async () => {
    try {
      setIsLoadingSubscribers(true);
      const fetchedSubscribers = await getAllSubscribers();
      setSubscribers(fetchedSubscribers);
    } catch (err) {
      setError('載入訂閱者列表時發生錯誤');
      console.error(err);
    } finally {
      setIsLoadingSubscribers(false);
    }
  };

  // 當切換到訂閱者部分時載入數據
  useEffect(() => {
    if (activeSection === 'subscribers') {
      loadSubscribers();
    }
  }, [activeSection]);

  // 切換選項時在手機模式下自動關閉側邊欄
  const handleSectionChange = (section: 'blog' | 'gallery' | 'subscribers' | 'experience' | 'skills' | 'content') => {
    setActiveSection(section);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // 側邊欄
  const renderSidebar = () => (
    <div className={`fixed md:static top-0 left-0 h-full z-20 w-64 bg-gray-900 bg-opacity-50 min-h-screen p-6 border-r border-gray-800 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      <h1 className="text-xl font-light text-white mb-8 tracking-wider">管理後台</h1>

      <div className="mb-8">
        <div className="text-sm text-white opacity-70 mb-2">已登入為</div>
        <div className="flex items-center space-x-4">
          <div>
            <div className="text-white">{currentUser?.email}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-2 text-sm text-red-400 hover:text-red-300"
        >
          登出
        </button>
      </div>

      <nav className="space-y-2">
        <button
          onClick={() => handleSectionChange('blog')}
          className={`w-full text-left py-2 px-3 rounded transition ${activeSection === 'blog'
            ? 'bg-gray-800 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
        >
          文章管理
        </button>
        <button
          onClick={() => handleSectionChange('gallery')}
          className={`w-full text-left py-2 px-3 rounded transition ${activeSection === 'gallery'
            ? 'bg-gray-800 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
        >
          圖庫管理
        </button>
        <button
          onClick={() => handleSectionChange('experience')}
          className={`w-full text-left py-2 px-3 rounded transition ${activeSection === 'experience'
            ? 'bg-gray-800 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
        >
          經歷管理
        </button>
        <button
          onClick={() => handleSectionChange('skills')}
          className={`w-full text-left py-2 px-3 rounded transition ${activeSection === 'skills'
            ? 'bg-gray-800 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
        >
          技能管理
        </button>
        <button
          onClick={() => handleSectionChange('content')}
          className={`w-full text-left py-2 px-3 rounded transition ${activeSection === 'content'
            ? 'bg-gray-800 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
        >
          內容管理
        </button>
        <button
          onClick={() => handleSectionChange('subscribers')}
          className={`w-full text-left py-2 px-3 rounded transition ${activeSection === 'subscribers'
            ? 'bg-gray-800 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
        >
          訂閱者管理
        </button>
      </nav>
    </div>
  );

  // 根據選擇的部分渲染不同內容
  const renderContent = () => {
    if (loading) {
      return <LoadingComponent />;
    }

    switch (activeSection) {
      case 'blog':
        return (
          <Suspense fallback={<LoadingComponent />}>
            <BlogManagement
              posts={posts}
              setPosts={setPosts}
              featuredPostId={featuredPostId}
              setFeaturedPostId={setFeaturedPostId}
              setError={setError}
            />
          </Suspense>
        );
      case 'gallery':
        return (
          <Suspense fallback={<LoadingComponent />}>
            <GalleryManagement
              galleryItems={galleryItems}
              setGalleryItems={setGalleryItems}
              setError={setError}
            />
          </Suspense>
        );
      case 'experience':
        return (
          <Suspense fallback={<LoadingComponent />}>
            <ExperienceManagement />
          </Suspense>
        );
      case 'skills':
        return (
          <Suspense fallback={<LoadingComponent />}>
            <SkillsManagement />
          </Suspense>
        );
      case 'content':
        return (
          <Suspense fallback={<LoadingComponent />}>
            <ContentManagement />
          </Suspense>
        );
      case 'subscribers':
        return (
          <Suspense fallback={<LoadingComponent />}>
            <SubscriberManagement
              subscribers={subscribers}
              setSubscribers={setSubscribers}
              isLoadingSubscribers={isLoadingSubscribers}
              setError={setError}
            />
          </Suspense>
        );
      default:
        return null;
    }
  };

  // 漢堡選單按鈕
  const renderHamburgerButton = () => (
    <button
      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      className="md:hidden fixed top-4 left-4 z-30 bg-gray-800 p-2 rounded-md text-white"
      aria-label={isSidebarOpen ? "關閉選單" : "開啟選單"}
    >
      {isSidebarOpen ? (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )}
    </button>
  );

  // 背景遮罩 - 點擊關閉側邊欄
  const renderBackdrop = () => (
    isSidebarOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
        onClick={() => setIsSidebarOpen(false)}
      />
    )
  );

  return (
    <div className="bg-black min-h-screen kuchiki-overlay">
      {renderHamburgerButton()}
      {renderBackdrop()}
      <div className="flex flex-col md:flex-row">
        {renderSidebar()}

        <div className="flex-1 p-6 overflow-auto md:ml-0 pt-16 md:pt-6">
          {error && (
            <div className="bg-red-900 bg-opacity-30 border border-red-700 text-red-300 p-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-2xl font-light text-white tracking-wider">
              {activeSection === 'blog' && '文章管理'}
              {activeSection === 'gallery' && '圖庫管理'}
              {activeSection === 'subscribers' && '訂閱者管理'}
              {activeSection === 'experience' && '經歷管理'}
              {activeSection === 'skills' && '技能管理'}
              {activeSection === 'content' && '內容管理'}
            </h2>
            {currentUser && (
              <div className="flex items-center">
                {currentUser.photoURL && (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || '管理員'}
                    className="h-8 w-8 rounded-full mr-2"
                  />
                )}
                <span className="text-white text-sm">
                  {currentUser.displayName || currentUser.email}
                </span>
              </div>
            )}
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
}
