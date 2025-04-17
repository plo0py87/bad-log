import { 
  addDoc, 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  deleteDoc, 
  doc, 
  where, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';

// 留言類型定義
export interface Comment {
  id?: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: Date;
}

// 新增留言
export const addComment = async (comment: Omit<Comment, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const commentRef = await addDoc(collection(db, 'comments'), {
      ...comment,
      createdAt: serverTimestamp()
    });
    
    return commentRef.id;
  } catch (error) {
    console.error('新增留言時發生錯誤:', error);
    throw error;
  }
};

// 獲取文章的所有留言
export const getCommentsByPostId = async (postId: string): Promise<Comment[]> => {
  try {
    const q = query(
      collection(db, 'comments'), 
      where('postId', '==', postId),
      orderBy('createdAt', 'asc')
    );
    
    const snapshot = await getDocs(q);
    const comments: Comment[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      comments.push({
        id: doc.id,
        postId: data.postId,
        userId: data.userId,
        userName: data.userName,
        userAvatar: data.userAvatar,
        content: data.content,
        createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date()
      });
    });
    
    return comments;
  } catch (error) {
    console.error('獲取留言時發生錯誤:', error);
    throw error;
  }
};

// 刪除留言 (只有留言作者和管理員可以刪除)
export const deleteComment = async (commentId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'comments', commentId));
    return true;
  } catch (error) {
    console.error('刪除留言時發生錯誤:', error);
    return false;
  }
};