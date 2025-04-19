import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertCircle,
  User,
  FileText,
  Clock,
  BanknoteIcon,
  Receipt,
} from 'lucide-react';
import { MembershipCertificateModal } from '@/components/Profile/MembershipCertificateModal';
import { PaymentHistoryModal } from '@/components/Profile/PaymentHistoryModal';
import { LoanHistoryModal } from '@/components/Profile/LoanHistoryModal';

export default function ProfilePage() {
  const { user } = useAuth();
  const { getMemberById, isLoading } = useData();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentWorkplace: '',
    currentPosition: '',
    department: '',
    graduationYear: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal states
  const [isCertificateModalOpen, setCertificateModalOpen] = useState(false);
  const [isPaymentHistoryModalOpen, setPaymentHistoryModalOpen] =
    useState(false);
  const [isLoanHistoryModalOpen, setLoanHistoryModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      const member = getMemberById(user.id);
      if (member) {
        setFormData({
          name: member.name,
          email: member.email,
          phone: member.phone,
          currentWorkplace: member.currentWorkplace,
          currentPosition: member.currentPosition,
          department: member.department,
          graduationYear: member.graduationYear,
        });
      }
    }
  }, [isLoading, user, getMemberById]);

  if (isLoading || !user) {
    return <div className="text-center py-10">Loading profile data...</div>;
  }

  const member = getMemberById(user.id);

  if (!member) {
    return (
      <div className="text-center py-10">
        <AlertCircle className="h-10 w-10 text-error mx-auto mb-4" />
        <h2 className="text-xl font-semibold">Member profile not found</h2>
        <p className="text-muted-foreground mt-2">
          Please contact an administrator for assistance.
        </p>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call to update profile
    setTimeout(() => {
      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been updated successfully.',
      });
      setIsEditing(false);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
        <p className="text-muted-foreground">
          View and manage your profile information
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Profile Information</CardTitle>
            <CardDescription>
              Your personal and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="text-2xl">
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-muted-foreground">
                  Member ID: {member.membershipId}
                </p>
                <p className="text-muted-foreground">
                  Joined: {new Date(member.memberSince).toLocaleDateString()}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Input
                    id="graduationYear"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="currentWorkplace">Current Workplace</Label>
                  <Input
                    id="currentWorkplace"
                    name="currentWorkplace"
                    value={formData.currentWorkplace}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="currentPosition">Current Position</Label>
                  <Input
                    id="currentPosition"
                    name="currentPosition"
                    value={formData.currentPosition}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {isEditing ? (
                <div className="flex space-x-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button type="button" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Membership Details</CardTitle>
              <CardDescription>
                Information about your alumni membership
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Membership ID</span>
                <span className="font-medium">{member.membershipId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-medium">
                  {new Date(member.memberSince).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Graduation Year</span>
                <span className="font-medium">{member.graduationYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Department</span>
                <span className="font-medium">{member.department}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setCertificateModalOpen(true)}
              >
                <FileText className="h-4 w-4 mr-2" />
                View Membership Certificate
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
              <CardDescription>
                Overview of your financial activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Dues Paid</span>
                <span className="font-medium">${member.totalDuesPaid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dues Owing</span>
                <span
                  className={`font-medium ${
                    member.duesOwing > 0 ? 'text-error' : 'text-success'
                  }`}
                >
                  ${member.duesOwing}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Donations</span>
                <span className="font-medium">${member.totalDonations}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Loans</span>
                <span className="font-medium">{member.activeLoans}</span>
              </div>
              {member.loanBalance > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Loan Balance</span>
                  <span className="font-medium text-warning">
                    ${member.loanBalance}
                  </span>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setPaymentHistoryModalOpen(true)}
              >
                <Receipt className="h-4 w-4 mr-2" />
                Payment History
              </Button>
              <Button
                variant="outline"
                onClick={() => setLoanHistoryModalOpen(true)}
              >
                <BanknoteIcon className="h-4 w-4 mr-2" />
                Loan History
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <MembershipCertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setCertificateModalOpen(false)}
      />

      <PaymentHistoryModal
        isOpen={isPaymentHistoryModalOpen}
        onClose={() => setPaymentHistoryModalOpen(false)}
      />

      <LoanHistoryModal
        isOpen={isLoanHistoryModalOpen}
        onClose={() => setLoanHistoryModalOpen(false)}
      />
    </div>
  );
}
