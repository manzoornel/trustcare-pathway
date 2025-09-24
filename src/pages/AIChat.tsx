import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet";
import AIChatInterface from "@/components/AIChatInterface";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AIChat = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(-1);
    toast.info("Ai chat comming soon");
  }, []);
  return (
    <>
      <Helmet>
        <title>AI Chatbot for Healthcare | Doctor Uncle Family Clinic</title>
        <meta
          name="description"
          content="Get instant answers to health-related questions with our AI chatbot. Book appointments, check symptoms, and get medical advice online."
        />
      </Helmet>
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-20 px-4 max-w-7xl mx-auto">
          <div className="py-8">
            <h1 className="text-4xl font-bold mb-6 text-center">
              Meet Our AI-Powered Healthcare Assistant
            </h1>
            <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
              Our AI Chatbot is designed to provide instant healthcare support
              at your fingertips! Whether you need to book an appointment, ask
              about symptoms, or get first-aid tips, our chatbot is here to
              help.
            </p>

            <AIChatInterface />

            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6 text-center">
                What Can Our Chatbot Do?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="p-6 bg-white rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-4">
                    Answer Common Health Questions
                  </h3>
                  <p className="text-gray-600">
                    Get instant answers to your health-related queries
                  </p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-4">
                    Help with Appointment Booking
                  </h3>
                  <p className="text-gray-600">
                    Schedule appointments with your preferred doctor
                  </p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-4">
                    Provide Medication Reminders
                  </h3>
                  <p className="text-gray-600">
                    Never miss your medication with timely reminders
                  </p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-4">
                    Suggest Lifestyle & Diet Changes
                  </h3>
                  <p className="text-gray-600">
                    Get personalized health and lifestyle recommendations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIChat;
