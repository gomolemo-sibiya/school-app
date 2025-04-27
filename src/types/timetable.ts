
export interface TimeSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string;
  endTime: string;
  subject: string;
  lecturer: string;
  room: string;
}

export interface FacultyTimetable {
  faculty: string;
  timeSlots: TimeSlot[];
}
