
// Sample authenticated users data
export const authenticatedUsers = [
  { hospitalId: "H12345", phone: "1234567890", email: "patient1@example.com", name: "John Doe", password: "password123" },
  { hospitalId: "H67890", phone: "9876543210", email: "patient2@example.com", name: "Jane Smith", password: "password456" },
  { hospitalId: "H55555", phone: "5555555555", email: "demo@example.com", name: "Demo User", password: "demo123" }
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

// Function to update an existing user's information
export const updateUser = (
  hospitalId: string,
  updatedInfo: {
    name?: string;
    phone?: string;
    email?: string;
  }
) => {
  // Find the user with the given hospitalId
  const userIndex = authenticatedUsers.findIndex(user => user.hospitalId === hospitalId);
  
  if (userIndex === -1) {
    return false;
  }
  
  // Update the user information
  authenticatedUsers[userIndex] = {
    ...authenticatedUsers[userIndex],
    ...updatedInfo
  };
  
  return true;
};
