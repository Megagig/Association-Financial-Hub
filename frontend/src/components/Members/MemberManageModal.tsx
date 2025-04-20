import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import {
  User,
  UserCircle2,
  Ban,
  FileText,
  CircleDollarSign,
  CreditCard,
} from 'lucide-react';

interface MemberManageModalProps {
  memberId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function MemberManageModal({
  memberId,
  isOpen,
  onClose,
}: MemberManageModalProps) {
  const { members, getMemberById } = useData();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');

  const member = getMemberById(memberId);

  if (!member) {
    return null;
  }

  const [memberData, setMemberData] = useState({
    name: member.name,
    email: member.email,
    phone: member.phone,
    department: member.department,
    graduationYear: member.graduationYear,
    currentWorkplace: member.currentWorkplace,
    currentPosition: member.currentPosition,
    isActive: true,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setMemberData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setMemberData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setMemberData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSave = () => {
    // In a real application, this would save the data to the backend
    toast({
      title: 'Member Updated',
      description: `${member.name}'s information has been updated successfully.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Manage Member</DialogTitle>
          <DialogDescription>
            View and update member information
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback className="text-lg">
              <UserCircle2 className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-medium">{member.name}</h3>
            <p className="text-sm text-muted-foreground">
              Member ID: {member.membershipId}
            </p>
            <p className="text-sm text-muted-foreground">
              Joined: {new Date(member.memberSince).toLocaleDateString()}
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="loans">Loans</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={memberData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={memberData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={memberData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  name="department"
                  value={memberData.department}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="graduationYear">Graduation Year</Label>
                <Input
                  id="graduationYear"
                  name="graduationYear"
                  value={memberData.graduationYear}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentWorkplace">Current Workplace</Label>
                <Input
                  id="currentWorkplace"
                  name="currentWorkplace"
                  value={memberData.currentWorkplace}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentPosition">Current Position</Label>
                <Input
                  id="currentPosition"
                  name="currentPosition"
                  value={memberData.currentPosition}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountStatus">Account Status</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={memberData.isActive}
                    onCheckedChange={(checked) =>
                      handleSwitchChange('isActive', checked)
                    }
                  />
                  <span>{memberData.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Dues</h4>
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Paid:
                    </span>
                    <span className="font-medium">${member.totalDuesPaid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Dues Owing:
                    </span>
                    <span
                      className={`font-medium ${
                        member.duesOwing > 0 ? 'text-error' : ''
                      }`}
                    >
                      ${member.duesOwing}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View Full History
                </Button>
              </div>

              <div className="p-4 border rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Donations</h4>
                  <CircleDollarSign className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Donations:
                    </span>
                    <span className="font-medium">
                      ${member.totalDonations}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Last Donation:
                    </span>
                    <span className="font-medium">Jan 15, 2025</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View Donation History
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="financialNotes">Financial Notes</Label>
              <Textarea
                id="financialNotes"
                placeholder="Add notes about this member's financial status"
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="loans" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium">Loan History</h4>
              {member.activeLoans > 0 ? (
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">
                        Education Support Loan
                      </span>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Active
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Approved: March 10, 2025
                    </div>
                    <div className="flex justify-between text-sm mb-4">
                      <span>Amount: $2,500</span>
                      <span>Balance: ${member.loanBalance}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Payment History
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No active loans for this member.
                </p>
              )}

              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View All Loan Applications
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium">Recent Activity</h4>
              <div className="space-y-3">
                <div className="p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950 rounded">
                  <p className="font-medium">Profile Updated</p>
                  <p className="text-sm text-muted-foreground">
                    Yesterday at 2:30 PM
                  </p>
                </div>
                <div className="p-3 border-l-4 border-green-500 bg-green-50 dark:bg-green-950 rounded">
                  <p className="font-medium">Payment Received</p>
                  <p className="text-sm text-muted-foreground">
                    April 15, 2025 at 10:15 AM
                  </p>
                </div>
                <div className="p-3 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950 rounded">
                  <p className="font-medium">Loan Application Submitted</p>
                  <p className="text-sm text-muted-foreground">
                    April 10, 2025 at 3:45 PM
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminNotes">Admin Notes</Label>
                <Textarea
                  id="adminNotes"
                  placeholder="Add administrative notes about this member"
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex space-x-2 justify-between sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
