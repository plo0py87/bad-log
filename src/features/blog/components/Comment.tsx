import React from 'react';
import { Comment } from '../../../services/commentService';
import { FaTrash } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { zhTW } from 'date-fns/locale';

interface CommentProps {
  comment: Comment;
  currentUserId: string | null;
  isAdmin: boolean;
  onDelete: (commentId: string) => void;
}

const CommentItem: React.FC<CommentProps> = ({ 
  comment, 
  currentUserId, 
  isAdmin, 
  onDelete 
}) => {
  // 檢查是否可以刪除 (自己的留言或管理員)
  const canDelete = isAdmin || comment.userId === currentUserId;
  
  // 格式化時間 (例如：3小時前, 5天前)
  const formattedTime = formatDistanceToNow(comment.createdAt, {
    addSuffix: true,
    locale: zhTW
  });

  return (
    <div className="border-b border-gray-800 py-4 last:border-0">
      <div className="flex items-start space-x-3">
        <img 
          src={comment.userAvatar || 'https://via.placeholder.com/40'} 
          alt={comment.userName} 
          className="w-10 h-10 rounded-full object-cover"
        />
        
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h4 className="text-white font-medium">{comment.userName}</h4>
            <span className="text-gray-400 text-sm">{formattedTime}</span>
          </div>
          
          <p className="text-gray-300 mt-1">{comment.content}</p>
        </div>
        
        {canDelete && (
          <button 
            onClick={() => onDelete(comment.id!)}
            className="text-gray-400 hover:text-red-400 transition-colors p-1"
            title="刪除留言"
          >
            <FaTrash size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentItem;