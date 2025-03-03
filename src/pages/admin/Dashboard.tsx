
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Briefcase, Mail } from "lucide-react";
import { Helmet } from "react-helmet";

const AdminDashboard = () => {
  // Mock stats - in a real application, these would come from an API
  const stats = [
    {
      title: "Blog Posts",
      value: "24",
      icon: FileText,
      color: "bg-blue-100 text-blue-700"
    },
    {
      title: "Job Categories",
      value: "4",
      icon: Briefcase,
      color: "bg-green-100 text-green-700"
    },
    {
      title: "Open Positions",
      value: "12",
      icon: Briefcase,
      color: "bg-purple-100 text-purple-700"
    },
    {
      title: "Applications",
      value: "38",
      icon: Mail,
      color: "bg-yellow-100 text-yellow-700"
    },
  ];

  const recentApplications = [
    { name: "John Smith", position: "General Physician", date: "2024-04-10" },
    { name: "Sarah Johnson", position: "Head Nurse", date: "2024-04-08" },
    { name: "Michael Brown", position: "Office Manager", date: "2024-04-05" },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Doctor Uncle Family Clinic</title>
      </Helmet>
      <AdminLayout title="Dashboard">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApplications.map((app, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{app.name}</p>
                      <p className="text-sm text-gray-500">{app.position}</p>
                    </div>
                    <div className="text-sm text-gray-500">{app.date}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="bg-gray-50 hover:bg-gray-100 p-4 rounded flex flex-col items-center justify-center">
                  <FileText className="h-8 w-8 mb-2 text-primary" />
                  <span>Add Blog Post</span>
                </button>
                <button className="bg-gray-50 hover:bg-gray-100 p-4 rounded flex flex-col items-center justify-center">
                  <Briefcase className="h-8 w-8 mb-2 text-primary" />
                  <span>Add Job Position</span>
                </button>
                <button className="bg-gray-50 hover:bg-gray-100 p-4 rounded flex flex-col items-center justify-center">
                  <Users className="h-8 w-8 mb-2 text-primary" />
                  <span>View Applications</span>
                </button>
                <button className="bg-gray-50 hover:bg-gray-100 p-4 rounded flex flex-col items-center justify-center">
                  <Mail className="h-8 w-8 mb-2 text-primary" />
                  <span>Send Newsletter</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminDashboard;
