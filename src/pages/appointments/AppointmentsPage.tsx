import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Calendar,
  Plus,
  Edit,
  Trash,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/components/ui/sonner";

import { Appointment, AppointmentStatus } from "@/types/appointments";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAvailableLecturers,
} from "@/services/appointmentService";
import AppointmentForm from "@/components/appointments/AppointmentForm";

// Add the missing getStatusBadge function
const getStatusBadge = (status: AppointmentStatus) => {
  switch (status) {
    case "pending":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200"
        >
          Pending
        </Badge>
      );
    case "accepted":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          Accepted
        </Badge>
      );
    case "declined":
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200"
        >
          Declined
        </Badge>
      );
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false); // Note
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Load appointments for this user
      const userAppointments = getAppointments(parsedUser.role, parsedUser.id);
      setAppointments(userAppointments);
    }
  }, []);

  const handleCreateAppointment = (
    appointmentData: Omit<Appointment, "id" | "status" | "createdAt">
  ): boolean => {
    try {
      createAppointment(appointmentData);
      toast.success("Appointment created successfully");
      if (user) {
        setAppointments(getAppointments(user.role, user.id));
      }
      return true;
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Failed to create appointment");
      return false;
    }
  };

  const handleUpdateAppointment = (
    id: string,
    updates: Partial<Appointment>
  ): boolean => {
    try {
      updateAppointment(id, updates);
      toast.success("Appointment updated successfully");
      if (user) {
        setAppointments(getAppointments(user.role, user.id));
      }
      return true;
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Failed to update appointment");
      return false;
    }
  };

  const handleDeleteAppointment = (id: string) => {
    try {
      deleteAppointment(id);
      toast.success("Appointment deleted successfully");
      setIsDeleting(false);
      setSelectedAppointment(null);
      // Refresh appointments list
      if (user) {
        setAppointments(getAppointments(user.role, user.id));
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error("Failed to delete appointment");
    }
  };

  const handleStatusChange = (id: string, status: AppointmentStatus) => {
    try {
      updateAppointment(id, { status });
      toast.success(`Appointment ${status}`);
      // Refresh appointments list
      if (user) {
        setAppointments(getAppointments(user.role, user.id));
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast.error("Failed to update appointment status");
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        );
      case "accepted":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Accepted
          </Badge>
        );
      case "declined":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Declined
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Filter appointments based on status for tab content
  const pendingAppointments = appointments.filter(
    (a) => a.status === "pending"
  );
  const acceptedAppointments = appointments.filter(
    (a) => a.status === "accepted"
  );
  const declinedAppointments = appointments.filter(
    (a) => a.status === "declined"
  );

  if (!user) {
    return <div className="p-6 flex justify-center">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Appointments</h1>

        {/* Only students can create appointments */}
        {user.role === "student" && (
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Book Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Book New Appointment</DialogTitle>
              </DialogHeader>
              <AppointmentForm
                onSubmit={(
                  data: Omit<
                    Appointment,
                    | "id"
                    | "status"
                    | "createdAt"
                    | "studentId"
                    | "studentName"
                    | "lecturerName"
                  >
                ) => {
                  const success = handleCreateAppointment({
                    ...data,
                    studentId: user.id,
                    studentName: user.name,
                    lecturerName:
                      getAvailableLecturers().find(
                        (l) => l.id === data.lecturerId
                      )?.name || "",
                  });
                  if (success) {
                    setIsCreateDialogOpen(false);
                  }
                }}
                onCancel={() => setIsCreateDialogOpen(false)}
                user={user}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger
            value="pending"
            disabled={pendingAppointments.length === 0}
          >
            Pending
            {pendingAppointments.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
                {pendingAppointments.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="accepted"
            disabled={acceptedAppointments.length === 0}
          >
            Accepted
          </TabsTrigger>
          <TabsTrigger
            value="declined"
            disabled={declinedAppointments.length === 0}
          >
            Declined
          </TabsTrigger>
        </TabsList>

        {/* All appointments tab */}
        <TabsContent value="all">
          {appointments.length === 0 ? (
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertTitle>No appointments found</AlertTitle>
              <AlertDescription>
                {user.role === "student"
                  ? "You haven't booked any appointments yet. Click 'Book Appointment' to get started."
                  : "You don't have any appointment requests."}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  userRole={user.role}
                  onView={() => {
                    setSelectedAppointment(appointment);
                    setIsViewing(true);
                  }}
                  onEdit={() => {
                    setSelectedAppointment(appointment);
                    setIsEditing(true);
                  }}
                  onDelete={() => {
                    setSelectedAppointment(appointment);
                    setIsDeleting(true);
                  }}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Pending appointments tab */}
        <TabsContent value="pending">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                userRole={user.role}
                onView={() => {
                  setSelectedAppointment(appointment);
                  setIsViewing(true);
                }}
                onEdit={() => {
                  setSelectedAppointment(appointment);
                  setIsEditing(true);
                }}
                onDelete={() => {
                  setSelectedAppointment(appointment);
                  setIsDeleting(true);
                }}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </TabsContent>

        {/* Accepted appointments tab */}
        <TabsContent value="accepted">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {acceptedAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                userRole={user.role}
                onView={() => {
                  setSelectedAppointment(appointment);
                  setIsViewing(true);
                }}
                onEdit={() => {
                  setSelectedAppointment(appointment);
                  setIsEditing(true);
                }}
                onDelete={() => {
                  setSelectedAppointment(appointment);
                  setIsDeleting(true);
                }}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </TabsContent>

        {/* Declined appointments tab */}
        <TabsContent value="declined">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {declinedAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                userRole={user.role}
                onView={() => {
                  setSelectedAppointment(appointment);
                  setIsViewing(true);
                }}
                onEdit={() => {
                  setSelectedAppointment(appointment);
                  setIsEditing(true);
                }}
                onDelete={() => {
                  setSelectedAppointment(appointment);
                  setIsDeleting(true);
                }}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* View Appointment Dialog */}
      <Dialog open={isViewing} onOpenChange={setIsViewing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">
                  {selectedAppointment.title}
                </h3>
                <p className="text-muted-foreground">
                  {selectedAppointment.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Date</p>
                  <p>
                    {format(new Date(selectedAppointment.date), "MMMM d, yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Time</p>
                  <p>
                    {selectedAppointment.startTime} -{" "}
                    {selectedAppointment.endTime}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Student</p>
                  <p>{selectedAppointment.studentName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Lecturer</p>
                  <p>{selectedAppointment.lecturerName}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Status</p>
                <div className="mt-1">
                  {getStatusBadge(selectedAppointment.status)}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <DialogClose asChild>
                  <Button>Close</Button>
                </DialogClose>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Appointment Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <AppointmentForm
              appointment={selectedAppointment}
              onSubmit={(
                data: Omit<
                  Appointment,
                  | "id"
                  | "status"
                  | "createdAt"
                  | "studentId"
                  | "studentName"
                  | "lecturerName"
                >
              ) => {
                const success = handleUpdateAppointment(
                  selectedAppointment.id,
                  {
                    ...data,
                    lecturerName:
                      getAvailableLecturers().find(
                        (l) => l.id === data.lecturerId
                      )?.name || "",
                  }
                );
                if (success) {
                  setIsEditing(false);
                }
              }}
              onCancel={() => setIsEditing(false)}
              user={user}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Appointment</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div>
              <p className="mb-4">
                Are you sure you want to delete this appointment?
              </p>
              <div className="bg-muted p-3 rounded-md mb-6">
                <p className="font-medium">{selectedAppointment.title}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(selectedAppointment.date), "MMMM d, yyyy")} |{" "}
                  {selectedAppointment.startTime} -{" "}
                  {selectedAppointment.endTime}
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={() =>
                    handleDeleteAppointment(selectedAppointment.id)
                  }
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Appointment Card Component
interface AppointmentCardProps {
  appointment: Appointment;
  userRole: string;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
}

const AppointmentCard = ({
  appointment,
  userRole,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}: AppointmentCardProps) => {
  const isStudent = userRole === "student";
  const isPending = appointment.status === "pending";
  const formattedDate = format(new Date(appointment.date), "MMM d, yyyy");

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{appointment.title}</CardTitle>
          {getStatusBadge(appointment.status)}
        </div>
        <CardDescription>
          {formattedDate} | {appointment.startTime} - {appointment.endTime}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
          {appointment.description}
        </p>
        <div className="text-sm">
          <p>
            <span className="font-medium">
              {isStudent ? "Lecturer:" : "Student:"}
            </span>{" "}
            {isStudent ? appointment.lecturerName : appointment.studentName}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={onView}>
          <Clock className="mr-1 h-3.5 w-3.5" />
          View
        </Button>

        {/* Students can edit or delete pending appointments */}
        {isStudent && isPending && (
          <>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="mr-1 h-3.5 w-3.5" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-500"
              onClick={onDelete}
            >
              <Trash className="mr-1 h-3.5 w-3.5" />
              Delete
            </Button>
          </>
        )}

        {/* Lecturers can accept/decline pending appointments */}
        {!isStudent && isPending && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="text-green-600"
              onClick={() => onStatusChange(appointment.id, "accepted")}
            >
              <CheckCircle className="mr-1 h-3.5 w-3.5" />
              Accept
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-500"
              onClick={() => onStatusChange(appointment.id, "declined")}
            >
              <XCircle className="mr-1 h-3.5 w-3.5" />
              Decline
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default AppointmentsPage;
