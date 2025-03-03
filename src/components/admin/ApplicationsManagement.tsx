
import { useState } from "react";
import { Application, ApplicationStatus } from "./applications/types";
import { mockApplications } from "./applications/mockData";
import ApplicationCard from "./applications/ApplicationCard";
import ApplicationDetailsDialog from "./applications/ApplicationDetailsDialog";

const ApplicationsManagement = () => {
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentApplication, setCurrentApplication] = useState<Application | null>(null);

  const handleStatusChange = (id: number, newStatus: ApplicationStatus) => {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
  };

  const handleViewApplication = (application: Application) => {
    setCurrentApplication(application);
    setIsViewDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Job Applications</h2>
      </div>

      <div className="space-y-4">
        {applications.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            onView={handleViewApplication}
          />
        ))}
      </div>

      <ApplicationDetailsDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        application={currentApplication}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default ApplicationsManagement;
