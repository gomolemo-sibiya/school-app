
export type AppointmentStatus = 'pending' | 'accepted' | 'declined';

export interface Appointment {
  id: string;
  studentId: string;
  studentName: string;
  lecturerId: string;
  lecturerName: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  createdAt: string;
}
