
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

type Medication = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribed: string;
  doctor: string;
};

const MedicationsTab = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useAuth();

  useEffect(() => {
    fetchMedications();
  }, [auth.userId]);

  const fetchMedications = async () => {
    if (!auth.userId) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('patient_id', auth.userId)
        .order('prescribed', { ascending: false });

      if (error) throw error;

      if (data) {
        setMedications(data as Medication[]);
      }
    } catch (error) {
      console.error("Error fetching medications:", error);
      toast.error("Failed to load medications");
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
            No medications found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 border-b">Medication</th>
                  <th className="text-left p-3 border-b">Dosage</th>
                  <th className="text-left p-3 border-b">Frequency</th>
                  <th className="text-left p-3 border-b">Prescribed</th>
                  <th className="text-left p-3 border-b">Doctor</th>
                </tr>
              </thead>
              <tbody>
                {medications.map((medication) => (
                  <tr key={medication.id} className="hover:bg-gray-50">
                    <td className="p-3 border-b">{medication.name}</td>
                    <td className="p-3 border-b">{medication.dosage}</td>
                    <td className="p-3 border-b">{medication.frequency}</td>
                    <td className="p-3 border-b">{medication.prescribed}</td>
                    <td className="p-3 border-b">{medication.doctor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicationsTab;
