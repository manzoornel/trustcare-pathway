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
        const summaries = Object.values(data.data); // ✅ Fix object-to-array
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
    return date.toLocaleDateString("en-GB"); // DD/MM/YYYY
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical Summary</CardTitle>
        <CardDescription>
          Summary of your past visits and consultations
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center text-gray-500">
            Loading medical summaries...
          </div>
        ) : medicalSummaries.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No medical summaries found
          </div>
        ) : (
          <div className="space-y-4">
            {medicalSummaries.map((summary) => (
              <div key={summary.encounter_id} className="p-4 border rounded-lg">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">
                    Visit ID: {summary.encounter_id}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {formatDate(summary.encounter_date_time)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  Doctor: {summary.doctor_name}
                </p>
                <p className="text-sm font-semibold">Medications:</p>
                <ul className="list-disc list-inside text-sm text-gray-800">
                  {summary.patient_medication?.map((med, idx) => (
                    <li key={idx}>
                      {med.item_desc}
                      {med.notes ? ` - ${med.notes}` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicalSummaryTab;
