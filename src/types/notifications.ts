
export type NotificationStatus = 'unread' | 'read';

export type NotificationType = 'announcement' | 'appointment' | 'issue';

export interface Notification {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy: string;
  type: NotificationType;
  status: NotificationStatus;
  faculty?: string;
  targetRoles?: ('student' | 'lecturer' | 'admin')[];
}
