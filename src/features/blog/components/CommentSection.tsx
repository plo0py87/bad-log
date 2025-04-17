import React, { useState, useEffect } from 'react';
import { 
  getCommentsByPostId, 
  addComment, 
  deleteComment, 
  Comment 
} from '../../../services/commentService';
import CommentItem from './Comment';
import { useAuth } from '../../../context/AuthContext';
import { FaGoogle } from 'react-icons/fa';

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 修改這一行，使用 loginWithGoogle 而不是 googleSignIn
  const { currentUser, loginWithGoogle, isAdmin } = useAuth();

  // 載入留言
  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoading(true);
        const fetchedComments = await getCommentsByPostId(postId);
        setComments(fetchedComments);
        setError(null);
      } catch (err) {
        console.error('載入留言時發生錯誤:', err);
        setError('無法載入留言，請稍後再試');
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [postId]);

  // 修改這個函數，使用 loginWithGoogle
  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error('Google 登入失敗:', err);
      setError('Google 登入失敗，請稍後再試');
    }
  };

  // 處理提交留言
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('請先登入才能留言');
      return;
    }
    
    if (!newComment.trim()) {
      setError('留言內容不能為空');
      return;
    }
    
    try {
      setSubmitting(true);
      
      await addComment({
        postId,
        userId: currentUser.uid,
        userName: currentUser.displayName || '匿名用戶',
        userAvatar: currentUser.photoURL || '',
        content: newComment.trim()
      });
      
      // 重新載入留言
      const updatedComments = await getCommentsByPostId(postId);
      setComments(updatedComments);
      
      // 清空表單
      setNewComment('');
      setError(null);
    } catch (err) {
      console.error('提交留言時發生錯誤:', err);
      setError('提交留言時發生錯誤，請稍後再試');
    } finally {
      setSubmitting(false);
    }
  };

  // 處理刪除留言
  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('確定要刪除此留言嗎？此操作無法撤銷。')) {
      return;
    }
    
    try {
      const success = await deleteComment(commentId);
      
      if (success) {
        // 更新本地留言列表
        setComments(prevComments => 
          prevComments.filter(comment => comment.id !== commentId)
        );
      } else {
        setError('刪除留言時發生錯誤');
      }
    } catch (err) {
      console.error('刪除留言時發生錯誤:', err);
      setError('刪除留言時發生錯誤，請稍後再試');
    }
  };

  return (
    <div className="mt-12 border-t border-gray-800 pt-8">
      <h2 className="text-2xl font-light text-white mb-6 tracking-wider">留言區</h2>
      
      {/* 留言表單 */}
      <div className="mb-8">
        {currentUser ? (
          <form onSubmit={handleSubmitComment}>
            <div className="flex items-start space-x-3 mb-4">
              <img 
                src={currentUser.photoURL || 'https://via.placeholder.com/40'} 
                alt={currentUser.displayName || '用戶'} 
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="kuchiki-input w-full h-24"
                  placeholder="分享您的想法..."
                  disabled={submitting}
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
              </div>
              <button 
                type="submit" 
                className="kuchiki-btn"
                disabled={submitting}
              >
                {submitting ? '發布中...' : '發布留言'}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-gray-900 bg-opacity-40 p-6 rounded-sm border border-gray-800 text-center">
            <p className="text-white mb-4">請登入以參與討論</p>
            <button
              onClick={handleGoogleSignIn}
              className="kuchiki-btn flex items-center justify-center space-x-2 mx-auto"
            >
              <FaGoogle />
              <span>使用 Google 登入</span>
            </button>
          </div>
        )}
      </div>
      
      {/* 留言列表 */}
      <div>
        <h3 className="text-xl text-white mb-4 font-light">
          所有留言 ({comments.length})
        </h3>
        
        {loading ? (
          <p className="text-gray-400 text-center py-4">載入留言中...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-400 text-center py-4">還沒有留言，成為第一個留言的人吧！</p>
        ) : (
          <div className="space-y-4">
            {comments.map(comment => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={currentUser?.uid || null}
                isAdmin={isAdmin}
                onDelete={handleDeleteComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;