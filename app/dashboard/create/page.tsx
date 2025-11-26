import { CreateQRForm } from '@/components/dashboard/create-qr-form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Create QR Code - QRTrack',
  description: 'Create a new QR code with analytics',
};

export default function CreateQRPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Create QR Code</h1>
          <p className="text-slate-600 mt-1">Set up your new QR code with tracking</p>
        </div>
      </div>

      <CreateQRForm />
    </div>
  );
}
