
import React from 'react';
import { getTimetableByFaculty } from '@/services/timetableService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TimetableViewerProps {
  faculty: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = [
  '09:00-10:30',
  '11:00-12:30',
  '13:30-15:00',
  '15:30-17:00'
];

const TimetableViewer = ({ faculty }: TimetableViewerProps) => {
  const timeSlots = getTimetableByFaculty(faculty);

  const getSlotContent = (day: string, timeSlot: string) => {
    const [startTime] = timeSlot.split('-');
    const slot = timeSlots.find(
      s => s.day === day && s.startTime === startTime
    );

    if (!slot) return null;

    return (
      <div className="p-2 bg-accent/20 rounded-md border border-accent">
        <div className="font-medium">{slot.subject}</div>
        <div className="text-sm text-muted-foreground">{slot.lecturer}</div>
        <div className="text-sm text-muted-foreground">{slot.room}</div>
      </div>
    );
  };

  return (
    <div className="rounded-md border overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Time</TableHead>
            {DAYS.map(day => (
              <TableHead key={day}>{day}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {TIME_SLOTS.map(timeSlot => (
            <TableRow key={timeSlot}>
              <TableCell className="font-medium">{timeSlot}</TableCell>
              {DAYS.map(day => (
                <TableCell key={`${day}-${timeSlot}`} className="min-h-[100px]">
                  {getSlotContent(day, timeSlot)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TimetableViewer;
