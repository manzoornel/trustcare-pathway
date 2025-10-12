import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { instance } from "../../axios";
import { ClipboardList, User, Calendar, FileText, Pill } from "lucide-react";

type Medication = {
  item_desc: string;
  notes?: string;
};

type EncounterData = {
  encounter_id: string;
  doctor_name: string;
  encounter_date_time: string;
  patient_medication: Medication[];
};

const MedicalSummaryTab = () => {
  const [medicalSummaries, setMedicalSummaries] = useState<EncounterData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVitals();
  }, []);

  const fetchVitals = async () => {
    setIsLoading(true);
    try {
      const { data } = await instance.post(
        "fetchMedicalSummary",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.code === 1) {
        const summaries = Object.values(data.data);
        setMedicalSummaries(summaries as EncounterData[]);
      } else if (
        data.code === 0 &&
        (data.status === "Invalid token payload." ||
          data.status === "Wrong token")
      ) {
        toast.error("Invalid token. Please log in again.");
        localStorage.clear();
        setMedicalSummaries([]);
        navigate("/login", { replace: true });
      } else {
        console.error("Error Fetching vitals:", data.status);
        setMedicalSummaries([]);
      }
    } catch (error) {
      console.error("Error Fetching vitals:", error);
      setMedicalSummaries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (datetimeStr: string) => {
    const date = new Date(datetimeStr);
    return date.toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="border-none shadow-sm bg-card">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-primary" />
          Medical Summary
        </CardTitle>
        <CardDescription className="text-base">
          Comprehensive overview of your past consultations and treatments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent mb-4"></div>
            <p className="text-muted-foreground">Loading medical summaries...</p>
          </div>
        ) : medicalSummaries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ClipboardList className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="font-semibold text-lg mb-2">No Medical Records</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              Your consultation history and medical summaries will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {medicalSummaries.map((summary) => (
              <div key={summary.encounter_id} className="p-5 border border-border rounded-lg bg-card hover:bg-accent/30 transition-colors">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Visit #{summary.encounter_id}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>Dr. {summary.doctor_name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(summary.encounter_date_time)}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Pill className="h-4 w-4 text-primary" />
                    <p className="text-sm font-semibold text-foreground">Prescribed Medications</p>
                  </div>
                  {summary.patient_medication && summary.patient_medication.length > 0 ? (
                    <ul className="space-y-2 ml-6">
                      {summary.patient_medication.map((med, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{med.item_desc}</p>
                            {med.notes && (
                              <p className="text-muted-foreground text-xs mt-1">{med.notes}</p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground ml-6">No medications prescribed</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicalSummaryTab;
