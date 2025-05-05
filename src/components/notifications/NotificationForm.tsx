import React from "react";
import { useForm } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Notification } from "@/types/notifications";
import { DialogClose } from "@/components/ui/dialog";

// Form validation schema
const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  content: z
    .string()
    .min(10, { message: "Content must be at least 10 characters" }),
  type: z.enum(["announcement", "appointment", "issue"]),
  faculty: z.string().optional(),
  targetRoles: z
    .array(z.enum(["student", "lecturer", "admin"]))
    .min(1, { message: "Select at least one target role" }),
});

interface NotificationFormProps {
  notification?: Notification;
  onSubmit: (data: Omit<Notification, 'id' | 'createdAt' | 'createdBy' | 'status'>) => Promise<boolean>;
  onCancel: () => void;
}

const NotificationForm: React.FC<NotificationFormProps> = ({
  notification,
  onSubmit,
  onCancel,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: notification?.title || "",
      content: notification?.content || "",
      type: notification?.type || "announcement",
      faculty: notification?.faculty || "",
      targetRoles: notification?.targetRoles || ["student"],
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const success = await onSubmit({
        title: values.title,
        content: values.content,
        type: values.type,
        targetRoles: values.targetRoles,
        faculty: values.faculty
      });
      
      if (success) {
        onCancel();
      }
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  const roleOptions = [
    { id: "student", label: "Students" },
    { id: "lecturer", label: "Lecturers" },
    { id: "admin", label: "Administrators" },
  ];

  const facultyOptions = [
    "Computer Science",
    "Engineering",
    "Business",
    "Arts",
    "Medicine",
    "Law",
    "Education",
  ];

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
                <Input {...field} placeholder="Notification title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter notification content..."
                  rows={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="faculty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Faculty (Optional)</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a faculty (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {facultyOptions.map((faculty) => (
                    <SelectItem key={faculty} value={faculty}>
                      {faculty}
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
          name="targetRoles"
          render={() => (
            <FormItem>
              <div className="mb-2">
                <FormLabel>Target Audience</FormLabel>
              </div>
              <div className="space-y-2">
                {roleOptions.map((role) => (
                  <FormField
                    key={role.id}
                    control={form.control}
                    name="targetRoles"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={role.id}
                          className="flex flex-row items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(role.id as any)}
                              onCheckedChange={(checked) => {
                                const updatedRoles = checked
                                  ? [...field.value, role.id as any]
                                  : field.value.filter(
                                      (item) => item !== role.id
                                    );
                                field.onChange(updatedRoles);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {role.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
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
            {notification ? "Update" : "Create"} Notification
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NotificationForm;
