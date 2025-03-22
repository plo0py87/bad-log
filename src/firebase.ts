// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// TODO: 使用您從 Firebase 控制台獲取的自己的配置替換這些值
// 步驟：
// 1. 前往 https://console.firebase.google.com/
// 2. 創建一個新專案
// 3. 註冊一個 Web 應用
// 4. 複製配置對象並替換下方的值
const firebaseConfig = {
  apiKey: "AIzaSyBbxrZWGUfnS1y9veXPoiWc9Tzr0gWIRb8",
  authDomain: "bad-log.firebaseapp.com",
  projectId: "bad-log",
  storageBucket: "bad-log.firebasestorage.app",
  messagingSenderId: "1011463458083",
  appId: "1:1011463458083:web:8cab4a49a7ebfecaa11096",
  measurementId: "G-E3QY5F3TQJ"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 導出 Firestore 數據庫實例
export const db = getFirestore(app);

// 導出認證實例
export const auth = getAuth(app);

export default app;
