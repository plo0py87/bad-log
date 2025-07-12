import * as React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import useFirebaseUpload from '../../hooks/useFirebaseUpload';
import { 
  FaBold, 
  FaItalic, 
  FaHeading, 
  FaList, 
  FaListOl, 
  FaLink, 
  FaCode, 
  FaQuoteLeft, 
  FaImage,
  FaUndo,
  FaRedo,
  FaParagraph,
  FaStrikethrough,
  FaUpload
} from 'react-icons/fa';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  onError?: (error: string) => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  onChange,
  placeholder = '開始輸入內容...',
  className = '',
  onError
}) => {
  const { uploadFile, uploadProgress, isUploading, uploadError } = useFirebaseUpload();
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const editor = useEditor({
    extensions: [
      StarterKit, // 使用完整的 StarterKit，包含基本的程式碼區塊
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-gray-400 underline hover:text-gray-300',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] p-4 text-gray-100 leading-relaxed',
      },
    },
  });
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);
  const handleImageUpload = React.useCallback(async (file: File) => {
    if (!editor) return;
    
    try {
      const downloadURL = await uploadFile(file, 'content-images');
      if (downloadURL) {
        editor.chain().focus().setImage({ src: downloadURL }).run();
      }
    } catch (error) {
      console.error('圖片上傳失敗:', error);
      if (onError) {
        onError('圖片上傳失敗，請重試');
      }
    }
  }, [editor, uploadFile, onError]);

  const handleImageSelect = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      handleImageUpload(file);
    }
  }, [handleImageUpload]);
  const addImageFromFile = React.useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // 拖拽處理
  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setImageFile(file);
        handleImageUpload(file);
      }
    }
  }, [handleImageUpload]);

  const addImage = React.useCallback(() => {
    const url = window.prompt('輸入圖片 URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addLink = React.useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('輸入連結 URL:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return <div className="p-4 text-gray-400">載入編輯器中...</div>;
  }  return (    <div 
      className={`relative border border-gray-600 rounded-lg overflow-hidden bg-gray-900 ${className} ${
        isDragOver ? 'dragover border-gray-500 bg-gray-800 bg-opacity-10' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* 隱藏的文件輸入 */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
        ref={fileInputRef}
      />      {/* 拖拽提示 */}
      {isDragOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-20 border-2 border-dashed border-gray-400">
          <div className="text-gray-200 text-lg font-semibold flex items-center gap-2">
            <FaImage />
            拖放圖片到這裡上傳
          </div>
        </div>
      )}
      
      {/* 圖片上傳進度 */}
      {isUploading && (
        <div className="bg-gray-800 p-2 border-b border-gray-600">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="tiptap-upload-progress h-2 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-1">上傳中: {uploadProgress}%</p>
        </div>
      )}
      
      {/* 錯誤提示 */}
      {uploadError && (
        <div className="bg-red-900 text-red-200 p-2 border-b border-gray-600 text-sm">
          {uploadError}
        </div>
      )}

      {/* 工具列 */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-800 border-b border-gray-600">
        {/* 文字格式 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors ${
            editor.isActive('bold') ? 'bg-gray-700 text-white' : ''
          }`}
          title="粗體"
        >
          <FaBold size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors ${
            editor.isActive('italic') ? 'bg-gray-700 text-white' : ''
          }`}
          title="斜體"
        >
          <FaItalic size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors ${
            editor.isActive('strike') ? 'bg-gray-700 text-white' : ''
          }`}
          title="刪除線"
        >
          <FaStrikethrough size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors ${
            editor.isActive('code') ? 'bg-gray-700 text-white' : ''
          }`}
          title="行內程式碼"
        >
          <FaCode size={14} />
        </button>

        <div className="w-px h-6 bg-gray-600 mx-1"></div>

        {/* 段落格式 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors ${
            editor.isActive('paragraph') ? 'bg-gray-700 text-white' : ''
          }`}
          title="段落"
        >
          <FaParagraph size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'bg-gray-700 text-white' : ''
          }`}
          title="標題 1"
        >
          <FaHeading size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors text-sm ${
            editor.isActive('heading', { level: 2 }) ? 'bg-gray-700 text-white' : ''
          }`}
          title="標題 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors text-sm ${
            editor.isActive('heading', { level: 3 }) ? 'bg-gray-700 text-white' : ''
          }`}
          title="標題 3"
        >
          H3
        </button>

        <div className="w-px h-6 bg-gray-600 mx-1"></div>

        {/* 列表 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors ${
            editor.isActive('bulletList') ? 'bg-gray-700 text-white' : ''
          }`}
          title="無序列表"
        >
          <FaList size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors ${
            editor.isActive('orderedList') ? 'bg-gray-700 text-white' : ''
          }`}
          title="有序列表"
        >
          <FaListOl size={14} />
        </button>

        <div className="w-px h-6 bg-gray-600 mx-1"></div>

        {/* 引用和程式碼區塊 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors ${
            editor.isActive('blockquote') ? 'bg-gray-700 text-white' : ''
          }`}
          title="引用"
        >
          <FaQuoteLeft size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors ${
            editor.isActive('codeBlock') ? 'bg-gray-700 text-white' : ''
          }`}
          title="程式碼區塊"
        >
          &lt;/&gt;
        </button>

        <div className="w-px h-6 bg-gray-600 mx-1"></div>        {/* 連結和圖片 */}
        <button
          type="button"
          onClick={addLink}
          className={`p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors ${
            editor.isActive('link') ? 'bg-gray-700 text-white' : ''
          }`}
          title="連結"
        >
          <FaLink size={14} />
        </button>
        <button
          type="button"
          onClick={addImageFromFile}
          className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
          title="上傳圖片"
          disabled={isUploading}
        >
          <FaUpload size={14} />
        </button>
        <button
          type="button"
          onClick={addImage}
          className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
          title="插入圖片 URL"
        >
          <FaImage size={14} />
        </button>

        <div className="w-px h-6 bg-gray-600 mx-1"></div>

        {/* 撤銷/重做 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="撤銷"
        >
          <FaUndo size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="重做"
        >
          <FaRedo size={14} />
        </button>
      </div>      {/* 編輯器內容 */}
      <div className="min-h-[400px] bg-gray-900 relative">
        <EditorContent 
          editor={editor} 
          className="tiptap-editor" 
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default TiptapEditor;
