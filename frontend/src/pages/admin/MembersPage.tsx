import { useState } from 'react';
import { useData } from '@/context/DataContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Search,
  Download,
  UserPlus,
  Settings,
  MoreVertical,
  User,
  Mail,
  Phone,
  Ban,
} from 'lucide-react';
import { MemberManageModal } from '@/components/Members/MemberManageModal';
import { AddMemberModal } from '@/components/Members/AddMemberModal';

export default function MembersPage() {
  const { members, isLoading } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  // States for modals
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  if (isLoading) {
    return <div className="text-center py-10">Loading members data...</div>;
  }

  // Filter members based on search query
  // const filteredMembers = members.filter(
  //   (member) =>
  //     member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     member.email.toLowerCase().includes(searchQuery.toLowerCase())
  // );
  const filteredMembers = Array.isArray(members)
    ? members.filter((member) => {
        // Add null checks for member properties
        const name = member?.name?.toLowerCase() || '';
        const email = member?.email?.toLowerCase() || '';
        const searchLower = searchQuery.toLowerCase();

        return name.includes(searchLower) || email.includes(searchLower);
      })
    : [];

  // Handle manage member
  const handleManageMember = (memberId: string) => {
    setSelectedMemberId(memberId);
    setIsManageModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Members</h2>
          <p className="text-muted-foreground">
            Manage and view all alumni association members
          </p>
        </div>
        <Button onClick={() => setIsAddMemberModalOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[300px] pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Bulk Actions
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Members Directory</CardTitle>
          <CardDescription>
            List of all alumni association members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground text-sm">
                  <th className="p-3 text-left font-medium">Member</th>
                  <th className="p-3 text-left font-medium">Contact</th>
                  <th className="p-3 text-left font-medium">Department</th>
                  <th className="p-3 text-left font-medium">Graduation</th>
                  <th className="p-3 text-left font-medium">Member Since</th>
                  <th className="p-3 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-muted/50">
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-xs text-muted-foreground">
                            ID: {member.membershipId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm flex items-center space-x-1">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{member.email}</span>
                      </div>
                      {member.phone && (
                        <div className="text-sm flex items-center space-x-1 mt-1">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3">{member.department}</td>
                    <td className="p-3">{member.graduationYear}</td>
                    <td className="p-3">
                      {new Date(member.memberSince).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleManageMember(member.id)}
                        >
                          Manage
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 ml-2"
                            >
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleManageMember(member.id)}
                            >
                              <User className="h-4 w-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Ban className="h-4 w-4 mr-2" />
                              Deactivate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredMembers.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-4 text-center text-muted-foreground"
                    >
                      No members found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Member Management Modal */}
      {selectedMemberId && (
        <MemberManageModal
          memberId={selectedMemberId}
          isOpen={isManageModalOpen}
          onClose={() => setIsManageModalOpen(false)}
        />
      )}

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
      />
    </div>
  );
}
