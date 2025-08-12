import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { instance } from "../../../axios";
import { useNavigate } from "react-router-dom";

interface Vital {
  name: string;
  vital_value: string;
  time_taken: string;
  remark_id: number;
  max_value?: string;
  min_value?: string;
  vital_status?: string;
}

type VitalsData = {
  [timestamp: string]: Vital[];
};

type PivotedVitals = {
  [vitalName: string]: {
    [timestamp: string]: string; // vital_value
  };
};

const VitalsReportsTab: React.FC = () => {
  const [data, setData] = useState<VitalsData>({});
  const [currentVisit, setCurrentVisit] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVitals();
  }, [currentVisit]);

  const fetchVitals = async () => {
    setLoading(true);
    try {
      const { data } = await instance.post(
        "fetchPatientVitals",
        {},
        {
          params: { visit_id: currentVisit },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (data.code === 1) {
        setData(data.data || {});
      } else if (
        data.code === 0 &&
        (data.status === "Invalid token payload." ||
          data.status === "Wrong token")
      ) {
        toast.error("Invalid token. Please log in again.");
        localStorage.clear();
        setData({});
        navigate("/login", { replace: true });
      } else {
        console.error("Error Fetching vitals:", data.status);
        setData({});
      }
    } catch (error) {
      console.error("Error Fetching vitals:", error);
    } finally {
      setLoading(false);
    }
  };

  const pivotVitals = (rawData: VitalsData): PivotedVitals => {
    const result: PivotedVitals = {};
    Object.entries(rawData).forEach(([timestamp, vitals]) => {
      vitals.forEach((vital) => {
        if (!result[vital.name]) result[vital.name] = {};
        result[vital.name][timestamp] = vital.vital_value;
      });
    });
    return result;
  };

  const pivotedData = pivotVitals(data);
  const allDates = Object.keys(data);

  return (
    <>
      <div className="overflow-x-auto rounded border mt-6">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
            <span className="ml-3 text-gray-600">Loading vitals...</span>
          </div>
        ) : (
          <>
            <table className="min-w-full text-sm text-left text-gray-700 border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Test</th>
                  {allDates.map((date) => (
                    <th
                      key={date}
                      className="px-4 py-2 border whitespace-nowrap"
                    >
                      {date.split(" ")[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(pivotedData).map(([vitalName, values]) => (
                  <tr key={vitalName}>
                    <td className="px-4 py-2 border font-medium">
                      {vitalName}
                    </td>
                    {allDates.map((date) => (
                      <td key={date} className="px-4 py-2 border text-center">
                        {values[date] == null || isNaN(Number(values[date]))
                          ? "-"
                          : values[date]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {Object.keys(pivotedData).length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No vitals found
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default VitalsReportsTab;
