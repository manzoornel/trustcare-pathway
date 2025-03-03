
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginCard from "@/components/auth/LoginCard";
import { authenticatedUsers } from "@/utils/auth";

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
