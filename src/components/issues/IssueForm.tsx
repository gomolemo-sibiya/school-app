import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogClose } from "@/components/ui/dialog";
import { Issue } from "@/types/issues";
import { issueCategories } from "@/services/issueService";

// Form validation schema
const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  location: z
    .string()
    .min(3, { message: "Location must be at least 3 characters" }),
});

interface IssueFormProps {
  issue?: Issue;
  onSubmit: (data: Omit<Issue, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
  user: any;
}

const IssueForm: React.FC<IssueFormProps> = ({
  issue,
  onSubmit,
  onCancel,
  user,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: issue?.title || "",
      description: issue?.description || "",
      category: issue?.category || "",
      location: issue?.location || "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const issueData: Omit<Issue, 'id' | 'status' | 'createdAt' | 'updatedAt'> = {
      title: values.title,
      description: values.description,
      category: values.category,
      location: values.location,
      studentId: user.id,
      studentName: user.name,
    };
    
    await onSubmit(issueData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Brief title for the issue" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {issueCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe the issue in detail"
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Building, room, or area where the issue occurred"
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
          <Button type="submit">{issue ? "Update" : "Report"} Issue</Button>
        </div>
      </form>
    </Form>
  );
};

export default IssueForm;
