import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MapPin, User, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { instance } from "../../axios";
import { useNavigate } from "react-router-dom";
import { Modal, Form, Button, Select, DatePicker, message, Spin } from "antd";
import dayjs from "dayjs";
import axios from "axios";

const { Option } = Select;

type Appointment = {
  appointment_no: string;
  patient_name: string;
  uhid: string;
  booked_at: string;
  token_no: number;
  timeslot: string;
  doctor_name: string;
  status: number;
};

type Doctor = {
  doctor_id: number;
  doctor_name: string;
  speciality: string;
  qualification: string;
};

const AppointmentsTab = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctor, setDoctor] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [slots, setSlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [sessionInfo, setSessionInfo] = useState<any>({});
  const [flag, setflag] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await instance.post(
          "fetchAppointments",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response?.status === 200 && response?.data?.code === 1) {
          setAppointments(response.data.data || []);
        } else if (
          response?.data?.code === 0 &&
          (response?.data?.status === "Invalid token payload." ||
            response?.data?.status === "Wrong token")
        ) {
          toast.error("Invalid token. Please log in again.");
          localStorage.clear();
          navigate("/login", { replace: true });
          return;
        } else {
          toast.error("Failed to fetch appointments");
        }
      } catch (error: any) {
        console.error("Fetch appointments error:", error);
        toast.error("Could not load appointments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [flag]);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await instance.post(
          "listDoctors",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response?.status === 200 && response?.data?.code === 1) {
          setDoctor(response.data.data || []);
        } else if (
          response?.data?.code === 0 &&
          (response?.data?.status === "Invalid token payload." ||
            response?.data?.status === "Wrong token")
        ) {
          toast.error("Invalid token. Please log in again.");
          localStorage.clear();
          navigate("/login", { replace: true });
          return;
        } else {
          toast.error("Failed to fetch doctors");
        }
      } catch (error: any) {
        console.error("Fetch doctor error:", error);
        toast.error("Could not load doctors");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctor();
  }, []);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDoctor || !selectedDate) return;

      setLoadingSlots(true);
      try {
        const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
        const response = await instance.post(
          "getDoctorSlots",
          {
            doctor_id: selectedDoctor,
            booking_date: selectedDate,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response?.data?.code === 1) {
          setSlots(response.data.data.Slots || []);
          setSessionInfo({
            start: dayjs(
              response.data.data.SessionStartTime,
              "HH:mm:ss"
            ).format("hh:mm A"),
            end: dayjs(response.data.data.SessionEndTime, "HH:mm:ss").format(
              "hh:mm A"
            ),
            interval: response.data.data.SlotInterval,
          });
        } else if (
          response?.data?.code === 0 &&
          (response?.data?.status === "Invalid token payload." ||
            response?.data?.status === "Wrong token")
        ) {
          toast.error("Invalid token. Please log in again.");
          localStorage.clear();
          navigate("/login", { replace: true });
          return;
        } else {
          toast.error("Failed to fetch doctors");
        }
      } catch (err) {
        console.error("Slot fetch error:", err);
        message.error("Error fetching available slots");
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDoctor, selectedDate]);

  const handleOpenModal = () => {
    form.resetFields();
    setSlots([]);
    setSelectedDoctor(null);
    setSelectedDate(null);
    setIsModalOpen(true);
  };

  const handleCreateAppointment = async (values: any) => {
    if (!selectedDoctor || !selectedDate) {
      message.error("Please select doctor and date");
      return;
    }

    const slot = slots.find((s) => s.TokenNumber === values.token_no);
    if (!slot) {
      message.error("Invalid slot selected");
      return;
    }

    const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");

    try {
      const response = await instance.post(
        `createAppointment`,
        {
          doctor_id: selectedDoctor,
          slot_date: formattedDate,
          slot_time: slot.StartTime,
          token_no: values.token_no,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response?.data?.code === 1) {
        message.success("Appointment successfully created!");
        setIsModalOpen(false);
        form.resetFields();
        setflag(!flag);
      } else if (
        response?.data?.code === 0 &&
        (response?.data?.status === "Invalid token payload." ||
          response?.data?.status === "Wrong token")
      ) {
        toast.error("Invalid token. Please log in again.");
        localStorage.clear();
        navigate("/login", { replace: true });
        return;
      } else {
        toast.error("Failed to fetch doctors");
      }
    } catch (error: any) {
      console.error("Create appointment error:", error);
      message.error("An error occurred while creating the appointment.");
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 1:
        return "Upcoming";
      case 2:
        return "Completed";
      case 3:
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const getBadgeStyle = (status: number) => {
    switch (status) {
      case 1:
        return "bg-blue-100 hover:bg-blue-100 text-blue-800";
      case 2:
        return "bg-green-100 hover:bg-green-100 text-green-800";
      case 3:
        return "bg-red-100 hover:bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Appointments
          </CardTitle>
        </div>
        <Button
          type="primary"
          onClick={handleOpenModal}
          style={{ marginLeft: "auto", marginTop: "10px" }}
          icon={<PlusCircle className="mr-2" />}
        >
          Create Appointment
        </Button>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center text-gray-500">
            Loading appointments...
          </div>
        ) : appointments.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No appointments found
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.appointment_no}
                className={`p-4 rounded-lg border ${
                  appointment.status === 1
                    ? "border-blue-100 bg-blue-50"
                    : "border-gray-100 bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">
                    Appointment #{appointment.appointment_no}
                  </h3>
                  <Badge className={getBadgeStyle(appointment.status)}>
                    {getStatusLabel(appointment.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-gray-500" />
                    <span>{appointment.timeslot}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{appointment.booked_at}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>{appointment.doctor_name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>UHID: {appointment.uhid}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Modal
        title="Create Appointment"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateAppointment}>
          <Form.Item label="Doctor" name="doctor" rules={[{ required: true }]}>
            <Select
              showSearch
              placeholder="Select doctor"
              onChange={(value) => {
                setSelectedDoctor(value);
                form.setFieldValue("doctor", value);
              }}
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  ?.toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {doctor.map((doc) => (
                <Option key={doc.doctor_id} value={doc.doctor_id}>
                  {doc.doctor_name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
              placeholder="Select date"
              onChange={(date) => setSelectedDate(date)}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
          </Form.Item>
          {sessionInfo && (
            <div className="mb-4 text-sm text-gray-600">
              {sessionInfo.start && sessionInfo.end && (
                <p>
                  <strong>Session Time:</strong> {sessionInfo.start} -{" "}
                  {sessionInfo.end}
                </p>
              )}

              {sessionInfo.interval && (
                <p>
                  <strong>Slot Interval:</strong> {sessionInfo.interval} minutes
                </p>
              )}
            </div>
          )}
          <Form.Item
            label="Token Number"
            name="token_no"
            rules={[{ required: true, message: "Please select a token" }]}
          >
            {loadingSlots ? (
              <Spin />
            ) : (
              <Select placeholder="Select available token number">
                {slots.map((slot) => (
                  <Option key={slot.TokenNumber} value={slot.TokenNumber}>
                    {`Token ${slot.TokenNumber} (${dayjs(
                      slot.StartTime,
                      "HH:mm:ss"
                    ).format("hh:mm A")} - ${dayjs(
                      slot.EndTime,
                      "HH:mm:ss"
                    ).format("hh:mm A")})`}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default AppointmentsTab;
