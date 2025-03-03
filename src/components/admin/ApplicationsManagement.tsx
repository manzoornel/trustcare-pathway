
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Check, X, Eye } from "lucide-react";

interface Application {
  id: number;
  name: string;
  email: string;
  phone: string;
  category: string;
  position: string;
  dateApplied: string;
  status: "new" | "reviewed" | "shortlisted" | "rejected";
  resume?: string;
  coverLetter?: string;
  education?: string;
  experience?: string;
}

const ApplicationsManagement = () => {
  // Mock data - in a real application, this would come from an API or database
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      name: "John Smith",
      email: "johnsmith@example.com",
      phone: "+91 98765 43210",
      category: "Doctors",
      position: "General Physician",
      dateApplied: "2024-04-10",
      status: "new",
      education: "MBBS from Mumbai Medical College, MD in General Medicine",
      experience: "5 years at City Hospital as Resident Doctor"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarahj@example.com",
      phone: "+91 98765 12345",
      category: "Nursing Staff",
      position: "Head Nurse",
      dateApplied: "2024-04-08",
      status: "reviewed",
      education: "BSc Nursing from Delhi Nursing College",
      experience: "8 years experience in multispecialty hospital"
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michaelb@example.com",
      phone: "+91 87654 32109",
      category: "Administrative Staff",
      position: "Office Manager",
      dateApplied: "2024-04-05",
      status: "shortlisted",
      education: "MBA in Healthcare Management",
      experience: "4 years as admin coordinator at Health Plus Clinic"
    }
  ]);

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentApplication, setCurrentApplication] = useState<Application | null>(null);

  const handleStatusChange = (id: number, newStatus: Application["status"]) => {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
  };

  const getStatusBadge = (status: Application["status"]) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-500">New</Badge>;
      case "reviewed":
        return <Badge className="bg-yellow-500">Reviewed</Badge>;
      case "shortlisted":
        return <Badge className="bg-green-500">Shortlisted</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Job Applications</h2>
      </div>

      <div className="space-y-4">
        {applications.map((application) => (
          <Card key={application.id} className="overflow-hidden">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{application.name}</h3>
                  <p className="text-gray-600">
                    {application.position} ({application.category})
                  </p>
                  <div className="flex space-x-4 text-sm text-gray-500 mt-1">
                    <span>{application.email}</span>
                    <span>{application.phone}</span>
                    <span>Applied: {application.dateApplied}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(application.status)}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setCurrentApplication(application);
                      setIsViewDialogOpen(true);
                    }}
                  >
                    <Eye className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Application Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Job Application Details</DialogTitle>
          </DialogHeader>
          {currentApplication && (
            <div className="space-y-4 py-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">{currentApplication.name}</h3>
                {getStatusBadge(currentApplication.status)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Position</p>
                  <p>{currentApplication.position}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p>{currentApplication.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{currentApplication.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{currentApplication.phone}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Education</p>
                <p className="mt-1">{currentApplication.education}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p className="mt-1">{currentApplication.experience}</p>
              </div>

              <div className="border-t pt-4 mt-4">
                <p className="font-semibold mb-2">Update Application Status</p>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={currentApplication.status === "new" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(currentApplication.id, "new")}
                  >
                    New
                  </Button>
                  <Button 
                    variant={currentApplication.status === "reviewed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(currentApplication.id, "reviewed")}
                  >
                    Reviewed
                  </Button>
                  <Button 
                    variant={currentApplication.status === "shortlisted" ? "default" : "outline"}
                    size="sm"
                    className={currentApplication.status === "shortlisted" ? "" : "text-green-600 border-green-600 hover:bg-green-50"}
                    onClick={() => handleStatusChange(currentApplication.id, "shortlisted")}
                  >
                    <Check className="h-4 w-4 mr-1" /> Shortlist
                  </Button>
                  <Button 
                    variant={currentApplication.status === "rejected" ? "default" : "outline"}
                    size="sm"
                    className={currentApplication.status === "rejected" ? "bg-red-500" : "text-red-600 border-red-600 hover:bg-red-50"}
                    onClick={() => handleStatusChange(currentApplication.id, "rejected")}
                  >
                    <X className="h-4 w-4 mr-1" /> Reject
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationsManagement;
