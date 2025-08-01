"use client";
import React, { useState, useCallback } from 'react';
import ToastNotification, { Toast } from './ToastNotification';

interface ToastContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ 
  position = 'top-right',
  maxToasts = 5 
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const newToast: Toast = {
      ...toast,
      id: Math.random().toString(36).substr(2, 9),
    };

    setToasts(prev => {
      const updated = [newToast, ...prev];
      return updated.slice(0, maxToasts);
    });
  }, [maxToasts]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  // Expose addToast function globally for easy access
  React.useEffect(() => {
    (window as any).addToast = addToast;
    return () => {
      delete (window as any).addToast;
    };
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div
      className={`fixed z-50 flex flex-col space-y-2 ${getPositionClasses()}`}
      style={{ maxWidth: '420px' }}
    >
      {toasts.map((toast) => (
        <ToastNotification
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
};

// Helper functions for easy toast creation
export const toast = {
  success: (title: string, message?: string, duration?: number) => {
    if ((window as any).addToast) {
      (window as any).addToast({ type: 'success', title, message, duration });
    }
  },
  error: (title: string, message?: string, duration?: number) => {
    if ((window as any).addToast) {
      (window as any).addToast({ type: 'error', title, message, duration });
    }
  },
  warning: (title: string, message?: string, duration?: number) => {
    if ((window as any).addToast) {
      (window as any).addToast({ type: 'warning', title, message, duration });
    }
  },
  info: (title: string, message?: string, duration?: number) => {
    if ((window as any).addToast) {
      (window as any).addToast({ type: 'info', title, message, duration });
    }
  },
};

export default ToastContainer;
