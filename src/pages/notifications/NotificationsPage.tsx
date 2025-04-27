import React, { useEffect, useState, useMemo } from 'react';
import { format } from 'date-fns';
import { 
  Check, 
  Trash, 
  Edit, 
  Plus, 
  BellRing,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogClose,
  DialogDescription 
} from '@/components/ui/dialog';
import { useNotifications } from '@/contexts/NotificationContext';
import { 
  createNotification, 
  updateNotification, 
  deleteNotification 
} from '@/services/notificationService';
import { Notification, NotificationType } from '@/types/notifications';
import NotificationForm from '@/components/notifications/NotificationForm';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';

const NotificationsPage = () => {
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead, refetchNotifications } = useNotifications();
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleCreateNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'createdBy' | 'status'>) => {
    try {
      createNotification({
        ...notification,
        createdBy: user?.name || 'Unknown',
        status: 'unread'
      });
      toast.success('Notification created successfully');
      refetchNotifications();
    } catch (error) {
      console.error('Error creating notification:', error);
      toast.error('Failed to create notification');
    }
  };

  const handleUpdateNotification = (id: string, updates: Partial<Notification>) => {
    try {
      updateNotification(id, updates);
      toast.success('Notification updated successfully');
      refetchNotifications();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating notification:', error);
      toast.error('Failed to update notification');
    }
  };

  const handleDeleteNotification = (id: string) => {
    try {
      deleteNotification(id);
      toast.success('Notification deleted successfully');
      refetchNotifications();
      setIsDeleting(false);
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const handleReadNotification = (notification: Notification) => {
    if (notification.status === 'unread') {
      markAsRead(notification.id);
    }
    setSelectedNotification(notification);
  };

  const getNotificationIcon = useMemo(() => (type: NotificationType) => {
    switch (type) {
      case 'announcement':
        return <BellRing className="h-5 w-5 text-blue-500" />;
      case 'appointment':
        return <Calendar className="h-5 w-5 text-green-500" />;
      case 'issue':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default:
        return <BellRing className="h-5 w-5" />;
    }
  }, []);

  if (loading) {
    return <div className="p-6 flex justify-center">Loading notifications...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <div className="flex gap-3">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          )}
          
          {(user?.role === 'lecturer' || user?.role === 'admin') && (
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Notification
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Create New Notification</DialogTitle>
                  <DialogDescription>Fill out the form to create a new notification</DialogDescription>
                </DialogHeader>
                <NotificationForm 
                  onSubmit={handleCreateNotification}
                  onCancel={() => {}}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-card rounded-lg border shadow-sm p-4">
          <h2 className="font-semibold text-lg mb-4">All Notifications</h2>
          {notifications.length === 0 ? (
            <div className="text-muted-foreground text-center py-8">
              No notifications to display
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-3 border rounded-md cursor-pointer transition-all hover:bg-accent hover:text-accent-foreground ${
                    selectedNotification?.id === notification.id ? 'bg-accent text-accent-foreground' : ''
                  } ${notification.status === 'unread' ? 'border-l-4 border-l-primary' : ''}`}
                  onClick={() => handleReadNotification(notification)}
                >
                  <div className="flex items-center gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <h5 className="font-medium">{notification.title}</h5>
                      <p className="text-sm text-muted-foreground truncate">
                        {format(new Date(notification.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    {notification.status === 'unread' && (
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedNotification ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedNotification.title}</CardTitle>
                    <CardDescription>
                      {format(new Date(selectedNotification.createdAt), 'MMMM dd, yyyy h:mm a')}
                    </CardDescription>
                  </div>
                  <Badge variant={selectedNotification.status === 'read' ? 'outline' : 'default'}>
                    {selectedNotification.status === 'read' ? 'Read' : 'Unread'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{selectedNotification.content}</p>
              </CardContent>
              {(user?.role === 'lecturer' || user?.role === 'admin') && (
                <CardFooter className="flex justify-end gap-2">
                  <Dialog open={isEditing} onOpenChange={setIsEditing}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Notification</DialogTitle>
                        <DialogDescription>Make changes to the notification</DialogDescription>
                      </DialogHeader>
                      <NotificationForm 
                        notification={selectedNotification}
                        onSubmit={(data) => handleUpdateNotification(selectedNotification.id, data)}
                        onCancel={() => setIsEditing(false)}
                      />
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash className="mr-2 h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Notification</DialogTitle>
                        <DialogDescription>Are you sure you want to delete this notification?</DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="font-medium mt-2">{selectedNotification.title}</p>
                      </div>
                      <div className="flex justify-end gap-3">
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button 
                          variant="destructive" 
                          onClick={() => handleDeleteNotification(selectedNotification.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              )}
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center bg-card border rounded-lg p-8 text-center">
              <div>
                <BellRing className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-3" />
                <h3 className="font-medium text-lg">No notification selected</h3>
                <p className="text-muted-foreground">
                  Select a notification from the list to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
