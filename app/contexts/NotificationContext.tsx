"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ReservationUpdate } from '../types/reservation';
import WebSocketService from '../services/WebSocketService';

interface NotificationContextType {
  notifications: ReservationUpdate[];
  addNotification: (notification: ReservationUpdate) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<ReservationUpdate[]>([]);

  useEffect(() => {
    // Connect to WebSocket
    const token = localStorage.getItem('authToken');
    if (token) {
      WebSocketService.connect(token);
      
      // Subscribe to reservation updates
      WebSocketService.subscribeToReservations((update: ReservationUpdate) => {
        addNotification(update);
      });
    }

    return () => {
      WebSocketService.disconnect();
    };
  }, []);

  const addNotification = (notification: ReservationUpdate) => {
    const notificationWithId = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    
    setNotifications(prev => [notificationWithId, ...prev.slice(0, 9)]); // Keep last 10
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.data.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.length;

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    unreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
