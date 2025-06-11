import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { instance } from "../../axios";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Eye } from "lucide-react";

type Medication = {
  id: string;
  visit_date: string;

  doctor_name: string;
  pdf_url: string;
};

const MedicationsTab = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      setIsLoading(true);
      const { data } = await instance.post(
        "fetchPatientMedications",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.code === 1) {
        setMedications(data.data || []);
      } else if (
        data.code === 0 &&
        (data.status === "Invalid token payload." ||
          data.status === "Wrong token")
      ) {
        toast.error("Invalid token. Please log in again.");
        localStorage.clear();
        navigate("/login", { replace: true });
      } else {
        console.error("Error fetching medications:", data.status);
      }
    } catch (error) {
      console.error("Error fetching medications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medication History</CardTitle>
        <CardDescription>
          Your current and past medication details
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center text-gray-500">
            Loading medications...
          </div>
        ) : medications.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No medications found.
          </div>
        ) : (
          <div className="space-y-4">
            {medications.map((med, index) => (
              <div
                key={med.id || index}
                className="flex items-center justify-between border p-3 rounded-md shadow-sm"
              >
                <div>
                  <p className="text-sm text-gray-600">Date:{med.visit_date}</p>
                  <p className="text-sm text-gray-600">
                    Doctor: {med.doctor_name}
                  </p>
                </div>

                {med.pdf_url && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSelectedPdf(med.pdf_url)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-full max-w-3xl h-[80vh]">
                      <iframe
                        src={selectedPdf}
                        title="Medication Report"
                        width="100%"
                        height="100%"
                        style={{ border: "none" }}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicationsTab;
