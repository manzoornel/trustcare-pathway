
// Sample authenticated users data
export const authenticatedUsers = [
  { hospitalId: "H12345", phone: "1234567890", email: "patient1@example.com", name: "John Doe", password: "password123" },
  { hospitalId: "H67890", phone: "9876543210", email: "patient2@example.com", name: "Jane Smith", password: "password456" },
];

// Function to add a new user (used during signup)
export const addUser = (newUser: {
  hospitalId: string;
  phone: string;
  email: string;
  name: string;
  password?: string;
}) => {
  // In a real application, this would make an API call to add the user to the database
  // For this demo, we'll just add it to the array
  authenticatedUsers.push({
    ...newUser,
    password: "defaultpassword", // In a real app, this would be a hashed password
  });
  return true;
};
