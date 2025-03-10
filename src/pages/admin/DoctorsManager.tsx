import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Plus, Upload } from "lucide-react";
import { doctors } from "@/components/doctors/DoctorData";
import AddDoctorDialog from "@/components/admin/doctors/AddDoctorDialog";
import EditDoctorDialog from "@/components/admin/doctors/EditDoctorDialog";
import DeleteDoctorDialog from "@/components/admin/doctors/DeleteDoctorDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DoctorFormData } from "@/components/admin/doctors/types";

const DoctorsManager = () => {
  const [allDoctors, setAllDoctors] = useState<DoctorFormData[]>(doctors);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorFormData | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    window.localStorage.setItem('doctorsData', JSON.stringify(allDoctors));
  }, [allDoctors]);

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

  const handleImageUpload = async (doctor: DoctorFormData) => {
    setIsUploading(true);
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    
    fileInput.onchange = async (e: any) => {
      try {
        const file = e.target.files[0];
        if (!file) return;
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `doctors/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('lovable-uploads')
          .upload(filePath, file);
          
        if (uploadError) {
          throw uploadError;
        }
        
        const { data } = supabase.storage
          .from('lovable-uploads')
          .getPublicUrl(filePath);
          
        const updatedDoctor = { ...doctor, image: data.publicUrl };
        setAllDoctors((prev) =>
          prev.map((d) => (d.id === doctor.id ? updatedDoctor : d))
        );
        
        toast.success("Doctor image uploaded successfully!");
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error("Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false);
      }
    };
    
    fileInput.click();
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
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allDoctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell className="font-medium">{doctor.name}</TableCell>
                  <TableCell>{doctor.specialty}</TableCell>
                  <TableCell>{doctor.experience}</TableCell>
                  <TableCell>{doctor.featured ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-right flex justify-end space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleImageUpload(doctor)} disabled={isUploading}>
                      <Upload className="h-4 w-4" />
                    </Button>
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
