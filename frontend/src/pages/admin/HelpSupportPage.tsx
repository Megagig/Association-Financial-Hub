import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useToast } from '@/components/ui/use-toast';
import { UserRole } from '@/types';
import {
  MessageCircle,
  HelpCircle,
  FileText,
  Mail,
  Phone,
  Send,
} from 'lucide-react';

export default function HelpSupportPage() {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [supportMessage, setSupportMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Success toast
    toast({
      title: 'Support request submitted',
      description: "We'll get back to you as soon as possible.",
    });

    setIsSubmitting(false);
    setSupportMessage('');
    setSubject('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Help & Support</h2>
        <p className="text-muted-foreground">
          Get assistance and find answers to common questions
        </p>
      </div>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="faq">
            <FileText className="h-4 w-4 mr-2" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="contact">
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Us
          </TabsTrigger>
          <TabsTrigger value="resources">
            <HelpCircle className="h-4 w-4 mr-2" />
            Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find answers to the most common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I make a payment?</AccordionTrigger>
                  <AccordionContent>
                    You can make a payment by navigating to the "My Payments"
                    section. There you can view your dues and outstanding
                    payments. Follow the instructions to make a payment, and
                    don't forget to submit your receipt for admin approval.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    How long does payment approval take?
                  </AccordionTrigger>
                  <AccordionContent>
                    Payment approvals are typically processed within 24-48 hours
                    after submission of your receipt. Once approved, your
                    payment status will be updated automatically.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    How do I apply for a loan?
                  </AccordionTrigger>
                  <AccordionContent>
                    To apply for a loan, go to the "My Loans" section and click
                    on "Apply for Loan". Fill out the application form with your
                    loan amount, purpose, and other details. You'll be notified
                    once your application has been reviewed.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    How can I update my profile information?
                  </AccordionTrigger>
                  <AccordionContent>
                    You can update your profile information by going to the
                    "Profile" page. Click on "Edit Profile" to update your
                    personal details, contact information, and professional
                    details.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>
                    What happens if I miss a due payment?
                  </AccordionTrigger>
                  <AccordionContent>
                    If you miss a due payment, it will be marked as outstanding
                    on your dashboard. Please contact the admin through the
                    support section if you need to discuss payment arrangements.
                  </AccordionContent>
                </AccordionItem>

                {isAdmin && (
                  <>
                    <AccordionItem value="item-6">
                      <AccordionTrigger>
                        How do I add new members?
                      </AccordionTrigger>
                      <AccordionContent>
                        To add new members, go to the "Members" page and click
                        the "Add Member" button. Fill out the required
                        information and submit the form. The new member will
                        receive an email with login instructions.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-7">
                      <AccordionTrigger>
                        How can I generate financial reports?
                      </AccordionTrigger>
                      <AccordionContent>
                        To generate financial reports, navigate to the "Reports"
                        page. There you can select the type of report you want
                        to generate, customize the parameters, and download the
                        report in your preferred format.
                      </AccordionContent>
                    </AccordionItem>
                  </>
                )}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Get in touch with our support team for assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitSupport} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    placeholder="Enter the subject of your inquiry"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Describe your issue or question in detail"
                    rows={5}
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t space-y-4">
                <h4 className="text-sm font-medium">Contact Information</h4>
                <div className="grid gap-4">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>support@alumniassociation.org</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resources & Guides</CardTitle>
              <CardDescription>
                Helpful resources to navigate the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <h3 className="font-medium flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    User Guide - Getting Started
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    A comprehensive guide to navigating and using the alumni
                    portal.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Download PDF
                  </Button>
                </div>

                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <h3 className="font-medium flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    Payment Process Overview
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Learn about the payment process, from making a payment to
                    getting it approved.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Download PDF
                  </Button>
                </div>

                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <h3 className="font-medium flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    Loan Application Guide
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Step-by-step instructions for applying for a loan through
                    the alumni association.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Download PDF
                  </Button>
                </div>

                {isAdmin && (
                  <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <h3 className="font-medium flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      Administrator Manual
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Detailed guide for administrators on managing members,
                      payments, and reports.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Download PDF
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
