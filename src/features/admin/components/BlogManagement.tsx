import * as React from 'react';
import { useState } from 'react';
import { FaPlus, FaEdit, FaUpload, FaArchive, FaStar, FaTrash } from 'react-icons/fa';
import { BlogPost } from '../../../types/blog';
import { addPost, updatePost, deletePost, updateFeaturedPost } from '../../../services/blogService';
import useFirebaseUpload from '../../../hooks/useFirebaseUpload';
import TiptapEditor from '../../../components/ui/TiptapEditor';

interface BlogManagementProps {
  posts: BlogPost[];
  setPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  featuredPostId: string | null;
  setFeaturedPostId: React.Dispatch<React.SetStateAction<string | null>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const BlogManagement: React.FC<BlogManagementProps> = ({ 
  posts, 
  setPosts, 
  featuredPostId, 
  setFeaturedPostId,
  setError 
}) => {  // State for adding and editing blog posts
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);  
  // Image upload state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Custom hook for Firebase uploads
  const { 
    uploadFile, 
    uploadProgress, 
    isUploading, 
    uploadError,
  } = useFirebaseUpload();
  
  // Current edited post id
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Omit<BlogPost, 'id'>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    publishedDate: new Date(),
    category: '',
    tags: [],
    coverImage: ''
  });

  // Tag input state
  const [tagInput, setTagInput] = useState('');
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  // Handle tag addition
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  // Handle tag removal
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };
  // Generate slug from title
  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5\- ]/g, '') // 保留中文字符      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    setFormData(prev => ({ ...prev, slug }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (isEditing && currentPostId) {
        // Update existing post
        const success = await updatePost(currentPostId, formData);
        
        if (success) {
          // Update the post in the local state
          setPosts(prevPosts => prevPosts.map(post => 
            post.id === currentPostId ? {...post, ...formData} : post
          ));
          
          // Reset form and editing state
          resetForm();
          setError(null);
        } else {
          setError('更新文章時發生錯誤');
        }
      } else {
        // Add new post with archived field explicitly set to false
        const postWithArchiveField = {
          ...formData,
          archived: false
        };
        
        const postId = await addPost(postWithArchiveField);

        if (postId) {
          // Add new post to local state
          setPosts(prevPosts => [
            ...prevPosts,
            { id: postId, ...postWithArchiveField }
          ]);

          // Reset form
          resetForm();
          setError(null);
        } else {
          setError('添加文章時發生錯誤');
        }
      }
    } catch (err) {
      setError('提交表單時發生錯誤');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Reset form and state
  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      publishedDate: new Date(),
      category: '',
      tags: [],
      coverImage: ''    });
    setIsAddingPost(false);
    setIsEditing(false);
    setCurrentPostId(null);
    setActiveStep(1);
    setImageFile(null);
    setImagePreview(null);
  };

  // Handle post deletion
  const handleDeletePost = async (id: string) => {
    if (window.confirm('確定要刪除這篇文章嗎？此操作無法撤銷。')) {
      try {
        setLoading(true);
        const success = await deletePost(id);

        if (success) {
          // Remove deleted post from local state
          setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
          setError(null);
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

  // Handle post edit
  const handleEditPost = (post: BlogPost) => {
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content || '',
      publishedDate: post.publishedDate,
      category: post.category || '',
      tags: post.tags || [],
      coverImage: post.coverImage || ''    });
    setCurrentPostId(post.id);
    setIsEditing(true);
    setIsAddingPost(true);
    setActiveStep(1);
  };

  // Handle post archiving
  const handleArchivePost = async (post: BlogPost) => {
    try {
      setLoading(true);
      // Toggle the archived status
      const updatedPost = {
        ...post,
        archived: !post.archived
      };
      
      const success = await updatePost(post.id, updatedPost);
      
      if (success) {
        // Update the post in the local state
        setPosts(prevPosts => prevPosts.map(p => 
          p.id === post.id ? {...p, archived: !p.archived} : p
        ));
        setError(null);
      } else {
        setError(`${post.archived ? '取消典藏' : '典藏文章'}`);
      }
    } catch (err) {
      setError(`${post.archived ? '取消典藏' : '典藏文章'}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle setting featured post
  const handleSetFeaturedPost = async (post: BlogPost) => {
    try {
      setLoading(true);
      
      // If this post is already featured, unfeature it
      if (featuredPostId === post.id) {
        const success = await updateFeaturedPost(null);
        
        if (success) {
          setFeaturedPostId(null);
          setError(null);
        } else {
          setError('取消精選文章時發生錯誤');
        }
      } else {
        // Otherwise, feature this post (replacing any existing featured post)
        const success = await updateFeaturedPost(post.id);
        
        if (success) {
          setFeaturedPostId(post.id);
          setError(null);
        } else {
          setError('設為精選文章時發生錯誤');
        }
      }
    } catch (err) {
      setError('更新精選文章時發生錯誤');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    // Only show confirmation if editing (not for new posts) and form has content
    const hasContent = formData.title || formData.content || formData.excerpt;
    
    if (isEditing && hasContent) {
      if (window.confirm('確定要取消編輯嗎？所有未儲存的變更將會遺失。')) {
        resetForm();
      }
    } else {
      // For new posts or empty forms, just cancel without confirmation
      resetForm();
    }
  };
  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Generate preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image upload to Firebase
  const handleImageUpload = async () => {
    if (!imageFile) return;
    
    try {
      const downloadURL = await uploadFile(imageFile, 'blog-images');
      
      if (downloadURL) {
        setFormData(prev => ({
          ...prev,
          coverImage: downloadURL
        }));
      }
    } catch (err) {
      setError('上傳圖片時發生錯誤');
    }  };

  // Render step 1: Basic info
  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-light text-white mb-1 tracking-wider">
          標題
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleInputChange}
          onBlur={generateSlug}
          className="kuchiki-input w-full"
          placeholder="輸入文章標題"
          required
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-light text-white mb-1 tracking-wider">
          Slug (URL)
        </label>
        <input
          type="text"
          name="slug"
          id="slug"
          value={formData.slug}
          onChange={handleInputChange}
          className="kuchiki-input w-full"
          placeholder="your-post-slug"
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
          封面圖片 {isEditing && formData.coverImage && "(已有上傳圖片)"}
        </label>
        <div className="space-y-4">
          {/* 已有圖片 (編輯模式) */}
          {isEditing && formData.coverImage && (
            <div className="p-3 bg-gray-800 bg-opacity-50 border border-gray-700 mb-3">
              <p className="text-sm text-white mb-2">當前封面圖片:</p>
              <img 
                src={formData.coverImage} 
                alt="當前封面" 
                className="max-h-40 border border-gray-700 mb-2"
              />
              <p className="text-xs text-white opacity-70 break-all mb-2">{formData.coverImage}</p>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, coverImage: '' }))}
                className="text-red-400 hover:text-red-300 text-xs underline"
              >
                移除現有圖片
              </button>
            </div>
          )}
          
          {/* 圖片上傳 */}
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              id="cover-image-upload"
            />
            <label 
              htmlFor="cover-image-upload"
              className="kuchiki-btn cursor-pointer flex items-center gap-2"
            >
              <FaUpload size={14} />
              <span>{isEditing ? '更換圖片' : '選擇圖片'}</span>
            </label>
            
            {imageFile && !isUploading && (
              <button
                type="button"
                onClick={handleImageUpload}
                className="kuchiki-btn"
                disabled={isUploading}
              >
                上傳到 Firebase
              </button>
            )}
          </div>

          {/* 上傳進度 */}
          {isUploading && (
            <div className="w-full bg-gray-700">
              <div 
                className="bg-green-600 h-2" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <p className="text-xs text-white mt-1">上傳中: {uploadProgress}%</p>
            </div>
          )}

          {/* 新選擇的圖片預覽 */}
          {imagePreview && !formData.coverImage && (
            <div className="mt-2">
              <p className="text-sm text-white mb-1">新圖片預覽:</p>
              <img 
                src={imagePreview} 
                alt="封面預覽" 
                className="max-h-40 border border-gray-700"
              />
            </div>
          )}

          {/* 或手動輸入 URL */}
          <div>
            <p className="text-sm text-white opacity-70 mb-1">或輸入圖片 URL:</p>
            <input
              type="text"
              name="coverImage"
              value={formData.coverImage || ''}
              onChange={handleInputChange}
              className="kuchiki-input w-full"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
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
      </div>    </div>
  );

  // Render step 2: Article content
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex justify-between mb-2">
        <label className="block text-sm font-light text-white mb-1 tracking-wider">
          文章內容        </label>
      </div>      <div className="relative">
        <TiptapEditor
          content={formData.content}
          onChange={handleContentChange}
          placeholder="開始編寫您的文章內容..."
          className="min-h-[500px]"
          onError={setError}
        />
      </div>

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
          disabled={loading || isUploading}
        >
          {loading ? '處理中...' : '發布文章'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* 操作按鈕 */}
      <div className="mb-8 flex justify-end">
        <button
          onClick={isAddingPost ? handleCancel : () => setIsAddingPost(true)}
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
        <h2 className="text-2xl font-light text-white tracking-wider mb-8">文章列表</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 bg-opacity-40 border border-gray-800">
            <thead>
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium tracking-wider text-white opacity-80">標題</th>
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
                    <td className="py-3 px-4 text-sm text-right">                      <button
                        onClick={() => handleEditPost(post)}
                        className="text-gray-400 hover:text-gray-300 transition-colors ml-2"
                        title="編輯文章"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleArchivePost(post)}
                        className={`text-yellow-400 hover:text-yellow-300 transition-colors ml-2 ${post.archived ? 'text-yellow-500' : ''}`}
                        title={post.archived ? '取消典藏' : '典藏文章'}
                      >
                        <FaArchive size={16} />
                      </button>
                      <button
                        onClick={() => handleSetFeaturedPost(post)}
                        className={`text-yellow-400 hover:text-yellow-300 transition-colors ml-2 ${featuredPostId === post.id ? 'text-yellow-500' : ''}`}
                        title={featuredPostId === post.id ? '取消精選' : '設為精選'}
                      >
                        <FaStar size={16} />
                      </button>
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
                  <td colSpan={4} className="py-4 px-4 text-center text-white">
                    沒有找到文章。您可以點擊上方的「新增文章」按鈕創建您的第一篇文章。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default BlogManagement;