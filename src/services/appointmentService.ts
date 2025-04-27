
import { Appointment, AppointmentStatus } from "@/types/appointments";
import { createNotification } from "@/services/notificationService";
import { toast } from "@/components/ui/sonner";

// Mock data for appointments
const mockAppointments: Appointment[] = [
  {
    id: "1",
    studentId: "s1",
    studentName: "John Doe",
    lecturerId: "l1",
    lecturerName: "Dr. Smith",
    title: "Project Discussion",
    description: "Discuss progress on final year project",
    date: "2025-05-05",
    startTime: "10:00",
    endTime: "10:30",
    status: "pending",
    createdAt: "2025-04-25T10:00:00Z",
  },
  {
    id: "2",
    studentId: "s1",
    studentName: "John Doe",
    lecturerId: "l2",
    lecturerName: "Dr. Johnson",
    title: "Course Clarification",
    description: "Need help understanding advanced topics in AI",
    date: "2025-05-06",
    startTime: "14:00",
    endTime: "14:30",
    status: "accepted",
    createdAt: "2025-04-24T08:30:00Z",
  },
  {
    id: "3",
    studentId: "s2",
    studentName: "Jane Smith",
    lecturerId: "l1",
    lecturerName: "Dr. Smith",
    title: "Assignment Extension Request",
    description: "Request for assignment deadline extension due to medical reasons",
    date: "2025-05-03",
    startTime: "11:00",
    endTime: "11:15",
    status: "declined",
    createdAt: "2025-04-23T15:45:00Z",
  },
];

// Get appointments based on user role and ID
export const getAppointments = (role: string, userId: string): Appointment[] => {
  if (role === 'student') {
    return mockAppointments.filter(appointment => appointment.studentId === userId);
  } else if (role === 'lecturer') {
    return mockAppointments.filter(appointment => appointment.lecturerId === userId);
  } else {
    // Admin sees all appointments
    return mockAppointments;
  }
};

// Create a new appointment
export const createAppointment = (appointment: Omit<Appointment, 'id' | 'status' | 'createdAt'>): Appointment => {
  const newAppointment: Appointment = {
    ...appointment,
    id: `${mockAppointments.length + 1}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  mockAppointments.push(newAppointment);

  // Create notification for lecturer
  createNotification({
    title: `New Appointment Request`,
    content: `${appointment.studentName} has requested an appointment on ${appointment.date} from ${appointment.startTime} to ${appointment.endTime}.\n\nTopic: ${appointment.title}`,
    type: 'appointment',
    createdBy: 'System',
    targetRoles: ['lecturer'],
    status: 'unread',
  });

  return newAppointment;
};

// Update an appointment
export const updateAppointment = (id: string, updates: Partial<Appointment>): Appointment | null => {
  const index = mockAppointments.findIndex(a => a.id === id);
  if (index === -1) return null;

  const oldStatus = mockAppointments[index].status;
  mockAppointments[index] = { ...mockAppointments[index], ...updates };
  
  // If status was changed, create a notification for the student
  if (updates.status && oldStatus !== updates.status) {
    const appointment = mockAppointments[index];
    createNotification({
      title: `Appointment ${updates.status === 'accepted' ? 'Accepted' : 'Declined'}`,
      content: `Your appointment request with ${appointment.lecturerName} on ${appointment.date} from ${appointment.startTime} to ${appointment.endTime} has been ${updates.status}.`,
      type: 'appointment',
      createdBy: 'System',
      targetRoles: ['student'],
      status: 'unread',
    });
  }
  
  return mockAppointments[index];
};

// Delete an appointment
export const deleteAppointment = (id: string): boolean => {
  const initialLength = mockAppointments.length;
  const appointment = mockAppointments.find(a => a.id === id);
  
  if (appointment) {
    const filtered = mockAppointments.filter(a => a.id !== id);
    
    // This is a hack since we're using a constant array and not a real database
    mockAppointments.length = 0;
    mockAppointments.push(...filtered);
    
    // Create notification for lecturer if appointment was pending
    if (appointment.status === 'pending') {
      createNotification({
        title: `Appointment Canceled`,
        content: `${appointment.studentName} has canceled the appointment request scheduled for ${appointment.date} from ${appointment.startTime} to ${appointment.endTime}.`,
        type: 'appointment',
        createdBy: 'System',
        targetRoles: ['lecturer'],
        status: 'unread',
      });
    }
    
    return initialLength !== mockAppointments.length;
  }
  
  return false;
};

// Get available lecturers (mock function for demo purposes)
export const getAvailableLecturers = () => [
  { id: 'l1', name: 'Dr. Thabo Mokoena', faculty: 'Computer Science' },
  { id: 'l2', name: 'Dr. Priya Naidoo', faculty: 'Engineering' },
  { id: 'l3', name: 'Prof. Pieter van der Merwe', faculty: 'Business' },
  { id: 'l4', name: 'Dr. Zanele Khumalo', faculty: 'Arts' },
  { id: 'l5', name: 'Prof. Michael Botha', faculty: 'Science' },
];
