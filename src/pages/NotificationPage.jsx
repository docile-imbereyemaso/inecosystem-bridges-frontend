import React, { useState, useEffect } from 'react';
import { FaBell, FaSearch, FaFilter, FaTimes, FaCheckCircle, FaRegCircle, FaUser, FaGlobeAmericas, FaSpinner } from 'react-icons/fa';
import { API_URL } from '../lib/API';
import { useLocation } from 'react-router';
// Custom hook for managing notifications
const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // This would be your actual API endpoint
      const response = await fetch(`${API_URL}notifications`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token_ineco')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mark a notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.notification_id === notificationId 
            ? { ...notification, is_read: true } 
            : notification
        )
      );
      setUnreadCount(prev => prev - 1);
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, [location]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchNotifications
  };
};

// Notification Bell Component for the header
const NotificationBell = () => {
  const { unreadCount, loading } = useNotifications();
  
  return (
    <div className="relative">
      <FaBell className="text-xl text-gray-700" />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
      
      {loading && (
        <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          .
        </span>
      )}
    </div>
  );
};

// Main Notification Page Component
const NotificationPage = () => {
  const { notifications, unreadCount, loading, error, markAsRead, markAllAsRead } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Filter notifications based on search term and filter type
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || notification.recipient_type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">Error loading notifications</h3>
          <p className="text-red-600 mt-1">{error}</p>
          <button 
            className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <FaBell className="mr-2 text-blue-500" />
          Notifications
          {unreadCount > 0 && (
            <span className="ml-3 bg-blue-500 text-white text-sm rounded-full px-2 py-1">
              {unreadCount} unread
            </span>
          )}
        </h1>
        <div>
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors disabled:opacity-50"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark all as read
          </button>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 text-gray-600
             rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setSearchTerm('')}
            >
              <FaTimes className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 rounded-full text-sm flex items-center ${
              filterType === 'all' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setFilterType('all')}
          >
            <FaFilter className="mr-1" size={12} />
            All
          </button>
          <button 
            className={`px-3 py-1 rounded-full text-sm flex items-center ${
              filterType === 'user' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setFilterType('user')}
          >
            <FaUser className="mr-1" size={12} />
            Personal
          </button>
          <button 
            className={`px-3 py-1 rounded-full text-sm flex items-center ${
              filterType === 'general' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setFilterType('general')}
          >
            <FaGlobeAmericas className="mr-1" size={12} />
            General
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="animate-spin text-blue-500 text-2xl mr-2" />
          <span className="text-gray-500">Loading notifications...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <FaBell className="mx-auto text-gray-300 text-4xl mb-3" />
              <h3 className="text-lg font-medium text-gray-500">
                {notifications.length === 0 ? 'No notifications yet' : 'No notifications found'}
              </h3>
              <p className="text-gray-400">
                {notifications.length === 0 
                  ? 'Notifications will appear here when you have new updates' 
                  : 'Try adjusting your search or filter criteria'}
              </p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div 
                key={notification.notification_id} 
                className={`p-4 rounded-lg border ${
                  notification.is_read 
                    ? 'bg-white border-gray-200' 
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-medium ${notification.is_read ? 'text-gray-800' : 'text-gray-900'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {notification.message}
                    </p>
                    <div className="flex space-x-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        notification.recipient_type === 'user' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {notification.recipient_type === 'user' ? 'Personal' : 'General'}
                      </span>
                      {notification.data && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {notification.data.type}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="pl-4">
                    {!notification.is_read ? (
                      <button 
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => markAsRead(notification.notification_id)}
                        title="Mark as read"
                      >
                        <FaRegCircle />
                      </button>
                    ) : (
                      <FaCheckCircle className="text-green-500" title="Read" />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export { useNotifications, NotificationBell, NotificationPage };