import { addDoc, collection, query, where, getDocs, doc, updateDoc, deleteDoc, getDoc, documentId } from 'firebase/firestore';
import { db } from '../firebase';

// 訂閱者類型
export interface NewsletterSubscriber {
  id?: string;  // 添加可選的 ID 字段
  email: string;
  subscribeDate: Date;
  active: boolean;
}

// 訂閱通訊
export const subscribeToNewsletter = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    // 檢查該郵箱是否已訂閱
    const subscribersRef = collection(db, 'subscribers');
    const q = query(subscribersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // 已訂閱的情況
      const subscriber = querySnapshot.docs[0].data() as NewsletterSubscriber;
      
      // 如果已訂閱且活躍，返回已訂閱消息
      if (subscriber.active) {
        return { success: false, message: '此郵箱已訂閱我們的通訊' };
      }
      
      // TODO: 可以在這裡添加重新激活邏輯
      return { success: false, message: '此郵箱已在我們的列表中，但未激活' };
    }
    
    // 添加新訂閱者
    await addDoc(collection(db, 'subscribers'), {
      email,
      subscribeDate: new Date(),
      active: true
    });
    
    return { success: true, message: '感謝您的訂閱！' };
  } catch (error) {
    console.error('訂閱時發生錯誤:', error);
    return { success: false, message: '訂閱時發生錯誤，請稍後再試' };
  }
};

// 獲取所有訂閱者
export const getAllSubscribers = async (): Promise<NewsletterSubscriber[]> => {
  try {
    const subscribersRef = collection(db, 'subscribers');
    const querySnapshot = await getDocs(subscribersRef);
    
    const subscribers: NewsletterSubscriber[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      subscribers.push({
        id: doc.id,  // 添加文檔 ID
        email: data.email,
        subscribeDate: data.subscribeDate.toDate(),
        active: data.active
      });
    });
    
    return subscribers;
  } catch (error) {
    console.error('獲取訂閱者列表時發生錯誤:', error);
    throw error;
  }
};

// 更改訂閱者狀態
export const updateSubscriberStatus = async (subscriberId: string, active: boolean): Promise<boolean> => {
  try {
    const subscriberRef = doc(db, 'subscribers', subscriberId);
    await updateDoc(subscriberRef, { active });
    return true;
  } catch (error) {
    console.error('更新訂閱者狀態時發生錯誤:', error);
    return false;
  }
};

// 刪除訂閱者
export const deleteSubscriber = async (subscriberId: string): Promise<boolean> => {
  try {
    const subscriberRef = doc(db, 'subscribers', subscriberId);
    await deleteDoc(subscriberRef);
    return true;
  } catch (error) {
    console.error('刪除訂閱者時發生錯誤:', error);
    return false;
  }
};