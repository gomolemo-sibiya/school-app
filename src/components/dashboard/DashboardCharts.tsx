
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Sample data for charts
const appointmentData = [
  { month: 'Jan', count: 12 },
  { month: 'Feb', count: 19 },
  { month: 'Mar', count: 15 },
  { month: 'Apr', count: 22 },
  { month: 'May', count: 28 },
  { month: 'Jun', count: 14 },
];

const issueData = [
  { name: 'Resolved', value: 65 },
  { name: 'In Progress', value: 25 },
  { name: 'New', value: 10 },
];

const COLORS = ['#3b82f6', '#818cf8', '#f87171'];

const AppointmentChart = () => (
  <Card className="shadow-card">
    <CardHeader>
      <CardTitle>Appointments Overview</CardTitle>
      <CardDescription>Monthly appointment trends for the current semester</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={appointmentData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

const IssuesPieChart = () => (
  <Card className="shadow-card">
    <CardHeader>
      <CardTitle>Issues Status</CardTitle>
      <CardDescription>Current status of reported issues</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={issueData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {issueData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

export { AppointmentChart, IssuesPieChart };
