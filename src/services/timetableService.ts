import { FacultyTimetable, TimeSlot } from '@/types/timetable';

// Mock data for timetables
const mockTimetables: FacultyTimetable[] = [
  {
    faculty: 'Computer Science',
    timeSlots: [
      {
        id: '1',
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:30',
        subject: 'Introduction to Programming',
        lecturer: 'Dr. Thabo Mokoena',
        room: 'Lab 101'
      },
      {
        id: '2',
        day: 'Monday',
        startTime: '11:00',
        endTime: '12:30',
        subject: 'Data Structures',
        lecturer: 'Dr. Priya Naidoo',
        room: 'Room 202'
      },
      {
        id: '3',
        day: 'Tuesday',
        startTime: '09:00',
        endTime: '10:30',
        subject: 'Database Systems',
        lecturer: 'Prof. Anwar Ismail',
        room: 'Lab 103'
      }
    ]
  },
  {
    faculty: 'Engineering',
    timeSlots: [
      {
        id: '4',
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:30',
        subject: 'Engineering Mathematics',
        lecturer: 'Dr. Sipho Dlamini',
        room: 'Room 301'
      },
      {
        id: '5',
        day: 'Wednesday',
        startTime: '11:00',
        endTime: '12:30',
        subject: 'Mechanics',
        lecturer: 'Prof. Pieter van der Merwe',
        room: 'Lab 201'
      }
    ]
  }
];

export const getTimetableByFaculty = (faculty: string): TimeSlot[] => {
  return mockTimetables.find(t => t.faculty === faculty)?.timeSlots || [];
};

export const getFaculties = (): string[] => {
  return mockTimetables.map(t => t.faculty);
};
