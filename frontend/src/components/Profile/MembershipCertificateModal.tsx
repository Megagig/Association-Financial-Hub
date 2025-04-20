import React, { useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Download, Printer } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

interface MembershipCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MembershipCertificateModal({
  isOpen,
  onClose,
}: MembershipCertificateModalProps) {
  const { user } = useAuth();
  const { getMemberById } = useData();
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!user) return null;
  const member = getMemberById(user.id);
  if (!member) return null;

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handlePrint = () => {
    const printContent = certificateRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;

    if (printContent) {
      document.body.innerHTML = `
        <style>
          body {
            font-family: 'Times New Roman', Times, serif;
            padding: 40px;
          }
          .certificate {
            border: 10px solid #2563eb;
            padding: 20px;
            text-align: center;
            width: 800px;
            max-width: 100%;
            margin: 0 auto;
          }
          .certificate-header {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #2563eb;
          }
          .certificate-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 30px;
          }
          .certificate-body {
            font-size: 20px;
            margin-bottom: 30px;
            line-height: 1.6;
          }
          .certificate-footer {
            margin-top: 50px;
          }
          .certificate-signature {
            border-top: 1px solid #000;
            width: 200px;
            margin: 0 auto;
            padding-top: 10px;
            font-weight: bold;
          }
        </style>
        <div class="certificate">
          ${printContent}
        </div>
      `;

      window.print();
      document.body.innerHTML = originalContent;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Membership Certificate</DialogTitle>
          <DialogDescription>
            Official alumni association membership certificate
          </DialogDescription>
        </DialogHeader>

        <div
          className="border-8 border-blue-600 p-8 bg-blue-50 dark:bg-blue-950 my-4"
          ref={certificateRef}
        >
          <div className="text-center space-y-6">
            <div>
              <h2 className="text-3xl font-serif font-bold text-blue-600">
                Alumni Association
              </h2>
              <p className="text-xl italic mt-1">Certificate of Membership</p>
            </div>

            <div className="my-8">
              <p className="text-lg">This certifies that</p>
              <h3 className="text-2xl font-bold my-4 underline decoration-wavy underline-offset-4">
                {member.name}
              </h3>
              <p className="text-lg leading-relaxed">
                is a recognized and valued member of our Alumni Association,
                having graduated from the {member.department} department in the
                year {member.graduationYear}. This membership grants all rights,
                privileges, and responsibilities associated with being an
                esteemed alumnus/alumna of our institution.
              </p>
            </div>

            <div>
              <p className="text-lg">
                Member since:{' '}
                {new Date(member.memberSince).toLocaleDateString()}
              </p>
              <p className="text-lg">Membership ID: {member.membershipId}</p>
              <p className="text-lg">Issued on: {currentDate}</p>
            </div>

            <div className="mt-12 pt-8 flex justify-around">
              <div>
                <div className="h-0.5 w-40 bg-black mx-auto"></div>
                <p className="mt-2 font-semibold">President</p>
              </div>
              <div>
                <div className="h-0.5 w-40 bg-black mx-auto"></div>
                <p className="mt-2 font-semibold">Secretary</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
