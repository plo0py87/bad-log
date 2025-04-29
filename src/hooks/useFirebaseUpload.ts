import { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export default function useFirebaseUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const uploadFile = async (file: File, folder: string): Promise<string> => {
    if (!file) return '';
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadError(null);
      
      const storage = getStorage();
      const timestamp = new Date().getTime();
      const storageRef = ref(storage, `${folder}/${timestamp}_${file.name}`);
      
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      const downloadURL = await new Promise<string>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setUploadProgress(progress);
          },
          (error) => {
            console.error('上傳錯誤:', error);
            setUploadError('上傳檔案時發生錯誤');
            setIsUploading(false);
            reject(error);
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          }
        );
      });
      
      return downloadURL;
    } catch (err) {
      console.error('上傳過程錯誤:', err);
      setUploadError('上傳檔案時發生錯誤');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };
  
  return { uploadFile, uploadProgress, isUploading, uploadError, setUploadError };
}