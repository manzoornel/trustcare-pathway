
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { PlusCircle, Edit, Trash } from "lucide-react";

// Define user roles
type UserRole = "admin" | "manager" | "staff";

interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

// Mock data for users
const mockUsers: User[] = [
  { id: 1, username: "admin", email: "admin@docuncle.com", role: "admin" },
  { id: 2, username: "johnsmith", email: "john@docuncle.com", role: "manager" },
  { id: 3, username: "sarahjones", email: "sarah@docuncle.com", role: "staff" },
];

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [newUser, setNewUser] = useState<Omit<User, "id">>({
    username: "",
    email: "",
    role: "staff"
  });
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const handleAddUser = () => {
    // Validate input
    if (!newUser.username || !newUser.email) {
      toast.error("Username and email are required");
      return;
    }

    // In a real app, this would make an API call to add a user
    const user: User = {
      id: users.length + 1,
      ...newUser
    };

    setUsers([...users, user]);
    toast.success(`${newUser.username} added as ${newUser.role}`);
    
    // Reset form
    setNewUser({
      username: "",
      email: "",
      role: "staff"
    });
  };

  const handleEditUser = (user: User) => {
    setEditingUserId(user.id);
    setNewUser({
      username: user.username,
      email: user.email,
      role: user.role
    });
  };

  const handleUpdateUser = () => {
    if (editingUserId === null) return;
    
    // In a real app, this would make an API call to update the user
    const updatedUsers = users.map(user => {
      if (user.id === editingUserId) {
        return {
          ...user,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    toast.success("User updated successfully");
    
    // Reset form
    setEditingUserId(null);
    setNewUser({
      username: "",
      email: "",
      role: "staff"
    });
  };

  const handleDeleteUser = (id: number) => {
    // Don't allow deleting the admin user
    const userToDelete = users.find(user => user.id === id);
    if (userToDelete?.username === "admin") {
      toast.error("Cannot delete admin user");
      return;
    }
    
    // In a real app, this would make an API call to delete the user
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    toast.success("User deleted successfully");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">User Management</h2>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium mb-2">
          {editingUserId === null ? "Add New User" : "Edit User"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={newUser.username}
              onChange={(e) => setNewUser({...newUser, username: e.target.value})}
              placeholder="Username"
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              placeholder="user@example.com"
            />
          </div>
          
          <div>
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
            </select>
          </div>
          
          <div className="flex items-end">
            {editingUserId === null ? (
              <Button onClick={handleAddUser} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add User
              </Button>
            ) : (
              <div className="flex gap-2 w-full">
                <Button onClick={handleUpdateUser} className="flex-1">
                  Update
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditingUserId(null);
                    setNewUser({username: "", email: "", role: "staff"});
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : user.role === 'manager' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={user.username === "admin"}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManagement;
