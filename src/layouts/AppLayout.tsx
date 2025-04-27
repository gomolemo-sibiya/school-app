
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import AppHeader from '@/components/dashboard/AppHeader';
import { NotificationProvider } from '@/contexts/NotificationContext';

const AppLayout = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (!storedUser) {
      // No user found, redirect to sign in
      navigate('/auth/signin');
      return;
    }
    
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <SidebarProvider>
      <NotificationProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar role={user.role} />
          <div className="flex flex-col flex-1 overflow-hidden">
            <AppHeader user={user} />
            <main className="flex-1 overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </NotificationProvider>
    </SidebarProvider>
  );
};

export default AppLayout;
