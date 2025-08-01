"use client";
import React, { useState } from 'react';
import { Bell, X, Eye, Clock } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { formatUTCDateTime } from '../utils/dateUtils';

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, removeNotification, clearAllNotifications } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new':
        return <span className="text-green-500">🆕</span>;
      case 'update':
        return <span className="text-blue-500">📝</span>;
      case 'delete':
        return <span className="text-red-500">🗑️</span>;
      default:
        return <span className="text-gray-500">📢</span>;
    }
  };

  const getNotificationMessage = (notification: any) => {
    switch (notification.type) {
      case 'new':
        return `New reservation from ${notification.data.guestName}`;
      case 'update':
        return `Reservation updated for ${notification.data.guestName}`;
      case 'delete':
        return `Reservation cancelled for ${notification.data.guestName}`;
      default:
        return 'Reservation notification';
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <div className="flex items-center space-x-2">
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No new notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification, index) => (
                  <div
                    key={index}
                    className="p-4 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {getNotificationMessage(notification)}
                        </p>
                        <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>
                            {formatUTCDateTime(new Date(notification.data.updatedAt))}
                          </span>
                        </div>
                        {notification.data.roomNumber && (
                          <p className="mt-1 text-xs text-gray-600">
                            Room {notification.data.roomNumber}
                          </p>
                        )}
                        <div className="mt-2 flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              notification.data.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : notification.data.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : notification.data.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {notification.data.status}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeNotification(notification.data.id)}
                        className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell;
