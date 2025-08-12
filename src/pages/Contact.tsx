import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";
import { MapPin, Phone, Mail, Clock, MessageSquare } from "lucide-react";
import AIChatWidget from "@/components/AIChatWidget";
import { Button } from "@/components/ui/button";

const Contact = () => {
  const openWhatsApp = () => {
    window.open(`https://wa.me/919961588880`, "_blank");
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Doctor Uncle Family Clinic</title>
        <meta
          name="description"
          content="Contact Doctor Uncle Family Clinic for appointments, inquiries, or emergencies. Our friendly staff is ready to assist you."
        />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Contact Us
              </h1>
              <p className="max-w-2xl mx-auto text-xl text-gray-600">
                Our friendly team is here to help you with any questions or
                concerns.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {/* <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
                <form>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Your email"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="subject" className="block text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Subject of your message"
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your message"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div> */}

              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-semibold mb-6">
                  Contact Information
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="w-6 h-6 text-primary mr-4 mt-1" />
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p className="text-gray-600">
                        Near Malayalam University, <br />
                        Vakkad, Tirur, 676502, Kerala
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="w-6 h-6 text-primary mr-4 mt-1" />
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-gray-600">9961 588 880</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="w-6 h-6 text-primary mr-4 mt-1" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-gray-600">contact@doctoruncle.in</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-6 h-6 text-primary mr-4 mt-1" />
                    <div>
                      <h3 className="font-medium">Hours</h3>
                      <p className="text-gray-600">24/7</p>
                    </div>
                  </div>
                  <div>
                    <Button
                      onClick={openWhatsApp}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>Contact via WhatsApp</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-16">
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Our Location
              </h2>
              <div className="h-96 bg-gray-300 rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3917.691631836071!2d75.92379917458328!3d10.91266525766789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7b1e8ba770ecb%3A0x3ebc97b2c7f069ac!2sDoctor%20Uncle%20Family%20Clinic%20-%20Vakkad!5e0!3m2!1sen!2sin!4v1725356069289!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Doctor Uncle Family Clinic Location"
                ></iframe>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-6">Insurance</h2>
              <p className="max-w-3xl mx-auto text-gray-600 mb-8">
                We accept most major insurance plans. Please contact our office
                to verify whether we accept your specific insurance plan.
              </p>
              <div className="flex flex-wrap justify-center gap-8">
                <div className="w-32 h-16 bg-white rounded-md shadow-md flex items-center justify-center p-2">
                  <img
                    src="/placeholder.svg"
                    alt="Insurance 1"
                    className="max-h-full"
                  />
                </div>
                <div className="w-32 h-16 bg-white rounded-md shadow-md flex items-center justify-center p-2">
                  <img
                    src="/placeholder.svg"
                    alt="Insurance 2"
                    className="max-h-full"
                  />
                </div>
                <div className="w-32 h-16 bg-white rounded-md shadow-md flex items-center justify-center p-2">
                  <img
                    src="/placeholder.svg"
                    alt="Insurance 3"
                    className="max-h-full"
                  />
                </div>
                <div className="w-32 h-16 bg-white rounded-md shadow-md flex items-center justify-center p-2">
                  <img
                    src="/placeholder.svg"
                    alt="Insurance 4"
                    className="max-h-full"
                  />
                </div>
                <div className="w-32 h-16 bg-white rounded-md shadow-md flex items-center justify-center p-2">
                  <img
                    src="/placeholder.svg"
                    alt="Insurance 5"
                    className="max-h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
      <AIChatWidget />
    </>
  );
};

export default Contact;
