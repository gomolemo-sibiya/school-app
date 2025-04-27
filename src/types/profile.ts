
export interface UserProfile {
  id: string;
  name: string;
  role: 'student' | 'lecturer' | 'admin';
  faculty: string;
  identificationNumber: string; // student/staff number
  email: string;
  modules?: string[]; // Optional for students and lecturers
}
