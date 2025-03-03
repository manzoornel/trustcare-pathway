
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Mock admin accounts
const adminUsers = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "manager", password: "manager123", role: "manager" },
  { username: "staff", password: "staff123", role: "staff" }
];

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple authentication check - in a real app, this would be a backend call
    const user = adminUsers.find(
      user => user.username === username && user.password === password
    );

    if (user) {
      // Set authenticated in localStorage with the user's role
      localStorage.setItem("adminAuthenticated", "true");
      localStorage.setItem("adminRole", user.role);
      localStorage.setItem("adminUsername", user.username);
      
      toast.success(`Login successful. Welcome, ${user.username}!`);
      navigate("/admin/dashboard");
    } else {
      toast.error("Invalid credentials");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please login to access the admin panel
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary/80">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              <p>Demo accounts:</p>
              <ul className="mt-1 list-disc pl-5">
                <li>Username: admin / Password: admin123</li>
                <li>Username: manager / Password: manager123</li>
                <li>Username: staff / Password: staff123</li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
