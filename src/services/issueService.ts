import { Issue, IssueStatus } from "@/types/issues";
import { createNotification } from "@/services/notificationService";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// Mock data for issues
const mockIssues: Issue[] = [
  {
    id: "1",
    title: "Computer Lab Access Issue",
    description: "Unable to access the computer lab in the CS building after 7pm.",
    category: "Campus Facilities",
    location: "CS Building, 3rd Floor",
    studentId: "s1",
    studentName: "Siyabonga Dlamini",
    status: "submitted",
    createdAt: "2025-04-20T10:30:00Z",
    updatedAt: "2025-04-20T10:30:00Z",
  },
  {
    id: "2",
    title: "Library WiFi Not Working",
    description: "The WiFi in the main library isn't connecting properly during peak hours.",
    category: "Campus WiFi",
    location: "Library, 2nd Floor",
    studentId: "s1",
    studentName: "Siyabonga Dlamini",
    status: "will-address",
    createdAt: "2025-04-18T14:15:00Z",
    updatedAt: "2025-04-19T09:22:00Z",
    comments: "IT department has been notified and will check the router capacity."
  },
  {
    id: "3",
    title: "Classroom Projector Malfunction",
    description: "The projector in room 301 keeps shutting off during presentations.",
    category: "Lecture Halls",
    location: "Engineering Building, Room 301",
    studentId: "s2",
    studentName: "Ayesha Patel",
    status: "addressed",
    createdAt: "2025-04-15T11:30:00Z",
    updatedAt: "2025-04-17T16:45:00Z",
    comments: "Projector has been replaced with a new one."
  },
];

// Issue categories
export const issueCategories = [
  "Campus Facilities",
  "Campus WiFi",
  "Lecture Halls",
  "Student Residences",
  "Security",
  "Software Issues",
  "Other"
];

// Get issues based on user role and ID
export const getIssues = (role: string, userId: string): Issue[] => {
  if (role === 'student') {
    return mockIssues.filter(issue => issue.studentId === userId);
  } else {
    // Lecturers and admins see all issues
    return mockIssues;
  }
};

// Create a new issue
export const createIssue = (issue: Omit<Issue, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Issue => {
  const newIssue: Issue = {
    ...issue,
    id: `${mockIssues.length + 1}`,
    status: 'submitted',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockIssues.push(newIssue);

  // Create notification for lecturers/admins
  createNotification({
    title: `New Issue Report`,
    content: `A new issue has been reported by ${issue.studentName}:\n\n${issue.title}\n\nCategory: ${issue.category}\nLocation: ${issue.location}`,
    type: 'issue',
    createdBy: 'System',
    targetRoles: ['lecturer', 'admin'],
    status: 'unread',
  });

  return newIssue;
};

// Update an issue
export const updateIssue = (id: string, updates: Partial<Issue>): Issue | null => {
  const index = mockIssues.findIndex(i => i.id === id);
  if (index === -1) return null;

  const oldStatus = mockIssues[index].status;
  const updatedIssue = { 
    ...mockIssues[index], 
    ...updates,
    updatedAt: new Date().toISOString() 
  };
  
  mockIssues[index] = updatedIssue;
  
  // If status was changed, create a notification for the student
  if (updates.status && oldStatus !== updates.status) {
    const statusText = getStatusDisplayText(updates.status);
    const issue = mockIssues[index];
    
    createNotification({
      title: `Issue Status Update: ${statusText}`,
      content: `Your issue report "${issue.title}" has been updated to: ${statusText}${issue.comments ? `\n\nComments: ${issue.comments}` : ''}`,
      type: 'issue',
      createdBy: 'System',
      targetRoles: ['student'],
      status: 'unread',
    });
  }
  
  return updatedIssue;
};

// Delete an issue
export const deleteIssue = (id: string): boolean => {
  const initialLength = mockIssues.length;
  const filtered = mockIssues.filter(i => i.id !== id);
  
  // This is a hack since we're using a constant array and not a real database
  mockIssues.length = 0;
  mockIssues.push(...filtered);
  
  return initialLength !== mockIssues.length;
};

// Generate PDF report for an issue
export const generateIssuePDF = (issue: Issue): string => {
  console.log("Generating PDF for issue:", issue);
  
  return `issue-report-${issue.id}.pdf`;
};

// Helper function to get display text for status
export const getStatusDisplayText = (status: IssueStatus): string => {
  switch (status) {
    case 'submitted':
      return 'Submitted';
    case 'will-address':
      return 'Will be addressed';
    case 'addressed':
      return 'Has been addressed';
    case 'will-not-address':
      return 'Will not be addressed';
    default:
      return status;
  }
};
