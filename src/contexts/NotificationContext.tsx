
import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Notification } from '@/types/notifications';
import { getNotifications, getUnreadCount, markAsRead as markNotificationAsRead, markAllAsRead as markAllNotificationsAsRead } from '@/services/notificationService';
import { toast } from '@/components/ui/sonner';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  refetchNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Get user data only once
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setLoading(false);
    }
  }, []);

  // Only fetch notifications when user is available
  const fetchNotifications = useCallback(() => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch notifications for the current user
      const userNotifications = getNotifications(user.role, user.id);
      setNotifications(userNotifications);
      setUnreadCount(getUnreadCount(user.role, user.id));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  }, [user]);

  useEffect(() => {
    if (user && !isInitialized) {
      fetchNotifications();
    }
  }, [user, fetchNotifications, isInitialized]);

  const handleMarkAsRead = useCallback((id: string) => {
    markNotificationAsRead(id);
    // Update local state to avoid full refetch
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, status: 'read' } 
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    if (!user) return;
    
    markAllNotificationsAsRead(user.role, user.id);
    
    // Update local state to avoid full refetch
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, status: 'read' }))
    );
    setUnreadCount(0);
    
    toast.success('All notifications marked as read');
  }, [user]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    notifications,
    unreadCount,
    loading,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    refetchNotifications: fetchNotifications,
  }), [notifications, unreadCount, loading, handleMarkAsRead, handleMarkAllAsRead, fetchNotifications]);

  return (
    <NotificationContext.Provider value={contextValue}>
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
