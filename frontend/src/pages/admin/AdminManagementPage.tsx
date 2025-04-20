import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Shield, ShieldAlert, UserCog } from 'lucide-react';
// Import the API service
import { userApi } from '@/services/api';

export default function AdminManagementPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      // Use the API service instead of direct fetch
      const data = await userApi.getAdmins();
      // Adjust based on your actual API response structure
      setAdmins(Array.isArray(data) ? data : data.admins || []);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch admin list',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      // Use the API service for updating roles
      await userApi.updateUserRole(userId, newRole);

      toast({
        title: 'Success',
        description: 'User role updated successfully',
      });

      // Refresh the admin list
      fetchAdmins();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  if (user?.role !== 'superadmin') {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>
              Only superadmins can access this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Management</h2>
        <p className="text-muted-foreground">
          Manage administrator access and permissions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Administrators</CardTitle>
          <CardDescription>
            View and manage system administrators
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-4">
              Loading administrators...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin._id}>
                    <TableCell>
                      {admin.firstName} {admin.lastName}
                    </TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {admin.role === 'superadmin' ? (
                          <ShieldAlert className="h-4 w-4 text-red-500" />
                        ) : (
                          <Shield className="h-4 w-4 text-blue-500" />
                        )}
                        {admin.role}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={admin.role}
                        onValueChange={(value) =>
                          handleRoleUpdate(admin._id, value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="superadmin">
                            Super Admin
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
