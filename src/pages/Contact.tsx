
import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Footer from "@/components/Footer";

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact Doctor Uncle Family Clinic – Get in Touch</title>
        <meta
          name="description"
          content="Find our branch locations, phone numbers, and email. Contact Doctor Uncle Family Clinic for inquiries and appointments at our Vakkad and Unniyal branches."
        />
      </Helmet>
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-20 px-4 max-w-7xl mx-auto">
          <div className="py-12">
            <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
            <p className="text-lg text-gray-600 mb-12">
              We're here to answer your questions and help you schedule appointments. 
              Feel free to reach out through any of the methods below or visit one of our branches.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                <h2 className="text-2xl font-bold mb-4">Vakkad Branch</h2>
                <p className="text-gray-600 italic mb-4">Near Aneesha Theatre</p>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Address</h3>
                      <p className="text-gray-600">Vakkad, Near Aneesha Theatre</p>
                      <a 
                        href="https://maps.app.goo.gl/APyMEnBeAxSfB5bX8"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline mt-1 inline-block"
                      >
                        View on Google Maps
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Phone Numbers</h3>
                      <p className="text-gray-600">9961 588 880</p>
                      <p className="text-gray-600">04942 087 888</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                <h2 className="text-2xl font-bold mb-4">Unniyal Branch</h2>
                <p className="text-gray-600 italic mb-4">Unniyal Junction, Tanur Road</p>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Address</h3>
                      <p className="text-gray-600">Unniyal Junction, Tanur Road</p>
                      <a 
                        href="https://maps.app.goo.gl/GqAqenygrwV5vo3cA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline mt-1 inline-block"
                      >
                        View on Google Maps
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Phone Numbers</h3>
                      <p className="text-gray-600">8089 771 640</p>
                      <p className="text-gray-600">8089 771 641</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Email</h3>
                    <p className="text-gray-600">contact@doctoruncle.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Working Hours</h3>
                    <p className="text-gray-600">Monday-Friday: 9 AM – 7 PM</p>
                    <p className="text-gray-600">Saturday: 9 AM – 5 PM</p>
                    <p className="text-gray-600">Sunday: Closed (Emergency services available)</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                      placeholder="Your email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <Textarea
                      rows={4}
                      className="w-full"
                      placeholder="Your message or inquiry"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Contact;
