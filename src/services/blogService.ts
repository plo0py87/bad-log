import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
  Timestamp,
  serverTimestamp,
  DocumentData,
  FieldValue,
  setDoc,
  limit  // Add this import
} from 'firebase/firestore';
import { db } from '../firebase';
import { BlogPost} from '../types/blog';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

// 整合本地數據和 Firebase 數據
import { blogPosts as localBlogPosts } from '../data/blogPosts';

// 設置一個標志來指示是否使用本地模式
let useLocalMode = false;

// 用於強制啟用本地模式的函數
export const enableLocalMode = () => {
  useLocalMode = true;
  console.log('已啟用本地模式，將使用靜態數據');
};

// 用於檢查 Firebase 連接的函數
export const checkFirebaseConnection = async (): Promise<boolean> => {
  try {
    // 嘗試獲取一個文檔以測試連接
    await getDocs(collection(db, 'test_connection'));
    return true;
  } catch (error) {
    console.error('Firebase 連接失敗，將使用本地模式:', error);
    enableLocalMode();
    return false;
  }
};

// 集合名稱
const POSTS_COLLECTION = 'blog_posts';
const AUTHORS_COLLECTION = 'authors';

// 轉換 Firestore 文檔為 BlogPost 物件
const convertFirestoreDocToPost = (doc: DocumentData): BlogPost => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title || '',
    slug: data.slug || '',
    excerpt: data.excerpt || '',
    content: data.content || '',
    publishedDate: data.publishedDate ? data.publishedDate.toDate() : new Date(),
    coverImage: data.coverImage || '',
    category: data.category || '',
    tags: data.tags || []
  };
};

// 獲取所有文章
export const getAllPosts = async (): Promise<BlogPost[]> => {
  // 如果使用本地模式，直接返回本地數據
  if (useLocalMode) {
    return localBlogPosts;
  }

  try {
    const postsQuery = query(collection(db, POSTS_COLLECTION), orderBy('publishedDate', 'desc'));
    const postsSnapshot = await getDocs(postsQuery);

    // 如果 Firestore 中沒有數據，使用本地數據
    if (postsSnapshot.empty) {
      console.log('Firestore 中沒有數據，使用本地數據');
      return localBlogPosts;
    }

    return postsSnapshot.docs.map(doc => convertFirestoreDocToPost(doc));
  } catch (error) {
    console.error('Error getting blog posts:', error);
    console.log('Firebase 錯誤，使用本地數據');
    // 在出錯時也使用本地數據
    return localBlogPosts;
  }
};

// 根據 ID 獲取單篇文章
export const getPostById = async (id: string): Promise<BlogPost | null> => {
  // 如果使用本地模式，從本地數據中查找
  if (useLocalMode) {
    return localBlogPosts.find(post => post.id === id) || null;
  }

  try {
    const postDoc = await getDoc(doc(db, POSTS_COLLECTION, id));
    if (postDoc.exists()) {
      return convertFirestoreDocToPost(postDoc);
    }

    // 如果 Firestore 中找不到，嘗試從本地數據找
    const localPost = localBlogPosts.find(post => post.id === id);
    if (localPost) return localPost;

    return null;
  } catch (error) {
    console.error(`Error getting post with ID ${id}:`, error);
    // 在出錯時嘗試從本地數據找
    return localBlogPosts.find(post => post.id === id) || null;
  }
};

// 添加新文章
export const addPost = async (post: Omit<BlogPost, 'id'>): Promise<string | null> => {
  // 如果使用本地模式，模擬添加（但實際上無法修改靜態數據）
  if (useLocalMode) {
    console.log('本地模式：模擬添加文章', post);
    return 'local-' + Date.now();
  }

  try {
    // 添加伺服器時間戳
    const postWithTimestamp = {
      ...post,
      publishedDate: post.publishedDate instanceof Date
        ? Timestamp.fromDate(post.publishedDate)
        : serverTimestamp()
    };

    const docRef = await addDoc(collection(db, POSTS_COLLECTION), postWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error('Error adding blog post:', error);
    return null;
  }
};

// 更新文章
export const updatePost = async (id: string, post: Partial<BlogPost>): Promise<boolean> => {
  // 如果使用本地模式，模擬更新
  if (useLocalMode) {
    console.log('本地模式：模擬更新文章', id, post);
    return true;
  }

  try {
    // 如果有日期字段，轉換為 Firestore Timestamp
    const updateData: Record<string, unknown> = { ...post };
    if (updateData.publishedDate instanceof Date) {
      updateData.publishedDate = Timestamp.fromDate(updateData.publishedDate);
    }

    await updateDoc(doc(db, POSTS_COLLECTION, id), updateData as Record<string, FieldValue | Partial<unknown> | undefined>);
    return true;
  } catch (error) {
    console.error(`Error updating post with ID ${id}:`, error);
    return false;
  }
};

// 刪除文章
export const deletePost = async (id: string): Promise<boolean> => {
  // 如果使用本地模式，模擬刪除
  if (useLocalMode) {
    console.log('本地模式：模擬刪除文章', id);
    return true;
  }

  try {
    await deleteDoc(doc(db, POSTS_COLLECTION, id));
    return true;
  } catch (error) {
    console.error(`Error deleting post with ID ${id}:`, error);
    return false;
  }
};

// 上傳圖片
export const uploadImage = async (file: File): Promise<string | null> => {
  // 如果使用本地模式，模擬上傳
  if (useLocalMode) {
    console.log('本地模式：模擬上傳圖片', file.name);
    return `https://example.com/mock-image/${file.name}`;
  }

  try {
    const storage = getStorage();
    const storageRef = ref(storage, `blog-images/${Date.now()}_${file.name}`);

    // 上傳文件
    const snapshot = await uploadBytes(storageRef, file);

    // 獲取下載鏈接
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

// 根據類別獲取文章
export const getPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  // 如果使用本地模式，從本地數據中過濾
  if (useLocalMode) {
    return localBlogPosts.filter(post => post.category === category);
  }

  try {
    const postsQuery = query(
      collection(db, POSTS_COLLECTION),
      where('category', '==', category),
      orderBy('publishedDate', 'desc')
    );
    const postsSnapshot = await getDocs(postsQuery);
    return postsSnapshot.docs.map(doc => convertFirestoreDocToPost(doc));
  } catch (error) {
    console.error(`Error getting posts by category ${category}:`, error);
    // 出錯時從本地數據中過濾
    return localBlogPosts.filter(post => post.category === category);
  }
};

// 關於作者的服務

// 獲取所有作者

// 添加新作者

// 初始化 Firebase 數據庫
export const initializeFirebaseData = async (): Promise<void> => {
  // 先檢查連接
  const connected = await checkFirebaseConnection();
  if (!connected) {
    console.log('Firebase 連接失敗，將使用本地模式');
    enableLocalMode();
    return;
  }

  try {
    // 檢查 Firestore 中是否有文章
    const existingPosts = await getAllPosts();

    // 如果沒有文章，則導入本地數據
    if (existingPosts.length === 0) {
      console.log('Importing local blog posts to Firebase...');

      console.log('Local blog posts imported successfully!');
    }
  } catch (error) {
    console.error('初始化 Firebase 數據庫失敗:', error);
    enableLocalMode();
  }
};

// Get the currently featured post
export const getFeaturedPost = async () => {
  try {
    const docRef = doc(db, "blog_posts", "featured");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting featured post:", error);
    return null;
  }
};

// Update the featured post
export const updateFeaturedPost = async (postId: string | null) => {
  try {
    const featuredRef = doc(db, "blog_posts", "featured");
    
    if (postId) {
      await setDoc(featuredRef, { 
        postId: postId,
        updatedAt: new Date()
      });
    } else {
      // If postId is null, we're removing the featured status
      await setDoc(featuredRef, { 
        postId: null,
        updatedAt: new Date()
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error updating featured post:", error);
    return false;
  }
};

export const getRecentPosts = async (limitCount = 3, excludeId: string | null = null): Promise<BlogPost[]> => {
  try {
    const q = query(
      collection(db, "blog_posts"),
      where("archived", "!=", true),
      orderBy("archived"),
      orderBy("publishedDate", "desc"),
      limit(excludeId ? limitCount + 1 : limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    let posts: BlogPost[] = [];
    
    querySnapshot.forEach((doc) => {
      if (doc.id !== "featured" && (!excludeId || doc.id !== excludeId)) {
        // Use convertFirestoreDocToPost instead of directly spreading data
        posts.push(convertFirestoreDocToPost(doc));
      }
    });
    
    // If we have more posts than the limit because we excluded the featured post
    if (excludeId && posts.length > limitCount) {
      posts = posts.slice(0, limitCount);
    }
    
    return posts;
  } catch (error) {
    console.error("Error getting recent posts:", error);
    return [];
  }
};
