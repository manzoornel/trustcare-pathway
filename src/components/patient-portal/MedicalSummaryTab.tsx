
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

type MedicalSummary = {
  id: string;
  type: string;
  date: string;
  doctor: string;
  notes: string;
};

const MedicalSummaryTab = () => {
  const [medicalSummaries, setMedicalSummaries] = useState<MedicalSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useAuth();

  useEffect(() => {
    fetchMedicalSummaries();
  }, [auth.userId]);

  const fetchMedicalSummaries = async () => {
    if (!auth.userId) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('medical_summaries')
        .select('*')
        .eq('patient_id', auth.userId)
        .order('date', { ascending: false });

      if (error) throw error;

      if (data) {
        setMedicalSummaries(data as MedicalSummary[]);
      }
    } catch (error) {
      console.error("Error fetching medical summaries:", error);
      toast.error("Failed to load medical summaries");
    } finally {
      setIsLoading(false);
    }
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
              <div key={summary.id} className="p-4 border rounded-lg">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">{summary.type}</h3>
                  <span className="text-sm text-gray-500">{summary.date}</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">Doctor: {summary.doctor}</p>
                <p className="text-sm">{summary.notes}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicalSummaryTab;
