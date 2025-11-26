import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { QRList } from '@/components/dashboard/qr-list';
import { Plus } from 'lucide-react';

export const metadata = {
  title: 'Dashboard - QRTrack',
  description: 'Manage your QR codes and view analytics',
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My QR Codes</h1>
          <p className="text-slate-600 mt-1">Manage and track all your QR codes</p>
        </div>
        <Link href="/dashboard/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create QR Code
          </Button>
        </Link>
      </div>

      <QRList />
    </div>
  );
}
