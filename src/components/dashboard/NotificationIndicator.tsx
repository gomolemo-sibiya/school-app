
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/contexts/NotificationContext';

const NotificationIndicator = () => {
  // Try to access the notification context safely with a default unreadCount of 0
  let unreadCount = 0;
  
  try {
    const notificationContext = useNotifications();
    unreadCount = notificationContext.unreadCount;
  } catch (error) {
    // If context is not available, we'll use the default unreadCount of 0
    console.error('Notification context not available:', error);
  }

  return (
    <Button variant="ghost" size="icon" asChild className="relative">
      <Link to="/app/notifications">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500">
            <span className="sr-only">{unreadCount} unread notifications</span>
          </span>
        )}
      </Link>
    </Button>
  );
};

export default NotificationIndicator;
