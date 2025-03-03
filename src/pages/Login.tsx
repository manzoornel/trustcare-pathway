
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginCard from "@/components/auth/LoginCard";

// Sample authenticated users data
const authenticatedUsers = [
  { hospitalId: "H12345", phone: "1234567890", email: "patient1@example.com", name: "John Doe", password: "password123" },
  { hospitalId: "H67890", phone: "9876543210", email: "patient2@example.com", name: "Jane Smith", password: "password456" },
];

const Login = () => {
  return (
    <>
      <Helmet>
        <title>Patient Login | Doctor Uncle Family Clinic</title>
        <meta
          name="description"
          content="Log in to access your patient portal at Doctor Uncle Family Clinic."
        />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="pt-20 px-4 max-w-md mx-auto">
          <div className="py-8">
            <h1 className="text-3xl font-bold mb-2 text-center">Patient Login</h1>
            <p className="text-gray-600 mb-8 text-center">
              Access your medical records securely
            </p>
            
            <LoginCard authenticatedUsers={authenticatedUsers} />
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default Login;
