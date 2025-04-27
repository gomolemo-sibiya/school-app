import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Calendar,
  Clock,
  Bell,
  FileText,
  User,
  Users,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';

interface AppSidebarProps {
  role: 'student' | 'lecturer' | 'admin';
}

const AppSidebar = ({ role }: AppSidebarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  // Navigation items based on role
  const navigationItems = role === 'admin'
    ? [
        {
          title: 'Dashboard',
          path: '/app/dashboard',
          icon: LayoutDashboard,
        },
        {
          title: 'User Profile',
          path: '/app/profile',
          icon: Users,
        },
      ]
    : [
        {
          title: 'Appointments',
          path: '/app/appointments',
          icon: Calendar,
        },
        {
          title: 'Timetable',
          path: '/app/timetable',
          icon: Clock,
        },
        {
          title: 'Notifications',
          path: '/app/notifications',
          icon: Bell,
        },
        {
          title: 'User Profile',
          path: '/app/profile',
          icon: User,
        },
        {
          title: 'Report Issues',
          path: '/app/issues',
          icon: FileText,
        },
      ];

  return (
    <Sidebar>
      <div className="flex items-center h-16 px-4 border-b">
        <Link to="/app/dashboard" className="flex items-center gap-2">
          <span className="font-display font-bold text-xl text-brand-600">
            School App
          </span>
        </Link>
        <SidebarTrigger className="ml-auto" />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    className={cn(
                      isActive(item.path) && "bg-sidebar-accent text-sidebar-accent-foreground"
                    )}
                    asChild
                  >
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4 mr-2" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="mt-auto p-4 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/auth/signin" onClick={() => localStorage.removeItem('user')} className="text-red-500">
                <LogOut className="h-4 w-4 mr-2" />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </Sidebar>
  );
};

export default AppSidebar;
