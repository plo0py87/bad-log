// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// 如果沒有提供 API 密鑰，使用假的配置以避免初始化錯誤
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || 'fake-api-key-for-local-dev';

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "bad-log.firebaseapp.com",
  projectId: "bad-log",
  storageBucket: "bad-log.firebasestorage.app",
  messagingSenderId: "1011463458083",
  appId: "1:1011463458083:web:8cab4a49a7ebfecaa11096",
  measurementId: "G-E3QY5F3TQJ"
};

let app: any = null;
let db: any = null;
let auth: any = null;

try {
  // 嘗試初始化 Firebase
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  
  // 如果使用假的 API 密鑰，輸出警告
  if (apiKey === 'fake-api-key-for-local-dev') {
    console.warn('使用本地開發模式 - Firebase 功能將被禁用');
  }
} catch (error) {
  console.error('Firebase 初始化失敗，應用將在本地模式下運行:', error);
  // 創建空的模擬對象以避免錯誤
  db = null;
  auth = null;
}

// 導出 Firestore 數據庫實例
export { db };

// 導出認證實例
export { auth };

export default app;
