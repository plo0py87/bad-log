import React, { useState } from 'react';
import { FaPlus, FaEdit, FaUpload, FaTrash, FaImages, FaExclamationTriangle } from 'react-icons/fa';
import { GalleryItem } from '../../../types/gallery';
import { addGalleryItem, updateGalleryItem, deleteGalleryItem } from '../../../services/galleryService';
import useFirebaseUpload from '../../../hooks/useFirebaseUpload';

interface GalleryManagementProps {
  galleryItems: GalleryItem[];
  setGalleryItems: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const GalleryManagement: React.FC<GalleryManagementProps> = ({ 
  galleryItems, 
  setGalleryItems, 
  setError 
}) => {
  // Gallery form state
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [isEditingGallery, setIsEditingGallery] = useState(false);
  const [currentGalleryId, setCurrentGalleryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Image upload state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Custom hook for Firebase uploads
  const { 
    uploadFile, 
    uploadProgress, 
    isUploading,
    uploadError
  } = useFirebaseUpload();

  // Gallery form state
  const [galleryForm, setGalleryForm] = useState<Omit<GalleryItem, 'id'>>({
    title: '',
    description: '',
    imageUrl: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    url: '',
  });

  // Handle gallery form input changes
  const handleGalleryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGalleryForm(prev => ({
      ...prev,
      [name]: value
    }));
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

  // Handle gallery image upload
  const handleGalleryImageUpload = async () => {
    if (!imageFile) {
      setFormError('請先選擇一個圖片檔案');
      return;
    }
    
    try {
      setFormError(null); // Clear any previous errors
      const downloadURL = await uploadFile(imageFile, 'gallery-images');
      
      if (downloadURL) {
        setGalleryForm(prev => ({
          ...prev,
          imageUrl: downloadURL
        }));
      } else {
        setFormError('上傳圖片失敗，請重試');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      setFormError('上傳圖片時發生錯誤');
      setError('上傳圖片時發生錯誤');
    }
  };

  // Handle gallery submission
  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    if (!galleryForm.title.trim()) {
      setFormError('請輸入圖片標題');
      return;
    }
    
    if (!galleryForm.description.trim()) {
      setFormError('請輸入圖片描述');
      return;
    }
    
    if (!galleryForm.category.trim()) {
      setFormError('請輸入圖片類別');
      return;
    }
    
    if (!galleryForm.imageUrl.trim()) {
      setFormError('請上傳圖片或提供圖片網址');
      return;
    }
    
    try {
      setLoading(true);
      setFormError(null);
      
      if (isEditingGallery && currentGalleryId) {
        // Update existing gallery item
        const success = await updateGalleryItem(currentGalleryId, galleryForm);
        
        if (success) {
          setGalleryItems(prevItems => 
            prevItems.map(item => item.id === currentGalleryId ? 
              { ...item, ...galleryForm } : item
            )
          );
          
          resetGalleryForm();
          setError(null);
        } else {
          setFormError('更新圖片時發生錯誤，請重試');
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
          setFormError('添加圖片時發生錯誤，請重試');
          setError('添加圖片時發生錯誤');
        }
      }
    } catch (err) {
      console.error('Gallery submission error:', err);
      setFormError('提交表單時發生錯誤，請檢查網絡連接後重試');
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
      url: '',
    });
    setIsAddingGallery(false);
    setIsEditingGallery(false);
    setCurrentGalleryId(null);
    setImageFile(null);
    setImagePreview(null);
    setFormError(null); // Clear form errors when resetting
  };

  // Handle edit gallery item
  const handleEditGallery = (item: GalleryItem) => {
    setGalleryForm({
      title: item.title || '',
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      category: item.category || '',
      date: item.date || new Date().toISOString().split('T')[0],
      url: item.url || ''
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

  // Render gallery form
  const renderGalleryForm = () => (
    <div className="mb-12 bg-gray-900 bg-opacity-40 p-8 border border-gray-800">
      <h2 className="text-2xl font-light text-white mb-6 tracking-wider">
        {isEditingGallery ? '編輯圖片' : '新增圖片'}
      </h2>
      
      {formError && (
        <div className="bg-red-900 bg-opacity-30 border border-red-700 text-red-300 p-3 rounded mb-6 flex items-center">
          <FaExclamationTriangle className="mr-2 flex-shrink-0" />
          <span>{formError}</span>
        </div>
      )}
      
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
          
          {uploadError && !formError && (
            <div className="mt-2 text-xs text-red-400">
              <p>圖片上傳錯誤: {uploadError}</p>
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
            disabled={loading || isUploading}
          >
            取消
          </button>
          <button
            type="submit"
            className="kuchiki-btn"
            disabled={loading || isUploading}
          >
            {loading ? '處理中...' : isEditingGallery ? '更新圖片' : '新增圖片'}
          </button>
        </div>
      </form>
    </div>
  );

  return (
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
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-opacity flex items-center justify-center gap-4 opacity-0 hover:opacity-100">                    <button
                      onClick={() => handleEditGallery(item)}
                      className="p-2 bg-gray-800 text-white rounded-full"
                      title="編輯"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteGallery(item.id)}
                      className="p-2 bg-red-900 text-white rounded-full"
                      title="刪除"
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
                        className="underline hover:text-gray-300"
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
  );
};

export default GalleryManagement;