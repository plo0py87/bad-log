import * as React from 'react';
import { doc, getDoc, updateDoc, increment, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export const usePageViews = () => {
  const [viewCount, setViewCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const trackPageView = async () => {
      try {
        // Reference to the document that stores our view count
        const viewsDocRef = doc(db, 'statistics', 'pageViews');
        
        // Check if this visit was already counted in this session
        const sessionCounted = sessionStorage.getItem('viewCounted');
        if (!sessionCounted) {
          // Increment the view count
          await updateDoc(viewsDocRef, {
            count: increment(1)
          });
          // Mark this session as counted
          sessionStorage.setItem('viewCounted', 'true');
        }

        // Get the updated count
        const docSnap = await getDoc(viewsDocRef);
        if (docSnap.exists()) {
          setViewCount(docSnap.data().count);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error updating view count:', err);
        setError('無法獲取瀏覽次數');
        setLoading(false);
      }
    };

    trackPageView();

    // Set up a listener for real-time updates
    const viewsDocRef = doc(db, 'statistics', 'pageViews');
    const unsubscribe = onSnapshot(viewsDocRef, (doc) => {
      if (doc.exists()) {
        setViewCount(doc.data().count);
      }
    }, (err) => {
      console.error('Error listening to view count:', err);
      setError('無法監聽瀏覽次數更新');
    });
    
    // Clean up the listener
    return () => unsubscribe();
  }, []);

  return { viewCount, loading, error };
};