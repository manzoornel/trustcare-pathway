
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Plus } from "lucide-react";
import { doctors } from "@/components/doctors/DoctorData";
import AddDoctorDialog from "@/components/admin/doctors/AddDoctorDialog";
import EditDoctorDialog from "@/components/admin/doctors/EditDoctorDialog";
import DeleteDoctorDialog from "@/components/admin/doctors/DeleteDoctorDialog";
import { toast } from "sonner";

const DoctorsManager = () => {
  const [allDoctors, setAllDoctors] = useState(doctors);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  const handleAddDoctor = (newDoctor: any) => {
    setAllDoctors((prev) => [...prev, { ...newDoctor, id: `dr-${Date.now()}` }]);
    toast.success("Doctor added successfully!");
    setIsAddDialogOpen(false);
  };

  const handleEditDoctor = (updatedDoctor: any) => {
    setAllDoctors((prev) =>
      prev.map((doctor) => (doctor.id === updatedDoctor.id ? updatedDoctor : doctor))
    );
    toast.success("Doctor updated successfully!");
    setIsEditDialogOpen(false);
  };

  const handleDeleteDoctor = () => {
    if (selectedDoctor) {
      setAllDoctors((prev) => prev.filter((doctor) => doctor.id !== selectedDoctor.id));
      toast.success("Doctor deleted successfully!");
      setIsDeleteDialogOpen(false);
    }
  };

  const openEditDialog = (doctor: any) => {
    setSelectedDoctor(doctor);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (doctor: any) => {
    setSelectedDoctor(doctor);
    setIsDeleteDialogOpen(true);
  };

  return (
    <AdminLayout title="Manage Doctors" requiredRole="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">Doctors List</h2>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Doctor
          </Button>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allDoctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell className="font-medium">{doctor.name}</TableCell>
                  <TableCell>{doctor.specialty}</TableCell>
                  <TableCell>{doctor.experience}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(doctor)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(doctor)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AddDoctorDialog 
        isOpen={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)} 
        onAdd={handleAddDoctor} 
      />

      {selectedDoctor && (
        <>
          <EditDoctorDialog
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            doctor={selectedDoctor}
            onUpdate={handleEditDoctor}
          />
          
          <DeleteDoctorDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            doctor={selectedDoctor}
            onDelete={handleDeleteDoctor}
          />
        </>
      )}
    </AdminLayout>
  );
};

export default DoctorsManager;
