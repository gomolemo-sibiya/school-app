
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogClose } from '@/components/ui/dialog';
import { getAvailableLecturers } from '@/services/appointmentService';
import { Appointment } from '@/types/appointments';

// Form validation schema
const formSchema = z.object({
  lecturerId: z.string().min(1, { message: 'Please select a lecturer' }),
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  date: z.string().min(1, { message: 'Please select a date' }),
  startTime: z.string().min(1, { message: 'Please select a start time' }),
  endTime: z.string().min(1, { message: 'Please select an end time' })
}).refine(data => {
  // Check if end time is after start time
  return data.startTime < data.endTime;
}, {
  message: "End time must be after start time",
  path: ["endTime"]
});

interface AppointmentFormProps {
  appointment?: Appointment;
  onSubmit: (data: Omit<Appointment, 'id' | 'status' | 'createdAt' | 'studentId' | 'studentName'>) => void;
  onCancel: () => void;
  user: any;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ appointment, onSubmit, onCancel, user }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lecturerId: appointment?.lecturerId || '',
      title: appointment?.title || '',
      description: appointment?.description || '',
      date: appointment?.date || '',
      startTime: appointment?.startTime || '',
      endTime: appointment?.endTime || '',
    }
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const selectedLecturer = lecturers.find(l => l.id === values.lecturerId);
    
    if (!selectedLecturer) {
      form.setError('lecturerId', { message: 'Invalid lecturer selected' });
      return;
    }
    
    const appointmentData = {
      lecturerId: values.lecturerId,
      title: values.title,
      description: values.description,
      date: values.date,
      startTime: values.startTime,
      endTime: values.endTime,
      studentId: user.id,
      studentName: user.name,
      lecturerName: selectedLecturer.name,
    };
    
    onSubmit(appointmentData);
  };

  // Get available lecturers
  const lecturers = getAvailableLecturers();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="lecturerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lecturer</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a lecturer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {lecturers.map((lecturer) => (
                    <SelectItem key={lecturer.id} value={lecturer.id}>
                      {lecturer.name} ({lecturer.faculty})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Brief title for the meeting" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Describe the purpose of the meeting"
                  rows={3} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input {...field} type="date" min={new Date().toISOString().split('T')[0]} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input {...field} type="time" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input {...field} type="time" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit">
            {appointment ? 'Update' : 'Create'} Appointment
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AppointmentForm;
