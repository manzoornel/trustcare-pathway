import React, { useEffect, useState } from "react";
import { instance } from "../../axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Fetchvitals = ({ setcurrentVisit }) => {
  const [visit, setvisit] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const response = await instance.post(
          "fetchPatientVisits",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Response:", response?.data?.data);

        if (
          response?.data?.code === 0 &&
          (response?.data?.status === "Invalid token payload." ||
            response?.data?.status === "Wrong token")
        ) {
          toast.error("Invalid token. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("patient_name");
          localStorage.removeItem("uhid");
          localStorage.removeItem("address");
          localStorage.removeItem("phone");
          navigate("/login", { replace: true });
          return;
        } else if (response?.data?.code === 1) {
          setvisit(response?.data?.data);
        } else {
          console.error("Error fetching visit:", response?.data?.data);
        }
      } catch (error) {
        console.error("Error fetching visit:", error);
      }
    };

    fetchVitals();
  }, []);

  return (
    <div>
      <select
        style={{
          background: "#ECECFB",
          padding: "9px",
          borderRadius: "9px",
          fontSize: "12px",
          width: "250px",
          border: "1px solid #ccc",
          outline: "none",
        }}
        name=""
        id=""
        onChange={(e) => setcurrentVisit(e.target.value)}
        onSubmit={(e) => e.preventDefault()}
      >
        <option value="">--------------------------------------</option>
        {visit?.map((vital) => (
          <option key={vital?.visit_id} value={vital?.visit_id}>
            {vital?.visit_date} - {vital?.doctor_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Fetchvitals;
