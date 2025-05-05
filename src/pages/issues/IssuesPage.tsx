import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  FileText,
  Plus,
  Edit,
  Trash,
  Download,
  CheckCircle,
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

import { Issue, IssueStatus } from "@/types/issues";
import {
  getIssues,
  createIssue,
  updateIssue,
  deleteIssue,
  generateIssuePDF,
  getStatusDisplayText,
} from "@/services/issueService";
import IssueForm from "@/components/issues/IssueForm";
import IssueStatusForm from "@/components/issues/IssueStatusForm";

// Add the missing getStatusBadge function
const getStatusBadge = (status: IssueStatus) => {
  switch (status) {
    case "submitted":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          Submitted
        </Badge>
      );
    case "will-address":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200"
        >
          Will be addressed
        </Badge>
      );
    case "addressed":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          Has been addressed
        </Badge>
      );
    case "will-not-address":
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200"
        >
          Will not be addressed
        </Badge>
      );
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const IssuesPage = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Load issues for this user
      const userIssues = getIssues(parsedUser.role, parsedUser.id);
      setIssues(userIssues);
    }
  }, []);

  const handleCreateIssue = async (
    issueData: Omit<Issue, "id" | "status" | "createdAt" | "updatedAt">
  ) => {
    try {
      createIssue(issueData);
      toast.success("Issue reported successfully");
      if (user) {
        setIssues(getIssues(user.role, user.id));
      }
    } catch (error) {
      console.error("Error creating issue:", error);
      toast.error("Failed to report issue");
      throw error;
    }
  };

  const handleUpdateIssue = async (id: string, updates: Partial<Issue>) => {
    try {
      updateIssue(id, updates);
      toast.success("Issue updated successfully");
      if (user) {
        setIssues(getIssues(user.role, user.id));
      }
    } catch (error) {
      console.error("Error updating issue:", error);
      toast.error("Failed to update issue");
      throw error;
    }
  };

  const handleUpdateStatus = (
    id: string,
    status: IssueStatus,
    comments?: string
  ) => {
    try {
      updateIssue(id, { status, comments });
      toast.success("Issue status updated successfully");
      setIsUpdatingStatus(false);
      // Refresh issues list
      if (user) {
        setIssues(getIssues(user.role, user.id));
      }
    } catch (error) {
      console.error("Error updating issue status:", error);
      toast.error("Failed to update issue status");
    }
  };

  const handleDeleteIssue = (id: string) => {
    try {
      deleteIssue(id);
      toast.success("Issue deleted successfully");
      setIsDeleting(false);
      setSelectedIssue(null);
      // Refresh issues list
      if (user) {
        setIssues(getIssues(user.role, user.id));
      }
    } catch (error) {
      console.error("Error deleting issue:", error);
      toast.error("Failed to delete issue");
    }
  };

  const handleDownloadPDF = (issue: Issue) => {
    try {
      const fileName = generateIssuePDF(issue);
      toast.success(`Report downloaded as ${fileName}`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF report");
    }
  };

  const getStatusBadge = (status: IssueStatus) => {
    switch (status) {
      case "submitted":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Submitted
          </Badge>
        );
      case "will-address":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Will be addressed
          </Badge>
        );
      case "addressed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Has been addressed
          </Badge>
        );
      case "will-not-address":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Will not be addressed
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Only student can submit, edit or delete issues
  const isStudent = user?.role === "student";
  // Only lecturers and admins can update issue status
  const canUpdateStatus = user?.role === "lecturer" || user?.role === "admin";

  if (!user) {
    return <div className="p-6 flex justify-center">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Issue Reports</h1>

        {/* Only students can create issues */}
        {isStudent && (
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Report Issue
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Report New Issue</DialogTitle>
              </DialogHeader>
              <IssueForm
                onSubmit={async (
                  data: Omit<Issue, "id" | "status" | "createdAt" | "updatedAt">
                ) => {
                  await handleCreateIssue(data);
                  setIsCreateDialogOpen(false);
                }}
                onCancel={() => setIsCreateDialogOpen(false)}
                user={user}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {issues.length === 0 ? (
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertTitle>No issues found</AlertTitle>
          <AlertDescription>
            {isStudent
              ? "You haven't reported any issues yet. Click 'Report Issue' to get started."
              : "There are no issue reports to review."}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {issues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              isStudent={isStudent}
              canUpdateStatus={canUpdateStatus}
              onView={() => {
                setSelectedIssue(issue);
                setIsViewing(true);
              }}
              onEdit={() => {
                setSelectedIssue(issue);
                setIsEditing(true);
              }}
              onDelete={() => {
                setSelectedIssue(issue);
                setIsDeleting(true);
              }}
              onUpdateStatus={() => {
                setSelectedIssue(issue);
                setIsUpdatingStatus(true);
              }}
              onDownload={() => handleDownloadPDF(issue)}
            />
          ))}
        </div>
      )}

      {/* View Issue Dialog */}
      <Dialog open={isViewing} onOpenChange={setIsViewing}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Issue Details</DialogTitle>
          </DialogHeader>
          {selectedIssue && (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium">{selectedIssue.title}</h3>
                {getStatusBadge(selectedIssue.status)}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Category</p>
                  <p>{selectedIssue.category}</p>
                </div>
                <div>
                  <p className="font-medium">Location</p>
                  <p>{selectedIssue.location}</p>
                </div>
                <div>
                  <p className="font-medium">Reported by</p>
                  <p>{selectedIssue.studentName}</p>
                </div>
                <div>
                  <p className="font-medium">Reported on</p>
                  <p>
                    {format(new Date(selectedIssue.createdAt), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>

              <div>
                <p className="font-medium text-sm mb-1">Description</p>
                <p className="bg-muted p-3 rounded-md text-sm">
                  {selectedIssue.description}
                </p>
              </div>

              {selectedIssue.comments && (
                <div>
                  <p className="font-medium text-sm mb-1">Comments</p>
                  <p className="bg-muted p-3 rounded-md text-sm">
                    {selectedIssue.comments}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => handleDownloadPDF(selectedIssue)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <DialogClose asChild>
                  <Button>Close</Button>
                </DialogClose>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Issue Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Issue</DialogTitle>
          </DialogHeader>
          {selectedIssue && (
            <IssueForm
              issue={selectedIssue}
              onSubmit={async (
                data: Omit<Issue, "id" | "status" | "createdAt" | "updatedAt">
              ) => {
                await handleUpdateIssue(selectedIssue.id, data);
                setIsEditing(false);
              }}
              onCancel={() => setIsEditing(false)}
              user={user}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isUpdatingStatus} onOpenChange={setIsUpdatingStatus}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Update Issue Status</DialogTitle>
          </DialogHeader>
          {selectedIssue && (
            <>
              <div className="mb-4">
                <h3 className="font-medium">{selectedIssue.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedIssue.category} | {selectedIssue.location}
                </p>
              </div>
              <IssueStatusForm
                currentStatus={selectedIssue.status}
                currentComments={selectedIssue.comments}
                onSubmit={(status, comments) =>
                  handleUpdateStatus(selectedIssue.id, status, comments)
                }
                onCancel={() => setIsUpdatingStatus(false)}
              />
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Issue Report</DialogTitle>
          </DialogHeader>
          {selectedIssue && (
            <div>
              <p className="mb-4">
                Are you sure you want to delete this issue report?
              </p>
              <div className="bg-muted p-3 rounded-md mb-6">
                <p className="font-medium">{selectedIssue.title}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedIssue.category} | Reported on{" "}
                  {format(new Date(selectedIssue.createdAt), "MMM d, yyyy")}
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteIssue(selectedIssue.id)}
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

// Issue Card Component
interface IssueCardProps {
  issue: Issue;
  isStudent: boolean;
  canUpdateStatus: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onUpdateStatus: () => void;
  onDownload: () => void;
}

const IssueCard = ({
  issue,
  isStudent,
  canUpdateStatus,
  onView,
  onEdit,
  onDelete,
  onUpdateStatus,
  onDownload,
}: IssueCardProps) => {
  const formattedDate = format(new Date(issue.createdAt), "MMM d, yyyy");
  const canEditDelete = isStudent && issue.status === "submitted";

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{issue.title}</CardTitle>
          {getStatusBadge(issue.status)}
        </div>
        <CardDescription>
          {issue.category} | {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
          {issue.description}
        </p>
        <div className="text-sm">
          <p>
            <span className="font-medium">Location:</span> {issue.location}
          </p>
          {!isStudent && (
            <p>
              <span className="font-medium">Reported by:</span>{" "}
              {issue.studentName}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={onView}>
          <FileText className="mr-1 h-3.5 w-3.5" />
          View
        </Button>

        <Button variant="outline" size="sm" onClick={onDownload}>
          <Download className="mr-1 h-3.5 w-3.5" />
          PDF
        </Button>

        {/* Students can edit or delete submitted issues */}
        {canEditDelete && (
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

        {/* Lecturers and admins can update status */}
        {canUpdateStatus && (
          <Button
            variant="outline"
            size="sm"
            className="text-green-600"
            onClick={onUpdateStatus}
          >
            <CheckCircle className="mr-1 h-3.5 w-3.5" />
            Update Status
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default IssuesPage;
