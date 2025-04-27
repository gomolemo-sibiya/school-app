
import { Notification } from "@/types/notifications";

// Mock data for notifications
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "System Maintenance",
    content: "The system will be under maintenance on Saturday from 10 PM to 2 AM.",
    createdAt: "2025-04-20T10:30:00Z",
    createdBy: "Admin",
    type: "announcement",
    status: "unread",
    targetRoles: ["student", "lecturer", "admin"],
  },
  {
    id: "2",
    title: "New Course Registration",
    content: "Registration for 2025 courses is now open.",
    createdAt: "2025-04-18T14:15:00Z",
    createdBy: "Registrar Office",
    type: "announcement",
    status: "unread",
    targetRoles: ["student"],
  },
  {
    id: "3",
    title: "Faculty Meeting",
    content: "There will be a faculty meeting on Friday at 3 PM in Room 302.",
    createdAt: "2025-04-17T09:45:00Z",
    createdBy: "Dean's Office",
    type: "announcement",
    status: "read",
    targetRoles: ["lecturer"],
    faculty: "Computer Science",
  },
  {
    id: "4",
    title: "Appointment Request Accepted",
    content: "Your appointment request with Dr. Naidoo on April 25th has been accepted.",
    createdAt: "2025-04-16T16:20:00Z",
    createdBy: "Appointment System",
    type: "appointment",
    status: "unread",
    targetRoles: ["student"],
  },
  {
    id: "5",
    title: "Your Issue Report Status Update",
    content: "Your reported issue about the computer lab has been marked as 'Will be addressed'.",
    createdAt: "2025-04-15T11:00:00Z",
    createdBy: "IT Support",
    type: "issue",
    status: "read",
    targetRoles: ["student"],
  },
];

// Cache for notifications to avoid recalculating
const notificationCache = new Map<string, Notification[]>();

export const getNotifications = (userRole: string, userId?: string): Notification[] => {
  const cacheKey = `${userRole}-${userId || 'anonymous'}`;
  
  if (notificationCache.has(cacheKey)) {
    return notificationCache.get(cacheKey) || [];
  }
  
  // In a real app, we would filter by userId as well
  const filteredNotifications = mockNotifications.filter(notification => 
    notification.targetRoles?.includes(userRole as any)
  );
  
  notificationCache.set(cacheKey, filteredNotifications);
  return filteredNotifications;
};

export const getUnreadCount = (userRole: string, userId?: string): number => {
  return getNotifications(userRole, userId).filter(n => n.status === 'unread').length;
};

export const markAsRead = (notificationId: string): void => {
  const notification = mockNotifications.find(n => n.id === notificationId);
  if (notification) {
    notification.status = 'read';
    
    // Clear the cache to force refresh on next fetch
    notificationCache.clear();
  }
};

export const markAllAsRead = (userRole: string, userId?: string): void => {
  getNotifications(userRole, userId).forEach(notification => {
    notification.status = 'read';
  });
  
  // Clear the cache to force refresh on next fetch
  notificationCache.clear();
};

export const createNotification = (notification: Omit<Notification, 'id' | 'createdAt'>): Notification => {
  const newNotification: Notification = {
    ...notification,
    id: `${mockNotifications.length + 1}`,
    createdAt: new Date().toISOString(),
    status: 'unread' // Setting default status here
  };
  
  mockNotifications.push(newNotification);
  
  // Clear the cache to force refresh on next fetch
  notificationCache.clear();
  
  return newNotification;
};

export const updateNotification = (id: string, updates: Partial<Notification>): Notification | null => {
  const index = mockNotifications.findIndex(n => n.id === id);
  if (index === -1) return null;
  
  mockNotifications[index] = { ...mockNotifications[index], ...updates };
  
  // Clear the cache to force refresh on next fetch
  notificationCache.clear();
  
  return mockNotifications[index];
};

export const deleteNotification = (id: string): boolean => {
  const initialLength = mockNotifications.length;
  const filtered = mockNotifications.filter(n => n.id !== id);
  
  // This is a hack since we're using a constant array and not a real database
  mockNotifications.length = 0;
  mockNotifications.push(...filtered);
  
  // Clear the cache to force refresh on next fetch
  notificationCache.clear();
  
  return initialLength !== mockNotifications.length;
};
