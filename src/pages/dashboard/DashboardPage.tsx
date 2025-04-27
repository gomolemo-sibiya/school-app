
import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Bell, FileText, Users } from 'lucide-react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { AppointmentChart, IssuesPieChart } from '@/components/dashboard/DashboardCharts';

interface User {
  name: string;
  role: string;
  [key: string]: any;
}

const DashboardPage = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) return null;

  // Admin dashboard
  if (user.role === 'admin') {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Total Students"
            value="1,245"
            icon={<Users size={20} />}
            linkTo="/app/profiles"
            trend={{ direction: 'up', value: '12%' }}
          />
          <DashboardCard
            title="Total Lecturers"
            value="87"
            icon={<Users size={20} />}
            linkTo="/app/profiles"
            trend={{ direction: 'up', value: '5%' }}
          />
          <DashboardCard
            title="Active Courses"
            value="154"
            icon={<Clock size={20} />}
            linkTo="/app/courses"
          />
          <DashboardCard
            title="Open Issues"
            value="23"
            icon={<FileText size={20} />}
            linkTo="/app/issues"
            trend={{ direction: 'down', value: '8%' }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AppointmentChart />
          <IssuesPieChart />
        </div>
      </div>
    );
  }

  // Lecturer dashboard
  if (user.role === 'lecturer') {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Lecturer Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Upcoming Appointments"
            value="8"
            icon={<Calendar size={20} />}
            linkTo="/app/appointments"
          />
          <DashboardCard
            title="Classes Today"
            value="3"
            icon={<Clock size={20} />}
            linkTo="/app/timetable"
          />
          <DashboardCard
            title="Recent Announcements"
            value="5"
            icon={<Bell size={20} />}
            linkTo="/app/announcements"
          />
          <DashboardCard
            title="Pending Issues"
            value="12"
            icon={<FileText size={20} />}
            linkTo="/app/issues"
          />
        </div>
      </div>
    );
  }

  // Student dashboard (default)
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Upcoming Appointments"
          value="2"
          icon={<Calendar size={20} />}
          linkTo="/app/appointments"
        />
        <DashboardCard
          title="Classes Today"
          value="4"
          icon={<Clock size={20} />}
          linkTo="/app/timetable"
        />
        <DashboardCard
          title="New Announcements"
          value="3"
          icon={<Bell size={20} />}
          linkTo="/app/announcements"
        />
        <DashboardCard
          title="Reported Issues"
          value="1"
          icon={<FileText size={20} />}
          linkTo="/app/issues"
        />
      </div>
    </div>
  );
};

export default DashboardPage;
