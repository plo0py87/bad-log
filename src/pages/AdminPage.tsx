import { useState, useEffect, useRef } from 'react';
import { 
  addPost, 
  getAllPosts, 
  deletePost, 
  updatePost, 
  initializeFirebaseData,
  getFeaturedPost,
  updateFeaturedPost
} from '../services/blogService';
// Add gallery service imports
import { addGalleryItem, getAllGalleryItems, deleteGalleryItem, updateGalleryItem } from '../services/galleryService';
import { BlogPost } from '../types/blog';
// Add GalleryItem type
import { GalleryItem } from '../types/gallery';
// Add FaImages icon
import { FaLeaf, FaPlus, FaTrash, FaEdit, FaUpload, FaArchive, FaStar, FaImages } from 'react-icons/fa';
import { marked } from 'marked';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../context/AuthContext';

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
    tags: [],
    coverImage: ''
  });

  // 標籤輸入
  const [tagInput, setTagInput] = useState('');

  // 新增圖片上傳狀態
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Add a state to track the currently edited post
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);

  // Add a state to track the featured post
  const [featuredPostId, setFeaturedPostId] = useState<string | null>(null);

  // Add this near your other state declarations
  const { logout, currentUser } = useAuth();

  // Add a logout handler
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  // Add state for managing active section
  const [activeSection, setActiveSection] = useState<'blog' | 'gallery'>('blog');
  
  // Add state for gallery items
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [isEditingGallery, setIsEditingGallery] = useState(false);
  const [currentGalleryId, setCurrentGalleryId] = useState<string | null>(null);
  
  // Gallery form state
  const [galleryForm, setGalleryForm] = useState<Omit<GalleryItem, 'id'>>({
    title: '',
    description: '',
    imageUrl: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    url: '', // Add URL field
  });

  // 添加一個 ref 來引用文本區域
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  
  // 添加一個狀態來追踪當前正在上傳的是哪種類型的圖片
  const [imageUploadType, setImageUploadType] = useState<'cover' | 'content' | 'gallery'>('cover');

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

  // 處理表單輸入變更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  // Modify the handleSubmit function to include archived field
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
          setFormData({
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            publishedDate: new Date(),
            category: '',
            tags: [],
            coverImage: ''
          });
          
          setIsAddingPost(false);
          setIsEditing(false);
          setCurrentPostId(null);
          setActiveStep(1);
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
          // Refresh posts list
          const updatedPosts = await getAllPosts();
          setPosts(updatedPosts);

          // Reset form
          setFormData({
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            publishedDate: new Date(),
            category: '',
            tags: [],
            coverImage: ''
          });

          setIsAddingPost(false);
          setActiveStep(1);
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

  // Add a function to handle edit button click
  const handleEditPost = (post: BlogPost) => {
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content || '',
      publishedDate: post.publishedDate,
      category: post.category || '',
      tags: post.tags || [],
      coverImage: post.coverImage || ''
    });
    setCurrentPostId(post.id);
    setIsEditing(true);
    setIsAddingPost(true);
    setActiveStep(1);
    setPreviewMode(false);
  };

  // Add archive toggle function
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
        setError(`${post.archived ? '取消典藏' : '典藏'}文章時發生錯誤`);
      }
    } catch (err) {
      setError(`${post.archived ? '取消典藏' : '典藏'}文章時發生錯誤`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add a handler for the featured post functionality
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

  // Add this function to handle cancel with confirmation
  const handleCancel = () => {
    // Only show confirmation if editing (not for new posts) and form has content
    const hasContent = formData.title || formData.content || formData.excerpt;
    
    if (isEditing && hasContent) {
      if (window.confirm('確定要取消編輯嗎？所有未儲存的變更將會遺失。')) {
        // Reset form
        setFormData({
          title: '',
          slug: '',
          excerpt: '',
          content: '',
          publishedDate: new Date(),
          category: '',
          tags: [],
          coverImage: ''
        });
        setIsAddingPost(false);
        setIsEditing(false);
        setCurrentPostId(null);
        setActiveStep(1);
        setPreviewMode(false);
      }
    } else {
      // For new posts or empty forms, just cancel without confirmation
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        publishedDate: new Date(),
        category: '',
        tags: [],
        coverImage: ''
      });
      setIsAddingPost(false);
      setIsEditing(false);
      setCurrentPostId(null);
      setActiveStep(1);
      setPreviewMode(false);
    }
  };

  // 處理圖片選擇
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // 根據當前操作的部分設置上傳類型
      if (activeSection === 'gallery' && isAddingGallery) {
        setImageUploadType('gallery');
      } else {
        setImageUploadType('cover');
      }
      
      // 生成預覽
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 上傳圖片到 Firebase Storage
  const handleImageUpload = async () => {
    if (!imageFile) return;
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      const storage = getStorage();
      const timestamp = new Date().getTime();
      const folder = imageUploadType === 'gallery' ? 'gallery-images' : 'blog-images';
      const storageRef = ref(storage, `${folder}/${timestamp}_${imageFile.name}`);
      
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      
      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // 更新上傳進度
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setUploadProgress(progress);
          },
          (error) => {
            console.error('上傳錯誤:', error);
            setError('上傳圖片時發生錯誤');
            setIsUploading(false);
            reject(error);
          },
          async () => {
            // 上傳完成，獲取下載 URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            if (imageUploadType === 'gallery') {
              setGalleryForm(prev => ({
                ...prev,
                imageUrl: downloadURL
              }));
            } else {
              setFormData(prev => ({
                ...prev,
                coverImage: downloadURL
              }));
            }
            
            setIsUploading(false);
            resolve();
          }
        );
      });
    } catch (err) {
      console.error('上傳過程錯誤:', err);
      setError('上傳圖片時發生錯誤');
      setIsUploading(false);
    }
  };

  // 處理在內容中插入圖片
  const handleContentImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImageUploadType('content');
      
      // 上傳圖片
      uploadContentImage(file);
    }
  };

  // 上傳內容圖片到 Firebase Storage 並插入 Markdown
  const uploadContentImage = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      const storage = getStorage();
      const timestamp = new Date().getTime();
      const storageRef = ref(storage, `content-images/${timestamp}_${file.name}`);
      
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // 更新上傳進度
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setUploadProgress(progress);
          },
          (error) => {
            console.error('上傳錯誤:', error);
            setError('上傳圖片時發生錯誤');
            setIsUploading(false);
            reject(error);
          },
          async () => {
            // 上傳完成，獲取下載 URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            // 在文本區域插入 Markdown 圖片語法
            insertImageMarkdown(downloadURL, file.name);
            
            setIsUploading(false);
            resolve();
          }
        );
      });
    } catch (err) {
      console.error('上傳過程錯誤:', err);
      setError('上傳圖片時發生錯誤');
      setIsUploading(false);
    }
  };

  // 在文本內容的光標位置插入 Markdown 圖片語法
  const insertImageMarkdown = (imageUrl: string, fileName: string) => {
    if (!contentTextareaRef.current) return;
    
    const textarea = contentTextareaRef.current;
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const markdownImage = `![${fileName}](${imageUrl})`;
    
    // 獲取當前內容並在光標位置插入圖片 Markdown
    const content = textarea.value;
    const newContent = content.substring(0, start) + markdownImage + content.substring(end);
    
    // 更新表單內容
    setFormData(prev => ({
      ...prev,
      content: newContent
    }));
    
    // 重新設置光標位置到插入的內容之後
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + markdownImage.length, start + markdownImage.length);
    }, 0);
  };

  // Handle gallery form input changes
  const handleGalleryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGalleryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle gallery image upload
  const handleGalleryImageUpload = async () => {
    setImageUploadType('gallery');
    await handleImageUpload();
  };

  // Handle gallery submission
  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (isEditingGallery && currentGalleryId) {
        // Update existing gallery item
        const success = await updateGalleryItem(currentGalleryId, galleryForm);
        
        if (success) {
          setGalleryItems(prevItems => 
            prevItems.map(item => item.id === currentGalleryId ? { ...item, ...galleryForm } : item)
          );
          
          resetGalleryForm();
          setError(null);
        } else {
          setError('更新圖片時發生錯誤');
        }
      } else {
        // Add new gallery item
        const itemId = await addGalleryItem(galleryForm);
        
        if (itemId) {
          const newItem = { id: itemId, ...galleryForm };
          setGalleryItems(prev => [...prev, newItem]);
          
          resetGalleryForm();
          setError(null);
        } else {
          setError('添加圖片時發生錯誤');
        }
      }
    } catch (err) {
      console.error('Gallery submission error:', err);
      setError('提交表單時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  // Reset gallery form
  const resetGalleryForm = () => {
    setGalleryForm({
      title: '',
      description: '',
      imageUrl: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      url: '', // Include URL in reset
    });
    setIsAddingGallery(false);
    setIsEditingGallery(false);
    setCurrentGalleryId(null);
    setImageFile(null);
    setImagePreview(null);
  };

  // Handle edit gallery item
  const handleEditGallery = (item: GalleryItem) => {
    console.log('Editing gallery item:', item); // Debug log
    setGalleryForm({
      title: item.title || '',
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      category: item.category || '',
      date: item.date || new Date().toISOString().split('T')[0],
      url: item.url || '' // Ensure URL is explicitly set with fallback
    });
    setCurrentGalleryId(item.id);
    setIsEditingGallery(true);
    setIsAddingGallery(true);
  };

  // Handle delete gallery item
  const handleDeleteGallery = async (id: string) => {
    if (window.confirm('確定要刪除這個圖片項目嗎？此操作無法撤銷。')) {
      try {
        setLoading(true);
        const success = await deleteGalleryItem(id);
        
        if (success) {
          setGalleryItems(prev => prev.filter(item => item.id !== id));
          setError(null);
        } else {
          setError('刪除圖片時發生錯誤');
        }
      } catch (err) {
        console.error('Delete gallery error:', err);
        setError('刪除圖片時發生錯誤');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle gallery cancel
  const handleGalleryCancel = () => {
    const hasContent = galleryForm.title || galleryForm.description;
    
    if (isEditingGallery && hasContent) {
      if (window.confirm('確定要取消編輯嗎？所有未儲存的變更將會遺失。')) {
        resetGalleryForm();
      }
    } else {
      resetGalleryForm();
    }
  };

  // 渲染步驟 1：基本信息
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
        <div className="flex space-x-2">
          {/* 添加插入圖片按鈕 */}
          {!previewMode && (
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleContentImageSelect}
                className="hidden"
                id="content-image-upload"
              />
              <label 
                htmlFor="content-image-upload"
                className="kuchiki-btn cursor-pointer flex items-center gap-2"
              >
                <FaUpload size={14} />
                <span>插入圖片</span>
              </label>
            </div>
          )}
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="text-sm underline text-white opacity-80 hover:opacity-100"
          >
            {previewMode ? '返回編輯' : '預覽'}
          </button>
        </div>
      </div>

      {/* 顯示內容圖片上傳進度 */}
      {isUploading && imageUploadType === 'content' && (
        <div className="w-full bg-gray-700 mb-2">
          <div 
            className="bg-green-600 h-2" 
            style={{ width: `${uploadProgress}%` }}
          ></div>
          <p className="text-xs text-white mt-1">上傳中: {uploadProgress}%</p>
        </div>
      )}

      {previewMode ? (
        <div
          className="prose prose-invert max-w-none p-6 bg-gray-900 bg-opacity-40 border border-gray-800 min-h-[400px]"
          dangerouslySetInnerHTML={{ __html: marked(formData.content || '') }}
        />
      ) : (
        <textarea
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          className="kuchiki-input w-full"
          rows={15}
          required
          ref={contentTextareaRef}
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

  // Render Gallery Form
  const renderGalleryForm = () => (
    <div className="mb-12 bg-gray-900 bg-opacity-40 p-8 border border-gray-800">
      <h2 className="text-2xl font-light text-white mb-6 tracking-wider">
        {isEditingGallery ? '編輯圖片' : '新增圖片'}
      </h2>
      
      <form onSubmit={handleGallerySubmit} className="space-y-6">
        <div>
          <label htmlFor="gallery-title" className="block text-sm font-light text-white mb-1 tracking-wider">
            標題
          </label>
          <input
            type="text"
            id="gallery-title"
            name="title"
            value={galleryForm.title}
            onChange={handleGalleryInputChange}
            className="kuchiki-input w-full"
            required
          />
        </div>
        
        <div>
          <label htmlFor="gallery-description" className="block text-sm font-light text-white mb-1 tracking-wider">
            描述
          </label>
          <textarea
            id="gallery-description"
            name="description"
            value={galleryForm.description}
            onChange={handleGalleryInputChange}
            className="kuchiki-input w-full"
            rows={3}
            required
          />
        </div>
        
        <div>
          <label htmlFor="gallery-category" className="block text-sm font-light text-white mb-1 tracking-wider">
            類別
          </label>
          <input
            type="text"
            id="gallery-category"
            name="category"
            value={galleryForm.category}
            onChange={handleGalleryInputChange}
            className="kuchiki-input w-full"
            required
          />
        </div>
        
        <div>
          <label htmlFor="gallery-date" className="block text-sm font-light text-white mb-1 tracking-wider">
            日期
          </label>
          <input
            type="date"
            id="gallery-date"
            name="date"
            value={galleryForm.date}
            onChange={handleGalleryInputChange}
            className="kuchiki-input w-full"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-light text-white mb-1 tracking-wider">
            圖片 {isEditingGallery && galleryForm.imageUrl && "(已有上傳圖片)"}
          </label>
          
          {isEditingGallery && galleryForm.imageUrl && (
            <div className="p-3 bg-gray-800 bg-opacity-50 border border-gray-700 mb-3">
              <p className="text-sm text-white mb-2">當前圖片:</p>
              <img 
                src={galleryForm.imageUrl} 
                alt="當前圖片" 
                className="max-h-40 border border-gray-700 mb-2"
              />
              <p className="text-xs text-white opacity-70 break-all mb-2">{galleryForm.imageUrl}</p>
              <button
                type="button"
                onClick={() => setGalleryForm(prev => ({ ...prev, imageUrl: '' }))}
                className="text-red-400 hover:text-red-300 text-xs underline"
              >
                移除現有圖片
              </button>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              id="gallery-image-upload"
            />
            <label 
              htmlFor="gallery-image-upload"
              className="kuchiki-btn cursor-pointer flex items-center gap-2"
            >
              <FaUpload size={14} />
              <span>{isEditingGallery ? '更換圖片' : '選擇圖片'}</span>
            </label>
            
            {imageFile && !isUploading && (
              <button
                type="button"
                onClick={handleGalleryImageUpload}
                className="kuchiki-btn"
                disabled={isUploading}
              >
                上傳到 Firebase
              </button>
            )}
          </div>
          
          {isUploading && (
            <div className="w-full bg-gray-700 mt-2">
              <div 
                className="bg-green-600 h-2" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <p className="text-xs text-white mt-1">上傳中: {uploadProgress}%</p>
            </div>
          )}
          
          {imagePreview && !galleryForm.imageUrl && (
            <div className="mt-2">
              <p className="text-sm text-white mb-1">新圖片預覽:</p>
              <img 
                src={imagePreview} 
                alt="圖片預覽" 
                className="max-h-40 border border-gray-700"
              />
            </div>
          )}
          
          <div className="mt-2">
            <p className="text-sm text-white opacity-70 mb-1">或輸入圖片 URL:</p>
            <input
              type="text"
              name="imageUrl"
              value={galleryForm.imageUrl}
              onChange={handleGalleryInputChange}
              className="kuchiki-input w-full"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="gallery-url" className="block text-sm font-light text-white mb-1 tracking-wider">
            作品連結 URL (選填)
          </label>
          <input
            type="url"
            id="gallery-url"
            name="url"
            value={galleryForm.url}
            onChange={handleGalleryInputChange}
            className="kuchiki-input w-full"
            placeholder="https://example.com/my-project"
          />
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleGalleryCancel}
            className="kuchiki-btn bg-red-900 hover:bg-red-800"
          >
            取消
          </button>
          <button
            type="submit"
            className="kuchiki-btn"
          >
            {isEditingGallery ? '更新圖片' : '新增圖片'}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="bg-black text-white min-h-screen kuchiki-overlay py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <FaLeaf className="inline-block mb-4 text-3xl opacity-60 text-white" />
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-6"></div>
          <h1 className="text-4xl font-light tracking-wider text-white sm:text-5xl lg:text-6xl kuchiki-title">後台管理</h1>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mt-6 mb-6"></div>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-white font-light">
            添加、編輯和管理您的內容
          </p>
        </div>

        {error && (
          <div className="bg-red-900 bg-opacity-30 border border-red-800 p-4 mb-6 text-white">
            {error}
          </div>
        )}

        {/* Section tabs */}
        <div className="mb-8 border-b border-gray-800">
          <div className="flex space-x-8">
            <button 
              className={`py-3 px-4 text-lg font-light tracking-wider transition-colors ${
                activeSection === 'blog' ? 'border-b-2 border-white text-white' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveSection('blog')}
            >
              文章管理
            </button>
            <button 
              className={`py-3 px-4 text-lg font-light tracking-wider transition-colors ${
                activeSection === 'gallery' ? 'border-b-2 border-white text-white' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveSection('gallery')}
            >
              作品管理
            </button>
          </div>
        </div>

        {loading && !isAddingPost && !isAddingGallery ? (
          <div className="flex justify-center items-center h-40">
            <div className="text-white">載入中...</div>
          </div>
        ) : (
          <>
            {/* Blog section */}
            {activeSection === 'blog' && (
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
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-light text-white tracking-wider">文章列表</h2>
                    <div className="flex items-center">
                      {currentUser && (
                        <div className="flex items-center mr-4">
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
                      <button 
                        onClick={handleLogout}
                        className="kuchiki-btn"
                      >
                        登出
                      </button>
                    </div>
                  </div>

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
                              <td className="py-3 px-4 text-sm text-right">
                                <button
                                  onClick={() => handleEditPost(post)}
                                  className="text-blue-400 hover:text-blue-300 transition-colors ml-2"
                                  title="編輯文章"
                                >
                                  <FaEdit size={16} />
                                </button>
                                <button
                                  onClick={() => handleArchivePost(post)}
                                  className="text-yellow-400 hover:text-yellow-300 transition-colors ml-2"
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

            {/* Gallery section */}
            {activeSection === 'gallery' && (
              <>
                {/* Gallery action buttons */}
                <div className="mb-8 flex justify-end">
                  <button
                    onClick={isAddingGallery ? handleGalleryCancel : () => setIsAddingGallery(true)}
                    className="kuchiki-btn flex items-center gap-2"
                  >
                    {isAddingGallery ? (
                      '取消'
                    ) : (
                      <>
                        <FaPlus size={14} />
                        <span>新增作品</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Gallery form */}
                {isAddingGallery && renderGalleryForm()}

                {/* Gallery items list */}
                <div className="mb-8">
                  <h2 className="text-2xl font-light text-white tracking-wider mb-8">作品列表</h2>
                  
                  {galleryItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {galleryItems.map(item => (
                        <div 
                          key={item.id} 
                          className="bg-gray-900 bg-opacity-40 border border-gray-800 overflow-hidden"
                        >
                          <div className="aspect-w-16 aspect-h-9 relative">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-opacity flex items-center justify-center gap-4 opacity-0 hover:opacity-100">
                              <button
                                onClick={() => handleEditGallery(item)}
                                className="p-2 bg-blue-900 text-white rounded-full"
                              >
                                <FaEdit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteGallery(item.id)}
                                className="p-2 bg-red-900 text-white rounded-full"
                              >
                                <FaTrash size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="text-lg font-light text-white">{item.title}</h3>
                            <p className="text-sm text-white opacity-70 mt-1 whitespace-pre-line">{item.description}</p>
                            <div className="flex justify-between items-center mt-3">
                              <span className="text-xs text-white opacity-60">{item.date}</span>
                              <span className="text-xs bg-gray-800 px-2 py-1 text-white opacity-80">
                                {item.category}
                              </span>
                            </div>
                            {item.url && (
                              <div className="mt-2 text-xs text-white opacity-60">
                                <span>作品連結: </span>
                                <a 
                                  href={item.url} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="underline hover:text-blue-400"
                                >
                                  {item.url.length > 30 ? item.url.slice(0, 30) + '...' : item.url}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-gray-800 bg-gray-900 bg-opacity-40">
                      <FaImages size={48} className="mx-auto text-white opacity-30 mb-4" />
                      <p className="text-white">尚無圖片。點擊「新增圖片」按鈕來添加。</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
