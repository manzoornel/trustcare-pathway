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
import { Eye, Pill, CalendarDays, User } from "lucide-react";

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
    <Card className="border-none shadow-sm bg-card">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Pill className="h-6 w-6 text-primary" />
          Medication History
        </CardTitle>
        <CardDescription className="text-base">
          View your current and past medication prescriptions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent mb-4"></div>
            <p className="text-muted-foreground">Loading medications...</p>
          </div>
        ) : medications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Pill className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="font-semibold text-lg mb-2">No Medications Found</h3>
            <p className="text-muted-foreground text-sm">
              Your medication history will appear here once prescribed
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {medications.map((med, index) => (
              <div
                key={med.id || index}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium text-foreground">
                      {new Date(med.visit_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Dr. {med.doctor_name}
                    </p>
                  </div>
                </div>

                {med.pdf_url && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-4"
                        onClick={() => setSelectedPdf(med.pdf_url)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-full max-w-4xl h-[85vh] p-0">
                      <div className="h-full flex flex-col">
                        <div className="p-4 border-b bg-muted/30">
                          <h3 className="font-semibold">Medication Prescription</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(med.visit_date).toLocaleDateString()}
                          </p>
                        </div>
                        <iframe
                          src={selectedPdf}
                          title="Medication Report"
                          className="flex-1 w-full"
                          style={{ border: "none" }}
                        />
                      </div>
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
