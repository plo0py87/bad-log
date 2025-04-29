import React, { useState } from 'react';
import { FaEnvelope, FaCheck, FaBan, FaTrash, FaDownload } from 'react-icons/fa';
import { NewsletterSubscriber, updateSubscriberStatus, deleteSubscriber } from '../../../services/newsletterService';

interface SubscriberManagementProps {
  subscribers: NewsletterSubscriber[];
  setSubscribers: React.Dispatch<React.SetStateAction<NewsletterSubscriber[]>>;
  isLoadingSubscribers: boolean;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const SubscriberManagement: React.FC<SubscriberManagementProps> = ({
  subscribers,
  setSubscribers,
  isLoadingSubscribers,
  setError
}) => {
  // 處理訂閱者狀態更改
  const handleToggleSubscriberStatus = async (subscriber: NewsletterSubscriber) => {
    try {
      if (!subscriber.id) return;
      
      const newStatus = !subscriber.active;
      const success = await updateSubscriberStatus(subscriber.id, newStatus);
      
      if (success) {
        // 更新本地狀態
        setSubscribers(prev => 
          prev.map(s => s.id === subscriber.id ? {...s, active: newStatus} : s)
        );
        setError(null);
      } else {
        setError('更新訂閱者狀態時發生錯誤');
      }
    } catch (err) {
      setError('更新訂閱者狀態時發生錯誤');
      console.error(err);
    }
  };

  // 處理刪除訂閱者
  const handleDeleteSubscriber = async (subscriberId: string) => {
    if (!window.confirm('確定要刪除此訂閱者嗎？此操作無法撤銷。')) {
      return;
    }
    
    try {
      const success = await deleteSubscriber(subscriberId);
      
      if (success) {
        // 從本地狀態中移除
        setSubscribers(prev => prev.filter(s => s.id !== subscriberId));
        setError(null);
      } else {
        setError('刪除訂閱者時發生錯誤');
      }
    } catch (err) {
      setError('刪除訂閱者時發生錯誤');
      console.error(err);
    }
  };

  // 導出訂閱者列表為 CSV
  const exportSubscribersToCSV = () => {
    // 只包含活躍的訂閱者
    const activeSubscribers = subscribers.filter(s => s.active);
    
    if (activeSubscribers.length === 0) {
      alert('沒有活躍的訂閱者可導出');
      return;
    }
    
    // 創建 CSV 內容
    const csvContent = [
      ['電子郵件', '訂閱日期'],
      ...activeSubscribers.map(s => [
        s.email,
        s.subscribeDate.toLocaleDateString('zh-TW')
      ])
    ]
      .map(row => row.join(','))
      .join('\n');
    
    // 創建下載連結
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `subscribers-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-light text-white tracking-wider">訂閱者管理</h2>
        <button
          onClick={exportSubscribersToCSV}
          className="kuchiki-btn flex items-center gap-2"
          disabled={isLoadingSubscribers || subscribers.length === 0}
        >
          <FaDownload size={14} />
          <span>導出 CSV</span>
        </button>
      </div>
      
      {isLoadingSubscribers ? (
        <div className="flex justify-center py-8">
          <p className="text-white opacity-70">載入訂閱者...</p>
        </div>
      ) : subscribers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-white opacity-70">目前沒有訂閱者</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-white">
            <thead className="text-xs uppercase bg-gray-900 bg-opacity-40">
              <tr>
                <th scope="col" className="px-6 py-3">電子郵件</th>
                <th scope="col" className="px-6 py-3">訂閱日期</th>
                <th scope="col" className="px-6 py-3">狀態</th>
                <th scope="col" className="px-6 py-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr 
                  key={subscriber.id} 
                  className="border-b border-gray-800 hover:bg-gray-900 hover:bg-opacity-40"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <FaEnvelope className="text-gray-400" />
                      <span>{subscriber.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {subscriber.subscribeDate.toLocaleDateString('zh-TW')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded ${
                      subscriber.active 
                        ? 'bg-green-900 bg-opacity-40 text-green-400' 
                        : 'bg-red-900 bg-opacity-40 text-red-400'
                    }`}>
                      {subscriber.active ? '活躍' : '非活躍'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleToggleSubscriberStatus(subscriber)}
                        className={`p-1 rounded hover:bg-gray-700 ${
                          subscriber.active 
                            ? 'text-red-400 hover:text-red-300' 
                            : 'text-green-400 hover:text-green-300'
                        }`}
                        title={subscriber.active ? '停用' : '啟用'}
                      >
                        {subscriber.active ? <FaBan size={16} /> : <FaCheck size={16} />}
                      </button>
                      <button
                        onClick={() => handleDeleteSubscriber(subscriber.id!)}
                        className="p-1 rounded hover:bg-gray-700 text-red-400 hover:text-red-300"
                        title="刪除"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubscriberManagement;