import { useState, useEffect } from 'react';
import { addPost, getAllPosts, deletePost, initializeFirebaseData, getAllAuthors } from '../services/blogService';
import { BlogPost} from '../types/blog';
import { FaLeaf, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { marked } from 'marked';

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);

  // 管理新增和編輯文章的表單
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [previewMode, setPreviewMode] = useState(false);

  // 新文章表單狀態
  const [formData, setFormData] = useState<Omit<BlogPost, 'id'>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    publishedDate: new Date(),
    category: '',
    tags: []
  });

  // 標籤輸入
  const [tagInput, setTagInput] = useState('');

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

        // 獲取所有作者
        setLoading(false);
      } catch (err) {
        setError('加載數據時發生錯誤');
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // 處理表單輸入變更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  };

  // 處理標籤添加
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  // 處理標籤刪除
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  // 從標題自動生成 slug
  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5\- ]/g, '') // 保留中文字符
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    setFormData(prev => ({ ...prev, slug }));
  };

  // 提交表單
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      // 提交到 Firebase
      const postId = await addPost(formData);

      if (postId) {
        // 重新獲取文章列表
        const updatedPosts = await getAllPosts();
        setPosts(updatedPosts);

        // 重置表單
        setFormData({
          title: '',
          slug: '',
          excerpt: '',
          content: '',
          publishedDate: new Date(),
          category: '',
          tags: []
        });

        setIsAddingPost(false);
        setActiveStep(1);
      } else {
        setError('添加文章時發生錯誤');
      }
    } catch (err) {
      setError('提交表單時發生錯誤');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 刪除文章
  const handleDeletePost = async (id: string) => {
    if (window.confirm('確定要刪除這篇文章嗎？此操作無法撤銷。')) {
      try {
        setLoading(true);
        const success = await deletePost(id);

        if (success) {
          // 從本地狀態中移除已刪除的文章
          setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
        } else {
          setError('刪除文章時發生錯誤');
        }
      } catch (err) {
        setError('刪除文章時發生錯誤');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  // 渲染步驟 1：基本信息
  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-light text-white mb-1 tracking-wider">
          標題
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          onBlur={generateSlug}
          className="kuchiki-input w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-light text-white mb-1 tracking-wider">
          Slug (URL)
        </label>
        <input
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleInputChange}
          className="kuchiki-input w-full"
          required
        />
        <p className="mt-1 text-sm text-white opacity-60">
          此字段將用於 URL，例如：/blog/{formData.slug || 'your-post-slug'}
        </p>
      </div>

      <div>
        <label className="block text-sm font-light text-white mb-1 tracking-wider">
          摘要
        </label>
        <textarea
          name="excerpt"
          value={formData.excerpt}
          onChange={handleInputChange}
          className="kuchiki-input w-full"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-light text-white mb-1 tracking-wider">
          類別
        </label>
        <input
          type="text"
          name="category"
          value={formData.category || ''}
          onChange={handleInputChange}
          className="kuchiki-input w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-light text-white mb-1 tracking-wider">
          封面圖片 URL
        </label>
        <input
          type="text"
          name="coverImage"
          value={formData.coverImage || ''}
          onChange={handleInputChange}
          className="kuchiki-input w-full"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <label className="block text-sm font-light text-white mb-1 tracking-wider">
          標籤
        </label>
        <div className="flex">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="kuchiki-input w-full"
            placeholder="輸入標籤並按添加"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="kuchiki-btn ml-2"
          >
            添加
          </button>
        </div>

        {/* 顯示已添加的標籤 */}
        {formData.tags && formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-gray-800 text-white text-xs"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-red-400 hover:text-red-300"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setActiveStep(2)}
          className="kuchiki-btn"
        >
          下一步：編寫內容
        </button>
      </div>
    </div>
  );

  // 渲染步驟 2：文章內容
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex justify-between mb-2">
        <label className="block text-sm font-light text-white mb-1 tracking-wider">
          文章內容 (支持 Markdown)
        </label>
        <button
          type="button"
          onClick={() => setPreviewMode(!previewMode)}
          className="text-sm underline text-white opacity-80 hover:opacity-100"
        >
          {previewMode ? '返回編輯' : '預覽'}
        </button>
      </div>

      {previewMode ? (
        <div
          className="prose prose-invert max-w-none p-6 bg-gray-900 bg-opacity-40 border border-gray-800 min-h-[400px]"
          dangerouslySetInnerHTML={{ __html: marked(formData.content) }}
        />
      ) : (
        <textarea
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          className="kuchiki-input w-full"
          rows={15}
          required
        />
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setActiveStep(1)}
          className="kuchiki-btn"
        >
          返回基本信息
        </button>

        <button
          type="submit"
          className="kuchiki-btn"
        >
          發布文章
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-black text-white min-h-screen kuchiki-overlay py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <FaLeaf className="inline-block mb-4 text-3xl opacity-60 text-white" />
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-6"></div>
          <h1 className="text-4xl font-light tracking-wider text-white sm:text-5xl lg:text-6xl kuchiki-title">文章管理</h1>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mt-6 mb-6"></div>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-white font-light">
            添加、編輯和管理您的博客文章
          </p>
        </div>

        {error && (
          <div className="bg-red-900 bg-opacity-30 border border-red-800 p-4 mb-6 text-white">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="text-white">載入中...</div>
          </div>
        ) : (
          <>
            {/* 操作按鈕 */}
            <div className="mb-8 flex justify-end">
              <button
                onClick={() => setIsAddingPost(!isAddingPost)}
                className="kuchiki-btn flex items-center gap-2"
              >
                {isAddingPost ? (
                  '取消'
                ) : (
                  <>
                    <FaPlus size={14} />
                    <span>新增文章</span>
                  </>
                )}
              </button>
            </div>

            {/* 添加文章表單 */}
            {isAddingPost && (
              <div className="mb-12 bg-gray-900 bg-opacity-40 p-8 border border-gray-800">
                <h2 className="text-2xl font-light text-white mb-6 tracking-wider">
                  {isEditing ? '編輯文章' : '新增文章'}
                </h2>

                <form onSubmit={handleSubmit}>
                  {activeStep === 1 && renderStep1()}
                  {activeStep === 2 && renderStep2()}
                </form>
              </div>
            )}

            {/* 文章列表 */}
            <div className="mb-8">
              <h2 className="text-2xl font-light text-white mb-6 tracking-wider">文章列表</h2>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-900 bg-opacity-40 border border-gray-800">
                  <thead>
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium tracking-wider text-white opacity-80">標題</th>
                      <th className="py-3 px-4 text-left text-xs font-medium tracking-wider text-white opacity-80">作者</th>
                      <th className="py-3 px-4 text-left text-xs font-medium tracking-wider text-white opacity-80">類別</th>
                      <th className="py-3 px-4 text-left text-xs font-medium tracking-wider text-white opacity-80">日期</th>
                      <th className="py-3 px-4 text-right text-xs font-medium tracking-wider text-white opacity-80">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {posts.length > 0 ? (
                      posts.map(post => (
                        <tr key={post.id} className="hover:bg-gray-800 transition-colors duration-150">
                          <td className="py-3 px-4 text-sm text-white">
                            {post.title}
                          </td>
                          <td className="py-3 px-4 text-sm text-white">
                            {post.category || '-'}
                          </td>
                          <td className="py-3 px-4 text-sm text-white">
                            {post.publishedDate instanceof Date
                              ? post.publishedDate.toLocaleDateString('zh-TW')
                              : post.publishedDate}
                          </td>
                          <td className="py-3 px-4 text-sm text-right">
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="text-red-400 hover:text-red-300 transition-colors ml-2"
                              title="刪除文章"
                            >
                              <FaTrash size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-4 px-4 text-center text-white">
                          沒有找到文章。您可以點擊上方的「新增文章」按鈕創建您的第一篇文章。
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
