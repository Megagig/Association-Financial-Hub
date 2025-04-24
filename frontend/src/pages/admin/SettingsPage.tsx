import { useAuth } from '@/context/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { UserSettings, UserRole } from '@/types';
import { Bell, Lock, User, LogOut, CreditCard } from 'lucide-react';

import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const { user, logout, isAdmin } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Simulate loading user settings
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      setSettings(setSettings as unknown as UserSettings);
      setIsLoading(false);
    };

    if (user) {
      loadSettings();
    }
  }, [user]);

  if (isLoading || !user || !settings) {
    return <div className="text-center py-10">Loading settings...</div>;
  }

  const handleSaveNotifications = () => {
    toast({
      title: 'Notification Settings Saved',
      description: 'Your notification preferences have been updated.',
    });
  };

  const handleSavePassword = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description:
          'Your new password and confirmation password do not match.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Password Updated',
      description: 'Your password has been successfully changed.',
    });

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSavePreferences = () => {
    toast({
      title: 'Preferences Saved',
      description: 'Your application preferences have been updated.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Account Settings</h2>
        <p className="text-muted-foreground">
          Manage your account preferences and settings
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <CreditCard className="h-4 w-4 mr-2" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                View and update your basic profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={user.email} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input
                    value={
                      user.role === UserRole.ADMIN ? 'Administrator' : 'Member'
                    }
                    disabled
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Your role determines your access level within the system.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="membership-id">Membership ID</Label>
                  <Input
                    id="membership-id"
                    value={user.membershipId}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="member-since">Member Since</Label>
                  <Input
                    id="member-since"
                    value={
                      user.memberSince
                        ? new Date(user.memberSince).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            }
                          )
                        : 'N/A'
                    }
                    disabled
                  />
                </div>

                <Button>Save Profile</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="block">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive important notifications via email
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, emailNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="payment-reminders" className="block">
                      Payment Reminders
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Get reminders about upcoming and overdue payments
                    </p>
                  </div>
                  <Switch
                    id="payment-reminders"
                    checked={settings.paymentReminders}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, paymentReminders: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="due-reminders" className="block">
                      Due Reminders
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about upcoming dues
                    </p>
                  </div>
                  <Switch
                    id="due-reminders"
                    checked={settings.dueReminders}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, dueReminders: checked })
                    }
                  />
                </div>

                <Button onClick={handleSaveNotifications}>
                  Save Notification Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <Button onClick={handleSavePassword}>Update Password</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Sessions</CardTitle>
              <CardDescription>
                Manage your active sessions and logout
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 border rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-muted-foreground">
                        Started: {new Date().toLocaleDateString()} at{' '}
                        {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                    <Button variant="destructive" onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>

                <Button variant="outline" className="w-full" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout from All Devices
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Preferences</CardTitle>
              <CardDescription>
                Customize your application experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    defaultValue={settings.theme}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        theme: value as 'light' | 'dark' | 'system',
                      })
                    }
                  >
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System Default</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    defaultValue={settings.language}
                    onValueChange={(value) =>
                      setSettings({ ...settings, language: value })
                    }
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSavePreferences}>
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>

          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
                <CardDescription>
                  Additional settings available to administrators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-approve" className="block">
                        Auto-Approve Payments
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically approve payments under a certain threshold
                      </p>
                    </div>
                    <Switch id="auto-approve" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="approval-threshold">
                      Approval Threshold
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="approval-threshold"
                        type="number"
                        className="pl-7"
                        defaultValue="500"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Payments under this amount will be automatically approved
                      if enabled
                    </p>
                  </div>

                  <Button>Save Admin Settings</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
