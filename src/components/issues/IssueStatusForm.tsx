
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { DialogClose } from '@/components/ui/dialog';
import { IssueStatus } from '@/types/issues';

// Form validation schema
const formSchema = z.object({
  status: z.enum(['will-address', 'addressed', 'will-not-address']),
  comments: z.string().optional(),
});

interface IssueStatusFormProps {
  currentStatus?: IssueStatus;
  currentComments?: string;
  onSubmit: (status: IssueStatus, comments?: string) => void;
  onCancel: () => void;
}

const IssueStatusForm: React.FC<IssueStatusFormProps> = ({ currentStatus, currentComments, onSubmit, onCancel }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: currentStatus === 'submitted' ? 'will-address' : currentStatus || 'will-address',
      comments: currentComments || '',
    }
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values.status as IssueStatus, values.comments);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Status</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="will-address" id="will-address" />
                    <Label htmlFor="will-address" className="font-normal">Will be addressed</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="addressed" id="addressed" />
                    <Label htmlFor="addressed" className="font-normal">Has been addressed</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="will-not-address" id="will-not-address" />
                    <Label htmlFor="will-not-address" className="font-normal">Will not be addressed</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comments (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Add any comments or explanation for this status update"
                  rows={3} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit">
            Update Status
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default IssueStatusForm;
